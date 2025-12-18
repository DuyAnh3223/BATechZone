import { query } from '../libs/db.js';

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

    static async listByUser(userId) {
        try {
            const rows = await query(
                `SELECT address_id, user_id, recipient_name, phone, address_line1, address_line2, 
                        city, district, ward, postal_code, country, is_default, address_type, 
                        created_at, updated_at
                 FROM addresses WHERE user_id = ? ORDER BY is_default DESC, address_id DESC`,
                [userId]
            );
            return rows.map(r => new Address(r));
        } catch (error) {
            throw new Error(`Error listing addresses by user: ${error.message}`);
        }
    }

    static async findById(addressId) {
        try {
            const rows = await query(`SELECT * FROM addresses WHERE address_id = ?`, [addressId]);
            return rows.length ? new Address(rows[0]) : null;
        } catch (error) {
            throw new Error(`Error finding address by id: ${error.message}`);
        }
    }

    static async create({ user_id, recipient_name, phone, address_line1, address_line2 = null, 
                         city, district = null, ward = null, postal_code = null, 
                         country = 'Vietnam', is_default = false, address_type = 'home' }) {
        try {
            // Nếu đặt làm mặc định, cần bỏ mặc định của các địa chỉ khác
            if (is_default) {
                await query(`UPDATE addresses SET is_default = 0 WHERE user_id = ?`, [user_id]);
            }
            
            const result = await query(
                `INSERT INTO addresses (user_id, recipient_name, phone, address_line1, address_line2, 
                                       city, district, ward, postal_code, country, is_default, address_type)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [user_id, recipient_name, phone, address_line1, address_line2, 
                 city, district, ward, postal_code, country, is_default ? 1 : 0, address_type]
            );
            return result.insertId;
        } catch (error) {
            throw new Error(`Error creating address: ${error.message}`);
        }
    }

    async update(updateData) {
        try {
            const allowed = ['recipient_name', 'phone', 'address_line1', 'address_line2', 
                           'city', 'district', 'ward', 'postal_code', 'country', 
                           'is_default', 'address_type'];
            const sets = [];
            const vals = [];
            
            for (const k of Object.keys(updateData)) {
                if (allowed.includes(k)) {
                    if (k === 'is_default') {
                        sets.push(`${k} = ?`);
                        vals.push(updateData[k] ? 1 : 0);
                        // Nếu đặt làm mặc định, cần bỏ mặc định của các địa chỉ khác
                        if (updateData[k]) {
                            await query(`UPDATE addresses SET is_default = 0 WHERE user_id = ? AND address_id != ?`, 
                                      [this.user_id, this.address_id]);
                        }
                    } else {
                        sets.push(`${k} = ?`);
                        vals.push(updateData[k]);
                    }
                }
            }
            
            if (!sets.length) return false;
            vals.push(this.address_id);
            
            const result = await query(
                `UPDATE addresses SET ${sets.join(', ')}, updated_at = NOW() WHERE address_id = ?`,
                vals
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw new Error(`Error updating address: ${error.message}`);
        }
    }

    static async delete(addressId) {
        try {
            const result = await query(`DELETE FROM addresses WHERE address_id = ?`, [addressId]);
            return result.affectedRows > 0;
        } catch (error) {
            throw new Error(`Error deleting address: ${error.message}`);
        }
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

