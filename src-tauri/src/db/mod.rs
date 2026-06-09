pub mod commands;

use std::path::PathBuf;
use chrono::Utc;
use rusqlite::{Connection, Result as SqliteResult};
use uuid::Uuid;

use crate::models::{CreatePromptInput, Prompt, UpdatePromptInput};

pub struct Database {
    conn: Connection,
}

impl Database {
    pub fn new() -> SqliteResult<Self> {
        let db_path = Self::get_db_path();
        let conn = Connection::open(&db_path)?;

        // Initialize schema
        Self::init_schema(&conn)?;

        Ok(Database { conn })
    }

    fn get_db_path() -> PathBuf {
        let app_data = dirs::data_dir().unwrap_or_else(|| PathBuf::from("."));
        let vault_dir = app_data.join("PromptVault");
        let _ = std::fs::create_dir_all(&vault_dir);
        vault_dir.join("prompts.db")
    }

    fn init_schema(conn: &Connection) -> SqliteResult<()> {
        conn.execute_batch(
            r#"
CREATE TABLE IF NOT EXISTS prompts (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    description TEXT DEFAULT '',
    category_id TEXT NOT NULL,
    model TEXT DEFAULT 'gpt-4',
    use_case TEXT DEFAULT '',
    notes TEXT DEFAULT '',
    rating INTEGER DEFAULT 0,
    favourite BOOLEAN DEFAULT 0,
    archived BOOLEAN DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    last_used_at TEXT,
    usage_count INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT DEFAULT '',
    color TEXT DEFAULT '#0078d4',
    created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS tags (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    color TEXT DEFAULT '#0078d4',
    created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS prompt_tags (
    prompt_id TEXT,
    tag_id TEXT,
    PRIMARY KEY (prompt_id, tag_id),
    FOREIGN KEY (prompt_id) REFERENCES prompts(id),
    FOREIGN KEY (tag_id) REFERENCES tags(id)
);

CREATE TABLE IF NOT EXISTS prompt_versions (
    id TEXT PRIMARY KEY,
    prompt_id TEXT NOT NULL,
    version_number INTEGER NOT NULL,
    body TEXT NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (prompt_id) REFERENCES prompts(id)
);

CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_prompts_title ON prompts(title);
CREATE INDEX IF NOT EXISTS idx_prompts_category ON prompts(category_id);
CREATE INDEX IF NOT EXISTS idx_prompts_created ON prompts(created_at);
"#,
        )?;

        // Seed default categories
        Self::seed_default_categories(conn)?;

        Ok(())
    }

    fn seed_default_categories(conn: &Connection) -> SqliteResult<()> {
        let categories = vec![
            ("Codex Prompts", "For code generation and analysis"),
            ("App Development", "Mobile and web app development"),
            ("Website Design", "Web design and UX prompts"),
            ("Business", "Business strategy and planning"),
            ("Marketing", "Marketing and copywriting"),
            ("Image Generation", "Prompts for image generation models"),
            ("Writing", "Creative and technical writing"),
            ("Debugging", "Debugging and troubleshooting"),
            ("Productivity", "Productivity and workflow"),
            ("SaaS Ideas", "SaaS concept and product ideas"),
        ];

        for (name, description) in categories {
            let exists: bool = conn.query_row(
                "SELECT COUNT(*) > 0 FROM categories WHERE name = ?",
                [name],
                |row| row.get(0),
            )?;

            if !exists {
                let id = Uuid::new_v4().to_string();
                let now = Utc::now().to_rfc3339();
                conn.execute(
                    "INSERT INTO categories (id, name, description, created_at) VALUES (?, ?, ?, ?)",
                    (&id, name, description, &now),
                )?;
            }
        }

        Ok(())
    }

    pub fn get_all_prompts(&self) -> SqliteResult<Vec<Prompt>> {
        let mut stmt = self.conn.prepare(
            "SELECT id, title, body, description, category_id, model, use_case, notes, rating, favourite, archived, created_at, updated_at, last_used_at, usage_count FROM prompts WHERE archived = 0 ORDER BY created_at DESC"
        )?;

        let prompts = stmt.query_map([], |row| {
            Ok(Prompt {
                id: row.get(0)?,
                title: row.get(1)?,
                body: row.get(2)?,
                description: row.get(3)?,
                category_id: row.get(4)?,
                model: row.get(5)?,
                use_case: row.get(6)?,
                notes: row.get(7)?,
                rating: row.get(8)?,
                favourite: row.get(9)?,
                archived: row.get(10)?,
                created_at: row.get(11)?,
                updated_at: row.get(12)?,
                last_used_at: row.get(13)?,
                usage_count: row.get(14)?,
            })
        })?;

        let mut result = Vec::new();
        for prompt in prompts {
            result.push(prompt?);
        }
        Ok(result)
    }

    pub fn get_prompt(&self, id: &str) -> SqliteResult<Prompt> {
        self.conn.query_row(
            "SELECT id, title, body, description, category_id, model, use_case, notes, rating, favourite, archived, created_at, updated_at, last_used_at, usage_count FROM prompts WHERE id = ?",
            [id],
            |row| {
                Ok(Prompt {
                    id: row.get(0)?,
                    title: row.get(1)?,
                    body: row.get(2)?,
                    description: row.get(3)?,
                    category_id: row.get(4)?,
                    model: row.get(5)?,
                    use_case: row.get(6)?,
                    notes: row.get(7)?,
                    rating: row.get(8)?,
                    favourite: row.get(9)?,
                    archived: row.get(10)?,
                    created_at: row.get(11)?,
                    updated_at: row.get(12)?,
                    last_used_at: row.get(13)?,
                    usage_count: row.get(14)?,
                })
            },
        )
    }

    pub fn create_prompt(&self, input: CreatePromptInput) -> SqliteResult<Prompt> {
        let id = Uuid::new_v4().to_string();
        let now = Utc::now().to_rfc3339();

        self.conn.execute(
            "INSERT INTO prompts (id, title, body, description, category_id, model, use_case, notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            (
                &id,
                &input.title,
                &input.body,
                &input.description.unwrap_or_default(),
                &input.category_id,
                &input.model.unwrap_or_else(|| "gpt-4".to_string()),
                &input.use_case.unwrap_or_default(),
                &input.notes.unwrap_or_default(),
                &now,
                &now,
            ),
        )?;

        self.get_prompt(&id)
    }

    pub fn update_prompt(
        &self,
        id: &str,
        input: UpdatePromptInput,
    ) -> SqliteResult<Prompt> {
        let now = Utc::now().to_rfc3339();

        if let Some(title) = input.title {
            self.conn
                .execute("UPDATE prompts SET title = ?, updated_at = ? WHERE id = ?", (&title, &now, id))?;
        }
        if let Some(body) = input.body {
            self.conn
                .execute("UPDATE prompts SET body = ?, updated_at = ? WHERE id = ?", (&body, &now, id))?;
        }
        if let Some(description) = input.description {
            self.conn.execute(
                "UPDATE prompts SET description = ?, updated_at = ? WHERE id = ?",
                (&description, &now, id),
            )?
        }
        if let Some(category_id) = input.category_id {
            self.conn.execute(
                "UPDATE prompts SET category_id = ?, updated_at = ? WHERE id = ?",
                (&category_id, &now, id),
            )?
        }
        if let Some(model) = input.model {
            self.conn
                .execute("UPDATE prompts SET model = ?, updated_at = ? WHERE id = ?", (&model, &now, id))?
        }
        if let Some(use_case) = input.use_case {
            self.conn
                .execute("UPDATE prompts SET use_case = ?, updated_at = ? WHERE id = ?", (&use_case, &now, id))?
        }
        if let Some(notes) = input.notes {
            self.conn
                .execute("UPDATE prompts SET notes = ?, updated_at = ? WHERE id = ?", (&notes, &now, id))?
        }
        if let Some(rating) = input.rating {
            self.conn
                .execute("UPDATE prompts SET rating = ?, updated_at = ? WHERE id = ?", (rating, &now, id))?
        }
        if let Some(favourite) = input.favourite {
            self.conn.execute(
                "UPDATE prompts SET favourite = ?, updated_at = ? WHERE id = ?",
                (favourite, &now, id),
            )?
        }
        if let Some(archived) = input.archived {
            self.conn.execute(
                "UPDATE prompts SET archived = ?, updated_at = ? WHERE id = ?",
                (archived, &now, id),
            )?
        }

        self.get_prompt(id)
    }

    pub fn delete_prompt(&self, id: &str) -> SqliteResult<()> {
        let now = Utc::now().to_rfc3339();
        self.conn.execute(
            "UPDATE prompts SET archived = 1, updated_at = ? WHERE id = ?",
            (&now, id),
        )?;
        Ok(())
    }

    pub fn restore_prompt(&self, id: &str) -> SqliteResult<Prompt> {
        let now = Utc::now().to_rfc3339();
        self.conn.execute(
            "UPDATE prompts SET archived = 0, updated_at = ? WHERE id = ?",
            (&now, id),
        )?;
        self.get_prompt(id)
    }

    pub fn search_prompts(&self, query: &str) -> SqliteResult<Vec<Prompt>> {
        let search_term = format!("%{}%", query.to_lowercase());
        let mut stmt = self.conn.prepare(
            "SELECT id, title, body, description, category_id, model, use_case, notes, rating, favourite, archived, created_at, updated_at, last_used_at, usage_count FROM prompts WHERE archived = 0 AND (LOWER(title) LIKE ? OR LOWER(body) LIKE ? OR LOWER(notes) LIKE ?) ORDER BY created_at DESC"
        )?;

        let prompts = stmt.query_map((&search_term, &search_term, &search_term), |row| {
            Ok(Prompt {
                id: row.get(0)?,
                title: row.get(1)?,
                body: row.get(2)?,
                description: row.get(3)?,
                category_id: row.get(4)?,
                model: row.get(5)?,
                use_case: row.get(6)?,
                notes: row.get(7)?,
                rating: row.get(8)?,
                favourite: row.get(9)?,
                archived: row.get(10)?,
                created_at: row.get(11)?,
                updated_at: row.get(12)?,
                last_used_at: row.get(13)?,
                usage_count: row.get(14)?,
            })
        })?;

        let mut result = Vec::new();
        for prompt in prompts {
            result.push(prompt?);
        }
        Ok(result)
    }

    pub fn track_usage(&self, id: &str) -> SqliteResult<()> {
        let now = Utc::now().to_rfc3339();
        self.conn.execute(
            "UPDATE prompts SET last_used_at = ?, usage_count = usage_count + 1 WHERE id = ?",
            (&now, id),
        )?;
        Ok(())
    }
}
