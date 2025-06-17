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

// Get all venus boards with pagination and filtering
router.get('/', validateRequest({ query: querySchema }), async (req, res) => {
  try {
    const { page = '1', limit = '10', sort = 'name', order = 'asc', search, rarity, type } = req.query;
    
    const result = await databaseService.getVenusBoards({
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
    logger.error('Error fetching venus boards:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch venus boards',
    });
  }
});

// POST /api/venus-boards - Create new venus board
router.post('/',
  validate(schemas.createVenusBoard),
  async (req, res) => {
    try {
      const venusBoard = await databaseService.createVenusBoard(req.body);
      logger.info(`Created venus board for girl: ${venusBoard.girlId}`);
      res.status(201).json({
        success: true,
        data: venusBoard,
        message: 'Venus board created successfully'
      });
    } catch (error) {
      logger.error('Error creating venus board:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create venus board',
      });
    }
  }
);

// PUT /api/venus-boards/:id - Update venus board
router.put('/:id',
  validate(schemas.updateVenusBoard),
  async (req, res) => {
    try {
      const { id } = req.params;
      const venusBoard = await databaseService.updateVenusBoard(id, req.body);
      logger.info(`Updated venus board for girl: ${venusBoard.girlId}`);
      res.json({
        success: true,
        data: venusBoard,
        message: 'Venus board updated successfully'
      });
    } catch (error) {
      logger.error('Error updating venus board:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update venus board',
      });
    }
  }
);

// Get a specific venus board by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const venusBoard = await databaseService.getVenusBoardById(id);

    if (!venusBoard) {
      return res.status(404).json({
        success: false,
        error: 'Venus board not found',
      });
    }

    res.json({
      success: true,
      data: venusBoard,
    });
  } catch (error) {
    logger.error('Error fetching venus board:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch venus board',
    });
  }
});

// Get venus board's compatible girls
router.get('/:id/girls', async (req, res) => {
  try {
    const { id } = req.params;
    const girls = await databaseService.getVenusBoardCompatibleGirls(id);

    res.json({
      success: true,
      data: girls,
    });
  } catch (error) {
    logger.error('Error fetching venus board compatible girls:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch venus board compatible girls',
    });
  }
});

// Get venus board's skills
router.get('/:id/skills', async (req, res) => {
  try {
    const { id } = req.params;
    const skills = await databaseService.getVenusBoardSkills(id);

    res.json({
      success: true,
      data: skills,
    });
  } catch (error) {
    logger.error('Error fetching venus board skills:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch venus board skills',
    });
  }
});

export default router; 