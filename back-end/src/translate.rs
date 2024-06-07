use anyhow::bail;
use axum::http::StatusCode;
use axum::Json;
use axum_extra::TypedHeader;
use headers::authorization::Bearer;
use serde::{Deserialize, Serialize};
use regex::Regex;
use serde_json::json;
use crate::auth::jwt_payload_from_header;
use crate::{GEMINI_API_KEY, GEMINI_MODEL};

const MAX_AI_TRANSLATE_ATTEMPTS: u32 = 3;

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct ContextoTranslettoSentence {
    pub left_sentence_part: String,
    pub selected_phrase: String,
    pub right_sentence_part: String,
}

pub async fn translate_handler(header: TypedHeader<headers::Authorization<Bearer>>, Json(body): Json<ContextoTranslettoSentence>) -> Result<Json<ContextoTranslettoSentence>, (StatusCode, String)> {
    // Allow only logged-in users
    jwt_payload_from_header(&header).map_err(|e| (StatusCode::UNAUTHORIZED, e.to_string()))?;

    let mut attempts = 0;
    while attempts < MAX_AI_TRANSLATE_ATTEMPTS {
        // Allow wrong parsed response only in the last attempt
        let allow_wrong_parsed_response = attempts == MAX_AI_TRANSLATE_ATTEMPTS - 1;
        
        match gemini_translate(&body, allow_wrong_parsed_response).await {
            Ok(response) => return Ok(Json(response)),
            Err(err) => {
                eprintln!("{:?}", err);
                attempts += 1
            }
        }
    }

    Err((
        StatusCode::INTERNAL_SERVER_ERROR,
        "Failed to translate sentence".to_string(),
    ))
}

async fn gemini_translate(body: &ContextoTranslettoSentence, allow_wrong_parsed_response: bool)
                          -> anyhow::Result<ContextoTranslettoSentence> {
    let prompt = generate_prompt(&body);
    let response = ask_gemini(prompt).await?;
    let response = response.trim();
    
    let split_regex = Regex::new(r"(<b>|</b>|\*\*)")?;
    let response_split: Vec<&str> = split_regex.split(&response).collect();
    
    if allow_wrong_parsed_response && (response_split.len() == 1 || response_split.len() == 2) {
        return Ok(ContextoTranslettoSentence {
            left_sentence_part: response_split[0].into(),
            selected_phrase: "".into(),
            // That's because we cannot be sure that there is a second element
            right_sentence_part: response_split.get(1).unwrap_or(&"").to_string(),
        });
    }

    if response_split.len() != 3 {
        bail!("Invalid response format (cannot properly split AI response)");
    }

    Ok(ContextoTranslettoSentence {
        left_sentence_part: response_split[0].to_string(),
        selected_phrase: response_split[1].to_string(),
        right_sentence_part: response_split[2].to_string(),
    })
}

fn generate_prompt(sentence: &ContextoTranslettoSentence) -> String {
    format!(r#"
        Translate to pl sentence: "{}<b>{}</b>{}",
        response have to contain only the translation (no quotes), place b html tag in proper place in translation
    "#, &sentence.left_sentence_part, &sentence.selected_phrase, &sentence.right_sentence_part)
}

async fn ask_gemini(question: String) -> anyhow::Result<String> {
    let url = format!("https://generativelanguage.googleapis.com/v1beta/models/{}:generateContent?key={}", GEMINI_MODEL.to_string(), GEMINI_API_KEY.to_string());

    let client = reqwest::Client::new();
    let body = json!({
        "contents": [{
            "role": "user",
            "parts": [{
                "text": question
            }]
        }]
    });

    let response = client.post(&url)
        .header("Content-Type", "application/json")
        .json(&body)
        .send()
        .await?;

    return if response.status().is_success() {
        let response_json: serde_json::Value = response.json().await?;

        gemini_response_to_text(response_json)
            .ok_or(anyhow::anyhow!("Error: failed to parse response"))
    } else {
        let response_status = response.status();
        let response_error_msg = match response.text().await {
            Ok(v) => v,
            Err(_) => bail!(format!("Error: {}", response_status)),
        };

        bail!(format!("Error: {} - {}", response_status, response_error_msg));
    };
}

fn gemini_response_to_text(response: serde_json::Value) -> Option<String> {
    let response_parts = response
        .get("candidates")?
        .get(0)?
        .get("content")?
        .get("parts")?
        .as_array()?;

    let mut generated_text = String::new();

    for part in response_parts {
        let text = part.get("text")?.as_str()?;
        generated_text.push_str(text);
    }

    Some(generated_text)
}
