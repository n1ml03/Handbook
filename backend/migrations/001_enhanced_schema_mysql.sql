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

-- Girls table
CREATE TABLE IF NOT EXISTS girls (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    rarity ENUM('R', 'SR', 'SSR') NOT NULL,
    type VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Accessories table
CREATE TABLE IF NOT EXISTS accessories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    rarity ENUM('R', 'SR', 'SSR') NOT NULL,
    type VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Venus Boards table
CREATE TABLE IF NOT EXISTS venus_boards (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    rarity ENUM('R', 'SR', 'SSR') NOT NULL,
    type VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Girl-Skill relationship table
CREATE TABLE IF NOT EXISTS girl_skills (
    girl_id INT NOT NULL,
    skill_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (girl_id, skill_id),
    FOREIGN KEY (girl_id) REFERENCES girls(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Girl-Swimsuit relationship table
CREATE TABLE IF NOT EXISTS girl_swimsuits (
    girl_id INT NOT NULL,
    swimsuit_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (girl_id, swimsuit_id),
    FOREIGN KEY (girl_id) REFERENCES girls(id) ON DELETE CASCADE,
    FOREIGN KEY (swimsuit_id) REFERENCES swimsuits(id) ON DELETE CASCADE
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Accessory-Girl relationship table
CREATE TABLE IF NOT EXISTS accessory_girls (
    accessory_id INT NOT NULL,
    girl_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (accessory_id, girl_id),
    FOREIGN KEY (accessory_id) REFERENCES accessories(id) ON DELETE CASCADE,
    FOREIGN KEY (girl_id) REFERENCES girls(id) ON DELETE CASCADE
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Venus Board-Girl relationship table
CREATE TABLE IF NOT EXISTS venus_board_girls (
    venus_board_id INT NOT NULL,
    girl_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (venus_board_id, girl_id),
    FOREIGN KEY (venus_board_id) REFERENCES venus_boards(id) ON DELETE CASCADE,
    FOREIGN KEY (girl_id) REFERENCES girls(id) ON DELETE CASCADE
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Venus Board-Skill relationship table
CREATE TABLE IF NOT EXISTS venus_board_skills (
    venus_board_id INT NOT NULL,
    skill_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (venus_board_id, skill_id),
    FOREIGN KEY (venus_board_id) REFERENCES venus_boards(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
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
    PRIMARY KEY (swimsuit_id, skill_id),
    FOREIGN KEY (swimsuit_id) REFERENCES swimsuits(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Girl Accessories junction table
CREATE TABLE IF NOT EXISTS girl_accessories (
    girl_id VARCHAR(255) NOT NULL,
    accessory_id VARCHAR(255) NOT NULL,
    equipped_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (girl_id, accessory_id),
    FOREIGN KEY (girl_id) REFERENCES girls(id) ON DELETE CASCADE,
    FOREIGN KEY (accessory_id) REFERENCES accessories(id) ON DELETE CASCADE
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

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    character_id VARCHAR(255),
    message_text TEXT NOT NULL,
    message_type VARCHAR(100) DEFAULT 'general',
    unlock_condition TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE SET NULL,
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
('database_version', 1);
