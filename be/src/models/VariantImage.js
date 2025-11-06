import { query } from '../libs/db.js';

class VariantImage {
    constructor(data) {
        this.image_id = data.image_id;
        this.variant_id = data.variant_id;
        this.image_url = data.image_url;
        this.display_order = data.display_order;
        this.created_at = data.created_at;
    }

    static async listByVariant(variantId) {
        const rows = await query(
            `SELECT image_id, variant_id, image_url, display_order, created_at
             FROM variant_images WHERE variant_id = ? ORDER BY display_order ASC, image_id ASC`,
            [variantId]
        );
        return rows.map(r => new VariantImage(r));
    }

    static async create({ variant_id, image_url, display_order = 0 }) {
        const result = await query(
            `INSERT INTO variant_images (variant_id, image_url, display_order) VALUES (?, ?, ?)`,
            [variant_id, image_url, display_order]
        );
        return result.insertId;
    }

    static async delete(imageId) {
        const result = await query(`DELETE FROM variant_images WHERE image_id = ?`, [imageId]);
        return result.affectedRows > 0;
    }
}

export default VariantImage;
