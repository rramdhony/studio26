CREATE TABLE IF NOT EXISTS ash_questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  country TEXT NOT NULL DEFAULT 'XX',
  ip_hash TEXT NOT NULL,
  page TEXT NOT NULL DEFAULT '/',
  lang TEXT NOT NULL DEFAULT 'en',
  source TEXT NOT NULL DEFAULT 'typed',
  question TEXT NOT NULL,
  matched_id TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_ash_questions_created_at ON ash_questions (created_at);
CREATE INDEX IF NOT EXISTS idx_ash_questions_ip_time ON ash_questions (ip_hash, created_at);
CREATE INDEX IF NOT EXISTS idx_ash_questions_matched_id ON ash_questions (matched_id, created_at);
