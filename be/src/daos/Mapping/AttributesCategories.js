import { query } from "../../libs/db";

class AttributesCategories {
    static async create(data) {
        const sql = `INSERT INTO attributes_categories (
        attribute_id,
        category_id,
        is_variant_attribute
        ) VALUES (?, ?, ?)`;

        const params = [
            data.attribute_id,
            data.category_id,
            data.is_variant_attribute || 0
        ];

        const [result] = await query(sql, params);
        return result.insertId;
    }

    static async delete(data){
        const sql = `DELETE FROM attributes_categories
        WHERE attribute_id = ? AND category_id = ?`;

        const params = [
            data.attribute_id,
            data.category_id
        ];

        const [result] = await query(sql, params);
        return result.affectedRows > 0;
    }

    static async getAttributeByCategory(categoryId) {
        const sql = `SELECT ac.attribute_id, ac.is_variant_attribute
        FROM attributes_categories ac
        WHERE ac.category_id = ?`;
        const params = [categoryId];
        const [rows] = await query(sql, params);
        return rows;
    }

    static async getCategoriesByAttribute(attributeId) {
        const sql = `SELECT ac.category_id, ac.is_variant_attribute
        FROM attributes_categories ac
        WHERE ac.attribute_id = ?`;
        const params = [attributeId];
        const [rows] = await query(sql, params);
        return rows;
    }

    
}

export default AttributesCategories;