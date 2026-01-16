import { query } from '../libs/db.js';
import Address from '../models/Address.js';

class AddressDAO {
    /**
     * Get all addresses for a user
     */
    async listByUser(userId) {
        try {
            const rows = await query(
                `SELECT address_id, user_id, recipient_name, phone, address_line, 
                        city, district, ward, type, 
                        created_at, updated_at
                 FROM addresses WHERE user_id = ? ORDER BY is_default DESC, address_id DESC`,
                [userId]
            );
            return rows.map(r => new Address(r));
        } catch (error) {
            throw new Error(`Error listing addresses by user: ${error.message}`);
        }
    }

    /**
     * Find address by ID
     */
    async findById(addressId) {
        try {
            const rows = await query(`SELECT * FROM addresses WHERE address_id = ?`, [addressId]);
            return rows.length ? new Address(rows[0]) : null;
        } catch (error) {
            throw new Error(`Error finding address by id: ${error.message}`);
        }
    }

    /**
     * Create new address
     */
    async create(data) {
            // Nếu đặt làm mặc định, cần bỏ mặc định của các địa chỉ khác
            if (data.is_default) {
                await query(`UPDATE addresses SET is_default = 0 WHERE user_id = ?`, [data.user_id]);
            }
            
        const sql = `INSERT INTO addresses (
        user_id, 
        recipient_name, 
        phone, 
        address_line, 
        city, 
        province_id,
        district,
        district_id, 
        ward,
        ward_code,  
        is_default, 
        type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const params = [
            data.user_id, 
            data.recipient_name, 
            data.phone, 
            data.address_line, 
            data.city, 
            data.province_id || null, 
            data.district, 
            data.district_id || null, 
            data.ward, 
            data.ward_code || null, 
            data.is_default ? 1 : 0, 
            data.type]

        const result = await query(sql,params);
        return result.insertId;
        
    }

    /**
     * Update address
     */
    async update(addressId, userId, updateData) {
        try {
            const allowed = ['recipient_name', 'phone', 'address_line', 'city', 'province_id', 'district', 'district_id', 'ward', 'ward_code', 'is_default', 'type'];
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
                                      [userId, addressId]);
                        }
                    } else {
                        sets.push(`${k} = ?`);
                        vals.push(updateData[k]);
                    }
                }
            }
            
            if (!sets.length) return false;
            vals.push(addressId);
            
            const result = await query(
                `UPDATE addresses SET ${sets.join(', ')}, updated_at = NOW() WHERE address_id = ?`,
                vals
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw new Error(`Error updating address: ${error.message}`);
        }
    }

    /**
     * Delete address
     */
    async delete(addressId) {
            const result = await query(`DELETE FROM addresses WHERE address_id = ?`, [addressId]);
            return result.affectedRows > 0;
        
    }
}

export default new AddressDAO();