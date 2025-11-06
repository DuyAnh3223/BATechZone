import express from 'express';
import { listCategories, listCategoriesSimple, createCategory, updateCategory, getCategoryById, deleteCategory } from '../controllers/adminCategoryController.js';

const router = express.Router();

// Route để admin lấy danh sách categories (có phân trang)
router.get('/categories', listCategories);

// Route để admin lấy danh sách categories đơn giản (cho dropdown)
router.get('/categories/simple', listCategoriesSimple);

// Route để admin tạo category mới
router.post('/categories', createCategory);

// Route để admin lấy thông tin category theo ID
router.get('/categories/:categoryId', getCategoryById);

// Route để admin cập nhật category
router.put('/categories/:categoryId', updateCategory);

// Route để admin xóa category
router.delete('/categories/:categoryId', deleteCategory);

export default router;

