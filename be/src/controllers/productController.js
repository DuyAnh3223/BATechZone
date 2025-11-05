import Product from '../models/Product.js';


  // Get all products with filtering and pagination
  export const listProducts = async (req, res) => {
    try {
      const filters = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
        categoryId: req.query.categoryId,
        brand: req.query.brand,
        search: req.query.search,
        minPrice: req.query.minPrice,
        maxPrice: req.query.maxPrice,
        sortBy: req.query.sortBy,
        sortOrder: req.query.sortOrder?.toUpperCase()
      };

      const result = await Product.list(filters);
      res.json({
        success: true,
        ...result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving products',
        error: error.message
      });
    }
  };

  // Get single product by ID
  export const getProduct = async (req, res) => {
    try {
      const product = await Product.getById(req.params.id);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }
      res.json({
        success: true,
        data: product
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving product',
        error: error.message
      });
    }
  };

  // Create new product
  export const createProduct = async (req, res) => {
    try {
      const productData = {
        productName: req.body.productName,
        description: req.body.description,
        brand: req.body.brand,
        warrantyInfo: req.body.warrantyInfo,
        warrantyDuration: req.body.warrantyDuration,
        categoryId: req.body.categoryId,
        isActive: req.body.isActive,
        variants: req.body.variants
      };

      // Validate required fields
      if (!productData.productName || !productData.categoryId) {
        return res.status(400).json({
          success: false,
          message: 'Product name and category are required'
        });
      }

      const productId = await Product.create(productData);
      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: { productId }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error creating product',
        error: error.message
      });
    }
  };

  // Update product
  export const updateProduct = async (req, res) => {
    try {
      const productId = req.params.id;
      const productData = {
        productName: req.body.productName,
        description: req.body.description,
        brand: req.body.brand,
        warrantyInfo: req.body.warrantyInfo,
        warrantyDuration: req.body.warrantyDuration,
        categoryId: req.body.categoryId,
        isActive: req.body.isActive,
        variants: req.body.variants
      };

      const product = await Product.getById(productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      await Product.update(productId, productData);
      res.json({
        success: true,
        message: 'Product updated successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating product',
        error: error.message
      });
    }
  };

  // Delete product
  export const deleteProduct = async (req, res) => {
    try {
      const product = await Product.getById(req.params.id);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      await Product.delete(req.params.id);
      res.json({
        success: true,
        message: 'Product deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting product',
        error: error.message
      });
    }
  };

  // Search products
  export const searchProducts = async (req, res) => {
    try {
      const searchParams = {
        query: req.query.q,
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
        categoryId: req.query.categoryId,
        brand: req.query.brand,
        minPrice: req.query.minPrice,
        maxPrice: req.query.maxPrice,
        sortBy: req.query.sortBy || 'relevance'
      };

      if (!searchParams.query) {
        return res.status(400).json({
          success: false,
          message: 'Search query is required'
        });
      }

      const result = await Product.search(searchParams.query, searchParams);
      res.json({
        success: true,
        ...result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error searching products',
        error: error.message
      });
    }
  };

  // Get products by category
  export const getProductsByCategory = async (req, res) => {
    try {
      const { categoryId } = req.params;
      const includeSubcategories = req.query.includeSubcategories === 'true';

      const products = await Product.getByCategory(categoryId, includeSubcategories);
      res.json({
        success: true,
        data: products
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving products by category',
        error: error.message
      });
    }
  }



