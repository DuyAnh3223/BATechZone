import { query } from '../../libs/db.js';

class ProductsAttributeValues {
    static async create(data) {
        const sql = `INSERT INTO products_attributes (
        product_id,
        attribute_value_id
        ) VALUES (?, ?)`;

        const params = [
            data.product_id,
            data.attribute_value_id,
        ];

        const [result] = await query(sql, params);
        return result.insertId;
    }

    static async delete(data){
        const sql = `DELETE FROM products_attributes
        WHERE product_id = ? AND attribute_value_id = ?`;

        const params = [
            data.product_id,
            data.attribute_value_id,
        ];

        const [result] = await query(sql, params);
        return result.affectedRows > 0;
    }

    static async findByProductId(product_id) {
        const sql = `SELECT * FROM products_attributes
        WHERE product_id = ?`;
        const params = [product_id];

        const [rows] = await query(sql, params);
        return rows;
    }



    
}

export default ProductsAttributeValues;