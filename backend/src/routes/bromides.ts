import { Router } from 'express';
import { validate, validateQuery, schemas } from '../middleware/validation';
import { asyncHandler } from '../middleware/errorHandler';
import databaseService from '../services/DatabaseService';
import logger from '../config/logger';

const router = Router();

// GET /api/bromides - Get all bromides with pagination
router.get('/', 
  validateQuery(schemas.pagination),
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, sortBy, sortOrder, category, rarity } = req.query;
    
    const result = await databaseService.getBromides({
      page: Number(page),
      limit: Number(limit),
      sortBy: sortBy as string,
      sortOrder: sortOrder as 'asc' | 'desc',
      category: category as string,
      rarity: rarity as string
    });

    logger.info(`Retrieved ${result.data.length} bromides for page ${page}`);

    res.json({
      success: true,
      data: result.data,
      pagination: result.pagination
    });
  })
);

// GET /api/bromides/:id - Get bromide by ID
router.get('/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    const bromide = await databaseService.getBromideById(id);
    
    logger.info(`Retrieved bromide: ${bromide.name}`);

    res.json({
      success: true,
      data: bromide
    });
  })
);

// POST /api/bromides - Create new bromide
router.post('/',
  validate(schemas.createBromide),
  asyncHandler(async (req, res) => {
    const bromide = await databaseService.createBromide(req.body);
    
    logger.info(`Created bromide: ${bromide.name}`);

    res.status(201).json({
      success: true,
      data: bromide,
      message: 'Bromide created successfully'
    });
  })
);

// PUT /api/bromides/:id - Update bromide
router.put('/:id',
  validate(schemas.updateMemory),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    const bromide = await databaseService.updateBromide(id, req.body);
    
    logger.info(`Updated bromide: ${bromide.name}`);

    res.json({
      success: true,
      data: bromide,
      message: 'Bromide updated successfully'
    });
  })
);

// DELETE /api/bromides/:id - Delete bromide
router.delete('/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    await databaseService.deleteBromide(id);
    
    logger.info(`Deleted bromide with ID: ${id}`);

    res.json({
      success: true,
      message: 'Bromide deleted successfully'
    });
  })
);

export default router; 