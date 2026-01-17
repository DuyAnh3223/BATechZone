import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, CreditCard, User, Clock, CheckCircle2 } from 'lucide-react';

// Base URL for serving uploads
const BASE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const toAbsoluteUrl = (url) => {
  if (!url) return url;
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith('/uploads')) return `${BASE_API_URL}${url}`;
  return url;
};

const InstallmentPendingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get data from navigation state
  const pendingData = location.state || {};
  const {
    orderId,
    userId,
    installmentId,
    cartItems = [],
    calculation = null,
    paymentSchedule = [],
    selectedMonths = 6,
    selectedDownPaymentPercent = 20,
    userInfo = {},
    shippingAddress = {},
    shippingFee = 0
  } = pendingData;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Redirect if no data
  if (!orderId || !calculation) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-lg text-gray-600 mb-4">Không tìm thấy thông tin đơn hàng</p>
            <Button onClick={() => navigate('/')}>
              Về trang chủ
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="bg-yellow-100 p-4 rounded-full">
            <Clock className="w-16 h-16 text-yellow-600" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Đơn hàng đã được duyệt
        </h1>
        <p className="text-gray-600">
          Hợp đồng trả góp của bạn đã được duyệt
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Mã đơn hàng: <span className="font-semibold">#{orderId}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Section - Products & Payment Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Products List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Sản phẩm đã đặt ({cartItems?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cartItems?.map((item, index) => {
                  const imageUrl = toAbsoluteUrl(item.image_url || item.imageUrl) || null;
                  const productName = item.product_name || item.productName || 'Sản phẩm';
                  const variantName = item.variant_name || item.variantName || '';
                  const price = parseFloat(item.price || 0);
                  const quantity = parseInt(item.quantity || 1);

                  return (
                    <div key={index} className="flex gap-3 pb-4 border-b last:border-0">
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
            </CardContent>
          </Card>

          {/* Installment Information */}
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
                  <span className="text-sm text-gray-600">Kỳ hạn</span>
                  <span className="font-semibold">{selectedMonths} tháng</span>
                </div>

                <Separator />

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
                    <div className="text-center mb-2 pb-2 border-b border-blue-200">
                      <p className="text-xs font-semibold text-blue-700">Dư nợ giảm dần</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Gốc mỗi tháng (cố định)</span>
                      <span className="text-sm font-semibold text-blue-700">
                        {formatCurrency(calculation.principalPerMonth)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Tháng đầu tiên</span>
                      <span className="text-sm font-semibold text-red-600">
                        {formatCurrency(calculation.firstMonthPayment)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Tháng cuối cùng</span>
                      <span className="text-sm font-semibold text-green-600">
                        {formatCurrency(calculation.lastMonthPayment)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-blue-200">
                      <span className="text-xs text-gray-600">Trung bình mỗi tháng</span>
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
                  <span className="text-sm text-gray-600">Tổng tiền phải trả</span>
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-900">
                      {formatCurrency(calculation.totalPayment)}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Lãi suất:</span>
                    <span className="font-semibold text-green-700">
                      {calculation.interestRate}%/năm (Dư nợ giảm dần)
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    💡 Lãi tính theo dư nợ còn lại, giảm dần mỗi tháng
                  </p>
                </div>
              </div>

              {/* Full Payment Schedule Table */}
              {paymentSchedule && paymentSchedule.length > 0 && (
                <div className="mt-4">
                  <Separator className="mb-4" />
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">📋 Lịch trả góp chi tiết</h3>
                  <div className="border rounded-lg overflow-hidden">
                    <div className="max-h-[500px] overflow-y-auto">
                      <table className="w-full text-xs">
                        <thead className="bg-gray-50 sticky top-0 z-10">
                          <tr>
                            <th className="px-2 py-2 text-left font-semibold text-gray-700">Kỳ</th>
                            <th className="px-2 py-2 text-right font-semibold text-gray-700">Dư nợ đầu kỳ</th>
                            <th className="px-2 py-2 text-right font-semibold text-gray-700">Gốc</th>
                            <th className="px-2 py-2 text-right font-semibold text-gray-700">Lãi</th>
                            {calculation.feePercent > 0 && (
                              <th className="px-2 py-2 text-right font-semibold text-gray-700">Phí</th>
                            )}
                            <th className="px-2 py-2 text-right font-semibold text-gray-700">Tổng phải trả</th>
                            <th className="px-2 py-2 text-right font-semibold text-gray-700">Dư nợ cuối kỳ</th>
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
                        <tfoot className="bg-gray-100 font-semibold sticky bottom-0">
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
                  <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-600">
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
                      <span>Gốc (cố định mỗi tháng)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-orange-100 rounded"></div>
                      <span>Lãi (giảm dần)</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Section - User Information */}
        <div className="lg:col-span-1 space-y-6">
          {/* User Account Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Thông tin tài khoản
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                    <div className="">
                        <p className="text-xs text-gray-500">Tên đăng nhập</p>
                        <p className="font-medium">{userInfo.username || 'N/A'}</p>
                    </div>

                    <div className="">
                        <p className="text-xs text-gray-500">Mật khẩu</p>
                        <p className="font-medium">Số điện thoại của bạn</p>
                    </div>
                </div>
              <Separator />
              <div>
                <p className="text-xs text-gray-500">Họ và tên</p>
                <p className="font-medium">{userInfo.fullName || 'N/A'}</p>
              </div>
              <Separator />
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="font-medium">{userInfo.email || 'N/A'}</p>
              </div>
              <Separator />
              <div>
                <p className="text-xs text-gray-500">CMND/CCCD</p>
                <p className="font-medium">{userInfo.idNumber || 'N/A'}</p>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Địa chỉ giao hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-900 font-medium">{shippingAddress.fullName}</p>
                <p className="text-sm text-gray-600 mt-1">{shippingAddress.phone}</p>
              </div>
              <Separator />
              <div>
                <p className="text-xs text-gray-500 mb-1">Địa chỉ</p>
                <p className="text-sm text-gray-600">
                  {shippingAddress.address}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {shippingAddress.ward && `${shippingAddress.ward}, `}
                  {shippingAddress.district}, {shippingAddress.province}
                </p>
              </div>
              {shippingFee > 0 && (
                <>
                  <Separator />
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Phí vận chuyển</span>
                      <span className="text-base font-bold text-green-600">
                        {formatCurrency(shippingFee)}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Status Card */}
          {/* <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <Clock className="w-12 h-12 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Đang chờ xét duyệt
                  </h3>
                  <p className="text-sm text-gray-600">
                    Hợp đồng trả góp của bạn sẽ được quản trị viên xem xét trong vòng 24-48 giờ
                  </p>
                </div>
                <div className="space-y-2 text-left">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                    <p className="text-xs text-gray-600">
                      Bạn sẽ nhận được thông báo qua email khi hợp đồng được duyệt
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                    <p className="text-xs text-gray-600">
                      Sau khi được duyệt, bạn có thể thực hiện thanh toán lần đầu để kích hoạt hợp đồng
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card> */}

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              className="w-full" 
              onClick={() => navigate('/orders')}
            >
              Xem đơn hàng của tôi
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/')}
            >
              Về trang chủ
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstallmentPendingPage;
