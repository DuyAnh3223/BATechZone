import Category from '../models/Category.js';

export const createCategory = async (req, res) => {
  try {
    // Map request body to match model expectations
    const categoryData = {
      categoryName: req.body.category_name,
      slug: req.body.slug,
      description: req.body.description,
      parentId: req.body.parent_category_id,
      imageUrl: req.body.image_url,
      isActive: req.body.is_active !== undefined ? req.body.is_active : true,
      displayOrder: req.body.display_order || 0
    };

    // Validate unique slug
    if (!categoryData.slug && categoryData.categoryName) {
      categoryData.slug = categoryData.categoryName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }

    const categoryId = await Category.create(categoryData);
    const category = await Category.getById(categoryId);
    res.status(201).json({ data: category });
  } catch (error) {
    console.error('Error creating category:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ 
        message: 'A category with this name or slug already exists' 
      });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const deleted = await Category.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json({ 
      success: true,
      message: 'Category deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    console.error('Error stack:', error.stack);
    if (error.message === 'Cannot delete category with active children') {
      return res.status(400).json({ 
        success: false,
        message: 'Không thể xóa danh mục có danh mục con đang hoạt động' 
      });
    }
    if (error.message === 'Cannot delete category with active products') {
      return res.status(400).json({ 
        success: false,
        message: 'Không thể xóa danh mục có sản phẩm đang hoạt động' 
      });
    }
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error.message 
    });
  }
};

export const listCategories = async (req, res) => {
  try {
    // Map query parameters to match model expectations
    const params = {
      page: req.query.page ? parseInt(req.query.page) : 1,
      limit: req.query.pageSize ? parseInt(req.query.pageSize) : (req.query.limit ? parseInt(req.query.limit) : 10),
      search: req.query.search && req.query.search.trim() !== '' ? req.query.search.trim() : undefined,
      isActive: req.query.is_active !== undefined && req.query.is_active !== '' 
        ? (req.query.is_active === 'true' || req.query.is_active === true) 
        : undefined,
      parentId: req.query.parentId !== undefined ? req.query.parentId : undefined,
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder
    };
    
    const result = await Category.list(params);
    res.json(result);
  } catch (error) {
    console.error('Error listing categories:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const getCategoryTree = async (req, res) => {
  try {
    const tree = await Category.getTree();
    res.json(tree);
  } catch (error) {
    console.error('Error getting category tree:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getSubcategories = async (req, res) => {
  try {
    const categories = await Category.getByParentId(req.params.parentId || null);
    res.json(categories);
  } catch (error) {
    console.error('Error getting subcategories:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getCategory = async (req, res) => {
  try {
    const category = await Category.getById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json({ data: category });
  } catch (error) {
    console.error('Error getting category:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateCategory = async (req, res) => {
  try {
    // Map request body to match model expectations
    const categoryData = {
      categoryName: req.body.category_name,
      slug: req.body.slug,
      description: req.body.description,
      parentId: req.body.parent_category_id,
      imageUrl: req.body.image_url,
      icon: req.body.icon,
      isActive: req.body.is_active,
      displayOrder: req.body.display_order
    };

    const updated = await Category.update(req.params.id, categoryData);
    if (!updated) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const category = await Category.getById(req.params.id);
    res.json({ 
      success: true,
      data: category 
    });
  } catch (error) {
    console.error('Error updating category:', error);
    console.error('Error stack:', error.stack);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ 
        success: false,
        message: 'Danh mục với tên hoặc slug này đã tồn tại' 
      });
    }
    if (error.message === 'Category cannot be its own parent') {
      return res.status(400).json({ 
        success: false,
        message: 'Danh mục không thể là parent của chính nó' 
      });
    }
    if (error.message === 'Parent category not found') {
      return res.status(400).json({ 
        success: false,
        message: 'Danh mục cha không tồn tại' 
      });
    }
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error.message 
    });
  }
};

export const getSimpleCategories = async (req, res) => {
  try {
    const categories = await Category.getSimple();
    res.json({ data: categories || [] });
  } catch (error) {
    console.error('Error getting simple categories:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};