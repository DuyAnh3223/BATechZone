class Warranty {
    constructor(data) {
        this.warranty_id = data.warranty_id;
        this.serial_id = data.serial_id;
        this.order_item_id = data.order_item_id;
        this.service_request_id = data.service_request_id;
        this.warranty_period = data.warranty_period;
        this.start_date = data.start_date;
        this.end_date = data.end_date;
        this.status = data.status || 'active';
        this.notes = data.notes;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }

    /**
     * Check if warranty is active
     */
    isActive() {
        return this.status === 'active' && new Date() <= new Date(this.end_date);
    }

    /**
     * Check if warranty is expired
     */
    isExpired() {
        return new Date() > new Date(this.end_date);
    }

    /**
     * Get remaining warranty days
     */
    getRemainingDays() {
        const now = new Date();
        const end = new Date(this.end_date);
        const diff = end - now;
        return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    }

    toJSON() {
        return {
            warranty_id: this.warranty_id,
            serial_id: this.serial_id,
            order_item_id: this.order_item_id,
            service_request_id: this.service_request_id,
            warranty_period: this.warranty_period,
            start_date: this.start_date,
            end_date: this.end_date,
            status: this.status,
            notes: this.notes,
            is_active: this.isActive(),
            is_expired: this.isExpired(),
            remaining_days: this.getRemainingDays(),
            created_at: this.created_at,
            updated_at: this.updated_at
        };
    }
}

export default Warranty;