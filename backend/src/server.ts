import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';

// Load environment variables
config();

import logger from '@config/logger';
import { testConnection, closeDatabase } from '@config/database';
import { errorHandler, notFound } from '@middleware/errorHandler';
import databaseService from '@services/DatabaseService';

// Import routes
import healthRoutes from '@routes/health';
import charactersRoutes from '@routes/characters';
import skillsRoutes from '@routes/skills';
import swimsuitsRoutes from '@routes/swimsuits';
import girlsRoutes from '@routes/girls';
import accessoriesRoutes from '@routes/accessories';
import venusBoardsRoutes from '@routes/venus-boards';
import documentsRoutes from '@routes/documents';
import updateLogsRoutes from '@routes/update-logs';
import eventsRoutes from '@routes/events';
import bromidesRoutes from '@routes/bromides';
import memoriesRoutes from '@routes/memories';
import shopItemsRoutes from '@routes/shop-items';

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request ID middleware for tracking
app.use((req, res, next) => {
  req.id = Math.random().toString(36).substr(2, 9);
  res.setHeader('X-Request-ID', req.id);
  next();
});

// API routes
app.use('/api/health', healthRoutes);
app.use('/api/characters', charactersRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/swimsuits', swimsuitsRoutes);
app.use('/api/girls', girlsRoutes);
app.use('/api/accessories', accessoriesRoutes);
app.use('/api/venus-boards', venusBoardsRoutes);
app.use('/api/documents', documentsRoutes);
app.use('/api/update-logs', updateLogsRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/bromides', bromidesRoutes);
app.use('/api/memories', memoriesRoutes);
app.use('/api/shop-items', shopItemsRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'DOAXVV Handbook API Server',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/api/health',
      characters: '/api/characters',
      skills: '/api/skills',
      swimsuits: '/api/swimsuits',
      girls: '/api/girls',
      accessories: '/api/accessories',
      venusBoards: '/api/venus-boards',
      documents: '/api/documents',
      updateLogs: '/api/update-logs',
      events: '/api/events',
      bromides: '/api/bromides',
      memories: '/api/memories',
      shopItems: '/api/shop-items'
    }
  });
});

// 404 handler
app.use(notFound);

// Error handling middleware (must be last)
app.use(errorHandler);

// Graceful shutdown handler
const gracefulShutdown = async (signal: string) => {
  logger.info(`Received ${signal}. Starting graceful shutdown...`);
  
  server.close(async () => {
    logger.info('HTTP server closed');
    
    try {
      await closeDatabase();
      logger.info('Database connection closed');
      process.exit(0);
    } catch (error) {
      logger.error('Error during shutdown:', error);
      process.exit(1);
    }
  });

  // Force shutdown after 30 seconds
  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 30000);
};

// Start server
const startServer = async () => {
  try {
    // Initialize database service
    await databaseService.initialize();

    // Test database connection
    const dbConnected = await testConnection();
    if (!dbConnected) {
      logger.error('Failed to connect to database. Exiting...');
      process.exit(1);
    }

    const server = app.listen(PORT, () => {
      logger.info(`\n🚀 DOAXVV Handbook API Server Started\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n🌍 Server running on: http://localhost:${PORT}\n📊 Health check: http://localhost:${PORT}/api/health\n🗃️  Database: Connected to MySQL\n📝 Logging: Winston with file and console output\n⚡ Environment: ${process.env.NODE_ENV || 'development'}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n      `);
    });

    // Handle graceful shutdown
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    return server;
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
const server = startServer();

export default app;