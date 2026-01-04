import express from 'express';
import {
  createCategory,
  deleteCategory,
  listCategories,
  getCategory,
  updateCategory,
  getSimpleCategories,
  getCategoryTree,
  uploadCategoryImage as uploadCategoryImageController,
  deleteCategoryImage
} from '../controllers/categoryController.js';
import CategoryController from '../controllers/category.controller.js';
import { uploadCategoryImage as uploadMiddleware } from '../middlewares/upload.js';

const router = express.Router();

// Basic category routes
router.get('/tree', getCategoryTree);
router.get('/simple', getSimpleCategories);
router.get('/', listCategories);
router.get('/:id', getCategory);
router.post('/', createCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

// Image management routes
router.post('/upload-image', uploadMiddleware.single('image'), uploadCategoryImageController);
router.post('/delete-image', deleteCategoryImage);

// Attribute management routes - NEW REFACTORED ENDPOINTS
router.get('/:id/attributes', CategoryController.getAttributes);
router.post('/:id/attributes', CategoryController.assignAttribute);
router.delete('/:id/attributes/:attributeId', CategoryController.removeAttribute);
router.patch('/:id/attributes/:attributeId', CategoryController.updateIsVariantAttribute);

// Attribute values management - NEW REFACTORED ENDPOINTS
router.get('/:id/attributes/:attributeId/values', CategoryController.getAttributeValues);
router.post('/:id/attributes/:attributeId/values', CategoryController.assignAttributeValues);
router.delete('/values/:cavId', CategoryController.removeAttributeValue);

export default router;