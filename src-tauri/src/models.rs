use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Prompt {
    pub id: String,
    pub title: String,
    pub body: String,
    pub description: String,
    pub category_id: String,
    pub model: String,
    pub use_case: String,
    pub notes: String,
    pub rating: i32,
    pub favourite: bool,
    pub archived: bool,
    pub created_at: String,
    pub updated_at: String,
    pub last_used_at: Option<String>,
    pub usage_count: i32,
}

#[derive(Debug, Clone, Deserialize)]
pub struct CreatePromptInput {
    pub title: String,
    pub body: String,
    pub description: Option<String>,
    pub category_id: String,
    pub model: Option<String>,
    pub use_case: Option<String>,
    pub notes: Option<String>,
}

#[derive(Debug, Clone, Deserialize)]
pub struct UpdatePromptInput {
    pub title: Option<String>,
    pub body: Option<String>,
    pub description: Option<String>,
    pub category_id: Option<String>,
    pub model: Option<String>,
    pub use_case: Option<String>,
    pub notes: Option<String>,
    pub rating: Option<i32>,
    pub favourite: Option<bool>,
    pub archived: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Category {
    pub id: String,
    pub name: String,
    pub description: String,
    pub color: String,
    pub created_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Tag {
    pub id: String,
    pub name: String,
    pub color: String,
    pub created_at: String,
}
