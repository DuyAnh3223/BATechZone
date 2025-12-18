import React, { useState, useEffect } from 'react';
import { translatePaymentStatus, translatePaymentMethod, translateOrderStatus } from '../../utils/statusTranslations';
import { useOrderStore } from '@/stores/useOrderStore';

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

const formatDateTime = (dateString) => {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return dateString;
  }
};

const getOrderStatusClass = (status) => {
  switch (status) {
    case 'delivered': return 'bg-green-100 text-green-700';
    case 'shipping': return 'bg-blue-100 text-blue-700';
    case 'processing': return 'bg-yellow-100 text-yellow-700';
    case 'pending': return 'bg-gray-100 text-gray-600';
    case 'cancelled': return 'bg-pink-100 text-pink-700';
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

const statusClass = (s) => (
  s === 'completed' ? 'bg-green-100 text-green-700' :
  s === 'paid' ? 'bg-green-100 text-green-700' :
  s === 'failed' ? 'bg-pink-100 text-pink-700' :
  s === 'refunded' ? 'bg-yellow-100 text-yellow-700' : 
  s === 'pending' ? 'bg-gray-100 text-gray-600' : 'bg-gray-100 text-gray-500'
);

const AdminPayment = () => {
  const { orders, pagination, loading, fetchOrders, fetchOrderById } = useOrderStore();
  const [showDetail, setShowDetail] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [orderDetail, setOrderDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [search, setSearch] = useState("");
  const [method, setMethod] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const PAGE_SIZE_OPTIONS = [5, 10, 20];

  // Extract payments từ orders
  const allPayments = React.useMemo(() => {
    const paymentsList = [];
    if (orders && Array.isArray(orders)) {
      orders.forEach(order => {
        if (order.payments && Array.isArray(order.payments) && order.payments.length > 0) {
          order.payments.forEach(payment => {
            paymentsList.push({
              ...payment,
              order_id: order.order_id || order.orderId,
              order_number: order.order_number || order.orderNumber,
              order_status: order.order_status || order.orderStatus,
              payment_status: order.payment_status || order.paymentStatus
            });
          });
        }
      });
    }
    return paymentsList;
  }, [orders]);

  // Fetch orders khi component mount hoặc filters thay đổi
  useEffect(() => {
    loadOrders();
  }, [page, pageSize, method, status, search]);

  const loadOrders = async () => {
    try {
      const params = {
        page,
        limit: pageSize,
        paymentMethod: method || undefined,
        paymentStatus: status || undefined,
        search: search.trim() || undefined
      };
      await fetchOrders(params);
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  // Filter payments
  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return allPayments.filter(p => {
      const orderNumber = (p.order_number || '').toLowerCase();
      const tx = (p.transaction_id || p.transactionId || '').toLowerCase();
      const paymentId = String(p.payment_id || p.paymentId || '').toLowerCase();
      const matchText = !q || orderNumber.includes(q) || tx.includes(q) || paymentId.includes(q);
      const matchMethod = !method || (p.payment_method || p.paymentMethod) === method;
      const matchStatus = !status || (p.payment_status || p.paymentStatus) === status;
      return matchText && matchMethod && matchStatus;
    });
  }, [allPayments, search, method, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginated = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  const openDetail = async (payment) => {
    setSelectedPayment(payment);
    setShowDetail(true);
    setLoadingDetail(true);
    try {
      const orderId = payment.order_id || payment.orderId;
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
    setSelectedPayment(null);
    setOrderDetail(null);
  };

  const sumSubtotal = (items) => {
    if (!items || !Array.isArray(items)) return 0;
    return items.reduce((t, r) => {
      const subtotal = parseFloat(r.subtotal || r.subTotal || 0);
      return t + (isNaN(subtotal) ? 0 : subtotal);
    }, 0);
  };

  const goPage = (p) => setPage(Math.min(Math.max(1, p), totalPages));

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Quản lý thanh toán</h2>
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
          placeholder="Tìm theo mã đơn/Order ID/Transaction ID..." 
        />
        <select 
          value={method} 
          onChange={(e) => { 
            setMethod(e.target.value); 
            setPage(1); 
          }} 
          className="border rounded px-3 py-2"
        >
          <option value="">Tất cả phương thức</option>
          <option value="bank_transfer">Chuyển khoản</option>
          <option value="credit_card">Thẻ</option>
          <option value="cod">COD</option>
          <option value="e_wallet">Ví điện tử</option>
        </select>
        <select 
          value={status} 
          onChange={(e) => { 
            setStatus(e.target.value); 
            setPage(1); 
          }} 
          className="border rounded px-3 py-2"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="completed">Hoàn tất</option>
          <option value="paid">Đã thanh toán</option>
          <option value="failed">Thất bại</option>
          <option value="refunded">Hoàn tiền</option>
          <option value="pending">Đang xử lý</option>
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

      {/* Bảng thanh toán */}
      <div className="overflow-x-auto rounded-xl bg-white shadow pb-2">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Đang tải...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Không có giao dịch thanh toán nào</div>
        ) : (
          <>
            <table className="min-w-[1200px] w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 font-semibold text-gray-600">ID</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Order ID</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Phương thức</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Trạng thái</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Số tiền</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Mã giao dịch</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Cổng thanh toán</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Đã thanh toán lúc</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Ngày tạo</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {paginated.map((p, index) => {
                  const paymentId = p.payment_id || p.paymentId;
                  const orderId = p.order_id || p.orderId;
                  const paymentMethod = p.payment_method || p.paymentMethod;
                  const paymentStatus = p.payment_status || p.paymentStatus;
                  const amount = p.amount || 0;
                  const transactionId = p.transaction_id || p.transactionId;
                  const paymentGateway = p.payment_gateway || p.paymentGateway;
                  const paidAt = p.paid_at || p.paidAt;
                  const createdAt = p.created_at || p.createdAt;
                  
                  return (
                    <tr key={paymentId || `payment-${index}`} className="hover:bg-blue-50 transition">
                      <td className="px-4 py-3 font-medium text-gray-800">{paymentId}</td>
                      <td className="px-4 py-3">{orderId}</td>
                      <td className="px-4 py-3">{translatePaymentMethod(paymentMethod)}</td>
                      <td className="px-4 py-3">
                        <span className={`px-3 py-0.5 rounded-full text-xs font-semibold ${statusClass(paymentStatus)}`}>
                          {translatePaymentStatus(paymentStatus)}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-blue-700">
                        {parseFloat(amount).toLocaleString('vi-VN')} ₫
                      </td>
                      <td className="px-4 py-3">{transactionId || '-'}</td>
                      <td className="px-4 py-3">{paymentGateway || '-'}</td>
                      <td className="px-4 py-3">{paidAt ? formatDateTime(paidAt) : '-'}</td>
                      <td className="px-4 py-3">{createdAt ? formatDate(createdAt) : '-'}</td>
                      <td className="px-4 py-3 flex gap-2 whitespace-nowrap">
                        <button 
                          onClick={() => openDetail(p)} 
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
                Tổng: <span className="font-medium text-gray-800">{filtered.length}</span> giao dịch — Trang {currentPage}/{totalPages}
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => goPage(currentPage - 1)} 
                  disabled={currentPage === 1} 
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
                      className={`px-3 py-1 rounded border ${p === currentPage ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'}`}
                    >
                      {p}
                    </button>
                  );
                })}
                <button 
                  onClick={() => goPage(currentPage + 1)} 
                  disabled={currentPage === totalPages} 
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
      {showDetail && selectedPayment && (
        <div className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center transition">
          <div className="bg-white rounded-xl shadow-xl w-[94vw] max-w-4xl p-6 relative z-50 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm text-gray-500">Chi tiết đơn hàng</div>
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedPayment.order_number || selectedPayment.orderNumber || `Order #${selectedPayment.order_id || selectedPayment.orderId}`}
                </h2>
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
                    <div>
                      <span className={`px-3 py-0.5 rounded-full text-xs font-semibold ${getOrderStatusClass(orderDetail.order_status || orderDetail.orderStatus)}`}>
                        {translateOrderStatus(orderDetail.order_status || orderDetail.orderStatus)}
                      </span>
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
                              <span className={`px-3 py-0.5 rounded-full text-xs font-semibold ${statusClass(p.payment_status || p.paymentStatus)}`}>
                                {translatePaymentStatus(p.payment_status || p.paymentStatus)}
                              </span>
                            </td>
                            <td className="px-4 py-2 text-right">
                              {parseFloat(p.amount || 0).toLocaleString('vi-VN')} ₫
                            </td>
                            <td className="px-4 py-2">{p.transaction_id || p.transactionId || '-'}</td>
                          </tr>
                        ))}
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

export default AdminPayment;
