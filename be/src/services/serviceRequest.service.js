import ServiceRequestDAO from '../daos/warranty/serviceRequest.dao.js';
import WarrantyDAO from '../daos/warranty/warranty.dao.js';
import VariantSerialDAO from '../daos/warranty/variantSerial.dao.js';
import { toWarrantyProductDTO, toServiceRequestDTO, validateServiceRequest } from '../dtos/serviceRequest.dto.js';

/**
 * Service Request Service - For warranty claim operations
 */
class ServiceRequestService {

    /**
     * Get user's products eligible for warranty
     * @param {number} userId - User ID
     */
    async getMyProducts(userId) {
        try {
            const products = await ServiceRequestDAO.getUserWarrantyProducts(userId);
            
            return {
                success: true,
                data: products.map(p => toWarrantyProductDTO(p))
            };
        } catch (error) {
            console.error('❌ Error getting warranty products:', error);
            throw error;
        }
    }

    /**
     * Create warranty request
     * @param {number} userId - User ID
     * @param {object} requestData - Request data
     * @param {array} imageUrls - Uploaded image URLs
     */
    async createWarrantyRequest(userId, requestData, imageUrls = []) {
        try {
            // Validate input
            const validation = validateServiceRequest(requestData);
            if (!validation.isValid) {
                throw new Error(validation.errors.join(', '));
            }

            // Check serial ownership
            const isOwner = await ServiceRequestDAO.checkSerialOwnership(requestData.serial_id, userId);
            if (!isOwner) {
                throw new Error('Serial không thuộc về bạn');
            }

            // Check if serial already has an active service request
            const activeRequest = await ServiceRequestDAO.hasActiveRequest(requestData.serial_id);
            if (activeRequest) {
                throw new Error(`Sản phẩm này đã có yêu cầu bảo hành đang xử lý (Trạng thái: ${activeRequest.status})`);
            }

            // Get serial info
            const serial = await VariantSerialDAO.findById(requestData.serial_id);
            if (!serial) {
                throw new Error('Serial không tồn tại');
            }

            // Check warranty validity
            if (serial.warranty_id) {
                const warranty = await WarrantyDAO.findById(serial.warranty_id);
                if (!warranty) {
                    throw new Error('Không tìm thấy thông tin bảo hành');
                }

                // Check if warranty is still valid
                const now = new Date();
                const endDate = new Date(warranty.end_date);
                if (endDate < now) {
                    throw new Error('Sản phẩm đã hết hạn bảo hành');
                }
            }

            // Create service request
            const requestId = await ServiceRequestDAO.create({
                user_id: userId,
                warranty_id: serial.warranty_id,
                serial_id: requestData.serial_id,
                request_type: 'warranty',
                status: 'pending',
                subject: requestData.subject,
                description: requestData.description,
                images: imageUrls,
                priority: 'medium'
            });

            console.log(`✅ Created warranty request #${requestId}`);

            // Auto-approve to 'received' status
            await ServiceRequestDAO.update(requestId, {
                status: 'received'
            });

            console.log(`✅ Auto-approved request #${requestId} to 'received'`);

            // Get created request
            const request = await ServiceRequestDAO.findById(requestId);

            return {
                success: true,
                message: 'Yêu cầu bảo hành đã được gửi thành công',
                data: toServiceRequestDTO(request)
            };
        } catch (error) {
            console.error('❌ Error creating warranty request:', error);
            throw error;
        }
    }

    /**
     * Get user's warranty requests
     * @param {number} userId - User ID
     * @param {object} filters - Filter options
     */
    async getMyRequests(userId, filters = {}) {
        try {
            const requests = await ServiceRequestDAO.findByUserId(userId, filters);
            
            return {
                success: true,
                data: requests.map(r => toServiceRequestDTO(r))
            };
        } catch (error) {
            console.error('❌ Error getting warranty requests:', error);
            throw error;
        }
    }

    /**
     * Get warranty request detail
     * @param {number} userId - User ID
     * @param {number} requestId - Request ID
     */
    async getRequestDetail(userId, requestId) {
        try {
            const request = await ServiceRequestDAO.findById(requestId);
            
            if (!request) {
                throw new Error('Yêu cầu không tồn tại');
            }

            // Check ownership
            if (request.user_id !== userId) {
                throw new Error('Bạn không có quyền xem yêu cầu này');
            }

            return {
                success: true,
                data: toServiceRequestDTO(request)
            };
        } catch (error) {
            console.error('❌ Error getting request detail:', error);
            throw error;
        }
    }

