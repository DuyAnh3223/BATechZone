import { query } from '../../libs/db.js';
import ServiceRequest from '../../models/warranty/ServiceRequest.js';

class ServiceRequestDAO {
    
    /**
     * Create new service request
     */
    async create(requestData) {
        const sql = `
            INSERT INTO service_requests 
            (user_id, warranty_id, serial_id, customer_name, customer_phone, 
             request_type, status, subject, description, images, priority) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const result = await query(sql, [
            requestData.user_id || null,
            requestData.warranty_id || null,
            requestData.serial_id,
            requestData.customer_name || null,
            requestData.customer_phone || null,
            requestData.request_type || 'warranty',
            requestData.status || 'pending',
            requestData.subject,
            requestData.description,
            requestData.images ? JSON.stringify(requestData.images) : null,
            requestData.priority || 'medium'
        ]);
        return result.insertId;
    }

    /**
     * Find service request by ID
     */
    async findById(requestId) {
        const sql = `
            SELECT 
                sr.*,
                vs.serial_number,
                p.product_name,
                pv.sku,
                u.full_name as user_name,
                u.phone as user_phone
            FROM service_requests sr
            JOIN variant_serials vs ON sr.serial_id = vs.serial_id
            JOIN product_variants pv ON vs.variant_id = pv.variant_id
            JOIN products p ON pv.product_id = p.product_id
            LEFT JOIN users u ON sr.user_id = u.user_id
            WHERE sr.service_request_id = ?
        `;
        const rows = await query(sql, [requestId]);
        return rows.length > 0 ? rows[0] : null;
    }

    /**
     * Find service requests by user ID
     */
    async findByUserId(userId, filters = {}) {
        let sql = `
            SELECT 
                sr.*,
                vs.serial_number,
                p.product_name,
                pv.sku,
                u.full_name as user_name,
                u.phone as user_phone
            FROM service_requests sr
            JOIN variant_serials vs ON sr.serial_id = vs.serial_id
            JOIN product_variants pv ON vs.variant_id = pv.variant_id
            JOIN products p ON pv.product_id = p.product_id
            LEFT JOIN users u ON sr.user_id = u.user_id
            WHERE sr.user_id = ?
        `;
        
        const params = [userId];

        if (filters.status) {
            sql += ` AND sr.status = ?`;
            params.push(filters.status);
        }

        sql += ` ORDER BY sr.created_at DESC`;

        if (filters.limit) {
            sql += ` LIMIT ?`;
            params.push(parseInt(filters.limit));
        }

        const rows = await query(sql, params);
        return rows;
    }

    /**
     * Update service request
     */
    async update(requestId, updates) {
        const allowedFields = ['status', 'progress_notes', 'rejection_reason', 'resolution', 'resolved_at'];
        const fields = [];
        const params = [];

        Object.keys(updates).forEach(key => {
            if (allowedFields.includes(key)) {
                fields.push(`${key} = ?`);
                params.push(updates[key]);
            }
        });

        if (fields.length === 0) {
            throw new Error('No valid fields to update');
        }

        params.push(requestId);
        const sql = `UPDATE service_requests SET ${fields.join(', ')}, updated_at = NOW() WHERE service_request_id = ?`;
        const result = await query(sql, params);
        return result.affectedRows > 0;
    }

    /**
     * Cancel service request
     */
    async cancel(requestId, reason) {
        const sql = `
            UPDATE service_requests 
            SET status = 'cancelled', rejection_reason = ?, updated_at = NOW()
            WHERE service_request_id = ?
        `;
        const result = await query(sql, [reason, requestId]);
        return result.affectedRows > 0;
    }

    /**
     * Get user's products eligible for warranty
     */
    async getUserWarrantyProducts(userId) {
        const sql = `
            SELECT 
                vs.serial_id,
                vs.serial_number,
                vs.warranty_id,
                p.product_name,
                pv.sku,
                w.period as warranty_period,
                w.start_date as warranty_start_date,
                w.end_date as warranty_end_date,
                w.created_at as purchase_date,
                CASE 
                    WHEN w.end_date < CURDATE() THEN 'expired'
                    WHEN EXISTS(SELECT 1 FROM service_requests WHERE serial_id = vs.serial_id) THEN 'claimed'
                    ELSE 'active'
                END as warranty_status,
                oi.order_id,
                o.created_at as order_date
            FROM variant_serials vs
            JOIN product_variants pv ON vs.variant_id = pv.variant_id
            JOIN products p ON pv.product_id = p.product_id
            LEFT JOIN warranties w ON vs.warranty_id = w.warranty_id
            LEFT JOIN order_items oi ON vs.order_item_id = oi.order_item_id
            LEFT JOIN orders o ON oi.order_id = o.order_id
            WHERE o.user_id = ? AND vs.status = 'sold'
            ORDER BY vs.created_at DESC
        `;
        const rows = await query(sql, [userId]);
        return rows;
    }

    /**
     * Check if serial belongs to user
     */
    async checkSerialOwnership(serialId, userId) {
        const sql = `
            SELECT COUNT(*) as count 
            FROM variant_serials vs
            JOIN order_items oi ON vs.order_item_id = oi.order_item_id
            JOIN orders o ON oi.order_id = o.order_id
            WHERE vs.serial_id = ? AND o.user_id = ?
        `;
        const rows = await query(sql, [serialId, userId]);
        return rows[0].count > 0;
    }

    /**
     * Check if serial already has an active service request
     */
    async hasActiveRequest(serialId) {
        const sql = `
            SELECT service_request_id, status 
            FROM service_requests 
            WHERE serial_id = ? 
            AND status NOT IN ('completed', 'cancelled', 'warranty_rejected')
            LIMIT 1
        `;
        const rows = await query(sql, [serialId]);
        return rows.length > 0 ? rows[0] : null;
    }

    // ============ ADMIN METHODS ============

    /**
     * Search products by serial number or phone (for walk-in customers)
     */
    async searchProductForAdmin(searchType, searchValue) {
        let sql = '';
        let params = [];

        if (searchType === 'serial') {
            sql = `
                SELECT 
                    vs.serial_id,
                    vs.serial_number,
                    vs.warranty_id,
                    p.product_name,
                    pv.sku,
                    w.warranty_period as warranty_period,
                    w.start_date as warranty_start_date,
                    w.end_date as warranty_end_date,
                    w.status as warranty_status,
                    w.created_at as purchase_date,
                    oi.order_id,
                    o.user_id,
                    u.full_name as customer_name,
                    u.phone as customer_phone,
                    o.created_at as order_date
                FROM variant_serials vs
                JOIN product_variants pv ON vs.variant_id = pv.variant_id
                JOIN products p ON pv.product_id = p.product_id
                LEFT JOIN warranties w ON vs.warranty_id = w.warranty_id
                LEFT JOIN order_items oi ON vs.order_item_id = oi.order_item_id
                LEFT JOIN orders o ON oi.order_id = o.order_id
                LEFT JOIN users u ON o.user_id = u.user_id
                WHERE vs.serial_number = ? AND vs.status = 'sold'
            `;
            params = [searchValue];
        } else if (searchType === 'phone') {
            sql = `
                SELECT 
                    vs.serial_id,
                    vs.serial_number,
                    vs.warranty_id,
                    p.product_name,
                    pv.sku,
                    w.warranty_period as warranty_period,
                    w.start_date as warranty_start_date,
                    w.end_date as warranty_end_date,
                    w.status as warranty_status,
                    w.created_at as purchase_date,
                    oi.order_id,
                    o.user_id,
                    u.full_name as customer_name,
                    u.phone as customer_phone,
                    o.created_at as order_date
                FROM variant_serials vs
                JOIN product_variants pv ON vs.variant_id = pv.variant_id
                JOIN products p ON pv.product_id = p.product_id
                LEFT JOIN warranties w ON vs.warranty_id = w.warranty_id
                LEFT JOIN order_items oi ON vs.order_item_id = oi.order_item_id
                LEFT JOIN orders o ON oi.order_id = o.order_id
                LEFT JOIN users u ON o.user_id = u.user_id
                WHERE u.phone = ? AND vs.status = 'sold'
                ORDER BY o.created_at DESC
            `;
            params = [searchValue];
        }

        const rows = await query(sql, params);
        return rows;
    }

    /**
     * Get all service requests with filters (Admin)
     */
    async findAll(filters = {}) {
        let sql = `
            SELECT 
                sr.*,
                vs.serial_number,
                p.product_name,
                pv.sku,
                u.full_name as user_name,
                u.phone as user_phone
            FROM service_requests sr
            JOIN variant_serials vs ON sr.serial_id = vs.serial_id
            JOIN product_variants pv ON vs.variant_id = pv.variant_id
            JOIN products p ON pv.product_id = p.product_id
            LEFT JOIN users u ON sr.user_id = u.user_id
            WHERE 1=1
        `;
        
        const params = [];

        if (filters.status) {
            sql += ` AND sr.status = ?`;
            params.push(filters.status);
        }

        if (filters.priority) {
            sql += ` AND sr.priority = ?`;
            params.push(filters.priority);
        }

        if (filters.request_type) {
            sql += ` AND sr.request_type = ?`;
            params.push(filters.request_type);
        }

        if (filters.search) {
            sql += ` AND (sr.subject LIKE ? OR vs.serial_number LIKE ? OR p.product_name LIKE ?)`;
            const searchTerm = `%${filters.search}%`;
            params.push(searchTerm, searchTerm, searchTerm);
        }

        sql += ` ORDER BY sr.created_at DESC`;

        if (filters.limit) {
            sql += ` LIMIT ?`;
            params.push(parseInt(filters.limit));
        }

        if (filters.offset) {
            sql += ` OFFSET ?`;
            params.push(parseInt(filters.offset));
        }

        const rows = await query(sql, params);
        return rows;
    }

    /**
     * Update priority
     */
    async updatePriority(requestId, priority) {
        const sql = `
            UPDATE service_requests 
            SET priority = ?, updated_at = NOW()
            WHERE service_request_id = ?
        `;
        const result = await query(sql, [priority, requestId]);
        return result.affectedRows > 0;
    }

    /**
     * Add inspection data
     */
    async addInspection(requestId, inspectionData) {
        const sql = `
            UPDATE service_requests 
            SET 
                status = ?,
                progress_notes = JSON_ARRAY_APPEND(
                    IFNULL(progress_notes, JSON_ARRAY()),
                    '$',
                    JSON_OBJECT(
                        'timestamp', NOW(),
                        'note', ?,
                        'type', 'inspection'
                    )
                ),
                ${inspectionData.rejection_reason ? 'rejection_reason = ?,' : ''}
                updated_at = NOW()
            WHERE service_request_id = ?
        `;
        
        const params = [
            inspectionData.status,
            `Kiểm tra: ${inspectionData.inspection_notes}`
        ];

        if (inspectionData.rejection_reason) {
            params.push(inspectionData.rejection_reason);
        }

        params.push(requestId);

        const result = await query(sql, params);
        return result.affectedRows > 0;
    }

    /**
     * Add admin note
     */
    async addNote(requestId, note, adminName) {
        const sql = `
            UPDATE service_requests 
            SET 
                progress_notes = JSON_ARRAY_APPEND(
                    IFNULL(progress_notes, JSON_ARRAY()),
                    '$',
                    JSON_OBJECT(
                        'timestamp', NOW(),
                        'note', ?,
                        'by', ?,
                        'type', 'admin_note'
                    )
                ),
                updated_at = NOW()
            WHERE service_request_id = ?
        `;
        
        const result = await query(sql, [note, adminName, requestId]);
        return result.affectedRows > 0;
    }

    /**
     * Get statistics
     */
    async getStatistics(dateRange = {}) {
        const sql = `
            SELECT 
                COUNT(*) as total_requests,
                SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
                SUM(CASE WHEN status = 'received' THEN 1 ELSE 0 END) as received,
                SUM(CASE WHEN status = 'inspecting' THEN 1 ELSE 0 END) as inspecting,
                SUM(CASE WHEN status = 'warranty_accepted' THEN 1 ELSE 0 END) as accepted,
                SUM(CASE WHEN status = 'warranty_rejected' THEN 1 ELSE 0 END) as rejected,
                SUM(CASE WHEN status = 'repairing' THEN 1 ELSE 0 END) as repairing,
                SUM(CASE WHEN status = 'ready_for_pickup' THEN 1 ELSE 0 END) as ready,
                SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
                SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled,
                SUM(CASE WHEN priority = 'high' THEN 1 ELSE 0 END) as high_priority
            FROM service_requests
            WHERE 1=1
            ${dateRange.start_date ? 'AND created_at >= ?' : ''}
            ${dateRange.end_date ? 'AND created_at <= ?' : ''}
        `;
        
        const params = [];
        if (dateRange.start_date) params.push(dateRange.start_date);
        if (dateRange.end_date) params.push(dateRange.end_date);

        const rows = await query(sql, params);
        return rows[0];
    }
}

export default new ServiceRequestDAO();