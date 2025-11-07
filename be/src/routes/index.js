import express from 'express';
import categoryRoutes from './categoryRoutes.js';
import productRoutes from './productRoutes.js';
import variantRoutes from './variantRoutes.js';
import attributesRoutes from './attributeRoutes.js';
import attributeValueRoutes from './attributeValueRoutes.js';
import userAddressRoute from './userAddressRoute.js';
import userProfileRoute from './userProfileRoute.js';
import couponRoutes from './couponRoutes.js';
import userRoutes from './userRoutes.js';
const router = express.Router();

//router.use('/users', userRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/variants', variantRoutes);
router.use('/attributes', attributesRoutes);
router.use('/attribute-values', attributeValueRoutes);
router.use('/addresses', userAddressRoute);
router.use('/user/profile', userProfileRoute);
router.use('/coupons', couponRoutes);
router.use('/users', userRoutes);

export default router;

