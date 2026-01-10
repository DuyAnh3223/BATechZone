import { query } from '../../libs/db.js';

class ProductsAttributeValues {
    static async assignAttributeValueForProduct(product_id, attribute_value_id, connection = null) {
        const sql = `INSERT INTO products_attribute_values (
        product_id,
        attribute_value_id
        ) VALUES (?, ?)`;

        const params = [
            product_id,
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

    static async unassignAttributeValueForProduct(product_id, attribute_value_id){
        const sql = `DELETE FROM products_attribute_values
        WHERE product_id = ? AND attribute_value_id = ?`;

        const params = [
            product_id,
            attribute_value_id,
        ];

        const result = await query(sql, params);
        return result.affectedRows > 0;
    }

    static async existingMapping(product_id, attribute_value_id) {
        const sql = `
            SELECT COUNT(*) as count 
            FROM products_attribute_values 
            WHERE product_id = ? AND attribute_value_id = ?`;
        const params = [product_id, attribute_value_id];
        const rows = await query(sql, params);
        return rows[0].count > 0;
    }

    static async getValuesByProduct(product_id) {
        const sql = `SELECT av.*
                     FROM products_attribute_values pa
                        JOIN attribute_values av ON pa.attribute_value_id = av.attribute_value_id
                        WHERE pa.product_id = ?`;
        const params = [product_id];
        const rows = await query(sql, params);
        return rows;
    }


    static async findByProductId(product_id) {
        const sql = `SELECT * FROM products_attribute_values
        WHERE product_id = ?`;
        const params = [product_id];

        const rows = await query(sql, params);
        return rows;
    }

    static async getAttributesWithDetails(product_id) {
        const sql = `
            SELECT 
                a.attribute_id,
                a.attribute_name,
                av.attribute_value_id,
                av.value_name
            FROM products_attribute_values pav
            JOIN attribute_values av ON pav.attribute_value_id = av.attribute_value_id
            JOIN attributes a ON av.attribute_id = a.attribute_id
            WHERE pav.product_id = ?
            ORDER BY a.attribute_name
        `;
        const params = [product_id];
        const rows = await query(sql, params);
        return rows;
    }



    
}

export default ProductsAttributeValues;