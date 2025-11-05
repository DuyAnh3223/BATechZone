import Product from '../models/Product.js';

// Lấy danh sách sản phẩm
export const listProducts = async (req, res) => {
  try {
    const filters = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
      search: req.query.search,
      category_id: req.query.category_id,
      minPrice: req.query.minPrice,
      maxPrice: req.query.maxPrice,
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder?.toUpperCase() || 'DESC'
    };

    const result = await Product.list(filters);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving products', error: error.message });
  }
};

// Lấy chi tiết sản phẩm
export const getProduct = async (req, res) => {
  try {
    const product = await Product.getById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving product', error: error.message });
  }
};

// Tạo mới sản phẩm
export const createProduct = async (req, res) => {
  try {
    const { category_id, product_name, slug, description, base_price, is_active, is_featured } = req.body;

    if (!product_name || !category_id || !slug || !base_price) {
      return res.status(400).json({
        success: false,
        message: 'Fields: category_id, product_name, slug, and base_price are required'
      });
    }

    const productId = await Product.create({
      category_id,
      product_name,
      slug,
      description,
      base_price,
      is_active,
      is_featured
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: { productId }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating product', error: error.message });
  }
};

// Cập nhật sản phẩm
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.getById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await Product.update(req.params.id, req.body);
    res.json({ success: true, message: 'Product updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating product', error: error.message });
  }
};

// Xóa mềm (soft delete)
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.getById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await Product.delete(req.params.id);
    res.json({ success: true, message: 'Product deleted (soft delete)' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting product', error: error.message });
  }
};

export const increaseProductView = async (req, res) => {
  try {
    const product = await Product.getById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    await Product.increaseViewCount(req.params.id);
    res.json({
      success: true,
      message: 'Product view count increased'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error increasing product view count',
      error: error.message
    });
  }
};
