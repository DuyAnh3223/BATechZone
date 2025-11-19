import express from 'express';

import attributesRoutes from './attributeRoutes.js';
import attributeValueRoutes from './attributeValueRoutes.js';
import cartItemRoutes from './cartItemRoutes.js';
import cartRoutes from './cartRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import couponRoutes from './couponRoutes.js';
import installmentRoutes from './installmentRoutes.js';
import orderItemRoutes from './orderItemRoutes.js';
import orderRoutes from './orderRoutes.js';
import productRoutes from './productRoutes.js';
import addressRoutes from './addressRoutes.js';
import profileRoutes from './profileRoutes.js';
import userRoutes from './userRoutes.js';
import variantRoutes from './variantRoutes.js';
import variantImageRoutes from './variantImageRoutes.js';




const router = express.Router();
router.use('/attributes', attributesRoutes);
router.use('/attribute-values', attributeValueRoutes);
router.use('/cart-items', cartItemRoutes);
router.use('/carts', cartRoutes);
router.use('/categories', categoryRoutes);
router.use('/coupons', couponRoutes);
router.use('/installments', installmentRoutes);
router.use('/order-items', orderItemRoutes);
router.use('/orders', orderRoutes);
router.use('/products', productRoutes);
router.use('/addresses', addressRoutes);
router.use('/user/profile', profileRoutes);
router.use('/users', userRoutes);
router.use('/variants', variantRoutes);
router.use('/variant-images', variantImageRoutes);




export default router;

