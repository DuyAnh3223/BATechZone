import cartItemDAO from '../daos/cartItem.dao.js';
import { db } from '../libs/db.js';

/**
 * Service cho CartItem - Xử lý business logic
 * Theo SERVICE RULES: Business logic, gọi DAO, quản lý transaction, throw Error
 */
class CartItemService {
  /**
   * Tính giá cuối cùng dựa trên discount
   * Business logic: Kiểm tra thời gian discount và tính giá
   */
  calculateDiscountedPrice(currentPrice, discountPercent, discountStartDate, discountEndDate) {
    const now = new Date();
    
    // Kiểm tra discount có active không
    const isDiscountActive = 
      discountPercent > 0 && 
      (!discountStartDate || now >= new Date(discountStartDate)) &&
      (!discountEndDate || now <= new Date(discountEndDate));
    
    if (isDiscountActive) {
      return currentPrice * (1 - discountPercent / 100);
    }
    
    return currentPrice;
  }

  /**
   * Thêm sản phẩm vào giỏ hàng
   * Business logic: Kiểm tra tồn kho, tính giá discount, merge nếu đã tồn tại
   */
  async add(cartId, variantId, quantity = 1) {
    if (!cartId || !variantId) {
      throw new Error('Thiếu cartId hoặc variantId');
    }

    if (quantity < 1) {
      throw new Error('Số lượng phải lớn hơn 0');
    }

    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // Lấy thông tin variant để kiểm tra và tính giá
      const variant = await cartItemDAO.getVariantInfo(variantId);
      
      if (!variant) {
        await conn.rollback();
        throw new Error('Không tìm thấy sản phẩm');
      }

      // Kiểm tra variant có active không
      if (!variant.is_active) {
        await conn.rollback();
        throw new Error('Sản phẩm không còn kinh doanh');
      }

      // Kiểm tra tồn kho - Bundle dùng available_stock (stock động), variant thường dùng stock_quantity
      const currentStock = variant.variant_type === 'bundle' 
        ? (variant.available_stock ?? 0)
        : (variant.stock_quantity ?? 0);
      
      console.log('=== BACKEND ADD TO CART - STOCK CHECK ===');
      console.log('Variant ID:', variantId);
      console.log('Variant type:', variant.variant_type);
      console.log('Available stock:', currentStock);
      console.log('Requested quantity:', quantity);
      
      if (currentStock < quantity) {
        await conn.rollback();
        throw new Error(`Chỉ còn ${currentStock} sản phẩm trong kho`);
      }

      // Tính giá discount
      const finalPrice = this.calculateDiscountedPrice(
        variant.price,
        variant.discount_percent,
        variant.discount_start_date,
        variant.discount_end_date
      );

      // Kiểm tra item đã có trong giỏ chưa
      const existingItem = await cartItemDAO.findByCartAndVariant(cartId, variantId);

      if (existingItem) {
        // Cập nhật số lượng và giá
        const newQuantity = existingItem.quantity + quantity;
        
        // Kiểm tra tồn kho cho số lượng mới - Bundle dùng available_stock
        const currentStock = variant.variant_type === 'bundle' 
          ? (variant.available_stock ?? 0)
          : (variant.stock_quantity ?? 0);
        
        if (currentStock < newQuantity) {
          await conn.rollback();
          throw new Error(`Chỉ còn ${currentStock} sản phẩm trong kho`);
        }

        await cartItemDAO.updateQuantityAndPrice(
          existingItem.cart_item_id,
          newQuantity,
          finalPrice
        );

        await conn.commit();
        return {
          updated: true,
          cartItemId: existingItem.cart_item_id,
          quantity: newQuantity,
          price: finalPrice
        };
      } else {
        // Thêm mới
        const cartItemId = await cartItemDAO.insert(cartId, variantId, quantity, finalPrice);

        await conn.commit();
        return {
          updated: false,
          cartItemId,
          quantity,
          price: finalPrice
        };
      }
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }

