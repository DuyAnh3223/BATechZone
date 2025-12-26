/**
 * Service Request DTOs - Data Transfer Objects
 */

/**
 * Transform service request product data for client (products eligible for warranty claims)
 */
export const toWarrantyProductDTO = (data) => {
    return {
        serial_id: data.serial_id,
        serial_number: data.serial_number,
        product_name: data.product_name,
        sku: data.sku,
        warranty_id: data.warranty_id,
        warranty_period: data.warranty_period,
        warranty_months: data.warranty_period, // Alias for consistency
        warranty_start_date: data.warranty_start_date,
        warranty_end_date: data.warranty_end_date,
        warranty_status: data.warranty_status,
        order_id: data.order_id,
        order_date: data.order_date,
        purchase_date: data.order_date, // Alias for purchase date
        customer_name: data.customer_name,
        customer_phone: data.customer_phone
    };
};

/**
 * Transform service request data for client
 */
export const toServiceRequestDTO = (data) => {
    // Use user info if available (registered customer), otherwise use walk-in customer info
    const customerName = data.user_name || data.customer_name;
    const customerPhone = data.user_phone || data.customer_phone;
    
    return {
        request_id: data.service_request_id,
        user_id: data.user_id,
        warranty_id: data.warranty_id,
        serial_id: data.serial_id,
        serial_number: data.serial_number,
        product_name: data.product_name,
        sku: data.sku,
        customer_name: customerName,
        customer_phone: customerPhone,
        request_type: data.request_type,
        subject: data.subject,
        description: data.description,
        status: data.status,
        priority: data.priority,
        images: data.images ? JSON.parse(data.images) : [],
        rejection_reason: data.rejection_reason,
        resolution: data.resolution,
        progress_notes: data.progress_notes,
        created_at: data.created_at,
        updated_at: data.updated_at,
        resolved_at: data.resolved_at
    };
};

/**
 * Validate service request input
 */
export const validateServiceRequest = (data) => {
    const errors = [];

    if (!data.serial_id) {
        errors.push('serial_id là bắt buộc');
    }

    if (!data.subject || !data.subject.trim()) {
        errors.push('Tiêu đề là bắt buộc');
    }

    if (!data.description || !data.description.trim()) {
        errors.push('Mô tả vấn đề là bắt buộc');
    }

    if (data.subject && data.subject.length > 200) {
        errors.push('Tiêu đề không được vượt quá 200 ký tự');
    }

    if (data.description && data.description.length > 2000) {
        errors.push('Mô tả không được vượt quá 2000 ký tự');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};
