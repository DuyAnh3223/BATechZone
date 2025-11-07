import Cart from '../models/Cart.js';

// Lấy hoặc tạo giỏ hàng
export const getOrCreateCart = async (req, res) => {
  try {
    const { userId, sessionId } = req.body;

    if (!userId && !sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp userId hoặc sessionId'
      });
    }

    const cart = await Cart.getOrCreate(userId, sessionId);

    res.json({
      success: true,
      data: cart
    });
  } catch (error) {
    console.error('Error getting/creating cart:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy giỏ hàng',
      error: error.message
    });
  }
};

// Lấy giỏ hàng theo ID
export const getCartById = async (req, res) => {
  try {
    const { id } = req.params;

    const cart = await Cart.getById(id);

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy giỏ hàng'
      });
    }

    res.json({
      success: true,
      data: cart
    });
  } catch (error) {
    console.error('Error getting cart:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy giỏ hàng',
      error: error.message
    });
  }
};

// Lấy giỏ hàng theo user ID
export const getCartByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const cart = await Cart.getByUserId(userId);

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy giỏ hàng'
      });
    }

    res.json({
      success: true,
      data: cart
    });
  } catch (error) {
    console.error('Error getting cart by user:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy giỏ hàng',
      error: error.message
    });
  }
};

// Lấy giỏ hàng theo session ID
export const getCartBySessionId = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const cart = await Cart.getBySessionId(sessionId);

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy giỏ hàng'
      });
    }

    res.json({
      success: true,
      data: cart
    });
  } catch (error) {
    console.error('Error getting cart by session:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy giỏ hàng',
      error: error.message
    });
  }
};

// Lấy giỏ hàng với đầy đủ thông tin items
export const getCartWithItems = async (req, res) => {
  try {
    const { id } = req.params;

    const cart = await Cart.getCartWithItems(id);

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy giỏ hàng'
      });
    }

    res.json({
      success: true,
      data: cart
    });
  } catch (error) {
    console.error('Error getting cart with items:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy giỏ hàng',
      error: error.message
    });
  }
};

// Gán giỏ hàng guest cho user khi đăng nhập
export const assignCartToUser = async (req, res) => {
  try {
    const { sessionId, userId } = req.body;

    if (!sessionId || !userId) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp sessionId và userId'
      });
    }

    const cartId = await Cart.assignToUser(sessionId, userId);

    if (!cartId) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy giỏ hàng guest'
      });
    }

    res.json({
      success: true,
      message: 'Gán giỏ hàng cho user thành công',
      data: { cartId }
    });
  } catch (error) {
    console.error('Error assigning cart to user:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi gán giỏ hàng',
      error: error.message
    });
  }
};

// Cập nhật thời gian hết hạn
export const updateCartExpiry = async (req, res) => {
  try {
    const { id } = req.params;
    const { expiresAt } = req.body;

    if (!expiresAt) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp thời gian hết hạn'
      });
    }

    const success = await Cart.updateExpiry(id, expiresAt);

    if (!success) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy giỏ hàng'
      });
    }

    res.json({
      success: true,
      message: 'Cập nhật thời gian hết hạn thành công'
    });
  } catch (error) {
    console.error('Error updating cart expiry:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật giỏ hàng',
      error: error.message
    });
  }
};

// Xóa giỏ hàng
export const deleteCart = async (req, res) => {
  try {
    const { id } = req.params;

    const success = await Cart.delete(id);

    if (!success) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy giỏ hàng'
      });
    }

    res.json({
      success: true,
      message: 'Xóa giỏ hàng thành công'
    });
  } catch (error) {
    console.error('Error deleting cart:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa giỏ hàng',
      error: error.message
    });
  }
};

// Xóa giỏ hàng đã hết hạn
export const deleteExpiredCarts = async (req, res) => {
  try {
    const deletedCount = await Cart.deleteExpired();

    res.json({
      success: true,
      message: `Đã xóa ${deletedCount} giỏ hàng hết hạn`,
      data: { deletedCount }
    });
  } catch (error) {
    console.error('Error deleting expired carts:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa giỏ hàng hết hạn',
      error: error.message
    });
  }
};

// Làm trống giỏ hàng
export const clearCart = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCount = await Cart.clear(id);

    res.json({
      success: true,
      message: `Đã xóa ${deletedCount} sản phẩm khỏi giỏ hàng`,
      data: { deletedCount }
    });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi làm trống giỏ hàng',
      error: error.message
    });
  }
};

// Tính tổng giá trị giỏ hàng
export const calculateCartTotal = async (req, res) => {
  try {
    const { id } = req.params;

    const total = await Cart.calculateTotal(id);

    res.json({
      success: true,
      data: total
    });
  } catch (error) {
    console.error('Error calculating cart total:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tính tổng giỏ hàng',
      error: error.message
    });
  }
};

// Kiểm tra tồn kho
export const checkCartStock = async (req, res) => {
  try {
    const { id } = req.params;

    const stockInfo = await Cart.checkStock(id);

    res.json({
      success: true,
      data: stockInfo
    });
  } catch (error) {
    console.error('Error checking cart stock:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi kiểm tra tồn kho',
      error: error.message
    });
  }
};