import express from 'express';
import ProductController from '../controllers/product.controller.js';
import { uploadProductImage } from '../middlewares/upload.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Storage tạm thời cho variant images khi tạo product
// File sẽ được copy vào thư mục variants/{variant_id} sau khi tạo variant
const tempStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const tempDir = path.join(process.cwd(), 'uploads', 'temp');
        cb(null, tempDir);
    },
    filename: function (req, file, cb) {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `temp-${unique}-${file.originalname}`);
    }
});

const fileFilter = (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Định dạng ảnh không được hỗ trợ'));
};

const uploadVariantImagesForProduct = multer({
    storage: tempStorage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
}).fields([
    { name: 'image', maxCount: 1 },
    { name: 'default', maxCount: 10 },
    { name: 'variant_0', maxCount: 10 },
    { name: 'variant_1', maxCount: 10 },
    { name: 'variant_2', maxCount: 10 },
    { name: 'variant_3', maxCount: 10 },
    { name: 'variant_4', maxCount: 10 },
    { name: 'variant_5', maxCount: 10 },
    { name: 'variant_6', maxCount: 10 },
    { name: 'variant_7', maxCount: 10 },
    { name: 'variant_8', maxCount: 10 },
    { name: 'variant_9', maxCount: 10 }
]);

/**
 * Product Routes - Sử dụng ProductService Layer
 */

// ============ SPECIAL ROUTES (phải đặt trước dynamic routes) ============

// GET /products/with-attributes - Lấy products với đầy đủ attributes (cho filtering)
router.get('/with-attributes', ProductController.getProductsWithAttributes);

// GET /products/build-pc - Lấy products cho Build PC
router.get('/build-pc', ProductController.getProductsForBuildPC);

// GET /products/filters/options - Lấy filter options cho category
router.get('/filters/options', ProductController.getFilterOptions);

// ============ BASIC CRUD với Service Layer ============

// GET /products/ - Lấy tất cả sản phẩm với filter 
router.get('/', ProductController.getAllProducts);

// GET /products/:id - Lấy sản phẩm theo ID 
router.get('/:id', ProductController.getProductById);

// POST /products/- Tạo sản phẩm mới sử dụng ProductService (có upload ảnh product + variant images)
router.post(
    '/',
    uploadVariantImagesForProduct,
    ProductController.createProduct
);

// PUT /products/:id - Cập nhật sản phẩm sử dụng ProductService (có upload ảnh)
router.put(
    '/:id',
    uploadProductImage.single('image'),
    ProductController.updateProduct
);

// DELETE /products/:id - Xóa mềm sản phẩm (Service version)
router.delete('/:id', ProductController.deleteProduct);

// ============ VARIANT MANAGEMENT ============

// GET /products/:id/variants - Lấy danh sách variants của sản phẩm
router.get('/:id/variants', ProductController.getProductVariants);

// ============ ADDITIONAL FEATURES ============

// PUT /products/:id/view - Tăng view count cho sản phẩm
router.put('/:id/view', ProductController.increaseProductView);

export default router;
