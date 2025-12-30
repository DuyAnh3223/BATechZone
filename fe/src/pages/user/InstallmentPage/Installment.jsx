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
  CheckCircle2,
  Info  
} from 'lucide-react';
import { useCartItemStore } from '@/stores/useCartItemStore';
import { useCartStore } from '@/stores/useCartStore';
import { useOrderStore } from '@/stores/useOrderStore';
import { useUserAuthStore } from '@/stores/useUserAuthStore';
import { useInstallmentPolicyStore } from '@/stores/useInstallmentPolicyStore';
import { toast } from 'sonner';

// Base URL for serving uploads
const BASE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const toAbsoluteUrl = (url) => {
  if (!url) return url;
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith('/uploads')) return `${BASE_API_URL}${url}`;
  return url;
};

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
  const { user } = useUserAuthStore();
  const { cartItems, reset: resetCartItems } = useCartItemStore();
  const { cart } = useCartStore();
  const { activePolicies, loading: policiesLoading, fetchActivePolicies } = useInstallmentPolicyStore();

  const [selectedPolicyId, setSelectedPolicyId] = useState(null);
  const [selectedDownPaymentPercent, setSelectedDownPaymentPercent] = useState(30);
  const [calculation, setCalculation] = useState(null);
  const [paymentSchedule, setPaymentSchedule] = useState([]);
  const { createOrder, loading: orderLoading } = useOrderStore();

  // Fetch active policies on mount
  useEffect(() => {
    fetchActivePolicies();
  }, [fetchActivePolicies]);

  // Set default selected policy when policies load
  useEffect(() => {
    if (activePolicies.length > 0 && !selectedPolicyId) {
      setSelectedPolicyId(activePolicies[0].policy_id);
      setSelectedDownPaymentPercent(activePolicies[0].min_down_payment);
    }
  }, [activePolicies, selectedPolicyId]);

  // Get selected policy
  const selectedPolicy = activePolicies.find(p => p.policy_id === selectedPolicyId);

  // Generate down payment options based on min_down_payment
  const downPaymentOptions = React.useMemo(() => {
    if (!selectedPolicy) return [];
    const minDown = selectedPolicy.min_down_payment;
    const options = [0, 10, 20, 30, 40, 50, 60, 70, 80];
    return options.filter(opt => opt >= minDown).map(opt => ({
      value: opt,
      label: `${opt}%`
    }));
  }, [selectedPolicy]);

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

  // Calculate installment details with declining balance method
  useEffect(() => {
    if (!selectedPolicy || cartTotal === 0) return;

    const totalAmount = cartTotal;
    const downPaymentAmount = (totalAmount * selectedDownPaymentPercent) / 100;
    const remainingAmount = totalAmount - downPaymentAmount;


    const selectedMonths = selectedPolicy.terms;
    const monthlyInterestRate = selectedPolicy.interest_rate / 100 / 12;
    const feePercent = selectedPolicy.installment_fee_percent || 0;
    const totalFee = (remainingAmount * feePercent) / 100;
    const monthlyFee = totalFee / selectedMonths;
    
    // Dư nợ giảm dần
    const principalPerMonth = remainingAmount / selectedMonths; // Gốc
    let balance = remainingAmount; 
    const schedule = [];
    let totalInterestPaid = 0;
    
    for (let i = 1; i <= selectedMonths; i++) {
      const openingBalance = balance;
      const interest = balance * monthlyInterestRate;
      
      // Tháng cuối: điều chỉnh principal để balance = 0 chính xác
      const principal = i === selectedMonths ? balance : principalPerMonth;
      
      const total = Math.round((principal + interest + monthlyFee) * 100) / 100;
      balance -= principal;
      totalInterestPaid += interest;
      
      schedule.push({
        month: i,
        openingBalance: Math.round(openingBalance * 100) / 100,
        principal: Math.round(principal * 100) / 100,
        interest: Math.round(interest * 100) / 100,
        fee: Math.round(monthlyFee * 100) / 100,
        total: total,
        remainingBalance: Math.round(Math.max(0, balance) * 100) / 100
      });
    }
    
    setPaymentSchedule(schedule);

    const totalPayment = downPaymentAmount + schedule.reduce((sum, p) => sum + p.total, 0);
    const difference = totalPayment - totalAmount;

    setCalculation({
      totalAmount,
      downPaymentAmount,
      remainingAmount,
      principalPerMonth: Math.round(principalPerMonth * 100) / 100,
      firstMonthPayment: schedule[0].total,
      lastMonthPayment: schedule[selectedMonths - 1].total,
      averageMonthlyPayment: Math.round((schedule.reduce((sum, p) => sum + p.total, 0) / selectedMonths) * 100) / 100,
      monthlyFee,
      totalFee,
      totalPayment,
      totalInterest: Math.round(totalInterestPaid * 100) / 100,
      difference,
      interestRate: selectedPolicy.interest_rate,
      feePercent,
      terms: selectedMonths
    });
  }, [selectedPolicyId, selectedDownPaymentPercent, cartTotal, selectedPolicy]);

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
              {/* Policy Selection */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-3 block">
                  Chọn chính sách trả góp
                </label>
                {policiesLoading ? (
                  <div className="text-center py-8 text-gray-500">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-2 text-sm">Đang tải chính sách...</p>
                  </div>
                ) : activePolicies.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Info className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Hiện chưa có chính sách trả góp nào</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {activePolicies.map((policy) => (
                      <div
                        key={policy.policy_id}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                          selectedPolicyId === policy.policy_id
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                        onClick={() => {
                          setSelectedPolicyId(policy.policy_id);
                          // Reset down payment to min when changing policy
                          if (selectedDownPaymentPercent < policy.min_down_payment) {
                            setSelectedDownPaymentPercent(policy.min_down_payment);
                          }
                        }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-gray-900">{policy.name}</h3>
                          {selectedPolicyId === policy.policy_id && (
                            <CheckCircle2 className="w-5 h-5 text-blue-600" />
                          )}
                        </div>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Kỳ hạn:</span>
                            <span className="font-medium">{policy.terms} tháng</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Lãi suất:</span>
                            <span className="font-medium text-green-600">{policy.interest_rate}%/năm</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Trả trước tối thiểu:</span>
                            <span className="font-medium text-orange-600">≥{policy.min_down_payment}%</span>
                          </div>
                          {policy.installment_fee_percent > 0 && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Phí trả góp:</span>
                              <span className="font-medium text-red-600">{policy.installment_fee_percent}%</span>
                            </div>
                          )}
                        </div>
                        {policy.description && (
                          <p className="mt-2 text-xs text-gray-500 line-clamp-2">
                            {policy.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Separator />

            

              {/* Calculation Details */}
              {selectedPolicy && calculation && (
                <div className="space-y-4">
                  {/* Policy Description */}
                  {selectedPolicy.description && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Info className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-blue-900 mb-1">Thông tin chính sách</p>
                          <p className="text-sm text-blue-800">{selectedPolicy.description}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm text-gray-600">Giá sản phẩm</label>
                      <p className="text-lg font-semibold">{formatCurrency(calculation.totalAmount)}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-600">Tổng phải trả</label>
                      <p className="text-lg font-semibold text-red-600">
                        {formatCurrency(calculation.totalPayment)}
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
                    <div className="flex items-center gap-2 text-sm">
                      {selectedDownPaymentPercent < selectedPolicy.min_down_payment ? (
                        <>
                          <AlertCircle className="w-4 h-4 text-orange-500" />
                          <span className="text-orange-600 font-medium">
                            Không đủ điều kiện: Trả trước tối thiểu là {selectedPolicy.min_down_payment}%
                          </span>   
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          <span className="text-green-600 font-medium">
                            ✓ Đủ điều kiện trả góp
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* Payment Details */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Kỳ hạn</span>
                      <span className="text-sm font-semibold">
                        {calculation.terms} tháng
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Lãi suất</span>
                      <span className="text-sm font-semibold text-green-600">
                        {calculation.interestRate}%/năm (Dư nợ giảm dần)
                      </span>
                    </div>

                    {calculation.feePercent > 0 && (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Phí trả góp</span>
                          <span className="text-sm font-semibold text-orange-600">
                            {calculation.feePercent}% ({formatCurrency(calculation.totalFee)})
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Phí mỗi tháng</span>
                          <span className="text-sm font-semibold text-orange-600">
                            {formatCurrency(calculation.monthlyFee)}
                          </span>
                        </div>
                      </>
                    )}

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Trả trước</span>
                      <span className="text-sm font-semibold">
                        {formatCurrency(calculation.downPaymentAmount)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Còn lại phải trả góp</span>
                      <span className="text-sm font-semibold">
                        {formatCurrency(calculation.remainingAmount)}
                      </span>
                    </div>

                    <Separator />

                    {/* Declining Balance Payment Info */}
                    
                  </div>

                  <Separator />

                  {/* Payment Schedule Table */}
                  {paymentSchedule.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">Lịch trả góp chi tiết</h3>
                      <div className="border rounded-lg overflow-hidden">
                        <div className="max-h-96 overflow-y-auto">
                          <table className="w-full text-xs">
                            <thead className="bg-gray-50 sticky top-0">
                              <tr>
                                <th className="px-2 py-2 text-left font-medium text-gray-700">Kỳ</th>
                                <th className="px-2 py-2 text-right font-medium text-gray-700">Dư nợ đầu kỳ</th>
                                <th className="px-2 py-2 text-right font-medium text-gray-700">Gốc</th>
                                <th className="px-2 py-2 text-right font-medium text-gray-700">Lãi</th>
                                {calculation.feePercent > 0 && (
                                  <th className="px-2 py-2 text-right font-medium text-gray-700">Phí</th>
                                )}
                                <th className="px-2 py-2 text-right font-medium text-gray-700">Tổng phải trả</th>
                                <th className="px-2 py-2 text-right font-medium text-gray-700">Dư nợ cuối kỳ</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {paymentSchedule.map((payment, index) => (
                                <tr 
                                  key={payment.month} 
                                  className={`hover:bg-gray-50 ${index === 0 ? 'bg-red-50' : index === paymentSchedule.length - 1 ? 'bg-green-50' : ''}`}
                                >
                                  <td className="px-2 py-2 text-left font-medium">{payment.month}</td>
                                  <td className="px-2 py-2 text-right text-gray-600">{formatCurrency(payment.openingBalance)}</td>
                                  <td className="px-2 py-2 text-right text-blue-600 font-medium">{formatCurrency(payment.principal)}</td>
                                  <td className="px-2 py-2 text-right text-orange-600">{formatCurrency(payment.interest)}</td>
                                  {calculation.feePercent > 0 && (
                                    <td className="px-2 py-2 text-right text-purple-600">{formatCurrency(payment.fee)}</td>
                                  )}
                                  <td className="px-2 py-2 text-right font-semibold text-red-600">{formatCurrency(payment.total)}</td>
                                  <td className="px-2 py-2 text-right text-gray-600">{formatCurrency(payment.remainingBalance)}</td>
                                </tr>
                              ))}
                            </tbody>
                            <tfoot className="bg-gray-100 font-semibold">
                              <tr>
                                <td className="px-2 py-2 text-left">Tổng</td>
                                <td className="px-2 py-2"></td>
                                <td className="px-2 py-2 text-right text-blue-700">
                                  {formatCurrency(paymentSchedule.reduce((sum, p) => sum + p.principal, 0))}
                                </td>
                                <td className="px-2 py-2 text-right text-orange-700">
                                  {formatCurrency(paymentSchedule.reduce((sum, p) => sum + p.interest, 0))}
                                </td>
                                {calculation.feePercent > 0 && (
                                  <td className="px-2 py-2 text-right text-purple-700">
                                    {formatCurrency(paymentSchedule.reduce((sum, p) => sum + p.fee, 0))}
                                  </td>
                                )}
                                <td className="px-2 py-2 text-right text-red-700">
                                  {formatCurrency(paymentSchedule.reduce((sum, p) => sum + p.total, 0))}
                                </td>
                                <td className="px-2 py-2"></td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </div>
                      <div className="mt-2 flex gap-4 text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-red-50 border border-red-200 rounded"></div>
                          <span>Tháng đầu</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-green-50 border border-green-200 rounded"></div>
                          <span>Tháng cuối</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-blue-100 rounded"></div>
                          <span>Gốc (cố định)</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-orange-100 rounded"></div>
                          <span>Lãi (giảm dần)</span>
                        </div>
                      </div>
                    </div>
                  )}

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
                        if (selectedDownPaymentPercent < selectedPolicy.min_down_payment) {
                          toast.error(`Vui lòng chọn trả trước tối thiểu ${selectedPolicy.min_down_payment}%`);
                          return;
                        }
                        navigate('/installment/checkout', {
                          state: {
                            cartTotal,
                            selectedDownPaymentPercent,
                            calculation,
                            selectedPolicy,
                            paymentSchedule
                          }
                        });
                      }}
                      disabled={selectedDownPaymentPercent < selectedPolicy.min_down_payment || policiesLoading}
                      className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {selectedDownPaymentPercent < selectedPolicy.min_down_payment 
                        ? 'Chưa đủ điều kiện' 
                        : 'Đặt mua trả góp'}
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
