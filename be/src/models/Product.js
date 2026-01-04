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

    // Price filtering using subquery to check variant prices
    if (minPrice) {
      conditions.push('(SELECT MIN(pv.price) FROM product_variants pv WHERE pv.product_id = p.product_id AND pv.is_active = 1) >= ?');
      values.push(minPrice);
    }
    
    if (maxPrice) {
      conditions.push('(SELECT MIN(pv.price) FROM product_variants pv WHERE pv.product_id = p.product_id AND pv.is_active = 1) <= ?');
      values.push(maxPrice);
    }

    // Sanitize sortBy to prevent SQL injection
    const allowedSortColumns = ['product_id', 'product_name', 'created_at', 'view_count', 'rating_average', 'price'];
    const sanitizedSortBy = allowedSortColumns.includes(sortBy) ? sortBy : 'created_at';
    const sanitizedSortOrder = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    // If sorting by price, use min_variant_price
    const orderByClause = sanitizedSortBy === 'price' 
      ? `min_variant_price ${sanitizedSortOrder}`
      : `p.${sanitizedSortBy} ${sanitizedSortOrder}`;

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    values.push(limit, offset);

    const [rows] = await db.query(
      `SELECT 
        p.*,
        c.category_name,
        (SELECT MIN(pv.price) FROM product_variants pv WHERE pv.product_id = p.product_id AND pv.is_active = 1) AS min_variant_price,
        (SELECT MAX(pv.price) FROM product_variants pv WHERE pv.product_id = p.product_id AND pv.is_active = 1) AS max_variant_price,
        (SELECT pv.price FROM product_variants pv WHERE pv.product_id = p.product_id AND pv.is_default = 1 LIMIT 1) AS default_variant_price,
        (SELECT SUM(pv.stock_quantity) FROM product_variants pv WHERE pv.product_id = p.product_id AND pv.is_active = 1) AS total_stock
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.category_id
      ${whereClause}
      ORDER BY ${orderByClause}
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
        (SELECT pv.price FROM product_variants pv WHERE pv.product_id = p.product_id AND pv.is_default = 1 LIMIT 1) AS default_variant_price,
        (SELECT SUM(pv.stock_quantity) FROM product_variants pv WHERE pv.product_id = p.product_id AND pv.is_active = 1) AS total_stock
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

  // Get filter options for a category (brands and attributes)
  async getFilterOptions(categoryId) {
    try {
      console.log('🔍 Getting filter options for category:', categoryId);
      
      // Get price range from variants
      const [priceRange] = await db.query(
        `SELECT 
          COALESCE(MIN(v.price), 0) as minPrice,
          COALESCE(MAX(v.price), 0) as maxPrice
        FROM products p
        INNER JOIN product_variants v ON p.product_id = v.product_id
        WHERE p.category_id = ? AND p.is_active = 1 AND v.is_active = 1`,
        [categoryId]
      );
      console.log('✅ Price range:', priceRange);

      // Get brands from attributes (Hãng, Thương hiệu, Nhà sản xuất)
      const [brands] = await db.query(
        `SELECT DISTINCT av.value_name as brand
        FROM products p
        INNER JOIN product_variants v ON p.product_id = v.product_id
        INNER JOIN variant_attributes vam ON v.variant_id = vam.variant_id
        INNER JOIN attribute_values av ON vam.attribute_value_id = av.attribute_value_id
        INNER JOIN attributes a ON av.attribute_id = a.attribute_id
        WHERE p.category_id = ? 
          AND p.is_active = 1 
          AND v.is_active = 1
          AND (a.attribute_name = 'Hãng' OR a.attribute_name = 'Thương hiệu' OR a.attribute_name = 'Nhà sản xuất')
        ORDER BY av.value_name ASC`,
        [categoryId]
      );

      // Get all attributes for this category with their values
      const [attributes] = await db.query(
        `SELECT DISTINCT
          a.attribute_id,
          a.attribute_name,
          av.attribute_value_id,
          av.value_name,
          av.display_order
        FROM attributes a
        INNER JOIN attribute_categories ac ON a.attribute_id = ac.attribute_id
        INNER JOIN attribute_values av ON a.attribute_id = av.attribute_id
        WHERE ac.category_id = ?
          AND av.is_active = 1
          AND a.attribute_name NOT IN ('Hãng', 'Thương hiệu', 'Nhà sản xuất')
        ORDER BY a.attribute_name, av.display_order ASC, av.value_name ASC`,
        [categoryId]
      );

      // Group attributes by name
      const attributeGroups = {};
      attributes.forEach(attr => {
        if (!attributeGroups[attr.attribute_name]) {
          attributeGroups[attr.attribute_name] = {
            attributeId: attr.attribute_id,
            attributeName: attr.attribute_name,
            values: []
          };
        }
        attributeGroups[attr.attribute_name].values.push({
          valueId: attr.attribute_value_id,
          valueName: attr.value_name
        });
      });

      return {
        priceRange: {
          min: priceRange[0]?.minPrice || 0,
          max: priceRange[0]?.maxPrice || 0
        },
        brands: brands.map(b => b.brand),
        attributes: Object.values(attributeGroups)
      };
    } catch (error) {
      console.error('Error getting filter options:', error);
      throw error;
    }
  }
}

export default new Product();
