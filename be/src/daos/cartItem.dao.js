import { db } from '../libs/db.js';
import { query } from '../libs/db.js';

/**
 * CartItem DAO - Data Access Layer
 * Theo DAO RULES: Chỉ SQL, không if nghiệp vụ, 1 function = 1 query
 */
class CartItemDAO {
  /**
   * Thêm mới cart item
   */
  async insert(cartId, variantId, quantity, price) {
    const [result] = await db.query(
      `INSERT INTO cart_items (cart_id, variant_id, quantity, price, added_at)
      VALUES (?, ?, ?, ?, NOW())`,
      [cartId, variantId, quantity, price]
    );
    return result.insertId;
  }

  /**
   * Cập nhật số lượng cart item
   */
  async updateQuantity(cartItemId, quantity) {
    const [result] = await db.query(
      `UPDATE cart_items 
      SET quantity = ?, updated_at = NOW()
      WHERE cart_item_id = ?`,
      [quantity, cartItemId]
    );
    return result.affectedRows > 0;
  }

  /**
   * Cập nhật giá cart item
   */
  async updatePrice(cartItemId, price) {
    const [result] = await db.query(
      `UPDATE cart_items 
      SET price = ?, updated_at = NOW()
      WHERE cart_item_id = ?`,
      [price, cartItemId]
    );
    return result.affectedRows > 0;
  }

  /**
   * Cập nhật số lượng và giá
   */
  async updateQuantityAndPrice(cartItemId, quantity, price) {
    const [result] = await db.query(
      `UPDATE cart_items 
      SET quantity = ?, price = ?, updated_at = NOW()
      WHERE cart_item_id = ?`,
      [quantity, price, cartItemId]
    );
    return result.affectedRows > 0;
  }

  /**
   * Tăng số lượng
   */
  async incrementQuantity(cartItemId, amount) {
    const [result] = await db.query(
      `UPDATE cart_items 
      SET quantity = quantity + ?, updated_at = NOW()
      WHERE cart_item_id = ?`,
      [amount, cartItemId]
    );
    return result.affectedRows > 0;
  }

  /**
   * Giảm số lượng
   */
  async decrementQuantity(cartItemId, amount) {
    const [result] = await db.query(
      `UPDATE cart_items 
      SET quantity = quantity - ?, updated_at = NOW()
      WHERE cart_item_id = ? AND quantity >= ?`,
      [amount, cartItemId, amount]
    );
    return result.affectedRows > 0;
  }

  /**
   * Xóa cart item theo ID
   */
  async delete(cartItemId) {
    const [result] = await db.query(
      'DELETE FROM cart_items WHERE cart_item_id = ?',
      [cartItemId]
    );
    return result.affectedRows > 0;
  }

  /**
   * Xóa cart item theo variant và cart
   */
  async deleteByVariant(cartId, variantId) {
    const [result] = await db.query(
      'DELETE FROM cart_items WHERE cart_id = ? AND variant_id = ?',
      [cartId, variantId]
    );
    return result.affectedRows > 0;
  }

  /**
   * Lấy cart item theo ID
   */
  async findById(cartItemId) {
    const [items] = await db.query(
      `SELECT 
        ci.*,
        pv.variant_name,
        pv.sku,
        pv.price as current_price,
        pv.discount_percent,
        pv.discount_start_date,
        pv.discount_end_date,
        pv.stock_quantity,
        pv.is_active,
        p.product_id,
        p.product_name,
        vi.image_url
      FROM cart_items ci
      JOIN product_variants pv ON ci.variant_id = pv.variant_id
      JOIN products p ON pv.product_id = p.product_id
      LEFT JOIN variant_images vi ON pv.variant_id = vi.variant_id AND vi.is_primary = 1
      WHERE ci.cart_item_id = ?`,
      [cartItemId]
    );
    return items[0];
  }

  /**
   * Lấy tất cả items trong giỏ hàng
   */
  async findByCartId(cartId) {
    const [items] = await db.query(
      `SELECT 
        ci.*,
        pv.variant_name,
        pv.sku,
        pv.price as current_price,
        pv.discount_percent,
        pv.discount_start_date,
        pv.discount_end_date,
        pv.stock_quantity,
        pv.is_active,
        p.product_id,
        p.product_name,
        COALESCE(
          (SELECT image_url FROM variant_images WHERE variant_id = pv.variant_id AND is_primary = 1 LIMIT 1),
          (SELECT image_url FROM variant_images WHERE variant_id = pv.variant_id LIMIT 1)
        ) as image_url,
        (ci.quantity * ci.price) as subtotal
      FROM cart_items ci
      JOIN product_variants pv ON ci.variant_id = pv.variant_id
      JOIN products p ON pv.product_id = p.product_id
      WHERE ci.cart_id = ?
      ORDER BY ci.added_at DESC`,
      [cartId]
    );
    return items;
  }

