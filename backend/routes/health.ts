import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import databaseService from '../services/DatabaseService';
import logger from '../config/logger';

const router = Router();

// GET /api/health - Health check endpoint
router.get('/',
  asyncHandler(async (req, res) => {
    const startTime = Date.now();
    
    // Check database connectivity
    const dbHealth = await databaseService.healthCheck();
    
    const responseTime = Date.now() - startTime;
    
    const healthStatus = {
      status: dbHealth.isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      responseTime: `${responseTime}ms`,
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      database: {
        status: dbHealth.isHealthy ? 'connected' : 'disconnected',
        errors: dbHealth.errors
      },
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100,
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024 * 100) / 100,
        external: Math.round(process.memoryUsage().external / 1024 / 1024 * 100) / 100
      }
    };

    if (!dbHealth.isHealthy) {
      logger.warn('Health check failed', { errors: dbHealth.errors });
      return res.status(503).json({
        success: false,
        ...healthStatus
      });
    }

    logger.info('Health check successful', { responseTime });

    res.json({
      success: true,
      ...healthStatus
    });
  })
);

export default router; 