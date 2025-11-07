import express from 'express';
import categoryRoutes from './categoryRoutes.js';
import productRoutes from './productRoutes.js';
import variantRoutes from './variantRoutes.js';
import attributesRoutes from './attributeRoutes.js';
import attributeValueRoutes from './attributeValueRoutes.js';
import userAddressRoute from './userAddressRoute.js';
import couponRoutes from './couponRoutes.js';
import { createUser, updateUser, getUserById, listUsers } from '../controllers/authController.js';
import { listCoupons, createCoupon, getCouponById, updateCoupon, deleteCoupon } from '../controllers/couponController.js';
const router = express.Router();

//router.use('/users', userRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/variants', variantRoutes);
router.use('/attributes', attributesRoutes);
router.use('/attribute-values', attributeValueRoutes);
router.use('/addresses', userAddressRoute);
router.use('/coupons', couponRoutes);

const adminUserRouter = express.Router();
adminUserRouter.get('/users', listUsers);
adminUserRouter.post('/users', createUser);
adminUserRouter.get('/users/:userId', getUserById);
adminUserRouter.put('/users/:userId', updateUser);

const adminCouponRouter = express.Router();
adminCouponRouter.get('/coupons', listCoupons);
adminCouponRouter.post('/coupons', createCoupon);
adminCouponRouter.get('/coupons/:couponId', getCouponById);
adminCouponRouter.put('/coupons/:couponId', updateCoupon);
adminCouponRouter.delete('/coupons/:couponId', deleteCoupon);

export default router;
export { adminUserRouter, adminCouponRouter };
