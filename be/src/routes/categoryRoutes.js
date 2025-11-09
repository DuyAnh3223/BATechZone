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
  removeCategoryAttribute
} from '../controllers/categoryController.js';

const router = express.Router();

router.get('/tree', getCategoryTree);
router.get('/simple', getSimpleCategories);
router.get('/', listCategories);
router.get('/:id', getCategory);
router.post('/', createCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

// Attribute management routes
router.get('/:id/attributes', getCategoryAttributes);
router.put('/:id/attributes', updateCategoryAttributes);
router.delete('/:id/attributes/:attributeId', removeCategoryAttribute);

export default router;