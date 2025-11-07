import CartItem from '../models/CartItem.js';

// Thêm sản phẩm vào giỏ hàng
export const addToCart = async (req, res) => {
  try {
    const { cartId, variantId, quantity } = req.body;

    if (!cartId || !variantId) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp cartId và variantId'
      });
    }

    const result = await CartItem.add(cartId, variantId, quantity || 1);

    res.status(201).json({
      success: true,
      message: result.updated ? 'Cập nhật số lượng thành công' : 'Thêm vào giỏ hàng thành công',
      data: result
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Cập nhật số lượng
export const updateCartItemQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Số lượng phải lớn hơn 0'
      });
    }

    const success = await CartItem.updateQuantity(id, quantity);

    if (!success) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm trong giỏ hàng'
      });
    }

    res.json({
      success: true,
      message: 'Cập nhật số lượng thành công'
    });
  } catch (error) {
    console.error('Error updating cart item quantity:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Xóa item khỏi giỏ hàng
export const removeCartItem = async (req, res) => {
  try {
    const { id } = req.params;

    const success = await CartItem.remove(id);

    if (!success) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm trong giỏ hàng'
      });
    }

    res.json({
      success: true,
      message: 'Xóa sản phẩm khỏi giỏ hàng thành công'
    });
  } catch (error) {
    console.error('Error removing cart item:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa sản phẩm',
      error: error.message
    });
  }
};

// Xóa item theo variant và cart
export const removeCartItemByVariant = async (req, res) => {
  try {
    const { cartId, variantId } = req.params;

    const success = await CartItem.removeByVariant(cartId, variantId);

    if (!success) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm trong giỏ hàng'
      });
    }

    res.json({
      success: true,
      message: 'Xóa sản phẩm khỏi giỏ hàng thành công'
    });
  } catch (error) {
    console.error('Error removing cart item by variant:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa sản phẩm',
      error: error.message
    });
  }
};

// Lấy item theo ID
export const getCartItemById = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await CartItem.getById(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm trong giỏ hàng'
      });
    }

    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    console.error('Error getting cart item:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin sản phẩm',
      error: error.message
    });
  }
};

// Lấy tất cả items trong giỏ hàng
export const getCartItems = async (req, res) => {
  try {
    const { cartId } = req.params;

    const items = await CartItem.getByCartId(cartId);

    res.json({
      success: true,
      data: items
    });
  } catch (error) {
    console.error('Error getting cart items:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách sản phẩm',
      error: error.message
    });
  }
};

// Kiểm tra item có trong giỏ không
export const checkCartItemExists = async (req, res) => {
  try {
    const { cartId, variantId } = req.params;

    const exists = await CartItem.exists(cartId, variantId);

    res.json({
      success: true,
      data: { exists }
    });
  } catch (error) {
    console.error('Error checking cart item exists:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi kiểm tra sản phẩm',
      error: error.message
    });
  }
};

// Lấy số lượng của variant trong giỏ
export const getCartItemQuantity = async (req, res) => {
  try {
    const { cartId, variantId } = req.params;

    const quantity = await CartItem.getQuantity(cartId, variantId);

    res.json({
      success: true,
      data: { quantity }
    });
  } catch (error) {
    console.error('Error getting cart item quantity:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy số lượng sản phẩm',
      error: error.message
    });
  }
};

// Đếm số lượng items trong giỏ
export const countCartItems = async (req, res) => {
  try {
    const { cartId } = req.params;

    const count = await CartItem.count(cartId);

    res.json({
      success: true,
      data: { count }
    });
  } catch (error) {
    console.error('Error counting cart items:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi đếm sản phẩm',
      error: error.message
    });
  }
};

// Tăng số lượng
export const incrementCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;

    await CartItem.increment(id, amount || 1);

    res.json({
      success: true,
      message: 'Tăng số lượng thành công'
    });
  } catch (error) {
    console.error('Error incrementing cart item:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Giảm số lượng
export const decrementCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;

    await CartItem.decrement(id, amount || 1);

    res.json({
      success: true,
      message: 'Giảm số lượng thành công'
    });
  } catch (error) {
    console.error('Error decrementing cart item:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Xóa các item không hợp lệ
export const removeInvalidCartItems = async (req, res) => {
  try {
    const { cartId } = req.params;

    const deletedCount = await CartItem.removeInvalidItems(cartId);

    res.json({
      success: true,
      message: `Đã xóa ${deletedCount} sản phẩm không hợp lệ`,
      data: { deletedCount }
    });
  } catch (error) {
    console.error('Error removing invalid cart items:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa sản phẩm không hợp lệ',
      error: error.message
    });
  }
};

// Điều chỉnh số lượng về tồn kho
export const adjustCartItemsToStock = async (req, res) => {
  try {
    const { cartId } = req.params;

    const adjustedCount = await CartItem.adjustToStock(cartId);

    res.json({
      success: true,
      message: `Đã điều chỉnh ${adjustedCount} sản phẩm về tồn kho`,
      data: { adjustedCount }
    });
  } catch (error) {
    console.error('Error adjusting cart items to stock:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi điều chỉnh số lượng',
      error: error.message
    });
  }
};

// Lấy items cho checkout
export const getCartItemsForCheckout = async (req, res) => {
  try {
    const { cartId } = req.params;

    const items = await CartItem.getItemsForCheckout(cartId);

    res.json({
      success: true,
      data: items
    });
  } catch (error) {
    console.error('Error getting cart items for checkout:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin checkout',
      error: error.message
    });
  }
};

// Bulk add items
export const bulkAddToCart = async (req, res) => {
  try {
    const { cartId, items } = req.body;

    if (!cartId || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp cartId và danh sách sản phẩm'
      });
    }

    await CartItem.bulkAdd(cartId, items);

    res.status(201).json({
      success: true,
      message: 'Thêm nhiều sản phẩm vào giỏ hàng thành công'
    });
  } catch (error) {
    console.error('Error bulk adding to cart:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Chuyển items giữa các cart
export const transferCartItems = async (req, res) => {
  try {
    const { fromCartId, toCartId } = req.body;

    if (!fromCartId || !toCartId) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp fromCartId và toCartId'
      });
    }

    const transferredCount = await CartItem.transferItems(fromCartId, toCartId);

    res.json({
      success: true,
      message: `Đã chuyển ${transferredCount} sản phẩm`,
      data: { transferredCount }
    });
  } catch (error) {
    console.error('Error transferring cart items:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi chuyển sản phẩm',
      error: error.message
    });
  }
};