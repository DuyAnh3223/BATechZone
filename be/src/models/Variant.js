import { db } from '../libs/db.js';

class Variant {
  // Create a new variant
  async create(variantData) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // Insert variant
      const [variant] = await conn.query(
        `INSERT INTO product_variants (
          product_id, sku, variant_name, price, 
          stock_quantity,  is_active, is_default
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          variantData.productId,
          variantData.sku || null,
          variantData.variantName || null,
          variantData.price,
          variantData.stockQuantity || 0,
          variantData.isActive ?? true,
          variantData.isDefault ?? false
        ]
      );
      const variantId = variant.insertId;

      // Insert variant attributes
      if (variantData.attributes && variantData.attributes.length > 0) {
        // Support both array of IDs and array of objects
        const attributeValueIds = variantData.attributes.map(attr => 
          typeof attr === 'object' ? attr.attributeValueId : attr
        ).filter(id => id != null);
        
        if (attributeValueIds.length > 0) {
          await conn.query(
            'INSERT INTO variant_attributes (variant_id, attribute_value_id) VALUES ?',
            [attributeValueIds.map(id => [variantId, id])]
          );
        }
      }

      // Insert variant images
      if (variantData.images && variantData.images.length > 0) {
        await conn.query(
          'INSERT INTO variant_images (variant_id, image_url, is_primary) VALUES ?',
          [variantData.images.map(img => [variantId, img.imageUrl, img.isPrimary ?? false])]
        );
      }

      await conn.commit();
      return variantId;
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }

  // Get variant by ID
  async getById(variantId) {
    const [variants] = await db.query(
      `SELECT 
        pv.*,
        p.product_name,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'attributeValueId', va.attribute_value_id,
            'attributeName', a.attribute_name,
            'attributeType', a.attribute_type,
            'value', av.value
          )
        ) as attributes,
        (
          SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
              'imageId', vi.image_id,
              'imageUrl', vi.image_url,
              'isPrimary', vi.is_primary
            )
          )
          FROM variant_images vi
          WHERE vi.variant_id = pv.variant_id
        ) as images
      FROM product_variants pv
      JOIN products p ON pv.product_id = p.product_id
      LEFT JOIN variant_attributes va ON pv.variant_id = va.variant_id
      LEFT JOIN attribute_values av ON va.attribute_value_id = av.attribute_value_id
      LEFT JOIN attributes a ON av.attribute_id = a.attribute_id
      WHERE pv.variant_id = ?
      GROUP BY pv.variant_id`,
      [variantId]
    );
    return variants[0];
  }

  // Update variant
  async update(variantId, variantData) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // Build dynamic update query
      const updateFields = [];
      const updateValues = [];

      if (variantData.sku !== undefined) {
        updateFields.push('sku = ?');
        updateValues.push(variantData.sku);
      }
      if (variantData.variantName !== undefined) {
        updateFields.push('variant_name = ?');
        updateValues.push(variantData.variantName);
      }
      if (variantData.price !== undefined) {
        updateFields.push('price = ?');
        updateValues.push(variantData.price);
      }
      if (variantData.compareAtPrice !== undefined) {
        updateFields.push('compare_at_price = ?');
        updateValues.push(variantData.compareAtPrice);
      }
      if (variantData.costPrice !== undefined) {
        updateFields.push('cost_price = ?');
        updateValues.push(variantData.costPrice);
      }
      if (variantData.stockQuantity !== undefined) {
        updateFields.push('stock_quantity = ?');
        updateValues.push(variantData.stockQuantity);
      }
      if (variantData.weight !== undefined) {
        updateFields.push('weight = ?');
        updateValues.push(variantData.weight);
      }
      if (variantData.dimensions !== undefined) {
        updateFields.push('dimensions = ?');
        updateValues.push(variantData.dimensions);
      }
      if (variantData.isActive !== undefined) {
        updateFields.push('is_active = ?');
        updateValues.push(variantData.isActive);
      }
      if (variantData.isDefault !== undefined) {
        updateFields.push('is_default = ?');
        updateValues.push(variantData.isDefault);
      }

      if (updateFields.length === 0) {
        await conn.rollback();
        return false;
      }

      updateFields.push('updated_at = NOW()');
      updateValues.push(variantId);

      // Update variant base info
      await conn.query(
        `UPDATE product_variants SET ${updateFields.join(', ')} WHERE variant_id = ?`,
        updateValues
      );

      // Update variant attributes
      if (variantData.attributes) {
        await conn.query(
          'DELETE FROM variant_attributes WHERE variant_id = ?',
          [variantId]
        );
        // Support both array of IDs and array of objects
        const attributeValueIds = variantData.attributes.map(attr => 
          typeof attr === 'object' ? attr.attributeValueId : attr
        ).filter(id => id != null);
        
        if (attributeValueIds.length > 0) {
          await conn.query(
            'INSERT INTO variant_attributes (variant_id, attribute_value_id) VALUES ?',
            [attributeValueIds.map(id => [variantId, id])]
          );
        }
      }

      // Update variant images
      if (variantData.images) {
        await conn.query(
          'DELETE FROM variant_images WHERE variant_id = ?',
          [variantId]
        );
        if (variantData.images.length > 0) {
          await conn.query(
            'INSERT INTO variant_images (variant_id, image_url, is_primary) VALUES ?',
            [variantData.images.map(img => [variantId, img.imageUrl, img.isPrimary ?? false])]
          );
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

  // Delete variant
  async delete(variantId) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // Delete related records
      await conn.query('DELETE FROM variant_attributes WHERE variant_id = ?', [variantId]);
      await conn.query('DELETE FROM variant_images WHERE variant_id = ?', [variantId]);
      await conn.query('DELETE FROM product_variants WHERE variant_id = ?', [variantId]);

      await conn.commit();
      return true;
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }

  // List variants with filtering and pagination
  async list(params = {}) {
    const {
      page = 1,
      limit = 10,
      productId,
      search,
      minPrice,
      maxPrice,
      inStock,
      sortBy = 'created_at',
      sortOrder = 'DESC'
    } = params;

    let conditions = ['1=1'];
    let values = [];

    if (productId) {
      conditions.push('pv.product_id = ?');
      values.push(productId);
    }

    if (search) {
      conditions.push('(pv.sku LIKE ? OR p.product_name LIKE ?)');
      values.push(`%${search}%`, `%${search}%`);
    }

    if (minPrice) {
      conditions.push('pv.price >= ?');
      values.push(minPrice);
    }

    if (maxPrice) {
      conditions.push('pv.price <= ?');
      values.push(maxPrice);
    }

    if (inStock !== undefined) {
      conditions.push('pv.stock_quantity > 0');
    }

    const offset = (page - 1) * limit;
    values.push(limit, offset);

    const [variants] = await db.query(
      `SELECT 
        pv.*,
        p.product_name,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'attributeValueId', va.attribute_value_id,
            'attributeName', a.attribute_name,
            'value', av.value
          )
        ) as attributes,
        (
          SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
              'imageId', vi.image_id,
              'imageUrl', vi.image_url,
              'isPrimary', vi.is_primary
            )
          )
          FROM variant_images vi
          WHERE vi.variant_id = pv.variant_id
        ) as images
      FROM product_variants pv
      JOIN products p ON pv.product_id = p.product_id
      LEFT JOIN variant_attributes va ON pv.variant_id = va.variant_id
      LEFT JOIN attribute_values av ON va.attribute_value_id = av.attribute_value_id
      LEFT JOIN attributes a ON av.attribute_id = a.attribute_id
      WHERE ${conditions.join(' AND ')}
      GROUP BY pv.variant_id
      ORDER BY pv.${sortBy} ${sortOrder}
      LIMIT ? OFFSET ?`,
      values
    );

    const [count] = await db.query(
      `SELECT COUNT(DISTINCT pv.variant_id) as total
      FROM product_variants pv
      JOIN products p ON pv.product_id = p.product_id
      WHERE ${conditions.join(' AND ')}`,
      values.slice(0, -2)
    );

    return {
      data: variants,
      pagination: {
        total: count[0].total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count[0].total / limit)
      }
    };
  }

  // Update stock quantity
  async updateStock(variantId, quantity, operation = 'add') {
    const [result] = await db.query(
      `UPDATE product_variants 
      SET stock_quantity = stock_quantity ${operation === 'add' ? '+' : '-'} ?
      WHERE variant_id = ?`,
      [quantity, variantId]
    );
    return result.affectedRows > 0;
  }

  // Get variants by product ID
  async getByProductId(productId) {
    try {
      const productIdInt = parseInt(productId);
      if (isNaN(productIdInt)) {
        throw new Error('Invalid product ID');
      }

      console.log('Querying variants for product_id:', productIdInt);
      
      // First, get all variants for the product - simplified query
      const [variants] = await db.query(
        `SELECT 
          variant_id,
          product_id,
          sku,
          variant_name,
          price, 
          stock_quantity as stock,
          is_active,
          is_default,
          created_at,
          updated_at
        FROM product_variants
        WHERE product_id = ?
        ORDER BY is_default DESC, created_at ASC`,
        [productIdInt]
      );
      
      console.log('Found variants:', variants?.length || 0);
      
      if (!variants || variants.length === 0) {
        return [];
      }
      
      // For each variant, fetch its attributes
      const variantsWithAttributes = await Promise.all(
        variants.map(async (v) => {
          // Fetch attributes for this variant
          const [attributes] = await db.query(
            `SELECT 
              va.attribute_value_id,
              av.value_name,
              a.attribute_id,
              a.attribute_name
            FROM variant_attributes va
            JOIN attribute_values av ON va.attribute_value_id = av.attribute_value_id
            JOIN attributes a ON av.attribute_id = a.attribute_id
            WHERE va.variant_id = ?`,
            [v.variant_id]
          );
          
          return {
            variant_id: v.variant_id,
            product_id: v.product_id,
            sku: v.sku || null,
            variant_name: v.variant_name || null,
            price: v.price ? parseFloat(v.price) : 0,
            stock: v.stock ? parseInt(v.stock) : 0,
            is_active: v.is_active === 1 || v.is_active === true || v.is_active === '1',
            is_default: v.is_default === 1 || v.is_default === true || v.is_default === '1',
            created_at: v.created_at,
            updated_at: v.updated_at,
            attributes: attributes.map(attr => ({
              attribute_value_id: attr.attribute_value_id,
              value_name: attr.value_name,
              attribute_id: attr.attribute_id,
              attribute_name: attr.attribute_name
            })),
            images: [] // Will be loaded separately if needed
          };
        })
      );
      
      return variantsWithAttributes;
    } catch (error) {
      console.error('Error in getByProductId:', error);
      console.error('Error stack:', error.stack);
      console.error('Error code:', error.code);
      throw error;
    }
  }
}

export default new Variant();
