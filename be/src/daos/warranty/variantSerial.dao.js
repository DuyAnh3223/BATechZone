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
   */
  async findByOrderItemId(orderItemId) {
    const sql = `
      SELECT * FROM variant_serials 
      WHERE order_item_id = ?
      ORDER BY created_at ASC
    `;
    const rows = await query(sql, [orderItemId]);
    return rows.map(row => new VariantSerial(row));
  }

  /**
   * Update serial
   */
  async update(serialId, updates) {
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

    const result = await query(sql, params);
    return result.affectedRows > 0;
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
   */
  async countByVariantAndStatus(variantId, status) {
    const sql = `
      SELECT COUNT(*) as count 
      FROM variant_serials 
      WHERE variant_id = ? AND status = ?
    `;
    const rows = await query(sql, [variantId, status]);
    return rows[0].count;
  }

  /**
   * Get available count (in_stock)
   */
  async getAvailableCount(variantId) {
    return await this.countByVariantAndStatus(variantId, 'in_stock');
  }

  /**
   * Find one available serial (FIFO)
   */
  async findOneAvailable(variantId) {
    const sql = `
      SELECT * FROM variant_serials 
      WHERE variant_id = ? AND status = 'in_stock'
      ORDER BY created_at ASC
      LIMIT 1
    `;
    const rows = await query(sql, [variantId]);
    return rows.length > 0 ? new VariantSerial(rows[0]) : null;
  }

  /**
   * Find multiple available serials
   */
  async findAvailableSerials(variantId, limit) {
    const sql = `
      SELECT * FROM variant_serials 
      WHERE variant_id = ? AND status = 'in_stock'
      ORDER BY created_at ASC
      LIMIT ?
    `;
    const rows = await query(sql, [variantId, limit]);
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
    if (!serials || serials.length === 0) {
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

    const result = await query(sql, [values]);
    return result;
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
