import ProductService from '../services/product.service.js';
import ProductDAO from '../daos/product.dao.js';
import VariantDAO from '../daos/variant.dao.js';

/**
 * Product Controller - Sử dụng ProductService
 * Xử lý các request liên quan đến sản phẩm
 */
class ProductController {
    // Các phương thức xử lý request sẽ được định nghĩa ở đây

// ============ BASIC CRUD với Service Layer ============

/**
 * GET /products
 * Lấy danh sách sản phẩm với phân trang và lọc
 */
async getAllProducts(req, res) {
    try {
        const filter = {
            category_id: req.query.category_id,
            is_active: req.query.is_active !== undefined ? parseInt(req.query.is_active) : undefined,
            keyword: req.query.keyword || req.query.search,
            min_price: req.query.min_price ? parseFloat(req.query.min_price) : undefined,
            max_price: req.query.max_price ? parseFloat(req.query.max_price) : undefined,
            is_featured: req.query.is_featured !== undefined ? parseInt(req.query.is_featured) : undefined
        };

        // Remove undefined values
        Object.keys(filter).forEach(key => {
            if (filter[key] === undefined) {
                delete filter[key];
            }
        });

        const products = await ProductService.getAllProducts(filter);

        res.json({
            success: true,
            data: products,
            total: products.length
        });
    } catch (error) {
        console.error('[ProductController:getAllProducts]', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách sản phẩm',
            error: error.message
        });
    }
};

/**
 * GET /products/:id
 * Lấy thông tin chi tiết sản phẩm theo ID
 */
async getProductById(req, res) {
    try {
        const productId = parseInt(req.params.id);
        
        if (isNaN(productId)) {
            return res.status(400).json({
                success: false,
                message: 'ID sản phẩm không hợp lệ'
            });
        }

        const product = await ProductService.getProductById(productId);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy sản phẩm'
            });
        }

        res.json({
            success: true,
            data: product
        });
    } catch (error) {
        console.error('[ProductController:getProductById]', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thông tin sản phẩm',
            error: error.message
        });
    }
};

/**
 * POST /products/service
 * Tạo sản phẩm mới sử dụng ProductService
 */
async createProduct(req, res) {
    try {
        console.log('📝 Create product request body:', JSON.stringify(req.body, null, 2));
        console.log('📁 Upload file:', req.file);
        console.log('📁 Upload files:', req.files);

        // Helper function để parse JSON nếu là string, giữ nguyên nếu đã là object/array
        const parseIfString = (value) => {
            if (!value) return [];
            if (typeof value === 'string') {
                try {
                    return JSON.parse(value);
                } catch (e) {
                    return [];
                }
            }
            return value;
        };

        const productData = {
            product_name: req.body.product_name,
            category_id: parseInt(req.body.category_id),
            description: req.body.description,
            base_price: req.body.base_price ? parseFloat(req.body.base_price) : null,
            is_active: req.body.is_active !== undefined ? parseInt(req.body.is_active) : 1,
            is_featured: req.body.is_featured !== undefined ? parseInt(req.body.is_featured) : 0,
            warranty_period: req.body.warranty_period ? parseInt(req.body.warranty_period) : null,
            stock_quantity: req.body.stock_quantity ? parseInt(req.body.stock_quantity) : 0,
            // Attributes (non-variant) - Parse nếu là string (form-data), giữ nguyên nếu là array (JSON)
            attributes: parseIfString(req.body.attributes),
            // Variant attributes combinations - Parse nếu là string (form-data), giữ nguyên nếu là array (JSON)
            variant_attributes: parseIfString(req.body.variant_attributes)
        };

        // Phân loại ảnh theo variant
        // req.files có dạng: { 'image': [file], 'default': [files], 'variant_0': [files], 'variant_1': [files], ... }
        const variantImages = req.files || {};
        
        // Lấy ảnh chính của product (nếu có)
        const productImage = req.files?.image?.[0] || null;

        const createdProduct = await ProductService.createProduct(productData, productImage, variantImages);

        res.status(201).json({
            success: true,
            message: 'Tạo sản phẩm thành công',
            data: createdProduct
        });
    } catch (error) {
        console.error('[ProductController:createProduct]', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Lỗi khi tạo sản phẩm',
            error: error.message
        });
    }
};

/**
 * PUT /products/:id/service
 * Cập nhật thông tin sản phẩm
 */
