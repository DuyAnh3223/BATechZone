import express from 'express';
import WarrantyController from '../controllers/warranty.controller.js';
import { requireUserAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * Warranty Information Routes
 * View warranty details (not for claims - use service-requests for that)
 */

// GET /warranty/serial/:serialNumber - Get warranty info by serial number
router.get('/serial/:serialNumber', WarrantyController.getBySerialNumber);

// GET /warranty/order-item/:orderItemId - Get warranties for order item
router.get('/order-item/:orderItemId', requireUserAuth, WarrantyController.getByOrderItem);

// GET /warranty/expiring - Get expiring warranties (for admin notifications)
router.get('/expiring', requireUserAuth, WarrantyController.getExpiring);

export default router;
