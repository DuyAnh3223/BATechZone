import ServiceRequestService from '../services/serviceRequest.service.js';
import { getPublicUrlForWarranty } from '../middlewares/upload.js';

/**
 * Service Request Controller - Handle warranty claim requests
 */
class ServiceRequestController {

    /**
     * GET /service-requests/my-products
     * Get user's products eligible for warranty claims
     */
    async getMyProducts(req, res) {
        try {
            const userId = req.user.user_id;
            const result = await ServiceRequestService.getMyProducts(userId);
            
            return res.status(200).json(result);
        } catch (error) {
            console.error('❌ Error in getMyProducts:', error);
            return res.status(500).json({
                success: false,
                message: error.message || 'Không thể lấy danh sách sản phẩm'
            });
        }
    }

    /**
     * POST /service-requests
     * Create warranty claim request
     */
    async createRequest(req, res) {
        try {
            const userId = req.user.user_id;
            const requestData = req.body;
            
            // Get uploaded image URLs
            const imageUrls = req.files ? req.files.map(file => {
                return getPublicUrlForWarranty(file.filename);
            }) : [];

            const result = await ServiceRequestService.createWarrantyRequest(
                userId, 
                requestData, 
                imageUrls
            );
            
            return res.status(201).json(result);
        } catch (error) {
            console.error('❌ Error in createRequest:', error);
            return res.status(400).json({
                success: false,
                message: error.message || 'Không thể tạo yêu cầu bảo hành'
            });
        }
    }

    /**
     * GET /service-requests/my-requests
     * Get user's service requests
     */
    async getMyRequests(req, res) {
        try {
            const userId = req.user.user_id;
            const filters = {
                status: req.query.status,
                limit: req.query.limit
            };

            const result = await ServiceRequestService.getMyRequests(userId, filters);
            
            return res.status(200).json(result);
        } catch (error) {
            console.error('❌ Error in getMyRequests:', error);
            return res.status(500).json({
                success: false,
                message: error.message || 'Không thể lấy danh sách yêu cầu'
            });
        }
    }

    /**
     * GET /service-requests/:requestId
     * Get service request detail
     */
    async getRequestDetail(req, res) {
        try {
            const userId = req.user.user_id;
            const requestId = parseInt(req.params.requestId);

            const result = await ServiceRequestService.getRequestDetail(userId, requestId);
            
            return res.status(200).json(result);
        } catch (error) {
            console.error('❌ Error in getRequestDetail:', error);
            const statusCode = error.message.includes('không tồn tại') ? 404 :
                               error.message.includes('không có quyền') ? 403 : 500;
            
            return res.status(statusCode).json({
                success: false,
                message: error.message || 'Không thể lấy chi tiết yêu cầu'
            });
        }
    }

    /**
     * PATCH /service-requests/:requestId/cancel
     * Cancel service request
     */
    async cancelRequest(req, res) {
        try {
            const userId = req.user.user_id;
            const requestId = parseInt(req.params.requestId);
            const { reason } = req.body;

            const result = await ServiceRequestService.cancelRequest(userId, requestId, reason);
            
            return res.status(200).json(result);
        } catch (error) {
            console.error('❌ Error in cancelRequest:', error);
            const statusCode = error.message.includes('không tồn tại') ? 404 :
                               error.message.includes('không có quyền') ? 403 :
                               error.message.includes('Không thể hủy') ? 400 : 500;
            
            return res.status(statusCode).json({
                success: false,
                message: error.message || 'Không thể hủy yêu cầu'
            });
        }
    }

    // ============ ADMIN METHODS ============

