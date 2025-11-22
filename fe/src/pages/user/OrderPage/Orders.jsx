import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  Loader2,
  Eye,
  ArrowLeft
} from "lucide-react";
import { useOrderStore } from "@/stores/useOrderStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "sonner";
import { translateOrderStatus } from "@/utils/statusTranslations";

const Orders = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { orders, pagination, loading, fetchOrders } = useOrderStore();
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để xem đơn hàng");
      navigate("/auth/signin");
      return;
    }

    loadOrders();
  }, [user, page, statusFilter]);

  const loadOrders = async () => {
    try {
      const params = {
        page,
        limit: pageSize,
        userId: user?.user_id || user?.userId,
        orderStatus: statusFilter || undefined
      };
      await fetchOrders(params);
    } catch (error) {
      console.error("Error loading orders:", error);
      toast.error("Không thể tải danh sách đơn hàng");
    }
  };

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

  const totalPages = pagination?.totalPages || 1;
  const totalOrders = pagination?.total || 0;

  if (!user) {
    return null;
  }

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
          <h1 className="text-3xl font-bold text-gray-900">Đơn hàng của tôi</h1>
          <p className="text-gray-600 mt-2">Quản lý và theo dõi đơn hàng của bạn</p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={statusFilter === "" ? "default" : "outline"}
                onClick={() => setStatusFilter("")}
                size="sm"
              >
                Tất cả
              </Button>
              <Button
                variant={statusFilter === "pending" ? "default" : "outline"}
                onClick={() => setStatusFilter("pending")}
                size="sm"
              >
                Đang chờ
              </Button>
              <Button
                variant={statusFilter === "confirmed" ? "default" : "outline"}
                onClick={() => setStatusFilter("confirmed")}
                size="sm"
              >
                Đã xác nhận
              </Button>
              <Button
                variant={statusFilter === "processing" ? "default" : "outline"}
                onClick={() => setStatusFilter("processing")}
                size="sm"
              >
                Đang xử lý
              </Button>
              <Button
                variant={statusFilter === "shipping" ? "default" : "outline"}
                onClick={() => setStatusFilter("shipping")}
                size="sm"
              >
                Đang vận chuyển
              </Button>
              <Button
                variant={statusFilter === "delivered" ? "default" : "outline"}
                onClick={() => setStatusFilter("delivered")}
                size="sm"
              >
                Đã giao
              </Button>
              <Button
                variant={statusFilter === "cancelled" ? "default" : "outline"}
                onClick={() => setStatusFilter("cancelled")}
                size="sm"
              >
                Đã hủy
              </Button>
              <Button
                variant={statusFilter === "refunded" ? "default" : "outline"}
                onClick={() => setStatusFilter("refunded")}
                size="sm"
              >
                Đã hoàn tiền
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        {loading ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
              <p className="text-gray-500">Đang tải danh sách đơn hàng...</p>
            </CardContent>
          </Card>
        ) : orders && orders.length > 0 ? (
          <>
            <div className="space-y-4">
              {orders.map((order) => {
                const orderId = order.order_id || order.orderId;
                const orderNumber = order.order_number || order.orderNumber || `#${orderId}`;
                const orderStatus = order.order_status || order.orderStatus || "pending";
                const paymentStatus = order.payment_status || order.paymentStatus || "unpaid";
                const totalAmount = parseFloat(order.total_amount || order.totalAmount || 0);
                const createdAt = order.created_at || order.createdAt;

                const statusBadge = getStatusBadge(orderStatus);
                const paymentBadge = getPaymentStatusBadge(paymentStatus);

                return (
                  <Card key={orderId} className="hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Package className="w-5 h-5 text-indigo-600" />
                            <h3 className="text-lg font-semibold text-gray-900">
                              {orderNumber}
                            </h3>
                            <Badge className={statusBadge.className}>
                              {statusBadge.label}
                            </Badge>
                            <Badge className={paymentBadge.className}>
                              {paymentBadge.label}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            Ngày đặt: {formatDate(createdAt)}
                          </p>
                          <p className="text-lg font-bold text-red-600">
                            {formatPrice(totalAmount)}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => navigate(`/orders/${orderId}`)}
                            className="flex items-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            Xem chi tiết
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                >
                  Trước
                </Button>
                <span className="text-sm text-gray-600">
                  Trang {page} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                >
                  Sau
                </Button>
              </div>
            )}

            <div className="mt-4 text-center text-sm text-gray-600">
              Tổng cộng: {totalOrders} đơn hàng
            </div>
          </>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Chưa có đơn hàng nào</h3>
              <p className="text-gray-500 mb-4">Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm!</p>
              <Button onClick={() => navigate("/")}>
                Mua sắm ngay
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Orders;

