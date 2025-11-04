import React, { useMemo, useState } from 'react';
import { translateOrderStatus, translatePaymentStatus, translatePaymentMethod } from '../../utils/statusTranslations';

const orders = [
  {
    order_id: 1,
    user_id: 2,
    order_number: 'ORD-2024-001',
    order_status: 'delivered',
    payment_status: 'paid',
    total_amount: 19170000,
    created_at: '2024-04-15',
    updated_at: '2024-04-18',
  },
  {
    order_id: 2,
    user_id: 3,
    order_number: 'ORD-2024-002',
    order_status: 'shipping',
    payment_status: 'paid',
    total_amount: 45990000,
    created_at: '2024-04-20',
    updated_at: '2024-04-21',
  },
  {
    order_id: 3,
    user_id: 2,
    order_number: 'ORD-2024-003',
    order_status: 'pending',
    payment_status: 'unpaid',
    total_amount: 2890000,
    created_at: '2024-04-24',
    updated_at: '2024-04-24',
  },
    {
    order_id: 4,
    user_id: 4,
    order_number: 'ORD-2024-004',
    order_status: 'cancelled',
    payment_status: 'unpaid',
    total_amount: 5500000,
    created_at: '2024-04-22',
    updated_at: '2024-04-23',
  }
];

// Dữ liệu mẫu order_items
const order_items = [
  { order_item_id: 1, order_id: 1, variant_id: 1, product_name: 'Intel Core i9-13900K', variant_name: 'Box', sku: 'CPU-I9-13900K-001', quantity: 1, unit_price: 12990000, subtotal: 12990000 },
  { order_item_id: 2, order_id: 1, variant_id: 5, product_name: 'Corsair Vengeance DDR5', variant_name: '16GB', sku: 'RAM-CORS-DDR5-16GB', quantity: 2, unit_price: 3290000, subtotal: 6580000 },
  { order_item_id: 3, order_id: 2, variant_id: 3, product_name: 'NVIDIA RTX 4090', variant_name: '24GB', sku: 'VGA-RTX4090-001', quantity: 1, unit_price: 45990000, subtotal: 45990000 },
];

// Dữ liệu mẫu payments
const payments = [
  { payment_id: 1, order_id: 1, payment_method: 'bank_transfer', payment_status: 'completed', amount: 19170000, transaction_id: 'TXN-001-2024', payment_gateway: 'VNPay', paid_at: '2024-04-18 10:21' },
  { payment_id: 2, order_id: 2, payment_method: 'credit_card', payment_status: 'completed', amount: 45990000, transaction_id: 'TXN-002-2024', payment_gateway: 'Stripe', paid_at: '2024-04-21 13:05' },
  { payment_id: 3, order_id: 3, payment_method: 'cod', payment_status: 'pending', amount: 2890000, transaction_id: null, payment_gateway: null, paid_at: null },
];

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


