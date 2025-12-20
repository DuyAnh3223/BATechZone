import { query } from '../../libs/db.js';
import VariantSerial from '../../models/warranty/VariantSerial.js';


class VariantSerialDAO {

  /**
   * Create new serial
   */
  async create(serialData) {
    const sql = `
      INSERT INTO variant_serials 
      (variant_id, serial_number, status) 
      VALUES (?, ?, ?)
    `;
    const result = await query(sql, [
      serialData.variant_id,
      serialData.serial_number,
      serialData.status || 'in_stock'
    ]);
    return result.insertId;
  }

  /**
   * Find serial by ID
   */
  async findById(serialId) {
    const sql = `
      SELECT * FROM variant_serials 
      WHERE serial_id = ?
    `;
    const rows = await query(sql, [serialId]);
    return rows.length > 0 ? new VariantSerial(rows[0]) : null;
  }

  /**
   * Find serial by serial number
   */
  async findBySerialNumber(serialNumber) {
    const sql = `
      SELECT * FROM variant_serials 
      WHERE serial_number = ?
    `;
    const rows = await query(sql, [serialNumber]);
    return rows.length > 0 ? new VariantSerial(rows[0]) : null;
  }

  /**
   * Find serials by variant ID
   */
  async findByVariantId(variantId, status = null) {
    let sql = `SELECT * FROM variant_serials WHERE variant_id = ?`;
    const params = [variantId];

    if (status) {
      sql += ` AND status = ?`;
      params.push(status);
    }

    sql += ` ORDER BY created_at ASC`;
    
    const rows = await query(sql, params);
    return rows.map(row => new VariantSerial(row));
  }

  /**
   * Find serials by order item ID
   * @param {number} orderItemId - Order item ID
   * @param {object} connection - Optional DB connection for transactions
   */
  async findByOrderItemId(orderItemId, connection = null) {
    const sql = `
      SELECT * FROM variant_serials 
      WHERE order_item_id = ?
      ORDER BY created_at ASC
    `;
    
    let rows;
    if (connection) {
      [rows] = await connection.execute(sql, [orderItemId]);
    } else {
      rows = await query(sql, [orderItemId]);
    }
    
    return rows.map(row => new VariantSerial(row));
  }

  /**
   * Update serial
   * @param {number} serialId - Serial ID to update
   * @param {object} updates - Fields to update
   * @param {object} connection - Optional DB connection for transactions
   */
  async update(serialId, updates, connection = null) {
    const allowedFields = ['status', 'order_item_id', 'warranty_id'];
    const fields = [];
    const params = [];

    Object.keys(updates).forEach(key => {
      if (allowedFields.includes(key)) {
        fields.push(`${key} = ?`);
        params.push(updates[key]);
      }
    });

    if (fields.length === 0) {
      throw new Error('No valid fields to update');
    }

    params.push(serialId);
    const sql = `
      UPDATE variant_serials 
      SET ${fields.join(', ')}
      WHERE serial_id = ?
    `;

    // Use provided connection (for transactions) or default query helper
    if (connection) {
      const [result] = await connection.execute(sql, params);
      return result.affectedRows > 0;
    } else {
      const result = await query(sql, params);
      return result.affectedRows > 0;
    }
  }

  /**
   * Delete serial
   */
  async delete(serialId) {
    const sql = `DELETE FROM variant_serials WHERE serial_id = ?`;
    const result = await query(sql, [serialId]);
    return result.affectedRows > 0;
  }

  /**
   * Count serials by variant and status
   * @param {number} variantId - Variant ID
   * @param {string} status - Serial status
   * @param {object} connection - Optional DB connection for transactions
   */
  async countByVariantAndStatus(variantId, status, connection = null) {
    const sql = `
      SELECT COUNT(*) as count 
      FROM variant_serials 
      WHERE variant_id = ? AND status = ?
    `;
    
    let rows;
    if (connection) {
      [rows] = await connection.execute(sql, [variantId, status]);
    } else {
      rows = await query(sql, [variantId, status]);
    }
    
    return rows[0].count;
  }

  /**
   * Get available count (in_stock)
   * @param {number} variantId - Variant ID
   * @param {object} connection - Optional DB connection for transactions
   */
  async getAvailableCount(variantId, connection = null) {
    return await this.countByVariantAndStatus(variantId, 'in_stock', connection);
  }

