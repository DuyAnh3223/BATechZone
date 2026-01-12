import { db } from '../libs/db.js';
import { query } from '../libs/db.js';

/**
 * Cart DAO - Data Access Layer
 * Theo DAO RULES: Chỉ SQL, không if nghiệp vụ, 1 function = 1 query
 */
class CartDAO {
  /**
   * Tạo giỏ hàng mới
   */
  async create(cartData) {
    const [result] = await db.query(
      `INSERT INTO carts (
        user_id, session_id, expires_at
      ) VALUES (?, ?, ?)`,
      [
        cartData.userId || null,
        cartData.sessionId || null,
        cartData.expiresAt || null
      ]
    );
    return result.insertId;
  }

  /**
   * Lấy giỏ hàng theo ID
   */
  async findById(cartId) {
    const [carts] = await db.query(
      `SELECT * FROM carts WHERE cart_id = ?`,
      [cartId]
    );
    return carts[0];
  }

  /**
   * Lấy giỏ hàng theo user ID
   */
  async findByUserId(userId) {
    const [carts] = await db.query(
      `SELECT c.*,
        (SELECT COUNT(*) FROM cart_items WHERE cart_id = c.cart_id) as item_count,
        (SELECT SUM(ci.quantity) FROM cart_items ci WHERE ci.cart_id = c.cart_id) as total_quantity
      FROM carts c
      WHERE c.user_id = ?
      ORDER BY c.created_at DESC
      LIMIT 1`,
      [userId]
    );
    return carts[0];
  }

  /**
   * Lấy giỏ hàng theo session ID (cho guest user)
   */
  async findBySessionId(sessionId) {
    const [carts] = await db.query(
      `SELECT c.*,
        (SELECT COUNT(*) FROM cart_items WHERE cart_id = c.cart_id) as item_count,
        (SELECT SUM(ci.quantity) FROM cart_items ci WHERE ci.cart_id = c.cart_id) as total_quantity
      FROM carts c
      WHERE c.session_id = ?
      ORDER BY c.created_at DESC
      LIMIT 1`,
      [sessionId]
    );
    return carts[0];
  }

  /**
   * Lấy giỏ hàng với đầy đủ thông tin items
   */
  async findWithItems(cartId) {
    const [carts] = await db.query(
      `SELECT * FROM carts WHERE cart_id = ?`,
      [cartId]
    );
    return carts[0];
  }

  /**
   * Lấy items của giỏ hàng với thông tin variant
   */
  async getCartItems(cartId) {
    const [items] = await db.query(
      `SELECT 
        ci.cart_item_id as cartItemId,
        ci.variant_id as variantId,
        ci.quantity,
        ci.price as cartPrice,
        p.product_name as productName,
        pv.variant_name as variantName,
        pv.price as currentPrice,
        pv.discount_percent as discountPercent,
        pv.discount_start_date as discountStartDate,
        pv.discount_end_date as discountEndDate,
        pv.stock_quantity as stockQuantity,
        pv.sku,
        pv.is_active as isActive,
        vi.image_url as imageUrl,
        ci.added_at as addedAt
      FROM cart_items ci
      JOIN product_variants pv ON ci.variant_id = pv.variant_id
      JOIN products p ON pv.product_id = p.product_id
      LEFT JOIN variant_images vi ON pv.variant_id = vi.variant_id AND vi.is_primary = 1
      WHERE ci.cart_id = ?`,
      [cartId]
    );
    return items;
  }

  /**
   * Cập nhật thời gian hết hạn
   */
  async updateExpiry(cartId, expiresAt) {
    const [result] = await db.query(
      `UPDATE carts SET expires_at = ? WHERE cart_id = ?`,
      [expiresAt, cartId]
    );
    return result.affectedRows > 0;
  }

  /**
   * Cập nhật user_id cho giỏ hàng
   */
  async updateUserId(cartId, userId) {
    const [result] = await db.query(
      `UPDATE carts SET user_id = ?, session_id = NULL WHERE cart_id = ?`,
      [userId, cartId]
    );
    return result.affectedRows > 0;
  }

  /**
   * Xóa giỏ hàng
   */
  async delete(cartId) {
    const [result] = await db.query(
      'DELETE FROM carts WHERE cart_id = ?',
      [cartId]
    );
    return result.affectedRows > 0;
  }

  /**
   * Xóa tất cả items của giỏ hàng
   */
  async deleteAllItems(cartId) {
    const [result] = await db.query(
      'DELETE FROM cart_items WHERE cart_id = ?',
      [cartId]
    );
    return result.affectedRows;
  }

  /**
   * Xóa giỏ hàng đã hết hạn
   */
  async deleteExpired() {
    const [result] = await db.query(
      'DELETE FROM carts WHERE expires_at < NOW()'
    );
    return result.affectedRows;
  }

  /**
   * Xóa items của giỏ hàng đã hết hạn
   */
  async deleteExpiredItems() {
    const [result] = await db.query(
      `DELETE ci FROM cart_items ci
      JOIN carts c ON ci.cart_id = c.cart_id
      WHERE c.expires_at < NOW()`
    );
    return result.affectedRows;
  }

  /**
   * Tính tổng giá trị giỏ hàng
   */
  async calculateTotal(cartId) {
    const [result] = await db.query(
      `SELECT 
        SUM(ci.quantity * ci.price) as subtotal,
        SUM(ci.quantity) as total_items,
        COUNT(DISTINCT ci.variant_id) as unique_items
      FROM cart_items ci
      WHERE ci.cart_id = ?`,
      [cartId]
    );

    return result[0];
  }

  /**
   * Kiểm tra tồn kho cho tất cả items trong giỏ
   */
  async getStockInfo(cartId) {
    const [items] = await db.query(
      `SELECT 
        ci.cart_item_id,
        ci.variant_id,
        ci.quantity as requested_quantity,
        pv.stock_quantity,
        pv.variant_name,
        p.product_name,
        CASE 
          WHEN pv.stock_quantity >= ci.quantity THEN true
          ELSE false
        END as in_stock
      FROM cart_items ci
      JOIN product_variants pv ON ci.variant_id = pv.variant_id
      JOIN products p ON pv.product_id = p.product_id
      WHERE ci.cart_id = ?`,
      [cartId]
    );

    return items;
  }
}

export default new CartDAO();
