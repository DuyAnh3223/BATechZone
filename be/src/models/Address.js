class Address {
    constructor(data) {
        this.address_id = data.address_id;
        this.user_id = data.user_id;
        this.recipient_name = data.recipient_name;
        this.phone = data.phone;
        this.address_line1 = data.address_line1;
        this.address_line2 = data.address_line2;
        this.city = data.city;
        this.district = data.district;
        this.ward = data.ward;
        this.postal_code = data.postal_code;
        this.country = data.country || 'Vietnam';
        this.is_default = data.is_default;
        this.address_type = data.address_type || 'home';
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }

    toJSON() {
        return {
            address_id: this.address_id,
            user_id: this.user_id,
            recipient_name: this.recipient_name,
            phone: this.phone,
            address_line1: this.address_line1,
            address_line2: this.address_line2,
            city: this.city,
            district: this.district,
            ward: this.ward,
            postal_code: this.postal_code,
            country: this.country,
            is_default: Boolean(this.is_default),
            address_type: this.address_type,
            created_at: this.created_at,
            updated_at: this.updated_at,
        };
    }
}

export default Address;

