import express from 'express';
import {
  addToCart,
  updateCartItemQuantity,
  removeCartItem,
  removeCartItemByVariant,
  getCartItemById,
  getCartItems,
  checkCartItemExists,
  getCartItemQuantity,
  countCartItems,
  incrementCartItem,
  decrementCartItem,
  removeInvalidCartItems,
  adjustCartItemsToStock,
  getCartItemsForCheckout,
  bulkAddToCart,
  transferCartItems
} from '../controllers/cartItemController.js';

const router = express.Router();

// Thêm sản phẩm vào giỏ hàng
router.post('/add', addToCart);

// Bulk add items
router.post('/bulk-add', bulkAddToCart);

// Chuyển items giữa các cart
router.post('/transfer', transferCartItems);

// Lấy item theo ID
router.get('/:id', getCartItemById);

// Lấy tất cả items trong giỏ hàng
router.get('/cart/:cartId', getCartItems);

// Lấy items cho checkout
router.get('/cart/:cartId/checkout', getCartItemsForCheckout);

// Kiểm tra item có trong giỏ không
router.get('/cart/:cartId/variant/:variantId/exists', checkCartItemExists);

// Lấy số lượng của variant trong giỏ
router.get('/cart/:cartId/variant/:variantId/quantity', getCartItemQuantity);

// Đếm số lượng items trong giỏ
router.get('/cart/:cartId/count', countCartItems);

// Cập nhật số lượng
router.put('/:id/quantity', updateCartItemQuantity);

// Tăng số lượng
router.patch('/:id/increment', incrementCartItem);

// Giảm số lượng
router.patch('/:id/decrement', decrementCartItem);

// Xóa item khỏi giỏ hàng
router.delete('/:id', removeCartItem);

// Xóa item theo variant và cart
router.delete('/cart/:cartId/variant/:variantId', removeCartItemByVariant);

// Xóa các item không hợp lệ
router.delete('/cart/:cartId/invalid', removeInvalidCartItems);

// Điều chỉnh số lượng về tồn kho
router.patch('/cart/:cartId/adjust-stock', adjustCartItemsToStock);

export default router;