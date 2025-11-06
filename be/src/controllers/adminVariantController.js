import Variant from '../models/Variant.js';
import Attribute from '../models/Attribute.js';
import VariantImage from '../models/VariantImage.js';
import { query } from '../libs/db.js';
import path from 'path';
import fs from 'fs';
import { getPublicUrlForVariant, mapPublicUrlToDiskPath } from '../middleware/upload.js';

// Variants
export const listVariants = async (req, res) => {
    try {
        const { productId } = req.params;
        const variants = await Variant.listByProduct(parseInt(productId));
        return res.json({ success: true, data: variants.map(v => v.toJSON ? v.toJSON() : v) });
    } catch (e) {
        console.error('Error in listVariants:', e);
        return res.status(500).json({ success: false, message: 'Lỗi khi lấy danh sách biến thể', error: e.message });
    }
};

export const createVariant = async (req, res) => {
    try {
        const { productId } = req.params;
        const { sku, variant_name, price, compare_at_price, cost_price, stock = 0, stock_quantity, weight, dimensions, is_active = true, is_default = false } = req.body;
        if (!sku) {
            return res.status(400).json({ success: false, message: 'SKU là bắt buộc' });
        }
        if (!price || isNaN(price) || Number(price) <= 0) {
            return res.status(400).json({ success: false, message: 'Giá phải là số dương' });
        }
        const id = await Variant.create({ 
            product_id: parseInt(productId), 
            sku, 
            variant_name: variant_name || null,
            price: Number(price), 
            compare_at_price: compare_at_price ? Number(compare_at_price) : null,
            cost_price: cost_price ? Number(cost_price) : null,
            stock: parseInt(stock || 0),
            stock_quantity: stock_quantity !== undefined ? parseInt(stock_quantity) : null,
            weight: weight ? parseFloat(weight) : null,
            dimensions: dimensions || null,
            is_active: !!is_active,
            is_default: !!is_default
        });
        const v = await Variant.findById(id);
        return res.status(201).json({ success: true, data: v.toJSON() });
    } catch (e) {
        return res.status(500).json({ success: false, message: 'Lỗi khi tạo biến thể', error: e.message });
    }
};

export const updateVariant = async (req, res) => {
    try {
        const { variantId } = req.params;
        const v = await Variant.findById(parseInt(variantId));
        if (!v) return res.status(404).json({ success: false, message: 'Không tìm thấy biến thể' });
        const { sku, variant_name, price, compare_at_price, cost_price, stock, stock_quantity, weight, dimensions, is_active, is_default } = req.body;
        if (price !== undefined && (isNaN(price) || Number(price) <= 0)) {
            return res.status(400).json({ success: false, message: 'Giá phải là số dương' });
        }
        const updateData = {};
        if (sku !== undefined) updateData.sku = sku;
        if (variant_name !== undefined) updateData.variant_name = variant_name || null;
        if (price !== undefined) updateData.price = Number(price);
        if (compare_at_price !== undefined) updateData.compare_at_price = compare_at_price ? Number(compare_at_price) : null;
        if (cost_price !== undefined) updateData.cost_price = cost_price ? Number(cost_price) : null;
        if (stock !== undefined) updateData.stock = parseInt(stock);
        if (stock_quantity !== undefined) updateData.stock_quantity = parseInt(stock_quantity);
        if (weight !== undefined) updateData.weight = weight ? parseFloat(weight) : null;
        if (dimensions !== undefined) updateData.dimensions = dimensions || null;
        if (is_active !== undefined) updateData.is_active = !!is_active;
        if (is_default !== undefined) updateData.is_default = !!is_default;
        
        const updated = await v.update(updateData);
        if (!updated) return res.status(400).json({ success: false, message: 'Không có thay đổi' });
        const fresh = await Variant.findById(v.variant_id);
        return res.json({ success: true, data: fresh.toJSON() });
    } catch (e) {
        return res.status(500).json({ success: false, message: 'Lỗi khi cập nhật biến thể', error: e.message });
    }
};

export const deleteVariant = async (req, res) => {
    try {
        const { variantId } = req.params;
        const ok = await Variant.delete(parseInt(variantId));
        if (!ok) return res.status(404).json({ success: false, message: 'Không tìm thấy biến thể' });
        return res.json({ success: true, message: 'Đã xóa biến thể' });
    } catch (e) {
        return res.status(500).json({ success: false, message: 'Lỗi khi xóa biến thể', error: e.message });
    }
};

// Attributes (simple per-product list)
export const listAttributes = async (req, res) => {
    try {
        const { productId } = req.params;
        const attrs = await Attribute.listByProduct(parseInt(productId));
        return res.json({ success: true, data: attrs });
    } catch (e) {
        return res.status(500).json({ success: false, message: 'Lỗi khi lấy thuộc tính', error: e.message });
    }
};

export const createAttribute = async (req, res) => {
    try {
        const { productId } = req.params;
        const { name, value } = req.body;
        if (!name || !value) return res.status(400).json({ success: false, message: 'Thiếu name hoặc value' });
        const id = await Attribute.create({ product_id: parseInt(productId), name, value });
        return res.status(201).json({ success: true, data: { attribute_id: id, product_id: parseInt(productId), name, value } });
    } catch (e) {
        return res.status(500).json({ success: false, message: 'Lỗi khi tạo thuộc tính', error: e.message });
    }
};

