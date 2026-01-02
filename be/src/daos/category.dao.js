import { query } from "../libs/db";
import Category from "../models/Category";
class Category {
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
}

export default new Category();