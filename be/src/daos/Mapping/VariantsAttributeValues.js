import { query } from "../../libs/db";

class VariantsAttributeValues {
    static async create(data) {
        const sql = `INSERT INTO variants_attributes (
        variant_id,
        attribute_value_id
        ) VALUES (?, ?)`;

        const params = [
            data.variant_id,
            data.attribute_value_id,
        ];

        const [result] = await query(sql, params);
        return result.insertId;
    }

    static async delete(data){
        const sql = `DELETE FROM variants_attributes
        WHERE variant_id = ? AND attribute_value_id = ?`;

        const params = [
            data.variant_id,
            data.attribute_value_id,
        ];

        const [result] = await query(sql, params);
        return result.affectedRows > 0;
    }

    static async findByVariantId(variant_id) {
        const sql = `SELECT * FROM variants_attributes
        WHERE variant_id = ?`;
        const params = [variant_id];

        const [rows] = await query(sql, params);
        return rows;
    }

    

    
}

export default VariantsAttributeValues;