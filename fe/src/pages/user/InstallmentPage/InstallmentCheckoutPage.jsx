import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ShoppingCart, CreditCard, ArrowLeft } from 'lucide-react';
import { useCartItemStore } from '@/stores/useCartItemStore';
import { useOrderStore } from '@/stores/useOrderStore';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

// Import constants
import { provinces, districtsByProvince } from './constants';

const InstallmentCheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { cartItems, reset: resetCartItems } = useCartItemStore();
  const { createOrder, loading: orderLoading } = useOrderStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState('hcm');

  // Get installment data from navigation state
  const installmentData = location.state || {};
  const {
    cartTotal = 0,
    selectedMonths = 6,
    selectedDownPaymentPercent = 20,
    calculation = null,
    selectedPolicy = null,
  } = installmentData;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const form = useForm({
    defaultValues: {
      fullName: user?.fullName || user?.username || '',
      phone: user?.phone || '',
      email: user?.email || '',
      province: '',
      district: '',
      address: '',
      note: '',
      idNumber: '',
    },
  });

  const handlePlaceOrder = async (formData) => {
    if (!calculation || !cartItems || cartItems.length === 0) {
      toast.error('Vui lòng chọn sản phẩm để mua trả góp');
      return;
    }

    try {
      setIsSubmitting(true);

      // Format items for backend
      const items = cartItems.map((item) => ({
        variantId: item.variant_id,
        productName: item.product_name || item.productName,
        variantName: item.variant_name || item.variantName || '',
        sku: item.sku || '',
        quantity: parseInt(item.quantity),
        unitPrice: parseFloat(item.price || 0),
        discountAmount: 0,
      }));

      // Prepare guest user data if not logged in
      let guestUserData = null;
      if (!user) {
        guestUserData = {
          username: generateUsername(formData.fullName, formData.phone),
          email: formData.email,
          password: formData.phone, // Phone as password
          fullName: formData.fullName,
          phone: formData.phone,
          role: 0,
          isActive: 1
        };
      }

      const orderData = {
        userId: user?.user_id || user?.userId || null,
        discountAmount: 0,
        shippingFee: 0,
        taxAmount: 0,
        notes: formData.note || null,
        paymentMethod: 'installment',
        installmentDetails: {
          months: selectedMonths,
          downPayment: calculation.downPaymentAmount,
          monthlyPayment: calculation.monthlyPayment,
          totalWithInterest: calculation.totalPayment,
          customerType: 'customer',
          idNumber: formData.idNumber,
          jobTitle: '',
          salary: 0,
          company: '',
          taxId: '',
        },
      };

      const shippingAddress = {
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        province: formData.province,
        district: formData.district,
        address: formData.address,
      };

      const requestData = {
        orderData,
        shippingAddress,
        items,
        guestUserData, // Include guest user data for backend
      };

      const response = await createOrder(requestData);

      if (response.success) {
        resetCartItems();
        toast.success('Hợp đồng trả góp đã được gửi, đang chờ xét duyệt!');
        
        // Navigate to pending page with all data
        navigate('/installment/pending', {
          state: {
            orderId: response.data.orderId,
            userId: response.data.userId,
            installmentId: response.data.installmentId,
            cartItems: cartItems,
            calculation: calculation,
            selectedMonths: selectedMonths,
            selectedDownPaymentPercent: selectedDownPaymentPercent,
            userInfo: {
              username: guestUserData?.username || user?.username,
              fullName: formData.fullName,
              email: formData.email,
              phone: formData.phone,
              idNumber: formData.idNumber
            },
            shippingAddress: shippingAddress
          }
        });
      } else {
        toast.error(response.message || 'Không thể tạo đơn hàng');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Có lỗi xảy ra khi tạo đơn hàng');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to generate username
  const generateUsername = (fullName, phone) => {
    // Remove Vietnamese accents and convert to lowercase
    const removeAccents = (str) => {
      return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .toLowerCase()
        .replace(/\s+/g, '');
    };
    
    const namePart = removeAccents(fullName);
    const phonePart = phone.slice(-3); // Last 3 digits
    return `${namePart}${phonePart}`;
  };

  // Redirect if no calculation data
  if (!calculation) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-lg text-gray-600 mb-4">Không tìm thấy thông tin trả góp</p>
            <Button onClick={() => navigate('/installment')}>
              Quay lại trang trả góp
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/installment')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Xác nhận đơn hàng trả góp</h1>
        <p className="text-gray-600 mt-1">Vui lòng điền đầy đủ thông tin để hoàn tất đơn hàng</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Section - Order Summary */}
        <div className="lg:col-span-1 space-y-6">
          {/* Products List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Sản phẩm ({cartItems?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cartItems?.map((item) => {
                  const imageUrl = item.image_url || item.imageUrl || 'https://via.placeholder.com/80';
                  const productName = item.product_name || item.productName || 'Sản phẩm';
                  const variantName = item.variant_name || item.variantName || '';
                  const price = parseFloat(item.price || 0);
                  const quantity = parseInt(item.quantity || 1);

                  return (
                    <div key={item.cart_item_id} className="flex gap-3 pb-4 border-b last:border-0">
                      <img 
                        src={imageUrl}
                        alt={productName}
                        className="w-16 h-16 object-cover rounded-md border"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                          {productName}
                        </h3>
                        {variantName && (
                          <p className="text-xs text-gray-500 mt-1">{variantName}</p>
                        )}
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500">x{quantity}</span>
                          <span className="text-sm font-semibold text-red-600">
                            {formatCurrency(price * quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Payment Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Thông tin trả góp
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-sm text-gray-600">Trả trước ({selectedDownPaymentPercent}%)</span>
                  <div className="text-right">
                    <p className="text-lg font-bold text-red-600">
                      {formatCurrency(calculation.downPaymentAmount)}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between items-start">
                  <span className="text-sm text-gray-600">
                    Góp mỗi tháng<br />
                    <span className="text-xs text-gray-500">(trong {selectedMonths} tháng)</span>
                  </span>
                  <div className="text-right">
                    <p className="text-lg font-bold text-blue-600">
                      {formatCurrency(calculation.monthlyPayment)}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between items-start">
                  <span className="text-sm text-gray-600">Tổng tiền</span>
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-900">
                      {formatCurrency(calculation.totalPayment)}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Lãi suất:</span>
                  <span className="font-semibold text-blue-600">
                    {calculation.interestRate}%/năm
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Section - User Information Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin người mua</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handlePlaceOrder)} className="space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Thông tin cá nhân</h3>
                    
                    <FormField
                      control={form.control}
                      name="fullName"
                      rules={{ required: "Vui lòng nhập họ và tên" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Họ và tên</FormLabel>
                          <FormControl>
                            <Input placeholder="Nhập họ và tên" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      rules={{
                        required: "Vui lòng nhập số điện thoại",
                        pattern: {
                          value: /^[0-9]{10,11}$/,
                          message: "Số điện thoại không hợp lệ",
                        },
                      }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Số điện thoại</FormLabel>
                          <FormControl>
                            <Input placeholder="Nhập số điện thoại" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      rules={{
                        required: "Vui lòng nhập email",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Email không hợp lệ",
                        },
                      }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="Nhập email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="idNumber"
                      rules={{ required: "Vui lòng nhập CMND/CCCD" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CMND/CCCD</FormLabel>
                          <FormControl>
                            <Input placeholder="Nhập CMND/CCCD" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  {/* Delivery Address */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Địa chỉ giao hàng</h3>
                    
                    <FormField
                      control={form.control}
                      name="province"
                      rules={{ required: "Vui lòng chọn tỉnh/thành" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tỉnh/Thành phố</FormLabel>
                          <FormControl>
                            <Select 
                              value={field.value} 
                              onValueChange={(value) => {
                                field.onChange(value);
                                setSelectedProvince(value);
                                form.setValue('district', '');
                              }}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Chọn tỉnh/thành phố" />
                              </SelectTrigger>
                              <SelectContent>
                                {provinces.map((prov) => (
                                  <SelectItem key={prov.code} value={prov.code}>
                                    {prov.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
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
                          <FormControl>
                            <Select 
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Chọn quận/huyện" />
                              </SelectTrigger>
                              <SelectContent>
                                {districtsByProvince[selectedProvince]?.map((district) => (
                                  <SelectItem key={district} value={district}>
                                    {district}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address"
                      rules={{ required: "Vui lòng nhập địa chỉ chi tiết" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Địa chỉ chi tiết</FormLabel>
                          <FormControl>
                            <Input placeholder="Số nhà, tên đường..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  {/* Notes */}
                  <FormField
                    control={form.control}
                    name="note"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ghi chú (tuỳ chọn)</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Ghi chú về đơn hàng..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate('/installment')}
                    >
                      Quay lại
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting || orderLoading}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {isSubmitting || orderLoading ? "Đang xử lý..." : "Xác nhận đặt mua"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InstallmentCheckoutPage;
