import { query } from '../libs/db.js';

class Coupon {
    constructor(data) {
        this.coupon_id = data.coupon_id;
        this.coupon_code = data.coupon_code;
        this.description = data.description;
        this.discount_type = data.discount_type;
        this.discount_value = data.discount_value;
        this.max_discount_amount = data.max_discount_amount;
        this.min_order_amount = data.min_order_amount;
        this.usage_limit = data.usage_limit;
        this.used_count = data.used_count || 0;
        this.is_active = data.is_active;
        this.valid_from = data.valid_from;
        this.valid_until = data.valid_until;
        this.created_at = data.created_at;
    }

    static async listAndCount({ search = '', discount_type, is_active, page = 1, pageSize = 10 }) {
        const where = [];
        const params = [];
        if (search) {
            where.push('(coupon_code LIKE ? OR description LIKE ?)');
            const like = `%${search}%`;
            params.push(like, like);
        }
        if (discount_type && discount_type !== '') {
            where.push('discount_type = ?');
            params.push(discount_type);
        }
        if (is_active !== undefined && is_active !== '') {
            where.push('is_active = ?');
            params.push(is_active === 'true' || is_active === true ? 1 : 0);
        }
        const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

        const countRows = await query(`SELECT COUNT(*) AS total FROM coupons ${whereSql}`, params);
        const total = countRows[0]?.total || 0;

        const limit = Math.max(1, parseInt(pageSize));
        const offset = Math.max(0, (parseInt(page) - 1) * limit);

        const rows = await query(
            `SELECT * FROM coupons ${whereSql} ORDER BY coupon_id DESC LIMIT ? OFFSET ?`,
            [...params, limit, offset]
        );
        return { coupons: rows.map(r => new Coupon(r)), total };
    }

    static async findById(couponId) {
        const rows = await query(`SELECT * FROM coupons WHERE coupon_id = ?`, [couponId]);
        return rows.length ? new Coupon(rows[0]) : null;
    }

    static async findByCode(couponCode) {
        const rows = await query(`SELECT * FROM coupons WHERE coupon_code = ?`, [couponCode]);
        return rows.length ? new Coupon(rows[0]) : null;
    }

    static async create({
        coupon_code, description, discount_type, discount_value,
        max_discount_amount = null, min_order_amount = 0, usage_limit = null,
        is_active = true, valid_from = null, valid_until = null
    }) {
        const result = await query(
            `INSERT INTO coupons (coupon_code, description, discount_type, discount_value, max_discount_amount, 
             min_order_amount, usage_limit, is_active, valid_from, valid_until)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [coupon_code, description || null, discount_type, discount_value, max_discount_amount,
             min_order_amount, usage_limit, is_active ? 1 : 0, valid_from, valid_until]
        );
        return result.insertId;
    }

    async update(updateData) {
        const allowed = ['coupon_code', 'description', 'discount_type', 'discount_value', 'max_discount_amount',
                        'min_order_amount', 'usage_limit', 'is_active', 'valid_from', 'valid_until'];
        const sets = [];
        const vals = [];
        for (const k of Object.keys(updateData)) {
            if (allowed.includes(k)) {
                sets.push(`${k} = ?`);
                if (k === 'is_active') {
                    vals.push(updateData[k] ? 1 : 0);
                } else {
                    vals.push(updateData[k]);
                }
            }
        }
        if (!sets.length) return false;
        vals.push(this.coupon_id);
        const result = await query(`UPDATE coupons SET ${sets.join(', ')} WHERE coupon_id = ?`, vals);
        return result.affectedRows > 0;
    }

    static async delete(couponId) {
        const result = await query(`DELETE FROM coupons WHERE coupon_id = ?`, [couponId]);
        return result.affectedRows > 0;
    }

    toJSON() {
        return {
            coupon_id: this.coupon_id,
            coupon_code: this.coupon_code,
            description: this.description,
            discount_type: this.discount_type,
            discount_value: parseFloat(this.discount_value),
            max_discount_amount: this.max_discount_amount ? parseFloat(this.max_discount_amount) : null,
            min_order_amount: parseFloat(this.min_order_amount),
            usage_limit: this.usage_limit,
            used_count: this.used_count || 0,
            is_active: Boolean(this.is_active),
            valid_from: this.valid_from,
            valid_until: this.valid_until,
            created_at: this.created_at
        };
    }
}

export default Coupon;

