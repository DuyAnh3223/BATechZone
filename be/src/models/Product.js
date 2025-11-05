import { db } from '../libs/db.js';

class Product {
  // Tạo sản phẩm mới
  async create(data) {
    const { category_id, product_name, slug, description, base_price, is_active, is_featured } = data;
    const [result] = await db.query(
      `INSERT INTO products (category_id, product_name, slug, description, base_price, is_active, is_featured)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [category_id, product_name, slug, description, base_price, is_active ?? 1, is_featured ?? 0]
    );
    return result.insertId;
  }

  // Lấy tất cả sản phẩm (có phân trang, lọc)
  async list({ page = 1, limit = 10, search, category_id, minPrice, maxPrice, sortBy = 'created_at', sortOrder = 'DESC' }) {
    const offset = (page - 1) * limit;
    const conditions = ['is_active = 1'];
    const values = [];

    if (search) {
      conditions.push('product_name LIKE ?');
      values.push(`%${search}%`);
    }

    if (category_id) {
      conditions.push('category_id = ?');
      values.push(category_id);
    }

    if (minPrice) {
      conditions.push('base_price >= ?');
      values.push(minPrice);
    }

    if (maxPrice) {
      conditions.push('base_price <= ?');
      values.push(maxPrice);
    }

    values.push(limit, offset);

    const [rows] = await db.query(
      `SELECT * FROM products 
       WHERE ${conditions.join(' AND ')} 
       ORDER BY ${sortBy} ${sortOrder}
       LIMIT ? OFFSET ?`,
      values
    );

    const [[{ total }]] = await db.query(
      `SELECT COUNT(*) AS total FROM products WHERE ${conditions.join(' AND ')}`,
      values.slice(0, -2)
    );

    return {
      data: rows,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  // Lấy 1 sản phẩm theo ID
  async getById(id) {
    const [rows] = await db.query('SELECT * FROM products WHERE product_id = ? AND is_active = 1', [id]);
    return rows[0] || null;
  }

  // Cập nhật sản phẩm
  async update(id, data) {
    const { category_id, product_name, slug, description, base_price, is_featured, is_active } = data;
    await db.query(
      `UPDATE products 
       SET category_id = ?, product_name = ?, slug = ?, description = ?, 
           base_price = ?, is_featured = ?, is_active = ?, updated_at = NOW()
       WHERE product_id = ?`,
      [category_id, product_name, slug, description, base_price, is_featured ?? 0, is_active ?? 1, id]
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
