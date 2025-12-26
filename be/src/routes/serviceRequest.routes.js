import express from 'express';
import ServiceRequestController from '../controllers/serviceRequest.controller.js';
import { requireUserAuth, requireAdminAuth } from '../middlewares/authMiddleware.js';
import { uploadWarrantyImage } from '../middlewares/upload.js';

const router = express.Router();

/**
 * Service Request Routes (Warranty Claims)
 */

// ============ USER ROUTES ============
// All user routes require user authentication

// GET /service-requests/my-products - Get user's products eligible for warranty claims
router.get('/my-products', requireUserAuth, ServiceRequestController.getMyProducts);

// POST /service-requests - Create warranty claim request (with image upload)
router.post(
    '/', 
    requireUserAuth, 
    uploadWarrantyImage.array('images', 5), // Max 5 images
    ServiceRequestController.createRequest
);

// GET /service-requests/my-requests - Get user's service requests
router.get('/my-requests', requireUserAuth, ServiceRequestController.getMyRequests);

// GET /service-requests/:requestId - Get service request detail
router.get('/:requestId', requireUserAuth, ServiceRequestController.getRequestDetail);

// PATCH /service-requests/:requestId/cancel - Cancel service request
router.patch('/:requestId/cancel', requireUserAuth, ServiceRequestController.cancelRequest);

// ============ PUBLIC ROUTES (No Auth) ============

// GET /service-requests/public/search-product - Search products by serial or phone (Public)
router.get('/public/search-product', ServiceRequestController.searchProduct);

// POST /service-requests/public/walk-in - Create warranty request for walk-in customer (Public)
router.post(
    '/public/walk-in',
    uploadWarrantyImage.array('images', 5), // Max 5 images
    ServiceRequestController.createWalkInRequest
);

// ============ ADMIN ROUTES ============
// All admin routes require admin authentication

// GET /service-requests/admin/search-product - Search products by serial or phone
router.get('/admin/search-product', requireAdminAuth, ServiceRequestController.searchProduct);

// POST /service-requests/admin/walk-in - Create warranty request for walk-in customer
router.post(
    '/admin/walk-in',
    requireAdminAuth,
    uploadWarrantyImage.array('images', 5), // Max 5 images
    ServiceRequestController.createWalkInRequest
);

// GET /service-requests/admin/requests - Get all warranty requests with filters
router.get('/admin/requests', requireAdminAuth, ServiceRequestController.getAllRequests);

// GET /service-requests/admin/statistics - Get warranty statistics
router.get('/admin/statistics', requireAdminAuth, ServiceRequestController.getStatistics);

// GET /service-requests/admin/export - Export warranty data to Excel
router.get('/admin/export', requireAdminAuth, ServiceRequestController.exportData);

// GET /service-requests/admin/requests/:requestId - Get warranty request detail (admin)
router.get('/admin/requests/:requestId', requireAdminAuth, ServiceRequestController.getRequestDetailAdmin);

// PATCH /service-requests/admin/requests/:requestId/status - Update warranty request status
router.patch('/admin/requests/:requestId/status', requireAdminAuth, ServiceRequestController.updateStatus);

// POST /service-requests/admin/requests/:requestId/inspect - Inspect and evaluate warranty request
router.post('/admin/requests/:requestId/inspect', requireAdminAuth, ServiceRequestController.inspectRequest);

// PATCH /service-requests/admin/requests/:requestId/priority - Update warranty request priority
router.patch('/admin/requests/:requestId/priority', requireAdminAuth, ServiceRequestController.updatePriority);

// POST /service-requests/admin/requests/:requestId/notes - Add admin note
router.post('/admin/requests/:requestId/notes', requireAdminAuth, ServiceRequestController.addNote);

// POST /service-requests/admin/requests/:requestId/sms - Send SMS notification
router.post('/admin/requests/:requestId/sms', requireAdminAuth, ServiceRequestController.sendSMS);

export default router;
