import express from 'express';
import { listCoupons, createCoupon, getCouponById, updateCoupon, deleteCoupon } from '../controllers/couponController.js';

const router = express.Router();

router.get('/', listCoupons);
router.post('/', createCoupon);
router.get('/:couponId', getCouponById);
router.put('/:couponId', updateCoupon);
router.delete('/:couponId', deleteCoupon);

export default router;

