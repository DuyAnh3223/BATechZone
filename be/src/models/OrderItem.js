import { db } from '../libs/db.js';

class OrderItem {
  // Tạo order item mới
  async create(itemData) {
    const [result] = await db.query(
      `INSERT INTO order_items (
        order_id, variant_id, product_name, variant_name, sku,
        quantity, unit_price, discount_amount, subtotal
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        itemData.orderId,
        itemData.variantId,
        itemData.productName,
        itemData.variantName || null,
        itemData.sku || null,
        itemData.quantity,
        itemData.unitPrice,
        itemData.discountAmount || 0,
        itemData.subtotal
      ]
    );
    return result.insertId;
  }

  // Lấy order item theo ID
  async getById(orderItemId) {
    const [items] = await db.query(
      `SELECT 
        oi.*,
        pv.image_url as variant_image,
        pv.stock_quantity
      FROM order_items oi
      LEFT JOIN product_variants pv ON oi.variant_id = pv.variant_id
      WHERE oi.order_item_id = ?`,
      [orderItemId]
    );
    return items[0];
  }

  // Lấy tất cả items của một đơn hàng
  async getByOrderId(orderId) {
    const [items] = await db.query(
      `SELECT 
        oi.*,
        pv.image_url as variant_image,
        pv.stock_quantity,
        p.product_id
      FROM order_items oi
      LEFT JOIN product_variants pv ON oi.variant_id = pv.variant_id
      LEFT JOIN products p ON pv.product_id = p.product_id
      WHERE oi.order_id = ?
      ORDER BY oi.order_item_id ASC`,
      [orderId]
    );
    return items;
  }

  // Lấy items theo variant ID (lịch sử mua hàng của variant)
  async getByVariantId(variantId, params = {}) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'created_at',
      sortOrder = 'DESC'
    } = params;

    const offset = (page - 1) * limit;

    const [items] = await db.query(
      `SELECT 
        oi.*,
        o.order_number,
        o.order_status,
        o.created_at as order_date,
        u.username,
        u.email
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.order_id
      JOIN users u ON o.user_id = u.user_id
      WHERE oi.variant_id = ?
      ORDER BY oi.${sortBy} ${sortOrder}
      LIMIT ? OFFSET ?`,
      [variantId, limit, offset]
    );

    const [count] = await db.query(
      'SELECT COUNT(*) as total FROM order_items WHERE variant_id = ?',
      [variantId]
    );

    return {
      data: items,
      pagination: {
        total: count[0].total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count[0].total / limit)
      }
    };
  }

  // Cập nhật thông tin order item
  async update(orderItemId, itemData) {
    const [result] = await db.query(
      `UPDATE order_items 
      SET 
        quantity = ?,
        unit_price = ?,
        discount_amount = ?,
        subtotal = ?
      WHERE order_item_id = ?`,
      [
        itemData.quantity,
        itemData.unitPrice,
        itemData.discountAmount || 0,
        itemData.subtotal,
        orderItemId
      ]
    );
    return result.affectedRows > 0;
  }

  // Xóa order item
  async delete(orderItemId) {
    const [result] = await db.query(
      'DELETE FROM order_items WHERE order_item_id = ?',
      [orderItemId]
    );
    return result.affectedRows > 0;
  }

  // Xóa tất cả items của một đơn hàng
  async deleteByOrderId(orderId) {
    const [result] = await db.query(
      'DELETE FROM order_items WHERE order_id = ?',
      [orderId]
    );
    return result.affectedRows;
  }

  // Tính tổng giá trị của các items trong đơn hàng
  async calculateOrderTotal(orderId) {
    const [result] = await db.query(
      `SELECT 
        SUM(subtotal) as total,
        COUNT(*) as item_count
      FROM order_items 
      WHERE order_id = ?`,
      [orderId]
    );
    return {
      total: result[0].total || 0,
      itemCount: result[0].item_count || 0
    };
  }

  // Lấy sản phẩm bán chạy nhất
  async getBestSellers(params = {}) {
    const {
      limit = 10,
      fromDate,
      toDate
    } = params;

    let dateCondition = '';
    let values = [];

    if (fromDate && toDate) {
      dateCondition = 'AND o.created_at BETWEEN ? AND ?';
      values.push(fromDate, toDate);
    } else if (fromDate) {
      dateCondition = 'AND o.created_at >= ?';
      values.push(fromDate);
    } else if (toDate) {
      dateCondition = 'AND o.created_at <= ?';
      values.push(toDate);
    }

    values.push(limit);

    const [items] = await db.query(
      `SELECT 
        oi.variant_id,
        oi.product_name,
        oi.variant_name,
        SUM(oi.quantity) as total_sold,
        SUM(oi.subtotal) as total_revenue,
        COUNT(DISTINCT oi.order_id) as order_count,
        AVG(oi.unit_price) as avg_price
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.order_id
      WHERE o.order_status IN ('delivered', 'shipping')
      ${dateCondition}
      GROUP BY oi.variant_id
      ORDER BY total_sold DESC
      LIMIT ?`,
      values
    );

    return items;
  }

  // Lấy thống kê doanh thu theo sản phẩm
  async getRevenueByProduct(params = {}) {
    const {
      page = 1,
      limit = 10,
      fromDate,
      toDate,
      sortBy = 'total_revenue',
      sortOrder = 'DESC'
    } = params;

    let dateCondition = '';
    let values = [];

    if (fromDate && toDate) {
      dateCondition = 'AND o.created_at BETWEEN ? AND ?';
      values.push(fromDate, toDate);
    } else if (fromDate) {
      dateCondition = 'AND o.created_at >= ?';
      values.push(fromDate);
    } else if (toDate) {
      dateCondition = 'AND o.created_at <= ?';
      values.push(toDate);
    }

    const offset = (page - 1) * limit;
    values.push(limit, offset);

    const [items] = await db.query(
      `SELECT 
        oi.variant_id,
        oi.product_name,
        oi.variant_name,
        oi.sku,
        SUM(oi.quantity) as total_quantity,
        SUM(oi.subtotal) as total_revenue,
        SUM(oi.discount_amount) as total_discount,
        COUNT(DISTINCT oi.order_id) as order_count,
        AVG(oi.unit_price) as avg_unit_price,
        MIN(oi.unit_price) as min_price,
        MAX(oi.unit_price) as max_price
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.order_id
      WHERE o.order_status IN ('delivered', 'shipping', 'processing')
      ${dateCondition}
      GROUP BY oi.variant_id
      ORDER BY ${sortBy} ${sortOrder}
      LIMIT ? OFFSET ?`,
      values
    );

    const countValues = values.slice(0, -2); // Remove limit and offset
    const [count] = await db.query(
      `SELECT COUNT(DISTINCT oi.variant_id) as total
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.order_id
      WHERE o.order_status IN ('delivered', 'shipping', 'processing')
      ${dateCondition}`,
      countValues
    );

    return {
      data: items,
      pagination: {
        total: count[0].total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count[0].total / limit)
      }
    };
  }

  // Kiểm tra sản phẩm đã được mua bởi user chưa
  async isPurchasedByUser(userId, variantId) {
    const [result] = await db.query(
      `SELECT COUNT(*) as count
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.order_id
      WHERE o.user_id = ? 
        AND oi.variant_id = ?
        AND o.order_status IN ('delivered', 'shipping')`,
      [userId, variantId]
    );
    return result[0].count > 0;
  }

  // Lấy danh sách sản phẩm user đã mua
  async getUserPurchasedProducts(userId, params = {}) {
    const {
      page = 1,
      limit = 10
    } = params;

    const offset = (page - 1) * limit;

    const [items] = await db.query(
      `SELECT DISTINCT
        oi.variant_id,
        oi.product_name,
        oi.variant_name,
        oi.sku,
        pv.image_url,
        pv.current_price,
        MAX(o.created_at) as last_purchased
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.order_id
      LEFT JOIN product_variants pv ON oi.variant_id = pv.variant_id
      WHERE o.user_id = ?
        AND o.order_status IN ('delivered', 'shipping')
      GROUP BY oi.variant_id
      ORDER BY last_purchased DESC
      LIMIT ? OFFSET ?`,
      [userId, limit, offset]
    );

    const [count] = await db.query(
      `SELECT COUNT(DISTINCT oi.variant_id) as total
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.order_id
      WHERE o.user_id = ?
        AND o.order_status IN ('delivered', 'shipping')`,
      [userId]
    );

    return {
      data: items,
      pagination: {
        total: count[0].total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count[0].total / limit)
      }
    };
  }
}

export default new OrderItem();
