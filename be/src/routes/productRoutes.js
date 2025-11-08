import express from 'express';
import { createProduct,getProduct,updateProduct, deleteProduct,listProducts,increaseProductView} from '../controllers/productController.js';
import { getVariantsByProduct, createVariantForProduct, getProductAttributes, getProductVariantMappings, updateVariantMappings, getVariantImages, addVariantImage, uploadVariantImages, deleteVariantImage } from '../controllers/variantController.js';
const router = express.Router();


router.get('/', listProducts);

// Product variants routes (must be before /:id route to avoid conflict)
router.get('/:productId/variants', getVariantsByProduct);
router.post('/:productId/variants', createVariantForProduct);
router.get('/:productId/attributes', getProductAttributes);
router.get('/:productId/variant-mappings', getProductVariantMappings);

router.get('/:id', getProduct);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
router.put('/:id/view', increaseProductView);


export default router;