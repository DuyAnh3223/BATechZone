import WarrantyService from '../services/warranty.service.js';

/**
 * Warranty Controller - View warranty information
 */
class WarrantyController {

    /**
     * GET /warranty/serial/:serialNumber
     * Get warranty info by serial number
     */
    async getBySerialNumber(req, res) {
        try {
            const { serialNumber } = req.params;
            const result = await WarrantyService.getWarrantyBySerialNumber(serialNumber);
            
            return res.status(200).json(result);
        } catch (error) {
            console.error('❌ Error in getBySerialNumber:', error);
            return res.status(404).json({
                success: false,
                message: error.message || 'Không tìm thấy thông tin bảo hành'
            });
        }
    }

    /**
     * GET /warranty/order-item/:orderItemId
     * Get warranties for an order item
     */
    async getByOrderItem(req, res) {
        try {
            const orderItemId = parseInt(req.params.orderItemId);
            const result = await WarrantyService.getWarrantiesByOrderItem(orderItemId);
            
            return res.status(200).json(result);
        } catch (error) {
            console.error('❌ Error in getByOrderItem:', error);
            return res.status(500).json({
                success: false,
                message: error.message || 'Không thể lấy thông tin bảo hành'
            });
        }
    }

    /**
     * GET /warranty/expiring
     * Get expiring warranties (for notifications)
     */
    async getExpiring(req, res) {
        try {
            const days = parseInt(req.query.days) || 30;
            const result = await WarrantyService.getExpiringWarranties(days);
            
            return res.status(200).json(result);
        } catch (error) {
            console.error('❌ Error in getExpiring:', error);
            return res.status(500).json({
                success: false,
                message: error.message || 'Không thể lấy danh sách bảo hành sắp hết hạn'
            });
        }
    }
}

export default new WarrantyController();
