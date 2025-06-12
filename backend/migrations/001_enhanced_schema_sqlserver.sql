-- Enhanced SQL Server schema for DOAXVV Handbook
-- Migration 001: Enhanced schema with additional features

-- Characters table (base characters in the game)
CREATE TABLE characters (
  id NVARCHAR(255) PRIMARY KEY,
  name NVARCHAR(255) NOT NULL,
  name_jp NVARCHAR(255),
  name_en NVARCHAR(255),
  name_zh NVARCHAR(255),
  rarity NVARCHAR(10) CHECK (rarity IN ('SSR', 'SR', 'R')) DEFAULT 'R',
  birthday DATE,
  height INT CHECK (height > 0 AND height < 300),
  bust INT CHECK (bust > 0 AND bust < 200),
  waist INT CHECK (waist > 0 AND waist < 200),
  hip INT CHECK (hip > 0 AND hip < 200),
  hobby NVARCHAR(MAX),
  favorite_food NVARCHAR(MAX),
  description NVARCHAR(MAX),
  avatar_image NVARCHAR(500),
  background_image NVARCHAR(500),
  voice_actor NVARCHAR(255),
  created_at DATETIME2 DEFAULT GETDATE(),
  updated_at DATETIME2 DEFAULT GETDATE()
);

-- Skills table
CREATE TABLE skills (
  id NVARCHAR(255) PRIMARY KEY,
  name NVARCHAR(255) NOT NULL,
  type NVARCHAR(100) NOT NULL CHECK (type IN ('offensive', 'defensive', 'support', 'special')),
  category NVARCHAR(100) DEFAULT 'general',
  description NVARCHAR(MAX),
  icon NVARCHAR(255),
  max_level INT DEFAULT 1 CHECK (max_level > 0 AND max_level <= 10),
  effect_type NVARCHAR(100), -- 'stat_boost', 'special_effect', etc.
  effect_value DECIMAL(5,2), -- percentage or flat value
  cooldown INT DEFAULT 0,
  duration INT DEFAULT 0,
  created_at DATETIME2 DEFAULT GETDATE(),
  updated_at DATETIME2 DEFAULT GETDATE()
);

-- Swimsuits table
CREATE TABLE swimsuits (
  id NVARCHAR(255) PRIMARY KEY,
  name NVARCHAR(255) NOT NULL,
  character_id NVARCHAR(255) NOT NULL,
  rarity NVARCHAR(10) NOT NULL CHECK (rarity IN ('SSR', 'SR', 'R')),
  type NVARCHAR(50) DEFAULT 'swimsuit' CHECK (type IN ('swimsuit', 'outfit', 'dress', 'casual')),
  pow INT NOT NULL CHECK (pow >= 0),
  tec INT NOT NULL CHECK (tec >= 0),
  stm INT NOT NULL CHECK (stm >= 0),
  apl INT NOT NULL CHECK (apl >= 0),
  release_date DATE NOT NULL,
  reappear_date DATE,
  image NVARCHAR(500),
  thumbnail_image NVARCHAR(500),
  gacha_type NVARCHAR(50) DEFAULT 'standard',
  is_limited BIT DEFAULT 0,
  is_collab BIT DEFAULT 0,
  collab_series NVARCHAR(255),
  trend_type NVARCHAR(50), -- pow, tec, stm
  cost INT DEFAULT 0,
  upgrade_cost INT DEFAULT 0,
  max_level INT DEFAULT 80 CHECK (max_level > 0),
  description NVARCHAR(MAX),
  obtain_method NVARCHAR(100) DEFAULT 'gacha',
  created_at DATETIME2 DEFAULT GETDATE(),
  updated_at DATETIME2 DEFAULT GETDATE(),
  FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE
);

