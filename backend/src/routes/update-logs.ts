import { Router, Request, Response } from 'express';
import databaseService from '../services/DatabaseService';
import { AppError } from '../middleware/errorHandler';
import { v4 as uuidv4 } from 'uuid';
import { NewUpdateLog } from '../types/database';

const router = Router();

// GET /api/update-logs - Get all update logs with optional pagination and filtering
router.get('/', async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = 'date',
      sortOrder = 'desc',
      published
    } = req.query;

    const options = {
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      sortBy: sortBy as string,
      sortOrder: sortOrder as 'asc' | 'desc'
    };

    let result;
    if (published === 'true') {
      result = await databaseService.getPublishedUpdateLogs(options);
    } else {
      result = await databaseService.getUpdateLogs(options);
    }

    res.json({
      success: true,
      data: result.data,
      pagination: result.pagination
    });
  } catch (error) {
    throw new AppError('Failed to fetch update logs', 500);
  }
});

// GET /api/update-logs/published - Get only published update logs
router.get('/published', async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = 'date',
      sortOrder = 'desc'
    } = req.query;

    const options = {
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      sortBy: sortBy as string,
      sortOrder: sortOrder as 'asc' | 'desc'
    };

    const result = await databaseService.getPublishedUpdateLogs(options);
    
    res.json({
      success: true,
      data: result.data,
      pagination: result.pagination
    });
  } catch (error) {
    throw new AppError('Failed to fetch published update logs', 500);
  }
});

// GET /api/update-logs/:id - Get a specific update log
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateLog = await databaseService.getUpdateLogById(id);
    
    res.json({
      success: true,
      data: updateLog
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to fetch update log', 500);
  }
});

// POST /api/update-logs - Create a new update log
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      version,
      title,
      content,
      description,
      date,
      tags,
      isPublished,
      technicalDetails,
      bugFixes,
      screenshots,
      metrics
    } = req.body;

    if (!version || !title || !content || !date) {
      throw new AppError('Version, title, content, and date are required', 400);
    }

    const newUpdateLog: NewUpdateLog = {
      id: uuidv4(),
      version,
      title,
      content,
      description: description || '',
      date: new Date(date),
      tags: tags || [],
      isPublished: isPublished !== undefined ? isPublished : true,
      technicalDetails: technicalDetails || [],
      bugFixes: bugFixes || [],
      screenshots: screenshots || [],
      metrics: metrics || {
        performanceImprovement: '0%',
        userSatisfaction: '0%',
        bugReports: 0
      }
    };

    const updateLog = await databaseService.createUpdateLog(newUpdateLog);
    
    res.status(201).json({
      success: true,
      data: updateLog,
      message: 'Update log created successfully'
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to create update log', 500);
  }
});

// PUT /api/update-logs/:id - Update an update log
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Convert date string to Date object if provided
    if (updates.date) {
      updates.date = new Date(updates.date);
    }

    const updateLog = await databaseService.updateUpdateLog(id, updates);
    
    res.json({
      success: true,
      data: updateLog,
      message: 'Update log updated successfully'
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to update update log', 500);
  }
});

// DELETE /api/update-logs/:id - Delete an update log
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await databaseService.deleteUpdateLog(id);
    
    res.json({
      success: true,
      message: 'Update log deleted successfully'
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to delete update log', 500);
  }
});

export default router; 