    /**
     * Cancel warranty request
     * @param {number} userId - User ID
     * @param {number} requestId - Request ID
     * @param {string} reason - Cancellation reason
     */
    async cancelRequest(userId, requestId, reason) {
        try {
            const request = await ServiceRequestDAO.findById(requestId);
            
            if (!request) {
                throw new Error('Yêu cầu không tồn tại');
            }

            // Check ownership
            if (request.user_id !== userId) {
                throw new Error('Bạn không có quyền hủy yêu cầu này');
            }

            // Check if cancellable
            const cancellableStatuses = ['pending', 'received'];
            if (!cancellableStatuses.includes(request.status)) {
                throw new Error('Không thể hủy yêu cầu ở trạng thái hiện tại');
            }

            // Cancel request
            await ServiceRequestDAO.cancel(requestId, reason || 'Khách hàng hủy');

            console.log(`✅ Cancelled request #${requestId}`);

            return {
                success: true,
                message: 'Đã hủy yêu cầu bảo hành'
            };
        } catch (error) {
            console.error('❌ Error cancelling request:', error);
            throw error;
        }
    }

    // ============ ADMIN METHODS ============

    /**
     * Search products for warranty (Admin)
     * @param {string} searchType - 'serial' or 'phone'
     * @param {string} searchValue - Search value
     */
    async searchProductForWarranty(searchType, searchValue) {
        try {
            const products = await ServiceRequestDAO.searchProductForAdmin(searchType, searchValue);
            
            if (products.length === 0) {
                return {
                    success: false,
                    message: searchType === 'serial' 
                        ? 'Không tìm thấy sản phẩm với serial này'
                        : 'Không tìm thấy sản phẩm với số điện thoại này'
                };
            }

            return {
                success: true,
                data: products.map(p => toWarrantyProductDTO(p))
            };
        } catch (error) {
            console.error('❌ Error searching products:', error);
            throw error;
        }
    }

    /**
     * Create walk-in warranty request (Admin)
     * @param {object} requestData - Request data
     * @param {array} imageUrls - Uploaded image URLs
     */
    async createWalkInRequest(requestData, imageUrls = []) {
        try {
            // Validate input
            const validation = validateServiceRequest(requestData);
            if (!validation.isValid) {
                throw new Error(validation.errors.join(', '));
            }

            // Walk-in customers don't need user_id
            // But need customer_name and customer_phone
            if (!requestData.customer_name || !requestData.customer_phone) {
                throw new Error('Tên và số điện thoại khách hàng là bắt buộc');
            }

            // Check if serial already has an active service request
            const activeRequest = await ServiceRequestDAO.hasActiveRequest(requestData.serial_id);
            if (activeRequest) {
                throw new Error(`Sản phẩm này đã có yêu cầu bảo hành đang xử lý (Trạng thái: ${activeRequest.status})`);
            }

            // Get serial info
            const serial = await VariantSerialDAO.findById(requestData.serial_id);
            if (!serial) {
                throw new Error('Serial không tồn tại');
            }

            // Create service request with status 'received' (already at store)
            const requestId = await ServiceRequestDAO.create({
                user_id: null, // Walk-in customer
                warranty_id: serial.warranty_id,
                serial_id: requestData.serial_id,
                customer_name: requestData.customer_name,
                customer_phone: requestData.customer_phone,
                request_type: 'warranty',
                status: 'received', // Already received at store
                subject: requestData.subject,
                description: requestData.description,
                images: imageUrls,
                priority: requestData.priority || 'medium'
            });

            console.log(`✅ Created walk-in warranty request #${requestId}`);

            // Get created request
            const request = await ServiceRequestDAO.findById(requestId);

            return {
                success: true,
                message: 'Yêu cầu bảo hành đã được tạo thành công',
                data: toServiceRequestDTO(request)
            };
        } catch (error) {
            console.error('❌ Error creating walk-in request:', error);
            throw error;
        }
    }

    /**
     * Get all warranty requests with filters (Admin)
     * @param {object} filters - Filter options
     */
    async getAllRequests(filters = {}) {
        try {
            const requests = await ServiceRequestDAO.findAll(filters);
            
            return {
                success: true,
                data: requests.map(r => toServiceRequestDTO(r)),
                total: requests.length
            };
        } catch (error) {
            console.error('❌ Error getting all requests:', error);
            throw error;
        }
    }

    /**
     * Get request detail (Admin - no ownership check)
     * @param {number} requestId - Request ID
     */
    async getRequestDetailAdmin(requestId) {
        try {
            const request = await ServiceRequestDAO.findById(requestId);
            
            if (!request) {
                throw new Error('Yêu cầu không tồn tại');
            }

            return {
                success: true,
                data: toServiceRequestDTO(request)
            };
        } catch (error) {
            console.error('❌ Error getting request detail:', error);
            throw error;
        }
    }

