use crate::user_data::UserData;
use std::fs;
use std::path::PathBuf;
use tauri::Result;

#[tauri::command]
pub fn save_user_data(userdata: UserData) -> Result<()> {
    format!("{:?}", userdata);
    Ok(())
}

#[tauri::command]
pub fn get_users_data() -> Result<Vec<UserData>> {
    let my_object_list = vec![
        UserData {
            name: "Tauri 1".to_string(),
            id: 2,
            email: "Tauri1@gmail.com".to_string(),
        },
        UserData {
            name: "Tauri 2".to_string(),
            id: 3,
            email: "Tauri2@gmail.com".to_string(),
        },
        UserData {
            name: "Tauri 3".to_string(),
            id: 1,
            email: "Tauri3@gmail.com".to_string(),
        },
    ];
    format!("{:#?}", my_object_list);
    Ok(my_object_list)
}

#[tauri::command]
pub fn delete_user_data(name: &str) -> Result<()> {
    format!("{} Deleted", name);
    Ok(())
}
