class Address {
    constructor(data) {
        this.address_id = data.address_id;
        this.user_id = data.user_id;
        this.recipient_name = data.recipient_name;
        this.phone = data.phone;
        this.address_line = data.address_line;
        this.city = data.city;
        this.province_id = data.province_id;
        this.district = data.district;
        this.district_id = data.district_id;
        this.ward = data.ward;
        this.ward_code = data.ward_code;
        this.is_default = data.is_default;
        this.type = data.type || 'home';
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }

    toJSON() {
        return {
            address_id: this.address_id,
            user_id: this.user_id,
            recipient_name: this.recipient_name,
            phone: this.phone,
            address_line: this.address_line,
            city: this.city,
            province_id: this.province_id,
            district: this.district,
            district_id: this.district_id,
            ward: this.ward,
            ward_code: this.ward_code,
            is_default: Boolean(this.is_default),
            type: this.type,
            created_at: this.created_at,
            updated_at: this.updated_at,
        };
    }
}

export default Address;