-- Girls table (User's collection)
CREATE TABLE girls (
  id NVARCHAR(255) PRIMARY KEY,
  name NVARCHAR(255) NOT NULL,
  character_id NVARCHAR(255),
  type NVARCHAR(10) NOT NULL CHECK (type IN ('pow', 'tec', 'stm')),
  level INT NOT NULL CHECK (level >= 1 AND level <= 100),
  experience INT DEFAULT 0 CHECK (experience >= 0),
  pow INT NOT NULL CHECK (pow >= 0),
  tec INT NOT NULL CHECK (tec >= 0),
  stm INT NOT NULL CHECK (stm >= 0),
  apl INT NOT NULL CHECK (apl >= 0),
  max_pow INT NOT NULL CHECK (max_pow >= pow),
  max_tec INT NOT NULL CHECK (max_tec >= tec),
  max_stm INT NOT NULL CHECK (max_stm >= stm),
  max_apl INT NOT NULL CHECK (max_apl >= apl),
  potential_pow INT DEFAULT 0 CHECK (potential_pow >= 0),
  potential_tec INT DEFAULT 0 CHECK (potential_tec >= 0),
  potential_stm INT DEFAULT 0 CHECK (potential_stm >= 0),
  potential_apl INT DEFAULT 0 CHECK (potential_apl >= 0),
  birthday DATE NOT NULL,
  swimsuit_id NVARCHAR(255),
  is_awakened BIT DEFAULT 0,
  awakening_level INT DEFAULT 0 CHECK (awakening_level >= 0 AND awakening_level <= 5),
  friendship_level INT DEFAULT 1 CHECK (friendship_level >= 1 AND friendship_level <= 30),
  mood NVARCHAR(20) DEFAULT 'normal' CHECK (mood IN ('excellent', 'good', 'normal', 'tired', 'exhausted')),
  last_activity DATETIME2 DEFAULT GETDATE(),
  notes NVARCHAR(MAX),
  created_at DATETIME2 DEFAULT GETDATE(),
  updated_at DATETIME2 DEFAULT GETDATE(),
  FOREIGN KEY (character_id) REFERENCES characters(id),
  FOREIGN KEY (swimsuit_id) REFERENCES swimsuits(id)
);

-- Accessories table
CREATE TABLE accessories (
  id NVARCHAR(255) PRIMARY KEY,
  name NVARCHAR(255) NOT NULL,
  type NVARCHAR(20) NOT NULL CHECK (type IN ('head', 'face', 'hand', 'back', 'special')),
  rarity NVARCHAR(10) DEFAULT 'R' CHECK (rarity IN ('SSR', 'SR', 'R')),
  skill_id NVARCHAR(255) NOT NULL,
  pow INT DEFAULT 0 CHECK (pow >= 0),
  tec INT DEFAULT 0 CHECK (tec >= 0),
  stm INT DEFAULT 0 CHECK (stm >= 0),
  apl INT DEFAULT 0 CHECK (apl >= 0),
  level INT DEFAULT 1 CHECK (level >= 1 AND level <= 40),
  max_level INT DEFAULT 40 CHECK (max_level >= level),
  image NVARCHAR(500),
  obtain_method NVARCHAR(100) DEFAULT 'shop',
  cost INT DEFAULT 0,
  description NVARCHAR(MAX),
  created_at DATETIME2 DEFAULT GETDATE(),
  updated_at DATETIME2 DEFAULT GETDATE(),
  FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);

-- Swimsuit Skills junction table
CREATE TABLE swimsuit_skills (
  swimsuit_id NVARCHAR(255) NOT NULL,
  skill_id NVARCHAR(255) NOT NULL,
  position INT NOT NULL CHECK (position >= 1 AND position <= 4),
  skill_level INT DEFAULT 1 CHECK (skill_level >= 1),
  is_awakened BIT DEFAULT 0,
  PRIMARY KEY (swimsuit_id, skill_id, position),
  FOREIGN KEY (swimsuit_id) REFERENCES swimsuits(id) ON DELETE CASCADE,
  FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);

-- Girl Accessories junction table
CREATE TABLE girl_accessories (
  girl_id NVARCHAR(255) NOT NULL,
  accessory_id NVARCHAR(255) NOT NULL,
  slot NVARCHAR(20) NOT NULL CHECK (slot IN ('head', 'face', 'hand')),
  equipped_at DATETIME2 DEFAULT GETDATE(),
  PRIMARY KEY (girl_id, slot),
  UNIQUE (girl_id, accessory_id),
  FOREIGN KEY (girl_id) REFERENCES girls(id) ON DELETE CASCADE,
  FOREIGN KEY (accessory_id) REFERENCES accessories(id) ON DELETE CASCADE
);

-- Venus Boards table
CREATE TABLE venus_boards (
  id INT IDENTITY(1,1) PRIMARY KEY,
  girl_id NVARCHAR(255) NOT NULL,
  board_type NVARCHAR(50) DEFAULT 'standard' CHECK (board_type IN ('standard', 'premium', 'event')),
  pow INT NOT NULL CHECK (pow >= 0),
  tec INT NOT NULL CHECK (tec >= 0),
  stm INT NOT NULL CHECK (stm >= 0),
  apl INT NOT NULL CHECK (apl >= 0),
  nodes_unlocked INT DEFAULT 0 CHECK (nodes_unlocked >= 0),
  total_nodes INT DEFAULT 25 CHECK (total_nodes > 0),
  completion_percentage DECIMAL(5,2) DEFAULT 0.00 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  is_completed BIT DEFAULT 0,
  created_at DATETIME2 DEFAULT GETDATE(),
  updated_at DATETIME2 DEFAULT GETDATE(),
  FOREIGN KEY (girl_id) REFERENCES girls(id) ON DELETE CASCADE
);

-- Events table
CREATE TABLE events (
  id NVARCHAR(255) PRIMARY KEY,
  name NVARCHAR(255) NOT NULL,
  type NVARCHAR(50) NOT NULL CHECK (type IN ('festival', 'gacha', 'ranking', 'mission', 'collab')),
  description NVARCHAR(MAX),
  start_date DATETIME2 NOT NULL,
  end_date DATETIME2 NOT NULL,
  image NVARCHAR(500),
  is_active BIT DEFAULT 0,
  rewards NVARCHAR(MAX), -- Store reward information as JSON
  requirements NVARCHAR(MAX), -- Store requirement information as JSON
  created_at DATETIME2 DEFAULT GETDATE(),
  updated_at DATETIME2 DEFAULT GETDATE(),
  CHECK (end_date > start_date)
);

-- User Settings table
CREATE TABLE user_settings (
  key NVARCHAR(255) PRIMARY KEY,
  value NVARCHAR(MAX) NOT NULL,
  data_type NVARCHAR(50) DEFAULT 'string' CHECK (data_type IN ('string', 'number', 'boolean', 'json')),
  category NVARCHAR(100) DEFAULT 'general',
  description NVARCHAR(MAX),
  is_public BIT DEFAULT 0,
  created_at DATETIME2 DEFAULT GETDATE(),
  updated_at DATETIME2 DEFAULT GETDATE()
);

-- User Statistics table
CREATE TABLE user_statistics (
  id INT IDENTITY(1,1) PRIMARY KEY,
  stat_name NVARCHAR(255) NOT NULL,
  stat_value BIGINT NOT NULL DEFAULT 0,
  last_updated DATETIME2 DEFAULT GETDATE(),
  UNIQUE (stat_name)
);

-- Activity Log table for tracking user actions
CREATE TABLE activity_logs (
  id INT IDENTITY(1,1) PRIMARY KEY,
  action_type NVARCHAR(100) NOT NULL,
  entity_type NVARCHAR(100) NOT NULL,
  entity_id NVARCHAR(255) NOT NULL,
  old_values NVARCHAR(MAX),
  new_values NVARCHAR(MAX),
  ip_address NVARCHAR(45),
  user_agent NVARCHAR(MAX),
  timestamp DATETIME2 DEFAULT GETDATE()
);

-- Migrations table for tracking schema changes
CREATE TABLE migrations (
  id INT IDENTITY(1,1) PRIMARY KEY,
  name NVARCHAR(255) NOT NULL UNIQUE,
  executed_at DATETIME2 DEFAULT GETDATE()
);

-- Create indexes for better performance
CREATE INDEX idx_characters_name ON characters(name);
CREATE INDEX idx_characters_rarity ON characters(rarity);
CREATE INDEX idx_swimsuits_character_id ON swimsuits(character_id);
CREATE INDEX idx_swimsuits_rarity ON swimsuits(rarity);
CREATE INDEX idx_swimsuits_release_date ON swimsuits(release_date);
CREATE INDEX idx_swimsuits_type ON swimsuits(type);
CREATE INDEX idx_girls_character_id ON girls(character_id);
CREATE INDEX idx_girls_swimsuit_id ON girls(swimsuit_id);
CREATE INDEX idx_girls_level ON girls(level);
CREATE INDEX idx_girls_type ON girls(type);
CREATE INDEX idx_accessories_skill_id ON accessories(skill_id);
CREATE INDEX idx_accessories_type ON accessories(type);
CREATE INDEX idx_accessories_rarity ON accessories(rarity);
CREATE INDEX idx_swimsuit_skills_swimsuit_id ON swimsuit_skills(swimsuit_id);
CREATE INDEX idx_swimsuit_skills_skill_id ON swimsuit_skills(skill_id);
CREATE INDEX idx_girl_accessories_girl_id ON girl_accessories(girl_id);
CREATE INDEX idx_girl_accessories_accessory_id ON girl_accessories(accessory_id);
CREATE INDEX idx_venus_boards_girl_id ON venus_boards(girl_id);
CREATE INDEX idx_events_type ON events(type);
CREATE INDEX idx_events_active ON events(is_active);
CREATE INDEX idx_events_dates ON events(start_date, end_date);
CREATE INDEX idx_activity_logs_timestamp ON activity_logs(timestamp);
CREATE INDEX idx_activity_logs_entity ON activity_logs(entity_type, entity_id);

-- Full-text search indexes (SQL Server syntax)
CREATE FULLTEXT CATALOG doaxvv_catalog AS DEFAULT;

-- Create full-text indexes for search functionality
CREATE FULLTEXT INDEX ON characters(name, name_en, name_jp) KEY INDEX PK__characte__3213E83F;
CREATE FULLTEXT INDEX ON swimsuits(name) KEY INDEX PK__swimsuit__3213E83F;
CREATE FULLTEXT INDEX ON skills(name, description) KEY INDEX PK__skills___3213E83F;

-- Insert initial migration record
INSERT INTO migrations (name) VALUES ('001_enhanced_schema_sqlserver');

-- Initialize user statistics
INSERT INTO user_statistics (stat_name, stat_value) VALUES
  ('total_characters', 0),
  ('total_swimsuits', 0),
  ('total_skills', 0),
  ('total_girls', 0),
  ('total_accessories', 0),
  ('database_version', 1);
