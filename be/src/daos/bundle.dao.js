/**
 * bundle.dao.js - Database operations for PC Bundles
 */
import { db } from '../libs/db.js';
import { query } from '../libs/db.js';

class BundleDAO {
  
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // CREATE OPERATIONS
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━���━━━━━━━━━
  
  /**
   * ✅ Tạo product cho bundle
   */
  async createBundleProduct(productData) {
    const query = `
      INSERT INTO products (category_id, product_name, slug, description, base_price, is_active, is_featured)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    const [result] = await db.execute(query, [
      productData.category_id,
      productData.product_name,
      productData.slug,
      productData.description,
      productData.base_price,
      productData.is_active ??  1,
      productData.is_featured ?? 0
    ]);
    
    return result.insertId;
  }
  
  /**
   * ✅ Tạo variant bundle
   */
  async createBundleVariant(variantData) {
    const query = `
      INSERT INTO product_variants 
        (product_id, sku, variant_name, price, variant_type, warranty_period, is_active, is_default, discount_percent, discount_start_date, discount_end_date)
      VALUES (?, ?, ?, ?, 'bundle', ?, ?, ?, ?, ?, ?)
    `;
    
    const [result] = await db.execute(query, [
      variantData.product_id,
      variantData.sku,
      variantData.variant_name,
      variantData.price,
      variantData.warranty_period ??  24,
      variantData.is_active ?? 1,
      variantData.is_default ??  1,
      variantData.discount_percent ?? 0,
      variantData.discount_start_date || null,
      variantData.discount_end_date || null
    ]);
    
    return result.insertId;
  }
  
  /**
   * ✅ Thêm linh kiện vào bundle
   */
  async addBundleItem(bundleVariantId, componentVariantId, quantity, displayOrder) {
    const query = `
      INSERT INTO bundle_items (bundle_variant_id, component_variant_id, quantity, display_order)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE quantity = ?, display_order = ?
    `;
    
    const [result] = await db.execute(query, [
      bundleVariantId,
      componentVariantId,
      quantity,
      displayOrder,
      quantity,
      displayOrder
    ]);
    
    return result;
  }
  
  /**
   * ✅ Thêm nhiều linh kiện vào bundle
   */
  async addBundleItems(bundleVariantId, items) {
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // Xóa các items cũ
      await connection.execute(
        'DELETE FROM bundle_items WHERE bundle_variant_id = ?',
        [bundleVariantId]
      );
      
      // Thêm items mới
      for (const item of items) {
        await connection.execute(
          'INSERT INTO bundle_items (bundle_variant_id, component_variant_id, quantity, display_order) VALUES (?, ?, ?, ?)',
          [bundleVariantId, item.component_variant_id, item.quantity, item.display_order]
        );
      }
      
      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
  
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // READ OPERATIONS
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  /**
   * ✅ Lấy danh sách bundles (có phân trang, filter)
   */
  async getBundles(filters = {}) {
    let query = `
      SELECT 
        p.product_id,
        p.product_name,
        p.slug,
        p.description,
        p.img_path,
        pv.variant_id,
        pv.sku,
        pv.variant_name,
        pv.price,
        pv.warranty_period,
        pv.discount_percent,
        pv.discount_start_date,
        pv.discount_end_date,
        pv.is_active,
        pv.is_default,
        
        -- Tồn kho động
        (SELECT available_stock FROM v_bundle_stock WHERE variant_id = pv.variant_id) as stock,
        
        -- Số linh kiện
        (SELECT COUNT(*) FROM bundle_items WHERE bundle_variant_id = pv.variant_id) as component_count
        
      FROM product_variants pv
      JOIN products p ON pv.product_id = p.product_id
      WHERE pv.variant_type = 'bundle'
    `;
    
    const params = [];
    
    // Filter
    if (filters.is_active !== undefined) {
      query += ' AND pv.is_active = ?';
      params.push(filters.is_active);
    }
    
    if (filters.min_price) {
      query += ' AND pv.price >= ? ';
      params.push(filters.min_price);
    }
    
    if (filters. max_price) {
      query += ' AND pv.price <= ?';
      params.push(filters.max_price);
    }
    
    if (filters.search) {
      query += ' AND (p.product_name LIKE ? OR p.description LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm);
    }
    
    // Sort
    const sortBy = filters.sort_by || 'p.created_at';
    const sortOrder = filters.sort_order || 'DESC';
    query += ` ORDER BY ${sortBy} ${sortOrder}`;
    
    // Pagination
    const limit = filters.limit || 20;
    const offset = filters.offset || 0;
    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);
    
    const [rows] = await db.execute(query, params);
    return rows;
  }
  
  /**
   * ✅ Lấy chi tiết bundle
   */
  async getBundleById(variantId) {
    const query = `
      SELECT 
        p.product_id,
        p.product_name,
        p.slug,
        p. description,
        p.img_path,
        p.category_id,
        pv.variant_id,
        pv.sku,
        pv.variant_name,
        pv.price,
        pv.warranty_period,
        pv.discount_percent,
        pv.discount_start_date,
        pv.discount_end_date,
        pv.is_active,
        
        -- Tồn kho
        (SELECT available_stock FROM v_bundle_stock WHERE variant_id = pv.variant_id) as stock
        
      FROM product_variants pv
      JOIN products p ON pv.product_id = p.product_id
      WHERE pv.variant_id = ?  AND pv.variant_type = 'bundle'
    `;
    
    const [rows] = await db.execute(query, [variantId]);
    return rows[0];
  }
  
  /**
   * ✅ Lấy danh sách linh kiện trong bundle
   */
  async getBundleItems(bundleVariantId) {
    const query = `
      SELECT 
        bi.bundle_item_id,
        bi.component_variant_id,
        bi.quantity,
        bi.display_order,
        
        p.product_id,
        p.product_name,
        p.img_path,
        p.category_id,
        c.category_name,
        
        pv.sku,
        pv.variant_name,
        pv.price,
        pv.warranty_period,
        
        -- Tồn kho linh kiện
        (SELECT COUNT(*) FROM variant_serials vs 
         WHERE vs.variant_id = pv.variant_id 
           AND vs.status = 'in_stock'
           AND vs.serial_type = 'component'
        ) as component_stock
        
      FROM bundle_items bi
      JOIN product_variants pv ON bi.component_variant_id = pv.variant_id
      JOIN products p ON pv.product_id = p.product_id
      JOIN categories c ON p.category_id = c.category_id
      WHERE bi.bundle_variant_id = ?
      ORDER BY bi.display_order
    `;
    
    const [rows] = await db.execute(query, [bundleVariantId]);
    return rows;
  }
  
  /**
   * ✅ Lấy tồn kho bundle
   */
  async getBundleStock(bundleVariantId) {
    const query = 'CALL sp_get_bundle_stock(?, @stock)';
    await db.execute(query, [bundleVariantId]);
    
    const [result] = await db.execute('SELECT @stock as stock');
    return result[0].stock;
  }
  
  /**
   * ✅ Tính max stock có thể tạo cho bundle dựa trên component stock
   * Trả về MIN(component_stock / quantity_needed)
   */
  async calculateMaxBundleStock(components) {
    if (!components || components.length === 0) {
      return 0;
    }
    
    let minStock = Infinity;
    
    for (const component of components) {
      const query = `
        SELECT COUNT(*) as available_stock
        FROM variant_serials
        WHERE variant_id = ?
          AND status = 'in_stock'
          AND serial_type = 'component'
      `;
      
      const [rows] = await db.execute(query, [component.component_variant_id]);
      const availableStock = rows[0].available_stock;
      const possibleBundles = Math.floor(availableStock / component.quantity);
      
      minStock = Math.min(minStock, possibleBundles);
    }
    
    return minStock === Infinity ? 0 : minStock;
  }
  
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // UPDATE OPERATIONS
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  /**
   * ✅ Cập nhật bundle product
   */
  async updateBundleProduct(productId, productData) {
    const query = `
      UPDATE products
      SET 
        product_name = ?,
        description = ?,
        img_path = ?,
        category_id = ?,
        is_active = ?,
        is_featured = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE product_id = ? 
    `;
    
    const [result] = await db.execute(query, [
      productData.product_name,
      productData.description,
      productData.img_path,
      productData.category_id,
      productData.is_active,
      productData.is_featured,
      productId
    ]);
    
    return result.affectedRows > 0;
  }
  
  /**
   * ✅ Cập nhật bundle variant
   */
  async updateBundleVariant(variantId, variantData) {
    const query = `
      UPDATE product_variants
      SET 
        variant_name = ?,
        price = ?,
        warranty_period = ?,
        discount_percent = ?,
        discount_start_date = ?,
        discount_end_date = ?,
        is_active = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE variant_id = ?  AND variant_type = 'bundle'
    `;
    
    const [result] = await db.execute(query, [
      variantData.variant_name,
      variantData.price,
      variantData.warranty_period,
      variantData.discount_percent,
      variantData.discount_start_date,
      variantData.discount_end_date,
      variantData.is_active,
      variantId
    ]);
    
    return result.affectedRows > 0;
  }
  
  /**
   * ✅ Xóa linh kiện khỏi bundle
   */
  async removeBundleItem(bundleItemId) {
    const query = 'DELETE FROM bundle_items WHERE bundle_item_id = ?';
    const [result] = await db.execute(query, [bundleItemId]);
    return result.affectedRows > 0;
  }
  
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // DELETE OPERATIONS
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  /**
   * ✅ Xóa bundle (soft delete)
   */
  async deleteBundle(variantId) {
    const query = `
      UPDATE product_variants
      SET is_active = 0, updated_at = CURRENT_TIMESTAMP
      WHERE variant_id = ?  AND variant_type = 'bundle'
    `;
    
    const [result] = await db.execute(query, [variantId]);
    return result.affectedRows > 0;
  }
  
  /**
   * ✅ Xóa bundle vĩnh viễn
   */
  async deleteBundlePermanently(variantId) {
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // Xóa bundle items
      await connection.execute('DELETE FROM bundle_items WHERE bundle_variant_id = ?', [variantId]);
      
      // Xóa variant
      await connection.execute('DELETE FROM product_variants WHERE variant_id = ?  AND variant_type = "bundle"', [variantId]);
      
      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
  
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // SELL OPERATIONS
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  /**
   * ✅ Bán PC Bundle
   */
  async sellBundle(bundleVariantId, orderItemId) {
    const query = 'CALL sp_sell_pc_bundle(?, ?, @success, @message, @serial)';
    await db.execute(query, [bundleVariantId, orderItemId]);
    
    const [result] = await db.execute('SELECT @success as success, @message as message, @serial as serial_number');
    return result[0];
  }
}

export default new BundleDAO();