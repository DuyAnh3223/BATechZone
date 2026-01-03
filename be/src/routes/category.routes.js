import express from 'express';
import CategoryController from '../controllers/category.controller.js';
import { uploadCategoryImage } from '../middlewares/upload.js';

const router = express.Router();

/**
 * Category Routes
 */

// ============ BASIC CRUD ============

// GET /categories - Lấy tất cả danh mục
router.get('/', CategoryController.getAllCategories);

// GET /categories/:id - Lấy danh mục theo ID
router.get('/:id', CategoryController.getCategoryById);

// POST /categories - Tạo danh mục mới (có upload ảnh)
router.post(
    '/',
    uploadCategoryImage.single('image'),
    CategoryController.createCategory
);

// PUT /categories/:id - Cập nhật danh mục (có upload ảnh)
router.put(
    '/:id',
    uploadCategoryImage.single('image'),
    CategoryController.updateCategory
);

// DELETE /categories/:id - Xóa danh mục
router.delete('/:id', CategoryController.deleteCategory);

// ============ QUẢN LÝ THUỘC TÍNH ============

// GET /categories/:id/attributes - Lấy danh sách thuộc tính của danh mục
router.get('/:id/attributes', CategoryController.getAttributesByCategory);

// POST /categories/:id/attributes - Thêm thuộc tính mới cho danh mục
router.post('/:id/attributes', CategoryController.createAttributeForCategory);

// DELETE /categories/:id/attributes/:attributeId - Xóa thuộc tính khỏi danh mục
router.delete('/:id/attributes/:attributeId', CategoryController.deleteAttributeForCategory);

// PUT /categories/:id/attributes/:attributeId/variant - Cập nhật isVariant cho thuộc tính
router.put('/:id/attributes/:attributeId/variant', CategoryController.updateAttributeIsVariant);

// ============ QUẢN LÝ GIÁ TRỊ THUỘC TÍNH ============

// GET /categories/:id/attributes/:attributeId/values - Lấy giá trị thuộc tính
router.get('/:id/attributes/:attributeId/values', CategoryController.getAttributeValuesForCategory);

// POST /categories/:id/attributes/:attributeId/values - Thêm giá trị thuộc tính mới
router.post('/:id/attributes/:attributeId/values', CategoryController.createAttributeValueForCategory);

// DELETE /categories/:id/attributes/:attributeId/values/:valueId - Xóa giá trị thuộc tính
router.delete('/:id/attributes/:attributeId/values/:valueId', CategoryController.deleteAttributeValueForCategory);

export default router;