    /**
     * GET /admin/warranty/search-product
     * Search products by serial or phone for walk-in customers
     */
    async searchProduct(req, res) {
        try {
            const { serial, phone } = req.query;

            if (!serial && !phone) {
                return res.status(400).json({
                    success: false,
                    message: 'Vui lòng nhập serial hoặc số điện thoại'
                });
            }

            const searchType = serial ? 'serial' : 'phone';
            const searchValue = serial || phone;

            const result = await ServiceRequestService.searchProductForWarranty(searchType, searchValue);
            
            return res.status(result.success ? 200 : 404).json(result);
        } catch (error) {
            console.error('❌ Error in searchProduct:', error);
            return res.status(500).json({
                success: false,
                message: error.message || 'Không thể tìm kiếm sản phẩm'
            });
        }
    }

    /**
     * POST /admin/warranty/walk-in
     * Create warranty request for walk-in customer
     */
    async createWalkInRequest(req, res) {
        try {
            const requestData = req.body;
            
            // Get uploaded image URLs
            const imageUrls = req.files ? req.files.map(file => {
                return getPublicUrlForWarranty(file.filename);
            }) : [];

            const result = await ServiceRequestService.createWalkInRequest(requestData, imageUrls);
            
            return res.status(201).json(result);
        } catch (error) {
            console.error('❌ Error in createWalkInRequest:', error);
            return res.status(400).json({
                success: false,
                message: error.message || 'Không thể tạo yêu cầu bảo hành'
            });
        }
    }

    /**
     * GET /admin/warranty/requests
     * Get all warranty requests with filters (Admin)
     */
    async getAllRequests(req, res) {
        try {
            const filters = {
                status: req.query.status,
                priority: req.query.priority,
                request_type: req.query.request_type,
                search: req.query.search,
                limit: req.query.limit,
                offset: req.query.offset
            };

            const result = await ServiceRequestService.getAllRequests(filters);
            
            return res.status(200).json(result);
        } catch (error) {
            console.error('❌ Error in getAllRequests:', error);
            return res.status(500).json({
                success: false,
                message: error.message || 'Không thể lấy danh sách yêu cầu'
            });
        }
    }

    /**
     * GET /admin/warranty/requests/:requestId
     * Get warranty request detail (Admin - no ownership check)
     */
    async getRequestDetailAdmin(req, res) {
        try {
            const requestId = parseInt(req.params.requestId);

            const result = await ServiceRequestService.getRequestDetailAdmin(requestId);
            
            return res.status(200).json(result);
        } catch (error) {
            console.error('❌ Error in getRequestDetailAdmin:', error);
            const statusCode = error.message.includes('không tồn tại') ? 404 : 500;
            
            return res.status(statusCode).json({
                success: false,
                message: error.message || 'Không thể lấy chi tiết yêu cầu'
            });
        }
    }

    /**
     * PATCH /admin/warranty/requests/:requestId/status
     * Update warranty request status
     */
    async updateStatus(req, res) {
        try {
            const requestId = parseInt(req.params.requestId);
            const statusData = req.body;

            if (!statusData.status) {
                return res.status(400).json({
                    success: false,
                    message: 'Trạng thái mới là bắt buộc'
                });
            }

            const result = await ServiceRequestService.updateStatus(requestId, statusData);
            
            return res.status(200).json(result);
        } catch (error) {
            console.error('❌ Error in updateStatus:', error);
            const statusCode = error.message.includes('không tồn tại') ? 404 : 400;
            
            return res.status(statusCode).json({
                success: false,
                message: error.message || 'Không thể cập nhật trạng thái'
            });
        }
    }

    /**
     * POST /admin/warranty/requests/:requestId/inspect
     * Inspect and evaluate warranty request
     */
    async inspectRequest(req, res) {
        try {
            const requestId = parseInt(req.params.requestId);
            const inspectionData = req.body;

            if (!inspectionData.decision || !['accept', 'reject'].includes(inspectionData.decision)) {
                return res.status(400).json({
                    success: false,
                    message: 'Quyết định kiểm tra không hợp lệ (accept/reject)'
                });
            }

            if (inspectionData.decision === 'reject' && !inspectionData.rejection_reason) {
                return res.status(400).json({
                    success: false,
                    message: 'Lý do từ chối là bắt buộc'
                });
            }

            const result = await ServiceRequestService.inspectRequest(requestId, inspectionData);
            
            return res.status(200).json(result);
        } catch (error) {
            console.error('❌ Error in inspectRequest:', error);
            const statusCode = error.message.includes('không tồn tại') ? 404 : 400;
            
            return res.status(statusCode).json({
                success: false,
                message: error.message || 'Không thể kiểm tra yêu cầu'
            });
        }
    }

