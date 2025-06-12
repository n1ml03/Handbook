import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import logger from '../config/logger';

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      logger.warn('Validation error:', error.details[0].message);
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.details[0].message
      });
    }
    
    next();
  };
};

export const validateParams = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.params);
    
    if (error) {
      logger.warn('Parameter validation error:', error.details[0].message);
      return res.status(400).json({
        success: false,
        error: 'Parameter validation error',
        details: error.details[0].message
      });
    }
    
    next();
  };
};

export const validateQuery = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.query);
    
    if (error) {
      logger.warn('Query validation error:', error.details[0].message);
      return res.status(400).json({
        success: false,
        error: 'Query validation error',
        details: error.details[0].message
      });
    }
    
    next();
  };
};

// Common validation schemas
export const schemas = {
  // UUID validation
  uuid: Joi.object({
    id: Joi.string().uuid().required()
  }),

  // Character schemas
  createCharacter: Joi.object({
    id: Joi.string().required(),
    name: Joi.string().min(1).max(255).required(),
    nameJp: Joi.string().max(255).optional(),
    nameEn: Joi.string().max(255).optional(),
    nameZh: Joi.string().max(255).optional()
  }),

  updateCharacter: Joi.object({
    name: Joi.string().min(1).max(255).optional(),
    nameJp: Joi.string().max(255).optional(),
    nameEn: Joi.string().max(255).optional(),
    nameZh: Joi.string().max(255).optional()
  }),

  // Skill schemas
  createSkill: Joi.object({
    id: Joi.string().required(),
    name: Joi.string().min(1).max(255).required(),
    type: Joi.string().required(),
    description: Joi.string().optional(),
    icon: Joi.string().optional()
  }),

  updateSkill: Joi.object({
    name: Joi.string().min(1).max(255).optional(),
    type: Joi.string().optional(),
    description: Joi.string().optional(),
    icon: Joi.string().optional()
  }),

  // Swimsuit schemas
  createSwimsuit: Joi.object({
    id: Joi.string().required(),
    name: Joi.string().min(1).max(255).required(),
    characterId: Joi.string().required(),
    rarity: Joi.string().valid('SSR', 'SR', 'R').required(),
    pow: Joi.number().integer().min(0).required(),
    tec: Joi.number().integer().min(0).required(),
    stm: Joi.number().integer().min(0).required(),
    apl: Joi.number().integer().min(0).required(),
    releaseDate: Joi.date().required(),
    reappearDate: Joi.date().optional(),
    image: Joi.string().optional()
  }),

  updateSwimsuit: Joi.object({
    name: Joi.string().min(1).max(255).optional(),
    characterId: Joi.string().optional(),
    rarity: Joi.string().valid('SSR', 'SR', 'R').optional(),
    pow: Joi.number().integer().min(0).optional(),
    tec: Joi.number().integer().min(0).optional(),
    stm: Joi.number().integer().min(0).optional(),
    apl: Joi.number().integer().min(0).optional(),
    releaseDate: Joi.date().optional(),
    reappearDate: Joi.date().optional(),
    image: Joi.string().optional()
  }),

  // Girl schemas
  createGirl: Joi.object({
    id: Joi.string().required(),
    name: Joi.string().min(1).max(255).required(),
    type: Joi.string().valid('pow', 'tec', 'stm').required(),
    level: Joi.number().integer().min(1).max(100).required(),
    pow: Joi.number().integer().min(0).required(),
    tec: Joi.number().integer().min(0).required(),
    stm: Joi.number().integer().min(0).required(),
    apl: Joi.number().integer().min(0).required(),
    maxPow: Joi.number().integer().min(0).required(),
    maxTec: Joi.number().integer().min(0).required(),
    maxStm: Joi.number().integer().min(0).required(),
    maxApl: Joi.number().integer().min(0).required(),
    birthday: Joi.date().required(),
    swimsuitId: Joi.string().optional()
  }),

  updateGirl: Joi.object({
    name: Joi.string().min(1).max(255).optional(),
    type: Joi.string().valid('pow', 'tec', 'stm').optional(),
    level: Joi.number().integer().min(1).max(100).optional(),
    pow: Joi.number().integer().min(0).optional(),
    tec: Joi.number().integer().min(0).optional(),
    stm: Joi.number().integer().min(0).optional(),
    apl: Joi.number().integer().min(0).optional(),
    maxPow: Joi.number().integer().min(0).optional(),
    maxTec: Joi.number().integer().min(0).optional(),
    maxStm: Joi.number().integer().min(0).optional(),
    maxApl: Joi.number().integer().min(0).optional(),
    birthday: Joi.date().optional(),
    swimsuitId: Joi.string().optional()
  }),

  // Accessory schemas
  createAccessory: Joi.object({
    id: Joi.string().required(),
    name: Joi.string().min(1).max(255).required(),
    type: Joi.string().valid('head', 'face', 'hand').required(),
    skillId: Joi.string().required(),
    pow: Joi.number().integer().min(0).optional(),
    tec: Joi.number().integer().min(0).optional(),
    stm: Joi.number().integer().min(0).optional(),
    apl: Joi.number().integer().min(0).optional()
  }),

  updateAccessory: Joi.object({
    name: Joi.string().min(1).max(255).optional(),
    type: Joi.string().valid('head', 'face', 'hand').optional(),
    skillId: Joi.string().optional(),
    pow: Joi.number().integer().min(0).optional(),
    tec: Joi.number().integer().min(0).optional(),
    stm: Joi.number().integer().min(0).optional(),
    apl: Joi.number().integer().min(0).optional()
  }),

  // Venus Board schemas
  createVenusBoard: Joi.object({
    girlId: Joi.string().required(),
    pow: Joi.number().integer().min(0).required(),
    tec: Joi.number().integer().min(0).required(),
    stm: Joi.number().integer().min(0).required(),
    apl: Joi.number().integer().min(0).required()
  }),

  updateVenusBoard: Joi.object({
    pow: Joi.number().integer().min(0).optional(),
    tec: Joi.number().integer().min(0).optional(),
    stm: Joi.number().integer().min(0).optional(),
    apl: Joi.number().integer().min(0).optional()
  }),

  // Pagination
  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sortBy: Joi.string().optional(),
    sortOrder: Joi.string().valid('asc', 'desc').default('asc')
  })
}; 