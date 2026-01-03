import { query } from '../../libs/db.js';

class CategoriesAttributesValues {

    static async getAll(){
        const sql = `SELECT * FROM categories_attributes_values`;
        const [rows] = await query(sql);
        return rows;
    }


    static async getAttributeValuesByCategory(category_id, attribute_id) {
        const sql = `SELECT av.*
                     FROM categories_attributes_values cav
                     JOIN attribute_values av ON cav.attribute_value_id = av.attribute_value_id
                     WHERE cav.category_id = ? AND cav.attribute_id = ?`;
        const params = [category_id, attribute_id];
        const rows = await query(sql, params);
        return rows;
    }

    // Gán giá trị thuộc tính cho danh mục
    static async assignAttributeValueForCategory(category_id, attribute_id, attribute_value_id) {
        const sql = `INSERT INTO categories_attributes_values 
                    (category_id, attribute_id, attribute_value_id)
                 VALUES (?, ?, ?)`;

        const params = [
            category_id,
            attribute_id,
            attribute_value_id,

        ];

        const result = await query(sql, params);
        return result.insertId;
    }

    // Bỏ gán giá trị thuộc tính cho danh mục
    static async unassignAttributeValueForCategory(category_id,attribute_id,attribute_value_id){
        const sql = `DELETE FROM categories_attributes_values 
        WHERE category_id = ? 
        AND attribute_id = ? 
        AND attribute_value_id = ?`;

        const params = [
            category_id,attribute_id,attribute_value_id
        ];

        const result = await query(sql, params);
        return result.affectedRows > 0;
    }


    // Kiểm tra đã tồn tại mapping 
    static async existingMapping(category_id, attribute_id, attribute_value_id) {
        const sql = `
            SELECT COUNT(*) as count
            FROM categories_attributes_values
            WHERE category_id = ? AND attribute_id = ? AND attribute_value_id = ?
        `;
        const params = [category_id, attribute_id, attribute_value_id];
        const rows = await query(sql, params);
        return rows[0].count > 0;
    }

   

    

    
}

export default CategoriesAttributesValues;