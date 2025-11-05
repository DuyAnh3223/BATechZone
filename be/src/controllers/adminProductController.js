import Product from '../models/Product.js';
import { query } from '../libs/db.js';

// Helper function để tạo slug từ product name
const createSlug = (name) => {
    return name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
};

// Admin lấy danh sách products
export const listProducts = async (req, res) => {
    try {
        const { search = '', category_id = '', is_active = '', page = '1', pageSize = '10' } = req.query;
        const { products, total } = await Product.listAndCount({
            search,
            category_id,
            is_active,
            page: parseInt(page),
            pageSize: parseInt(pageSize)
        });
        return res.json({
            success: true,
            data: products.map(p => p.toJSON()),
            pagination: { total, page: parseInt(page), pageSize: parseInt(pageSize) }
        });
    } catch (error) {
        console.error('Error listing products:', error);
        return res.status(500).json({
            success: false,
            message: "Đã có lỗi xảy ra khi lấy danh sách sản phẩm",
            error: error.message
        });
    }
};

// Admin lấy danh sách categories đơn giản (cho dropdown)
export const listCategoriesSimple = async (req, res) => {
    try {
        const categories = await query('SELECT category_id, category_name FROM categories WHERE is_active = 1 ORDER BY category_name');
        return res.json({
            success: true,
            data: categories
        });
    } catch (error) {
        console.error('Error listing categories simple:', error);
        return res.status(500).json({
            success: false,
            message: "Đã có lỗi xảy ra khi lấy danh sách danh mục",
            error: error.message
        });
    }
};

// Admin tạo product mới
export const createProduct = async (req, res) => {
    try {
        const { category_id, product_name, slug, description, brand, model, base_price, is_active = true, is_featured = false } = req.body;

        // Validate các trường bắt buộc
        if (!category_id || !product_name || !base_price) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng điền đầy đủ danh mục, tên sản phẩm và giá"
            });
        }

        // Validate base_price phải là số dương
        if (isNaN(base_price) || parseFloat(base_price) <= 0) {
            return res.status(400).json({
                success: false,
                message: "Giá sản phẩm phải là số dương"
            });
        }

        // Validate category_id
        if (isNaN(category_id) || parseInt(category_id) <= 0) {
            return res.status(400).json({
                success: false,
                message: "Danh mục không hợp lệ"
            });
        }

        // Tạo slug nếu không có
        let finalSlug = slug || createSlug(product_name);
        
        // Kiểm tra slug đã tồn tại chưa
        let existingProduct = await Product.findBySlug(finalSlug);
        if (existingProduct) {
            // Nếu slug đã tồn tại, thêm số vào cuối
            let counter = 1;
            while (existingProduct) {
                finalSlug = `${slug || createSlug(product_name)}-${counter}`;
                existingProduct = await Product.findBySlug(finalSlug);
                if (!existingProduct) break;
                counter++;
            }
        }

        // Tạo product
        const productId = await Product.create({
            category_id: parseInt(category_id),
            product_name,
            slug: finalSlug,
            description: description || null,
            brand: brand || null,
            model: model || null,
            base_price: parseFloat(base_price),
            is_active: is_active === true || is_active === 'true' || is_active === 1,
            is_featured: is_featured === true || is_featured === 'true' || is_featured === 1
        });

        // Lấy thông tin product vừa tạo
        const newProduct = await Product.findById(productId);

        return res.status(201).json({
            success: true,
            message: "Tạo sản phẩm thành công",
            data: newProduct.toJSON()
        });

    } catch (error) {
        console.error('Error creating product:', error);
        return res.status(500).json({
            success: false,
            message: "Đã có lỗi xảy ra khi tạo sản phẩm",
            error: error.message
        });
    }
};

// Admin lấy thông tin product theo ID
export const getProductById = async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await Product.findById(parseInt(productId));

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy sản phẩm"
            });
        }

        return res.json({
            success: true,
            data: product.toJSON()
        });

    } catch (error) {
        console.error('Error getting product:', error);
        return res.status(500).json({
            success: false,
            message: "Đã có lỗi xảy ra khi lấy thông tin sản phẩm",
            error: error.message
        });
    }
};

// Admin cập nhật product
export const updateProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const { category_id, product_name, slug, description, brand, model, base_price, is_active, is_featured } = req.body;

        // Tìm product theo ID
        const product = await Product.findById(parseInt(productId));
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy sản phẩm"
            });
        }

        // Validate base_price nếu có
        if (base_price !== undefined && (isNaN(base_price) || parseFloat(base_price) <= 0)) {
            return res.status(400).json({
                success: false,
                message: "Giá sản phẩm phải là số dương"
            });
        }

        // Validate slug nếu có thay đổi
        let finalSlug = slug || product.slug;
        if (slug && slug !== product.slug) {
            const existingProduct = await Product.findBySlug(slug);
            if (existingProduct && existingProduct.product_id !== parseInt(productId)) {
                return res.status(409).json({
                    success: false,
                    message: "Slug đã được sử dụng"
                });
            }
            finalSlug = slug;
        }

        // Tạo object update data
        const updateData = {};
        if (category_id !== undefined) updateData.category_id = parseInt(category_id);
        if (product_name) updateData.product_name = product_name;
        if (finalSlug) updateData.slug = finalSlug;
        if (description !== undefined) updateData.description = description || null;
        if (brand !== undefined) updateData.brand = brand || null;
        if (model !== undefined) updateData.model = model || null;
        if (base_price !== undefined) updateData.base_price = parseFloat(base_price);
        if (is_active !== undefined) updateData.is_active = is_active === true || is_active === 'true' || is_active === 1;
        if (is_featured !== undefined) updateData.is_featured = is_featured === true || is_featured === 'true' || is_featured === 1;

        // Cập nhật product
        const updated = await product.update(updateData);
        if (!updated) {
            return res.status(400).json({
                success: false,
                message: "Không có thông tin nào được cập nhật"
            });
        }

        // Lấy thông tin product đã cập nhật
        const updatedProduct = await Product.findById(parseInt(productId));

        return res.json({
            success: true,
            message: "Cập nhật sản phẩm thành công",
            data: updatedProduct.toJSON()
        });

    } catch (error) {
        console.error('Error updating product:', error);
        return res.status(500).json({
            success: false,
            message: "Đã có lỗi xảy ra khi cập nhật sản phẩm",
            error: error.message
        });
    }
};
