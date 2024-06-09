mod translate;
mod auth;

use axum::Router;
use axum::routing::post;
use lazy_static::lazy_static;

const GEMINI_MODEL: &str = "gemini-1.5-flash";

lazy_static!(
    static ref PORT: u32 = std::env::var("PORT").unwrap_or("3000".into()).parse().unwrap();
    static ref GEMINI_API_KEY: String = std::env::var("GEMINI_API_KEY").unwrap();
    static ref GOOGLE_OATH_CLIENT_ID: String = std::env::var("GOOGLE_OAUTH_CLIENT_ID").unwrap();
    static ref JWT_SECRET: String = std::env::var("JWT_SECRET").unwrap();
);

#[tokio::main]
async fn main() {
    dotenv::dotenv().ok();
    
    let app = Router::new()
        .route("/google-auth", post(auth::get_bearer_token_handler))
        .route("/translate", post(translate::translate_handler));

    let listener = tokio::net::TcpListener::bind(format!("0.0.0.0:{}", PORT.to_string()))
        .await
        .unwrap();
    println!("listening on {}", listener.local_addr().unwrap());
    axum::serve(listener, app).await.unwrap();
}
