import * as sql from 'mssql';
import logger from './logger';

export interface DatabaseConfig {
  server: string;
  port: number;
  database: string;
  user: string;
  password: string;
  options?: {
    encrypt?: boolean;
    trustServerCertificate?: boolean;
    enableArithAbort?: boolean;
  };
  pool?: {
    max?: number;
    min?: number;
    idleTimeoutMillis?: number;
  };
  requestTimeout?: number;
  connectionTimeout?: number;
}

const config: DatabaseConfig = {
  server: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '1433'),
  database: process.env.DB_NAME || 'doaxvv_handbook',
  user: process.env.DB_USER || 'doaxvv_user',
  password: process.env.DB_PASSWORD || 'doaxvv_password',
  options: {
    encrypt: process.env.NODE_ENV === 'production',
    trustServerCertificate: process.env.NODE_ENV !== 'production',
    enableArithAbort: true,
  },
  pool: {
    max: 20,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  requestTimeout: 30000,
  connectionTimeout: 15000,
};

export const pool = new sql.ConnectionPool(config);

// Initialize connection pool
let poolConnected = false;

export async function initializePool(): Promise<void> {
  if (!poolConnected) {
    try {
      await pool.connect();
      poolConnected = true;
      logger.info('SQL Server connection pool initialized');
    } catch (error) {
      logger.error('Failed to initialize SQL Server connection pool:', error);
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
    const request = pool.request();
    await request.query('SELECT GETDATE() as current_time');
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
      await pool.close();
      poolConnected = false;
      logger.info('Database connection pool closed');
    }
  } catch (error) {
    logger.error('Error closing database pool:', error);
  }
}

// Get a request object from the pool
export function getRequest(): sql.Request {
  if (!poolConnected) {
    throw new Error('Database pool not initialized. Call initializePool() first.');
  }
  return pool.request();
}

// Export for direct use
export default pool;