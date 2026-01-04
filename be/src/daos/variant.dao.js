import { query } from "../libs/db.js";

class VariantDAO {
    async createVariant(data, connection = null)
    {
        const sql = `INSERT INTO product_variants (
            product_id,
            sku,
            variant_name,
            price,
            stock_quantity,
            is_active,
            is_default,
            warranty_period
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

        const params = [
            data.product_id,
            data.sku,
            data.variant_name,
            data.price,
            data.stock_quantity || 0,
            data.is_active !== undefined ? data.is_active : 1,
            data.is_default || 0,
            data.warranty_period || null
        ]

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



    async getAll()
    {
        const sql = `SELECT * FROM product_variants ORDER BY variant_name ASC`;
        const rows = await query(sql);
        return rows;
    }

    async updateVariant(variant_id, data)
    {
        const sql = `UPDATE product_variants SET
            sku = ?,
            variant_name = ?,
            price = ?,
            stock_quantity = ?,
            is_active = ?,
            is_default = ?,
            warranty_period = ?
        WHERE variant_id = ?`;

        const params = [
            data.sku,
            data.variant_name,
            data.price,
            data.stock_quantity || null,
            data.is_active || 1,
            data.is_default || 0,
            data.warranty_period || null,
            variant_id
        ]

        const result = await query(sql, params);
        return result.affectedRows > 0;

    }


    async deleteVariant(variant_id)
    {
        const sql = `DELETE FROM product_variants WHERE variant_id = ?`;
        const params = [variant_id];
        const result = await query(sql, params);
        return result.affectedRows > 0;
    }

    


    // Additional methods 

    async findById(variant_id)
    {
        const sql = `SELECT * FROM product_variants WHERE variant_id = ?`;
        const params = [variant_id];
        const rows = await query(sql, params);
        return rows.length > 0 ? rows[0] : null;
    }

    async getVariantsByProductId(product_id)
    {
        const sql = `SELECT * FROM product_variants WHERE product_id = ? ORDER BY variant_name ASC`;
        const params = [product_id];
        const rows = await query(sql, params);
        return rows;
    }
}

export default new VariantDAO();