import { query } from "../libs/db.js";
import Category from "../models/Category.js";

class CategoryDAO {
    async create(data)
    {
        const sql = `INSERT INTO categories (
            category_name,
            description,
            parent_category_id,
            image_url,
            icon,
            is_active,
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
        ];

        const result = await query(sql, params);
        return result.insertId;
    }

    async getAll()
    {
        const sql = `SELECT * FROM categories ORDER BY display_order ASC, category_name ASC`;
        const rows = await query(sql);
        return rows;
    }

    async findById(categoryId)
    {
        const sql = `SELECT * FROM categories WHERE category_id = ?`;
        const rows = await query(sql, [categoryId]);
        return rows[0] || null;
    }

    async findByName(categoryName)
    {
        const sql = `SELECT * FROM categories WHERE category_name = ?`;
        const rows = await query(sql, [categoryName]);
        return rows[0] || null;
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
        ];

        const result = await query(sql, params);
        return result.affectedRows > 0;
    }

    async delete(categoryId)
    {
        const sql = `DELETE FROM categories WHERE category_id = ?`;
        const params = [categoryId];
        const result = await query(sql, params);
        return result.affectedRows > 0;
    }

    // // Get all attributes for a category
    // async getAttributesByCategory(categoryId)
    // {
    //     const sql = `
    //         SELECT 
    //             a.attribute_id,
    //             a.attribute_name,
    //             ac.is_variant_attribute,
    //             ac.created_at as assigned_at
    //         FROM attributes a
    //         INNER JOIN attributes_categories ac ON a.attribute_id = ac.attribute_id
    //         WHERE ac.category_id = ?
    //         ORDER BY a.attribute_name ASC
    //     `;
    //     const [rows] = await query(sql, [categoryId]);
    //     return rows;
    // }

    // // Get attribute values for a specific attribute in a category
    // async getAttributeValues(categoryId, attributeId)
    // {
    //     const sql = `
    //         SELECT 
    //             av.attribute_value_id,
    //             av.value_name,
    //             av.color_code,
    //             av.image_url,
    //             av.display_order,
    //             av.is_active,
    //             cav.cav_id
    //         FROM attribute_values av
    //         INNER JOIN categories_attributes_values cav 
    //             ON av.attribute_value_id = cav.attribute_value_id
    //         WHERE cav.category_id = ? AND cav.attribute_id = ?
    //         ORDER BY av.display_order ASC, av.value_name ASC
    //     `;
    //     const [rows] = await query(sql, [categoryId, attributeId]);
    //     return rows;
    // }

    // // Assign attribute to category
    // async assignAttributeToCategory(categoryId, attributeId, isVariant = 0)
    // {
    //     const sql = `
    //         INSERT INTO attributes_categories (
    //             attribute_id, 
    //             category_id, 
    //             is_variant_attribute
    //         ) VALUES (?, ?, ?)
    //     `;
    //     const [result] = await query(sql, [attributeId, categoryId, isVariant]);
    //     return result.affectedRows > 0;
    // }

    // // Check if attribute is already assigned to category
    // async isAttributeAssigned(categoryId, attributeId)
    // {
    //     const sql = `
    //         SELECT COUNT(*) as count 
    //         FROM attributes_categories 
    //         WHERE category_id = ? AND attribute_id = ?
    //     `;
    //     const [rows] = await query(sql, [categoryId, attributeId]);
    //     return rows[0].count > 0;
    // }

    // // Remove attribute from category
    // async removeAttributeFromCategory(categoryId, attributeId)
    // {
    //     const sql = `
    //         DELETE FROM attributes_categories 
    //         WHERE category_id = ? AND attribute_id = ?
    //     `;
    //     const [result] = await query(sql, [categoryId, attributeId]);
    //     return result.affectedRows > 0;
    // }

    // // Update is_variant_attribute flag
    // async updateIsVariantAttribute(categoryId, attributeId, isVariant)
    // {
    //     const sql = `
    //         UPDATE attributes_categories 
    //         SET is_variant_attribute = ?
    //         WHERE category_id = ? AND attribute_id = ?
    //     `;
    //     const [result] = await query(sql, [isVariant, categoryId, attributeId]);
    //     return result.affectedRows > 0;
    // }

    // // Assign value to category + attribute
    // async assignValueToCategory(categoryId, attributeId, valueId)
    // {
    //     const sql = `
    //         INSERT INTO categories_attributes_values (
    //             category_id, 
    //             attribute_id, 
    //             attribute_value_id
    //         ) VALUES (?, ?, ?)
    //     `;
    //     const [result] = await query(sql, [categoryId, attributeId, valueId]);
    //     return result.insertId;
    // }

    // // Check if value is already assigned
    // async isValueAssigned(categoryId, attributeId, valueId)
    // {
    //     const sql = `
    //         SELECT COUNT(*) as count 
    //         FROM categories_attributes_values 
    //         WHERE category_id = ? AND attribute_id = ? AND attribute_value_id = ?
    //     `;
    //     const [rows] = await query(sql, [categoryId, attributeId, valueId]);
    //     return rows[0].count > 0;
    // }

    // // Remove value from category
    // async removeValueFromCategory(cavId)
    // {
    //     const sql = `DELETE FROM categories_attributes_values WHERE cav_id = ?`;
    //     const [result] = await query(sql, [cavId]);
    //     return result.affectedRows > 0;
    // }

    // // Remove all values of an attribute from a category
    // async removeAllValuesOfAttribute(categoryId, attributeId)
    // {
    //     const sql = `
    //         DELETE FROM categories_attributes_values 
    //         WHERE category_id = ? AND attribute_id = ?
    //     `;
    //     const [result] = await query(sql, [categoryId, attributeId]);
    //     return result.affectedRows;
    // }
}

export default new CategoryDAO();