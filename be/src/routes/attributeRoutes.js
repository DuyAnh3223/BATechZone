import express from 'express';
import { 
  createAttribute,
  getAttribute, 
  deleteAttribute,
  listAttributes,
  getAttributesByType,
  updateAttributeCategories,
  getAttributeCategories,
  removeAttributeCategory
} from '../controllers/attributeController.js';
const router = express.Router();

router.get('/', listAttributes);
router.get('/:id', getAttribute);
router.post('/', createAttribute);
router.delete('/:id', deleteAttribute);

// Category management routes
router.get('/:id/categories', getAttributeCategories);
router.put('/:id/categories', updateAttributeCategories);
router.delete('/:id/categories/:categoryId', removeAttributeCategory);

export default router;