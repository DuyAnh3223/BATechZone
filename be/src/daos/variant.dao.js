import { query } from "../libs/db";
import Variant from "../models/Variant";

class VariantDAO {
    async create(data)
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
            data.stock_quantity || null,
            data.is_active || 1,
            data.is_default || 0,
            data.warranty_period || null
        ]

        const [result] = await query(sql, params);
        return result.insertId;
    }

    async getAll()
    {
        const sql = `SELECT * FROM product_variants ORDER BY variant_name ASC`;
        const [rows] = await query(sql);
        return rows;
    }

    async update(variant_id, data)
    {
        const sql = `UPDATE product_variants SET
            product_id = ?,
            sku = ?,
            variant_name = ?,
            price = ?,
            stock_quantity = ?,
            is_active = ?,
            is_default = ?
        WHERE variant_id = ?`;

        const params = [
            data.product_id,
            data.sku,
            data.variant_name,
            data.price,
            data.stock_quantity || null,
            data.is_active || 1,
            data.is_default || 0,
            variant_id
        ]

        const [result] = await query(sql, params);
        return result.affectedRows > 0;

    }

    async delete(variant_id)
    {
        const sql = `DELETE FROM product_variants WHERE variant_id = ?`;
        const params = [variant_id];
        const [result] = await query(sql, params);
        return result.affectedRows > 0;
    }


}

export default new VariantDAO();