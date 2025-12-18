class ServiceRequest {
    constructor(data){
        this.service_request_id = data.service_request_id;
        this.user_id = data.user_id;
        this.request_type = data.request_type;
        this.status = data.status;
        this.subject = data.subject;
        this.description = data.description;
        this.priority = data.priority;
        this.assigned_to = data.assigned_to;
        this.resolution = data.resolution;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
        this.resolved_at = data.resolved_at;
    }
}

export default ServiceRequest;