const AdminOrder = () => {
  const [showDetail, setShowDetail] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [payStatus, setPayStatus] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const PAGE_SIZE_OPTIONS = [5, 10, 20];

  const openDetail = (order) => { setSelectedOrder(order); setShowDetail(true); };
  const closeDetail = () => { setShowDetail(false); setSelectedOrder(null); };
  const itemsOfOrder = (order_id) => order_items.filter(i => i.order_id === order_id);
  const paymentsOfOrder = (order_id) => payments.filter(p => p.order_id === order_id);
  const sumSubtotal = (rows) => rows.reduce((t, r) => t + r.subtotal, 0);
  const sumPayments = (rows) => rows.reduce((t, r) => t + (r.amount || 0), 0);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders.filter(o => {
      const matchText = !q || o.order_number.toLowerCase().includes(q) || String(o.user_id).includes(q);
      const matchStatus = !status || o.order_status === status;
      const matchPay = !payStatus || o.payment_status === payStatus;
      return matchText && matchStatus && matchPay;
    });
  }, [search, status, payStatus]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  const goPage = (p) => setPage(Math.min(Math.max(1, p), totalPages));

  return (
  <section>
    <div className="mb-6 flex items-center justify-between">
      <h1 className="text-2xl font-bold text-gray-800">Quản lý đơn hàng</h1>
      <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 text-white px-6 py-2 rounded-lg font-semibold shadow transition">+ Thêm đơn hàng</button>
    </div>
    {/* Bộ lọc nhanh */}
    <div className="mb-3 flex flex-wrap items-center gap-2">
      <input value={search} onChange={(e)=>{ setSearch(e.target.value); setPage(1); }} className="border rounded px-3 py-2 w-full md:w-72" placeholder="Tìm theo mã đơn/ID user..." />
      <select value={status} onChange={(e)=>{ setStatus(e.target.value); setPage(1); }} className="border rounded px-3 py-2">
        <option value="">Tất cả trạng thái đơn</option>
        <option value="delivered">Hoàn thành</option>
        <option value="shipping">Đang giao</option>
        <option value="processing">Đang xử lý</option>
        <option value="pending">Chờ xử lý</option>
        <option value="cancelled">Đã hủy</option>
      </select>
      <select value={payStatus} onChange={(e)=>{ setPayStatus(e.target.value); setPage(1); }} className="border rounded px-3 py-2">
        <option value="">Tất cả thanh toán</option>
        <option value="paid">Đã thanh toán</option>
        <option value="unpaid">Chưa thanh toán</option>
      </select>
      <div className="ml-auto flex items-center gap-2">
        <span className="text-sm text-gray-500">Hiển thị</span>
        <select value={pageSize} onChange={(e)=>{ setPageSize(Number(e.target.value)); setPage(1); }} className="border rounded px-2 py-1 text-sm">
          {PAGE_SIZE_OPTIONS.map(s => (<option key={s} value={s}>{s}</option>))}
        </select>
        <span className="text-sm text-gray-500">mục/trang</span>
      </div>
    </div>
    <div className="overflow-x-auto rounded-xl bg-white shadow pb-2">
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
          {paginated.map((order) => (
            <tr key={order.order_id} className="hover:bg-blue-50 transition">
              <td className="px-4 py-3 font-medium text-gray-800">{order.order_id}</td>
              <td className="px-4 py-3">{order.user_id}</td>
              <td className="px-4 py-3 font-semibold text-blue-800">{order.order_number}</td>
              <td className="px-4 py-3"><span className={`px-3 py-0.5 rounded-full text-xs font-semibold ${getOrderStatusClass(order.order_status)}`}>{translateOrderStatus(order.order_status)}</span></td>
              <td className="px-4 py-3"><span className={`px-3 py-0.5 rounded-full text-xs font-semibold ${getPaymentStatusClass(order.payment_status)}`}>{translatePaymentStatus(order.payment_status)}</span></td>
              <td className="px-4 py-3 font-semibold text-blue-700">{order.total_amount.toLocaleString()} ₫</td>
              <td className="px-4 py-3">{order.created_at}</td>
              <td className="px-4 py-3">{order.updated_at}</td>
              <td className="px-4 py-3 flex gap-2 whitespace-nowrap">
                <button onClick={()=>openDetail(order)} className="px-3 py-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-600 rounded text-xs font-medium">Chi tiết</button>
                <button className="px-3 py-1 bg-pink-100 hover:bg-pink-200 text-pink-600 rounded text-xs font-medium">Hủy</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Phân trang */}
      <div className="flex items-center justify-between px-3 py-2 text-sm text-gray-600">
        <div>Tổng: <span className="font-medium text-gray-800">{filtered.length}</span> đơn — Trang {currentPage}/{totalPages}</div>
        <div className="flex items-center gap-1">
          <button onClick={()=>goPage(currentPage-1)} disabled={currentPage===1} className="px-3 py-1 rounded border disabled:opacity-50">Trước</button>
          {Array.from({length: totalPages}).slice(0,5).map((_,i)=>{
            const p = i+1; return (
              <button key={p} onClick={()=>goPage(p)} className={`px-3 py-1 rounded border ${p===currentPage ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'}`}>{p}</button>
            );
          })}
          <button onClick={()=>goPage(currentPage+1)} disabled={currentPage===totalPages} className="px-3 py-1 rounded border disabled:opacity-50">Sau</button>
        </div>
      </div>
    </div>

    {showDetail && selectedOrder && (
      <div className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center transition">
        <div className="bg-white rounded-xl shadow-xl w-[94vw] max-w-4xl p-6 relative z-50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm text-gray-500">Order</div>
              <h2 className="text-xl font-bold text-gray-900">{selectedOrder.order_number}</h2>
            </div>
            <button onClick={closeDetail} className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm">Đóng</button>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-4 text-sm">
            <div className="border rounded p-3"><div className="text-gray-500">Trạng thái đơn</div><div className="font-semibold">{translateOrderStatus(selectedOrder.order_status)}</div></div>
            <div className="border rounded p-3"><div className="text-gray-500">Thanh toán</div><div className="font-semibold">{translatePaymentStatus(selectedOrder.payment_status)}</div></div>
            <div className="border rounded p-3"><div className="text-gray-500">Tổng tiền</div><div className="font-semibold text-blue-700">{selectedOrder.total_amount.toLocaleString()} ₫</div></div>
          </div>

          <div className="overflow-x-auto mb-6">
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
                {itemsOfOrder(selectedOrder.order_id).map(item => (
                  <tr key={item.order_item_id}>
                    <td className="px-4 py-2">{item.sku}</td>
                    <td className="px-4 py-2">{item.product_name}</td>
                    <td className="px-4 py-2">{item.variant_name || '-'}</td>
                    <td className="px-4 py-2 text-right">{item.quantity}</td>
                    <td className="px-4 py-2 text-right">{item.unit_price.toLocaleString()} ₫</td>
                    <td className="px-4 py-2 text-right">{item.subtotal.toLocaleString()} ₫</td>
                  </tr>
                ))}
                <tr>
                  <td className="px-4 py-2" colSpan={5}><span className="font-semibold">Tổng tạm tính</span></td>
                  <td className="px-4 py-2 text-right font-semibold">{sumSubtotal(itemsOfOrder(selectedOrder.order_id)).toLocaleString()} ₫</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="overflow-x-auto">
            <div className="text-sm font-semibold mb-2">Thanh toán</div>
            <table className="min-w-[700px] w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2">Phương thức</th>
                  <th className="px-4 py-2">Trạng thái</th>
                  <th className="px-4 py-2 text-right">Số tiền</th>
                  <th className="px-4 py-2">Mã giao dịch</th>
                  <th className="px-4 py-2">Cổng</th>
                  <th className="px-4 py-2">Thanh toán lúc</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {paymentsOfOrder(selectedOrder.order_id).map(p => (
                  <tr key={p.payment_id}>
                    <td className="px-4 py-2">{translatePaymentMethod(p.payment_method)}</td>
                    <td className="px-4 py-2">{translatePaymentStatus(p.payment_status)}</td>
                    <td className="px-4 py-2 text-right">{p.amount.toLocaleString()} ₫</td>
                    <td className="px-4 py-2">{p.transaction_id || '-'}</td>
                    <td className="px-4 py-2">{p.payment_gateway || '-'}</td>
                    <td className="px-4 py-2">{p.paid_at || '-'}</td>
                  </tr>
                ))}
                <tr>
                  <td className="px-4 py-2" colSpan={2}><span className="font-semibold">Tổng đã thanh toán</span></td>
                  <td className="px-4 py-2 text-right font-semibold">{sumPayments(paymentsOfOrder(selectedOrder.order_id)).toLocaleString()} ₫</td>
                  <td className="px-4 py-2" colSpan={3}></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )}
  </section>
  );
};

export default AdminOrder;
