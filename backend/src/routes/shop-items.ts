import express from 'express';
import { z } from 'zod';
import { validateRequest } from '../middleware/validateRequest';
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
  section: z.enum(['owner', 'event', 'venus', 'vip']).optional(),
  type: z.enum(['swimsuit', 'accessory', 'decoration', 'currency', 'booster']).optional(),
  rarity: z.enum(['common', 'rare', 'epic', 'legendary']).optional(),
  currency: z.enum(['coins', 'gems', 'tickets']).optional(),
  inStock: z.string().optional(),
  isNew: z.string().optional(),
  hasDiscount: z.string().optional(),
  featured: z.string().optional(),
  priceMin: z.string().optional(),
  priceMax: z.string().optional(),
});

// Get all shop items with pagination and filtering
router.get('/', validateRequest({ query: querySchema }), async (req, res) => {
  try {
    const { 
      page = '1', 
      limit = '10', 
      sort = 'name', 
      order = 'asc', 
      search, 
      section,
      type, 
      rarity, 
      currency,
      inStock,
      isNew,
      hasDiscount,
      featured,
      priceMin,
      priceMax
    } = req.query;
    
    const result = await databaseService.getShopItems({
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      sort: sort as string,
      order: order as 'asc' | 'desc',
      search: search as string,
      section: section as string,
      type: type as string,
      rarity: rarity as string,
      currency: currency as string,
      inStock: inStock === 'true',
      isNew: isNew === 'true',
      hasDiscount: hasDiscount === 'true',
      featured: featured === 'true',
      priceMin: priceMin ? parseInt(priceMin as string) : undefined,
      priceMax: priceMax ? parseInt(priceMax as string) : undefined,
    });

    res.json(result);
  } catch (error) {
    logger.error('Error fetching shop items:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch shop items',
    });
  }
});

// Get a specific shop item by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const shopItem = await databaseService.getShopItemById(id);

    if (!shopItem) {
      return res.status(404).json({
        success: false,
        error: 'Shop item not found',
      });
    }

    res.json({
      success: true,
      data: shopItem,
    });
  } catch (error) {
    logger.error('Error fetching shop item:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch shop item',
    });
  }
});

// Create schema for shop item creation
const createShopItemSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  type: z.enum(['swimsuit', 'accessory', 'decoration', 'currency', 'booster']),
  category: z.string().min(1, 'Category is required'),
  section: z.enum(['owner', 'event', 'venus', 'vip']),
  price: z.number().min(0, 'Price must be non-negative'),
  currency: z.enum(['coins', 'gems', 'tickets']).default('coins'),
  rarity: z.enum(['common', 'rare', 'epic', 'legendary']).default('common'),
  image: z.string().optional(),
  inStock: z.boolean().default(true),
  isNew: z.boolean().default(false),
  discount: z.number().min(0).max(100).optional(),
  limitedTime: z.boolean().default(false),
  featured: z.boolean().default(false),
});

// Create a new shop item
router.post('/', validateRequest({ body: createShopItemSchema }), async (req, res) => {
  try {
    const shopItemData = req.body;
    const newShopItem = await databaseService.createShopItem(shopItemData);

    logger.info(`Created new shop item: ${newShopItem.name}`);

    res.status(201).json({
      success: true,
      data: newShopItem,
    });
  } catch (error) {
    logger.error('Error creating shop item:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create shop item',
    });
  }
});

// Update schema for shop item updates
const updateShopItemSchema = createShopItemSchema.partial();

// Update an existing shop item
router.put('/:id', validateRequest({ body: updateShopItemSchema }), async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedShopItem = await databaseService.updateShopItem(id, updates);

    if (!updatedShopItem) {
      return res.status(404).json({
        success: false,
        error: 'Shop item not found',
      });
    }

    logger.info(`Updated shop item: ${updatedShopItem.name}`);

    res.json({
      success: true,
      data: updatedShopItem,
    });
  } catch (error) {
    logger.error('Error updating shop item:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update shop item',
    });
  }
});

// Delete a shop item
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await databaseService.deleteShopItem(id);

    logger.info(`Deleted shop item with ID: ${id}`);

    res.json({
      success: true,
      message: 'Shop item deleted successfully',
    });
  } catch (error) {
    logger.error('Error deleting shop item:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete shop item',
    });
  }
});

export default router; 