  /**
   * Find one available serial (FIFO by serial_id)
   */
  async findOneAvailable(variantId) {
    const sql = `
      SELECT * FROM variant_serials 
      WHERE variant_id = ? AND status = 'in_stock'
      ORDER BY serial_id ASC
      LIMIT 1
    `;
    const rows = await query(sql, [variantId]);
    return rows.length > 0 ? new VariantSerial(rows[0]) : null;
  }

  /**
   * Find multiple available serials (FIFO by serial_id)
   * @param {number} variantId - Variant ID
   * @param {number} limit - Number of serials to find
   * @param {object} connection - Optional DB connection for transactions
   */
  async findAvailableSerials(variantId, limit, connection = null) {
    const sql = `
      SELECT * FROM variant_serials 
      WHERE variant_id = ? AND status = 'in_stock'
      ORDER BY serial_id ASC
      LIMIT ?
    `;
    
    let rows;
    if (connection) {
      [rows] = await connection.execute(sql, [variantId, limit]);
    } else {
      rows = await query(sql, [variantId, limit]);
    }
    
    return rows.map(row => new VariantSerial(row));
  }

  /**
   * Check if serial number exists
   */
  async existsBySerialNumber(serialNumber) {
    const sql = `
      SELECT COUNT(*) as count 
      FROM variant_serials 
      WHERE serial_number = ?
    `;
    const rows = await query(sql, [serialNumber]);
    return rows[0].count > 0;
  }

  /**
   * Get paginated list with filters
   */
  async findAll(filters = {}, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    let sql = `SELECT * FROM variant_serials WHERE 1=1`;
    const params = [];

    // Apply filters
    if (filters.variant_id) {
      sql += ` AND variant_id = ?`;
      params.push(filters.variant_id);
    }
    if (filters.status) {
      sql += ` AND status = ?`;
      params.push(filters.status);
    }
    if (filters.order_item_id) {
      sql += ` AND order_item_id = ?`;
      params.push(filters.order_item_id);
    }
    if (filters.serial_number) {
      sql += ` AND serial_number LIKE ?`;
      params.push(`%${filters.serial_number}%`);
    }

    // Count total
    const countSql = sql.replace('SELECT *', 'SELECT COUNT(*) as total');
    const countRows = await query(countSql, params);
    const total = countRows[0].total;

    // Get paginated data
    sql += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);
    
    const rows = await query(sql, params);
    const serials = rows.map(row => new VariantSerial(row));

    return {
      data: serials,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Bulk insert serials
   */
  async bulkInsert(serials) {
    console.log(`🔵 DAO bulkInsert called with ${serials?.length || 0} serials`);
    
    if (!serials || serials.length === 0) {
      console.log('⚠️ No serials to insert');
      return [];
    }

    const sql = `
      INSERT INTO variant_serials 
      (variant_id, serial_number, status) 
      VALUES ?
    `;
    
    const values = serials.map(s => [
      s.variant_id,
      s.serial_number,
      s.status || 'in_stock'
    ]);

    console.log(`💾 Executing bulk insert SQL with ${values.length} rows...`);
    console.log(`📝 First value sample:`, values[0]);
    
    try {
      // Import db directly for bulk insert (query() uses execute which doesn't support VALUES ?)
      const { db } = await import('../../libs/db.js');
      const [result] = await db.query(sql, [values]);
      console.log(`✅ Bulk insert successful. Result:`, result);
      return result;
    } catch (error) {
      console.error(`❌ Bulk insert failed:`, error);
      throw error;
    }
  }

  /**
   * Get inventory summary by variant
   */
  async getInventorySummary(variantId) {
    const sql = `
      SELECT 
        status,
        COUNT(*) as count
      FROM variant_serials
      WHERE variant_id = ?
      GROUP BY status
    `;
    const rows = await query(sql, [variantId]);
    
    const summary = {
      variant_id: variantId,
      total: 0,
      in_stock: 0,
      reserved: 0,
      sold: 0,
      rma_in: 0,
      rma_done: 0,
      scrapped: 0
    };

    rows.forEach(row => {
      summary[row.status] = row.count;
      summary.total += row.count;
    });

    return summary;
  }

}

export default new VariantSerialDAO();
