import { userApi } from '@/lib/axios';
import { searchProductForWarranty } from './serviceRequestService';

/**
 * Warranty Service - View warranty information
 */
export const warrantyService = {
    // Lấy thông tin bảo hành theo serial number
    getBySerialNumber: async (serialNumber) => {
        const response = await userApi.get(`/warranty/serial/${serialNumber}`);
        return response.data;
    },

    // Tra cứu thông tin bảo hành chi tiết theo serial (cho admin)
    lookupWarrantyBySerial: async (serialNumber) => {
        // Sử dụng searchProductForWarranty thay vì endpoint lookup không tồn tại
        const response = await searchProductForWarranty('serial', serialNumber);
        
        if (!response.success || !response.data || response.data.length === 0) {
            return {
                success: false,
                message: 'Không tìm thấy thông tin bảo hành'
            };
        }

        // Transform data từ searchProductForWarranty sang format mong muốn
        const product = response.data[0];
        return {
            success: true,
            data: {
                serial_number: product.serial_number,
                serial_id: product.serial_id,
                product_name: product.product_name,
                sku: product.sku,
                variant_name: product.variant_name || product.sku,
                warranty_period: product.warranty_months || product.warranty_period,
                warranty_type: 'manufacturer', // Default value
                purchase_date: product.purchase_date,
                warranty_start: product.warranty_start_date,
                warranty_expiration: product.warranty_end_date,
                isValid: product.warranty_status === 'active',
                customer_name: product.customer_name || '',
                customer_phone: product.customer_phone || '',
                order_number: product.order_number || '',
                warranty_terms: product.warranty_terms || 'Bảo hành theo chính sách của hãng'
            }
        };
    },

    // Lấy thông tin bảo hành theo order item
    getByOrderItem: async (orderItemId) => {
        const response = await userApi.get(`/warranty/order-item/${orderItemId}`);
        return response.data;
    },

    // Lấy danh sách bảo hành sắp hết hạn
    getExpiring: async (days = 30) => {
        const response = await userApi.get('/warranty/expiring', { params: { days } });
        return response.data;
    }
};

export default warrantyService;
