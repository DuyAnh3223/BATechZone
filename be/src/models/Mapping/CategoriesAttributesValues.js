import { query } from "../../libs/db";

class CategoriesAttributesValues {

    static async getAll(){
        const sql = `SELECT * FROM categories_attributes_values`;
        const [rows] = await query(sql);
        return rows;
    }

    
    static async create(data) {
        const sql = `INSERT INTO categories_attributes_values 
                    (category_id, attribute_id, attribute_value_id)
                 VALUES (?, ?, ?)`;

        const params = [
            data.category_id,
            data.attribute_id,
            data.attribute_value_id,

        ];

        const [result] = await query(sql, params);
        return result.insertId;
    }

    static async delete(data){
        const sql = `DELETE FROM categories_attributes_values WHERE cav_id = ?`;

        const params = [
            data.cav_id,
        ];

        const [result] = await query(sql, params);
        return result.affectedRows > 0;
    }

   

    

    
}

export default CategoriesAttributesValues;