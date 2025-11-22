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
import { translateOrderStatus } from "@/utils/statusTranslations";

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
      unpaid: { label: "Chưa thanh toán", className: "bg-red-100 text-red-800" },
      paid: { label: "Đã thanh toán", className: "bg-green-100 text-green-800" },
      refunded: { label: "Đã hoàn tiền", className: "bg-orange-100 text-orange-800" },
    };
    return statusMap[status] || { label: status, className: "bg-gray-100 text-gray-800" };
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
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/orders")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Về danh sách đơn hàng
          </Button>
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-900">Chi tiết đơn hàng</h1>
          </div>
          <p className="text-gray-600">
            Mã đơn hàng: <span className="font-semibold text-indigo-600">{orderNumber}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Thông tin đơn hàng
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Trạng thái đơn hàng</p>
                    <Badge className={statusBadge.className}>
                      {statusBadge.label}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Trạng thái thanh toán</p>
                    <Badge className={paymentBadge.className}>
                      {paymentBadge.label}
                    </Badge>
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-gray-600 mb-1">Ngày đặt hàng</p>
                  <p className="font-semibold">{formatDate(order.created_at || order.createdAt)}</p>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Sản phẩm đã đặt</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item, index) => (
                      <div key={item.order_item_id || item.orderItemId || `item-${index}`} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium">{item.product_name || item.productName}</p>
                          {item.variant_name || item.variantName ? (
                            <p className="text-sm text-gray-600">Biến thể: {item.variant_name || item.variantName}</p>
                          ) : null}
                          <p className="text-sm text-gray-500">SKU: {item.sku || '-'}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">SL: {item.quantity || 0}</p>
                          <p className="font-semibold">{formatPrice(item.unit_price || item.unitPrice || 0)}</p>
                          <p className="text-sm text-gray-600">Tạm tính: {formatPrice(item.subtotal || item.subTotal || 0)}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">Không có sản phẩm nào</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Coupon Info */}
            {(order.coupon_code || order.couponCode) && (
              <Card>
                <CardHeader>
                  <CardTitle>Mã giảm giá đã sử dụng</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600 mb-1">Mã coupon:</p>
                        <p className="font-bold text-lg text-green-700">{order.coupon_code || order.couponCode}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 mb-1">Số tiền đã giảm:</p>
                        <p className="font-bold text-lg text-red-600">-{formatPrice(discountAmount)}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Địa chỉ giao hàng
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium">
                    {order.recipient_name || order.recipientName || '-'}
                  </p>
                  <p className="text-gray-600">
                    {order.address_line1 || order.addressLine1 || ''}
                    {order.address_line2 || order.addressLine2 ? `, ${order.address_line2 || order.addressLine2}` : ''}
                  </p>
                  <p className="text-gray-600">
                    {[order.ward, order.district, order.city].filter(Boolean).join(', ')}
                  </p>
                  <p className="text-gray-600 flex items-center gap-2 mt-2">
                    <Phone className="w-4 h-4" />
                    {order.recipient_phone || order.recipientPhone || order.user_phone || '-'}
                  </p>
                  {order.email && (
                    <p className="text-gray-600 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
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
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Tóm tắt đơn hàng
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
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
                    <span className="font-bold text-base">Tổng cộng:</span>
                    <span className="font-bold text-lg text-red-600">{formatPrice(totalAmount)}</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate("/orders")}
                  >
                    Về danh sách đơn hàng
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
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

