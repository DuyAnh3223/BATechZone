/**
 * bundle.routes.js - Routes for PC Bundles
 * Handles both Admin and User routes
 */

import express from 'express';
import BundleController from '../controllers/bundle.controller.js';

const router = express.Router();

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// USER ROUTES (Public) - Must be defined first for specific paths
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * ✅ GET /api/bundles/:id/stock
 * Kiểm tra tồn kho bundle (User)
 */
router.get('/:id/stock', BundleController.checkStock);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SHARED ROUTES (Both Admin & User - differentiate in controller/middleware)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * ✅ GET /api/bundles
 * Lấy danh sách bundles
 * - User: Chỉ active bundles
 * - Admin: Tất cả bundles (khi có auth header)
 */
router.get('/', BundleController.getAdminBundles);

/**
 * ✅ GET /api/bundles/:id
 * Lấy chi tiết bundle
 */
router.get('/:id', BundleController.getBundleDetail);

/**
 * ✅ POST /api/bundles
 * Tạo bundle mới (Admin only)
 */
router.post('/', BundleController.createBundle);

/**
 * ✅ PUT /api/bundles/:id
 * Cập nhật bundle (Admin only)
 */
router.put('/:id', BundleController.updateBundle);

/**
 * ✅ DELETE /api/bundles/:id
 * Xóa bundle (Admin only)
 */
router.delete('/:id', BundleController.deleteBundle);

export default router;