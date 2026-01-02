import { query } from "../libs/db";
import Category from "../models/Category";
class CategoryDAO {
    async create(data)
    {
        const sql = `INSERT INTO categories (
            category_name,
            description,
            parent_category_id,
            image_url,
            icon,
            is_active
            display_order
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`;

        const params = [
            data.category_name,
            data.description || null,
            data.parent_category_id || null,
            data.image_url || null,
            data.icon || null,
            data.is_active || 1,
            data.display_order || 0
        ]

        const [result] = await query(sql, params);
        return result.insertId;
    }

    async getAll()
    {
        const sql = `SELECT * FROM categories ORDER BY display_order ASC, category_name ASC`;
        const [rows] = await query(sql);
        return rows;
    }

    async update(category_id, data)
    {
        const sql = `UPDATE categories SET
            category_name = ?,
            description = ?,
            parent_category_id = ?,
            image_url = ?,
            icon = ?,
            is_active = ?,
            display_order = ?
        WHERE category_id = ?`;

        const params = [
            data.category_name,
            data.description || null,
            data.parent_category_id || null,
            data.image_url || null,
            data.icon || null,
            data.is_active || 1,
            data.display_order || 0,
            category_id
        ]

        const [result] = await query(sql, params);
        return result.affectedRows > 0;

    }

    async delete(categoryId)
    {
        const sql = `DELETE FROM categories WHERE category_id = ?`;
        const params = [categoryId];
        const [result] = await query(sql, params);
        return result.affectedRows > 0;
    }


}

export default new CategoryDAO();