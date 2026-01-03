import express from 'express';

import attributesRoutes from './attributeRoutes.js';
import attributeValueRoutes from './attributeValueRoutes.js';
import cartItemRoutes from './cartItemRoutes.js';
import cartRoutes from './cartRoutes.js';
//import categoryRoutes from './categoryRoutes.js';
import categoryRoutes from './category.routes.js';
import couponRoutes from './couponRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';
import installmentRoutes from './installmentRoutes.js';
import installmentPolicyRoutes from './installmentPolicyRoutes.js';
import orderItemRoutes from './orderItemRoutes.js';
import orderRoutes from './orderRoutes.js';
import productRoutes from './productRoutes.js';
import addressRoutes from './addressRoutes.js';
import profileRoutes from './profileRoutes.js';
import userRoutes from './userRoutes.js';
import variantRoutes from './variantRoutes.js';
import variantImageRoutes from './variantImageRoutes.js';
import variantSerialRoutes from './variantSerial.routes.js';
import paymentRoutes from './paymentRoutes.js';
//import postRoutes from './postRoutes.js';
//import articleRoutes from './articleRoutes.js';
import warrantyRoutes from './warranty.routes.js';
import serviceRequestRoutes from './serviceRequest.routes.js';




const router = express.Router();
router.use('/attributes', attributesRoutes);
router.use('/attribute-values', attributeValueRoutes);
router.use('/cart-items', cartItemRoutes);
router.use('/carts', cartRoutes);
//router.use('/categories', categoryRoutes);
router.use('/categories', categoryRoutes);
router.use('/coupons', couponRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/installments', installmentRoutes);
router.use('/installment-policies', installmentPolicyRoutes);
router.use('/order-items', orderItemRoutes);
router.use('/orders', orderRoutes);
router.use('/products', productRoutes);
router.use('/addresses', addressRoutes);
router.use('/user/profile', profileRoutes);
router.use('/users', userRoutes);
router.use('/variants', variantRoutes);
router.use('/variant-images', variantImageRoutes);
router.use('/variant-serials', variantSerialRoutes);
router.use('/payments', paymentRoutes);
//router.use('/posts', postRoutes);
//router.use('/articles', articleRoutes);
router.use('/warranty', warrantyRoutes);
router.use('/service-requests', serviceRequestRoutes);




export default router;

