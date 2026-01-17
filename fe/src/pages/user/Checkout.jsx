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

// Base URL for serving uploads
const BASE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const toAbsoluteUrl = (url) => {
  if (!url) return url;
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith('/uploads')) return `${BASE_API_URL}${url}`;
  return url;
};
import { Link, useNavigate } from "react-router";
import { useCartStore } from "@/stores/useCartStore";
import { useCartItemStore } from "@/stores/useCartItemStore";
import { useUserAuthStore } from "@/stores/useUserAuthStore";
import { useOrderStore } from "@/stores/useOrderStore";
import { useShippingStore } from "@/stores/useShippingStore";
import { couponService } from "@/services/couponService";
import { toast } from "sonner";
import { useEffect } from "react";
import { X, Tag, Wallet, CreditCard } from "lucide-react";

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useUserAuthStore();
  const { getOrCreateCart, cart, clearCart } = useCartStore();
  const { 
    cartItems, 
    fetchCartItems, 
    loading,
    reset: resetCartItems
  } = useCartItemStore();
  const { createOrder, loading: orderLoading } = useOrderStore();
  const {
    provinces,
    districts,
    wards,
    fetchProvinces,
    fetchDistricts,
    fetchWards,
    calculateShippingFee: calculateShippingFeeAPI,
    resetDistricts,
    resetWards,
  } = useShippingStore();
  const [isLoadingCart, setIsLoadingCart] = useState(true);
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);
  const [shippingFee, setShippingFee] = useState(0);
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
  
  const form = useForm({
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      province: "",
      district: "",
      ward: "",
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
        
        // Load provinces for shipping
        await fetchProvinces();
        
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
    return shippingFee; // Sử dụng phí ship từ API
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const shipping = calculateShipping();
    return Math.max(0, subtotal + shipping - discountAmount);
  };

  // Shipping handlers
  const handleProvinceChange = async (value) => {
    const provinceId = parseInt(value);
    const province = provinces.find(p => p.ProvinceID === provinceId);
    
    setSelectedProvince(provinceId);
    setSelectedDistrict(null);
    setSelectedWard(null);
    setShippingFee(0);
    resetDistricts();
    resetWards();
    
    form.setValue('province', province?.ProvinceName || '');
    form.setValue('district', '');
    form.setValue('ward', '');
    
    if (provinceId) {
      await fetchDistricts(provinceId);
    }
  };

  const handleDistrictChange = async (value) => {
    const districtId = parseInt(value);
    const district = districts.find(d => d.DistrictID === districtId);
    
    setSelectedDistrict(districtId);
    setSelectedWard(null);
    setShippingFee(0);
    resetWards();
    
    form.setValue('district', district?.DistrictName || '');
    form.setValue('ward', '');
    
    if (districtId) {
      await fetchWards(districtId);
    }
  };

  const handleWardChange = async (value) => {
    const ward = wards.find(w => w.WardCode === value);
    
    setSelectedWard(value);
    form.setValue('ward', ward?.WardName || '');
    
    // Tính phí vận chuyển khi đã chọn đầy đủ thông tin
    if (selectedDistrict && value) {
      await calculateShippingFeeForOrder(selectedDistrict, value);
    }
  };

  const calculateShippingFeeForOrder = async (districtId, wardCode) => {
    try {
      setIsCalculatingShipping(true);
      
      // Tính tổng khối lượng (giả sử mỗi sản phẩm 500g)
      const totalWeight = (cartItems?.length || 0) * 500;
      const insuranceValue = calculateSubtotal();
      
      const payload = {
        toDistrictId: districtId,
        toWardCode: wardCode,
        weight: totalWeight,
        insuranceValue: insuranceValue
      };
      
      const response = await calculateShippingFeeAPI(payload);
      
      if (response && response.total) {
        setShippingFee(response.total);
        toast.success(`Phí vận chuyển: ${formatPrice(response.total)}`);
      }
    } catch (error) {
      console.error('Error calculating shipping fee:', error);
      toast.error('Không thể tính phí vận chuyển');
      setShippingFee(50000); // Fallback to default
    } finally {
      setIsCalculatingShipping(false);
    }
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
        ward: formData.ward,
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

      // Nếu chọn Momo, tạo payment link
      if (formData.paymentMethod === 'momo') {
        const amount = calculateTotal();
        const description = `Thanh toán đơn hàng BATechZone - ${formData.fullName}`;
        const buyerName = formData.fullName;
        const buyerEmail = formData.email || `user_${Date.now()}@batechzone.com`;
        const buyerPhone = formData.phone;
        const buyerAddress = `${formData.address}, ${formData.ward}, ${formData.district}, ${formData.province}`;
        
        // Cập nhật payment_method, payment_status và order_status cho online payment
        const momoOrderData = {
          ...orderData,
          payment_method: 'momo',
          payment_status: 'paid', // Thanh toán online thành công = đã thanh toán
          order_status: 'shipping' // Đã thanh toán online -> Đang giao hàng
        };
        
        // Lưu thông tin order vào localStorage để tạo sau khi thanh toán
        localStorage.setItem('pending_order', JSON.stringify({
          orderData: momoOrderData,
          shippingAddress,
          items
        }));

        try {
          const paymentResponse = await fetch('http://localhost:5001/api/payments/create-payment-link', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
              amount,
              description,
              buyerName,
              buyerEmail,
              buyerPhone,
              buyerAddress,
              paymentType: 'wallet' // Momo sẽ hiển thị QR và ATM options
            })
          });

          const result = await paymentResponse.json();

          if (result.success && result.data?.checkoutUrl) {
            // Lưu orderId từ Momo vào momoOrderData để dùng làm transaction_id
            const momoOrderDataWithTxn = {
              ...momoOrderData,
              transaction_id: result.data.orderId // Lấy orderId từ Momo
            };
            
            // Cập nhật lại localStorage với transaction_id
            localStorage.setItem('pending_order', JSON.stringify({
              orderData: momoOrderDataWithTxn,
              shippingAddress,
              items
            }));
            
            toast.success('Đang chuyển đến trang thanh toán Momo...');
            // Chuyển hướng đến trang thanh toán Momo
            window.location.href = result.data.checkoutUrl;
            return; // Dừng thực thi
          } else {
            throw new Error(result.message || 'Không thể tạo link thanh toán Momo');
          }
        } catch (error) {
          console.error('Momo payment error:', error);
          toast.error(error.message || 'Không thể tạo link thanh toán Momo');
          setIsSubmitting(false);
          return;
        }
      }

      // Nếu chọn VNPay, tạo payment link
      if (formData.paymentMethod === 'vnpay') {
        const amount = calculateTotal();
        const description = `Thanh toán đơn hàng BATechZone - ${formData.fullName}`;
        const buyerName = formData.fullName;
        const buyerEmail = formData.email || `user_${Date.now()}@batechzone.com`;
        const buyerPhone = formData.phone;
        const buyerAddress = `${formData.address}, ${formData.ward}, ${formData.district}, ${formData.province}`;
        
        // Cập nhật payment_method cho VNPay, status sẽ được update sau khi thanh toán
        const vnpayOrderData = {
          ...orderData,
          payment_method: 'vnpay',
          payment_status: 'pending', // Chờ thanh toán, sẽ update sau
          order_status: 'pending' // Chờ xác nhận, sẽ update sau khi thanh toán
        };
        
        // Lưu thông tin order vào localStorage để tạo sau khi thanh toán
        localStorage.setItem('pending_order', JSON.stringify({
          orderData: vnpayOrderData,
          shippingAddress,
          items
        }));

        try {
          const paymentResponse = await fetch('http://localhost:5001/api/payments/create-vnpay-payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
              amount,
              description,
              buyerName,
              buyerEmail,
              buyerPhone,
              buyerAddress
            })
          });

          const result = await paymentResponse.json();

          if (result.success && result.data?.paymentUrl) {
            // Lưu orderId từ VNPay vào vnpayOrderData để dùng làm transaction_id
            const vnpayOrderDataWithTxn = {
              ...vnpayOrderData,
              transaction_id: result.data.orderId // Lấy orderId từ VNPay
            };
            
            // Cập nhật lại localStorage với transaction_id
            localStorage.setItem('pending_order', JSON.stringify({
              orderData: vnpayOrderDataWithTxn,
              shippingAddress,
              items
            }));
            
            toast.success('Đang chuyển đến trang thanh toán VNPay...');
            // Chuyển hướng đến trang thanh toán VNPay
            window.location.href = result.data.paymentUrl;
            return; // Dừng thực thi
          } else {
            throw new Error(result.message || 'Không thể tạo link thanh toán VNPay');
          }
        } catch (error) {
          console.error('VNPay payment error:', error);
          toast.error(error.message || 'Không thể tạo link thanh toán VNPay');
          setIsSubmitting(false);
          return;
        }
      }

      // Gọi API tạo đơn hàng (chỉ cho COD và các phương thức khác)
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
                              value={selectedProvince?.toString() || ''}
                              onValueChange={handleProvinceChange}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Chọn tỉnh/thành" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {provinces.map((province) => (
                                  <SelectItem key={province.ProvinceID} value={province.ProvinceID.toString()}>
                                    {province.ProvinceName}
                                  </SelectItem>
                                ))}
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
                              value={selectedDistrict?.toString() || ''}
                              onValueChange={handleDistrictChange}
                              disabled={!selectedProvince}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Chọn quận/huyện" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {districts.map((district) => (
                                  <SelectItem key={district.DistrictID} value={district.DistrictID.toString()}>
                                    {district.DistrictName}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="ward"
                      rules={{ required: "Vui lòng chọn phường/xã" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phường/Xã</FormLabel>
                          <Select
                            value={selectedWard || ''}
                            onValueChange={handleWardChange}
                            disabled={!selectedDistrict}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn phường/xã" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {wards.map((ward) => (
                                <SelectItem key={ward.WardCode} value={ward.WardCode}>
                                  {ward.WardName}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

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
                                <RadioGroupItem value="momo" id="momo" />
                                <label
                                  htmlFor="momo"
                                  className="flex items-center gap-2 cursor-pointer w-full"
                                >
                                  <Wallet className="h-5 w-5 text-pink-600" />
                                  <div className="flex flex-col">
                                    <span className="font-medium">
                                      Thanh toán qua Ví Momo
                                    </span>
                                    <span className="text-sm text-gray-500">
                                      Quét mã QR hoặc thanh toán bằng thẻ ATM
                                    </span>
                                  </div>
                                </label>
                              </div>
                              <div className="flex items-center space-x-2 border rounded-lg p-4">
                                <RadioGroupItem value="vnpay" id="vnpay" />
                                <label
                                  htmlFor="vnpay"
                                  className="flex items-center gap-2 cursor-pointer w-full"
                                >
                                  <CreditCard className="h-5 w-5 text-blue-600" />
                                  <div className="flex flex-col">
                                    <span className="font-medium">
                                      Thanh toán qua VNPay
                                    </span>
                                    <span className="text-sm text-gray-500">
                                      Thanh toán qua thẻ ATM, thẻ tín dụng, ví điện tử
                                    </span>
                                  </div>
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
                      const imageUrl = toAbsoluteUrl(item.image_url || item.imageUrl) || null;
                      const productName = item.product_name || item.productName || item.name || 'Sản phẩm';
                      const variantName = item.variant_name || item.variantName || '';
                      const displayName = variantName ? `${productName}` : productName;
                      const itemPrice = item.price || item.current_price || item.currentPrice || 0;
                      
                      return (
                        <div key={item.cart_item_id} className="flex gap-4 py-4 border-b last:border-0">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={displayName}
                              className="w-20 h-20 object-cover rounded"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                if (e.target.nextElementSibling) {
                                  e.target.nextElementSibling.style.display = 'flex';
                                }
                              }}
                            />
                          ) : null}
                          <div 
                            className={`w-20 h-20 rounded bg-gray-200 flex items-center justify-center ${imageUrl ? 'hidden' : ''}`}
                          >
                            <span className="text-gray-400 text-xs">Không có ảnh</span>
                          </div>
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
