import { query } from '../../libs/db.js';

class VariantsAttributeValues {
    static async assignAttributeValueForVariant(variant_id, attribute_value_id, connection = null) {
        const sql = `INSERT INTO variants_attribute_values (
        variant_id,
        attribute_value_id
        ) VALUES (?, ?)`;

        const params = [
            variant_id,
            attribute_value_id,
        ];

        // Nếu có connection (transaction), dùng connection.execute
        // Nếu không, dùng query helper (tạo connection mới)
        if (connection) {
            const [result] = await connection.execute(sql, params);
            return result.insertId;
        } else {
            const result = await query(sql, params);
            return result.insertId;
        }
    }

    static async unassignAttributeValueForVariant(variant_id, attribute_value_id){
        const sql = `DELETE FROM variants_attribute_values
        WHERE variant_id = ? AND attribute_value_id = ?`;

        const params = [
            variant_id,
            attribute_value_id,
        ];

        const result = await query(sql, params);
        return result.affectedRows > 0;
    }

    static async existingMapping(variant_id, attribute_value_id) {
        const sql = `
            SELECT COUNT(*) as count
            FROM variants_attribute_values
            WHERE variant_id = ? AND attribute_value_id = ?`;
        const params = [variant_id, attribute_value_id];
        const rows = await query(sql, params);
        return rows[0].count > 0;
    }

    static async getValuesByVariant(variant_id) {
        const sql = `SELECT av.*
                     FROM variants_attribute_values va
                        JOIN attribute_values av ON va.attribute_value_id = av.attribute_value_id
                        WHERE va.variant_id = ?`;
        const params = [variant_id];
        const rows = await query(sql, params);
        return rows;
    }

    static async findByVariantId(variant_id) {
        const sql = `SELECT * FROM variants_attribute_values
        WHERE variant_id = ?`;
        const params = [variant_id];

        const rows = await query(sql, params);
        return rows;
    }

    

    
}

export default VariantsAttributeValues;