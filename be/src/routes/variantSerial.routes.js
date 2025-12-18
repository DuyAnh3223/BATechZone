import express from 'express';
import VariantSerialController from '../controllers/variantSerial.controller.js';

const router = express.Router();

/**
 * Variant Serial Routes
 * Base path: /api/serials
 */

// ============================================
// CRUD Operations
// ============================================

/**
 * @route   GET /api/serials
 * @desc    Search serials with filters and pagination
 * @query   variant_id, status, order_item_id, serial_number, page, limit
 * @access  Private
 */
router.get('/', VariantSerialController.searchSerials);

/**
 * @route   POST /api/serials
 * @desc    Create new serial
 * @body    { variant_id, serial_number, status? }
 * @access  Private
 */
router.post('/', VariantSerialController.createSerial);

/**
 * @route   POST /api/serials/bulk
 * @desc    Bulk create serials
 * @body    { variant_id, serial_numbers: [] }
 * @access  Private
 */
router.post('/bulk', VariantSerialController.bulkCreateSerials);

/**
 * @route   GET /api/serials/:id
 * @desc    Get serial by ID
 * @param   id - Serial ID
 * @access  Private
 */
router.get('/:id', VariantSerialController.getSerialById);

/**
 * @route   PUT /api/serials/:id
 * @desc    Update serial
 * @param   id - Serial ID
 * @body    { status?, order_item_id?, warranty_id? }
 * @access  Private
 */
router.put('/:id', VariantSerialController.updateSerial);

/**
 * @route   DELETE /api/serials/:id
 * @desc    Delete serial (only if not sold)
 * @param   id - Serial ID
 * @access  Private
 */
router.delete('/:id', VariantSerialController.deleteSerial);

// ============================================
// Query Operations
// ============================================

/**
 * @route   GET /api/serials/number/:serialNumber
 * @desc    Get serial by serial number
 * @param   serialNumber - Serial number
 * @access  Private
 */
router.get('/number/:serialNumber', VariantSerialController.getSerialByNumber);

/**
 * @route   GET /api/serials/variant/:variantId
 * @desc    Get all serials by variant ID
 * @param   variantId - Variant ID
 * @query   status? - Filter by status
 * @access  Private
 */
router.get('/variant/:variantId', VariantSerialController.getSerialsByVariant);

/**
 * @route   GET /api/serials/inventory/:variantId
 * @desc    Get inventory summary for variant
 * @param   variantId - Variant ID
 * @access  Private
 */
router.get('/inventory/:variantId', VariantSerialController.getInventorySummary);

// ============================================
// Order Operations
// ============================================

/**
 * @route   POST /api/serials/reserve
 * @desc    Reserve serials for order
 * @body    { variant_id, order_item_id, quantity }
 * @access  Private
 */
router.post('/reserve', VariantSerialController.reserveSerials);

/**
 * @route   POST /api/serials/confirm-sale/:orderItemId
 * @desc    Confirm sale (reserved -> sold)
 * @param   orderItemId - Order Item ID
 * @access  Private
 */
router.post('/confirm-sale/:orderItemId', VariantSerialController.confirmSale);

/**
 * @route   POST /api/serials/cancel-reservation/:orderItemId
 * @desc    Cancel reservation (reserved -> in_stock)
 * @param   orderItemId - Order Item ID
 * @access  Private
 */
router.post('/cancel-reservation/:orderItemId', VariantSerialController.cancelReservation);

// ============================================
// RMA (Return Merchandise Authorization)
// ============================================

/**
 * @route   POST /api/serials/rma
 * @desc    Process RMA (sold -> rma_in)
 * @body    { serial_number, warranty_id }
 * @access  Private
 */
router.post('/rma', VariantSerialController.processRMA);

/**
 * @route   POST /api/serials/rma/complete
 * @desc    Complete RMA (rma_in -> rma_done)
 * @body    { serial_number }
 * @access  Private
 */
router.post('/rma/complete', VariantSerialController.completeRMA);

// ============================================
// Other Operations
// ============================================

/**
 * @route   POST /api/serials/:id/scrap
 * @desc    Scrap serial (mark as scrapped)
 * @param   id - Serial ID
 * @access  Private
 */
router.post('/:id/scrap', VariantSerialController.scrapSerial);

export default router;