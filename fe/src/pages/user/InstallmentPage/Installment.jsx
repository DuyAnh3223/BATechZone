import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  CreditCard, 
  ShoppingCart, 
  TrendingUp,
  AlertCircle,
  CheckCircle2  
} from 'lucide-react';
import { useCartItemStore } from '@/stores/useCartItemStore';
import { useCartStore } from '@/stores/useCartStore';
import { useOrderStore } from '@/stores/useOrderStore';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

// Base URL for serving uploads
const BASE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const toAbsoluteUrl = (url) => {
  if (!url) return url;
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith('/uploads')) return `${BASE_API_URL}${url}`;
  return url;
};

// Mock installment policies - replace with API call later
const installmentPolicies = [
  { months: 6, interest_rate: 2.2, min_down_payment: 20, name: 'Trả góp 6 tháng' },
  { months: 8, interest_rate: 1.9, min_down_payment: 20, name: 'Trả góp 8 tháng' },
  { months: 9, interest_rate: 1.9, min_down_payment: 20, name: 'Trả góp 9 tháng' },
  { months: 12, interest_rate: 1.9, min_down_payment: 20, name: 'Trả góp 12 tháng' },
  { months: 15, interest_rate: 1.9, min_down_payment: 20, name: 'Trả góp 15 tháng' },
  { months: 18, interest_rate: 1.9, min_down_payment: 20, name: 'Trả góp 18 tháng' },
];

const downPaymentOptions = [
  { value: 20, label: '20%' },
  { value: 30, label: '30%' },
  { value: 40, label: '40%' },
  { value: 50, label: '50%' },
];

// Provinces and districts
const provinces = [
  { name: 'TP. Hồ Chí Minh', code: 'hcm' },
  { name: 'Hà Nội', code: 'hanoi' },
  { name: 'Đà Nẵng', code: 'danang' },
  { name: 'Hải Phòng', code: 'haiphong' },
  { name: 'Cần Thơ', code: 'cantho' },
  { name: 'Bình Dương', code: 'binhdung' },
  { name: 'Đồng Nai', code: 'dongnai' },
  { name: 'Bà Rịa - Vũng Tàu', code: 'bariavungtau' },
];

const districtsByProvince = {
  hcm: [
    'Quận 1', 'Quận 2', 'Quận 3', 'Quận 4', 'Quận 5', 'Quận 6', 'Quận 7', 'Quận 8', 'Quận 9', 'Quận 10',
    'Quận 11', 'Quận 12', 'Quận Bình Thạnh', 'Quận Bình Tân', 'Quận Gò Vấp', 'Quận Phú Nhuận', 
    'Quận Tân Bình', 'Quận Tân Phú', 'Quận Thủ Đức', 'Huyện Bình Chánh', 'Huyện Cần Giờ', 'Huyện Hóc Môn'
  ],
  hanoi: [
    'Ba Đình', 'Bắc Từ Liêm', 'Chương Mỹ', 'Đan Phượng', 'Đông Anh', 'Gia Lâm', 'Hà Đông', 
    'Hoài Đức', 'Hoàng Mai', 'Long Biên', 'Phú Xuyên', 'Quốc Oai', 'Sơn Tây', 'Thanh Oai', 
    'Thanh Trì', 'Thạch Thất', 'Tây Hồ', 'Từ Liêm', 'Ứng Hòa'
  ],
  danang: ['Hải Châu', 'Cẩm Lệ', 'Ngũ Hành Sơn', 'Liên Chiểu', 'Sơn Trà', 'Thanh Khê'],
  haiphong: ['Hồng Bàng', 'Ngô Quyền', 'Lê Chân', 'Đồ Sơn', 'Kiến An', 'An Dương', 'Thủy Nguyên', 'Tiên Lãng'],
  cantho: ['Ninh Kiều', 'Bình Thủy', 'Cờ Đỏ', 'Phong Điền', 'Châu Thành', 'Vĩnh Thạnh', 'Thot Nốt'],
  binhdung: ['Thủ Dầu Một', 'Bến Cát', 'Dầu Tiếng', 'Chơn Thành', 'Phú Giáo', 'Tân Uyên'],
  dongnai: ['Biên Hoà', 'Long Khánh', 'Nhơn Trạch', 'Tân Phú', 'Vĩnh Cửu', 'Định Quán', 'Thống Nhất'],
  bariavungtau: ['Vũng Tàu', 'Bà Rịa', 'Long Điền', 'Đất Đỏ', 'Châu Đức', 'Xuyên Mộc', 'Tuy Phong']
};

