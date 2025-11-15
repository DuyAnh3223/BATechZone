import { db } from '../libs/db.js';

class CartItem {
  // Thêm sản phẩm vào giỏ hàng
  async add(cartId, variantId, quantity = 1) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // Kiểm tra variant có tồn tại và còn hàng không
      const [variants] = await conn.query(
        'SELECT stock_quantity, is_active FROM product_variants WHERE variant_id = ?',
        [variantId]
      );

      if (variants.length === 0) {
        throw new Error('Sản phẩm không tồn tại');
      }

      if (!variants[0].is_active) {
        throw new Error('Sản phẩm không còn kinh doanh');
      }

      if (variants[0].stock_quantity < quantity) {
        throw new Error('Số lượng vượt quá tồn kho');
      }

      // Kiểm tra item đã có trong giỏ chưa
      const [existing] = await conn.query(
        'SELECT cart_item_id, quantity FROM cart_items WHERE cart_id = ? AND variant_id = ?',
        [cartId, variantId]
      );

      let result;
      if (existing.length > 0) {
        // Cập nhật số lượng
        const newQuantity = existing[0].quantity + quantity;
        
        if (variants[0].stock_quantity < newQuantity) {
          throw new Error('Số lượng vượt quá tồn kho');
        }

        await conn.query(
          'UPDATE cart_items SET quantity = ?, updated_at = NOW() WHERE cart_item_id = ?',
          [newQuantity, existing[0].cart_item_id]
        );
        result = { cartItemId: existing[0].cart_item_id, updated: true };
      } else {
        // Thêm mới
        const [insertResult] = await conn.query(
          'INSERT INTO cart_items (cart_id, variant_id, quantity) VALUES (?, ?, ?)',
          [cartId, variantId, quantity]
        );
        result = { cartItemId: insertResult.insertId, updated: false };
      }

