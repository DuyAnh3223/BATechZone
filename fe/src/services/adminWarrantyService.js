/**
 * Admin Warranty Service
 * Re-exported from serviceRequestService for backward compatibility
 * 
 * @deprecated Use serviceRequestService.js instead
 */

export {
    searchProductForWarranty,
    createWalkInWarrantyRequest,
    getAllWarrantyRequests,
    getWarrantyRequestDetail,
    updateWarrantyStatus,
    inspectWarrantyRequest,
    updateWarrantyPriority,
    addAdminNote,
    sendWarrantySMS,
    exportWarrantyData,
    getWarrantyStatistics
} from './serviceRequestService';
