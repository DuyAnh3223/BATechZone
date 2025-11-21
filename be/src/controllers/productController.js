import Product from '../models/Product.js';
import Variant from '../models/Variant.js';
import { db } from '../libs/db.js';

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
    
    // Get applicable attributes from category
    if (product.category_id) {
      const [attributes] = await db.query(
        `SELECT a.attribute_id, a.attribute_name
        FROM attributes a
        INNER JOIN attribute_categories ac ON a.attribute_id = ac.attribute_id
        WHERE ac.category_id = ?`,
        [product.category_id]
      );
      product.applicable_attributes = attributes;
    }
    
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving product', error: error.message });
  }
};

// Tạo mới sản phẩm
export const createProduct = async (req, res) => {
  try {
    const { 
      category_id, 
      product_name, 
      slug, 
      description, 
      base_price, 
      is_active, 
      is_featured, 
      defaultVariant, 
      additionalVariants,
      variant_attributes
    } = req.body;

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

    // Validate default variant (required)
    if (!defaultVariant) {
      return res.status(400).json({
        success: false,
        message: 'Thông tin biến thể mặc định là bắt buộc'
      });
    }

    if (!defaultVariant.price || isNaN(defaultVariant.price) || parseFloat(defaultVariant.price) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Giá sản phẩm phải là số dương'
      });
    }

    if (defaultVariant.stock !== undefined && parseInt(defaultVariant.stock) < 0) {
      return res.status(400).json({
        success: false,
        message: 'Số lượng tồn kho không được âm'
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
      base_price: base_price ? parseFloat(base_price) : null, // Optional reference price
      is_active: is_active !== undefined ? (is_active ? 1 : 0) : 1,
      is_featured: is_featured !== undefined ? (is_featured ? 1 : 0) : 0
    });

    // Create default variant (always required)
    try {
      const defaultVariantId = await Variant.create({
        productId: productId,
        sku: `${finalSlug}-default`,
        variantName: product_name.trim(),
        price: parseFloat(defaultVariant.price),
        stockQuantity: parseInt(defaultVariant.stock || 0),
        isActive: 1,
        isDefault: 1,
        attributes: [] // Default variant has no attributes
      });

      // Handle default variant images if provided
      if (defaultVariant.images && Array.isArray(defaultVariant.images) && defaultVariant.images.length > 0) {
        // TODO: Upload images to variant_images table
        // For now, just log them
        console.log('Default variant images:', defaultVariant.images.length, 'files');
      }
    } catch (variantError) {
      console.error('Error creating default variant:', variantError);
      // Rollback product if default variant creation fails
      await Product.delete(productId);
      throw new Error('Không thể tạo biến thể mặc định cho sản phẩm');
    }

    // Create additional variants if provided
    if (additionalVariants && Array.isArray(additionalVariants) && additionalVariants.length > 0) {
      for (let i = 0; i < additionalVariants.length; i++) {
        const variant = additionalVariants[i];
        const variantStock = parseInt(variant.stock || 0);
        
        // Validate stock for each variant
        if (variantStock < 0) {
          console.error(`Invalid stock for variant ${i + 1}: ${variantStock}`);
          continue; // Skip invalid variants
        }

        try {
          // Extract attribute value IDs from variant.attribute_values
          const attributeValueIds = variant.attribute_values?.map(av => {
            // Handle both {attribute_value_id: X} and {attributeValueId: X} formats
            return av.attribute_value_id || av.attributeValueId;
          }).filter(id => id != null) || [];

          const variantId = await Variant.create({
            productId: productId,
            sku: variant.sku || `${finalSlug}-${i + 1}`,
            variantName: variant.sku || null,
            price: parseFloat(variant.price || defaultVariant.price),
            stockQuantity: variantStock,
            isActive: 1,
            isDefault: 0,
            attributes: attributeValueIds
          });

          // Handle variant images if provided
          if (variant.images && Array.isArray(variant.images) && variant.images.length > 0) {
            // TODO: Upload images to variant_images table
            console.log(`Variant ${i + 1} images:`, variant.images.length, 'files');
          }
        } catch (variantError) {
          console.error(`Error creating variant ${i + 1}:`, variantError);
          // Continue with other variants even if one fails
        }
      }
    }

    // Lấy lại product với category_name
    const product = await Product.getById(productId);

    // **FIX**: Load variants ngay sau khi tạo product để trả về đầy đủ variants
    const variants = await Variant.getByProductId(productId);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: {
        ...product,
        variants: variants || [] // Include variants in response
      }
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
