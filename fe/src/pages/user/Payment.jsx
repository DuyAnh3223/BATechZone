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
  ArrowLeft,
  Banknote,
  Wallet,
  QrCode
} from "lucide-react";
import { orderService } from "@/services/orderService";
import { toast } from "sonner";
import { useOrderStore } from "@/stores/useOrderStore";
import { useCartStore } from "@/stores/useCartStore";
import { useCartItemStore } from "@/stores/useCartItemStore";

const Payment = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { fetchOrderById } = useOrderStore();
  const { cart, clearCart } = useCartStore();
  const { reset: resetCartItems } = useCartItemStore();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        toast.error("Không tìm thấy mã đơn hàng");
        navigate("/");
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
        navigate("/");
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

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { label: "Chờ xác nhận", className: "bg-yellow-100 text-yellow-800" },
      confirmed: { label: "Đã xác nhận", className: "bg-blue-100 text-blue-800" },
      processing: { label: "Đang xử lý", className: "bg-purple-100 text-purple-800" },
      shipping: { label: "Đang giao", className: "bg-indigo-100 text-indigo-800" },
      delivered: { label: "Đã giao", className: "bg-green-100 text-green-800" },
      cancelled: { label: "Đã hủy", className: "bg-red-100 text-red-800" },
    };
    return statusMap[status] || { label: status, className: "bg-gray-100 text-gray-800" };
  };

  const getPaymentStatusBadge = (status) => {
    const statusMap = {
      unpaid: { label: "Chưa thanh toán", className: "bg-red-100 text-red-800" },
      paid: { label: "Đã thanh toán", className: "bg-green-100 text-green-800" },
      refunded: { label: "Đã hoàn tiền", className: "bg-orange-100 text-orange-800" },
    };
    return statusMap[status] || { label: status, className: "bg-gray-100 text-gray-800" };
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'cod':
        return <Banknote className="w-5 h-5" />;
      case 'bank_transfer':
        return <CreditCard className="w-5 h-5" />;
      case 'credit_card':
        return <CreditCard className="w-5 h-5" />;
      case 'e_wallet':
        return <Wallet className="w-5 h-5" />;
      default:
        return <CreditCard className="w-5 h-5" />;
    }
  };

  const getPaymentMethodName = (method) => {
    const methodMap = {
      cod: "Thanh toán khi nhận hàng (COD)",
      bank_transfer: "Chuyển khoản ngân hàng",
      credit_card: "Thẻ tín dụng/Ghi nợ",
      e_wallet: "Ví điện tử",
    };
    return methodMap[method] || method;
  };

  const handlePayment = async (paymentMethod) => {
    if (!order) return;

    try {
      setProcessingPayment(true);

      // Nếu là COD, chỉ cần xác nhận
      if (paymentMethod === 'cod') {
        // Xóa giỏ hàng
        const cartId = cart?.cart_id || cart?.cartId;
        if (cartId) {
          await clearCart(cartId);
        }
        resetCartItems();
        
        toast.success("Đơn hàng đã được xác nhận. Bạn sẽ thanh toán khi nhận hàng.");
        navigate(`/order-success/${orderId}`);
        return;
      }

      // Các phương thức thanh toán khác (có thể tích hợp gateway sau)
      toast.info("Tính năng thanh toán trực tuyến đang được phát triển");
      
    } catch (error) {
      console.error("Error processing payment:", error);
      toast.error("Có lỗi xảy ra khi xử lý thanh toán");
    } finally {
      setProcessingPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-indigo-600 mb-4" />
          <p className="text-gray-600">Đang tải thông tin đơn hàng...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Không tìm thấy đơn hàng</p>
          <Button onClick={() => navigate("/")}>Về trang chủ</Button>
        </div>
      </div>
    );
  }

  const orderStatus = order.order_status || order.orderStatus || 'pending';
  const paymentStatus = order.payment_status || order.paymentStatus || 'unpaid';
  const paymentMethod = order.payment_method || order.paymentMethod || 'cod';
  const totalAmount = parseFloat(order.total_amount || order.totalAmount || 0);
  const subtotal = parseFloat(order.subtotal || 0);
  const shippingFee = parseFloat(order.shipping_fee || order.shippingFee || 0);
  const discountAmount = parseFloat(order.discount_amount || order.discountAmount || 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Về trang chủ
          </Button>
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-900">Đặt hàng thành công!</h1>
          </div>
          <p className="text-gray-600">
            Mã đơn hàng: <span className="font-semibold text-indigo-600">
              {order.order_number || order.orderNumber || `#${order.order_id || order.orderId}`}
            </span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Thông tin đơn hàng - Cột trái */}
          <div className="lg:col-span-2 space-y-6">
            {/* Thông tin đơn hàng */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Thông tin đơn hàng
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Trạng thái đơn hàng:</span>
                  <Badge className={getStatusBadge(orderStatus).className}>
                    {getStatusBadge(orderStatus).label}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Trạng thái thanh toán:</span>
                  <Badge className={getPaymentStatusBadge(paymentStatus).className}>
                    {getPaymentStatusBadge(paymentStatus).label}
                  </Badge>
                </div>
                <Separator />
                
                {/* Danh sách sản phẩm */}
                <div>
                  <h3 className="font-semibold mb-3">Sản phẩm đã đặt:</h3>
                  <div className="space-y-3">
                    {order.items && order.items.length > 0 ? (
                      order.items.map((item, index) => (
                        <div key={item.order_item_id || item.orderItemId || `item-${index}`} className="flex gap-4 p-3 bg-gray-50 rounded-lg">
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
                </div>

                <Separator />

                {/* Thông tin coupon */}
                {(order.coupon_code || order.couponCode) && (
                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                    <h3 className="font-semibold mb-2 text-green-800">Mã giảm giá đã sử dụng</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-600">Mã:</span>
                        <span className="font-bold text-green-700 ml-2">{order.coupon_code || order.couponCode}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Giảm:</span>
                        <span className="font-semibold text-red-600 ml-2">
                          -{formatPrice(order.discount_amount || order.discountAmount || 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tóm tắt đơn hàng */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3">Tóm tắt đơn hàng</h3>
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
                </div>
              </CardContent>
            </Card>

            {/* Thông tin giao hàng */}
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
                    {[
                      order.ward,
                      order.district,
                      order.city
                    ].filter(Boolean).join(', ')}
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

          {/* Thanh toán - Cột phải */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Thanh toán
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                  <div className="flex items-center gap-3 mb-2">
                    {getPaymentMethodIcon(paymentMethod)}
                    <span className="font-semibold text-indigo-900">
                      {getPaymentMethodName(paymentMethod)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Số tiền cần thanh toán: <span className="font-bold text-lg text-red-600">{formatPrice(totalAmount)}</span>
                  </p>
                </div>

                {paymentStatus === 'unpaid' && (
                  <>
                    {paymentMethod === 'cod' ? (
                      <div className="space-y-3">
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <p className="text-sm text-yellow-800">
                            <strong>Lưu ý:</strong> Bạn sẽ thanh toán khi nhận hàng. Vui lòng chuẩn bị đúng số tiền.
                          </p>
                        </div>
                        <Button
                          onClick={() => handlePayment('cod')}
                          disabled={processingPayment}
                          className="w-full bg-indigo-600 hover:bg-indigo-700"
                        >
                          {processingPayment ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Đang xử lý...
                            </>
                          ) : (
                            "Xác nhận đơn hàng"
                          )}
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <p className="text-sm text-blue-800 mb-3">
                            Vui lòng chọn phương thức thanh toán:
                          </p>
                          <div className="space-y-2">
                            <Button
                              variant="outline"
                              className="w-full justify-start"
                              onClick={() => handlePayment('bank_transfer')}
                            >
                              <CreditCard className="w-4 h-4 mr-2" />
                              Chuyển khoản ngân hàng
                            </Button>
                            <Button
                              variant="outline"
                              className="w-full justify-start"
                              onClick={() => handlePayment('credit_card')}
                            >
                              <CreditCard className="w-4 h-4 mr-2" />
                              Thẻ tín dụng/Ghi nợ
                            </Button>
                            <Button
                              variant="outline"
                              className="w-full justify-start"
                              onClick={() => handlePayment('e_wallet')}
                            >
                              <Wallet className="w-4 h-4 mr-2" />
                              Ví điện tử
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {paymentStatus === 'paid' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-green-800">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="font-semibold">Đã thanh toán thành công</span>
                    </div>
                  </div>
                )}

                <Separator />

                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate(`/order-success/${orderId}`)}
                  >
                    Xem chi tiết đơn hàng
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

export default Payment;

