import { db } from '../libs/db.js';
import Variant from './Variant.js';

class Product {
  // Create a new product
  async create(productData) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // Insert product base information
      const [product] = await conn.query(
        `INSERT INTO products (
          product_name, description, brand, 
          warranty_info, warranty_duration, 
          is_active, category_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          productData.productName,
          productData.description,
          productData.brand,
          productData.warrantyInfo,
          productData.warrantyDuration,
          productData.isActive ?? true,
          productData.categoryId
        ]
      );
      const productId = product.insertId;

      // Create variants if provided
      if (productData.variants && productData.variants.length > 0) {
        for (const variantData of productData.variants) {
          await Variant.create({
            ...variantData,
            productId
          });
        }
      }

      await conn.commit();
      return productId;
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }

  // Get product by ID with all related information
  async getById(productId) {
    const [products] = await db.query(
      `SELECT 
        p.*,
        c.category_name,
        c.category_path
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.category_id
      WHERE p.product_id = ?`,
      [productId]
    );

    if (!products[0]) return null;

    const product = products[0];
    // Get variants separately
    product.variants = await Variant.getByProductId(productId);

    return product;
  }

  // Update product
  async update(productId, productData) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // Update product base information
      await conn.query(
        `UPDATE products SET
          product_name = ?,
          description = ?,
          brand = ?,
          warranty_info = ?,
          warranty_duration = ?,
          is_active = ?,
          category_id = ?,
          updated_at = NOW()
        WHERE product_id = ?`,
        [
          productData.productName,
          productData.description,
          productData.brand,
          productData.warrantyInfo,
          productData.warrantyDuration,
          productData.isActive,
          productData.categoryId,
          productId
        ]
      );

      // Update variants if provided
      if (productData.variants) {
        for (const variant of productData.variants) {
          if (variant.variantId) {
            // Update existing variant
            await Variant.update(variant.variantId, variant);
          } else {
            // Create new variant
            await Variant.create({
              ...variant,
              productId
            });
          }
        }
      }

      await conn.commit();
      return true;
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }

  // Delete product and all related data
  async delete(productId) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // Get all variant IDs
      const [variants] = await conn.query(
        'SELECT variant_id FROM product_variants WHERE product_id = ?',
        [productId]
      );

      // Delete variants and their related data
      for (const variant of variants) {
        await Variant.delete(variant.variant_id);
      }

      // Delete the product
      await conn.query('DELETE FROM products WHERE product_id = ?', [productId]);

      await conn.commit();
      return true;
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }

  // List products with filtering and pagination
  async list(params = {}) {
    const {
      page = 1,
      limit = 10,
      categoryId,
      brand,
      search,
      minPrice,
      maxPrice,
      isActive,
      sortBy = 'created_at',
      sortOrder = 'DESC'
    } = params;

    let conditions = ['1=1'];
    let values = [];

    if (categoryId) {
      conditions.push('p.category_id = ?');
      values.push(categoryId);
    }

    if (brand) {
      conditions.push('p.brand = ?');
      values.push(brand);
    }

    if (search) {
      conditions.push('(MATCH(p.product_name, p.description) AGAINST(? IN BOOLEAN MODE))');
      values.push(search);
    }

    if (minPrice) {
      conditions.push('EXISTS (SELECT 1 FROM product_variants pv WHERE pv.product_id = p.product_id AND pv.price >= ?)');
      values.push(minPrice);
    }

    if (maxPrice) {
      conditions.push('EXISTS (SELECT 1 FROM product_variants pv WHERE pv.product_id = p.product_id AND pv.price <= ?)');
      values.push(maxPrice);
    }

    if (isActive !== undefined) {
      conditions.push('p.is_active = ?');
      values.push(isActive);
    }

    const offset = (page - 1) * limit;
    values.push(limit, offset);

    const [products] = await db.query(
      `SELECT 
        p.*,
        c.category_name,
        c.category_path,
        (
          SELECT JSON_OBJECT(
            'minPrice', MIN(pv.price),
            'maxPrice', MAX(pv.price),
            'totalStock', SUM(pv.stock_quantity)
          )
          FROM product_variants pv
          WHERE pv.product_id = p.product_id
        ) as pricing,
        (
          SELECT vi.image_url
          FROM variant_images vi
          JOIN product_variants pv ON vi.variant_id = pv.variant_id
          WHERE pv.product_id = p.product_id AND vi.is_primary = 1
          LIMIT 1
        ) as primary_image
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.category_id
      WHERE ${conditions.join(' AND ')}
      GROUP BY p.product_id
      ORDER BY p.${sortBy} ${sortOrder}
      LIMIT ? OFFSET ?`,
      values
    );

    const [count] = await db.query(
      `SELECT COUNT(*) as total
      FROM products p
      WHERE ${conditions.join(' AND ')}`,
      values.slice(0, -2)
    );

    return {
      data: products,
      pagination: {
        total: count[0].total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count[0].total / limit)
      }
    };
  }

  // Get products by category
  async getByCategory(categoryId, includeSubcategories = false) {
    let categoryCondition = 'p.category_id = ?';
    let values = [categoryId];

    if (includeSubcategories) {
      const [category] = await db.query(
        'SELECT category_path FROM categories WHERE category_id = ?',
        [categoryId]
      );
      if (category[0]) {
        categoryCondition = 'c.category_path LIKE ?';
        values = [`${category[0].category_path}%`];
      }
    }

    const [products] = await db.query(
      `SELECT 
        p.*,
        c.category_name,
        c.category_path,
        (
          SELECT JSON_OBJECT(
            'minPrice', MIN(pv.price),
            'maxPrice', MAX(pv.price),
            'totalStock', SUM(pv.stock_quantity)
          )
          FROM product_variants pv
          WHERE pv.product_id = p.product_id
        ) as pricing,
        (
          SELECT vi.image_url
          FROM variant_images vi
          JOIN product_variants pv ON vi.variant_id = pv.variant_id
          WHERE pv.product_id = p.product_id AND vi.is_primary = 1
          LIMIT 1
        ) as primary_image
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.category_id
      WHERE ${categoryCondition} AND p.is_active = 1
      GROUP BY p.product_id`,
      values
    );

    return products;
  }

  // Search products
  async search(query, params = {}) {
    const {
      page = 1,
      limit = 10,
      categoryId,
      brand,
      minPrice,
      maxPrice,
      sortBy = 'relevance'
    } = params;

    let conditions = ['MATCH(p.product_name, p.description) AGAINST(? IN BOOLEAN MODE)'];
    let values = [query];

    if (categoryId) {
      conditions.push('p.category_id = ?');
      values.push(categoryId);
    }

    if (brand) {
      conditions.push('p.brand = ?');
      values.push(brand);
    }

    if (minPrice) {
      conditions.push('EXISTS (SELECT 1 FROM product_variants pv WHERE pv.product_id = p.product_id AND pv.price >= ?)');
      values.push(minPrice);
    }

    if (maxPrice) {
      conditions.push('EXISTS (SELECT 1 FROM product_variants pv WHERE pv.product_id = p.product_id AND pv.price <= ?)');
      values.push(maxPrice);
    }

    conditions.push('p.is_active = 1');

    const offset = (page - 1) * limit;
    values.push(limit, offset);

    let orderBy = 'p.created_at DESC';
    if (sortBy === 'relevance') {
      orderBy = 'score DESC';
    }

    const [products] = await db.query(
      `SELECT 
        p.*,
        c.category_name,
        MATCH(p.product_name, p.description) AGAINST(? IN BOOLEAN MODE) as score,
        (
          SELECT JSON_OBJECT(
            'minPrice', MIN(pv.price),
            'maxPrice', MAX(pv.price),
            'totalStock', SUM(pv.stock_quantity)
          )
          FROM product_variants pv
          WHERE pv.product_id = p.product_id
        ) as pricing,
        (
          SELECT vi.image_url
          FROM variant_images vi
          JOIN product_variants pv ON vi.variant_id = pv.variant_id
          WHERE pv.product_id = p.product_id AND vi.is_primary = 1
          LIMIT 1
        ) as primary_image
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.category_id
      WHERE ${conditions.join(' AND ')}
      GROUP BY p.product_id
      ORDER BY ${orderBy}
      LIMIT ? OFFSET ?`,
      [query, ...values]
    );

    const [count] = await db.query(
      `SELECT COUNT(*) as total
      FROM products p
      WHERE ${conditions.join(' AND ')}`,
      [query, ...values.slice(0, -2)]
    );

    return {
      data: products,
      pagination: {
        total: count[0].total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count[0].total / limit)
      }
    };
  }
}

export default new Product();
