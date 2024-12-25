pub mod command;
pub mod utils;
pub mod constants;

use crate::command::{ greet, send_code, login_by_code };

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_store::Builder::default().build())
        .invoke_handler(tauri::generate_handler![greet, send_code, login_by_code])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
