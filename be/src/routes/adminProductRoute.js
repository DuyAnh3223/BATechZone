import express from 'express';
import { listProducts, createProduct, updateProduct, getProductById, listCategoriesSimple } from '../controllers/adminProductController.js';

const router = express.Router();

// Route để admin lấy danh sách products
router.get('/products', listProducts);

// Route để admin lấy danh sách categories đơn giản (cho dropdown trong form product)
router.get('/categories/simple', listCategoriesSimple);

// Route để admin tạo product mới
router.post('/products', createProduct);

// Route để admin lấy thông tin product theo ID
router.get('/products/:productId', getProductById);

// Route để admin cập nhật product
router.put('/products/:productId', updateProduct);

export default router;
