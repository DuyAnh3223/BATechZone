import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

import { Link, useNavigate } from "react-router";
import { useCartStore } from "@/stores/useCartStore";
import { useCartItemStore } from "@/stores/useCartItemStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { useOrderStore } from "@/stores/useOrderStore";
import { couponService } from "@/services/couponService";
import { toast } from "sonner";
import { useEffect } from "react";
import { X, Tag } from "lucide-react";

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { getOrCreateCart, cart, clearCart } = useCartStore();
  const { 
    cartItems, 
    fetchCartItems, 
    loading,
    reset: resetCartItems
  } = useCartItemStore();
  const { createOrder, loading: orderLoading } = useOrderStore();
  const [isLoadingCart, setIsLoadingCart] = useState(true);
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  
  const form = useForm({
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      province: "",
      district: "",
      address: "",
      note: "",
      paymentMethod: "cod",
    },
  });

  // Load coupon từ localStorage sau khi cart items đã được load
  useEffect(() => {
    const validateSavedCoupon = async () => {
      const savedCoupon = localStorage.getItem('applied_coupon');
      const savedDiscount = localStorage.getItem('discount_amount');
      
      if (savedCoupon && savedDiscount && cartItems && cartItems.length > 0) {
        try {
          const coupon = JSON.parse(savedCoupon);
          const subtotal = calculateSubtotal();
          
          if (subtotal > 0) {
            try {
              const response = await couponService.validateCoupon(coupon.coupon_code, subtotal);
              if (response.success && response.data) {
                setAppliedCoupon(response.data.coupon);
                setDiscountAmount(response.data.discountAmount);
                // Cập nhật lại localStorage với discount mới
                localStorage.setItem('applied_coupon', JSON.stringify(response.data.coupon));
                localStorage.setItem('discount_amount', response.data.discountAmount.toString());
              } else {
                // Coupon không còn hợp lệ, xóa khỏi localStorage
                setAppliedCoupon(null);
                setDiscountAmount(0);
                localStorage.removeItem('applied_coupon');
                localStorage.removeItem('discount_amount');
              }
            } catch (error) {
              // Coupon không còn hợp lệ, xóa khỏi localStorage
              setAppliedCoupon(null);
              setDiscountAmount(0);
              localStorage.removeItem('applied_coupon');
              localStorage.removeItem('discount_amount');
            }
          }
        } catch (error) {
          console.error('Error loading coupon from localStorage:', error);
          setAppliedCoupon(null);
          setDiscountAmount(0);
          localStorage.removeItem('applied_coupon');
          localStorage.removeItem('discount_amount');
        }
      } else if (savedCoupon && savedDiscount && (!cartItems || cartItems.length === 0)) {
        // Tạm thời load coupon nếu chưa có cart items
        try {
          const coupon = JSON.parse(savedCoupon);
          const discount = parseFloat(savedDiscount);
          setAppliedCoupon(coupon);
          setDiscountAmount(discount);
        } catch (error) {
          console.error('Error loading coupon from localStorage:', error);
        }
      }
    };

    validateSavedCoupon();
  }, [cartItems]);

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

  const calculateShipping = () => {
    return 50000; // Phí ship cố định
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const shipping = calculateShipping();
    return Math.max(0, subtotal + shipping - discountAmount);
  };

  const onSubmit = async (data) => {
    if (step === 1) {
      // Validate có sản phẩm trong giỏ
      if (!cartItems || cartItems.length === 0) {
        toast.error('Giỏ hàng trống. Vui lòng thêm sản phẩm trước khi đặt hàng.');
        return;
      }
      setPaymentMethod(data.paymentMethod);
      setStep(2);
    } else {
      // Step 2: Đặt hàng
      await handlePlaceOrder(data);
    }
  };

  const handlePlaceOrder = async (formData) => {
    try {
      setIsSubmitting(true);

      // Chuẩn bị dữ liệu đơn hàng
      const orderData = {
        userId: user?.user_id || null,
        addressId: null, // Sẽ được tạo trong backend cho guest
        subtotal: calculateSubtotal(),
        shippingFee: calculateShipping(),
        taxAmount: 0,
        discountAmount: discountAmount,
        totalAmount: calculateTotal(),
        notes: formData.note || null,
        paymentMethod: formData.paymentMethod,
        couponId: appliedCoupon?.coupon_id || null
      };

      // Chuẩn bị thông tin giao hàng (cho cả guest và user đã đăng nhập nếu chưa có addressId)
      const shippingAddress = !orderData.addressId ? {
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        province: formData.province,
        district: formData.district,
        address: formData.address,
        note: formData.note
      } : null;
      
     

      // Chuẩn bị items
      const items = cartItems.map(item => ({
        variantId: item.variant_id,
        productName: item.product_name || item.productName,
        variantName: item.variant_name || item.variantName || null,
        sku: item.sku || null,
        quantity: item.quantity,
        unitPrice: item.price || item.current_price || item.currentPrice,
        discountAmount: 0
      }));

      // Gọi API tạo đơn hàng
      const response = await createOrder({
        orderData,
        shippingAddress,
        items
      });

      // Xóa giỏ hàng sau khi đặt hàng thành công
      const cartId = cart?.cart_id || cart?.cartId;
      if (cartId) {
        await clearCart(cartId);
      }
      
      // Reset cart items state
      resetCartItems();

      // Xóa coupon khỏi localStorage sau khi đặt hàng thành công
      localStorage.removeItem('applied_coupon');
      localStorage.removeItem('discount_amount');

      toast.success('Đặt hàng thành công!');
      
      // Chuyển đến trang thanh toán
      const orderId = response?.data?.orderId || response?.data?.order_id;
      if (orderId) {
        navigate(`/payment/${orderId}`);
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error(error.response?.data?.message || 'Đặt hàng thất bại. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Checkout Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Information */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Thông tin giao hàng</CardTitle>
                <CardDescription>
                  Vui lòng điền đầy đủ thông tin giao hàng
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="fullName"
                        rules={{ required: "Vui lòng nhập họ tên" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Họ tên</FormLabel>
                            <FormControl>
                              <Input placeholder="Nguyễn Văn A" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        rules={{ required: "Vui lòng nhập số điện thoại" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Số điện thoại</FormLabel>
                            <FormControl>
                              <Input placeholder="0123456789" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="email"
                      rules={{ required: "Vui lòng nhập email" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="example@email.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="province"
                        rules={{ required: "Vui lòng chọn tỉnh/thành" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tỉnh/Thành phố</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Chọn tỉnh/thành" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="hcm">TP. Hồ Chí Minh</SelectItem>
                                <SelectItem value="hn">Hà Nội</SelectItem>
                                {/* Add more cities */}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="district"
                        rules={{ required: "Vui lòng chọn quận/huyện" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quận/Huyện</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Chọn quận/huyện" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="q1">Quận 1</SelectItem>
                                <SelectItem value="q2">Quận 2</SelectItem>
                                {/* Add more districts */}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="address"
                      rules={{ required: "Vui lòng nhập địa chỉ" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Địa chỉ</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Số nhà, tên đường..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="note"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ghi chú</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Ghi chú về đơn hàng..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={isLoadingCart || !cartItems || cartItems.length === 0}
                    >
                      Tiếp tục
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Payment Method */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Phương thức thanh toán</CardTitle>
                <CardDescription>
                  Chọn phương thức thanh toán phù hợp
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="paymentMethod"
                      rules={{ required: "Vui lòng chọn phương thức thanh toán" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="space-y-4"
                            >
                              <div className="flex items-center space-x-2 border rounded-lg p-4">
                                <RadioGroupItem value="cod" id="cod" />
                                <label
                                  htmlFor="cod"
                                  className="flex flex-col cursor-pointer"
                                >
                                  <span className="font-medium">
                                    Thanh toán khi nhận hàng (COD)
                                  </span>
                                  <span className="text-sm text-gray-500">
                                    Thanh toán bằng tiền mặt khi nhận hàng
                                  </span>
                                </label>
                              </div>
                              <div className="flex items-center space-x-2 border rounded-lg p-4">
                                <RadioGroupItem value="banking" id="banking" />
                                <label
                                  htmlFor="banking"
                                  className="flex flex-col cursor-pointer"
                                >
                                  <span className="font-medium">
                                    Chuyển khoản ngân hàng
                                  </span>
                                  <span className="text-sm text-gray-500">
                                    Thanh toán qua tài khoản ngân hàng
                                  </span>
                                </label>
                              </div>
                              <div className="flex items-center space-x-2 border rounded-lg p-4">
                                <RadioGroupItem value="momo" id="momo" />
                                <label
                                  htmlFor="momo"
                                  className="flex flex-col cursor-pointer"
                                >
                                  <span className="font-medium">Ví Momo</span>
                                  <span className="text-sm text-gray-500">
                                    Thanh toán qua ví điện tử Momo
                                  </span>
                                </label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex flex-col gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep(1)}
                        className="w-full"
                        disabled={isSubmitting}
                      >
                        Quay lại
                      </Button>
                      <Button 
                        type="submit" 
                        className="w-full"
                        disabled={isSubmitting || isLoadingCart}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Đang xử lý...
                          </>
                        ) : (
                          'Đặt hàng'
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Đơn hàng của bạn</CardTitle>
              <CardDescription>
                {cartItems?.length || 0} sản phẩm trong giỏ hàng
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingCart ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p className="text-sm text-gray-500">Đang tải...</p>
                </div>
              ) : cartItems && cartItems.length > 0 ? (
                <>
                  <ScrollArea className="h-[300px] pr-4">
                    {cartItems.map((item) => {
                      const imageUrl = item.image_url || item.imageUrl || 'https://via.placeholder.com/100';
                      const productName = item.product_name || item.productName || item.name || 'Sản phẩm';
                      const variantName = item.variant_name || item.variantName || '';
                      const displayName = variantName ? `${productName}` : productName;
                      const itemPrice = item.price || item.current_price || item.currentPrice || 0;
                      
                      return (
                        <div key={item.cart_item_id} className="flex gap-4 py-4 border-b last:border-0">
                          <img
                            src={imageUrl}
                            alt={displayName}
                            className="w-20 h-20 object-cover rounded"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/100';
                            }}
                          />
                          <div className="flex-1">
                            <h4 className="font-medium line-clamp-2">{displayName}</h4>
                            {item.sku && (
                              <div className="text-xs text-gray-400">SKU: {item.sku}</div>
                            )}
                            <div className="text-sm text-gray-500 mt-1">
                              Số lượng: {item.quantity}
                            </div>
                            <div className="font-medium text-red-600 mt-1">
                              {formatPrice(itemPrice)}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </ScrollArea>
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Giỏ hàng trống</p>
                  <Link to="/products">
                    <Button variant="outline" className="mt-4">
                      Tiếp tục mua sắm
                    </Button>
                  </Link>
                </div>
              )}

              {!isLoadingCart && cartItems && cartItems.length > 0 && (
                <>
                  <Separator className="my-4" />

                  {/* Hiển thị coupon đã áp dụng */}
                  {appliedCoupon && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4 text-green-600" />
                          <div>
                            <p className="text-sm font-medium text-green-900">
                              {appliedCoupon.coupon_code}
                            </p>
                            {appliedCoupon.description && (
                              <p className="text-xs text-green-700">
                                {appliedCoupon.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setAppliedCoupon(null);
                            setDiscountAmount(0);
                            localStorage.removeItem('applied_coupon');
                            localStorage.removeItem('discount_amount');
                            toast.success("Đã xóa mã giảm giá");
                          }}
                          className="h-8 w-8 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tạm tính:</span>
                      <span>{formatPrice(calculateSubtotal())}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Phí vận chuyển:</span>
                      <span>{formatPrice(calculateShipping())}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Giảm giá:</span>
                        <span>-{formatPrice(discountAmount)}</span>
                      </div>
                    )}
                    <Separator className="my-2" />
                    <div className="flex justify-between font-medium">
                      <span>Tổng cộng:</span>
                      <span className="text-lg text-red-600">
                        {formatPrice(calculateTotal())}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
