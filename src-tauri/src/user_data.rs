use serde::Deserialize;
use serde::Serialize;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct UserData {
    pub id: i64,
    pub name: String,
    pub email: String,
}
