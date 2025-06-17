import { Router } from 'express';
import { validate, validateQuery, schemas } from '../middleware/validation';
import { asyncHandler } from '../middleware/errorHandler';
import databaseService from '../services/DatabaseService';
import logger from '../config/logger';

const router = Router();

// GET /api/events - Get all events with pagination
router.get('/', 
  validateQuery(schemas.pagination),
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, sortBy, sortOrder, type } = req.query;
    
    const result = await databaseService.getEvents({
      page: Number(page),
      limit: Number(limit),
      sortBy: sortBy as string,
      sortOrder: sortOrder as 'asc' | 'desc',
      type: type as string
    });

    logger.info(`Retrieved ${result.data.length} events for page ${page}`);

    res.json({
      success: true,
      data: result.data,
      pagination: result.pagination
    });
  })
);

// GET /api/events/:id - Get event by ID
router.get('/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    const event = await databaseService.getEventById(id);
    
    logger.info(`Retrieved event: ${event.name}`);

    res.json({
      success: true,
      data: event
    });
  })
);

// POST /api/events - Create new event
router.post('/',
  validate(schemas.createEvent),
  asyncHandler(async (req, res) => {
    const event = await databaseService.createEvent(req.body);
    
    logger.info(`Created event: ${event.name}`);

    res.status(201).json({
      success: true,
      data: event,
      message: 'Event created successfully'
    });
  })
);

// PUT /api/events/:id - Update event
router.put('/:id',
  validate(schemas.updateMemory),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    const event = await databaseService.updateEvent(id, req.body);
    
    logger.info(`Updated event: ${event.name}`);

    res.json({
      success: true,
      data: event,
      message: 'Event updated successfully'
    });
  })
);

// DELETE /api/events/:id - Delete event
router.delete('/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    await databaseService.deleteEvent(id);
    
    logger.info(`Deleted event with ID: ${id}`);

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  })
);

export default router; 