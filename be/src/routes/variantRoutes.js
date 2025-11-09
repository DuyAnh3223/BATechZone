import express from 'express';
import { 
  listVariants,
  getVariant,
  createVariant,
  updateVariant, 
  deleteVariant, 
  updateVariantMappings, 
  getVariantImages, 
  addVariantImage, 
  uploadVariantImages, 
  deleteVariantImage 
} from '../controllers/variantController.js';

const router = express.Router();

// Ví dụ: /variants/123/images sẽ match route cụ thể này, không match /:id
router.put('/:variantId/mappings', updateVariantMappings);
router.get('/:variantId/images', getVariantImages);
router.post('/:variantId/images', addVariantImage);
router.post('/:variantId/images/upload-multiple', uploadVariantImages);
router.delete('/images/:imageId', deleteVariantImage);

// Routes generic CRUD - đặt sau routes cụ thể
router.get('/', listVariants);
router.get('/:id', getVariant);
router.post('/', createVariant);
router.put('/:id', updateVariant);
router.delete('/:id', deleteVariant);

export default router;