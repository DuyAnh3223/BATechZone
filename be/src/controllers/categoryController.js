import Category from '../models/Category.js';

export const createCategory = async (req, res) => {
  try {
    // Validate unique slug
    if (!req.body.slug) {
      req.body.slug = req.body.categoryName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }

    const categoryId = await Category.create(req.body);
    const category = await Category.getById(categoryId);
    res.status(201).json(category);
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

export const getCategory = async (req, res) => {
  try {
    const category = await Category.getById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    console.error('Error getting category:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateCategory = async (req, res) => {
  try {
    // If updating name, update slug if not provided
    if (req.body.categoryName && !req.body.slug) {
      req.body.slug = req.body.categoryName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }

    const updated = await Category.update(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ message: 'Category not found' });
    }
    const category = await Category.getById(req.params.id);
    res.json(category);
  } catch (error) {
    console.error('Error updating category:', error);
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
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    if (error.message === 'Cannot delete category with children') {
      return res.status(400).json({ 
        message: 'Cannot delete category that has sub-categories' 
      });
    }
    if (error.message === 'Cannot delete category with associated products') {
      return res.status(400).json({ 
        message: 'Cannot delete category that has products' 
      });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const listCategories = async (req, res) => {
  try {
    const result = await Category.list(req.query);
    res.json(result);
  } catch (error) {
    console.error('Error listing categories:', error);
    res.status(500).json({ message: 'Internal server error' });
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
