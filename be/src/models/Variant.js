import { query } from '../libs/db.js';

class Variant {
    constructor(data) {
        this.variant_id = data.variant_id;
        this.product_id = data.product_id;
        this.sku = data.sku;
        this.variant_name = data.variant_name;
        this.price = data.price;
        this.compare_at_price = data.compare_at_price;
        this.cost_price = data.cost_price;
        this.stock = data.stock_quantity || data.stock; // Support both stock_quantity and stock
        this.stock_quantity = data.stock_quantity || data.stock;
        this.weight = data.weight;
        this.dimensions = data.dimensions;
        this.is_active = data.is_active;
        this.is_default = data.is_default;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }

    static async listByProduct(productId) {
        try {
            const rows = await query(
                `SELECT variant_id, product_id, sku, variant_name, price, compare_at_price, cost_price, 
                        stock_quantity, weight, dimensions, is_active, is_default, created_at, updated_at
                 FROM product_variants WHERE product_id = ? ORDER BY variant_id DESC`,
                [productId]
            );
            return rows.map(r => new Variant(r));
        } catch (error) {
            throw new Error(`Error listing variants by product: ${error.message}`);
        }
    }

    static async findById(variantId) {
        const rows = await query(`SELECT * FROM product_variants WHERE variant_id = ?`, [variantId]);
        return rows.length ? new Variant(rows[0]) : null;
    }

    static async create({ product_id, sku, variant_name = null, price, compare_at_price = null, cost_price = null, stock = 0, stock_quantity = null, weight = null, dimensions = null, is_active = true, is_default = false }) {
        // Use stock_quantity if provided, otherwise use stock
        const finalStock = stock_quantity !== null ? stock_quantity : stock;
        // SKU is NOT NULL in product_variants, so require it
        if (!sku) {
            throw new Error('SKU is required');
        }
        const result = await query(
            `INSERT INTO product_variants (product_id, sku, variant_name, price, compare_at_price, cost_price, stock_quantity, weight, dimensions, is_active, is_default)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [product_id, sku, variant_name, price, compare_at_price, cost_price, finalStock, weight, dimensions, is_active ? 1 : 0, is_default ? 1 : 0]
        );
        return result.insertId;
    }

    async update(updateData) {
        const allowed = ['sku', 'variant_name', 'price', 'compare_at_price', 'cost_price', 'stock', 'stock_quantity', 'weight', 'dimensions', 'is_active', 'is_default'];
        const sets = [];
        const vals = [];
        for (const k of Object.keys(updateData)) {
            if (allowed.includes(k)) {
                // Handle stock vs stock_quantity mapping
                if (k === 'stock') {
                    sets.push('stock_quantity = ?');
                    vals.push(updateData[k]);
                } else if (k === 'is_active' || k === 'is_default') {
                    sets.push(`${k} = ?`);
                    vals.push(updateData[k] ? 1 : 0);
                } else {
                    sets.push(`${k} = ?`);
                    vals.push(updateData[k]);
                }
            }
        }
        if (!sets.length) return false;
        vals.push(this.variant_id);
        const result = await query(
            `UPDATE product_variants SET ${sets.join(', ')}, updated_at = NOW() WHERE variant_id = ?`,
            vals
        );
        return result.affectedRows > 0;
    }

    static async delete(variantId) {
        const result = await query(`DELETE FROM product_variants WHERE variant_id = ?`, [variantId]);
        return result.affectedRows > 0;
    }

    toJSON() {
        return {
            variant_id: this.variant_id,
            product_id: this.product_id,
            sku: this.sku,
            variant_name: this.variant_name,
            price: parseFloat(this.price),
            compare_at_price: this.compare_at_price ? parseFloat(this.compare_at_price) : null,
            cost_price: this.cost_price ? parseFloat(this.cost_price) : null,
            stock: this.stock_quantity || this.stock || 0,
            stock_quantity: this.stock_quantity || this.stock || 0,
            weight: this.weight,
            dimensions: this.dimensions,
            is_active: Boolean(this.is_active),
            is_default: Boolean(this.is_default),
            created_at: this.created_at,
            updated_at: this.updated_at,
        };
    }
}

export default Variant;