const Installment = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, reset: resetCartItems } = useCartItemStore();
  const { cart } = useCartStore();

  const [selectedMonths, setSelectedMonths] = useState(6);
  const [selectedDownPaymentPercent, setSelectedDownPaymentPercent] = useState(20);
  const [calculation, setCalculation] = useState(null);
  const { createOrder, loading: orderLoading } = useOrderStore();

  // Get selected policy
  const selectedPolicy = installmentPolicies.find(p => p.months === selectedMonths);

  // Calculate total from cart items
  const calculateCartTotal = () => {
    if (!cartItems || cartItems.length === 0) return 0;
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.price || 0);
      const quantity = parseInt(item.quantity || 1);
      return total + (price * quantity);
    }, 0);
  };

  const cartTotal = calculateCartTotal();

  // Calculate installment details
  useEffect(() => {
    if (!selectedPolicy || cartTotal === 0) return;

    const totalAmount = cartTotal;
    const downPaymentAmount = (totalAmount * selectedDownPaymentPercent) / 100;
    const remainingAmount = totalAmount - downPaymentAmount;
    
    // Calculate monthly payment with interest
    const monthlyInterestRate = selectedPolicy.interest_rate / 100 / 12;
    let monthlyPayment;
    
    if (selectedPolicy.interest_rate > 0) {
      monthlyPayment = (remainingAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, selectedMonths)) 
        / (Math.pow(1 + monthlyInterestRate, selectedMonths) - 1);
    } else {
      monthlyPayment = remainingAmount / selectedMonths;
    }

    const totalPayment = downPaymentAmount + (monthlyPayment * selectedMonths);
    const totalInterest = totalPayment - totalAmount;
    const difference = totalPayment - totalAmount;

    setCalculation({
      totalAmount,
      downPaymentAmount,
      remainingAmount,
      monthlyPayment,
      totalPayment,
      totalInterest,
      difference,
      interestRate: selectedPolicy.interest_rate
    });
  }, [selectedMonths, selectedDownPaymentPercent, cartTotal, selectedPolicy]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg text-gray-600 mb-4">Giỏ hàng trống</p>
            <Button onClick={() => navigate('/cart')}>
              Quay lại giỏ hàng
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mua trả góp</h1>
        <p className="text-gray-600 mt-1">Chọn phương thức trả góp phù hợp với bạn</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Section - Cart Items */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Sản phẩm ({cartItems.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cartItems.map((item) => {
                  const imageUrl = toAbsoluteUrl(item.image_url || item.imageUrl) || null;
                  const productName = item.product_name || item.productName || 'Sản phẩm';
                  const variantName = item.variant_name || item.variantName || '';
                  const price = parseFloat(item.price || 0);
                  const quantity = parseInt(item.quantity || 1);

                  return (
                    <div key={item.cart_item_id} className="flex gap-3 pb-4 border-b last:border-0">
                      <div className="relative w-20 h-20 rounded-md border overflow-hidden bg-gray-100">
                        {imageUrl ? (
                          <img 
                            src={imageUrl}
                            alt={productName}
                            className="w-20 h-20 object-cover"
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

              <Separator className="my-4" />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tổng tiền:</span>
                  <span className="font-semibold">{formatCurrency(cartTotal)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Section - Installment Calculator */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Chọn số tháng trả góp
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Month Selection */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-3 block">
                  Chọn số tháng trả góp
                </label>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                  {installmentPolicies.map((policy) => (
                    <Button
                      key={policy.months}
                      variant={selectedMonths === policy.months ? 'default' : 'outline'}
                      className={`h-12 ${selectedMonths === policy.months ? 'border-2 border-blue-600' : ''}`}
                      onClick={() => setSelectedMonths(policy.months)}
                    >
                      {policy.months} tháng
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

            

              {/* Calculation Details */}
              {calculation && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm text-gray-600">Giá sản phẩm</label>
                      <p className="text-lg font-semibold">{formatCurrency(calculation.totalAmount)}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-600">Giá mua trả góp</label>
                      <p className="text-lg font-semibold text-red-600">
                        {formatCurrency(calculation.totalAmount)}
                      </p>
                    </div>
                  </div>

                  {/* Down Payment Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Trả trước</label>
                    <Select 
                      value={selectedDownPaymentPercent.toString()} 
                      onValueChange={(value) => setSelectedDownPaymentPercent(parseInt(value))}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {downPaymentOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value.toString()}>
                            {option.label} - {formatCurrency((cartTotal * option.value) / 100)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      {selectedDownPaymentPercent < selectedPolicy.min_down_payment ? (
                        <>
                          <AlertCircle className="w-4 h-4 text-orange-500" />
                          <span className="text-orange-600">
                            Trả trước tối thiểu: {selectedPolicy.min_down_payment}%
                          </span>   
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          <span className="text-green-600">
                            Đủ điều kiện trả góp
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* Payment Details */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Không hỗ trợ mức trả trước này</span>
                      <span className="text-sm font-medium">
                        {selectedDownPaymentPercent >= selectedPolicy.min_down_payment ? 'Không' : 'Có'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Lãi suất thực</span>
                      <span className="text-sm font-semibold text-blue-600">
                        {calculation.interestRate}%
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Góp mỗi tháng</span>
                      <span className="text-lg font-bold text-red-600">
                        {formatCurrency(calculation.monthlyPayment)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Không hỗ trợ thời hạn này</span>
                      <span className="text-sm font-medium">Không</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Tổng tiền phải trả</span>
                      <span className="text-lg font-bold">
                        {formatCurrency(calculation.totalPayment)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Chênh lệch với mua trả tháng</span>
                      <span className={`text-sm font-semibold ${calculation.difference > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {calculation.difference > 0 ? '+' : ''}{formatCurrency(calculation.difference)}
                      </span>
                    </div>
                  </div>

                  <Separator />


                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <Button 
                      variant="outline" 
                      size="lg"
                      onClick={() => navigate('/cart')}
                      className="border-gray-300"
                    >
                      Quay lại
                    </Button>
                    <Button 
                      size="lg"
                      onClick={() => {
                        navigate('/installment/checkout', {
                          state: {
                            cartTotal,
                            selectedMonths,
                            selectedDownPaymentPercent,
                            calculation,
                            selectedPolicy
                          }
                        });
                      }}
                      disabled={selectedDownPaymentPercent < selectedPolicy.min_down_payment}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Đặt mua
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Installment;