export const deleteAttribute = async (req, res) => {
    try {
        const { attributeId } = req.params;
        const ok = await Attribute.delete(parseInt(attributeId));
        if (!ok) return res.status(404).json({ success: false, message: 'Không tìm thấy thuộc tính' });
        return res.json({ success: true, message: 'Đã xóa thuộc tính' });
    } catch (e) {
        return res.status(500).json({ success: false, message: 'Lỗi khi xóa thuộc tính', error: e.message });
    }
};

// Variant-Attribute mapping
export const listVariantMappings = async (req, res) => {
    try {
        const { productId } = req.params;
        const rows = await query(
            `SELECT va.variant_id, va.attribute_value_id as attribute_id
             FROM variant_attributes va
             JOIN product_variants pv ON pv.variant_id = va.variant_id
             WHERE pv.product_id = ?`,
            [parseInt(productId)]
        );
        return res.json({ success: true, data: rows });
    } catch (e) {
        return res.status(500).json({ success: false, message: 'Lỗi khi lấy mapping', error: e.message });
    }
};

export const setVariantMappings = async (req, res) => {
    try {
        const { variantId } = req.params;
        const { attributeIds } = req.body; // array of attribute_value_id
        if (!Array.isArray(attributeIds)) {
            return res.status(400).json({ success: false, message: 'attributeIds phải là mảng' });
        }
        await query(`DELETE FROM variant_attributes WHERE variant_id = ?`, [parseInt(variantId)]);
        for (const aid of attributeIds) {
            await query(`INSERT INTO variant_attributes (variant_id, attribute_value_id) VALUES (?, ?)`, [parseInt(variantId), parseInt(aid)]);
        }
        return res.json({ success: true, message: 'Đã cập nhật mapping' });
    } catch (e) {
        return res.status(500).json({ success: false, message: 'Lỗi khi cập nhật mapping', error: e.message });
    }
};

// Images per variant
export const listVariantImages = async (req, res) => {
    try {
        const { variantId } = req.params;
        const imgs = await VariantImage.listByVariant(parseInt(variantId));
        return res.json({ success: true, data: imgs });
    } catch (e) {
        return res.status(500).json({ success: false, message: 'Lỗi khi lấy ảnh', error: e.message });
    }
};

export const addVariantImage = async (req, res) => {
    try {
        const { variantId } = req.params;
        const { image_url, display_order = 0 } = req.body;
        if (!image_url) return res.status(400).json({ success: false, message: 'Thiếu image_url' });
        const id = await VariantImage.create({ variant_id: parseInt(variantId), image_url, display_order: parseInt(display_order) });
        return res.status(201).json({ success: true, data: { image_id: id, variant_id: parseInt(variantId), image_url, display_order: parseInt(display_order) } });
    } catch (e) {
        return res.status(500).json({ success: false, message: 'Lỗi khi thêm ảnh', error: e.message });
    }
};

export const addVariantImageUpload = async (req, res) => {
    try {
        const { variantId } = req.params;
        if (!req.file) return res.status(400).json({ success: false, message: 'Chưa chọn file' });
        const display_order = parseInt(req.body?.display_order || 0);
        const filename = path.basename(req.file.path);
        const publicUrl = getPublicUrlForVariant(variantId, filename);
        const id = await VariantImage.create({ variant_id: parseInt(variantId), image_url: publicUrl, display_order });
        return res.status(201).json({ success: true, data: { image_id: id, variant_id: parseInt(variantId), image_url: publicUrl, display_order } });
    } catch (e) {
        return res.status(500).json({ success: false, message: 'Lỗi khi upload ảnh', error: e.message });
    }
};

export const addVariantImagesUploadMultiple = async (req, res) => {
    try {
        const { variantId } = req.params;
        const files = req.files || [];
        if (!files.length) return res.status(400).json({ success: false, message: 'Chưa chọn file' });
        // get current max display_order
        const rows = await query(`SELECT COALESCE(MAX(display_order), -1) AS max_order FROM variant_images WHERE variant_id = ?`, [parseInt(variantId)]);
        let nextOrder = (rows?.[0]?.max_order ?? -1) + 1;
        const created = [];
        for (const f of files) {
            const filename = path.basename(f.path);
            const publicUrl = getPublicUrlForVariant(variantId, filename);
            const id = await VariantImage.create({ variant_id: parseInt(variantId), image_url: publicUrl, display_order: nextOrder });
            created.push({ image_id: id, variant_id: parseInt(variantId), image_url: publicUrl, display_order: nextOrder });
            nextOrder += 1;
        }
        return res.status(201).json({ success: true, data: created });
    } catch (e) {
        return res.status(500).json({ success: false, message: 'Lỗi khi upload nhiều ảnh', error: e.message });
    }
};

export const deleteVariantImage = async (req, res) => {
    try {
        const { imageId } = req.params;
        // fetch image to get URL
        const rows = await query(`SELECT image_url FROM variant_images WHERE image_id = ?`, [parseInt(imageId)]);
        const ok = await VariantImage.delete(parseInt(imageId));
        if (!ok) return res.status(404).json({ success: false, message: 'Không tìm thấy ảnh' });
        // try to remove file on disk
        const publicUrl = rows?.[0]?.image_url;
        if (publicUrl) {
            const filePath = mapPublicUrlToDiskPath(publicUrl);
            if (filePath && fs.existsSync(filePath)) {
                try { fs.unlinkSync(filePath); } catch {}
            }
        }
        return res.json({ success: true, message: 'Đã xóa ảnh' });
    } catch (e) {
        return res.status(500).json({ success: false, message: 'Lỗi khi xóa ảnh', error: e.message });
    }
};
