import cartDAO from '../daos/cart.dao.js';
import cartItemDAO from '../daos/cartItem.dao.js';
import { db } from '../libs/db.js';

/**
 * Service cho Cart - Xử lý business logic
 * Theo SERVICE RULES: Business logic, gọi DAO, quản lý transaction, throw Error
 */
class CartService {
  /**
   * Lấy hoặc tạo giỏ hàng cho user hoặc guest
   */
  async getOrCreate(userId, sessionId = null) {
    // Validate input
    if (!userId && !sessionId) {
      throw new Error('Phải cung cấp userId hoặc sessionId');
    }

    // Thử lấy giỏ hàng hiện có
    let cart = userId 
      ? await cartDAO.findByUserId(userId)
      : await cartDAO.findBySessionId(sessionId);

    // Nếu không có, tạo mới
    if (!cart) {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30); // Hết hạn sau 30 ngày

      const cartId = await cartDAO.create({
        userId,
        sessionId,
        expiresAt
      });

      cart = await cartDAO.findById(cartId);
    }

    return cart;
  }

  /**
   * Lấy giỏ hàng theo ID
   */
  async getById(cartId) {
    const cart = await cartDAO.findById(cartId);
    if (!cart) {
      throw new Error('Không tìm thấy giỏ hàng');
    }
    return cart;
  }

  /**
   * Lấy giỏ hàng theo user ID
   */
  async getByUserId(userId) {
    const cart = await cartDAO.findByUserId(userId);
    if (!cart) {
      throw new Error('Không tìm thấy giỏ hàng');
    }
    return cart;
  }

  /**
   * Lấy giỏ hàng theo session ID
   */
  async getBySessionId(sessionId) {
    const cart = await cartDAO.findBySessionId(sessionId);
    if (!cart) {
      throw new Error('Không tìm thấy giỏ hàng');
    }
    return cart;
  }

  /**
   * Lấy giỏ hàng với đầy đủ thông tin items
   */
  async getCartWithItems(cartId) {
    const cart = await cartDAO.findWithItems(cartId);
    
    if (!cart) {
      throw new Error('Không tìm thấy giỏ hàng');
    }

    // Lấy items riêng
    const items = await cartDAO.getCartItems(cartId);
    cart.items = items;

    return cart;
  }

  /**
   * Gán giỏ hàng guest cho user khi đăng nhập
   */
  async assignToUser(sessionId, userId) {
    if (!sessionId || !userId) {
      throw new Error('Thiếu sessionId hoặc userId');
    }

    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // Lấy giỏ hàng guest
      const guestCart = await cartDAO.findBySessionId(sessionId);
      if (!guestCart) {
        await conn.rollback();
        throw new Error('Không tìm thấy giỏ hàng guest');
      }

      // Kiểm tra user đã có giỏ hàng chưa
      const userCart = await cartDAO.findByUserId(userId);

      if (userCart) {
        // Chuyển items từ guest cart sang user cart
        await cartItemDAO.transferItems(guestCart.cart_id, userCart.cart_id);
        
        // Xóa guest cart
        await cartDAO.delete(guestCart.cart_id);
        
        await conn.commit();
        return userCart.cart_id;
      } else {
        // Gán guest cart cho user
        await cartDAO.updateUserId(guestCart.cart_id, userId);
        
        await conn.commit();
        return guestCart.cart_id;
      }
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }

  /**
   * Cập nhật thời gian hết hạn
   */
  async updateExpiry(cartId, expiresAt) {
    if (!expiresAt) {
      throw new Error('Thiếu thời gian hết hạn');
    }

    const success = await cartDAO.updateExpiry(cartId, expiresAt);
    
    if (!success) {
      throw new Error('Không tìm thấy giỏ hàng');
    }

    return true;
  }

  /**
   * Xóa giỏ hàng
   */
  async delete(cartId) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // Xóa items trước
      await cartDAO.deleteAllItems(cartId);

      // Xóa cart
      const success = await cartDAO.delete(cartId);

      if (!success) {
        await conn.rollback();
        throw new Error('Không tìm thấy giỏ hàng');
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

  /**
   * Xóa giỏ hàng đã hết hạn
   */
  async deleteExpired() {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // Xóa items của cart đã hết hạn trước
      await cartDAO.deleteExpiredItems();

      // Xóa carts đã hết hạn
      const deletedCount = await cartDAO.deleteExpired();

      await conn.commit();
      return deletedCount;
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }

  /**
   * Làm trống giỏ hàng
   */
  async clear(cartId) {
    const deletedCount = await cartDAO.deleteAllItems(cartId);
    return deletedCount;
  }

  /**
   * Tính tổng giá trị giỏ hàng
   */
  async calculateTotal(cartId) {
    const result = await cartDAO.calculateTotal(cartId);
    
    return {
      subtotal: result.subtotal || 0,
      totalItems: result.total_items || 0,
      uniqueItems: result.unique_items || 0
    };
  }

  /**
   * Kiểm tra tồn kho cho tất cả items trong giỏ
   */
  async checkStock(cartId) {
    const items = await cartDAO.getStockInfo(cartId);

    return {
      allInStock: items.every(item => item.in_stock),
      items
    };
  }
}

export default new CartService();
