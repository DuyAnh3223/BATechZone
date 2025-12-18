import express from 'express';
import {
  createOrderItem,
  getOrderItemById,
  getOrderItems,
  getOrderItemsByVariant,
  updateOrderItem,
  deleteOrderItem,
  deleteOrderItems,
  calculateOrderTotal,
  getBestSellers,
  getRevenueByProduct,
  checkPurchased,
  getUserPurchasedProducts
} from '../controllers/orderItemController.js';

const router = express.Router();

// Tạo order item mới
router.post('/', createOrderItem);

// Lấy sản phẩm bán chạy nhất
router.get('/best-sellers', getBestSellers);

// Lấy thống kê doanh thu theo sản phẩm
router.get('/revenue', getRevenueByProduct);

// Kiểm tra sản phẩm đã được mua bởi user chưa
router.get('/user/:userId/variant/:variantId/purchased', checkPurchased);

// Lấy danh sách sản phẩm user đã mua
router.get('/user/:userId/purchased-products', getUserPurchasedProducts);

// Lấy order item theo ID
router.get('/:id', getOrderItemById);

// Lấy tất cả items của một đơn hàng
router.get('/order/:orderId', getOrderItems);

// Tính tổng giá trị đơn hàng
router.get('/order/:orderId/total', calculateOrderTotal);

// Lấy items theo variant ID (lịch sử mua hàng)
router.get('/variant/:variantId', getOrderItemsByVariant);

// Cập nhật order item
router.put('/:id', updateOrderItem);

// Xóa order item
router.delete('/:id', deleteOrderItem);

// Xóa tất cả items của một đơn hàng
router.delete('/order/:orderId', deleteOrderItems);

export default router;