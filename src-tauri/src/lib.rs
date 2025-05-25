mod file_system;
mod macros;
mod terminal_ops;
mod user_data;
mod user_rest_actions;
use crate::terminal_ops::run_command;
use crate::user_rest_actions::{delete_user_data, get_users_data, save_user_data};
// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    log_format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn test_perm()->(){
    run_command(".", &(format!("echo \"{}\"" ,"application running")));
}

#[tauri::command]
fn call_git_cmd(file_path: &str, arg: &str) -> () {
    let git_command: String =  log_format!("git {}", arg);
    log_format!("{}",run_command(file_path, &git_command));
}

#[tauri::command]
fn set_for_git(user_data: user_data::UserData, file_path: &str) -> () {
    log_format!("Hello, {}! going to path", file_path);
    let t = save_user_data(user_data.clone());
    let path_command: String = log_format!("cd {}", file_path);
    let name_command: String = log_format!("git config --local user.name \"{}\"", user_data.name);
    let email_command: String =
        log_format!("git config --local user.email \"{}\"", user_data.email);
    run_command(file_path, &path_command);
    run_command(file_path, &name_command);
    run_command(file_path, &email_command);
    // log_format!("{}", run_command(file_path, "pwd"));
    // log_format!("{}", run_command(file_path, "git config --local --list"));
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            save_user_data,
            get_users_data,
            delete_user_data,
            run_command,
            set_for_git,
            test_perm,
            call_git_cmd
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
