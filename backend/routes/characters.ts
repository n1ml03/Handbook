import { Router } from 'express';
import { validate, validateQuery, schemas } from '../middleware/validation';
import { asyncHandler } from '../middleware/errorHandler';
import databaseService from '../services/DatabaseService';
import logger from '../config/logger';

const router = Router();

// GET /api/characters - Get all characters with pagination
router.get('/', 
  validateQuery(schemas.pagination),
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, sortBy, sortOrder } = req.query;
    
    const result = await databaseService.getCharacters({
      page: Number(page),
      limit: Number(limit),
      sortBy: sortBy as string,
      sortOrder: sortOrder as 'asc' | 'desc'
    });

    logger.info(`Retrieved ${result.data.length} characters for page ${page}`);

    res.json({
      success: true,
      data: result.data,
      pagination: result.pagination
    });
  })
);

// GET /api/characters/:id - Get character by ID
router.get('/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    const character = await databaseService.getCharacterById(id);
    
    logger.info(`Retrieved character: ${character.name}`);

    res.json({
      success: true,
      data: character
    });
  })
);

// POST /api/characters - Create new character
router.post('/',
  validate(schemas.createCharacter),
  asyncHandler(async (req, res) => {
    const character = await databaseService.createCharacter(req.body);
    
    logger.info(`Created character: ${character.name}`);

    res.status(201).json({
      success: true,
      data: character,
      message: 'Character created successfully'
    });
  })
);

// PUT /api/characters/:id - Update character
router.put('/:id',
  validate(schemas.updateCharacter),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    const character = await databaseService.updateCharacter(id, req.body);
    
    logger.info(`Updated character: ${character.name}`);

    res.json({
      success: true,
      data: character,
      message: 'Character updated successfully'
    });
  })
);

// DELETE /api/characters/:id - Delete character
router.delete('/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    await databaseService.deleteCharacter(id);
    
    logger.info(`Deleted character with ID: ${id}`);

    res.json({
      success: true,
      message: 'Character deleted successfully'
    });
  })
);

export default router; 