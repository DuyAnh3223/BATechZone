class Warranty {
    constructor(data) {
        this.warranty_id = data.warranty_id;
        this.order_item_id = data.order_item_id;
        this.service_request_id = data.service_request_id;
        this.warranty_period = data.warranty_period;
        this.warranty_type = data.warranty_type;
        this.start_date = data.start_date;
        this.end_date = data.end_date;
        this.status = data.status;
        this.notes = data.notes;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
        	
    }
}

export default Warranty;