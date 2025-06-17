import { Router } from 'express';
import { validate, validateQuery, schemas } from '../middleware/validation';
import { asyncHandler } from '../middleware/errorHandler';
import databaseService from '../services/DatabaseService';
import logger from '../config/logger';

const router = Router();

// GET /api/swimsuits - Get all swimsuits with pagination
router.get('/', 
  validateQuery(schemas.pagination),
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, sortBy, sortOrder, characterId } = req.query;
    
    let result;
    if (characterId) {
      result = await databaseService.getSwimsuitsByCharacter(characterId as string, {
        page: Number(page),
        limit: Number(limit),
        sortBy: sortBy as string,
        sortOrder: sortOrder as 'asc' | 'desc'
      });
    } else {
      result = await databaseService.getSwimsuits({
        page: Number(page),
        limit: Number(limit),
        sortBy: sortBy as string,
        sortOrder: sortOrder as 'asc' | 'desc'
      });
    }

    logger.info(`Retrieved ${result.data.length} swimsuits for page ${page}`);

    res.json({
      success: true,
      data: result.data,
      pagination: result.pagination
    });
  })
);

// GET /api/swimsuits/:id - Get swimsuit by ID
router.get('/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    const swimsuit = await databaseService.getSwimsuitById(id);
    
    logger.info(`Retrieved swimsuit: ${swimsuit.name}`);

    res.json({
      success: true,
      data: swimsuit
    });
  })
);

// POST /api/swimsuits - Create new swimsuit
router.post('/',
  validate(schemas.createSwimsuit),
  asyncHandler(async (req, res) => {
    const swimsuit = await databaseService.createSwimsuit(req.body);
    
    logger.info(`Created swimsuit: ${swimsuit.name}`);

    res.status(201).json({
      success: true,
      data: swimsuit,
      message: 'Swimsuit created successfully'
    });
  })
);

// PUT /api/swimsuits/:id - Update swimsuit
router.put('/:id',
  validate(schemas.updateSwimsuit),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    const swimsuit = await databaseService.updateSwimsuit(id, req.body);
    
    logger.info(`Updated swimsuit: ${swimsuit.name}`);

    res.json({
      success: true,
      data: swimsuit,
      message: 'Swimsuit updated successfully'
    });
  })
);

// DELETE /api/swimsuits/:id - Delete swimsuit
router.delete('/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    await databaseService.deleteSwimsuit(id);
    
    logger.info(`Deleted swimsuit with ID: ${id}`);

    res.json({
      success: true,
      message: 'Swimsuit deleted successfully'
    });
  })
);

export default router; 