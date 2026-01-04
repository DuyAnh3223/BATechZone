import express from 'express';
import ProductController from '../controllers/product.controller.js';
import { uploadProductImage } from '../middlewares/upload.js';

const router = express.Router();

/**
 * Product Routes - Sử dụng ProductService Layer
 */

// ============ BASIC CRUD với Service Layer ============

// GET /products/ - Lấy tất cả sản phẩm với filter 
router.get('/', ProductController.getAllProducts);

// GET /products/:id - Lấy sản phẩm theo ID 
router.get('/:id', ProductController.getProductById);

// POST /products/service - Tạo sản phẩm mới sử dụng ProductService (có upload ảnh)
router.post(
    '/',
    uploadProductImage.single('image'),
    ProductController.createProduct
);

// PUT /products/:id - Cập nhật sản phẩm sử dụng ProductService (có upload ảnh)
router.put(
    '/:id',
    uploadProductImage.single('image'),
    ProductController.updateProductWithService
);

// DELETE /products/:id - Xóa mềm sản phẩm (Service version)
router.delete('/:id', ProductController.deleteProductWithService);

// ============ VARIANT MANAGEMENT ============

// GET /products/:id/variants - Lấy danh sách variants của sản phẩm
router.get('/:id/variants', ProductController.getProductVariants);

export default router;
