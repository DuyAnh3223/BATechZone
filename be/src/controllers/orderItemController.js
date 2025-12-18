import OrderItem from '../models/OrderItem.js';

// Tạo order item mới
export const createOrderItem = async (req, res) => {
  try {
    const itemData = req.body;

    // Validate
    if (!itemData.orderId || !itemData.variantId || !itemData.quantity || !itemData.unitPrice) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin bắt buộc'
      });
    }

    const orderItemId = await OrderItem.create(itemData);

    res.status(201).json({
      success: true,
      message: 'Tạo order item thành công',
      data: { orderItemId }
    });
  } catch (error) {
    console.error('Error creating order item:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo order item',
      error: error.message
    });
  }
};

// Lấy order item theo ID
export const getOrderItemById = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await OrderItem.getById(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy order item'
      });
    }

    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    console.error('Error getting order item:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin order item',
      error: error.message
    });
  }
};

// Lấy tất cả items của một đơn hàng
export const getOrderItems = async (req, res) => {
  try {
    const { orderId } = req.params;

    const items = await OrderItem.getByOrderId(orderId);

    res.json({
      success: true,
      data: items
    });
  } catch (error) {
    console.error('Error getting order items:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách order items',
      error: error.message
    });
  }
};

// Lấy items theo variant ID (lịch sử mua hàng)
export const getOrderItemsByVariant = async (req, res) => {
  try {
    const { variantId } = req.params;
    const params = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
      sortBy: req.query.sortBy || 'created_at',
      sortOrder: req.query.sortOrder || 'DESC'
    };

    const result = await OrderItem.getByVariantId(variantId, params);

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Error getting order items by variant:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy lịch sử mua hàng',
      error: error.message
    });
  }
};

// Cập nhật order item
export const updateOrderItem = async (req, res) => {
  try {
    const { id } = req.params;
    const itemData = req.body;

    const success = await OrderItem.update(id, itemData);

    if (!success) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy order item'
      });
    }

    res.json({
      success: true,
      message: 'Cập nhật order item thành công'
    });
  } catch (error) {
    console.error('Error updating order item:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật order item',
      error: error.message
    });
  }
};

// Xóa order item
export const deleteOrderItem = async (req, res) => {
  try {
    const { id } = req.params;

    const success = await OrderItem.delete(id);

    if (!success) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy order item'
      });
    }

    res.json({
      success: true,
      message: 'Xóa order item thành công'
    });
  } catch (error) {
    console.error('Error deleting order item:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa order item',
      error: error.message
    });
  }
};

// Xóa tất cả items của một đơn hàng
export const deleteOrderItems = async (req, res) => {
  try {
    const { orderId } = req.params;

    const deletedCount = await OrderItem.deleteByOrderId(orderId);

    res.json({
      success: true,
      message: `Đã xóa ${deletedCount} order items`,
      data: { deletedCount }
    });
  } catch (error) {
    console.error('Error deleting order items:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa order items',
      error: error.message
    });
  }
};

// Tính tổng giá trị đơn hàng
export const calculateOrderTotal = async (req, res) => {
  try {
    const { orderId } = req.params;

    const result = await OrderItem.calculateOrderTotal(orderId);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error calculating order total:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tính tổng đơn hàng',
      error: error.message
    });
  }
};

// Lấy sản phẩm bán chạy nhất
export const getBestSellers = async (req, res) => {
  try {
    const params = {
      limit: parseInt(req.query.limit) || 10,
      fromDate: req.query.fromDate,
      toDate: req.query.toDate
    };

    const items = await OrderItem.getBestSellers(params);

    res.json({
      success: true,
      data: items
    });
  } catch (error) {
    console.error('Error getting best sellers:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy sản phẩm bán chạy',
      error: error.message
    });
  }
};

// Lấy thống kê doanh thu theo sản phẩm
export const getRevenueByProduct = async (req, res) => {
  try {
    const params = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
      fromDate: req.query.fromDate,
      toDate: req.query.toDate,
      sortBy: req.query.sortBy || 'total_revenue',
      sortOrder: req.query.sortOrder || 'DESC'
    };

    const result = await OrderItem.getRevenueByProduct(params);

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Error getting revenue by product:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thống kê doanh thu',
      error: error.message
    });
  }
};

// Kiểm tra sản phẩm đã được mua bởi user chưa
export const checkPurchased = async (req, res) => {
  try {
    const { userId, variantId } = req.params;

    const isPurchased = await OrderItem.isPurchasedByUser(userId, variantId);

    res.json({
      success: true,
      data: { isPurchased }
    });
  } catch (error) {
    console.error('Error checking purchased:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi kiểm tra lịch sử mua hàng',
      error: error.message
    });
  }
};

// Lấy danh sách sản phẩm user đã mua
export const getUserPurchasedProducts = async (req, res) => {
  try {
    const { userId } = req.params;
    const params = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10
    };

    const result = await OrderItem.getUserPurchasedProducts(userId, params);

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Error getting user purchased products:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy sản phẩm đã mua',
      error: error.message
    });
  }
};