    /**
     * Update warranty request status (Admin)
     * @param {number} requestId - Request ID
     * @param {object} statusData - Status update data
     */
    async updateStatus(requestId, statusData) {
        try {
            const request = await ServiceRequestDAO.findById(requestId);
            
            if (!request) {
                throw new Error('Yêu cầu không tồn tại');
            }

            // Validate status
            const validStatuses = [
                'pending', 
                'received', 
                'warranty_accepted', 
                'warranty_rejected', 
                'completed', 
                'cancelled'
            ];

            if (!validStatuses.includes(statusData.status)) {
                throw new Error('Trạng thái không hợp lệ');
            }

            // Validate status transitions
            const currentStatus = request.status;
            const newStatus = statusData.status;

            const allowedTransitions = {
                'pending': ['received', 'cancelled'],
                'received': ['warranty_accepted','warranty_rejected','cancelled'],
                'warranty_accepted': ['cancelled', 'completed'],
                'warranty_rejected': ['cancelled'],
                'completed': [],
                'cancelled': []
            };

            if (!allowedTransitions[currentStatus]?.includes(newStatus)) {
                throw new Error(`Không thể chuyển từ trạng thái "${currentStatus}" sang "${newStatus}"`);
            }

            const updates = {
                status: statusData.status
            };

            // Add progress notes if provided
            if (statusData.notes) {
                // Parse existing progress_notes (should be JSON array)
                let progressNotes = [];
                if (request.progress_notes) {
                    try {
                        progressNotes = typeof request.progress_notes === 'string' 
                            ? JSON.parse(request.progress_notes) 
                            : request.progress_notes;
                        if (!Array.isArray(progressNotes)) {
                            progressNotes = [];
                        }
                    } catch (e) {
                        console.warn('Failed to parse existing progress_notes, starting fresh');
                        progressNotes = [];
                    }
                }

                // Add new note
                progressNotes.push({
                    timestamp: new Date().toISOString(),
                    note: `Cập nhật trạng thái: ${statusData.status} - ${statusData.notes}`,
                    type: 'status_update'
                });

                updates.progress_notes = JSON.stringify(progressNotes);
            }

            // Handle completed status
            if (statusData.status === 'completed') {
                updates.resolved_at = new Date();
                if (statusData.resolution) {
                    updates.resolution = statusData.resolution;
                }
            }

            // Handle rejected status
            if (statusData.status === 'warranty_rejected' && statusData.rejection_reason) {
                updates.rejection_reason = statusData.rejection_reason;
            }

            await ServiceRequestDAO.update(requestId, updates);

            console.log(`✅ Updated request #${requestId} status: ${currentStatus} → ${statusData.status}`);

            // Get updated request
            const updatedRequest = await ServiceRequestDAO.findById(requestId);

            return {
                success: true,
                message: 'Cập nhật trạng thái thành công',
                data: toServiceRequestDTO(updatedRequest)
            };
        } catch (error) {
            console.error('❌ Error updating status:', error);
            throw error;
        }
    }

    /**
     * Inspect warranty request (Admin)
     * @param {number} requestId - Request ID
     * @param {object} inspectionData - Inspection data
     */
    async inspectRequest(requestId, inspectionData) {
        try {
            const request = await ServiceRequestDAO.findById(requestId);
            
            if (!request) {
                throw new Error('Yêu cầu không tồn tại');
            }

            // Add inspection notes and update status
            await ServiceRequestDAO.addInspection(requestId, {
                status: inspectionData.decision === 'accept' ? 'warranty_accepted' : 'warranty_rejected',
                inspection_notes: inspectionData.inspection_notes,
                rejection_reason: inspectionData.decision === 'reject' ? inspectionData.rejection_reason : null
            });

            console.log(`✅ Inspected request #${requestId} - Decision: ${inspectionData.decision}`);

            return {
                success: true,
                message: `Đã ${inspectionData.decision === 'accept' ? 'chấp nhận' : 'từ chối'} yêu cầu bảo hành`
            };
        } catch (error) {
            console.error('❌ Error inspecting request:', error);
            throw error;
        }
    }

    /**
     * Update priority (Admin)
     * @param {number} requestId - Request ID
     * @param {string} priority - Priority level
     */
    async updatePriority(requestId, priority) {
        try {
            const validPriorities = ['low', 'medium', 'high'];
            if (!validPriorities.includes(priority)) {
                throw new Error('Mức độ ưu tiên không hợp lệ');
            }

            await ServiceRequestDAO.updatePriority(requestId, priority);

            console.log(`✅ Updated request #${requestId} priority to ${priority}`);

            return {
                success: true,
                message: 'Cập nhật mức độ ưu tiên thành công'
            };
        } catch (error) {
            console.error('❌ Error updating priority:', error);
            throw error;
        }
    }

    /**
     * Add admin note (Admin)
     * @param {number} requestId - Request ID
     * @param {string} note - Admin note
     * @param {string} adminName - Admin username
     */
    async addAdminNote(requestId, note, adminName) {
        try {
            await ServiceRequestDAO.addNote(requestId, note, adminName);

            console.log(`✅ Added note to request #${requestId}`);

            return {
                success: true,
                message: 'Đã thêm ghi chú'
            };
        } catch (error) {
            console.error('❌ Error adding note:', error);
            throw error;
        }
    }

    /**
     * Get statistics (Admin)
     * @param {object} dateRange - Date range filter
     */
    async getStatistics(dateRange = {}) {
        try {
            const stats = await ServiceRequestDAO.getStatistics(dateRange);

            return {
                success: true,
                data: stats
            };
        } catch (error) {
            console.error('❌ Error getting statistics:', error);
            throw error;
        }
    }
}

export default new ServiceRequestService();
