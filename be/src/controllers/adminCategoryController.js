import Category from '../models/Category.js';
import { query } from '../libs/db.js';

// Helper function để tạo slug từ category name
const createSlug = (name) => {
    return name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
};

// Admin lấy danh sách categories
export const listCategories = async (req, res) => {
    try {
        const { search = '', is_active = '', page = '1', pageSize = '10' } = req.query;
        const { categories, total } = await Category.listAndCount({
            search,
            is_active,
            page: parseInt(page),
            pageSize: parseInt(pageSize)
        });
        return res.json({
            success: true,
            data: categories.map(c => c.toJSON()),
            pagination: { total, page: parseInt(page), pageSize: parseInt(pageSize) }
        });
    } catch (error) {
        console.error('Error listing categories:', error);
        return res.status(500).json({
            success: false,
            message: "Đã có lỗi xảy ra khi lấy danh sách danh mục",
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

// Admin tạo category mới
export const createCategory = async (req, res) => {
    try {
        const {
            category_name,
            slug,
            description,
            parent_category_id,
            image_url,
            icon,
            is_active = true,
            display_order = 0
        } = req.body;

        if (!category_name) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng điền tên danh mục"
            });
        }

        // Tạo slug nếu không có
        let finalSlug = slug || createSlug(category_name);
        
        // Kiểm tra slug đã tồn tại chưa
        let existingCategory = await Category.findBySlug(finalSlug);
        if (existingCategory) {
            // Nếu slug đã tồn tại, thêm số vào cuối
            let counter = 1;
            while (existingCategory) {
                finalSlug = `${slug || createSlug(category_name)}-${counter}`;
                existingCategory = await Category.findBySlug(finalSlug);
                if (!existingCategory) break;
                counter++;
            }
        }

        // Validate parent_category_id nếu có
        if (parent_category_id) {
            const parent = await Category.findById(parseInt(parent_category_id));
            if (!parent) {
                return res.status(400).json({
                    success: false,
                    message: "Danh mục cha không tồn tại"
                });
            }
        }

        const categoryId = await Category.create({
            category_name,
            slug: finalSlug,
            description: description || null,
            parent_category_id: parent_category_id ? parseInt(parent_category_id) : null,
            image_url: image_url || null,
            icon: icon || null,
            is_active: is_active === true || is_active === 'true' || is_active === 1,
            display_order: parseInt(display_order) || 0
        });

        const newCategory = await Category.findById(categoryId);

        return res.status(201).json({
            success: true,
            message: "Tạo danh mục thành công",
            data: newCategory.toJSON()
        });

    } catch (error) {
        console.error('Error creating category:', error);
        return res.status(500).json({
            success: false,
            message: "Đã có lỗi xảy ra khi tạo danh mục",
            error: error.message
        });
    }
};

// Admin lấy thông tin category theo ID
export const getCategoryById = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const category = await Category.findById(parseInt(categoryId));

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy danh mục"
            });
        }

        return res.json({
            success: true,
            data: category.toJSON()
        });

    } catch (error) {
        console.error('Error getting category:', error);
        return res.status(500).json({
            success: false,
            message: "Đã có lỗi xảy ra khi lấy thông tin danh mục",
            error: error.message
        });
    }
};

// Admin cập nhật category
export const updateCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const {
            category_name,
            slug,
            description,
            parent_category_id,
            image_url,
            icon,
            is_active,
            display_order
        } = req.body;

        const category = await Category.findById(parseInt(categoryId));
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy danh mục"
            });
        }

        // Build update data object
        const updateData = {};

        // Validate parent_category_id nếu có thay đổi
        if (parent_category_id !== undefined) {
            // Nếu parent_category_id là empty string hoặc null, set thành null
            if (parent_category_id === '' || parent_category_id === null) {
                updateData.parent_category_id = null;
            } else {
                // Validate parent category exists and is not self
                const parentId = parseInt(parent_category_id);
                if (isNaN(parentId)) {
                    return res.status(400).json({
                        success: false,
                        message: "Danh mục cha không hợp lệ"
                    });
                }
                if (parentId === parseInt(categoryId)) {
                    return res.status(400).json({
                        success: false,
                        message: "Danh mục không thể là cha của chính nó"
                    });
                }
                const parent = await Category.findById(parentId);
                if (!parent) {
                    return res.status(400).json({
                        success: false,
                        message: "Danh mục cha không tồn tại"
                    });
                }
                updateData.parent_category_id = parentId;
            }
        }

        // Validate slug nếu có thay đổi
        let finalSlug = slug || category.slug;
        if (slug && slug !== category.slug) {
            const existingCategory = await Category.findBySlug(slug);
            if (existingCategory && existingCategory.category_id !== parseInt(categoryId)) {
                return res.status(409).json({
                    success: false,
                    message: "Slug đã được sử dụng"
                });
            }
            finalSlug = slug;
        }
        if (category_name) updateData.category_name = category_name;
        if (finalSlug) updateData.slug = finalSlug;
        if (description !== undefined) updateData.description = description || null;
        // parent_category_id đã được xử lý ở trên
        if (image_url !== undefined) updateData.image_url = image_url || null;
        if (icon !== undefined) updateData.icon = icon || null;
        if (is_active !== undefined) updateData.is_active = is_active === true || is_active === 'true' || is_active === 1;
        if (display_order !== undefined) updateData.display_order = parseInt(display_order) || 0;

        const updated = await category.update(updateData);
        if (!updated) {
            return res.status(400).json({
                success: false,
                message: "Không có thông tin nào được cập nhật"
            });
        }

        const updatedCategory = await Category.findById(parseInt(categoryId));

        return res.json({
            success: true,
            message: "Cập nhật danh mục thành công",
            data: updatedCategory.toJSON()
        });

    } catch (error) {
        console.error('Error updating category:', error);
        return res.status(500).json({
            success: false,
            message: "Đã có lỗi xảy ra khi cập nhật danh mục",
            error: error.message
        });
    }
};

// Admin xóa category
export const deleteCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const ok = await Category.delete(parseInt(categoryId));
        if (!ok) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy danh mục'
            });
        }
        return res.json({
            success: true,
            message: 'Đã xóa danh mục'
        });
    } catch (error) {
        console.error('Error deleting category:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Lỗi xóa danh mục'
        });
    }
};

