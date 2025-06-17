import { Router, Request, Response } from 'express';
import databaseService from '../services/DatabaseService';
import { AppError } from '../middleware/errorHandler';
import { v4 as uuidv4 } from 'uuid';
import { NewDocument } from '../types/database';

const router = Router();

// GET /api/documents - Get all documents with optional pagination and filtering
router.get('/', async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = 'created_at',
      sortOrder = 'desc',
      category,
      published
    } = req.query;

    const options = {
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      sortBy: sortBy as string,
      sortOrder: sortOrder as 'asc' | 'desc'
    };

    let result;
    if (category) {
      result = await databaseService.getDocumentsByCategory(category as string, options);
    } else {
      result = await databaseService.getDocuments(options);
    }

    // Filter by published status if specified
    if (published !== undefined) {
      const isPublished = published === 'true';
      result.data = result.data.filter(doc => doc.isPublished === isPublished);
      result.pagination.total = result.data.length;
      result.pagination.totalPages = Math.ceil(result.data.length / options.limit);
    }

    res.json({
      success: true,
      data: result.data,
      pagination: result.pagination
    });
  } catch (error) {
    throw new AppError('Failed to fetch documents', 500);
  }
});

// GET /api/documents/:id - Get a specific document
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const document = await databaseService.getDocumentById(id);
    
    res.json({
      success: true,
      data: document
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to fetch document', 500);
  }
});

// POST /api/documents - Create a new document
router.post('/', async (req: Request, res: Response) => {
  try {
    const { title, content, category, tags, author, isPublished } = req.body;

    if (!title || !content) {
      throw new AppError('Title and content are required', 400);
    }

    const newDocument: NewDocument = {
      id: uuidv4(),
      title,
      content,
      category: category || 'general',
      tags: tags || [],
      author: author || 'System',
      isPublished: isPublished !== undefined ? isPublished : true
    };

    const document = await databaseService.createDocument(newDocument);
    
    res.status(201).json({
      success: true,
      data: document,
      message: 'Document created successfully'
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to create document', 500);
  }
});

// PUT /api/documents/:id - Update a document
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const document = await databaseService.updateDocument(id, updates);
    
    res.json({
      success: true,
      data: document,
      message: 'Document updated successfully'
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to update document', 500);
  }
});

// DELETE /api/documents/:id - Delete a document
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await databaseService.deleteDocument(id);
    
    res.json({
      success: true,
      message: 'Document deleted successfully'
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to delete document', 500);
  }
});

export default router; 