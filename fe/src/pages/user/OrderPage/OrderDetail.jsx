import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  Package, 
  Home, 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  CreditCard,
  Loader2,
  ArrowLeft
} from "lucide-react";
import { useOrderStore } from "@/stores/useOrderStore";
import { toast } from "sonner";
import { translateOrderStatus, translatePaymentMethod, translatePaymentStatus } from "@/utils/statusTranslations";

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { fetchOrderById } = useOrderStore();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        toast.error("Không tìm thấy mã đơn hàng");
        navigate("/orders");
        return;
      }

      try {
        setLoading(true);
        const response = await fetchOrderById(orderId);
        const orderData = response?.data || response;
        setOrder(orderData);
      } catch (error) {
        console.error("❌ Error loading order:", error);
        toast.error("Không thể tải thông tin đơn hàng");
        navigate("/orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, navigate, fetchOrderById]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return dateString;
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { className: "bg-gray-100 text-gray-600" },
      confirmed: { className: "bg-blue-100 text-blue-700" },
      processing: { className: "bg-yellow-100 text-yellow-700" },
      shipping: { className: "bg-indigo-100 text-indigo-700" },
      delivered: { className: "bg-green-100 text-green-700" },
      cancelled: { className: "bg-red-100 text-red-700" },
      refunded: { className: "bg-orange-100 text-orange-700" },
    };
    return {
      label: translateOrderStatus(status),
      className: statusMap[status]?.className || "bg-gray-100 text-gray-800"
    };
  };

  const getPaymentStatusBadge = (status) => {
    const statusMap = {
      unpaid: { className: "bg-red-100 text-red-800" },
      paid: { className: "bg-green-100 text-green-800" },
      refunded: { className: "bg-orange-100 text-orange-800" },
      pending: { className: "bg-yellow-100 text-yellow-800" },
      completed: { className: "bg-green-100 text-green-800" },
      failed: { className: "bg-red-100 text-red-800" },
    };
    return { 
      label: translatePaymentStatus(status), 
      className: statusMap[status]?.className || "bg-gray-100 text-gray-800" 
    };
  };

  const sumSubtotal = (items) => {
    if (!items || !Array.isArray(items)) return 0;
    return items.reduce((t, r) => {
      const subtotal = parseFloat(r.subtotal || r.subTotal || 0);
      return t + (isNaN(subtotal) ? 0 : subtotal);
    }, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-500">Đang tải thông tin đơn hàng...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center py-8">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Không tìm thấy đơn hàng</h3>
            <p className="text-gray-500 mb-4">Đơn hàng không tồn tại hoặc đã bị xóa</p>
            <Button onClick={() => navigate("/orders")} className="w-full">
              <Home className="h-4 w-4 mr-2" />
              Về danh sách đơn hàng
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const orderStatus = order.order_status || order.orderStatus || "pending";
  const paymentStatus = order.payment_status || order.paymentStatus || "unpaid";
  const orderNumber = order.order_number || order.orderNumber || `#${order.order_id || order.orderId}`;
  const totalAmount = parseFloat(order.total_amount || order.totalAmount || 0);
  const subtotal = parseFloat(order.subtotal || 0);
  const shippingFee = parseFloat(order.shipping_fee || order.shippingFee || 0);
  const discountAmount = parseFloat(order.discount_amount || order.discountAmount || 0);

  const statusBadge = getStatusBadge(orderStatus);
  const paymentBadge = getPaymentStatusBadge(paymentStatus);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="w-[95vw] mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/orders")}
            className="mb-4 text-base"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Về danh sách đơn hàng
          </Button>
          <div className="flex items-center gap-4 mb-3">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
            <h1 className="text-4xl font-bold text-gray-900">Chi tiết đơn hàng</h1>
          </div>
          <p className="text-lg text-gray-600">
            Mã đơn hàng: <span className="font-semibold text-indigo-600 text-xl">{orderNumber}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Package className="w-6 h-6" />
                  Thông tin đơn hàng
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-base text-gray-600 mb-2">Trạng thái đơn hàng</p>
                    <Badge className={`${statusBadge.className} text-base px-3 py-1`}>
                      {statusBadge.label}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-base text-gray-600 mb-2">Trạng thái thanh toán</p>
                    <Badge className={`${paymentBadge.className} text-base px-3 py-1`}>
                      {paymentBadge.label}
                    </Badge>
                  </div>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-base text-gray-600 mb-2">Phương thức thanh toán</p>
                    <p className="font-semibold text-lg">{translatePaymentMethod(order.payment_method || order.paymentMethod || 'cod')}</p>
                  </div>
                  <div>
                    <p className="text-base text-gray-600 mb-2">Ngày đặt hàng</p>
                    <p className="font-semibold text-lg">{formatDate(order.created_at || order.createdAt)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Details */}
            {order.payments && order.payments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <CreditCard className="w-6 h-6" />
                    Thông tin thanh toán
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.payments.map((payment, index) => (
                      <div key={payment.paymentId || index} className="p-4 bg-gray-50 rounded-lg space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-base text-gray-600 mb-1">Phương thức thanh toán</p>
                            <p className="font-semibold text-lg">{translatePaymentMethod(payment.paymentMethod || payment.payment_method)}</p>
                          </div>
                          <div>
                            <p className="text-base text-gray-600 mb-1">Trạng thái</p>
                            <Badge className={payment.paymentStatus === 'paid' || payment.payment_status === 'paid' ? 'bg-green-100 text-green-800 text-base px-3 py-1' : 'bg-red-100 text-red-800 text-base px-3 py-1'}>
                              {translatePaymentStatus(payment.paymentStatus || payment.payment_status)}
                            </Badge>
                          </div>
                        </div>
                        {(payment.transactionId || payment.transaction_id) && (
                          <div>
                            <p className="text-base text-gray-600 mb-1">Mã giao dịch</p>
                            <p className="font-mono text-base font-semibold">{payment.transactionId || payment.transaction_id}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-base text-gray-600 mb-1">Số tiền</p>
                          <p className="font-bold text-lg text-blue-600">{formatPrice(payment.amount)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Sản phẩm đã đặt</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item, index) => (
                      <div key={item.order_item_id || item.orderItemId || `item-${index}`} className="flex gap-6 p-5 bg-gray-50 rounded-lg">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <img
                            src={
                              item.imageUrl 
                                ? `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}${item.imageUrl}`
                                : '/placeholder-product.png'
                            }
                            alt={item.product_name || item.productName}
                            className="w-24 h-24 object-cover rounded-lg border-2 border-gray-200"
                            onError={(e) => {
                              e.target.src = '/placeholder-product.png';
                            }}
                          />
                        </div>
                        
                        {/* Product Info */}
                        <div className="flex-1">
                          <p className="font-medium text-lg">{item.product_name || item.productName}</p>
                          {item.variant_name || item.variantName ? (
                            <p className="text-base text-gray-600 mt-1">Biến thể: {item.variant_name || item.variantName}</p>
                          ) : null}
                          <p className="text-base text-gray-500 mt-1">SKU: {item.sku || '-'}</p>
                        </div>
                        
                        {/* Price Info */}
                        <div className="text-right">
                          <p className="text-base text-gray-600">SL: {item.quantity || 0}</p>
                          <p className="font-semibold text-lg">{formatPrice(item.unit_price || item.unitPrice || 0)}</p>
                          <p className="text-base text-gray-600">Tạm tính: {formatPrice(item.subtotal || item.subTotal || 0)}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4 text-base">Không có sản phẩm nào</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Coupon Info */}
            {(order.coupon_code || order.couponCode) && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Mã giảm giá đã sử dụng</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-5 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                    <div className="grid grid-cols-2 gap-6 text-base">
                      <div>
                        <p className="text-gray-600 mb-2">Mã coupon:</p>
                        <p className="font-bold text-xl text-green-700">{order.coupon_code || order.couponCode}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 mb-2">Số tiền đã giảm:</p>
                        <p className="font-bold text-xl text-red-600">-{formatPrice(discountAmount)}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <MapPin className="w-6 h-6" />
                  Địa chỉ giao hàng
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="font-medium text-lg">
                    {order.recipient_name || order.recipientName || '-'}
                  </p>
                  <p className="text-gray-600 text-base">
                    {order.address_line1 || order.addressLine1 || ''}
                    {order.address_line2 || order.addressLine2 ? `, ${order.address_line2 || order.addressLine2}` : ''}
                  </p>
                  <p className="text-gray-600 text-base">
                    {[order.ward, order.district, order.city].filter(Boolean).join(', ')}
                  </p>
                  <p className="text-gray-600 flex items-center gap-2 mt-3 text-base">
                    <Phone className="w-5 h-5" />
                    {order.recipient_phone || order.recipientPhone || order.user_phone || '-'}
                  </p>
                  {order.email && (
                    <p className="text-gray-600 flex items-center gap-2 text-base">
                      <Mail className="w-5 h-5" />
                      {order.email}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <CreditCard className="w-6 h-6" />
                  Tóm tắt đơn hàng
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-base">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tạm tính:</span>
                    <span className="font-semibold">{formatPrice(subtotal)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Giảm giá:</span>
                      <span className="font-semibold">-{formatPrice(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phí vận chuyển:</span>
                    <span className="font-semibold">{formatPrice(shippingFee)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="font-bold text-lg">Tổng cộng:</span>
                    <span className="font-bold text-xl text-red-600">{formatPrice(totalAmount)}</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full text-base"
                    onClick={() => navigate("/orders")}
                  >
                    Về danh sách đơn hàng
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full text-base"
                    onClick={() => navigate("/")}
                  >
                    Tiếp tục mua sắm
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;

