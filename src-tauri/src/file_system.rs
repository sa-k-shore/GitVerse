// use tauri::{command, Result, Window};
// use tokio;
// use tokio::sync::oneshot;
// use tauri_plugin_dialog::{Dialog, FileDialogBuilder, FilePath};
// use std::path::{Display, PathBuf};
// use serde::{Deserialize, Serialize};
// use std::fs;

// #[derive(Debug, Serialize)]
// struct FilePathPayload {
//     path: Option<String>,
// }

// #[command]
// pub async fn select_file(window: Window, display: Display) -> Result<FilePathPayload> {
//     let dialog = Dialog::new(window, display);

//     // Create the FileDialogBuilder using the Dialog instance
//     let (tx, rx) = oneshot::channel();

//     FileDialogBuilder::new(dialog)
//         .pick_file(move |file_path: Option<FilePath>| {
//             let payload = FilePathPayload {
//                 path: file_path.map(|p| p.display().to_string()),
//             };
//             let _ = tx.send(payload);
//         });

//     match rx.await {
//         Ok(payload) => Ok(payload),
//         Err(_) => Err("File selection was interrupted.".to_string()),
//     }
// }

// #[command]
// pub async fn read_file_content(file_path: String) -> Result<String> {
//     let path = PathBuf::from(file_path);
//     let content = fs::read_to_string(path)?;
//     Ok(content)
// }
