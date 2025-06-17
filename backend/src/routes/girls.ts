import express from 'express';
import { z } from 'zod';
import { validateRequest } from '../middleware/validateRequest';
import { validate, validateQuery, schemas } from '../middleware/validation';
import databaseService from '../services/DatabaseService';
import logger from '../config/logger';

const router = express.Router();

// Schema for query parameters
const querySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).optional(),
  search: z.string().optional(),
  rarity: z.string().optional(),
  type: z.string().optional(),
});

// Get all girls with pagination and filtering
router.get('/', validateRequest({ query: querySchema }), async (req, res) => {
  try {
    const { page = '1', limit = '10', sort = 'name', order = 'asc', search, rarity, type } = req.query;
    
    const result = await databaseService.getGirls({
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      sort: sort as string,
      order: order as 'asc' | 'desc',
      search: search as string,
      rarity: rarity as string,
      type: type as string,
    });

    res.json(result);
  } catch (error) {
    logger.error('Error fetching girls:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch girls',
    });
  }
});

// Get a specific girl by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const girl = await databaseService.getGirlById(id);

    if (!girl) {
      return res.status(404).json({
        success: false,
        error: 'Girl not found',
      });
    }

    res.json({
      success: true,
      data: girl,
    });
  } catch (error) {
    logger.error('Error fetching girl:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch girl',
    });
  }
});

// Get girl's skills
router.get('/:id/skills', async (req, res) => {
  try {
    const { id } = req.params;
    const skills = await databaseService.getGirlSkills(id);

    res.json({
      success: true,
      data: skills,
    });
  } catch (error) {
    logger.error('Error fetching girl skills:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch girl skills',
    });
  }
});

// Get girl's swimsuits
router.get('/:id/swimsuits', async (req, res) => {
  try {
    const { id } = req.params;
    const swimsuits = await databaseService.getGirlSwimsuits(id);

    res.json({
      success: true,
      data: swimsuits,
    });
  } catch (error) {
    logger.error('Error fetching girl swimsuits:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch girl swimsuits',
    });
  }
});

// POST /api/girls - Create new girl
router.post('/',
  validate(schemas.createGirl),
  async (req, res) => {
    try {
      const girl = await databaseService.createGirl(req.body);
      logger.info(`Created girl: ${girl.name}`);
      res.status(201).json({
        success: true,
        data: girl,
        message: 'Girl created successfully'
      });
    } catch (error) {
      logger.error('Error creating girl:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create girl',
      });
    }
  }
);

// PUT /api/girls/:id - Update girl
router.put('/:id',
  validate(schemas.updateGirl),
  async (req, res) => {
    try {
      const { id } = req.params;
      const girl = await databaseService.updateGirl(id, req.body);
      logger.info(`Updated girl: ${girl.name}`);
      res.json({
        success: true,
        data: girl,
        message: 'Girl updated successfully'
      });
    } catch (error) {
      logger.error('Error updating girl:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update girl',
      });
    }
  }
);

export default router; 