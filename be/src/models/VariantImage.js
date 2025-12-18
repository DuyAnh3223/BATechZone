import { query } from '../libs/db.js';

class VariantImage {
    constructor(data) {
        this.image_id = data.image_id;
        this.variant_id = data.variant_id;
        this.image_url = data.image_url;
        this.alt_text = data.alt_text;
        this.is_primary = data.is_primary;
        this.display_order = data.display_order;
        this.created_at = data.created_at;
    }

    static async listByVariant(variantId) {
        const rows = await query(
            `SELECT image_id, variant_id, image_url, alt_text, is_primary, display_order, created_at
             FROM variant_images 
             WHERE variant_id = ? 
             ORDER BY is_primary DESC, display_order ASC, image_id ASC`,
            [variantId]
        );
        return rows.map(r => new VariantImage(r));
    }

    static async getById(imageId) {
        const rows = await query(
            `SELECT image_id, variant_id, image_url, alt_text, is_primary, display_order, created_at
             FROM variant_images WHERE image_id = ?`,
            [imageId]
        );
        return rows.length > 0 ? new VariantImage(rows[0]) : null;
    }

    static async getPrimaryByVariant(variantId) {
        const rows = await query(
            `SELECT image_id, variant_id, image_url, alt_text, is_primary, display_order, created_at
             FROM variant_images 
             WHERE variant_id = ? AND is_primary = 1
             LIMIT 1`,
            [variantId]
        );
        return rows.length > 0 ? new VariantImage(rows[0]) : null;
    }

    static async create({ variant_id, image_url, alt_text = null, is_primary = false, display_order = 0 }) {
        const result = await query(
            `INSERT INTO variant_images (variant_id, image_url, alt_text, is_primary, display_order) 
             VALUES (?, ?, ?, ?, ?)`,
            [variant_id, image_url, alt_text, is_primary ? 1 : 0, display_order]
        );
        return result.insertId;
    }

    static async update(imageId, { alt_text, display_order }) {
        const result = await query(
            `UPDATE variant_images 
             SET alt_text = ?, display_order = ?
             WHERE image_id = ?`,
            [alt_text, display_order, imageId]
        );
        return result.affectedRows > 0;
    }

    static async updatePrimary(imageId, isPrimary) {
        const result = await query(
            `UPDATE variant_images 
             SET is_primary = ?
             WHERE image_id = ?`,
            [isPrimary ? 1 : 0, imageId]
        );
        return result.affectedRows > 0;
    }

    static async delete(imageId) {
        const result = await query(`DELETE FROM variant_images WHERE image_id = ?`, [imageId]);
        return result.affectedRows > 0;
    }

    static async deleteByVariant(variantId) {
        const result = await query(`DELETE FROM variant_images WHERE variant_id = ?`, [variantId]);
        return result.affectedRows > 0;
    }
}

export default VariantImage;
