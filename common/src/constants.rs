use wasm_bindgen::prelude::*;

// It basically works as an implementation of wasm_bindgen namespace:
#[cfg(target_arch = "wasm32")]
#[wasm_bindgen(js_name = constants)]
pub struct Constants {}

#[cfg(target_arch = "wasm32")]
#[wasm_bindgen(js_class = constants)]
impl Constants {
    #[allow(non_snake_case)]
    #[wasm_bindgen(getter)]
    pub fn LANGUAGES_LEVELS() -> Vec<String> {
        LANGUAGES_LEVELS.iter().map(|s| s.to_string()).collect()
    }
    
    #[allow(non_snake_case)]
    #[wasm_bindgen(getter)]
    pub fn SUPPORTED_LANGUAGES() -> Vec<String> {
        SUPPORTED_LANGUAGES.iter().map(|s| s.to_string()).collect()
    }
}

pub const LANGUAGES_LEVELS: [&str; 6] = [
    "A1",
    "A2",
    "B1",
    "B2",
    "C1",
    "C2",
];

pub const SUPPORTED_LANGUAGES: [&str; 3] = [
    "pl",
    "en",
    "de",
];
