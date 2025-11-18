import express from 'express';
import {
  uploadVariantImage,
  getVariantImages,
  getPrimaryImage,
  setPrimaryImage,
  updateImageMetadata,
  deleteVariantImage,
  bulkUploadImages
} from '../controllers/variantImageController.js';
import { uploadVariantImage as uploadMiddleware } from '../middlewares/upload.js';

const router = express.Router();

// Get all images of a variant
router.get('/variants/:variantId/images', getVariantImages);

// Get primary image of a variant
router.get('/variants/:variantId/images/primary', getPrimaryImage);

// Upload single image for variant
router.post('/variants/:variantId/images', uploadMiddleware.single('image'), uploadVariantImage);

// Bulk upload images for variant
router.post('/variants/:variantId/images/bulk', uploadMiddleware.array('images', 10), bulkUploadImages);

// Set image as primary
router.patch('/images/:imageId/set-primary', setPrimaryImage);

// Update image metadata (alt_text, display_order)
router.patch('/images/:imageId', updateImageMetadata);

// Delete image
router.delete('/images/:imageId', deleteVariantImage);

export default router;
