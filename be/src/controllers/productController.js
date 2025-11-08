import Product from '../models/Product.js';

// Lấy danh sách sản phẩm
export const listProducts = async (req, res) => {
  try {
    const filters = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || (parseInt(req.query.pageSize) || 10),
      search: req.query.search,
      category_id: req.query.category_id,
      minPrice: req.query.minPrice,
      maxPrice: req.query.maxPrice,
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder?.toUpperCase() || 'DESC',
      is_active: req.query.is_active !== undefined ? (req.query.is_active === 'true' || req.query.is_active === true) : undefined,
      is_featured: req.query.is_featured !== undefined ? (req.query.is_featured === 'true' || req.query.is_featured === true) : undefined
    };

    const result = await Product.list(filters);
    res.json({ success: true, ...result });
  } catch (error) {
    console.error('Error listing products:', error);
    console.error('Error stack:', error.stack);
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
    const { category_id, product_name, slug, description, brand, model, base_price, is_active, is_featured } = req.body;

    // Validate required fields
    if (!product_name || !product_name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Tên sản phẩm là bắt buộc'
      });
    }

    if (!category_id) {
      return res.status(400).json({
        success: false,
        message: 'Danh mục là bắt buộc'
      });
    }

    if (!base_price || isNaN(base_price) || parseFloat(base_price) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Giá sản phẩm phải là số dương'
      });
    }

    // Auto-generate slug if not provided
    let finalSlug = slug?.trim();
    if (!finalSlug) {
      finalSlug = product_name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }

    const productId = await Product.create({
      category_id: parseInt(category_id),
      product_name: product_name.trim(),
      slug: finalSlug,
      description: description?.trim() || null,
      brand: brand?.trim() || null,
      model: model?.trim() || null,
      base_price: parseFloat(base_price),
      is_active: is_active !== undefined ? (is_active ? 1 : 0) : 1,
      is_featured: is_featured !== undefined ? (is_featured ? 1 : 0) : 0
    });

    // Lấy lại product với category_name
    const product = await Product.getById(productId);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    console.error('Error creating product:', error);
    console.error('Error stack:', error.stack);
    
    // Handle duplicate entry
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        message: 'Sản phẩm với tên hoặc slug này đã tồn tại'
      });
    }

    // Handle foreign key constraint
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({
        success: false,
        message: 'Danh mục không tồn tại'
      });
    }

    res.status(500).json({ 
      success: false, 
      message: 'Có lỗi xảy ra khi tạo sản phẩm',
      error: error.message 
    });
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
    
    // Lấy lại product với category_name sau khi cập nhật
    const updatedProduct = await Product.getById(req.params.id);
    
    res.json({ 
      success: true, 
      message: 'Product updated successfully',
      data: updatedProduct
    });
  } catch (error) {
    console.error('Error updating product:', error);
    console.error('Error stack:', error.stack);
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
