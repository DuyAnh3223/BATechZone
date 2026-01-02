import { query } from "../libs/db";
import Product from "../models/Product";

class ProductDAO {
    async create(data)
    {
        const sql = `INSERT INTO products (
            category_id,
            product_name,
            slug,
            description,
            base_price,
            is_active,
            is_featured,
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`;

        const params = [
            data.category_id,
            data.product_name,
            data.slug,
            data.description || null,
            data.base_price || null,
            data.is_active || 1,
            data.is_featured || 0
        ]

        const [result] = await query(sql, params);
        return result.insertId;
    }

    async getAll()
    {
        const sql = `SELECT * FROM products ORDER BY product_name ASC`;
        const [rows] = await query(sql);
        return rows;
    }

    async update(product_id, data)
    {
        const sql = `UPDATE products SET
            category_id = ?,
            product_name = ?,
            slug = ?,
            description = ?,
            base_price = ?,
            is_active = ?,
            is_featured = ?
        WHERE product_id = ?`;

        const params = [
            data.category_id,
            data.product_name,
            data.slug,
            data.description || null,
            data.base_price || null,
            data.is_active || 1,
            data.is_featured || 0,
            product_id
        ]

        const [result] = await query(sql, params);
        return result.affectedRows > 0;

    }

    async delete(product_id)
    {
        const sql = `DELETE FROM products WHERE product_id = ?`;
        const params = [product_id];
        const [result] = await query(sql, params);
        return result.affectedRows > 0;
    }


}

export default new ProductDAO();