  /**
   * Cập nhật số lượng
   */
  async updateQuantity(cartItemId, quantity) {
    if (quantity < 1) {
      throw new Error('Số lượng phải lớn hơn 0');
    }

    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // Lấy thông tin cart item
      const cartItem = await cartItemDAO.findById(cartItemId);
      
      if (!cartItem) {
        await conn.rollback();
        throw new Error('Không tìm thấy sản phẩm trong giỏ hàng');
      }

      // Kiểm tra tồn kho - Bundle dùng available_stock, variant thường dùng stock_quantity
      const currentStock = cartItem.variant_type === 'bundle'
        ? (cartItem.available_stock ?? 0)
        : (cartItem.stock_quantity ?? 0);
      
      if (currentStock < quantity) {
        await conn.rollback();
        throw new Error(`Chỉ còn ${currentStock} sản phẩm trong kho`);
      }

      // Cập nhật số lượng
      const success = await cartItemDAO.updateQuantity(cartItemId, quantity);

      if (!success) {
        await conn.rollback();
        throw new Error('Cập nhật số lượng thất bại');
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
   * Xóa item khỏi giỏ hàng
   */
  async remove(cartItemId) {
    const success = await cartItemDAO.delete(cartItemId);
    
    if (!success) {
      throw new Error('Không tìm thấy sản phẩm trong giỏ hàng');
    }

    return true;
  }

  /**
   * Xóa item theo variant và cart
   */
  async removeByVariant(cartId, variantId) {
    const success = await cartItemDAO.deleteByVariant(cartId, variantId);
    
    if (!success) {
      throw new Error('Không tìm thấy sản phẩm trong giỏ hàng');
    }

    return true;
  }

  /**
   * Lấy item theo ID
   */
  async getById(cartItemId) {
    const item = await cartItemDAO.findById(cartItemId);
    
    if (!item) {
      throw new Error('Không tìm thấy sản phẩm trong giỏ hàng');
    }

    return item;
  }

  /**
   * Lấy tất cả items trong giỏ hàng
   */
  async getByCartId(cartId) {
    const items = await cartItemDAO.findByCartId(cartId);
    return items;
  }

  /**
   * Kiểm tra item có trong giỏ không
   */
  async exists(cartId, variantId) {
    const exists = await cartItemDAO.exists(cartId, variantId);
    return exists;
  }

  /**
   * Lấy số lượng của variant trong giỏ
   */
  async getQuantity(cartId, variantId) {
    const quantity = await cartItemDAO.getQuantity(cartId, variantId);
    return quantity;
  }

  /**
   * Đếm số lượng items trong giỏ
   */
  async count(cartId) {
    const count = await cartItemDAO.count(cartId);
    return count;
  }

  /**
   * Tăng số lượng
   */
  async increment(cartItemId, amount = 1) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // Lấy thông tin cart item
      const cartItem = await cartItemDAO.findById(cartItemId);
      
      if (!cartItem) {
        await conn.rollback();
        throw new Error('Không tìm thấy sản phẩm trong giỏ hàng');
      }

      const newQuantity = cartItem.quantity + amount;

      // Kiểm tra tồn kho
      if (cartItem.stock_quantity < newQuantity) {
        await conn.rollback();
        throw new Error(`Chỉ còn ${cartItem.stock_quantity} sản phẩm trong kho`);
      }

      // Tăng số lượng
      const success = await cartItemDAO.incrementQuantity(cartItemId, amount);

      if (!success) {
        await conn.rollback();
        throw new Error('Tăng số lượng thất bại');
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
   * Giảm số lượng
   */
  async decrement(cartItemId, amount = 1) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // Lấy thông tin cart item
      const cartItem = await cartItemDAO.findById(cartItemId);
      
      if (!cartItem) {
        await conn.rollback();
        throw new Error('Không tìm thấy sản phẩm trong giỏ hàng');
      }

      const newQuantity = cartItem.quantity - amount;

      // Nếu số lượng <= 0, xóa item
      if (newQuantity <= 0) {
        await cartItemDAO.delete(cartItemId);
        await conn.commit();
        return true;
      }

      // Giảm số lượng
      const success = await cartItemDAO.decrementQuantity(cartItemId, amount);

      if (!success) {
        await conn.rollback();
        throw new Error('Giảm số lượng thất bại');
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
   * Xóa các item không hợp lệ (hết hàng hoặc không active)
   */
  async removeInvalidItems(cartId) {
    const deletedCount = await cartItemDAO.removeInvalidItems(cartId);
    return deletedCount;
  }

  /**
   * Điều chỉnh số lượng về tồn kho
   */
  async adjustToStock(cartId) {
    const adjustedCount = await cartItemDAO.adjustToStock(cartId);
    return adjustedCount;
  }

  /**
   * Lấy items cho checkout
   * Business logic: Tính lại giá discount cho từng item
   */
  async getItemsForCheckout(cartId) {
    const items = await cartItemDAO.getItemsForCheckout(cartId);

    // Tính lại giá discount cho từng item
    const itemsWithDiscount = items.map(item => {
      const discountedPrice = this.calculateDiscountedPrice(
        item.current_price,
        item.discount_percent,
        item.discount_start_date,
        item.discount_end_date
      );

      return {
        ...item,
        final_price: discountedPrice,
        subtotal: discountedPrice * item.quantity,
        has_discount: discountedPrice < item.current_price
      };
    });

    return itemsWithDiscount;
  }

  /**
   * Cập nhật giá cho tất cả items trong giỏ hàng
   * Business logic: Kiểm tra và cập nhật giá discount cho tất cả items
   */
  async updateAllPrices(cartId) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // Lấy tất cả items kèm variant info
      const items = await cartItemDAO.findAllWithVariantInfo(cartId);

      let updatedCount = 0;

      for (const item of items) {
        // Tính giá discount mới
        const newPrice = this.calculateDiscountedPrice(
          item.current_price,
          item.discount_percent,
          item.discount_start_date,
          item.discount_end_date
        );

        // Chỉ update nếu giá thay đổi
        if (newPrice !== item.price) {
          await cartItemDAO.updatePrice(item.cart_item_id, newPrice);
          updatedCount++;
        }
      }

      await conn.commit();
      return updatedCount;
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }

  /**
   * Bulk add items
   */
  async bulkAdd(cartId, items) {
    if (!items || items.length === 0) {
      throw new Error('Danh sách sản phẩm trống');
    }

    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      const processedItems = [];

      for (const item of items) {
        // Lấy thông tin variant
        const variant = await cartItemDAO.getVariantInfo(item.variantId);
        
        if (!variant || !variant.is_active) {
          continue; // Bỏ qua variant không hợp lệ
        }

        // Kiểm tra tồn kho
        if (variant.stock_quantity < item.quantity) {
          continue; // Bỏ qua variant hết hàng
        }

        // Tính giá discount
        const finalPrice = this.calculateDiscountedPrice(
          variant.price,
          variant.discount_percent,
          variant.discount_start_date,
          variant.discount_end_date
        );

        processedItems.push({
          cartId,
          variantId: item.variantId,
          quantity: item.quantity,
          price: finalPrice
        });
      }

      if (processedItems.length > 0) {
        await cartItemDAO.bulkInsert(processedItems);
      }

      await conn.commit();
      return processedItems.length;
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }

  /**
   * Chuyển items giữa các cart
   */
  async transferItems(fromCartId, toCartId) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // Lấy items từ cart nguồn
      const sourceItems = await cartItemDAO.findByCartId(fromCartId);

      if (sourceItems.length === 0) {
        await conn.commit();
        return 0;
      }

      // Lấy items từ cart đích
      const targetItems = await cartItemDAO.findByCartId(toCartId);
      const targetVariantMap = new Map();
      targetItems.forEach(item => {
        targetVariantMap.set(item.variant_id, item);
      });

      let transferredCount = 0;

      for (const sourceItem of sourceItems) {
        const targetItem = targetVariantMap.get(sourceItem.variant_id);

        if (targetItem) {
          // Merge: cộng số lượng
          const newQuantity = targetItem.quantity + sourceItem.quantity;
          await cartItemDAO.updateQuantity(targetItem.cart_item_id, newQuantity);
        } else {
          // Chuyển item sang cart mới
          await cartItemDAO.insert(
            toCartId,
            sourceItem.variant_id,
            sourceItem.quantity,
            sourceItem.price
          );
        }

        // Xóa item từ cart nguồn
        await cartItemDAO.delete(sourceItem.cart_item_id);
        transferredCount++;
      }

      await conn.commit();
      return transferredCount;
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }
}

export default new CartItemService();
