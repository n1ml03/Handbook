-- Enhanced PostgreSQL schema for DOAXVV Handbook
-- Migration 001: Enhanced schema with additional features

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For better text search

-- Characters table (base characters in the game)
CREATE TABLE IF NOT EXISTS characters (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  name_jp VARCHAR(255),
  name_en VARCHAR(255),
  name_zh VARCHAR(255),
  rarity VARCHAR(10) CHECK (rarity IN ('SSR', 'SR', 'R')) DEFAULT 'R',
  birthday DATE,
  height INTEGER CHECK (height > 0 AND height < 300),
  bust INTEGER CHECK (bust > 0 AND bust < 200),
  waist INTEGER CHECK (waist > 0 AND waist < 200),
  hip INTEGER CHECK (hip > 0 AND hip < 200),
  hobby TEXT,
  favorite_food TEXT,
  description TEXT,
  avatar_image VARCHAR(500),
  background_image VARCHAR(500),
  voice_actor VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Skills table
CREATE TABLE IF NOT EXISTS skills (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL CHECK (type IN ('offensive', 'defensive', 'support', 'special')),
  category VARCHAR(100) DEFAULT 'general',
  description TEXT,
  icon VARCHAR(255),
  max_level INTEGER DEFAULT 1 CHECK (max_level > 0 AND max_level <= 10),
  effect_type VARCHAR(100), -- 'stat_boost', 'special_effect', etc.
  effect_value DECIMAL(5,2), -- percentage or flat value
  cooldown INTEGER DEFAULT 0,
  duration INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Swimsuits table
CREATE TABLE IF NOT EXISTS swimsuits (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  character_id VARCHAR(255) NOT NULL,
  rarity VARCHAR(10) NOT NULL CHECK (rarity IN ('SSR', 'SR', 'R')),
  type VARCHAR(50) DEFAULT 'swimsuit' CHECK (type IN ('swimsuit', 'outfit', 'dress', 'casual')),
  pow INTEGER NOT NULL CHECK (pow >= 0),
  tec INTEGER NOT NULL CHECK (tec >= 0),
  stm INTEGER NOT NULL CHECK (stm >= 0),
  apl INTEGER NOT NULL CHECK (apl >= 0),
  release_date DATE NOT NULL,
  reappear_date DATE,
  image VARCHAR(500),
  thumbnail_image VARCHAR(500),
  gacha_type VARCHAR(50) DEFAULT 'standard',
  is_limited BOOLEAN DEFAULT FALSE,
  is_collab BOOLEAN DEFAULT FALSE,
  collab_series VARCHAR(255),
  trend_type VARCHAR(50), -- pow, tec, stm
  cost INTEGER DEFAULT 0,
  upgrade_cost INTEGER DEFAULT 0,
  max_level INTEGER DEFAULT 80 CHECK (max_level > 0),
  description TEXT,
  obtain_method VARCHAR(100) DEFAULT 'gacha',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE
);

-- Girls table (User's collection)
CREATE TABLE IF NOT EXISTS girls (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  character_id VARCHAR(255),
  type VARCHAR(10) NOT NULL CHECK (type IN ('pow', 'tec', 'stm')),
  level INTEGER NOT NULL CHECK (level >= 1 AND level <= 100),
  experience INTEGER DEFAULT 0 CHECK (experience >= 0),
  pow INTEGER NOT NULL CHECK (pow >= 0),
  tec INTEGER NOT NULL CHECK (tec >= 0),
  stm INTEGER NOT NULL CHECK (stm >= 0),
  apl INTEGER NOT NULL CHECK (apl >= 0),
  max_pow INTEGER NOT NULL CHECK (max_pow >= pow),
  max_tec INTEGER NOT NULL CHECK (max_tec >= tec),
  max_stm INTEGER NOT NULL CHECK (max_stm >= stm),
  max_apl INTEGER NOT NULL CHECK (max_apl >= apl),
  potential_pow INTEGER DEFAULT 0 CHECK (potential_pow >= 0),
  potential_tec INTEGER DEFAULT 0 CHECK (potential_tec >= 0),
  potential_stm INTEGER DEFAULT 0 CHECK (potential_stm >= 0),
  potential_apl INTEGER DEFAULT 0 CHECK (potential_apl >= 0),
  birthday DATE NOT NULL,
  swimsuit_id VARCHAR(255),
  is_awakened BOOLEAN DEFAULT FALSE,
  awakening_level INTEGER DEFAULT 0 CHECK (awakening_level >= 0 AND awakening_level <= 5),
  friendship_level INTEGER DEFAULT 1 CHECK (friendship_level >= 1 AND friendship_level <= 30),
  mood VARCHAR(20) DEFAULT 'normal' CHECK (mood IN ('excellent', 'good', 'normal', 'tired', 'exhausted')),
  last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (character_id) REFERENCES characters(id),
  FOREIGN KEY (swimsuit_id) REFERENCES swimsuits(id)
);

-- Accessories table
CREATE TABLE IF NOT EXISTS accessories (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('head', 'face', 'hand', 'back', 'special')),
  rarity VARCHAR(10) DEFAULT 'R' CHECK (rarity IN ('SSR', 'SR', 'R')),
  skill_id VARCHAR(255) NOT NULL,
  pow INTEGER DEFAULT 0 CHECK (pow >= 0),
  tec INTEGER DEFAULT 0 CHECK (tec >= 0),
  stm INTEGER DEFAULT 0 CHECK (stm >= 0),
  apl INTEGER DEFAULT 0 CHECK (apl >= 0),
  level INTEGER DEFAULT 1 CHECK (level >= 1 AND level <= 40),
  max_level INTEGER DEFAULT 40 CHECK (max_level >= level),
  image VARCHAR(500),
  obtain_method VARCHAR(100) DEFAULT 'shop',
  cost INTEGER DEFAULT 0,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);

-- Swimsuit Skills junction table
CREATE TABLE IF NOT EXISTS swimsuit_skills (
  swimsuit_id VARCHAR(255) NOT NULL,
  skill_id VARCHAR(255) NOT NULL,
  position INTEGER NOT NULL CHECK (position >= 1 AND position <= 4),
  skill_level INTEGER DEFAULT 1 CHECK (skill_level >= 1),
  is_awakened BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (swimsuit_id, skill_id, position),
  FOREIGN KEY (swimsuit_id) REFERENCES swimsuits(id) ON DELETE CASCADE,
  FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);

-- Girl Accessories junction table
CREATE TABLE IF NOT EXISTS girl_accessories (
  girl_id VARCHAR(255) NOT NULL,
  accessory_id VARCHAR(255) NOT NULL,
  slot VARCHAR(20) NOT NULL CHECK (slot IN ('head', 'face', 'hand')),
  equipped_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (girl_id, slot),
  UNIQUE (girl_id, accessory_id),
  FOREIGN KEY (girl_id) REFERENCES girls(id) ON DELETE CASCADE,
  FOREIGN KEY (accessory_id) REFERENCES accessories(id) ON DELETE CASCADE
);

-- Venus Boards table
CREATE TABLE IF NOT EXISTS venus_boards (
  id SERIAL PRIMARY KEY,
  girl_id VARCHAR(255) NOT NULL,
  board_type VARCHAR(50) DEFAULT 'standard' CHECK (board_type IN ('standard', 'premium', 'event')),
  pow INTEGER NOT NULL CHECK (pow >= 0),
  tec INTEGER NOT NULL CHECK (tec >= 0),
  stm INTEGER NOT NULL CHECK (stm >= 0),
  apl INTEGER NOT NULL CHECK (apl >= 0),
  nodes_unlocked INTEGER DEFAULT 0 CHECK (nodes_unlocked >= 0),
  total_nodes INTEGER DEFAULT 25 CHECK (total_nodes > 0),
  completion_percentage DECIMAL(5,2) DEFAULT 0.00 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (girl_id) REFERENCES girls(id) ON DELETE CASCADE
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('festival', 'gacha', 'ranking', 'mission', 'collab')),
  description TEXT,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  image VARCHAR(500),
  is_active BOOLEAN DEFAULT FALSE,
  rewards JSONB, -- Store reward information as JSON
  requirements JSONB, -- Store requirement information as JSON
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CHECK (end_date > start_date)
);

-- User Settings table
CREATE TABLE IF NOT EXISTS user_settings (
  key VARCHAR(255) PRIMARY KEY,
  value TEXT NOT NULL,
  data_type VARCHAR(50) DEFAULT 'string' CHECK (data_type IN ('string', 'number', 'boolean', 'json')),
  category VARCHAR(100) DEFAULT 'general',
  description TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Statistics table
CREATE TABLE IF NOT EXISTS user_statistics (
  id SERIAL PRIMARY KEY,
  stat_name VARCHAR(255) NOT NULL,
  stat_value BIGINT NOT NULL DEFAULT 0,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (stat_name)
);

-- Activity Log table for tracking user actions
CREATE TABLE IF NOT EXISTS activity_logs (
  id SERIAL PRIMARY KEY,
  action_type VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100) NOT NULL,
  entity_id VARCHAR(255) NOT NULL,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Migrations table for tracking schema changes
CREATE TABLE IF NOT EXISTS migrations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_characters_name ON characters(name);
CREATE INDEX IF NOT EXISTS idx_characters_rarity ON characters(rarity);
CREATE INDEX IF NOT EXISTS idx_swimsuits_character_id ON swimsuits(character_id);
CREATE INDEX IF NOT EXISTS idx_swimsuits_rarity ON swimsuits(rarity);
CREATE INDEX IF NOT EXISTS idx_swimsuits_release_date ON swimsuits(release_date);
CREATE INDEX IF NOT EXISTS idx_swimsuits_type ON swimsuits(type);
CREATE INDEX IF NOT EXISTS idx_girls_character_id ON girls(character_id);
CREATE INDEX IF NOT EXISTS idx_girls_swimsuit_id ON girls(swimsuit_id);
CREATE INDEX IF NOT EXISTS idx_girls_level ON girls(level);
CREATE INDEX IF NOT EXISTS idx_girls_type ON girls(type);
CREATE INDEX IF NOT EXISTS idx_accessories_skill_id ON accessories(skill_id);
CREATE INDEX IF NOT EXISTS idx_accessories_type ON accessories(type);
CREATE INDEX IF NOT EXISTS idx_accessories_rarity ON accessories(rarity);
CREATE INDEX IF NOT EXISTS idx_swimsuit_skills_swimsuit_id ON swimsuit_skills(swimsuit_id);
CREATE INDEX IF NOT EXISTS idx_swimsuit_skills_skill_id ON swimsuit_skills(skill_id);
CREATE INDEX IF NOT EXISTS idx_girl_accessories_girl_id ON girl_accessories(girl_id);
CREATE INDEX IF NOT EXISTS idx_girl_accessories_accessory_id ON girl_accessories(accessory_id);
CREATE INDEX IF NOT EXISTS idx_venus_boards_girl_id ON venus_boards(girl_id);
CREATE INDEX IF NOT EXISTS idx_events_type ON events(type);
CREATE INDEX IF NOT EXISTS idx_events_active ON events(is_active);
CREATE INDEX IF NOT EXISTS idx_events_dates ON events(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_activity_logs_timestamp ON activity_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_activity_logs_entity ON activity_logs(entity_type, entity_id);

-- Full-text search indexes
CREATE INDEX IF NOT EXISTS idx_characters_search ON characters USING gin(to_tsvector('english', name || ' ' || COALESCE(name_en, '') || ' ' || COALESCE(name_jp, '')));
CREATE INDEX IF NOT EXISTS idx_swimsuits_search ON swimsuits USING gin(to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS idx_skills_search ON skills USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));

-- Insert initial migration record
INSERT INTO migrations (name) VALUES ('001_enhanced_schema') ON CONFLICT (name) DO NOTHING;

-- Initialize user statistics
INSERT INTO user_statistics (stat_name, stat_value) VALUES 
  ('total_characters', 0),
  ('total_swimsuits', 0),
  ('total_skills', 0),
  ('total_girls', 0),
  ('total_accessories', 0),
  ('database_version', 1)
ON CONFLICT (stat_name) DO NOTHING; 