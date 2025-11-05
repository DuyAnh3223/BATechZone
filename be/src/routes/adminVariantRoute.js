import express from 'express';
import {
  listVariants, createVariant, updateVariant, deleteVariant,
  listAttributes, createAttribute, deleteAttribute,
  listVariantMappings, setVariantMappings,
  listVariantImages, addVariantImage, addVariantImageUpload, addVariantImagesUploadMultiple, deleteVariantImage,
} from '../controllers/adminVariantController.js';
import { uploadVariantImage } from '../middleware/upload.js';

const router = express.Router();

// Variants
router.get('/products/:productId/variants', listVariants);
router.post('/products/:productId/variants', createVariant);
router.put('/variants/:variantId', updateVariant);
router.delete('/variants/:variantId', deleteVariant);

// Attributes per product
router.get('/products/:productId/attributes', listAttributes);
router.post('/products/:productId/attributes', createAttribute);
router.delete('/attributes/:attributeId', deleteAttribute);

// Variant-Attribute mappings
router.get('/products/:productId/variant-mappings', listVariantMappings);
router.put('/variants/:variantId/mappings', setVariantMappings);

// Variant images (URL-based and file upload)
router.get('/variants/:variantId/images', listVariantImages);
router.post('/variants/:variantId/images', addVariantImage); // url-based (optional)
router.post('/variants/:variantId/images/upload', uploadVariantImage.single('image'), addVariantImageUpload); // single file
router.post('/variants/:variantId/images/upload-multiple', uploadVariantImage.array('images', 10), addVariantImagesUploadMultiple); // multiple files
router.delete('/images/:imageId', deleteVariantImage);

export default router;
