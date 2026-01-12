import cartItemService from '../services/cartItem.service.js';

// Thêm sản phẩm vào giỏ hàng
export const addToCart = async (req, res) => {
  try {
    const { cartId, variantId, quantity } = req.body;

    const result = await cartItemService.add(cartId, variantId, quantity || 1);

    res.status(201).json({
      success: true,
      message: result.updated ? 'Cập nhật số lượng thành công' : 'Thêm vào giỏ hàng thành công',
      data: result
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    const status = error.message.includes('Thiếu') ? 400 : 
                   error.message.includes('Không tìm thấy') ? 404 : 400;
    res.status(status).json({
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

    await cartItemService.updateQuantity(id, quantity);

    res.json({
      success: true,
      message: 'Cập nhật số lượng thành công'
    });
  } catch (error) {
    console.error('Error updating cart item quantity:', error);
    const status = error.message.includes('Thiếu') || error.message.includes('Số lượng') ? 400 : 
                   error.message.includes('Không tìm thấy') ? 404 : 400;
    res.status(status).json({
      success: false,
      message: error.message
    });
  }
};

// Xóa item khỏi giỏ hàng
export const removeCartItem = async (req, res) => {
  try {
    const { id } = req.params;

    await cartItemService.remove(id);

    res.json({
      success: true,
      message: 'Xóa sản phẩm khỏi giỏ hàng thành công'
    });
  } catch (error) {
    console.error('Error removing cart item:', error);
    res.status(error.message.includes('Không tìm thấy') ? 404 : 500).json({
      success: false,
      message: error.message
    });
  }
};

// Xóa item theo variant và cart
export const removeCartItemByVariant = async (req, res) => {
  try {
    const { cartId, variantId } = req.params;

    await cartItemService.removeByVariant(cartId, variantId);

    res.json({
      success: true,
      message: 'Xóa sản phẩm khỏi giỏ hàng thành công'
    });
  } catch (error) {
    console.error('Error removing cart item by variant:', error);
    res.status(error.message.includes('Không tìm thấy') ? 404 : 500).json({
      success: false,
      message: error.message
    });
  }
};

// Lấy item theo ID
export const getCartItemById = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await cartItemService.getById(id);

    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    console.error('Error getting cart item:', error);
    res.status(error.message.includes('Không tìm thấy') ? 404 : 500).json({
      success: false,
      message: error.message
    });
  }
};

// Lấy tất cả items trong giỏ hàng
export const getCartItems = async (req, res) => {
  try {
    const { cartId } = req.params;

    const items = await cartItemService.getByCartId(cartId);

    res.json({
      success: true,
      data: items
    });
  } catch (error) {
    console.error('Error getting cart items:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Kiểm tra item có trong giỏ không
export const checkCartItemExists = async (req, res) => {
  try {
    const { cartId, variantId } = req.params;

    const exists = await cartItemService.exists(cartId, variantId);

    res.json({
      success: true,
      data: { exists }
    });
  } catch (error) {
    console.error('Error checking cart item exists:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Lấy số lượng của variant trong giỏ
export const getCartItemQuantity = async (req, res) => {
  try {
    const { cartId, variantId } = req.params;

    const quantity = await cartItemService.getQuantity(cartId, variantId);

    res.json({
      success: true,
      data: { quantity }
    });
  } catch (error) {
    console.error('Error getting cart item quantity:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Đếm số lượng items trong giỏ
export const countCartItems = async (req, res) => {
  try {
    const { cartId } = req.params;

    const count = await cartItemService.count(cartId);

    res.json({
      success: true,
      data: { count }
    });
  } catch (error) {
    console.error('Error counting cart items:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Tăng số lượng
export const incrementCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;

    await cartItemService.increment(id, amount || 1);

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

    await cartItemService.decrement(id, amount || 1);

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

    const deletedCount = await cartItemService.removeInvalidItems(cartId);

    res.json({
      success: true,
      message: `Đã xóa ${deletedCount} sản phẩm không hợp lệ`,
      data: { deletedCount }
    });
  } catch (error) {
    console.error('Error removing invalid cart items:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Điều chỉnh số lượng về tồn kho
export const adjustCartItemsToStock = async (req, res) => {
  try {
    const { cartId } = req.params;

    const adjustedCount = await cartItemService.adjustToStock(cartId);

    res.json({
      success: true,
      message: `Đã điều chỉnh ${adjustedCount} sản phẩm về tồn kho`,
      data: { adjustedCount }
    });
  } catch (error) {
    console.error('Error adjusting cart items to stock:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Lấy items cho checkout (với giá discount)
export const getCartItemsForCheckout = async (req, res) => {
  try {
    const { cartId } = req.params;

    const items = await cartItemService.getItemsForCheckout(cartId);

    res.json({
      success: true,
      data: items
    });
  } catch (error) {
    console.error('Error getting cart items for checkout:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Bulk add items
export const bulkAddToCart = async (req, res) => {
  try {
    const { cartId, items } = req.body;

    const addedCount = await cartItemService.bulkAdd(cartId, items);

    res.status(201).json({
      success: true,
      message: `Thêm ${addedCount} sản phẩm vào giỏ hàng thành công`
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

    const transferredCount = await cartItemService.transferItems(fromCartId, toCartId);

    res.json({
      success: true,
      message: `Đã chuyển ${transferredCount} sản phẩm`,
      data: { transferredCount }
    });
  } catch (error) {
    console.error('Error transferring cart items:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};