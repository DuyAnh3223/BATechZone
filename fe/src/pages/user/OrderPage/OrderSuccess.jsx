import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
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
  Loader2 
} from "lucide-react";
import { orderService } from "@/services/orderService";
import { toast } from "sonner";

const OrderSuccess = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        toast.error("Không tìm thấy mã đơn hàng");
        navigate("/");
        return;
      }

      try {
        setLoading(true);
        const response = await orderService.getOrderById(orderId);
        
        console.log("📦 Full API Response:", response);
        console.log("📦 Response.data:", response?.data);
        console.log("📦 Response.success:", response?.success);
        
        // Xử lý response từ API
        const orderData = response?.data || response;
        
        console.log("✅ Order Data (ALL FIELDS):", orderData);
        console.log("✅ Order Data Keys:", Object.keys(orderData || {}));
        console.log("📍 Address Info (snake_case):", {
          recipient_name: orderData.recipient_name,
          recipient_phone: orderData.recipient_phone,
          address_line1: orderData.address_line1,
          address_line2: orderData.address_line2,
          city: orderData.city,
          district: orderData.district,
          ward: orderData.ward
        });
        console.log("📍 Address Info (camelCase):", {
          recipientName: orderData.recipientName,
          recipientPhone: orderData.recipientPhone,
          addressLine1: orderData.addressLine1,
          addressLine2: orderData.addressLine2,
        });
        
        setOrder(orderData);
      } catch (error) {
        console.error("❌ Error loading order:", error);
        toast.error("Không thể tải thông tin đơn hàng");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, navigate]);

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
      shipped: { label: "Đang giao", className: "bg-indigo-100 text-indigo-800" },
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

  const getPaymentMethodLabel = (method) => {
    const methodMap = {
      cod: "Thanh toán khi nhận hàng (COD)",
      banking: "Chuyển khoản ngân hàng",
      momo: "Ví MoMo",
      vnpay: "VNPay",
    };
    return methodMap[method] || "Chưa xác định";
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
            <Button onClick={() => navigate("/")} className="w-full">
              <Home className="h-4 w-4 mr-2" />
              Về trang chủ
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const orderStatus = getStatusBadge(order.orderStatus || order.order_status);
  const paymentStatus = getPaymentStatusBadge(order.paymentStatus || order.payment_status);

  return (
    <div className="py-8 px-4 max-w-4xl mx-auto">
      <Card className="shadow-lg">
        {/* Header */}
        <CardHeader className="text-center bg-gradient-to-r from-green-50 to-blue-50 border-b">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 p-4 rounded-full">
              <CheckCircle2 className="h-16 w-16 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-green-600 mb-2">
            Đặt hàng thành công!
          </CardTitle>
          <p className="text-gray-600">
            Cảm ơn bạn đã tin tưởng và đặt hàng tại cửa hàng của chúng tôi
          </p>
        </CardHeader>

        <CardContent className="space-y-6 mt-6">
          {/* Mã đơn hàng */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Package className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold text-blue-900">Mã đơn hàng</span>
                </div>
                <p className="text-3xl font-bold text-blue-600">
                  {order.orderNumber || order.order_number}
                </p>
              </div>
              <div className="space-y-2">
                <Badge className={orderStatus.className} variant="secondary">
                  {orderStatus.label}
                </Badge>
                <br />
                <Badge className={paymentStatus.className} variant="secondary">
                  {paymentStatus.label}
                </Badge>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-3">
              💡 Vui lòng lưu lại mã đơn hàng để tra cứu và theo dõi
            </p>
          </div>

          <Separator />

          {/* Thông tin người đặt hàng */}
          {(order.username || order.email) && (
            <>
              <div className="space-y-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <User className="h-6 w-6 text-blue-600" />
                  Thông tin người đặt hàng
                </h3>
                <Card className="bg-gray-50">
                  <CardContent className="pt-6 space-y-4">
                    {order.username && (
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Tên tài khoản</p>
                          <p className="font-semibold text-lg">{order.username}</p>
                        </div>
                      </div>
                    )}
                    {order.email && (
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <Mail className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Email</p>
                          <p className="font-semibold text-lg">{order.email}</p>
                        </div>
                      </div>
                    )}
                    {order.user_phone && (
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <Phone className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Số điện thoại</p>
                          <p className="font-semibold text-lg">{order.user_phone}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              <Separator />
            </>
          )}

          {/* Khách vãng lai */}
          {!order.username && !order.email && (
            <>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-amber-600" />
                  <span className="font-semibold text-amber-900">Khách vãng lai</span>
                </div>
                <p className="text-sm text-amber-700 mt-2">
                  Đơn hàng này được đặt bởi khách hàng không có tài khoản
                </p>
              </div>
              <Separator />
            </>
          )}

          {/* Thông tin giao hàng */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <MapPin className="h-6 w-6 text-blue-600" />
              Thông tin giao hàng
            </h3>
            <Card className="bg-gradient-to-br from-green-50 to-teal-50 border-2 border-green-200">
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <User className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-600 mb-1">Người nhận</p>
                    <p className="font-bold text-xl text-gray-900">
                      {order.recipient_name || "Chưa cập nhật"}
                    </p>
                  </div>
                </div>

                <Separator className="bg-green-200" />

                <div className="flex items-start gap-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Phone className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-600 mb-1">Số điện thoại</p>
                    <p className="font-bold text-xl text-gray-900">
                      {order.recipient_phone || "Chưa cập nhật"}
                    </p>
                  </div>
                </div>

                <Separator className="bg-green-200" />

                <div className="flex items-start gap-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <MapPin className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-600 mb-1">Địa chỉ giao hàng</p>
                    <div className="space-y-1">
                      {order.address_line1 && (
                        <p className="font-semibold text-base text-gray-900">
                          {order.address_line1}
                        </p>
                      )}
                      {order.address_line2 && (
                        <p className="text-sm text-gray-700">{order.address_line2}</p>
                      )}
                      {(order.ward || order.district || order.city) && (
                        <p className="text-sm text-gray-700">
                          {[order.ward, order.district, order.city]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                      )}
                      {!order.address_line1 && !order.city && (
                        <p className="text-gray-500 italic">Chưa cập nhật</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Chi tiết đơn hàng */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Package className="h-6 w-6 text-blue-600" />
              Chi tiết đơn hàng
            </h3>

            {/* Phương thức thanh toán */}
            <Card className="bg-gray-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Phương thức thanh toán</p>
                    <p className="font-semibold text-base">
                      {getPaymentMethodLabel(order.paymentMethod || order.payment_method)}
                    </p>
                  </div>
                </div>
                {order.notes && (
                  <div className="mt-4 p-3 bg-white rounded border">
                    <p className="text-xs text-gray-500 mb-1">Ghi chú</p>
                    <p className="text-sm">{order.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Danh sách sản phẩm */}
            {order.items && order.items.length > 0 && (
              <Card>
                <CardHeader className="bg-gray-100 py-3">
                  <CardTitle className="text-base font-semibold">
                    Sản phẩm đã đặt ({order.items.length} sản phẩm)
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="p-4 flex justify-between items-start hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-1 space-y-1">
                          <p className="font-semibold text-base">
                            {item.productName || item.product_name}
                          </p>
                          {(item.variantName || item.variant_name) && (
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Phân loại:</span>{" "}
                              {item.variantName || item.variant_name}
                            </p>
                          )}
                          {item.sku && (
                            <p className="text-xs text-gray-500">SKU: {item.sku}</p>
                          )}
                          <p className="text-sm">
                            <span className="text-gray-600">Số lượng:</span>{" "}
                            <span className="font-semibold text-blue-600">
                              x{item.quantity}
                            </span>
                          </p>
                        </div>
                        <div className="text-right ml-4">
                          <p className="font-bold text-lg text-red-600">
                            {formatPrice(item.unitPrice || item.unit_price)}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">Đơn giá</p>
                          <p className="font-semibold text-base text-gray-900 mt-2">
                            {formatPrice(
                              (item.unitPrice || item.unit_price) * item.quantity
                            )}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tổng kết đơn hàng */}
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
              <CardContent className="pt-6 space-y-3">
                <div className="flex justify-between text-base">
                  <span className="text-gray-700">Tạm tính:</span>
                  <span className="font-semibold">
                    {formatPrice(order.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-base">
                  <span className="text-gray-700">Phí vận chuyển:</span>
                  <span className="font-semibold">
                    {formatPrice(order.shippingFee || order.shipping_fee)}
                  </span>
                </div>
                {(order.discountAmount || order.discount_amount) > 0 && (
                  <div className="flex justify-between text-base text-green-600">
                    <span>Giảm giá:</span>
                    <span className="font-semibold">
                      -{formatPrice(order.discountAmount || order.discount_amount)}
                    </span>
                  </div>
                )}
                <Separator className="bg-blue-300" />
                <div className="flex justify-between items-center pt-2">
                  <span className="text-xl font-bold text-gray-900">
                    Tổng cộng:
                  </span>
                  <span className="text-2xl font-bold text-red-600">
                    {formatPrice(order.totalAmount || order.total_amount)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Các bước tiếp theo */}
          <Card className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200">
            <CardContent className="pt-6">
              <h3 className="font-bold text-lg mb-4 text-amber-900">
                🚀 Các bước tiếp theo
              </h3>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </span>
                  <span className="text-sm text-gray-700">
                    Chúng tôi sẽ xác nhận đơn hàng của bạn trong thời gian sớm nhất
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </span>
                  <span className="text-sm text-gray-700">
                    Bạn sẽ nhận được thông báo qua email/số điện thoại khi đơn hàng được
                    xác nhận
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </span>
                  <span className="text-sm text-gray-700">
                    Đơn hàng sẽ được giao đến địa chỉ của bạn trong 2-3 ngày làm việc
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    4
                  </span>
                  <span className="text-sm text-gray-700">
                    Vui lòng kiểm tra kỹ hàng hóa trước khi thanh toán với shipper
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate("/")}
              className="w-full"
            >
              <Home className="h-5 w-5 mr-2" />
              Về trang chủ
            </Button>
            <Button
              size="lg"
              onClick={() => navigate("/products")}
              className="w-full"
            >
              <Package className="h-5 w-5 mr-2" />
              Tiếp tục mua sắm
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderSuccess;