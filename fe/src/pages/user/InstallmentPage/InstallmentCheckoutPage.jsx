import React, { useState, useEffect } from 'react';
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
import { ShoppingCart, CreditCard, ArrowLeft, Truck } from 'lucide-react';
import { useCartItemStore } from '@/stores/useCartItemStore';
import { useOrderStore } from '@/stores/useOrderStore';
import { useUserAuthStore } from '@/stores/useUserAuthStore';
import { useShippingStore } from '@/stores/useShippingStore';
import { toast } from 'sonner';

// Base URL for serving uploads
const BASE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const toAbsoluteUrl = (url) => {
  if (!url) return url;
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith('/uploads')) return `${BASE_API_URL}${url}`;
  return url;
};

const InstallmentCheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUserAuthStore();
  const { cartItems, reset: resetCartItems } = useCartItemStore();
  const { createOrder, loading: orderLoading } = useOrderStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Shipping states
  const {
    provinces,
    districts,
    wards,
    fetchProvinces,
    fetchDistricts,
    fetchWards,
    calculateShippingFee,
    resetDistricts,
    resetWards,
  } = useShippingStore();
  
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);
  const [shippingFee, setShippingFee] = useState(0);
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);

  // Get installment data from navigation state
  const installmentData = location.state || {};
  const {
    cartTotal = 0,
    selectedMonths = 6,
    selectedDownPaymentPercent = 20,
    calculation = null,
    selectedPolicy = null,
    paymentSchedule = [],
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
      ward: '',
      address: '',
      note: '',
      idNumber: '',
    },
  });

  // Fetch provinces on mount
  useEffect(() => {
    fetchProvinces();
  }, []);

  // Calculate shipping fee when ward is selected
  useEffect(() => {
    if (selectedDistrict && selectedWard && cartItems && cartItems.length > 0) {
      calculateShippingFeeForOrder();
    }
  }, [selectedDistrict, selectedWard, cartItems]);

  // Calculate shipping fee for the order
  const calculateShippingFeeForOrder = async () => {
    try {
      setIsCalculatingShipping(true);
      
      const districtId = parseInt(selectedDistrict);
      const wardCode = selectedWard;
      
      // Calculate weight (assume 500g per item)
      const totalWeight = cartItems.reduce((total, item) => {
        return total + (parseInt(item.quantity || 1) * 500);
      }, 0);
      
      // Calculate insurance value (product total)
      const insuranceValue = cartItems.reduce((total, item) => {
        return total + (parseFloat(item.price || 0) * parseInt(item.quantity || 1));
      }, 0);
      
      const payload = {
        toDistrictId: districtId,
        toWardCode: wardCode,
        weight: totalWeight,
        insuranceValue: insuranceValue
      };
      
      const result = await calculateShippingFee(payload);
      
      if (result && result.total) {
        setShippingFee(result.total);
        toast.success(`Phí vận chuyển: ${formatCurrency(result.total)}`);
      } else {
        setShippingFee(50000);
        toast.info('Sử dụng phí vận chuyển mặc định: 50.000đ');
      }
    } catch (error) {
      console.error('Error calculating shipping fee:', error);
      setShippingFee(50000);
      toast.error('Không thể tính phí vận chuyển, sử dụng phí mặc định');
    } finally {
      setIsCalculatingShipping(false);
    }
  };

  // Handle province change
  const handleProvinceChange = async (provinceId) => {
    setSelectedProvince(provinceId);
    setSelectedDistrict(null);
    setSelectedWard(null);
    resetDistricts();
    resetWards();
    form.setValue('province', String(provinceId));
    form.setValue('district', '');
    form.setValue('ward', '');
    setShippingFee(0);
    
    if (provinceId) {
      await fetchDistricts(provinceId);
    }
  };

  // Handle district change
  const handleDistrictChange = async (districtId) => {
    setSelectedDistrict(districtId);
    setSelectedWard(null);
    resetWards();
    form.setValue('district', String(districtId));
    form.setValue('ward', '');
    setShippingFee(0);
    
    if (districtId) {
      await fetchWards(districtId);
    }
  };

  // Handle ward change
  const handleWardChange = (wardCode) => {
    setSelectedWard(wardCode);
    form.setValue('ward', wardCode);
  };

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
        shippingFee: shippingFee,
        taxAmount: 0,
        notes: formData.note || null,
        paymentMethod: 'installment',
        // paymentStatus: 'paid',
        // orderStatus: 'confirmed',
        installmentDetails: {
          months: selectedPolicy?.terms || selectedMonths,
          downPayment: calculation.downPaymentAmount,
          monthlyPayment: calculation.monthlyPaymentWithFee || calculation.monthlyPayment,
          totalWithInterest: calculation.totalPayment,
          interestRate: selectedPolicy?.interest_rate || 0, // Lấy từ policy đã chọn
          installmentFeePercent: selectedPolicy?.installment_fee_percent || 0, // Phí trả góp
          policyId: selectedPolicy?.policy_id || null, // ID policy để tracking
          idNumber: formData.idNumber,
        },
      };

      const shippingAddress = {
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        province: provinces.find(p => p.ProvinceID === parseInt(formData.province))?.ProvinceName || '',
        provinceId: parseInt(formData.province),
        district: districts.find(d => d.DistrictID === parseInt(formData.district))?.DistrictName || '',
        districtId: parseInt(formData.district),
        ward: wards.find(w => w.WardCode === formData.ward)?.WardName || '',
        wardCode: formData.ward,
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
        // toast.success('Hợp đồng trả góp đã được gửi, đang chờ xét duyệt!');
        
        // Navigate to pending page with all data
        navigate('/installment/pending', {
          state: {
            orderId: response.data.orderId,
            userId: response.data.userId,
            installmentId: response.data.installmentId,
            cartItems: cartItems,
            calculation: calculation,
            paymentSchedule: paymentSchedule,
            selectedMonths: selectedMonths,
            selectedDownPaymentPercent: selectedDownPaymentPercent,
            userInfo: {
              username: guestUserData?.username || user?.username,
              fullName: formData.fullName,
              email: formData.email,
              phone: formData.phone,
              idNumber: formData.idNumber
            },
            shippingAddress: shippingAddress,
            shippingFee: shippingFee
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
        .normalize('NFD') // tách chữ cái thành 2 phần: chữ gốc và dấu
        .replace(/[\u0300-\u036f]/g, '') // bỏ tất cả phần dấu
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
                  const imageUrl = toAbsoluteUrl(item.image_url || item.imageUrl) || null;
                  const productName = item.product_name || item.productName || 'Sản phẩm';
                  const variantName = item.variant_name || item.variantName || '';
                  const price = parseFloat(item.price || 0);
                  const quantity = parseInt(item.quantity || 1);

                  return (
                    <div key={item.cart_item_id} className="flex gap-3 pb-4 border-b last:border-0">
                      <div className="relative w-16 h-16 rounded-md border overflow-hidden bg-gray-100">
                        {imageUrl ? (
                          <img 
                            src={imageUrl}
                            alt={productName}
                            className="w-16 h-16 object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        ) : null}
                        <div className={`absolute inset-0 flex items-center justify-center text-xs text-gray-400 ${imageUrl ? 'hidden' : ''}`}>
                          Không có ảnh
                        </div>
                      </div>
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

          {/* Shipping Fee Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="w-5 h-5" />
                Phí vận chuyển
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {isCalculatingShipping ? (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-500">Đang tính phí vận chuyển...</p>
                  </div>
                ) : shippingFee > 0 ? (
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Phí giao hàng</span>
                      <span className="text-lg font-bold text-green-600">
                        {formatCurrency(shippingFee)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Phí vận chuyển được tính riêng, không tính vào trả góp
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-500">Chọn địa chỉ giao hàng để tính phí</p>
                  </div>
                )}
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

                {calculation.firstMonthPayment && calculation.lastMonthPayment ? (
                  <div className="bg-blue-50 p-3 rounded-lg space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Tháng đầu</span>
                      <span className="text-sm font-semibold text-red-600">
                        {formatCurrency(calculation.firstMonthPayment)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Tháng cuối</span>
                      <span className="text-sm font-semibold text-green-600">
                        {formatCurrency(calculation.lastMonthPayment)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-1 border-t border-blue-200">
                      <span className="text-xs text-gray-600">Trung bình/tháng</span>
                      <span className="text-base font-bold text-blue-900">
                        {formatCurrency(calculation.averageMonthlyPayment)}
                      </span>
                    </div>
                  </div>
                ) : (
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
                )}

                <Separator />

                <div className="flex justify-between items-start">
                  <span className="text-sm text-gray-600">Tổng tiền trả góp</span>
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-900">
                      {formatCurrency(calculation.totalPayment)}
                    </p>
                  </div>
                </div>

                {shippingFee > 0 && (
                  <>
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-600">Phí vận chuyển</span>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-green-600">
                          {formatCurrency(shippingFee)}
                        </p>
                      </div>
                    </div>

                    <Separator className="border-dashed" />

                    <div className="flex justify-between items-start bg-red-50 p-3 rounded-lg">
                      <span className="text-base font-semibold text-gray-900">Tổng thanh toán</span>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-red-600">
                          {formatCurrency(calculation.totalPayment + shippingFee)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Trả góp + Vận chuyển
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <Separator />

              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Lãi suất:</span>
                  <span className="font-semibold text-blue-600">
                    {calculation.interestRate}%/năm (Dư nợ giảm dần)
                  </span>
                </div>
              </div>

              {/* Payment Schedule Mini Table */}
              {paymentSchedule && paymentSchedule.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-xs font-semibold text-gray-700 mb-2">Lịch trả góp chi tiết</h4>
                  <div className="border rounded-lg overflow-hidden">
                    <div className="max-h-48 overflow-y-auto">
                      <table className="w-full text-xs">
                        <thead className="bg-gray-50 sticky top-0">
                          <tr>
                            <th className="px-2 py-1 text-left font-medium text-gray-700">Kỳ</th>
                            <th className="px-2 py-1 text-right font-medium text-gray-700">Số tiền</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {paymentSchedule.map((payment) => (
                            <tr key={payment.month} className="hover:bg-gray-50">
                              <td className="px-2 py-1.5 text-left">Tháng {payment.month}</td>
                              <td className="px-2 py-1.5 text-right font-medium text-red-600">
                                {formatCurrency(payment.total)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    💡 Số tiền giảm dần mỗi tháng theo phương pháp dư nợ giảm dần
                  </p>
                </div>
              )}
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
                                handleProvinceChange(value);
                              }}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Chọn tỉnh/thành phố" />
                              </SelectTrigger>
                              <SelectContent>
                                {provinces?.map((province) => (
                                  <SelectItem 
                                    key={province.ProvinceID} 
                                    value={String(province.ProvinceID)}
                                  >
                                    {province.ProvinceName}
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
                              onValueChange={(value) => {
                                handleDistrictChange(value);
                              }}
                              disabled={!selectedProvince || districts.length === 0}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Chọn quận/huyện" />
                              </SelectTrigger>
                              <SelectContent>
                                {districts?.map((district) => (
                                  <SelectItem 
                                    key={district.DistrictID} 
                                    value={String(district.DistrictID)}
                                  >
                                    {district.DistrictName}
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
                      name="ward"
                      rules={{ required: "Vui lòng chọn phường/xã" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phường/Xã</FormLabel>
                          <FormControl>
                            <Select 
                              value={field.value}
                              onValueChange={(value) => {
                                handleWardChange(value);
                              }}
                              disabled={!selectedDistrict || wards.length === 0}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Chọn phường/xã" />
                              </SelectTrigger>
                              <SelectContent>
                                {wards?.map((ward) => (
                                  <SelectItem 
                                    key={ward.WardCode} 
                                    value={ward.WardCode}
                                  >
                                    {ward.WardName}
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
