#!/usr/bin/env bun
/**
 * Data Migration Script: PostgreSQL to MySQL
 *
 * This script helps migrate data from PostgreSQL to MySQL.
 * Run this after setting up both databases.
 */

import { config } from 'dotenv';
config();

import mysql from 'mysql2/promise';
import { Pool } from 'pg';
import logger from '../config/logger';

// PostgreSQL connection (source)
const pgConfig = {
  host: process.env.PG_HOST || 'localhost',
  port: parseInt(process.env.PG_PORT || '5432'),
  database: process.env.PG_NAME || 'doaxvv_handbook',
  user: process.env.PG_USER || 'doaxvv_user',
  password: process.env.PG_PASSWORD || 'doaxvv_password',
};

// MySQL connection (destination)
const mysqlConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  database: process.env.DB_NAME || 'doaxvv_handbook',
  user: process.env.DB_USER || 'doaxvv_user',
  password: process.env.DB_PASSWORD || 'doaxvv_password',
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : undefined,
  charset: 'utf8mb4',
};

interface MigrationTable {
  name: string;
  columns: string[];
  identityColumn?: string;
}

const tables: MigrationTable[] = [
  {
    name: 'characters',
    columns: ['id', 'name', 'name_jp', 'name_en', 'name_zh', 'created_at', 'updated_at']
  },
  {
    name: 'skills',
    columns: ['id', 'name', 'type', 'description', 'icon', 'created_at', 'updated_at']
  },
  {
    name: 'swimsuits',
    columns: ['id', 'name', 'character_id', 'rarity', 'pow', 'tec', 'stm', 'apl', 'release_date', 'reappear_date', 'image', 'created_at', 'updated_at']
  },
  {
    name: 'girls',
    columns: ['id', 'name', 'character_id', 'type', 'level', 'pow', 'tec', 'stm', 'apl', 'max_pow', 'max_tec', 'max_stm', 'max_apl', 'birthday', 'swimsuit_id', 'created_at', 'updated_at']
  },
  {
    name: 'accessories',
    columns: ['id', 'name', 'type', 'skill_id', 'pow', 'tec', 'stm', 'apl', 'created_at', 'updated_at']
  },
  {
    name: 'venus_boards',
    columns: ['girl_id', 'pow', 'tec', 'stm', 'apl', 'created_at', 'updated_at'],
    identityColumn: 'id'
  },
  {
    name: 'user_settings',
    columns: ['key', 'value', 'data_type', 'category', 'description', 'is_public', 'created_at', 'updated_at']
  },
  {
    name: 'user_statistics',
    columns: ['stat_name', 'stat_value', 'last_updated'],
    identityColumn: 'id'
  }
];

class DataMigrator {
  private pgPool: Pool;
  private mysqlPool: mysql.Pool;

  constructor() {
    this.pgPool = new Pool(pgConfig);
    this.mysqlPool = mysql.createPool(mysqlConfig);
  }

  async connect(): Promise<void> {
    try {
      // Test MySQL connection
      const mysqlConnection = await this.mysqlPool.getConnection();
      mysqlConnection.release();
      logger.info('Connected to MySQL');

      // Test PostgreSQL connection
      const pgClient = await this.pgPool.connect();
      pgClient.release();
      logger.info('Connected to PostgreSQL');
    } catch (error) {
      logger.error('Failed to connect to databases:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.pgPool.end();
      await this.mysqlPool.end();
      logger.info('Disconnected from databases');
    } catch (error) {
      logger.error('Error disconnecting from databases:', error);
    }
  }

  private convertValue(value: any, _columnName: string): any {
    if (value === null || value === undefined) {
      return null;
    }

    // Convert boolean values
    if (typeof value === 'boolean') {
      return value ? 1 : 0;
    }

    // Convert dates
    if (value instanceof Date) {
      return value;
    }

    // Convert JSON/JSONB to string
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }

    return value;
  }

  async migrateTable(table: MigrationTable): Promise<void> {
    try {
      logger.info(`Starting migration for table: ${table.name}`);

      // Get data from PostgreSQL
      const pgClient = await this.pgPool.connect();
      const selectQuery = `SELECT ${table.columns.join(', ')} FROM ${table.name} ORDER BY created_at`;
      const pgResult = await pgClient.query(selectQuery);
      pgClient.release();

      if (pgResult.rows.length === 0) {
        logger.info(`No data found in table: ${table.name}`);
        return;
      }

      logger.info(`Found ${pgResult.rows.length} rows in ${table.name}`);

      // Clear existing data in MySQL (optional)
      await this.mysqlPool.execute(`DELETE FROM ${table.name}`);

      // Reset auto_increment if needed
      if (table.identityColumn) {
        await this.mysqlPool.execute(`ALTER TABLE ${table.name} AUTO_INCREMENT = 1`);
      }

      // Insert data into MySQL
      for (const row of pgResult.rows) {
        const values = table.columns.map(column => this.convertValue(row[column], column));

        // Build insert query
        const columnsList = table.columns.join(', ');
        const placeholders = table.columns.map(() => '?').join(', ');
        const insertQuery = `INSERT INTO ${table.name} (${columnsList}) VALUES (${placeholders})`;

        await this.mysqlPool.execute(insertQuery, values);
      }

      logger.info(`Successfully migrated ${pgResult.rows.length} rows to ${table.name}`);
    } catch (error) {
      logger.error(`Failed to migrate table ${table.name}:`, error);
      throw error;
    }
  }

  async migrateAll(): Promise<void> {
    try {
      await this.connect();

      for (const table of tables) {
        await this.migrateTable(table);
      }

      logger.info('Data migration completed successfully!');
    } catch (error) {
      logger.error('Data migration failed:', error);
      throw error;
    } finally {
      await this.disconnect();
    }
  }
}

// Run migration if this script is executed directly
if (import.meta.main) {
  const migrator = new DataMigrator();
  migrator.migrateAll()
    .then(() => {
      console.log('Migration completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}

export default DataMigrator;
