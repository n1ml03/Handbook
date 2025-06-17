-- MySQL Enhanced Schema for DOAXVV Handbook
-- This script creates the complete database schema for MySQL

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS doaxvv_handbook CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE doaxvv_handbook;

-- Characters table
CREATE TABLE IF NOT EXISTS characters (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    name_jp VARCHAR(255),
    name_en VARCHAR(255),
    name_zh VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_characters_name (name)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Skills table
CREATE TABLE IF NOT EXISTS skills (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_skills_name (name),
    INDEX idx_skills_type (type)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Swimsuits table
CREATE TABLE IF NOT EXISTS swimsuits (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    character_id VARCHAR(255) NOT NULL,
    rarity ENUM('SSR', 'SR', 'R') NOT NULL,
    pow INT NOT NULL DEFAULT 0,
    tec INT NOT NULL DEFAULT 0,
    stm INT NOT NULL DEFAULT 0,
    apl INT NOT NULL DEFAULT 0,
    release_date DATE,
    reappear_date DATE,
    image VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE,
    INDEX idx_swimsuits_character (character_id),
    INDEX idx_swimsuits_rarity (rarity),
    INDEX idx_swimsuits_release_date (release_date)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Shop Items table
CREATE TABLE IF NOT EXISTS shop_items (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type ENUM('swimsuit', 'accessory', 'decoration', 'currency', 'booster') NOT NULL,
    category VARCHAR(100) NOT NULL,
    section ENUM('owner', 'event', 'venus', 'vip') NOT NULL,
    price INT NOT NULL DEFAULT 0,
    currency ENUM('coins', 'gems', 'tickets') NOT NULL DEFAULT 'coins',
    rarity ENUM('common', 'rare', 'epic', 'legendary') NOT NULL DEFAULT 'common',
    image VARCHAR(255),
    in_stock BOOLEAN DEFAULT TRUE,
    is_new BOOLEAN DEFAULT FALSE,
    discount INT DEFAULT NULL,
    limited_time BOOLEAN DEFAULT FALSE,
    featured BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_shop_items_section (section),
    INDEX idx_shop_items_type (type),
    INDEX idx_shop_items_rarity (rarity),
    INDEX idx_shop_items_currency (currency),
    INDEX idx_shop_items_price (price),
    INDEX idx_shop_items_featured (featured),
    INDEX idx_shop_items_new (is_new)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Girls table
CREATE TABLE IF NOT EXISTS girls (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type ENUM('pow', 'tec', 'stm') NOT NULL,
    level INT NOT NULL DEFAULT 1,
    pow INT NOT NULL DEFAULT 0,
    tec INT NOT NULL DEFAULT 0,
    stm INT NOT NULL DEFAULT 0,
    apl INT NOT NULL DEFAULT 0,
    max_pow INT NOT NULL DEFAULT 0,
    max_tec INT NOT NULL DEFAULT 0,
    max_stm INT NOT NULL DEFAULT 0,
    max_apl INT NOT NULL DEFAULT 0,
    birthday DATE,
    swimsuit_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Accessories table
CREATE TABLE IF NOT EXISTS accessories (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type ENUM('head', 'face', 'hand') NOT NULL,
    skill_id VARCHAR(255) NOT NULL,
    pow INT DEFAULT 0,
    tec INT DEFAULT 0,
    stm INT DEFAULT 0,
    apl INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Venus Boards table
CREATE TABLE IF NOT EXISTS venus_boards (
    id INT PRIMARY KEY AUTO_INCREMENT,
    girl_id VARCHAR(255) NOT NULL,
    pow INT NOT NULL DEFAULT 0,
    tec INT NOT NULL DEFAULT 0,
    stm INT NOT NULL DEFAULT 0,
    apl INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Girl-Skill relationship table
CREATE TABLE IF NOT EXISTS girl_skills (
    girl_id VARCHAR(255) NOT NULL,
    skill_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (girl_id, skill_id)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Girl-Swimsuit relationship table
CREATE TABLE IF NOT EXISTS girl_swimsuits (
    girl_id VARCHAR(255) NOT NULL,
    swimsuit_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (girl_id, swimsuit_id)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Accessory-Girl relationship table
CREATE TABLE IF NOT EXISTS accessory_girls (
    accessory_id VARCHAR(255) NOT NULL,
    girl_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (accessory_id, girl_id)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Venus Board-Girl relationship table
CREATE TABLE IF NOT EXISTS venus_board_girls (
    venus_board_id INT NOT NULL,
    girl_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (venus_board_id, girl_id)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Venus Board-Skill relationship table
CREATE TABLE IF NOT EXISTS venus_board_skills (
    venus_board_id INT NOT NULL,
    skill_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (venus_board_id, skill_id)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Passive Skills table
CREATE TABLE IF NOT EXISTS passive_skills (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    effect_type VARCHAR(100),
    effect_value DECIMAL(10,2),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_passive_skills_name (name),
    INDEX idx_passive_skills_type (effect_type)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Swimsuit Skills junction table
CREATE TABLE IF NOT EXISTS swimsuit_skills (
    swimsuit_id VARCHAR(255) NOT NULL,
    skill_id VARCHAR(255) NOT NULL,
    skill_level INT DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (swimsuit_id, skill_id)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Girl Accessories junction table
CREATE TABLE IF NOT EXISTS girl_accessories (
    girl_id VARCHAR(255) NOT NULL,
    accessory_id VARCHAR(255) NOT NULL,
    equipped_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (girl_id, accessory_id)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- User Settings table
CREATE TABLE IF NOT EXISTS user_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(255) NOT NULL UNIQUE,
    setting_value TEXT,
    data_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    category VARCHAR(100) DEFAULT 'general',
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_settings_key (setting_key),
    INDEX idx_user_settings_category (category)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- User Statistics table
CREATE TABLE IF NOT EXISTS user_statistics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    stat_name VARCHAR(255) NOT NULL UNIQUE,
    stat_value BIGINT DEFAULT 0,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_statistics_name (stat_name)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Events table
CREATE TABLE IF NOT EXISTS events (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    event_type VARCHAR(100),
    start_date DATE,
    end_date DATE,
    rewards JSON,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_events_type (event_type),
    INDEX idx_events_dates (start_date, end_date)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Memories table
CREATE TABLE IF NOT EXISTS memories (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type ENUM('photo', 'video', 'story', 'scene') NOT NULL,
    date DATE NOT NULL,
    characters JSON, -- Array of character names
    tags JSON, -- Array of tags
    thumbnail VARCHAR(255),
    favorite BOOLEAN DEFAULT FALSE,
    unlocked BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_memories_type (type),
    INDEX idx_memories_date (date),
    INDEX idx_memories_favorite (favorite),
    INDEX idx_memories_unlocked (unlocked)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    character_id VARCHAR(255),
    message_text TEXT NOT NULL,
    message_type VARCHAR(100) DEFAULT 'general',
    unlock_condition TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_messages_character (character_id),
    INDEX idx_messages_type (message_type)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Owner Room Items table
CREATE TABLE IF NOT EXISTS owner_room_items (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    description TEXT,
    unlock_condition TEXT,
    price INT DEFAULT 0,
    currency VARCHAR(50) DEFAULT 'coins',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_owner_room_items_category (category),
    INDEX idx_owner_room_items_price (price)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Monthly Battles table
CREATE TABLE IF NOT EXISTS monthly_battles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    month_year VARCHAR(7) NOT NULL, -- Format: YYYY-MM
    battle_name VARCHAR(255) NOT NULL,
    difficulty VARCHAR(50),
    rewards JSON,
    requirements TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_monthly_battles_month (month_year),
    INDEX idx_monthly_battles_difficulty (difficulty)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Level Data table
CREATE TABLE IF NOT EXISTS level_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    level_number INT NOT NULL UNIQUE,
    exp_required BIGINT NOT NULL,
    cumulative_exp BIGINT NOT NULL,
    rewards JSON,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_level_data_level (level_number),
    INDEX idx_level_data_exp (exp_required)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create indexes for better performance
CREATE INDEX idx_swimsuits_stats ON swimsuits(pow, tec, stm, apl);
CREATE INDEX idx_girls_stats ON girls(pow, tec, stm, apl);
CREATE INDEX idx_accessories_stats ON accessories(pow, tec, stm, apl);
CREATE INDEX idx_venus_boards_stats ON venus_boards(pow, tec, stm, apl);

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    content LONGTEXT NOT NULL,
    category VARCHAR(100) NOT NULL DEFAULT 'general',
    tags JSON,
    author VARCHAR(255) NOT NULL DEFAULT 'System',
    is_published BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_documents_category (category),
    INDEX idx_documents_author (author),
    INDEX idx_documents_published (is_published),
    INDEX idx_documents_created (created_at),
    FULLTEXT(title, content)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Update Logs table
CREATE TABLE IF NOT EXISTS update_logs (
    id VARCHAR(255) PRIMARY KEY,
    version VARCHAR(50) NOT NULL,
    title VARCHAR(500) NOT NULL,
    content LONGTEXT NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    tags JSON,
    is_published BOOLEAN DEFAULT TRUE,
    technical_details JSON,
    bug_fixes JSON,
    screenshots JSON,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_update_logs_version (version),
    INDEX idx_update_logs_date (date),
    INDEX idx_update_logs_published (is_published),
    FULLTEXT(title, content, description)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Insert some initial data
INSERT IGNORE INTO user_settings (setting_key, setting_value, data_type, category, description) VALUES
('app_version', '1.0.0', 'string', 'system', 'Application version'),
('theme', 'dark', 'string', 'ui', 'UI theme preference'),
('language', 'en', 'string', 'ui', 'Language preference'),
('auto_save', 'true', 'boolean', 'general', 'Auto-save user data');

INSERT IGNORE INTO user_statistics (stat_name, stat_value) VALUES
('total_characters', 0),
('total_swimsuits', 0),
('total_accessories', 0),
('total_documents', 0),
('total_update_logs', 0),
('database_version', 1);
