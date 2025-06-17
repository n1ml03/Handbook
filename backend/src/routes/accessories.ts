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

// Get all accessories with pagination and filtering
router.get('/', validateRequest({ query: querySchema }), async (req, res) => {
  try {
    const { page = '1', limit = '10', sort = 'name', order = 'asc', search, rarity, type } = req.query;
    
    const result = await databaseService.getAccessories({
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
    logger.error('Error fetching accessories:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch accessories',
    });
  }
});

// Get a specific accessory by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const accessory = await databaseService.getAccessoryById(id);

    if (!accessory) {
      return res.status(404).json({
        success: false,
        error: 'Accessory not found',
      });
    }

    res.json({
      success: true,
      data: accessory,
    });
  } catch (error) {
    logger.error('Error fetching accessory:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch accessory',
    });
  }
});

// Get accessory's compatible girls
router.get('/:id/girls', async (req, res) => {
  try {
    const { id } = req.params;
    const girls = await databaseService.getAccessoryCompatibleGirls(id);

    res.json({
      success: true,
      data: girls,
    });
  } catch (error) {
    logger.error('Error fetching accessory compatible girls:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch accessory compatible girls',
    });
  }
});

// POST /api/accessories - Create new accessory
router.post('/',
  validate(schemas.createAccessory),
  async (req, res) => {
    try {
      const accessory = await databaseService.createAccessory(req.body);
      logger.info(`Created accessory: ${accessory.name}`);
      res.status(201).json({
        success: true,
        data: accessory,
        message: 'Accessory created successfully'
      });
    } catch (error) {
      logger.error('Error creating accessory:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create accessory',
      });
    }
  }
);

// PUT /api/accessories/:id - Update accessory
router.put('/:id',
  validate(schemas.updateAccessory),
  async (req, res) => {
    try {
      const { id } = req.params;
      const accessory = await databaseService.updateAccessory(id, req.body);
      logger.info(`Updated accessory: ${accessory.name}`);
      res.json({
        success: true,
        data: accessory,
        message: 'Accessory updated successfully'
      });
    } catch (error) {
      logger.error('Error updating accessory:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update accessory',
      });
    }
  }
);

export default router; 