class ServiceRequest {
    constructor(data){
        this.service_request_id = data.service_request_id;
        this.user_id = data.user_id; // Null for guest requests
        this.warranty_id = data.warranty_id;
        this.serial_id = data.serial_id;
        this.customer_name = data.customer_name; // For guest requests
        this.customer_phone = data.customer_phone; // For guest requests
        this.request_type = data.request_type; // default 'warranty'
        this.status = data.status; // default 'pending' ('received','warranty_accepted','warranty_rejected','completed','cancelled')
        this.subject = data.subject; // Short title
        this.description = data.description; // Detailed description
        this.images = data.images; // Array of image URLs Nullable
        this.priority = data.priority; // default 'medium'
        this.rejection_reason = data.rejection_reason; // Nullable
        this.resolution = data.resolution; // Nullable
        this.progress_notes = data.progress_notes; // Nullable
        this.created_at = data.created_at; // Timestamp
        this.updated_at = data.updated_at; // Timestamp
        this.resolved_at = data.resolved_at; // Timestamp status = 'completed'
    }
}

export default ServiceRequest;