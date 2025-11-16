import Coupon from '../models/Coupon.js';

export const listCoupons = async (req, res) => {
    try {
        const { search = '', discount_type = '', is_active = '', page = '1', pageSize = '10' } = req.query;
        const { coupons, total } = await Coupon.listAndCount({
            search,
            discount_type: discount_type === 'fixed' ? 'fixed_amount' : discount_type,
            is_active,
            page: parseInt(page),
            pageSize: parseInt(pageSize)
        });
        return res.json({
            success: true,
            data: coupons.map(c => c.toJSON()),
            pagination: { total, page: parseInt(page), pageSize: parseInt(pageSize) }
        });
    } catch (error) {
        console.error('Error listing coupons:', error);
        return res.status(500).json({ success: false, message: 'Lỗi lấy danh sách coupon' });
    }
};

export const createCoupon = async (req, res) => {
    try {
        const {
            coupon_code, description, discount_type, discount_value,
            max_discount_amount, min_order_amount, usage_limit,
            is_active = true, valid_from, valid_until
        } = req.body;

        if (!coupon_code || !discount_type || !discount_value) {
            return res.status(400).json({ success: false, message: 'Thiếu mã coupon, loại giảm giá hoặc giá trị' });
        }

        if (discount_type !== 'percentage' && discount_type !== 'fixed_amount') {
            return res.status(400).json({ success: false, message: 'Loại giảm giá không hợp lệ' });
        }

        if (isNaN(discount_value) || Number(discount_value) <= 0) {
            return res.status(400).json({ success: false, message: 'Giá trị giảm giá phải là số dương' });
        }

        const existing = await Coupon.findByCode(coupon_code);
        if (existing) {
            return res.status(409).json({ success: false, message: 'Mã coupon đã tồn tại' });
        }

        const id = await Coupon.create({
            coupon_code,
            description: description || null,
            discount_type,
            discount_value: Number(discount_value),
            max_discount_amount: max_discount_amount ? Number(max_discount_amount) : null,
            min_order_amount: min_order_amount ? Number(min_order_amount) : 0,
            usage_limit: usage_limit ? parseInt(usage_limit) : null,
            is_active: is_active === true || is_active === 'true' || is_active === 1,
            valid_from: valid_from || null,
            valid_until: valid_until || null
        });

        const coupon = await Coupon.findById(id);
        return res.status(201).json({ success: true, message: 'Tạo coupon thành công', data: coupon.toJSON() });
    } catch (error) {
        console.error('Error creating coupon:', error);
        return res.status(500).json({ success: false, message: 'Lỗi tạo coupon' });
    }
};

export const getCouponById = async (req, res) => {
    try {
        const { couponId } = req.params;
        const coupon = await Coupon.findById(parseInt(couponId));
        if (!coupon) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy coupon' });
        }
        return res.json({ success: true, data: coupon.toJSON() });
    } catch (error) {
        console.error('Error getting coupon:', error);
        return res.status(500).json({ success: false, message: 'Lỗi lấy thông tin coupon' });
    }
};

