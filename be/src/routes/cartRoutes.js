import express from 'express';
import {
  getOrCreateCart,
  getCartById,
  getCartByUserId,
  getCartBySessionId,
  getCartWithItems,
  assignCartToUser,
  updateCartExpiry,
  deleteCart,
  deleteExpiredCarts,
  clearCart,
  calculateCartTotal,
  checkCartStock
} from '../controllers/cartController.js';

const router = express.Router();

// Lấy hoặc tạo giỏ hàng
router.post('/get-or-create', getOrCreateCart);

// Lấy giỏ hàng theo ID
router.get('/:id', getCartById);

// Lấy giỏ hàng theo user ID
router.get('/user/:userId', getCartByUserId);

// Lấy giỏ hàng theo session ID
router.get('/session/:sessionId', getCartBySessionId);

// Lấy giỏ hàng với đầy đủ thông tin items
router.get('/:id/items', getCartWithItems);

// Gán giỏ hàng guest cho user khi đăng nhập
router.post('/assign-to-user', assignCartToUser);

// Cập nhật thời gian hết hạn
router.put('/:id/expiry', updateCartExpiry);

// Xóa giỏ hàng
router.delete('/:id', deleteCart);

// Xóa giỏ hàng đã hết hạn
router.delete('/cleanup/expired', deleteExpiredCarts);

// Làm trống giỏ hàng
router.delete('/:id/clear', clearCart);

// Tính tổng giá trị giỏ hàng
router.get('/:id/total', calculateCartTotal);

// Kiểm tra tồn kho
router.get('/:id/stock-check', checkCartStock);

export default router;