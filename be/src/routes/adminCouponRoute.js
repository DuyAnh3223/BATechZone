import express from 'express';
import { listCoupons, createCoupon, getCouponById, updateCoupon, deleteCoupon } from '../controllers/adminCouponController.js';

const router = express.Router();

router.get('/coupons', listCoupons);
router.post('/coupons', createCoupon);
router.get('/coupons/:couponId', getCouponById);
router.put('/coupons/:couponId', updateCoupon);
router.delete('/coupons/:couponId', deleteCoupon);

export default router;

