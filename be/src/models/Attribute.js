import { query } from '../libs/db.js';

class Attribute {
    constructor(data) {
        this.attribute_id = data.attribute_id;
        this.product_id = data.product_id;
        this.name = data.name; // e.g., Color, Size
        this.value = data.value; // e.g., Red, XL
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }

    static async listByProduct(productId) {
        const rows = await query(
            `SELECT attribute_id, product_id, name, value, created_at, updated_at
             FROM product_attributes WHERE product_id = ? ORDER BY attribute_id DESC`,
            [productId]
        );
        return rows.map(r => new Attribute(r));
    }

    static async create({ product_id, name, value }) {
        const result = await query(
            `INSERT INTO product_attributes (product_id, name, value) VALUES (?, ?, ?)`,
            [product_id, name, value]
        );
        return result.insertId;
    }

    static async delete(attributeId) {
        const result = await query(`DELETE FROM product_attributes WHERE attribute_id = ?`, [attributeId]);
        return result.affectedRows > 0;
    }
}

export default Attribute;

export class AttributeValue {
    constructor(data) {
        this.attribute_value_id = data.attribute_value_id;
        this.attribute_id = data.attribute_id;
        this.value_name = data.value_name;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }

    static async findByAttribute(attributeId) {
        const rows = await query('SELECT * FROM attribute_values WHERE attribute_id = ? ORDER BY attribute_value_id DESC', [attributeId]);
        return rows.map(r => new AttributeValue(r));
    }
}

export class VariantAttributeMapping {
    static async findByVariant(variantId) {
        const rows = await query('SELECT variant_id, attribute_value_id FROM variant_attributes WHERE variant_id = ?', [variantId]);
        return rows;
    }

    static async add({ variant_id, attribute_value_id }) {
        const result = await query('INSERT INTO variant_attributes (variant_id, attribute_value_id) VALUES (?, ?)', [variant_id, attribute_value_id]);
        return result.insertId;
    }

    static async remove({ variant_id, attribute_value_id }) {
        const result = await query('DELETE FROM variant_attributes WHERE variant_id = ? AND attribute_value_id = ?', [variant_id, attribute_value_id]);
        return result.affectedRows > 0;
    }
}
