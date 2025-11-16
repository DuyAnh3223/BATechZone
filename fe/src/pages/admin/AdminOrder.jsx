import React, { useState, useEffect } from 'react';
import { translateOrderStatus, translatePaymentStatus, translatePaymentMethod } from '../../utils/statusTranslations';
import { useOrderStore } from '@/stores/useOrderStore';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RefreshCw, Loader2 } from "lucide-react";

const formatDate = (dateString) => {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  } catch (error) {
    return dateString;
  }
};

const getOrderStatusClass = (status) => {
  switch (status) {
    case 'pending': return 'bg-gray-100 text-gray-600';
    case 'confirmed': return 'bg-blue-100 text-blue-700';
    case 'processing': return 'bg-yellow-100 text-yellow-700';
    case 'shipping': return 'bg-indigo-100 text-indigo-700';
    case 'delivered': return 'bg-green-100 text-green-700';
    case 'cancelled': return 'bg-red-100 text-red-700';
    case 'refunded': return 'bg-orange-100 text-orange-700';
    default: return 'bg-gray-100 text-gray-500';
  }
};

const getPaymentStatusClass = (status) => {
  switch (status) {
    case 'paid': return 'bg-green-100 text-green-700';
    case 'unpaid': return 'bg-pink-100 text-pink-700';
    default: return 'bg-gray-100 text-gray-500';
  }
};

