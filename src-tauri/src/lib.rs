pub mod command;
pub mod utils;
pub mod constants;

// use tauri_plugin_store::StoreExt;
use crate::command::{greet, send_code, login_by_code, login_by_passwd};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_http::init())
        // .setup(|app| {
        //     let store = app.store("user.json")?;
        //     println!("store");
        //     store.clear();
        //     Ok(())
        // })
        .invoke_handler(tauri::generate_handler![greet, send_code, login_by_code, login_by_passwd])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
