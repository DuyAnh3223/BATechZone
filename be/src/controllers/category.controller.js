import CategoryService from '../services/category.service.js';

/**
 * Category Controller - HTTP Request Handler
 */
class CategoryController {

    // Tạo danh mục mới
    async createCategory(req, res) {
        try {
            const result = await CategoryService.createCategory(req.body, req.file);
            res.status(201).json({
                success: true,
                message: 'Tạo danh mục thành công',
                data: result
            });
        } catch (error) {
            console.error('[CategoryController:createCategory]', error);
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // Lấy tất cả danh mục
    async getAllCategories(req, res) {
        try {
            const categories = await CategoryService.getAllCategories();
            res.status(200).json({
                success: true,
                data: categories
            });
        } catch (error) {
            console.error('[CategoryController:getAllCategories]', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // Lấy danh mục theo ID
    async getCategoryById(req, res) {
        try {
            const category = await CategoryService.getCategoryById(req.params.id);
            res.status(200).json({
                success: true,
                data: category
            });
        } catch (error) {
            console.error('[CategoryController:getCategoryById]', error);
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    // Cập nhật danh mục
    async updateCategory(req, res) {
        try {
            const category = await CategoryService.updateCategory(req.params.id, req.body, req.file);
            res.status(200).json({
                success: true,
                message: 'Cập nhật danh mục thành công',
                data: category
            });
        } catch (error) {
            console.error('[CategoryController:updateCategory]', error);
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // Xóa danh mục
    async deleteCategory(req, res) {
        try {
            const result = await CategoryService.deleteCategory(req.params.id);
            res.status(200).json({
                success: true,
                message: result.message
            });
        } catch (error) {
            console.error('[CategoryController:deleteCategory]', error);
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // ========== QUẢN LÝ THUỘC TÍNH DANH MỤC ==========

    // Lấy danh sách thuộc tính theo danh mục
    async getAttributesByCategory(req, res) {
        try {
            const attributes = await CategoryService.getAttributesByCategory(req.params.id);
            res.status(200).json({
                success: true,
                data: attributes
            });
        } catch (error) {
            console.error('[CategoryController:getAttributesByCategory]', error);
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // Thêm thuộc tính mới cho danh mục
    async createAttributeForCategory(req, res) {
        try {
            const { attribute_name, is_variant_attribute } = req.body;
            const attribute = await CategoryService.createNewAttributeForCategory(
                req.params.id,
                attribute_name,
                is_variant_attribute
            );
            res.status(201).json({
                success: true,
                message: 'Thêm thuộc tính cho danh mục thành công',
                data: attribute
            });
        } catch (error) {
            console.error('[CategoryController:createAttributeForCategory]', error);
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // Xóa thuộc tính khỏi danh mục
    async deleteAttributeForCategory(req, res) {
        try {
            const result = await CategoryService.deleteAttributeForCategory(
                req.params.attributeId,
                req.params.id
            );
            res.status(200).json({
                success: true,
                message: result.message
            });
        } catch (error) {
            console.error('[CategoryController:deleteAttributeForCategory]', error);
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // Cập nhật isVariant cho thuộc tính
    async updateAttributeIsVariant(req, res) {
        try {
            const { is_variant_attribute } = req.body;
            const result = await CategoryService.markAttributeAsVariant(
                req.params.id,
                req.params.attributeId,
                is_variant_attribute
            );
            res.status(200).json({
                success: true,
                message: result.message
            });
        } catch (error) {
            console.error('[CategoryController:updateAttributeIsVariant]', error);
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // ========== QUẢN LÝ GIÁ TRỊ THUỘC TÍNH ==========

    // Lấy danh sách giá trị thuộc tính
    async getAttributeValuesForCategory(req, res) {
        try {
            const values = await CategoryService.getAttributeValuesForCategory(
                req.params.attributeId,
                req.params.id
            );
            res.status(200).json({
                success: true,
                data: values
            });
        } catch (error) {
            console.error('[CategoryController:getAttributeValuesForCategory]', error);
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // Thêm giá trị thuộc tính mới
    async createAttributeValueForCategory(req, res) {
        try {
            const { value_name } = req.body;
            const value = await CategoryService.createNewAttributeValueForCategory(
                req.params.id,
                req.params.attributeId,
                value_name
            );
            res.status(201).json({
                success: true,
                message: 'Thêm giá trị thuộc tính thành công',
                data: value
            });
        } catch (error) {
            console.error('[CategoryController:createAttributeValueForCategory]', error);
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // Xóa giá trị thuộc tính
    async deleteAttributeValueForCategory(req, res) {
        try {
            const result = await CategoryService.deleteAttributeValueForCategory(
                req.params.id,
                req.params.attributeId,
                req.params.valueId
            );
            res.status(200).json({
                success: true,
                message: result.message
            });
        } catch (error) {
            console.error('[CategoryController:deleteAttributeValueForCategory]', error);
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

}

export default new CategoryController();
