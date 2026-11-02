-- Schéma de départ pour Cloudflare D1. Pas encore connecté au prototype.
PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS buildings (
  id TEXT PRIMARY KEY, name TEXT NOT NULL UNIQUE
);
CREATE TABLE IF NOT EXISTS floors (
  id TEXT PRIMARY KEY, building_id TEXT NOT NULL REFERENCES buildings(id), name TEXT NOT NULL,
  UNIQUE(building_id, name)
);
CREATE TABLE IF NOT EXISTS offices (
  id TEXT PRIMARY KEY, floor_id TEXT NOT NULL REFERENCES floors(id), number TEXT NOT NULL,
  UNIQUE(floor_id, number)
);
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY, name TEXT NOT NULL UNIQUE
);
CREATE TABLE IF NOT EXISTS models (
  id TEXT PRIMARY KEY, category_id TEXT NOT NULL REFERENCES categories(id),
  brand TEXT NOT NULL, reference TEXT NOT NULL, label TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS equipment (
  id TEXT PRIMARY KEY, model_id TEXT NOT NULL REFERENCES models(id),
  office_id TEXT REFERENCES offices(id), created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS notices (
  id TEXT PRIMARY KEY, model_id TEXT NOT NULL REFERENCES models(id), title TEXT NOT NULL,
  published_version_id TEXT
);
CREATE TABLE IF NOT EXISTS notice_versions (
  id TEXT PRIMARY KEY, notice_id TEXT NOT NULL REFERENCES notices(id),
  version_number INTEGER NOT NULL, r2_key TEXT NOT NULL,
  author_id TEXT NOT NULL, imported_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  published_at TEXT, comment TEXT,
  UNIQUE(notice_id, version_number)
);
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE, display_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('super_admin','notices_manager'))
);
CREATE TABLE IF NOT EXISTS audit_log (
  id TEXT PRIMARY KEY, actor_id TEXT NOT NULL, action TEXT NOT NULL,
  entity_type TEXT NOT NULL, entity_id TEXT NOT NULL,
  occurred_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