      await conn.commit();
      return result;
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      await conn.release();
    }
  }

  // Cập nhật số lượng
  async updateQuantity(cartItemId, quantity) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // Lấy thông tin item và kiểm tra tồn kho
      const [items] = await conn.query(
        `SELECT ci.variant_id, pv.stock_quantity
        FROM cart_items ci
        JOIN product_variants pv ON ci.variant_id = pv.variant_id
        WHERE ci.cart_item_id = ?`,
        [cartItemId]
      );

      if (items.length === 0) {
        throw new Error('Item không tồn tại trong giỏ hàng');
      }

      if (items[0].stock_quantity < quantity) {
        throw new Error('Số lượng vượt quá tồn kho');
      }

      // Cập nhật
      const [result] = await conn.query(
        'UPDATE cart_items SET quantity = ?, updated_at = NOW() WHERE cart_item_id = ?',
        [quantity, cartItemId]
      );

      await conn.commit();
      return result.affectedRows > 0;
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      await conn.release();
    }
  }

  // Xóa item khỏi giỏ hàng
  async remove(cartItemId) {
    const [result] = await db.query(
      'DELETE FROM cart_items WHERE cart_item_id = ?',
      [cartItemId]
    );
    return result.affectedRows > 0;
  }

  // Xóa item theo variant và cart
  async removeByVariant(cartId, variantId) {
    const [result] = await db.query(
      'DELETE FROM cart_items WHERE cart_id = ? AND variant_id = ?',
      [cartId, variantId]
    );
    return result.affectedRows > 0;
  }

  // Lấy item theo ID
  async getById(cartItemId) {
    const [items] = await db.query(
      `SELECT 
        ci.*,
        pv.variant_name,
        pv.sku,
        pv.stock_quantity,
        pv.is_active,
        p.product_id,
        p.product_name
      FROM cart_items ci
      JOIN product_variants pv ON ci.variant_id = pv.variant_id
      JOIN products p ON pv.product_id = p.product_id
      WHERE ci.cart_item_id = ?`,
      [cartItemId]
    );
    return items[0];
  }

  // Lấy tất cả items trong giỏ hàng
  async getByCartId(cartId) {
    const [items] = await db.query(
      `SELECT 
        ci.*,
        pv.variant_name,
        pv.sku,
        pv.price,
        pv.stock_quantity,
        pv.is_active,
        p.product_id,
        p.product_name,
        (ci.quantity * pv.price) as subtotal
      FROM cart_items ci
      JOIN product_variants pv ON ci.variant_id = pv.variant_id
      JOIN products p ON pv.product_id = p.product_id
      WHERE ci.cart_id = ?
      ORDER BY ci.added_at DESC`,
      [cartId]
    );
    return items;
  }

  // Kiểm tra item có trong giỏ không
  async exists(cartId, variantId) {
    const [items] = await db.query(
      'SELECT cart_item_id FROM cart_items WHERE cart_id = ? AND variant_id = ?',
      [cartId, variantId]
    );
    return items.length > 0;
  }

  // Lấy số lượng của variant trong giỏ
  async getQuantity(cartId, variantId) {
    const [items] = await db.query(
      'SELECT quantity FROM cart_items WHERE cart_id = ? AND variant_id = ?',
      [cartId, variantId]
    );
    return items.length > 0 ? items[0].quantity : 0;
  }

  // Đếm số lượng items trong giỏ
  async count(cartId) {
    const [result] = await db.query(
      'SELECT COUNT(*) as count FROM cart_items WHERE cart_id = ?',
      [cartId]
    );
    return result[0].count;
  }

  // Tăng số lượng
  async increment(cartItemId, amount = 1) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // Lấy số lượng hiện tại và kiểm tra tồn kho
      const [items] = await conn.query(
        `SELECT ci.quantity, pv.stock_quantity
        FROM cart_items ci
        JOIN product_variants pv ON ci.variant_id = pv.variant_id
        WHERE ci.cart_item_id = ?`,
        [cartItemId]
      );

      if (items.length === 0) {
        throw new Error('Item không tồn tại');
      }

      const newQuantity = items[0].quantity + amount;

      if (newQuantity > items[0].stock_quantity) {
        throw new Error('Số lượng vượt quá tồn kho');
      }

      await conn.query(
        'UPDATE cart_items SET quantity = ?, updated_at = NOW() WHERE cart_item_id = ?',
        [newQuantity, cartItemId]
      );

      await conn.commit();
      return true;
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      await conn.release();
    }
  }

  // Giảm số lượng
  async decrement(cartItemId, amount = 1) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      const [items] = await conn.query(
        'SELECT quantity FROM cart_items WHERE cart_item_id = ?',
        [cartItemId]
      );

      if (items.length === 0) {
        throw new Error('Item không tồn tại');
      }

      const newQuantity = items[0].quantity - amount;

      if (newQuantity <= 0) {
        // Xóa item nếu số lượng <= 0
        await conn.query('DELETE FROM cart_items WHERE cart_item_id = ?', [cartItemId]);
      } else {
        await conn.query(
          'UPDATE cart_items SET quantity = ?, updated_at = NOW() WHERE cart_item_id = ?',
          [newQuantity, cartItemId]
        );
      }

      await conn.commit();
      return true;
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      await conn.release();
    }
  }

  // Xóa các item có variant không còn active hoặc hết hàng
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

  // Cập nhật số lượng items về giới hạn tồn kho
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

  // Lấy items với thông tin đầy đủ (cho checkout)
  async getItemsForCheckout(cartId) {
    const [items] = await db.query(
      `SELECT 
        ci.cart_item_id,
        ci.variant_id,
        ci.quantity,
        pv.variant_name,
        pv.sku,
        pv.current_price,
        pv.original_price,
        pv.image_url,
        pv.stock_quantity,
        pv.weight,
        p.product_id,
        p.product_name,
        c.category_name,
        (ci.quantity * pv.current_price) as subtotal,
        (ci.quantity * (pv.original_price - pv.current_price)) as savings,
        CASE 
          WHEN pv.is_active = 0 THEN 'inactive'
          WHEN pv.stock_quantity = 0 THEN 'out_of_stock'
          WHEN pv.stock_quantity < ci.quantity THEN 'insufficient_stock'
          ELSE 'available'
        END as availability_status
      FROM cart_items ci
      JOIN product_variants pv ON ci.variant_id = pv.variant_id
      JOIN products p ON pv.product_id = p.product_id
      LEFT JOIN categories c ON p.category_id = c.category_id
      WHERE ci.cart_id = ?
      ORDER BY ci.added_at ASC`,
      [cartId]
    );
    return items;
  }

  // Bulk add items (thêm nhiều items cùng lúc)
  async bulkAdd(cartId, items) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      for (const item of items) {
        await this.add(cartId, item.variantId, item.quantity);
      }

      await conn.commit();
      return true;
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      await conn.release();
    }
  }

  // Chuyển items từ cart này sang cart khác
  async transferItems(fromCartId, toCartId) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // Lấy items từ cart nguồn
      const [items] = await conn.query(
        'SELECT variant_id, quantity FROM cart_items WHERE cart_id = ?',
        [fromCartId]
      );

      // Thêm vào cart đích
      for (const item of items) {
        await conn.query(
          `INSERT INTO cart_items (cart_id, variant_id, quantity)
          VALUES (?, ?, ?)
          ON DUPLICATE KEY UPDATE
            quantity = quantity + VALUES(quantity)`,
          [toCartId, item.variant_id, item.quantity]
        );
      }

      // Xóa items từ cart nguồn
      await conn.query('DELETE FROM cart_items WHERE cart_id = ?', [fromCartId]);

      await conn.commit();
      return items.length;
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      await conn.release();
    }
  }
}

export default new CartItem();
