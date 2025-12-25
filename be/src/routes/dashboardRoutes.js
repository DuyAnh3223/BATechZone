import express from 'express';
import dashboardController from '../controllers/dashboardController.js';
import { requireAdminAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

// All dashboard routes require admin authentication
router.use(requireAdminAuth);

// GET /api/dashboard/summary - Get summary statistics
router.get('/summary', dashboardController.getSummary);

// GET /api/dashboard/recent-orders - Get recent orders
router.get('/recent-orders', dashboardController.getRecentOrders);

// GET /api/dashboard/top-selling - Get top selling products
router.get('/top-selling', dashboardController.getTopSelling);

// GET /api/dashboard/order-status - Get order status distribution
router.get('/order-status', dashboardController.getOrderStatusDistribution);

// GET /api/dashboard/category-distribution - Get category distribution
router.get('/category-distribution', dashboardController.getCategoryDistribution);

// GET /api/dashboard/revenue - Get revenue by period
router.get('/revenue', dashboardController.getRevenueByPeriod);

// GET /api/dashboard/top-viewed - Get top viewed variants
router.get('/top-viewed', dashboardController.getTopViewedVariants);

// GET /api/dashboard/top-users - Get top active users
router.get('/top-users', dashboardController.getTopActiveUsers);

export default router;
