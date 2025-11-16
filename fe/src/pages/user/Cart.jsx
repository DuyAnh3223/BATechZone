import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { MinusIcon, PlusIcon, Trash2Icon, ShoppingCart } from "lucide-react";
import { Link } from "react-router";
import { useCartStore } from "@/stores/useCartStore";
import { useCartItemStore } from "@/stores/useCartItemStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "sonner";

const Cart = () => {
  const { user } = useAuthStore();
  const { getOrCreateCart, cart } = useCartStore();
  const { 
    cartItems, 
    fetchCartItems, 
    updateQuantity, 
    removeItem,
    loading 
  } = useCartItemStore();
  
  const [couponCode, setCouponCode] = useState("");
  const [isLoadingCart, setIsLoadingCart] = useState(true);

  // Load cart data khi component mount
  useEffect(() => {
    const loadCart = async () => {
      try {
        setIsLoadingCart(true);
        
        // 1. Lấy hoặc tạo cart
        let cartData = {};
        if (user) {
          cartData.userId = user.user_id;
        } else {
          let sessionId = localStorage.getItem('guest_session_id');
          if (!sessionId) {
            sessionId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            localStorage.setItem('guest_session_id', sessionId);
          }
          cartData.sessionId = sessionId;
        }

        const cartResponse = await getOrCreateCart(cartData);
        const currentCart = cartResponse?.data || cartResponse;
        
        const cartId = currentCart?.cart_id || currentCart?.cartId;
        
        if (cartId) {
          // 2. Lấy cart items
          await fetchCartItems(cartId);
        }
      } catch (error) {
        console.error('Error loading cart:', error);
        toast.error('Không thể tải giỏ hàng');
      } finally {
        setIsLoadingCart(false);
      }
    };

    loadCart();
  }, [user, getOrCreateCart, fetchCartItems]);

  const handleQuantityChange = async (itemId, type) => {
    try {
      const item = cartItems.find(i => i.cart_item_id === itemId);
      if (!item) return;

      const newQuantity = type === "increase" 
        ? item.quantity + 1 
        : Math.max(1, item.quantity - 1);

      await updateQuantity(itemId, newQuantity);
      
      // Reload cart items
      const cartId = cart?.cart_id || cart?.cartId;
      if (cartId) {
        await fetchCartItems(cartId);
      }
      
      toast.success('Đã cập nhật số lượng');
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error(error.response?.data?.message || 'Không thể cập nhật số lượng');
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await removeItem(itemId);
      
      // Reload cart items
      const cartId = cart?.cart_id || cart?.cartId;
      if (cartId) {
        await fetchCartItems(cartId);
      }
      
      toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error(error.response?.data?.message || 'Không thể xóa sản phẩm');
    }
  };

  const calculateTotal = () => {
    if (!cartItems || cartItems.length === 0) return 0;
    return cartItems.reduce((total, item) => {
      const itemPrice = item.price || item.current_price || item.currentPrice || 0;
      const itemQuantity = item.quantity || 0;
      return total + (itemPrice * itemQuantity);
    }, 0);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Show loading state
  if (isLoadingCart) {
    return (
      <div className="py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Đang tải giỏ hàng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Giỏ hàng</CardTitle>
              <CardDescription>
                {cartItems?.length || 0} sản phẩm trong giỏ hàng
              </CardDescription>
            </CardHeader>
            <CardContent>
              {cartItems && cartItems.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-2"></th>
                        <th className="text-left py-3 px-2">Tên sản phẩm</th>
                        <th className="text-center py-3 px-2">Đơn giá</th>
                        <th className="text-center py-3 px-2">Số lượng</th>
                        <th className="text-center py-3 px-2">Thành tiền</th>
                        <th className="text-center py-3 px-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartItems.map((item, index) => {
                        const imageUrl = item.image_url || item.imageUrl || 'https://via.placeholder.com/100';
                        const productName = item.product_name || item.productName || item.name || 'Sản phẩm';
                        const variantName = item.variant_name || item.variantName || '';
                        const displayName = variantName ? `${productName} - ${variantName}` : productName;
                        
                        return (
                          <tr key={item.cart_item_id} className={index !== cartItems.length - 1 ? "border-b" : ""}>
                            {/* Cột 1: Ảnh đại diện */}
                            <td className="py-4 px-2">
                              <img
                                src={imageUrl}
                                alt={displayName}
                                className="w-20 h-20 object-cover rounded-lg"
                                onError={(e) => {
                                  e.target.src = 'https://via.placeholder.com/100';
                                }}
                              />
                            </td>
                            
                            {/* Cột 2: Tên sản phẩm */}
                            <td className="py-4 px-2">
                              <h3 className="font-medium text-gray-900">{displayName}</h3>
                              {item.sku && (
                                <p className="text-xs text-gray-500 mt-1">SKU: {item.sku}</p>
                              )}
                            </td>
                            
                            {/* Cột 3: Đơn giá */}
                            <td className="py-4 px-2 text-center">
                              <p className="font-semibold text-gray-700">
                                {formatPrice(item.price || item.current_price || item.currentPrice || 0)}
                              </p>
                            </td>
                            
                            {/* Cột 4: Số lượng */}
                            <td className="py-4 px-2">
                              <div className="flex items-center justify-center gap-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleQuantityChange(item.cart_item_id, "decrease")}
                                  disabled={loading}
                                >
                                  <MinusIcon className="h-3 w-3" />
                                </Button>
                                <span className="w-12 text-center font-medium">
                                  {item.quantity}
                                </span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleQuantityChange(item.cart_item_id, "increase")}
                                  disabled={loading}
                                >
                                  <PlusIcon className="h-3 w-3" />
                                </Button>
                              </div>
                            </td>
                            
                            {/* Cột 5: Thành tiền */}
                            <td className="py-4 px-2 text-center">
                              <p className="font-bold text-red-600 text-lg">
                                {formatPrice((item.price || item.current_price || item.currentPrice || 0) * (item.quantity || 0))}
                              </p>
                            </td>
                            
                            {/* Cột 6: Button Xóa */}
                            <td className="py-4 px-2 text-center">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleRemoveItem(item.cart_item_id)}
                                disabled={loading}
                              >
                                <Trash2Icon className="h-5 w-5" />
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium mb-2">Giỏ hàng của bạn đang trống</p>
                  <p className="text-sm mb-4">Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm</p>
                  <Link to="/">
                    <Button className="mt-4">
                      Tiếp tục mua sắm
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Thông tin đơn hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Coupon Code */}
              <div className="flex gap-2">
                <Input
                  placeholder="Nhập mã giảm giá"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <Button variant="outline">Áp dụng</Button>
              </div>

              <Separator />

              {/* Price Summary */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tổng tiền sản phẩm</span>
                  <span>{formatPrice(calculateTotal())}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Cần thanh toán</span>
                  <span className="text-red-600">{formatPrice(calculateTotal())}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Link  to="/checkout" className="w-full" size="lg" >
                <Button className="w-full" size="lg">
                  Tiến hành đặt hàng
                </Button>
              </Link>
              <Button 
                variant="outline" 
                className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-700" 
                size="lg"
              >
                Mua trả góp
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Cart;
