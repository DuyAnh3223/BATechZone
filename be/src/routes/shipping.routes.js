import express from 'express';
import {
  getProvinces,
  getDistricts,
  getWards,
  getAvailableServices,
  calculateShippingFee,
  calculateDeliveryTime,
} from '../controllers/shipping.controller.js';

const router = express.Router();

// Lấy danh sách tỉnh/thành phố
router.get('/provinces', getProvinces);

// Lấy danh sách quận/huyện theo tỉnh
router.get('/districts/:provinceId', getDistricts);

// Lấy danh sách phường/xã theo quận
router.get('/wards/:districtId', getWards);

// Lấy danh sách dịch vụ vận chuyển khả dụng
router.post('/services', getAvailableServices);

// Tính phí vận chuyển
router.post('/calculate-fee', calculateShippingFee);

// Tính thời gian dự kiến giao hàng
router.post('/delivery-time', calculateDeliveryTime);

export default router;