# DOAXVV Handbook - Data Structure Analysis

## Overview
This document provides a comprehensive analysis of the data structures used in the DOAXVV (Dead or Alive Xtreme Venus Vacation) Handbook application, including both database tables and frontend interfaces.

---

## Database Tables

### 1. Characters Table (`characters`)
**Primary Key:** `id`
```sql
CREATE TABLE characters (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    name_jp VARCHAR(255),
    name_en VARCHAR(255),
    name_zh VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Fields:**
- `id` - Unique character identifier (VARCHAR(255))
- `name` - Character name (VARCHAR(255), NOT NULL)
- `name_jp` - Japanese name (VARCHAR(255), Optional)
- `name_en` - English name (VARCHAR(255), Optional)
- `name_zh` - Chinese name (VARCHAR(255), Optional)
- `created_at` - Record creation timestamp (DATETIME)
- `updated_at` - Record update timestamp (DATETIME)

**Frontend Interface Fields:**
- `id` (string) - Character identifier
- `name` (string) - Character name
- `level` (number) - Character level
- `type` ('pow' | 'tec' | 'stm' | 'apl') - Character type
- `stats` (object) - Current stats {pow, tec, stm, apl}
- `maxStats` (object) - Maximum stats {pow, tec, stm, apl}
- `accessories` (array) - Equipped accessories
- `birthday` (string) - Character birthday
- `profile` (object, optional) - Detailed character profile
- `swimsuit` (object) - Current swimsuit information

---

### 2. Skills Table (`skills`)
**Primary Key:** `id`
```sql
CREATE TABLE skills (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Fields:**
- `id` - Unique skill identifier (VARCHAR(255))
- `name` - Skill name (VARCHAR(255), NOT NULL)
- `type` - Skill type (VARCHAR(100), NOT NULL)
- `description` - Skill description (TEXT, Optional)
- `icon` - Icon URL/path (VARCHAR(255), Optional)
- `created_at` - Record creation timestamp (DATETIME)
- `updated_at` - Record update timestamp (DATETIME)

**Frontend Interface Fields:**
- `id` (string) - Skill identifier
- `name` (string) - Skill name
- `type` (string) - Skill type
- `description` (string) - Skill description
- `icon` (string, optional) - Icon path
- `effects` (array, optional) - Stat modification effects

---

### 3. Swimsuits Table (`swimsuits`)
**Primary Key:** `id`
**Foreign Keys:** `character_id` → `characters(id)`
```sql
CREATE TABLE swimsuits (
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
    FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE
);
```

**Fields:**
- `id` - Unique swimsuit identifier (VARCHAR(255))
- `name` - Swimsuit name (VARCHAR(255), NOT NULL)
- `character_id` - Associated character (VARCHAR(255), Foreign Key)
- `rarity` - Rarity level (ENUM: 'SSR', 'SR', 'R')
- `pow` - Power stat (INT, DEFAULT 0)
- `tec` - Technique stat (INT, DEFAULT 0)
- `stm` - Stamina stat (INT, DEFAULT 0)
- `apl` - Appeal stat (INT, DEFAULT 0)
- `release_date` - Release date (DATE, Optional)
- `reappear_date` - Reappear date (DATE, Optional)
- `image` - Image URL/path (VARCHAR(255), Optional)
- `created_at` - Record creation timestamp (DATETIME)
- `updated_at` - Record update timestamp (DATETIME)

**Frontend Interface Fields:**
- `id` (string) - Swimsuit identifier
- `name` (string) - Swimsuit name
- `character` (string) - Character name
- `rarity` ('N' | 'R' | 'SR' | 'SSR' | 'UR') - Rarity level
- `stats` (object) - Stats {pow, tec, stm, apl}
- `skills` (array) - Associated skills
- `release` (string) - Release date
- `reappear` (string, optional) - Reappear date

---

### 4. Girls Table (`girls`)
**Primary Key:** `id`
```sql
CREATE TABLE girls (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    rarity ENUM('R', 'SR', 'SSR') NOT NULL,
    type VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Fields:**
- `id` - Auto-incrementing identifier (INT, AUTO_INCREMENT)
- `name` - Girl name (VARCHAR(255), NOT NULL)
- `rarity` - Rarity level (ENUM: 'R', 'SR', 'SSR')
- `type` - Girl type (VARCHAR(50), NOT NULL)
- `description` - Description (TEXT, Optional)
- `created_at` - Record creation timestamp (TIMESTAMP)
- `updated_at` - Record update timestamp (TIMESTAMP)

**Backend Interface Fields:**
- `id` (string) - Girl identifier
- `name` (string) - Girl name
- `type` ('pow' | 'tec' | 'stm') - Girl type
- `level` (number) - Current level
- `pow`, `tec`, `stm`, `apl` (numbers) - Current stats
- `maxPow`, `maxTec`, `maxStm`, `maxApl` (numbers) - Maximum stats
- `birthday` (Date) - Birthday
- `swimsuitId` (string, optional) - Associated swimsuit

---

### 5. Accessories Table (`accessories`)
**Primary Key:** `id`
```sql
CREATE TABLE accessories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    rarity ENUM('R', 'SR', 'SSR') NOT NULL,
    type VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Fields:**
- `id` - Auto-incrementing identifier (INT, AUTO_INCREMENT)
- `name` - Accessory name (VARCHAR(255), NOT NULL)
- `rarity` - Rarity level (ENUM: 'R', 'SR', 'SSR')
- `type` - Accessory type (VARCHAR(50), NOT NULL)
- `description` - Description (TEXT, Optional)
- `created_at` - Record creation timestamp (TIMESTAMP)
- `updated_at` - Record update timestamp (TIMESTAMP)

**Frontend Interface Fields:**
- `id` (string) - Accessory identifier
- `name` (string) - Accessory name
- `type` ('head' | 'face' | 'hand' | 'body') - Accessory type
- `skill` (object) - Associated skill details
- `stats` (object) - Stat bonuses
- `rarity` (string) - Rarity level
- `icon` (string) - Icon path

---

### 6. Venus Boards Table (`venus_boards`)
**Primary Key:** `id`
```sql
CREATE TABLE venus_boards (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    rarity ENUM('R', 'SR', 'SSR') NOT NULL,
    type VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Fields:**
- `id` - Auto-incrementing identifier (INT, AUTO_INCREMENT)
- `name` - Venus board name (VARCHAR(255), NOT NULL)
- `rarity` - Rarity level (ENUM: 'R', 'SR', 'SSR')
- `type` - Board type (VARCHAR(50), NOT NULL)
- `description` - Description (TEXT, Optional)
- `created_at` - Record creation timestamp (TIMESTAMP)
- `updated_at` - Record update timestamp (TIMESTAMP)

**Backend Interface Fields:**
- `id` (number) - Board identifier
- `girlId` (string) - Associated girl
- `pow`, `tec`, `stm`, `apl` (numbers) - Stat bonuses

---

### 7. Passive Skills Table (`passive_skills`)
**Primary Key:** `id`
```sql
CREATE TABLE passive_skills (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    effect_type VARCHAR(100),
    effect_value DECIMAL(10,2),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Fields:**
- `id` - Unique passive skill identifier (VARCHAR(255))
- `name` - Passive skill name (VARCHAR(255), NOT NULL)
- `description` - Skill description (TEXT, Optional)
- `effect_type` - Effect type (VARCHAR(100), Optional)
- `effect_value` - Effect value (DECIMAL(10,2), Optional)
- `created_at` - Record creation timestamp (DATETIME)
- `updated_at` - Record update timestamp (DATETIME)

---

### 8. Events Table (`events`)
**Primary Key:** `id`
```sql
CREATE TABLE events (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    event_type VARCHAR(100),
    start_date DATE,
    end_date DATE,
    rewards JSON,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Fields:**
- `id` - Unique event identifier (VARCHAR(255))
- `name` - Event name (VARCHAR(255), NOT NULL)
- `description` - Event description (TEXT, Optional)
- `event_type` - Type of event (VARCHAR(100), Optional)
- `start_date` - Event start date (DATE, Optional)
- `end_date` - Event end date (DATE, Optional)
- `rewards` - Event rewards in JSON format (JSON, Optional)
- `created_at` - Record creation timestamp (DATETIME)
- `updated_at` - Record update timestamp (DATETIME)

---

### 9. Messages Table (`messages`)
**Primary Key:** `id`
**Foreign Keys:** `character_id` → `characters(id)`
```sql
CREATE TABLE messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    character_id VARCHAR(255),
    message_text TEXT NOT NULL,
    message_type VARCHAR(100) DEFAULT 'general',
    unlock_condition TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE SET NULL
);
```

**Fields:**
- `id` - Auto-incrementing identifier (INT, AUTO_INCREMENT)
- `character_id` - Associated character (VARCHAR(255), Foreign Key, Optional)
- `message_text` - Message content (TEXT, NOT NULL)
- `message_type` - Message type (VARCHAR(100), DEFAULT 'general')
- `unlock_condition` - Unlock conditions (TEXT, Optional)
- `created_at` - Record creation timestamp (DATETIME)

---

### 10. Owner Room Items Table (`owner_room_items`)
**Primary Key:** `id`
```sql
CREATE TABLE owner_room_items (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    description TEXT,
    unlock_condition TEXT,
    price INT DEFAULT 0,
    currency VARCHAR(50) DEFAULT 'coins',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Fields:**
- `id` - Unique item identifier (VARCHAR(255))
- `name` - Item name (VARCHAR(255), NOT NULL)
- `category` - Item category (VARCHAR(100), Optional)
- `description` - Item description (TEXT, Optional)
- `unlock_condition` - Unlock requirements (TEXT, Optional)
- `price` - Item price (INT, DEFAULT 0)
- `currency` - Currency type (VARCHAR(50), DEFAULT 'coins')
- `created_at` - Record creation timestamp (DATETIME)
- `updated_at` - Record update timestamp (DATETIME)

---

### 11. Monthly Battles Table (`monthly_battles`)
**Primary Key:** `id`
```sql
CREATE TABLE monthly_battles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    month_year VARCHAR(7) NOT NULL,
    battle_name VARCHAR(255) NOT NULL,
    difficulty VARCHAR(50),
    rewards JSON,
    requirements TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Fields:**
- `id` - Auto-incrementing identifier (INT, AUTO_INCREMENT)
- `month_year` - Month and year (VARCHAR(7), Format: YYYY-MM)
- `battle_name` - Battle name (VARCHAR(255), NOT NULL)
- `difficulty` - Battle difficulty (VARCHAR(50), Optional)
- `rewards` - Battle rewards in JSON format (JSON, Optional)
- `requirements` - Battle requirements (TEXT, Optional)
- `created_at` - Record creation timestamp (DATETIME)

---

### 12. User Settings Table (`user_settings`)
**Primary Key:** `id`
```sql
CREATE TABLE user_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(255) NOT NULL UNIQUE,
    setting_value TEXT,
    data_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    category VARCHAR(100) DEFAULT 'general',
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Fields:**
- `id` - Auto-incrementing identifier (INT, AUTO_INCREMENT)
- `setting_key` - Setting key (VARCHAR(255), UNIQUE, NOT NULL)
- `setting_value` - Setting value (TEXT, Optional)
- `data_type` - Data type (ENUM: 'string', 'number', 'boolean', 'json')
- `category` - Setting category (VARCHAR(100), DEFAULT 'general')
- `description` - Setting description (TEXT, Optional)
- `is_public` - Public visibility flag (BOOLEAN, DEFAULT FALSE)
- `created_at` - Record creation timestamp (DATETIME)
- `updated_at` - Record update timestamp (DATETIME)

---

### 13. User Statistics Table (`user_statistics`)
**Primary Key:** `id`
```sql
CREATE TABLE user_statistics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    stat_name VARCHAR(255) NOT NULL UNIQUE,
    stat_value BIGINT DEFAULT 0,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Fields:**
- `id` - Auto-incrementing identifier (INT, AUTO_INCREMENT)
- `stat_name` - Statistic name (VARCHAR(255), UNIQUE, NOT NULL)
- `stat_value` - Statistic value (BIGINT, DEFAULT 0)
- `last_updated` - Last update timestamp (DATETIME)

---

## Junction/Relationship Tables

### 1. Girl Skills (`girl_skills`)
**Composite Primary Key:** `(girl_id, skill_id)`
```sql
CREATE TABLE girl_skills (
    girl_id INT NOT NULL,
    skill_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (girl_id, skill_id),
    FOREIGN KEY (girl_id) REFERENCES girls(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);
```

### 2. Girl Swimsuits (`girl_swimsuits`)
**Composite Primary Key:** `(girl_id, swimsuit_id)`
```sql
CREATE TABLE girl_swimsuits (
    girl_id INT NOT NULL,
    swimsuit_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (girl_id, swimsuit_id),
    FOREIGN KEY (girl_id) REFERENCES girls(id) ON DELETE CASCADE,
    FOREIGN KEY (swimsuit_id) REFERENCES swimsuits(id) ON DELETE CASCADE
);
```

### 3. Accessory Girls (`accessory_girls`)
**Composite Primary Key:** `(accessory_id, girl_id)`
```sql
CREATE TABLE accessory_girls (
    accessory_id INT NOT NULL,
    girl_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (accessory_id, girl_id),
    FOREIGN KEY (accessory_id) REFERENCES accessories(id) ON DELETE CASCADE,
    FOREIGN KEY (girl_id) REFERENCES girls(id) ON DELETE CASCADE
);
```

### 4. Venus Board Girls (`venus_board_girls`)
**Composite Primary Key:** `(venus_board_id, girl_id)`
```sql
CREATE TABLE venus_board_girls (
    venus_board_id INT NOT NULL,
    girl_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (venus_board_id, girl_id),
    FOREIGN KEY (venus_board_id) REFERENCES venus_boards(id) ON DELETE CASCADE,
    FOREIGN KEY (girl_id) REFERENCES girls(id) ON DELETE CASCADE
);
```

### 5. Venus Board Skills (`venus_board_skills`)
**Composite Primary Key:** `(venus_board_id, skill_id)`
```sql
CREATE TABLE venus_board_skills (
    venus_board_id INT NOT NULL,
    skill_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (venus_board_id, skill_id),
    FOREIGN KEY (venus_board_id) REFERENCES venus_boards(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);
```

### 6. Swimsuit Skills (`swimsuit_skills`)
**Composite Primary Key:** `(swimsuit_id, skill_id)`
```sql
CREATE TABLE swimsuit_skills (
    swimsuit_id VARCHAR(255) NOT NULL,
    skill_id VARCHAR(255) NOT NULL,
    skill_level INT DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (swimsuit_id, skill_id),
    FOREIGN KEY (swimsuit_id) REFERENCES swimsuits(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);
```

### 7. Girl Accessories (`girl_accessories`)
**Composite Primary Key:** `(girl_id, accessory_id)`
```sql
CREATE TABLE girl_accessories (
    girl_id VARCHAR(255) NOT NULL,
    accessory_id VARCHAR(255) NOT NULL,
    equipped_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (girl_id, accessory_id),
    FOREIGN KEY (girl_id) REFERENCES girls(id) ON DELETE CASCADE,
    FOREIGN KEY (accessory_id) REFERENCES accessories(id) ON DELETE CASCADE
);
```

---

## Frontend-Only Data Structures

### 1. Bromides Interface
```typescript
interface Bromide {
  id: string;
  name: string;
  type: string;
  rarity: string;
  description: string;
  character: string | null;
  effects: Array<{
    description: string;
    value: number;
    type: string;
  }>;
  source: string;
}
```

### 2. Documents Interface
```typescript
interface Document {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  author: string;
  createdAt: string;
  updatedAt: string;
  isPublished: boolean;
}
```

### 3. Update Logs Interface
```typescript
interface UpdateLog {
  id: string;
  version: string;
  title: string;
  description: string;
  content: string;
  date: string;
  isPublished: boolean;
  tags: string[];
  technicalDetails: string[];
  bugFixes: string[];
  screenshots: string[];
  metrics: {
    performanceImprovement: string;
    userSatisfaction: string;
    bugReports: number;
  };
}
```

---

## Application Pages Structure

### Main Pages:
- **AdminPage** - Administrative functions and data management
- **HomePage** - Main dashboard and overview
- **GirlListPage** - Character listing and filtering
- **GirlDetailPage** - Individual character detailed view
- **SwimsuitPage** - Swimsuit collection and management
- **AccessoryPage** - Accessory collection and management
- **SkillsPage** - Skills database and information
- **FestivalPage** - Event information and tracking
- **MemoriesPage** - Bromide/photo collection management
- **DecorateBromidePage** - Bromide decoration and customization
- **ShopPage** - In-game store simulation
- **DocumentPage** - Documentation and guides
- **OwnerRoomPage** - Room customization features
- **GachaPage** - Gacha simulation features
- **ItemsPage** - General items management
- **NotFoundPage** - 404 error page

---

## Key Statistics and Metrics

### Database Constraints:
- **Primary Keys:** All tables have defined primary keys
- **Foreign Keys:** Proper referential integrity with cascade deletes
- **Indexes:** Strategic indexing on frequently queried columns
- **Character Set:** UTF8MB4 for full Unicode support
- **Engine:** InnoDB for ACID compliance and foreign key support

### Data Types Summary:
- **VARCHAR(255):** Standard string fields
- **TEXT:** Long text content
- **INT:** Numeric identifiers and stats
- **ENUM:** Controlled value sets (rarity, types)
- **DATE/DATETIME/TIMESTAMP:** Date and time tracking
- **JSON:** Complex structured data
- **DECIMAL:** Precise numeric values
- **BOOLEAN:** Binary flags

---

*Generated on: $(date)*
*Project: DOAXVV Handbook*
*Version: Current* 