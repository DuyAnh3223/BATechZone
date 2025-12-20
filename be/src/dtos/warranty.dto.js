/**
 * Warranty DTOs - Data Transfer Objects for Warranty Information
 */

/**
 * Transform warranty data for client
 */
export const toWarrantyDTO = (warranty) => {
    return {
        warranty_id: warranty.warranty_id,
        serial_id: warranty.serial_id,
        order_item_id: warranty.order_item_id,
        service_request_id: warranty.service_request_id,
        warranty_period: warranty.warranty_period,
        start_date: warranty.start_date,
        end_date: warranty.end_date,
        status: warranty.status,
        notes: warranty.notes,
        is_active: warranty.isActive ? warranty.isActive() : null,
        is_expired: warranty.isExpired ? warranty.isExpired() : null,
        remaining_days: warranty.getRemainingDays ? warranty.getRemainingDays() : null,
        created_at: warranty.created_at,
        updated_at: warranty.updated_at
    };
};

/**
 * Transform warranty with product info for client
 */
export const toWarrantyWithProductDTO = (data) => {
    return {
        warranty_id: data.warranty_id,
        serial_id: data.serial_id,
        serial_number: data.serial_number,
        product_name: data.product_name,
        sku: data.sku,
        warranty_period: data.warranty_period,
        start_date: data.start_date,
        end_date: data.end_date,
        status: data.status,
        notes: data.notes,
        order_id: data.order_id,
        order_date: data.order_date,
        created_at: data.created_at
    };
};

/**
 * Validate warranty data
 */
export const validateWarranty = (data) => {
    const errors = [];

    if (!data.serial_id) {
        errors.push('serial_id là bắt buộc');
    }

    if (!data.warranty_period || data.warranty_period <= 0) {
        errors.push('warranty_period phải là số dương');
    }

    if (!data.start_date) {
        errors.push('start_date là bắt buộc');
    }

    if (!data.end_date) {
        errors.push('end_date là bắt buộc');
    }

    if (data.start_date && data.end_date && new Date(data.start_date) >= new Date(data.end_date)) {
        errors.push('end_date phải sau start_date');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};
