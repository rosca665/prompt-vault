// Prevents additional console window on Windows in release builds
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;
mod db;
mod models;
mod utils;

use db::Database;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! From Rust!", name)
}

#[tauri::command]
async fn get_all_prompts(
    database: tauri::State<'_, Database>,
) -> Result<Vec<models::Prompt>, String> {
    database
        .get_all_prompts()
        .map_err(|e| e.to_string())
}

#[tauri::command]
async fn create_prompt(
    database: tauri::State<'_, Database>,
    prompt: models::CreatePromptInput,
) -> Result<models::Prompt, String> {
    database
        .create_prompt(prompt)
        .map_err(|e| e.to_string())
}

#[tauri::command]
async fn get_prompt(
    database: tauri::State<'_, Database>,
    id: String,
) -> Result<models::Prompt, String> {
    database.get_prompt(&id).map_err(|e| e.to_string())
}

#[tauri::command]
async fn update_prompt(
    database: tauri::State<'_, Database>,
    id: String,
    update: models::UpdatePromptInput,
) -> Result<models::Prompt, String> {
    database
        .update_prompt(&id, update)
        .map_err(|e| e.to_string())
}

#[tauri::command]
async fn delete_prompt(
    database: tauri::State<'_, Database>,
    id: String,
) -> Result<(), String> {
    database
        .delete_prompt(&id)
        .map_err(|e| e.to_string())
}

#[tauri::command]
async fn restore_prompt(
    database: tauri::State<'_, Database>,
    id: String,
) -> Result<models::Prompt, String> {
    database
        .restore_prompt(&id)
        .map_err(|e| e.to_string())
}

#[tauri::command]
async fn search_prompts(
    database: tauri::State<'_, Database>,
    query: String,
) -> Result<Vec<models::Prompt>, String> {
    database
        .search_prompts(&query)
        .map_err(|e| e.to_string())
}

#[tauri::command]
async fn track_usage(
    database: tauri::State<'_, Database>,
    prompt_id: String,
) -> Result<(), String> {
    database
        .track_usage(&prompt_id)
        .map_err(|e| e.to_string())
}

fn main() {
    let db = Database::new().expect("Failed to initialize database");

    tauri::Builder::default()
        .manage(db)
        .invoke_handler(tauri::generate_handler![
            greet,
            get_all_prompts,
            create_prompt,
            get_prompt,
            update_prompt,
            delete_prompt,
            restore_prompt,
            search_prompts,
            track_usage,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
