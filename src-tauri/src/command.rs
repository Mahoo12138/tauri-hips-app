use serde::{Deserialize, Serialize};
use serde_json::json;
use tauri_plugin_http::reqwest;
use tauri_plugin_store::StoreExt;
use crate::constants::auth::{LOGIN_BY_CODE, SEND_CODE};
use crate::constants::BASE_API_URL;



#[derive(Debug, Serialize, Deserialize)]
pub struct CommandResponse<T> {
    pub success: bool,
    pub message: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub data: Option<T>,
}


impl<T> CommandResponse<T> {
    pub fn success(data: T, message: impl Into<String>) -> Self {
        Self {
            success: true,
            message: message.into(),
            data: Some(data),
        }
    }

    pub fn error(message: impl Into<String>) -> Self {
        Self {
            success: false,
            message: message.into(),
            data: None,
        }
    }
}




#[tauri::command]
pub fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}



#[derive(Debug, Serialize, Deserialize)]
pub struct CpatchaTokenDTO {
    phone: String,
    #[serde(rename = "captchaKey")]
    captcha_key: String,
    captcha: String,
    // Add any other fields from your API response
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CpatchaLoginResponse {
    success: bool,
    #[serde(rename = "accessToken")]
    access_token: String,
    #[serde(rename = "refreshToken")]
    refresh_token: String,
    #[serde(rename = "expiresIn")]
    expires_in: u64,
    message: String,
}

#[tauri::command]
pub async fn login_by_code(payload: CpatchaTokenDTO, app_handle: tauri::AppHandle) -> CommandResponse<CpatchaLoginResponse> {
    println!("Login by code, {}", payload.captcha);
    let url = format!("{}{}", BASE_API_URL, LOGIN_BY_CODE);
    let form = reqwest::multipart::Form::new()
        .text("phone", payload.phone)
        .text("captcha", payload.captcha)
        .text("captchaKey", payload.captcha_key)
        .text("device_id", "80e39528-d0d6-3bf4-87c4-375728be0093")
        .text("source_type", "app")
        .text("user_type", "P")
        .text("grant_type", "implicit")
        .text("client_id", "client")
        .text("client_secret", "secret");

    let client = reqwest::Client::new();

    let response = match client.post(url)
        .multipart(form)
        .send()
        .await {
        Ok(resp) => resp,
        Err(e) => return CommandResponse::error(format!("Request failed: {}", e))
    };

    if response.status().is_success() {
        let login_response = match response.json::<CpatchaLoginResponse>().await {
            Ok(resp) => resp,
            Err(e) => return CommandResponse::error(format!("Failed to parse response: {}", e))
        };

        let store = match app_handle.store("user.json") {
            Ok(s) => s,
            Err(e) => return CommandResponse::error(format!("Failed to access store: {}", e))
        };

        store.set("token", json!(login_response));
        CommandResponse::success(login_response, "Login successful")
    } else {
        CommandResponse::error(format!("Login failed with status: {}", response.status()))
    }
}



#[derive(Debug, Serialize, Deserialize)]
pub struct SendCodeResponse {
    success: bool,
    #[serde(rename = "captchaKey")]
    captcha_key: String,
    message: String,
    // Add any other fields from your API response
}

#[tauri::command]
pub async fn send_code(phone: String) -> CommandResponse<SendCodeResponse> {
    let url = format!("{}{}?phone={}&internationalTelCode=%2B86", BASE_API_URL, SEND_CODE, phone);
    
    let client = reqwest::Client::new();
    
    match client.get(url).send().await {
        Ok(response) => {
            println!("Send code status: {}", response.status());
            if response.status().is_success() {
                match response.json::<SendCodeResponse>().await {
                    Ok(data) => {
                        // Log or process the response as needed
                        println!("Code sent successfully: {:?}", data);
                        CommandResponse::success(data, "Verification code sent successfully")
                    },
                    Err(e) => {
                        // Handle JSON parsing error
                        println!("Error parsing response: {:?}", e);
                        CommandResponse::error(format!("Failed to parse response: {}", e))
                    }
                }
            } else {
                CommandResponse::error(format!("Failed to send code. Status: {}", response.status()))
            }
        },
        Err(e) => {
            // Handle network or request error
            CommandResponse::error(format!("Failed to send code: {}", e))
        }
    }
}