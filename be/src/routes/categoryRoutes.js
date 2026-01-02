import express from 'express';
import {
  createCategory,
  deleteCategory,
  listCategories,
  getCategory,
  updateCategory,
  getSimpleCategories,
  getCategoryTree,
  getCategoryAttributes,
  updateCategoryAttributes,
  removeCategoryAttribute,
  uploadCategoryImage,
  deleteCategoryImage,
  createAttributeForCategory,
  updateAttributeCategory,
  removeAttributeFromCategory,
  getAttributeValues,
  addAttributeValue,
  removeAttributeValue
} from '../controllers/categoryController.js';
import { uploadCategoryImage as uploadMiddleware } from '../middlewares/upload.js';

const router = express.Router();

router.get('/tree', getCategoryTree);
router.get('/simple', getSimpleCategories);
router.get('/', listCategories);
router.get('/:id', getCategory);
router.post('/', createCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

// Image management routes
router.post('/upload-image', uploadMiddleware.single('image'), uploadCategoryImage);
router.post('/delete-image', deleteCategoryImage);

// Attribute management routes
router.get('/:id/attributes', getCategoryAttributes);
router.post('/:categoryId/attributes', createAttributeForCategory);
router.put('/:id/attributes', updateCategoryAttributes);
router.delete('/:id/attributes/:attributeId', removeCategoryAttribute);
router.delete('/:categoryId/attributes/:attributeCategoryId', removeAttributeFromCategory);

// Attribute category management
router.put('/attribute-categories/:attributeCategoryId', updateAttributeCategory);

// Attribute values management
router.get('/attribute-categories/:attributeCategoryId/values', getAttributeValues);
router.post('/attribute-categories/:attributeCategoryId/values', addAttributeValue);
router.delete('/attribute-categories/:attributeCategoryId/values/:valueId', removeAttributeValue);

export default router;