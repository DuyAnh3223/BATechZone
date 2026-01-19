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
            warranty_period,
            discount_percent,
            discount_start_date,
            discount_end_date
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const params = [
            data.product_id,
            data.sku,
            data.variant_name,
            data.price,
            data.stock_quantity || 0,
            data.is_active !== undefined ? data.is_active : 1,
            data.is_default || 0,
            data.warranty_period || null,
            data.discount_percent || 0,
            data.discount_start_date || null,
            data.discount_end_date || null
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
            warranty_period = ?,
            discount_percent = ?,
            discount_start_date = ?,
            discount_end_date = ?
        WHERE variant_id = ?`;

        const params = [
            data.sku,
            data.variant_name,
            data.price,
            data.stock_quantity || null,
            data.is_active || 1,
            data.is_default || 0,
            data.warranty_period || null,
            data.discount_percent !== undefined ? data.discount_percent : null,
            data.discount_start_date || null,
            data.discount_end_date || null,
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
        const sql = `
            SELECT 
                pv.*,
                CASE 
                    WHEN pv.variant_type = 'bundle' 
                    THEN COALESCE((SELECT available_stock FROM v_bundle_stock WHERE variant_id = pv.variant_id), 0)
                    ELSE pv.stock_quantity
                END as stock
            FROM product_variants pv
            WHERE pv.product_id = ? 
            ORDER BY pv.variant_name ASC
        `;
        const params = [product_id];
        const rows = await query(sql, params);
        return rows;
    }
}

export default new VariantDAO();