    /**
     * PATCH /admin/warranty/requests/:requestId/priority
     * Update warranty request priority
     */
    async updatePriority(req, res) {
        try {
            const requestId = parseInt(req.params.requestId);
            const { priority } = req.body;

            if (!priority) {
                return res.status(400).json({
                    success: false,
                    message: 'Mức độ ưu tiên là bắt buộc'
                });
            }

            const result = await ServiceRequestService.updatePriority(requestId, priority);
            
            return res.status(200).json(result);
        } catch (error) {
            console.error('❌ Error in updatePriority:', error);
            return res.status(400).json({
                success: false,
                message: error.message || 'Không thể cập nhật mức độ ưu tiên'
            });
        }
    }

    /**
     * POST /admin/warranty/requests/:requestId/notes
     * Add admin note to warranty request
     */
    async addNote(req, res) {
        try {
            const requestId = parseInt(req.params.requestId);
            const { note } = req.body;

            if (!note || !note.trim()) {
                return res.status(400).json({
                    success: false,
                    message: 'Nội dung ghi chú là bắt buộc'
                });
            }

            const adminName = req.user.username || 'Admin';

            const result = await ServiceRequestService.addAdminNote(requestId, note, adminName);
            
            return res.status(200).json(result);
        } catch (error) {
            console.error('❌ Error in addNote:', error);
            return res.status(400).json({
                success: false,
                message: error.message || 'Không thể thêm ghi chú'
            });
        }
    }

    /**
     * POST /admin/warranty/requests/:requestId/sms
     * Send SMS notification to customer
     */
    async sendSMS(req, res) {
        try {
            const requestId = parseInt(req.params.requestId);
            const { message } = req.body;

            if (!message || !message.trim()) {
                return res.status(400).json({
                    success: false,
                    message: 'Nội dung tin nhắn là bắt buộc'
                });
            }

            // TODO: Implement SMS sending logic
            // For now, just return success
            console.log(`📱 SMS to send for request #${requestId}: ${message}`);

            return res.status(200).json({
                success: true,
                message: 'Tin nhắn đã được gửi'
            });
        } catch (error) {
            console.error('❌ Error in sendSMS:', error);
            return res.status(500).json({
                success: false,
                message: error.message || 'Không thể gửi tin nhắn'
            });
        }
    }

    /**
     * GET /admin/warranty/export
     * Export warranty data to Excel
     */
    async exportData(req, res) {
        try {
            const filters = {
                status: req.query.status,
                priority: req.query.priority,
                start_date: req.query.start_date,
                end_date: req.query.end_date
            };

            // TODO: Implement Excel export logic
            // For now, return not implemented
            return res.status(501).json({
                success: false,
                message: 'Chức năng xuất Excel đang được phát triển'
            });
        } catch (error) {
            console.error('❌ Error in exportData:', error);
            return res.status(500).json({
                success: false,
                message: error.message || 'Không thể xuất dữ liệu'
            });
        }
    }

    /**
     * GET /admin/warranty/statistics
     * Get warranty statistics
     */
    async getStatistics(req, res) {
        try {
            const dateRange = {
                start_date: req.query.start_date,
                end_date: req.query.end_date
            };

            const result = await ServiceRequestService.getStatistics(dateRange);
            
            return res.status(200).json(result);
        } catch (error) {
            console.error('❌ Error in getStatistics:', error);
            return res.status(500).json({
                success: false,
                message: error.message || 'Không thể lấy thống kê'
            });
        }
    }
}

export default new ServiceRequestController();
