import { query } from '../../libs/db.js';

class AttributesCategories {

    // Gán thuộc tính cho danh mục
    static async assignAttributeForCategory(attribute_id, category_id, is_variant_attribute = 0){ 
        const sql = `INSERT INTO attributes_categories (
        attribute_id,
        category_id,
        is_variant_attribute
        ) VALUES (?, ?, ?)`;

        const params = [
            attribute_id,
            category_id,
            is_variant_attribute || 0
        ];

        const result = await query(sql, params);
        return result.insertId;
        
    }

    // Bỏ gán thuộc tính cho danh mục
    static async unassignAttributeForCategory(attribute_id, category_id){
        const sql = `DELETE FROM attributes_categories
        WHERE attribute_id = ? AND category_id = ?`;

        const params = [
            attribute_id,
            category_id
        ];

        const result = await query(sql, params);
        return result.affectedRows > 0;
    }

    // Lấy danh sách thuộc tính theo danh mục
    static async getAttributesByCategory(category_id) {
        const sql = `SELECT ac.attribute_id, a.attribute_name, ac.is_variant_attribute
        FROM attributes_categories ac join attributes a ON ac.attribute_id = a.attribute_id
        WHERE ac.category_id = ?`;
        const params = [category_id];
        const rows = await query(sql, params);
        return rows;
    }

    // Kiểm tra đã tồn tại mapping 
    static async existingMapping(category_id, attribute_id) {
        const sql = `
            SELECT COUNT(*) as count
            FROM attributes_categories
            WHERE category_id = ? AND attribute_id = ?
        `;
        const params = [category_id, attribute_id];
        const rows = await query(sql, params);
        return rows[0].count > 0;
    }

    // Cập nhật is_variant_attribute
    static async updateIsVariantAttribute(category_id, attribute_id, is_variant_attribute) {
        const sql = `
            UPDATE attributes_categories
            SET is_variant_attribute = ?
            WHERE category_id = ? AND attribute_id = ?
        `;
        const params = [is_variant_attribute,  category_id, attribute_id];
        const result = await query(sql, params);
        return result.affectedRows > 0;
    }
}

export default AttributesCategories;