export const updateCoupon = async (req, res) => {
    try {
        const { couponId } = req.params;
        const coupon = await Coupon.findById(parseInt(couponId));
        if (!coupon) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy coupon' });
        }

        const {
            coupon_code, description, discount_type, discount_value,
            max_discount_amount, min_order_amount, usage_limit,
            is_active, valid_from, valid_until
        } = req.body;

        if (coupon_code && coupon_code !== coupon.coupon_code) {
            const existing = await Coupon.findByCode(coupon_code);
            if (existing) {
                return res.status(409).json({ success: false, message: 'Mã coupon đã tồn tại' });
            }
        }

        const updateData = {};
        if (coupon_code !== undefined) updateData.coupon_code = coupon_code;
        if (description !== undefined) updateData.description = description || null;
        if (discount_type !== undefined) updateData.discount_type = discount_type;
        if (discount_value !== undefined) updateData.discount_value = Number(discount_value);
        if (max_discount_amount !== undefined) updateData.max_discount_amount = max_discount_amount ? Number(max_discount_amount) : null;
        if (min_order_amount !== undefined) updateData.min_order_amount = Number(min_order_amount || 0);
        if (usage_limit !== undefined) updateData.usage_limit = usage_limit ? parseInt(usage_limit) : null;
        if (is_active !== undefined) updateData.is_active = is_active === true || is_active === 'true' || is_active === 1;
        if (valid_from !== undefined) updateData.valid_from = valid_from || null;
        if (valid_until !== undefined) updateData.valid_until = valid_until || null;

        const updated = await coupon.update(updateData);
        if (!updated) {
            return res.status(400).json({ success: false, message: 'Không có thay đổi' });
        }

        const fresh = await Coupon.findById(parseInt(couponId));
        return res.json({ success: true, message: 'Cập nhật coupon thành công', data: fresh.toJSON() });
    } catch (error) {
        console.error('Error updating coupon:', error);
        return res.status(500).json({ success: false, message: 'Lỗi cập nhật coupon' });
    }
};

export const deleteCoupon = async (req, res) => {
    try {
        const { couponId } = req.params;
        const ok = await Coupon.delete(parseInt(couponId));
        if (!ok) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy coupon' });
        }
        return res.json({ success: true, message: 'Đã xóa coupon' });
    } catch (error) {
        console.error('Error deleting coupon:', error);
        return res.status(500).json({ success: false, message: 'Lỗi xóa coupon' });
    }
};

// Validate coupon code và tính toán discount
export const validateCoupon = async (req, res) => {
    try {
        const { couponCode, subtotal } = req.query;
        
        if (!couponCode) {
            return res.status(400).json({ success: false, message: 'Vui lòng nhập mã giảm giá' });
        }

        const coupon = await Coupon.findByCode(couponCode);
        
        if (!coupon) {
            return res.status(404).json({ success: false, message: 'Mã giảm giá không tồn tại' });
        }

        // Kiểm tra coupon có active không
        if (!coupon.is_active) {
            return res.status(400).json({ success: false, message: 'Mã giảm giá không còn hiệu lực' });
        }

        // Kiểm tra thời gian hiệu lực
        const now = new Date();
        if (coupon.valid_from && new Date(coupon.valid_from) > now) {
            return res.status(400).json({ success: false, message: 'Mã giảm giá chưa có hiệu lực' });
        }
        if (coupon.valid_until && new Date(coupon.valid_until) < now) {
            return res.status(400).json({ success: false, message: 'Mã giảm giá đã hết hạn' });
        }

        // Kiểm tra số lần sử dụng
        if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
            return res.status(400).json({ success: false, message: 'Mã giảm giá đã hết lượt sử dụng' });
        }

        // Kiểm tra giá trị đơn hàng tối thiểu
        const orderSubtotal = parseFloat(subtotal) || 0;
        if (orderSubtotal < coupon.min_order_amount) {
            return res.status(400).json({ 
                success: false, 
                message: `Đơn hàng tối thiểu ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(coupon.min_order_amount)} để sử dụng mã này` 
            });
        }

        // Tính toán discount amount
        let discountAmount = 0;
        if (coupon.discount_type === 'percentage') {
            discountAmount = (orderSubtotal * coupon.discount_value) / 100;
            if (coupon.max_discount_amount && discountAmount > coupon.max_discount_amount) {
                discountAmount = coupon.max_discount_amount;
            }
        } else if (coupon.discount_type === 'fixed_amount') {
            discountAmount = coupon.discount_value;
            if (discountAmount > orderSubtotal) {
                discountAmount = orderSubtotal;
            }
        }

        return res.json({
            success: true,
            data: {
                coupon: coupon.toJSON(),
                discountAmount: Math.round(discountAmount)
            }
        });
    } catch (error) {
        console.error('Error validating coupon:', error);
        return res.status(500).json({ success: false, message: 'Lỗi kiểm tra mã giảm giá' });
    }
};

