import * as mysql from 'mysql2/promise';
import logger from './logger';

export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  ssl?: {
    rejectUnauthorized?: boolean;
  };
  connectionLimit?: number;
  acquireTimeout?: number;
  timeout?: number;
  reconnect?: boolean;
  charset?: string;
}

const config: DatabaseConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  database: process.env.DB_NAME || 'doaxvv_handbook',
  user: process.env.DB_USER || 'doaxvv_user',
  password: process.env.DB_PASSWORD || 'doaxvv_password',
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : undefined,
  connectionLimit: 20,
  acquireTimeout: 15000,
  timeout: 30000,
  reconnect: true,
  charset: 'utf8mb4',
};

export const pool = mysql.createPool(config);

// Initialize connection pool
let poolConnected = false;

export async function initializePool(): Promise<void> {
  if (!poolConnected) {
    try {
      // Test the connection
      const connection = await pool.getConnection();
      connection.release();
      poolConnected = true;
      logger.info('MySQL connection pool initialized');
    } catch (error) {
      logger.error('Failed to initialize MySQL connection pool:', error);
      throw error;
    }
  }
}

// Test database connection
export async function testConnection(): Promise<boolean> {
  try {
    if (!poolConnected) {
      await initializePool();
    }
    await pool.execute('SELECT NOW() as current_time');
    logger.info('Database connection successful');
    return true;
  } catch (error) {
    logger.error('Database connection failed:', error);
    return false;
  }
}

// Graceful shutdown
export async function closeDatabase(): Promise<void> {
  try {
    if (poolConnected) {
      await pool.end();
      poolConnected = false;
      logger.info('Database connection pool closed');
    }
  } catch (error) {
    logger.error('Error closing database pool:', error);
  }
}

// Get a connection from the pool
export async function getConnection(): Promise<mysql.PoolConnection> {
  if (!poolConnected) {
    throw new Error('Database pool not initialized. Call initializePool() first.');
  }
  return await pool.getConnection();
}

// Execute a query with the pool
export async function executeQuery(query: string, params?: any[]): Promise<any> {
  if (!poolConnected) {
    await initializePool();
  }
  return await pool.execute(query, params);
}

// Export for direct use
export default pool;