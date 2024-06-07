mod translate;
mod auth;

use axum::{response::Html, routing::get, Router};
use axum::routing::post;
use lazy_static::lazy_static;

const PORT: u32 = 3000;
const GEMINI_MODEL: &str = "gemini-1.5-flash";

lazy_static!(
    static ref GEMINI_API_KEY: String = std::env::var("GEMINI_API_KEY").unwrap();
    static ref GOOGLE_OATH_CLIENT_ID: String = std::env::var("GOOGLE_OAUTH_CLIENT_ID").unwrap();
    static ref JWT_SECRET: String = std::env::var("JWT_SECRET").unwrap();
);

#[tokio::main]
async fn main() {
    dotenv::dotenv().ok();
    
    let app = Router::new()
        .route("/google-auth", post(auth::get_bearer_token_handler))
        .route("/translate", get(translate::translate_handler))
        .route("/", get(handler));

    let listener = tokio::net::TcpListener::bind(format!("127.0.0.1:{}", PORT))
        .await
        .unwrap();
    println!("listening on {}", listener.local_addr().unwrap());
    axum::serve(listener, app).await.unwrap();
}

async fn handler() -> Html<&'static str> {
    Html("<h1>Hello, World!</h1>")
}