  /**
   * Tìm cart item theo cart và variant
   */
  async findByCartAndVariant(cartId, variantId) {
    const [items] = await db.query(
      `SELECT * FROM cart_items 
      WHERE cart_id = ? AND variant_id = ?`,
      [cartId, variantId]
    );
    return items[0];
  }

  /**
   * Kiểm tra item có trong giỏ không
   */
  async exists(cartId, variantId) {
    const [items] = await db.query(
      'SELECT cart_item_id FROM cart_items WHERE cart_id = ? AND variant_id = ?',
      [cartId, variantId]
    );
    return items.length > 0;
  }

  /**
   * Lấy số lượng của variant trong giỏ
   */
  async getQuantity(cartId, variantId) {
    const [items] = await db.query(
      'SELECT quantity FROM cart_items WHERE cart_id = ? AND variant_id = ?',
      [cartId, variantId]
    );
    return items.length > 0 ? items[0].quantity : 0;
  }

  /**
   * Đếm số lượng items trong giỏ
   */
  async count(cartId) {
    const [result] = await db.query(
      'SELECT COUNT(*) as count FROM cart_items WHERE cart_id = ?',
      [cartId]
    );
    return result[0].count;
  }

  /**
   * Lấy thông tin variant
   */
  async getVariantInfo(variantId) {
    const [variants] = await db.query(
      `SELECT 
        pv.*,
        p.product_name
      FROM product_variants pv
      JOIN products p ON pv.product_id = p.product_id
      WHERE pv.variant_id = ?`,
      [variantId]
    );
    return variants[0];
  }

  /**
   * Xóa các item có variant không còn active hoặc hết hàng
   */
  async removeInvalidItems(cartId) {
    const [result] = await db.query(
      `DELETE ci FROM cart_items ci
      JOIN product_variants pv ON ci.variant_id = pv.variant_id
      WHERE ci.cart_id = ?
        AND (pv.is_active = 0 OR pv.stock_quantity = 0)`,
      [cartId]
    );
    return result.affectedRows;
  }

  /**
   * Cập nhật số lượng items về giới hạn tồn kho
   */
  async adjustToStock(cartId) {
    const [result] = await db.query(
      `UPDATE cart_items ci
      JOIN product_variants pv ON ci.variant_id = pv.variant_id
      SET ci.quantity = LEAST(ci.quantity, pv.stock_quantity)
      WHERE ci.cart_id = ?
        AND ci.quantity > pv.stock_quantity`,
      [cartId]
    );
    return result.affectedRows;
  }

  /**
   * Lấy items với thông tin đầy đủ cho checkout
   */
  async getItemsForCheckout(cartId) {
    const [items] = await db.query(
      `SELECT 
        ci.cart_item_id,
        ci.variant_id,
        ci.quantity,
        ci.price as cart_price,
        pv.variant_name,
        pv.sku,
        pv.price as current_price,
        pv.discount_percent,
        pv.discount_start_date,
        pv.discount_end_date,
        pv.stock_quantity,
        pv.is_active,
        pv.weight,
        p.product_id,
        p.product_name,
        COALESCE(
          (SELECT image_url FROM variant_images WHERE variant_id = pv.variant_id AND is_primary = 1 LIMIT 1),
          (SELECT image_url FROM variant_images WHERE variant_id = pv.variant_id LIMIT 1)
        ) as image_url
      FROM cart_items ci
      JOIN product_variants pv ON ci.variant_id = pv.variant_id
      JOIN products p ON pv.product_id = p.product_id
      WHERE ci.cart_id = ?
        AND pv.is_active = 1
        AND pv.stock_quantity > 0
      ORDER BY ci.added_at DESC`,
      [cartId]
    );
    return items;
  }

  /**
   * Bulk insert items
   */
  async bulkInsert(items) {
    if (!items || items.length === 0) return 0;

    const values = items.map(item => [
      item.cartId,
      item.variantId,
      item.quantity,
      item.price
    ]);

    const [result] = await db.query(
      `INSERT INTO cart_items (cart_id, variant_id, quantity, price, added_at)
      VALUES ?`,
      [values]
    );
    return result.affectedRows;
  }

  /**
   * Chuyển items từ cart này sang cart khác
   */
  async transferItems(fromCartId, toCartId) {
    const [result] = await db.query(
      `UPDATE cart_items 
      SET cart_id = ?
      WHERE cart_id = ?`,
      [toCartId, fromCartId]
    );
    return result.affectedRows;
  }

  /**
   * Lấy tất cả cart items của một cart kèm theo variant info
   */
  async findAllWithVariantInfo(cartId) {
    const [items] = await db.query(
      `SELECT 
        ci.*,
        pv.price as current_price,
        pv.discount_percent,
        pv.discount_start_date,
        pv.discount_end_date,
        pv.stock_quantity,
        pv.is_active
      FROM cart_items ci
      JOIN product_variants pv ON ci.variant_id = pv.variant_id
      WHERE ci.cart_id = ?`,
      [cartId]
    );
    return items;
  }
}

export default new CartItemDAO();
