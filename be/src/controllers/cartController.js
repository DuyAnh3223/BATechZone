import cartService from '../services/cart.service.js';

// Lấy hoặc tạo giỏ hàng
export const getOrCreateCart = async (req, res) => {
  try {
    const { userId, sessionId } = req.body;

    const cart = await cartService.getOrCreate(userId, sessionId);

    res.json({
      success: true,
      data: cart
    });
  } catch (error) {
    console.error('Error getting/creating cart:', error);
    res.status(error.message.includes('Phải cung cấp') ? 400 : 500).json({
      success: false,
      message: error.message
    });
  }
};

// Lấy giỏ hàng theo ID
export const getCartById = async (req, res) => {
  try {
    const { id } = req.params;

    const cart = await cartService.getById(id);

    res.json({
      success: true,
      data: cart
    });
  } catch (error) {
    console.error('Error getting cart:', error);
    res.status(error.message.includes('Không tìm thấy') ? 404 : 500).json({
      success: false,
      message: error.message
    });
  }
};

// Lấy giỏ hàng theo user ID
export const getCartByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const cart = await cartService.getByUserId(userId);

    res.json({
      success: true,
      data: cart
    });
  } catch (error) {
    console.error('Error getting cart by user:', error);
    res.status(error.message.includes('Không tìm thấy') ? 404 : 500).json({
      success: false,
      message: error.message
    });
  }
};

// Lấy giỏ hàng theo session ID
export const getCartBySessionId = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const cart = await cartService.getBySessionId(sessionId);

    res.json({
      success: true,
      data: cart
    });
  } catch (error) {
    console.error('Error getting cart by session:', error);
    res.status(error.message.includes('Không tìm thấy') ? 404 : 500).json({
      success: false,
      message: error.message
    });
  }
};

// Lấy giỏ hàng với đầy đủ thông tin items
export const getCartWithItems = async (req, res) => {
  try {
    const { id } = req.params;

    const cart = await cartService.getCartWithItems(id);

    res.json({
      success: true,
      data: cart
    });
  } catch (error) {
    console.error('Error getting cart with items:', error);
    res.status(error.message.includes('Không tìm thấy') ? 404 : 500).json({
      success: false,
      message: error.message
    });
  }
};

// Gán giỏ hàng guest cho user khi đăng nhập
export const assignCartToUser = async (req, res) => {
  try {
    const { sessionId, userId } = req.body;

    const cartId = await cartService.assignToUser(sessionId, userId);

    res.json({
      success: true,
      message: 'Gán giỏ hàng cho user thành công',
      data: { cartId }
    });
  } catch (error) {
    console.error('Error assigning cart to user:', error);
    const status = error.message.includes('Thiếu') ? 400 : 
                   error.message.includes('Không tìm thấy') ? 404 : 500;
    res.status(status).json({
      success: false,
      message: error.message
    });
  }
};

// Cập nhật thời gian hết hạn
export const updateCartExpiry = async (req, res) => {
  try {
    const { id } = req.params;
    const { expiresAt } = req.body;

    await cartService.updateExpiry(id, expiresAt);

    res.json({
      success: true,
      message: 'Cập nhật thời gian hết hạn thành công'
    });
  } catch (error) {
    console.error('Error updating cart expiry:', error);
    const status = error.message.includes('Thiếu') ? 400 : 
                   error.message.includes('Không tìm thấy') ? 404 : 500;
    res.status(status).json({
      success: false,
      message: error.message
    });
  }
};

// Xóa giỏ hàng
export const deleteCart = async (req, res) => {
  try {
    const { id } = req.params;

    await cartService.delete(id);

    res.json({
      success: true,
      message: 'Xóa giỏ hàng thành công'
    });
  } catch (error) {
    console.error('Error deleting cart:', error);
    res.status(error.message.includes('Không tìm thấy') ? 404 : 500).json({
      success: false,
      message: error.message
    });
  }
};

// Xóa giỏ hàng đã hết hạn
export const deleteExpiredCarts = async (req, res) => {
  try {
    const deletedCount = await cartService.deleteExpired();

    res.json({
      success: true,
      message: `Đã xóa ${deletedCount} giỏ hàng hết hạn`,
      data: { deletedCount }
    });
  } catch (error) {
    console.error('Error deleting expired carts:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Làm trống giỏ hàng
export const clearCart = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCount = await cartService.clear(id);

    res.json({
      success: true,
      message: `Đã xóa ${deletedCount} sản phẩm khỏi giỏ hàng`,
      data: { deletedCount }
    });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Tính tổng giá trị giỏ hàng
export const calculateCartTotal = async (req, res) => {
  try {
    const { id } = req.params;

    const total = await cartService.calculateTotal(id);

    res.json({
      success: true,
      data: total
    });
  } catch (error) {
    console.error('Error calculating cart total:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Kiểm tra tồn kho
export const checkCartStock = async (req, res) => {
  try {
    const { id } = req.params;

    const stockInfo = await cartService.checkStock(id);

    res.json({
      success: true,
      data: stockInfo
    });
  } catch (error) {
    console.error('Error checking cart stock:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};