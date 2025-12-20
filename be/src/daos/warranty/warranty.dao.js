import { query } from '../../libs/db.js';
import Warranty from '../../models/warranty/Warranty.js';

class WarrantyDAO {

  /**
   * Create new warranty
   */
  async create(warrantyData) {
    const sql = `
      INSERT INTO warranties 
      (serial_id, order_item_id, service_request_id, warranty_period, start_date, end_date, status, notes) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const result = await query(sql, [
      warrantyData.serial_id,
      warrantyData.order_item_id,
      warrantyData.service_request_id || null,
      warrantyData.warranty_period,
      warrantyData.start_date,
      warrantyData.end_date,
      warrantyData.status || 'active',
      warrantyData.notes || null
    ]);
    return result.insertId;
  }

  /**
   * Find warranty by ID
   */
  async findById(warrantyId) {
    const sql = `SELECT * FROM warranties WHERE warranty_id = ?`;
    const rows = await query(sql, [warrantyId]);
    return rows.length > 0 ? new Warranty(rows[0]) : null;
  }

  /**
   * Find warranty by serial ID
   */
  async findBySerialId(serialId) {
    const sql = `SELECT * FROM warranties WHERE serial_id = ? ORDER BY created_at DESC LIMIT 1`;
    const rows = await query(sql, [serialId]);
    return rows.length > 0 ? new Warranty(rows[0]) : null;
  }

  /**
   * Find warranties by order item ID
   */
  async findByOrderItemId(orderItemId) {
    const sql = `SELECT * FROM warranties WHERE order_item_id = ? ORDER BY created_at DESC`;
    const rows = await query(sql, [orderItemId]);
    return rows.map(row => new Warranty(row));
  }

  /**
   * Update warranty
   */
  async update(warrantyId, updates) {
    const allowedFields = ['status', 'notes', 'end_date'];
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

    params.push(warrantyId);
    const sql = `UPDATE warranties SET ${fields.join(', ')} WHERE warranty_id = ?`;
    const result = await query(sql, params);
    return result.affectedRows > 0;
  }

  /**
   * Bulk create warranties
   */
  async bulkCreate(warranties) {
    if (!warranties || warranties.length === 0) {
      return [];
    }

    const sql = `
      INSERT INTO warranties 
      (serial_id, order_item_id, service_request_id, warranty_period, start_date, end_date, status) 
      VALUES ?
    `;
    
    const values = warranties.map(w => [
      w.serial_id,
      w.order_item_id,
      w.service_request_id || null,
      w.warranty_period,
      w.start_date,
      w.end_date,
      w.status || 'active'
    ]);

    const { db } = await import('../../libs/db.js');
    const [result] = await db.query(sql, [values]);
    return result;
  }

  /**
   * Get active warranties
   */
  async getActiveWarranties() {
    const sql = `
      SELECT * FROM warranties 
      WHERE status = 'active' AND end_date > NOW()
      ORDER BY end_date ASC
    `;
    const rows = await query(sql);
    return rows.map(row => new Warranty(row));
  }

  /**
   * Get expiring warranties (within days)
   */
  async getExpiringWarranties(days = 30) {
    const sql = `
      SELECT * FROM warranties 
      WHERE status = 'active' 
        AND end_date > NOW() 
        AND end_date <= DATE_ADD(NOW(), INTERVAL ? DAY)
      ORDER BY end_date ASC
    `;
    const rows = await query(sql, [days]);
    return rows.map(row => new Warranty(row));
  }
}

export default new WarrantyDAO();
