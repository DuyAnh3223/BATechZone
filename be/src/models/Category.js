import { db } from '../libs/db.js';

class Category {
  // Create a new category
  async create(categoryData) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      const [result] = await conn.query(
        `INSERT INTO categories (
          category_name,
          slug,
          description,
          parent_category_id,
          image_url,
          is_active,
          display_order
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          categoryData.categoryName,
          categoryData.slug || null,
          categoryData.description || null,
          categoryData.parentId || null,
          categoryData.imageUrl || null,
          categoryData.isActive !== undefined ? categoryData.isActive : true,
          categoryData.displayOrder || 0,
        ]
      );

      await conn.commit();
      return result.insertId;
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      await conn.release();
    }
  }

  // Delete category
  // Soft delete category using is_active
async delete(categoryId) {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // Check if category has active children
    const [children] = await conn.query(
      'SELECT category_id FROM categories WHERE parent_category_id = ? AND is_active = 1',
      [categoryId]
    );

    if (children.length > 0) {
      throw new Error('Cannot delete category with active children');
    }

    // Check if category has active products
    const [products] = await conn.query(
      'SELECT product_id FROM products WHERE category_id = ? AND is_active = 1',
      [categoryId]
    );

    if (products.length > 0) {
      throw new Error('Cannot delete category with active products');
    }

    // Soft delete: set is_active = 0
    const [result] = await conn.query(
      'UPDATE categories SET is_active = 0 WHERE category_id = ?',
      [categoryId]
    );

    await conn.commit();
    return result.affectedRows > 0;
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    await conn.release();
  }
}


  // List categories with filtering and pagination
  async list(params = {}) {
    const {
      page = 1,
      limit = 10,
      parentId,
      search,
      isActive,
      sortBy = 'display_order',
      sortOrder = 'ASC'
    } = params;

    let conditions = ['1=1'];
    let values = [];

    if (parentId !== undefined) {
      conditions.push('c.parent_id IS ?');
      values.push(parentId === null ? null : parentId);
    }

    if (search) {
      conditions.push('(c.category_name LIKE ? OR c.description LIKE ?)');
      values.push(`%${search}%`, `%${search}%`);
    }

    if (isActive !== undefined) {
      conditions.push('c.is_active = ?');
      values.push(isActive);
    }

    const offset = (page - 1) * limit;
    values.push(limit, offset);

    const [categories] = await db.query(
      `SELECT 
        c.*,
        p.category_name as parent_name,
        (SELECT CONCAT(
        '[',
        GROUP_CONCAT(
          JSON_OBJECT(
            'categoryId', child.category_id,
              'categoryName', child.category_name,
              'slug', child.slug,
              'imageUrl', child.image_url,
              'isActive', child.is_active
          )
        ), ']') 
          FROM categories child
          WHERE child.parent_category_id = c.category_id
        ) as children,
        (
          SELECT COUNT(*)
          FROM products prod
          WHERE prod.category_id = c.category_id
        ) as product_count
      FROM categories c
      LEFT JOIN categories p ON c.parent_category_id = p.category_id
      WHERE ${conditions.join(' AND ')}
      GROUP BY c.category_id
      ORDER BY c.${sortBy} ${sortOrder}
      LIMIT ? OFFSET ?`,
      values
    );

    const [count] = await db.query(
      `SELECT COUNT(*) as total
      FROM categories c
      WHERE ${conditions.join(' AND ')}`,
      values.slice(0, -2)
    );

    return {
      data: categories,
      pagination: {
        total: count[0].total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count[0].total / limit)
      }
    };
  }

  // Get category by ID
  async getById(categoryId) {
    const [rows] = await db.query(
      `SELECT 
        c.*,
        p.category_name as parent_name,
        (
          SELECT COUNT(*)
          FROM products prod
          WHERE prod.category_id = c.category_id
        ) as product_count
      FROM categories c
      LEFT JOIN categories p ON c.parent_category_id = p.category_id
      WHERE c.category_id = ?
      LIMIT 1`,
      [categoryId]
    );
    return rows[0];
  }

  // Get category tree (for navigation)
  async getTree() {
    const [categories] = await db.query(
      `WITH RECURSIVE CategoryTree AS (
        SELECT 
          category_id,
          category_name,
          parent_id,
          slug,
          image_url,
          display_order,
          is_active,
          0 as level
        FROM categories
        WHERE parent_id IS NULL
        
        UNION ALL
        
        SELECT 
          c.category_id,
          c.category_name,
          c.parent_id,
          c.slug,
          c.image_url,
          c.display_order,
          c.is_active,
          ct.level + 1
        FROM categories c
        INNER JOIN CategoryTree ct ON c.parent_id = ct.category_id
      )
      SELECT * FROM CategoryTree
      ORDER BY level, display_order, category_name`
    );

    // Convert flat structure to tree
    const buildTree = (items, parentId = null, level = 0) => {
      return items
        .filter(item => item.parent_id === parentId && item.level === level)
        .map(item => ({
          ...item,
          children: buildTree(items, item.category_id, level + 1)
        }));
    };

    return buildTree(categories);
  }

  // Get categories by parent ID
  async getByParentId(parentId = null) {
    const [categories] = await db.query(
      `SELECT 
        c.*,
        (
          SELECT COUNT(*)
          FROM products p
          WHERE p.category_id = c.category_id
        ) as product_count
      FROM categories c
      WHERE c.parent_id IS ?
      ORDER BY c.display_order ASC, c.category_name ASC`,
      [parentId]
    );
    return categories;
  }
}

export default new Category();
