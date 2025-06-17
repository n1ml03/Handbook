import { Router } from 'express';
import { validate, validateQuery, schemas } from '../middleware/validation';
import { asyncHandler } from '../middleware/errorHandler';
import databaseService from '../services/DatabaseService';
import logger from '../config/logger';

const router = Router();

// GET /api/memories - Get all memories with pagination
router.get('/', 
  validateQuery(schemas.pagination),
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, sortBy, sortOrder, type, favorite, search } = req.query;
    
    const result = await databaseService.getMemories({
      page: Number(page),
      limit: Number(limit),
      sortBy: sortBy as string,
      sortOrder: sortOrder as 'asc' | 'desc',
      type: type as string,
      favorite: favorite === 'true',
      search: search as string
    });

    logger.info(`Retrieved ${result.data.length} memories for page ${page}`);

    res.json({
      success: true,
      data: result.data,
      pagination: result.pagination
    });
  })
);

// GET /api/memories/:id - Get memory by ID
router.get('/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    const memory = await databaseService.getMemoryById(id);
    
    logger.info(`Retrieved memory: ${memory.name}`);

    res.json({
      success: true,
      data: memory
    });
  })
);

// POST /api/memories - Create new memory
router.post('/',
  validate(schemas.createMemory),
  asyncHandler(async (req, res) => {
    const memory = await databaseService.createMemory(req.body);
    
    logger.info(`Created memory: ${memory.name}`);

    res.status(201).json({
      success: true,
      data: memory,
      message: 'Memory created successfully'
    });
  })
);

// PUT /api/memories/:id - Update memory
router.put('/:id',
  validate(schemas.updateMemory),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const memory = await databaseService.updateMemory(id, req.body);
    logger.info(`Updated memory: ${memory.name}`);
    res.json({
      success: true,
      data: memory,
      message: 'Memory updated successfully'
    });
  })
);

// PATCH /api/memories/:id/favorite - Toggle memory favorite status
router.patch('/:id/favorite',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { favorite } = req.body;
    
    const memory = await databaseService.updateMemory(id, { favorite });
    
    logger.info(`Updated memory favorite status: ${memory.name} - ${favorite}`);

    res.json({
      success: true,
      data: memory,
      message: 'Memory favorite status updated successfully'
    });
  })
);

// DELETE /api/memories/:id - Delete memory
router.delete('/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    await databaseService.deleteMemory(id);
    
    logger.info(`Deleted memory with ID: ${id}`);

    res.json({
      success: true,
      message: 'Memory deleted successfully'
    });
  })
);

export default router; 