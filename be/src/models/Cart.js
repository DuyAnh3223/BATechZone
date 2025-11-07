import { db } from '../libs/db.js';

class Cart {
  // Tạo giỏ hàng mới
  async create(cartData) {
    const [result] = await db.query(
      `INSERT INTO carts (
        user_id, session_id, expires_at
      ) VALUES (?, ?, ?)`,
      [
        cartData.userId,
        cartData.sessionId || null,
        cartData.expiresAt || null
      ]
    );
    return result.insertId;
  }

  // Lấy giỏ hàng theo ID
  async getById(cartId) {
    const [carts] = await db.query(
      `SELECT * FROM carts WHERE cart_id = ?`,
      [cartId]
    );
    return carts[0];
  }

  // Lấy giỏ hàng theo user ID
  async getByUserId(userId) {
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

  // Lấy giỏ hàng theo session ID (cho guest user)
  async getBySessionId(sessionId) {
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

  // Lấy hoặc tạo giỏ hàng cho user
  async getOrCreate(userId, sessionId = null) {
    // Thử lấy giỏ hàng hiện có
    let cart = userId 
      ? await this.getByUserId(userId)
      : await this.getBySessionId(sessionId);

    // Nếu không có, tạo mới
    if (!cart) {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30); // Hết hạn sau 30 ngày

      const cartId = await this.create({
        userId,
        sessionId,
        expiresAt
      });

      cart = await this.getById(cartId);
    }

    return cart;
  }

  // Lấy giỏ hàng với đầy đủ thông tin items
  async getCartWithItems(cartId) {
    const [carts] = await db.query(
      `SELECT * FROM carts WHERE cart_id = ?`,
      [cartId]
    );

    if (carts.length === 0) return null;

    const cart = carts[0];

    // Lấy items riêng
    const [items] = await db.query(
      `SELECT 
        ci.cart_item_id as cartItemId,
        ci.variant_id as variantId,
        ci.quantity,
        p.product_name as productName,
        pv.variant_name as variantName,
        pv.current_price as currentPrice,
        pv.original_price as originalPrice,
        pv.image_url as imageUrl,
        pv.stock_quantity as stockQuantity,
        pv.sku,
        pv.is_active as isActive,
        ci.added_at as addedAt
      FROM cart_items ci
      JOIN product_variants pv ON ci.variant_id = pv.variant_id
      JOIN products p ON pv.product_id = p.product_id
      WHERE ci.cart_id = ?`,
      [cartId]
    );
    
    cart.items = items;
    return cart;
  }

  // Cập nhật thời gian hết hạn
  async updateExpiry(cartId, expiresAt) {
    const [result] = await db.query(
      `UPDATE carts SET expires_at = ? WHERE cart_id = ?`,
      [expiresAt, cartId]
    );
    return result.affectedRows > 0;
  }

  // Gán giỏ hàng guest cho user khi đăng nhập
  async assignToUser(sessionId, userId) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // Lấy giỏ hàng guest
      const guestCart = await this.getBySessionId(sessionId);
      if (!guestCart) {
        await conn.commit();
        return null;
      }

      // Kiểm tra user đã có giỏ hàng chưa
      const userCart = await this.getByUserId(userId);

      if (userCart) {
        // Merge items từ guest cart vào user cart
        await conn.query(
          `INSERT INTO cart_items (cart_id, variant_id, quantity)
          SELECT ?, variant_id, quantity
          FROM cart_items
          WHERE cart_id = ?
          ON DUPLICATE KEY UPDATE
            quantity = quantity + VALUES(quantity)`,
          [userCart.cart_id, guestCart.cart_id]
        );

        // Xóa guest cart
        await conn.query('DELETE FROM cart_items WHERE cart_id = ?', [guestCart.cart_id]);
        await conn.query('DELETE FROM carts WHERE cart_id = ?', [guestCart.cart_id]);

        await conn.commit();
        return userCart.cart_id;
      } else {
        // Gán guest cart cho user
        await conn.query(
          `UPDATE carts SET user_id = ?, session_id = NULL WHERE cart_id = ?`,
          [userId, guestCart.cart_id]
        );

        await conn.commit();
        return guestCart.cart_id;
      }
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      await conn.release();
    }
  }

  // Xóa giỏ hàng
  async delete(cartId) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // Xóa items trước
      await conn.query('DELETE FROM cart_items WHERE cart_id = ?', [cartId]);
      
      // Xóa cart
      const [result] = await conn.query('DELETE FROM carts WHERE cart_id = ?', [cartId]);

      await conn.commit();
      return result.affectedRows > 0;
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      await conn.release();
    }
  }

  // Xóa giỏ hàng đã hết hạn
  async deleteExpired() {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // Lấy danh sách cart đã hết hạn
      const [expiredCarts] = await conn.query(
        'SELECT cart_id FROM carts WHERE expires_at < NOW()'
      );

      if (expiredCarts.length > 0) {
        const cartIds = expiredCarts.map(c => c.cart_id);
        
        // Xóa items
        await conn.query('DELETE FROM cart_items WHERE cart_id IN (?)', [cartIds]);
        
        // Xóa carts
        await conn.query('DELETE FROM carts WHERE cart_id IN (?)', [cartIds]);
      }

      await conn.commit();
      return expiredCarts.length;
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      await conn.release();
    }
  }

  // Làm trống giỏ hàng (xóa tất cả items)
  async clear(cartId) {
    const [result] = await db.query(
      'DELETE FROM cart_items WHERE cart_id = ?',
      [cartId]
    );
    return result.affectedRows;
  }

  // Tính tổng giá trị giỏ hàng
  async calculateTotal(cartId) {
    const [result] = await db.query(
      `SELECT 
        SUM(ci.quantity * pv.current_price) as subtotal,
        SUM(ci.quantity * (pv.original_price - pv.current_price)) as total_savings,
        SUM(ci.quantity) as total_items,
        COUNT(DISTINCT ci.variant_id) as unique_items
      FROM cart_items ci
      JOIN product_variants pv ON ci.variant_id = pv.variant_id
      WHERE ci.cart_id = ?`,
      [cartId]
    );

    return {
      subtotal: result[0].subtotal || 0,
      totalSavings: result[0].total_savings || 0,
      totalItems: result[0].total_items || 0,
      uniqueItems: result[0].unique_items || 0
    };
  }

  // Kiểm tra tồn kho cho tất cả items trong giỏ
  async checkStock(cartId) {
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

    return {
      allInStock: items.every(item => item.in_stock),
      items
    };
  }
}

export default new Cart();
