import { db } from '../libs/db.js';

class Product {
  // Tạo sản phẩm mới
  async create(data) {
    const { category_id, product_name, slug, description, base_price, is_active, is_featured } = data;
    const [result] = await db.query(
      `INSERT INTO products (category_id, product_name, slug, description, base_price, is_active, is_featured, img_path)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        category_id, 
        product_name, 
        slug || null, 
        description || null,
        base_price || 0,
        is_active ?? 1, 
        is_featured ?? 0,
        '' // img_path - not used anymore, kept for compatibility
      ]
    );
    return result.insertId;
  }

  // Lấy tất cả sản phẩm (có phân trang, lọc)
  async list({ page = 1, limit = 10, search, category_id, minPrice, maxPrice, sortBy = 'created_at', sortOrder = 'DESC', is_active, is_featured } = {}) {
    const offset = (page - 1) * limit;
    const conditions = [];
    const values = [];

    // Admin có thể xem cả products không active
    if (is_active !== undefined) {
      conditions.push('p.is_active = ?');
      values.push(is_active ? 1 : 0);
    }

    // Filter by featured
    if (is_featured !== undefined) {
      conditions.push('p.is_featured = ?');
      values.push(is_featured ? 1 : 0);
    }

    if (search) {
      conditions.push('(p.product_name LIKE ? OR p.slug LIKE ?)');
      values.push(`%${search}%`, `%${search}%`);
    }

    if (category_id) {
      conditions.push('p.category_id = ?');
      values.push(category_id);
    }

    // Note: Price filtering removed as prices are now stored at variant level
    // If needed, implement via JOIN with product_variants table

    // Sanitize sortBy to prevent SQL injection
    const allowedSortColumns = ['product_id', 'product_name', 'created_at', 'view_count', 'rating_average'];
    const sanitizedSortBy = allowedSortColumns.includes(sortBy) ? sortBy : 'created_at';
    const sanitizedSortOrder = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    values.push(limit, offset);

    const [rows] = await db.query(
      `SELECT 
        p.*,
        c.category_name,
        (SELECT MIN(pv.price) FROM product_variants pv WHERE pv.product_id = p.product_id AND pv.is_active = 1) AS min_variant_price,
        (SELECT MAX(pv.price) FROM product_variants pv WHERE pv.product_id = p.product_id AND pv.is_active = 1) AS max_variant_price,
        (SELECT pv.price FROM product_variants pv WHERE pv.product_id = p.product_id AND pv.is_default = 1 LIMIT 1) AS default_variant_price
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.category_id
      ${whereClause}
      ORDER BY p.${sanitizedSortBy} ${sanitizedSortOrder}
      LIMIT ? OFFSET ?`,
      values
    );

    const countValues = values.slice(0, -2);
    const [count] = await db.query(
      `SELECT COUNT(*) AS total 
      FROM products p
      ${whereClause}`,
      countValues
    );

    return {
      data: rows || [],
      pagination: {
        total: count[0]?.total || 0,
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
        totalPages: Math.ceil((count[0]?.total || 0) / limit)
      }
    };
  }

  // Lấy 1 sản phẩm theo ID
  async getById(id) {
    const [rows] = await db.query(
      `SELECT 
        p.*,
        c.category_name,
        (SELECT MIN(pv.price) FROM product_variants pv WHERE pv.product_id = p.product_id AND pv.is_active = 1) AS min_variant_price,
        (SELECT MAX(pv.price) FROM product_variants pv WHERE pv.product_id = p.product_id AND pv.is_active = 1) AS max_variant_price,
        (SELECT pv.price FROM product_variants pv WHERE pv.product_id = p.product_id AND pv.is_default = 1 LIMIT 1) AS default_variant_price
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.category_id
      WHERE p.product_id = ?`,
      [id]
    );
    return rows[0] || null;
  }

  // Cập nhật sản phẩm
  async update(id, data) {
    const { category_id, product_name, slug, description, is_featured, is_active } = data;
    await db.query(
      `UPDATE products 
       SET category_id = ?, product_name = ?, slug = ?, description = ?, 
           is_featured = ?, is_active = ?, updated_at = NOW()
       WHERE product_id = ?`,
      [
        category_id, 
        product_name, 
        slug || null, 
        description || null, 
        is_featured ?? 0, 
        is_active ?? 1, 
        id
      ]
    );
    return true;
  }

  // Xóa mềm (soft delete)
  async delete(id) {
    await db.query(`UPDATE products SET is_active = 0, updated_at = NOW() WHERE product_id = ?`, [id]);
    return true;
  }

  // Tăng view_count khi người dùng xem sản phẩm
  async increaseViewCount(id) {
    await db.query(
      `UPDATE products 
       SET view_count = view_count + 1, updated_at = NOW() 
       WHERE product_id = ? AND is_active = 1`,
      [id]
    );
    return true;
  }
}

export default new Product();
