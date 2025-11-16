import React from 'react';
import AdminCouponItem from './AdminCouponItem';

const AdminCouponList = ({ 
  coupons = [], 
  loading = false, 
  total = 0,
  currentPage = 1,
  totalPages = 1,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  onEdit,
  onDelete,
  onDetail
}) => {
  const PAGE_SIZE_OPTIONS = [5, 10, 20];

  const goPage = (p) => {
    const page = Math.min(Math.max(1, p), totalPages);
    onPageChange && onPageChange(page);
  };

  return (
    <div className="overflow-x-auto rounded-xl bg-white shadow pb-2">
      <table className="min-w-[1250px] w-full text-left">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 font-semibold text-gray-600">ID</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Mã coupon</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Mô tả</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Loại</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Giá trị</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Giảm tối đa</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Đơn tối thiểu</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Số lượng</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Đã dùng</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Kích hoạt</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Hiệu lực từ</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Hiệu lực đến</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Hành động</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {loading ? (
            <tr><td className="px-4 py-6 text-gray-500" colSpan={13}>Đang tải...</td></tr>
          ) : coupons.length === 0 ? (
            <tr><td className="px-4 py-6 text-gray-500 text-center" colSpan={13}>Không có coupon nào</td></tr>
          ) : (
            coupons.map((coupon) => (
              <AdminCouponItem
                key={coupon.coupon_id}
                coupon={coupon}
                onEdit={onEdit}
                onDelete={onDelete}
                onDetail={onDetail}
              />
            ))
          )}
        </tbody>
      </table>
      {/* Phân trang */}
      <div className="flex items-center justify-between px-3 py-2 text-sm text-gray-600">
        <div>
          Tổng: <span className="font-medium text-gray-800">{total}</span> coupon — Trang {currentPage}/{totalPages}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Hiển thị</span>
            <select 
              value={pageSize} 
              onChange={(e) => onPageSizeChange && onPageSizeChange(Number(e.target.value))} 
              className="border rounded px-2 py-1 text-sm"
            >
              {PAGE_SIZE_OPTIONS.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <span className="text-sm text-gray-500">mục/trang</span>
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => goPage(currentPage - 1)} 
              disabled={currentPage === 1} 
              className="px-3 py-1 rounded border disabled:opacity-50 hover:bg-gray-100"
            >
              Trước
            </button>
            {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
              const p = i + 1;
              return (
                <button 
                  key={p} 
                  onClick={() => goPage(p)} 
                  className={`px-3 py-1 rounded border ${
                    p === currentPage 
                      ? 'bg-indigo-100 text-indigo-700' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {p}
                </button>
              );
            })}
            <button 
              onClick={() => goPage(currentPage + 1)} 
              disabled={currentPage === totalPages} 
              className="px-3 py-1 rounded border disabled:opacity-50 hover:bg-gray-100"
            >
              Sau
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCouponList;

