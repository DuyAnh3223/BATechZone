import { ShoppingCart, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCartItemStore } from "@/stores/useCartItemStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const CartDropdown = ({ children, cartItemsCount }) => {
  const { cartItems } = useCartItemStore();

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const calculateSubtotal = () => {
    if (!cartItems || cartItems.length === 0) return 0;
    return cartItems.reduce((total, item) => {
      const itemPrice = item.price || item.current_price || item.currentPrice || 0;
      const itemQuantity = item.quantity || 0;
      return total + (itemPrice * itemQuantity);
    }, 0);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96 p-0">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            <span className="font-semibold">Giỏ hàng của bạn</span>
          </div>
          <Badge 
            className="bg-red-500 text-white font-bold"
            style={{ fontSize: "11px" }}
          >
            {cartItemsCount > 99 ? '99+' : cartItemsCount} sản phẩm
          </Badge>
        </div>

        {cartItems && cartItems.length > 0 ? (
          <>
            <ScrollArea className="h-80 w-full">
              <div className="p-4 space-y-3">
                {cartItems.slice(0, 5).map((item) => {
                  const imageUrl = item.image_url || item.imageUrl || 'https://via.placeholder.com/80';
                  const productName = item.product_name || item.productName || item.name || 'Sản phẩm';
                  const variantName = item.variant_name || item.variantName || '';
                  const displayName = variantName ? `${productName} - ${variantName}` : productName;
                  const itemPrice = item.price || item.current_price || item.currentPrice || 0;
                  
                  return (
                    <div 
                      key={item.cart_item_id}
                      className="flex gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={imageUrl}
                          alt={displayName}
                          className="w-16 h-16 object-cover rounded-md border border-gray-200"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/80';
                          }}
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <Link
                          to="#"
                          className="font-medium text-sm text-gray-900 hover:text-blue-600 line-clamp-2 transition-colors"
                        >
                          {displayName}
                        </Link>
                        <div className="mt-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">Số lượng:</span>
                            <Badge variant="outline" className="text-xs">
                              {item.quantity}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">Giá:</span>
                            <span className="font-semibold text-sm text-red-600">
                              {formatPrice(itemPrice)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between pt-1 border-t">
                            <span className="text-xs text-gray-500">Thành tiền:</span>
                            <span className="font-bold text-sm text-red-600">
                              {formatPrice(itemPrice * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {cartItems.length > 5 && (
                  <div className="text-center py-2">
                    <span className="text-xs text-gray-500">
                      +{cartItems.length - 5} sản phẩm khác
                    </span>
                  </div>
                )}
              </div>
            </ScrollArea>

            <Separator />

            {/* Subtotal */}
            <div className="px-4 py-3">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-600">Tạm tính:</span>
                <span className="font-bold text-lg text-red-600">
                  {formatPrice(calculateSubtotal())}
                </span>
              </div>
              
              {/* Action Buttons */}
              <div className="space-y-2">
                <Link to="/cart" className="block">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Xem giỏ hàng
                  </Button>
                </Link>
                <Link to="/checkout" className="block">
                  <Button 
                    variant="outline" 
                    className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
                  >
                    Thanh toán
                  </Button>
                </Link>
              </div>
            </div>
          </>
        ) : (
          <div className="p-8 text-center">
            <ShoppingCart className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500 text-sm font-medium mb-2">Giỏ hàng trống</p>
            <p className="text-gray-400 text-xs mb-4">Hãy thêm sản phẩm để tiếp tục mua sắm</p>
            <Link to="/products" className="block">
              <Button className="w-full" size="sm">
                Tiếp tục mua sắm
              </Button>
            </Link>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CartDropdown;