async updateProduct(req, res) {
    try {
        const productId = parseInt(req.params.id);
        
        if (isNaN(productId)) {
            return res.status(400).json({
                success: false,
                message: 'ID sản phẩm không hợp lệ'
            });
        }

        const updateData = {
            product_name: req.body.product_name,
            description: req.body.description,
            base_price: req.body.base_price ? parseFloat(req.body.base_price) : undefined,
            is_active: req.body.is_active !== undefined ? parseInt(req.body.is_active) : undefined,
            is_featured: req.body.is_featured !== undefined ? parseInt(req.body.is_featured) : undefined,
            img_path: req.file ? req.file.path : undefined
        };

        // Remove undefined values
        Object.keys(updateData).forEach(key => {
            if (updateData[key] === undefined) {
                delete updateData[key];
            }
        });

        const updatedProduct = await ProductService.updateProduct(productId, updateData);

        if (!updatedProduct) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy sản phẩm hoặc cập nhật thất bại'
            });
        }

        res.json({
            success: true,
            message: 'Cập nhật sản phẩm thành công',
            data: updatedProduct
        });
    } catch (error) {
        console.error('[ProductController:updateProduct]', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật sản phẩm',
            error: error.message
        });
    }
};

/**
 * DELETE /products/:id/service
 * Xóa mềm sản phẩm (set is_active = 0)
 */
async deleteProduct(req, res) {
    try {
        const productId = parseInt(req.params.id);
        
        if (isNaN(productId)) {
            return res.status(400).json({
                success: false,
                message: 'ID sản phẩm không hợp lệ'
            });
        }

        const deleted = await ProductService.deleteProduct(productId);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy sản phẩm hoặc xóa thất bại'
            });
        }

        res.json({
            success: true,
            message: 'Xóa sản phẩm thành công'
        });
    } catch (error) {
        console.error('[ProductController:deleteProduct]', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa sản phẩm',
            error: error.message
        });
    }
};

// ============ VARIANT MANAGEMENT ============

/**
 * GET /products/:id/variants
 * Lấy danh sách variants của sản phẩm
 */
async getProductVariants(req, res) {
    try {
        const productId = parseInt(req.params.id);
        
        if (isNaN(productId)) {
            return res.status(400).json({
                success: false,
                message: 'ID sản phẩm không hợp lệ'
            });
        }

        const product = await ProductDAO.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy sản phẩm'
            });
        }

        const variants = await VariantDAO.getVariantsByProductId(productId);

        res.json({
            success: true,
            data: variants,
            total: variants.length
        });
    } catch (error) {
        console.error('[ProductController:getProductVariants]', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách variants',
            error: error.message
        });
    }
};

// ============ ADDITIONAL FEATURES ============

/**
 * PUT /products/:id/view
 * Tăng view count cho sản phẩm
 */
async increaseProductView(req, res) {
    try {
        const productId = parseInt(req.params.id);
        
        if (isNaN(productId)) {
            return res.status(400).json({
                success: false,
                message: 'ID sản phẩm không hợp lệ'
            });
        }

        const result = await ProductService.increaseProductView(productId);

        if (!result) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy sản phẩm'
            });
        }

        res.json({
            success: true,
            message: 'Tăng lượt xem thành công'
        });
    } catch (error) {
        console.error('[ProductController:increaseProductView]', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi tăng lượt xem',
            error: error.message
        });
    }
};

/**
 * GET /products/filters/options
 * Lấy filter options cho category (brands, price range, attributes)
 */
async getFilterOptions(req, res) {
    try {
        const { category_id } = req.query;
        
        if (!category_id) {
            return res.status(400).json({
                success: false,
                message: 'category_id là bắt buộc'
            });
        }

        const filterOptions = await ProductService.getFilterOptions(category_id);

        res.json({
            success: true,
            data: filterOptions
        });
    } catch (error) {
        console.error('[ProductController:getFilterOptions]', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy filter options',
            error: error.message
        });
    }
};

/**
 * GET /products/build-pc
 * Lấy products cho Build PC (bao gồm variants và attributes)
 */
async getProductsForBuildPC(req, res) {
    try {
        const { category_id } = req.query;
        
        if (!category_id) {
            return res.status(400).json({
                success: false,
                message: 'category_id là bắt buộc'
            });
        }

        const products = await ProductService.getProductsForBuildPC(category_id);

        res.json({
            success: true,
            data: products,
            total: products.length
        });
    } catch (error) {
        console.error('[ProductController:getProductsForBuildPC]', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách sản phẩm cho Build PC',
            error: error.message
        });
    }
};

/**
 * GET /products/with-attributes
 * Lấy products kèm đầy đủ attributes và values (cho filtering)
 */
async getProductsWithAttributes(req, res) {
    try {
        const filter = {
            category_id: req.query.category_id,
            is_active: req.query.is_active !== undefined ? parseInt(req.query.is_active) : undefined,
            keyword: req.query.keyword || req.query.search,
            is_featured: req.query.is_featured !== undefined ? parseInt(req.query.is_featured) : undefined
        };

        // Remove undefined values
        Object.keys(filter).forEach(key => {
            if (filter[key] === undefined) {
                delete filter[key];
            }
        });

        const products = await ProductService.getProductsWithAttributes(filter);

        res.json({
            success: true,
            data: products,
            total: products.length
        });
    } catch (error) {
        console.error('[ProductController:getProductsWithAttributes]', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách sản phẩm với attributes',
            error: error.message
        });
    }
};
}

export default new ProductController();
