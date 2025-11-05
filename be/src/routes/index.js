import express from 'express';
//import productRoutes from './productsRoute.js';
import variantRoutes from './variantsRoute.js';
import attributesRoutes from './attributesRoute.js';

const router = express.Router();

//router.use('/users', userRoutes);
//router.use('/products', productRoutes);
router.use('/variants', variantRoutes);
router.use('/attributes', attributesRoutes);

export default router;