const AdminOrder = () => {
  const { 
    orders, 
    pagination, 
    loading, 
    fetchOrders, 
    fetchOrderById,
    updateOrderStatus,
    cancelOrder,
    refundOrder,
    loading: orderLoading
  } = useOrderStore();
  const [showDetail, setShowDetail] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetail, setOrderDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [payStatus, setPayStatus] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [newStatus, setNewStatus] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const PAGE_SIZE_OPTIONS = [5, 10, 20];

  // Fetch orders khi component mount hoặc filters thay đổi
  useEffect(() => {
    loadOrders();
  }, [page, pageSize, status, payStatus, search]);

  const loadOrders = async () => {
    try {
      const params = {
        page,
        limit: pageSize,
        orderStatus: status || undefined,
        paymentStatus: payStatus || undefined,
        search: search.trim() || undefined
      };
      const response = await fetchOrders(params);
      console.log('Orders response:', response);
      console.log('Orders in store:', orders);
      console.log('Pagination:', pagination);
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const openDetail = async (order) => {
    setSelectedOrder(order);
    setShowDetail(true);
    setLoadingDetail(true);
    try {
      const orderId = order.order_id || order.orderId;
      const response = await fetchOrderById(orderId);
      setOrderDetail(response.data || response);
    } catch (error) {
      console.error('Error loading order detail:', error);
    } finally {
      setLoadingDetail(false);
    }
  };

  const closeDetail = () => {
    setShowDetail(false);
    setSelectedOrder(null);
    setOrderDetail(null);
  };

  const sumSubtotal = (items) => {
    if (!items || !Array.isArray(items)) return 0;
    return items.reduce((t, r) => {
      const subtotal = parseFloat(r.subtotal || r.subTotal || 0);
      return t + (isNaN(subtotal) ? 0 : subtotal);
    }, 0);
  };

  const sumPayments = (payments) => {
    if (!payments || !Array.isArray(payments)) return 0;
    return payments.reduce((t, r) => t + (r.amount || 0), 0);
  };

  const handleStatusChange = async (status) => {
    if (!selectedOrder || !status) return;

    const orderId = selectedOrder.order_id || selectedOrder.orderId;
    if (!orderId) {
      toast.error("Không tìm thấy mã đơn hàng");
      return;
    }

    try {
      setIsUpdating(true);
      let response;

      // Xử lý các trạng thái đặc biệt
      if (status === "cancelled") {
        const reason = prompt("Vui lòng nhập lý do hủy đơn hàng:");
        if (!reason) {
          setIsUpdating(false);
          return;
        }
        response = await cancelOrder(orderId, reason);
      } else if (status === "refunded") {
        const totalAmount = orderDetail?.total_amount || orderDetail?.totalAmount || 0;
        response = await refundOrder(orderId, totalAmount);
      } else {
        // Sử dụng endpoint tổng quát cho các trạng thái khác
        response = await updateOrderStatus(orderId, status);
      }

      toast.success("Cập nhật trạng thái đơn hàng thành công!");
      
      // Refresh order detail
      const updatedResponse = await fetchOrderById(orderId);
      const updatedOrderData = updatedResponse.data || updatedResponse;
      setOrderDetail(updatedOrderData);
      
      // Refresh orders list
      await loadOrders();
      
      // Update selectedOrder with new status
      if (updatedOrderData) {
        setSelectedOrder({
          ...selectedOrder,
          order_status: updatedOrderData.order_status || updatedOrderData.orderStatus,
          orderStatus: updatedOrderData.order_status || updatedOrderData.orderStatus
        });
      }
      
      setNewStatus("");
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error(error.response?.data?.message || "Cập nhật trạng thái thất bại");
    } finally {
      setIsUpdating(false);
    }
  };

  const getAvailableStatuses = (currentStatus) => {
    // Flow chuyển trạng thái hợp lệ (cho phép tiến lên và quay lại 1 bước)
    const statusFlow = {
      pending: ["confirmed", "cancelled"],                    // Đang chờ → Đã xác nhận hoặc Đã hủy
      confirmed: ["pending", "processing", "cancelled"],      // Đã xác nhận → Quay lại Đang chờ, hoặc Đang xử lý, hoặc Đã hủy
      processing: ["confirmed", "shipping", "cancelled"],    // Đang xử lý → Quay lại Đã xác nhận, hoặc Đang vận chuyển, hoặc Đã hủy
      shipping: ["processing", "delivered", "cancelled"],    // Đang vận chuyển → Quay lại Đang xử lý, hoặc Đã giao, hoặc Đã hủy
      delivered: ["shipping", "refunded"],                    // Đã giao → Quay lại Đang vận chuyển, hoặc Đã hoàn tiền
      cancelled: ["pending", "confirmed", "processing", "shipping", "refunded"], // Đã hủy → Có thể quay lại các trạng thái trước hoặc hoàn tiền
      refunded: []                                            // Đã hoàn tiền → Không thể thay đổi
    };
    
    return statusFlow[currentStatus] || [];
  };

  const totalPages = pagination?.totalPages || 1;
  const totalOrders = pagination?.total || 0;

  const goPage = (p) => setPage(Math.min(Math.max(1, p), totalPages));

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Quản lý đơn hàng</h2>
      </div>
      
      {/* Bộ lọc nhanh */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <input 
          value={search} 
          onChange={(e) => { 
            setSearch(e.target.value); 
            setPage(1); 
          }} 
          className="border rounded px-3 py-2 w-full md:w-72" 
          placeholder="Tìm theo mã đơn/username/email..." 
        />
        <select 
          value={status} 
          onChange={(e) => { 
            setStatus(e.target.value); 
            setPage(1); 
          }} 
          className="border rounded px-3 py-2"
        >
          <option value="">Tất cả trạng thái đơn</option>
          <option value="delivered">Hoàn thành</option>
          <option value="shipping">Đang giao</option>
          <option value="processing">Đang xử lý</option>
          <option value="pending">Chờ xử lý</option>
          <option value="cancelled">Đã hủy</option>
        </select>
        <select 
          value={payStatus} 
          onChange={(e) => { 
            setPayStatus(e.target.value); 
            setPage(1); 
          }} 
          className="border rounded px-3 py-2"
        >
          <option value="">Tất cả thanh toán</option>
          <option value="paid">Đã thanh toán</option>
          <option value="unpaid">Chưa thanh toán</option>
        </select>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-sm text-gray-500">Hiển thị</span>
          <select 
            value={pageSize} 
            onChange={(e) => { 
              setPageSize(Number(e.target.value)); 
              setPage(1); 
            }} 
            className="border rounded px-2 py-1 text-sm"
          >
            {PAGE_SIZE_OPTIONS.map(s => (<option key={s} value={s}>{s}</option>))}
          </select>
          <span className="text-sm text-gray-500">mục/trang</span>
        </div>
      </div>

      {/* Bảng đơn hàng */}
      <div className="overflow-x-auto rounded-xl bg-white shadow pb-2">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Đang tải...</div>
        ) : orders.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Không có đơn hàng nào</div>
        ) : (
          <>
            <table className="min-w-[1000px] w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 font-semibold text-gray-600">ID Đơn</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">ID User</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Mã đơn hàng</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Trạng thái đơn</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Trạng thái TT</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Tổng tiền</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Ngày tạo</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Cập nhật lúc</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {orders.map((order, index) => {
                  // Hỗ trợ cả camelCase và snake_case
                  const orderId = order.order_id || order.orderId;
                  const userId = order.user_id || order.userId;
                  const orderNumber = order.order_number || order.orderNumber;
                  const orderStatus = order.order_status || order.orderStatus;
                  const paymentStatus = order.payment_status || order.paymentStatus;
                  const totalAmount = order.total_amount || order.totalAmount;
                  const createdAt = order.created_at || order.createdAt;
                  const updatedAt = order.updated_at || order.updatedAt;
                  
                  return (
                    <tr key={orderId || `order-${index}`} className="hover:bg-blue-50 transition">
                      <td className="px-4 py-3 font-medium text-gray-800">{orderId}</td>
                      <td className="px-4 py-3">{userId || '-'}</td>
                      <td className="px-4 py-3 font-semibold text-blue-800">{orderNumber}</td>
                      <td className="px-4 py-3">
                        <span className={`px-3 py-0.5 rounded-full text-xs font-semibold ${getOrderStatusClass(orderStatus)}`}>
                          {translateOrderStatus(orderStatus)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-3 py-0.5 rounded-full text-xs font-semibold ${getPaymentStatusClass(paymentStatus)}`}>
                          {translatePaymentStatus(paymentStatus)}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-blue-700">
                        {totalAmount?.toLocaleString('vi-VN')} ₫
                      </td>
                      <td className="px-4 py-3">
                        {createdAt ? formatDate(createdAt) : '-'}
                      </td>
                      <td className="px-4 py-3">
                        {updatedAt ? formatDate(updatedAt) : '-'}
                      </td>
                      <td className="px-4 py-3 flex gap-2 whitespace-nowrap">
                        <button 
                          onClick={() => openDetail(order)} 
                          className="px-3 py-1.5 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
                        >
                          Chi tiết
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {/* Phân trang */}
            <div className="flex items-center justify-between px-3 py-2 text-sm text-gray-600">
              <div>
                Tổng: <span className="font-medium text-gray-800">{totalOrders}</span> đơn — Trang {page}/{totalPages}
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => goPage(page - 1)} 
                  disabled={page === 1} 
                  className="px-3 py-1 rounded border disabled:opacity-50"
                >
                  Trước
                </button>
                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                  const p = i + 1;
                  return (
                    <button 
                      key={p} 
                      onClick={() => goPage(p)} 
                      className={`px-3 py-1 rounded border ${p === page ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'}`}
                    >
                      {p}
                    </button>
                  );
                })}
                <button 
                  onClick={() => goPage(page + 1)} 
                  disabled={page === totalPages} 
                  className="px-3 py-1 rounded border disabled:opacity-50"
                >
                  Sau
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Dialog chi tiết đơn hàng */}
      {showDetail && selectedOrder && (
        <div className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center transition">
          <div className="bg-white rounded-xl shadow-xl w-[94vw] max-w-4xl p-6 relative z-50 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm text-gray-500">Chi tiết đơn hàng</div>
                <h2 className="text-xl font-bold text-gray-900">{selectedOrder.order_number || selectedOrder.orderNumber}</h2>
              </div>
              <button 
                onClick={closeDetail} 
                className="px-3 py-2 rounded-md bg-gray-500 text-white text-sm font-medium hover:bg-gray-600 transition-colors"
              >
                Đóng
              </button>
            </div>

            {loadingDetail ? (
              <div className="p-8 text-center text-gray-500">Đang tải chi tiết đơn hàng...</div>
            ) : orderDetail ? (
              <>
                <div className="grid md:grid-cols-2 gap-4 mb-4 text-sm">
                  <div className="border rounded p-3">
                    <div className="text-gray-500 mb-2">Trạng thái đơn</div>
                    <div className="mb-3">
                      <span className={`px-3 py-0.5 rounded-full text-xs font-semibold ${getOrderStatusClass(orderDetail.order_status || orderDetail.orderStatus)}`}>
                        {translateOrderStatus(orderDetail.order_status || orderDetail.orderStatus)}
                      </span>
                    </div>
                    {/* Change Status Section */}
                    <div>
                      <p className="text-xs text-gray-600 mb-2">
                        Thay đổi trạng thái (có thể tiến lên hoặc quay lại 1 bước):
                      </p>
                      <div className="flex gap-2 mb-2">
                        <Select
                          value={newStatus}
                          onValueChange={setNewStatus}
                          disabled={isUpdating || orderLoading}
                        >
                          <SelectTrigger className="flex-1 text-xs">
                            <SelectValue placeholder="Chọn trạng thái tiếp theo" />
                          </SelectTrigger>
                          <SelectContent>
                            {getAvailableStatuses(orderDetail.order_status || orderDetail.orderStatus).length > 0 ? (
                              getAvailableStatuses(orderDetail.order_status || orderDetail.orderStatus).map((status) => {
                                return (
                                  <SelectItem key={status} value={status}>
                                    {translateOrderStatus(status)}
                                  </SelectItem>
                                );
                              })
                            ) : (
                              <SelectItem value="no-change" disabled>
                                Không thể thay đổi trạng thái
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                        <Button
                          onClick={() => handleStatusChange(newStatus)}
                          disabled={!newStatus || isUpdating || orderLoading || getAvailableStatuses(orderDetail.order_status || orderDetail.orderStatus).length === 0}
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          {isUpdating || orderLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Đang cập nhật...
                            </>
                          ) : (
                            <>
                              <RefreshCw className="w-4 h-4" />
                              Cập nhật
                            </>
                          )}
                        </Button>
                      </div>
                      {getAvailableStatuses(orderDetail.order_status || orderDetail.orderStatus).length > 0 && (
                        <p className="text-xs text-gray-500">
                          Có thể chuyển sang: {getAvailableStatuses(orderDetail.order_status || orderDetail.orderStatus).map(s => translateOrderStatus(s)).join(', ')}
                        </p>
                      )}
                      {getAvailableStatuses(orderDetail.order_status || orderDetail.orderStatus).length === 0 && (
                        <p className="text-xs text-gray-500">
                          Đơn hàng đã ở trạng thái cuối cùng, không thể thay đổi
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="border rounded p-3">
                    <div className="text-gray-500 mb-2">Thanh toán</div>
                    <div>
                      <span className={`px-3 py-0.5 rounded-full text-xs font-semibold ${getPaymentStatusClass(orderDetail.payment_status || orderDetail.paymentStatus)}`}>
                        {translatePaymentStatus(orderDetail.payment_status || orderDetail.paymentStatus)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Danh sách sản phẩm */}
                <div className="overflow-x-auto mb-6">
                  <h3 className="text-sm font-semibold mb-2">Sản phẩm đã đặt</h3>
                  <table className="min-w-[800px] w-full text-left">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2">SKU</th>
                        <th className="px-4 py-2">Sản phẩm</th>
                        <th className="px-4 py-2">Biến thể</th>
                        <th className="px-4 py-2 text-right">SL</th>
                        <th className="px-4 py-2 text-right">Đơn giá</th>
                        <th className="px-4 py-2 text-right">Tạm tính</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {orderDetail.items && orderDetail.items.length > 0 ? (
                        <>
                          {orderDetail.items.map((item, index) => (
                            <tr key={item.order_item_id || item.orderItemId || `item-${index}`}>
                              <td className="px-4 py-2">{item.sku || '-'}</td>
                              <td className="px-4 py-2">{item.product_name || item.productName || '-'}</td>
                              <td className="px-4 py-2">{item.variant_name || item.variantName || '-'}</td>
                              <td className="px-4 py-2 text-right">{item.quantity || 0}</td>
                              <td className="px-4 py-2 text-right">
                                {parseFloat(item.unit_price || item.unitPrice || 0).toLocaleString('vi-VN')} ₫
                              </td>
                            <td className="px-4 py-2 text-right">
                              {parseFloat(item.subtotal || item.subTotal || 0).toLocaleString('vi-VN')} ₫
                            </td>
                            </tr>
                          ))}
                        </>
                      ) : (
                        <tr>
                          <td className="px-4 py-2 text-center text-gray-500" colSpan={6}>
                            Không có sản phẩm nào
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Thông tin coupon */}
                {(orderDetail.coupon_code || orderDetail.couponCode) && (
                  <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                    <h3 className="text-sm font-semibold mb-3 text-green-800">Mã giảm giá đã sử dụng</h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600 mb-1">Mã coupon:</div>
                        <div className="font-bold text-lg text-green-700">
                          {orderDetail.coupon_code || orderDetail.couponCode}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600 mb-1">Loại giảm giá:</div>
                        <div className="font-semibold">
                          {(orderDetail.discount_type || orderDetail.discountType) === 'percentage' 
                            ? `Giảm ${parseFloat(orderDetail.discount_value || orderDetail.discountValue || 0)}%`
                            : `Giảm ${parseFloat(orderDetail.discount_value || orderDetail.discountValue || 0).toLocaleString('vi-VN')} ₫`
                          }
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600 mb-1">Số tiền đã giảm:</div>
                        <div className="font-bold text-lg text-red-600">
                          -{parseFloat(orderDetail.discount_amount || orderDetail.discountAmount || 0).toLocaleString('vi-VN')} ₫
                        </div>
                      </div>
                      {(orderDetail.max_discount_amount || orderDetail.maxDiscountAmount) && (
                        <div>
                          <div className="text-gray-600 mb-1">Giảm tối đa:</div>
                          <div className="font-semibold">
                            {parseFloat(orderDetail.max_discount_amount || orderDetail.maxDiscountAmount).toLocaleString('vi-VN')} ₫
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Tóm tắt đơn hàng */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-sm font-semibold mb-3">Tóm tắt đơn hàng</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tạm tính:</span>
                      <span className="font-semibold">
                        {Math.round(sumSubtotal(orderDetail.items)).toLocaleString('vi-VN')} ₫
                      </span>
                    </div>
                    {(orderDetail.discount_amount || orderDetail.discountAmount) > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Giảm giá:</span>
                        <span className="font-semibold">
                          -{parseFloat(orderDetail.discount_amount || orderDetail.discountAmount || 0).toLocaleString('vi-VN')} ₫
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phí vận chuyển:</span>
                      <span className="font-semibold">
                        {parseFloat(orderDetail.shipping_fee || orderDetail.shippingFee || 0).toLocaleString('vi-VN')} ₫
                      </span>
                    </div>
                    <div className="border-t pt-2 mt-2 flex justify-between">
                      <span className="font-bold text-base">Tổng cộng:</span>
                      <span className="font-bold text-lg text-red-600">
                        {parseFloat(orderDetail.total_amount || orderDetail.totalAmount || 0).toLocaleString('vi-VN')} ₫
                      </span>
                    </div>
                  </div>
                </div>

                {/* Thông tin thanh toán */}
                {orderDetail.payments && orderDetail.payments.length > 0 && (
                  <div className="overflow-x-auto">
                    <h3 className="text-sm font-semibold mb-2">Thanh toán</h3>
                    <table className="min-w-[700px] w-full text-left">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2">Phương thức</th>
                          <th className="px-4 py-2">Trạng thái</th>
                          <th className="px-4 py-2 text-right">Số tiền</th>
                          <th className="px-4 py-2">Mã giao dịch</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {orderDetail.payments.map((p, index) => (
                          <tr key={p.payment_id || p.paymentId || `payment-${index}`}>
                            <td className="px-4 py-2">
                              {translatePaymentMethod(p.payment_method || p.paymentMethod)}
                            </td>
                            <td className="px-4 py-2">
                              {translatePaymentStatus(p.payment_status || p.paymentStatus)}
                            </td>
                            <td className="px-4 py-2 text-right">
                              {(p.amount || 0).toLocaleString('vi-VN')} ₫
                            </td>
                            <td className="px-4 py-2">{p.transaction_id || p.transactionId || '-'}</td>
                          </tr>
                        ))}
                        <tr>
                          <td className="px-4 py-2" colSpan={2}>
                            <span className="font-semibold">Tổng đã thanh toán</span>
                          </td>
                          <td className="px-4 py-2 text-right font-semibold">
                            {sumPayments(orderDetail.payments).toLocaleString('vi-VN')} ₫
                          </td>
                          <td className="px-4 py-2"></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            ) : (
              <div className="p-8 text-center text-gray-500">Không thể tải chi tiết đơn hàng</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrder;
