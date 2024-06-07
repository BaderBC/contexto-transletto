use axum::http::StatusCode;
use axum::Json;
use axum_extra::TypedHeader;
use google_oauth::AsyncClient;
use headers::authorization::Bearer;
use hmac::digest::KeyInit;
use hmac::Hmac;
use jwt::{AlgorithmType, Header, SignWithKey, Token, VerifyWithKey};
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use sha2::Sha256;
use crate::{GOOGLE_OATH_CLIENT_ID, JWT_SECRET};

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct JwtToken {
    pub email: String,
}

#[derive(Deserialize)]
pub struct GoogleTokenDto {
    pub access_token: String,
}

pub async fn get_bearer_token_handler(Json(GoogleTokenDto { access_token }): Json<GoogleTokenDto>) -> Result<Json<Value>, (StatusCode, String)> {
    let client = AsyncClient::new(GOOGLE_OATH_CLIENT_ID.to_string());
    let payload = client.validate_access_token(access_token).await.map_err(|e| (StatusCode::UNAUTHORIZED, e.to_string()))?;
    
    let email = match payload.email {
        Some(e) => e,
        None => return Err((StatusCode::UNAUTHORIZED, "No email found in google oauth payload".to_string())),
    };
    
    let jwt_token = JwtToken { email };
    
    let jwt = match serialize_jwt(jwt_token.clone()) {
        Ok(v) => v,
        Err(e) => return Err((StatusCode::INTERNAL_SERVER_ERROR, e.to_string())),
    };
    
    Ok(Json(json!({
        "token": jwt,
        "token_payload": jwt_token,
    })))
}

pub fn serialize_jwt(val: JwtToken) -> anyhow::Result<String> {
    let key: Hmac<Sha256> = Hmac::new_from_slice(JWT_SECRET.as_bytes())?;
    let header = get_jwt_header();
    let token_str = Token::new(header, val).sign_with_key(&key)?;

    Ok(token_str.as_str().to_string())
}

pub fn deserialize_jwt(token: &str) -> anyhow::Result<JwtToken> {
    let key: Hmac<Sha256> = Hmac::new_from_slice(JWT_SECRET.as_bytes())?;

    let token: Token<Header, JwtToken, _> =
        VerifyWithKey::verify_with_key(token, &key)?;

    Ok(token.claims().clone())
}

pub fn jwt_payload_from_header(header: &TypedHeader<headers::Authorization<Bearer>>) -> anyhow::Result<JwtToken> {
    let token = header.token();
    deserialize_jwt(token)
}

fn get_jwt_header() -> Header {
    Header {
        algorithm: AlgorithmType::Hs256,
        ..Default::default()
    }
}
