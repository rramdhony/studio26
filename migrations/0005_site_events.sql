CREATE TABLE IF NOT EXISTS site_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  country TEXT NOT NULL DEFAULT 'XX',
  ip_hash TEXT NOT NULL,
  page TEXT NOT NULL DEFAULT '/',
  event TEXT NOT NULL,
  target TEXT NOT NULL DEFAULT ''
);

CREATE INDEX IF NOT EXISTS idx_site_events_created_at ON site_events (created_at);
CREATE INDEX IF NOT EXISTS idx_site_events_event_time ON site_events (event, created_at);
CREATE INDEX IF NOT EXISTS idx_site_events_ip_time ON site_events (ip_hash, created_at);
