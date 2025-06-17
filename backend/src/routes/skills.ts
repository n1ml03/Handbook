import { Router } from 'express';
import { validate, validateQuery, schemas } from '../middleware/validation';
import { asyncHandler } from '../middleware/errorHandler';
import databaseService from '../services/DatabaseService';
import logger from '../config/logger';

const router = Router();

// GET /api/skills - Get all skills with pagination
router.get('/', 
  validateQuery(schemas.pagination),
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, sortBy, sortOrder } = req.query;
    
    const result = await databaseService.getSkills({
      page: Number(page),
      limit: Number(limit),
      sortBy: sortBy as string,
      sortOrder: sortOrder as 'asc' | 'desc'
    });

    logger.info(`Retrieved ${result.data.length} skills for page ${page}`);

    res.json({
      success: true,
      data: result.data,
      pagination: result.pagination
    });
  })
);

// GET /api/skills/:id - Get skill by ID
router.get('/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    const skill = await databaseService.getSkillById(id);
    
    logger.info(`Retrieved skill: ${skill.name}`);

    res.json({
      success: true,
      data: skill
    });
  })
);

// POST /api/skills - Create new skill
router.post('/',
  validate(schemas.createSkill),
  asyncHandler(async (req, res) => {
    const skill = await databaseService.createSkill(req.body);
    
    logger.info(`Created skill: ${skill.name}`);

    res.status(201).json({
      success: true,
      data: skill,
      message: 'Skill created successfully'
    });
  })
);

// PUT /api/skills/:id - Update skill
router.put('/:id',
  validate(schemas.updateSkill),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    const skill = await databaseService.updateSkill(id, req.body);
    
    logger.info(`Updated skill: ${skill.name}`);

    res.json({
      success: true,
      data: skill,
      message: 'Skill updated successfully'
    });
  })
);

// DELETE /api/skills/:id - Delete skill
router.delete('/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    await databaseService.deleteSkill(id);
    
    logger.info(`Deleted skill with ID: ${id}`);

    res.json({
      success: true,
      message: 'Skill deleted successfully'
    });
  })
);

export default router; 