import React, { useMemo, useState } from 'react';

const coupons = [
  {
    coupon_id: 1,
    coupon_code: 'WELCOME2025',
    description: 'Giảm 10% cho khách mới',
    discount_type: 'percentage',
    discount_value: 10.00,
    max_discount_amount: null,
    min_order_amount: 1000000,
    usage_limit: 100,
    used_count: 30,
    is_active: true,
    valid_from: '2024-05-01',
    valid_until: '2024-07-01',
    created_at: '2024-04-30',
  },
  {
    coupon_id: 2,
    coupon_code: 'TECH500K',
    description: 'Giảm 500K cho đơn từ 10 triệu',
    discount_type: 'fixed_amount',
    discount_value: 500000.00,
    max_discount_amount: null,
    min_order_amount: 10000000,
    usage_limit: 50,
    used_count: 10,
    is_active: false,
    valid_from: '2024-05-15',
    valid_until: '2024-07-15',
    created_at: '2024-05-10',
  }
];

const PAGE_SIZE_OPTIONS = [5, 10, 20];

const AdminCoupon = () => {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [active, setActive] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return coupons.filter(c => {
      const code = (c.coupon_code || '').toLowerCase();
      const desc = (c.description || '').toLowerCase();
      const matchText = !q || code.includes(q) || desc.includes(q);
      const matchType = !type || (type === 'percentage' ? c.discount_type === 'percentage' : c.discount_type !== 'percentage');
      const matchActive = active === "" || String(c.is_active) === active;
      return matchText && matchType && matchActive;
    });
  }, [search, type, active]);

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
      <h1 className="text-2xl font-bold text-gray-800">Quản lý mã giảm giá/Coupon</h1>
      <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 text-white px-6 py-2 rounded-lg font-semibold shadow transition">+ Thêm coupon</button>
    </div>

    {/* Bộ lọc nhanh */}
    <div className="mb-3 flex flex-wrap items-center gap-2">
      <input value={search} onChange={(e)=>{ setSearch(e.target.value); setPage(1); }} className="border rounded px-3 py-2 w-full md:w-72" placeholder="Tìm theo mã/miêu tả..." />
      <select value={type} onChange={(e)=>{ setType(e.target.value); setPage(1); }} className="border rounded px-3 py-2">
        <option value="">Tất cả loại</option>
        <option value="percentage">Phần trăm</option>
        <option value="fixed">Số tiền (VNĐ)</option>
      </select>
      <select value={active} onChange={(e)=>{ setActive(e.target.value); setPage(1); }} className="border rounded px-3 py-2">
        <option value="">Tất cả</option>
        <option value="true">Kích hoạt</option>
        <option value="false">Vô hiệu</option>
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
            <th className="px-4 py-3 font-semibold text-gray-600">Giới hạn lượt</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Đã dùng</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Kích hoạt</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Hiệu lực từ</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Hiệu lực đến</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Ngày tạo</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Hành động</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {paginated.map((c) => (
            <tr key={c.coupon_id} className="hover:bg-blue-50 transition">
              <td className="px-4 py-3 font-medium text-gray-800">{c.coupon_id}</td>
              <td className="px-4 py-3 font-semibold text-blue-800 uppercase">{c.coupon_code}</td>
              <td className="px-4 py-3 max-w-[180px] truncate" title={c.description}>{c.description || '-'}</td>
              <td className="px-4 py-3">{c.discount_type === 'percentage' ? 'Phần trăm' : 'VNĐ'}</td>
              <td className="px-4 py-3">{c.discount_type === 'percentage' ? `${c.discount_value}%` : `${c.discount_value.toLocaleString()} ₫`}</td>
              <td className="px-4 py-3">{c.max_discount_amount ? `${c.max_discount_amount.toLocaleString()} ₫` : '-'}</td>
              <td className="px-4 py-3">{c.min_order_amount.toLocaleString()} ₫</td>
              <td className="px-4 py-3 text-center">{c.usage_limit || '-'}</td>
              <td className="px-4 py-3 text-center">{c.used_count}</td>
              <td className="px-4 py-3 text-center">{c.is_active ? <span className="text-green-600 font-bold">●</span> : <span className="text-gray-400 font-bold">●</span>}</td>
              <td className="px-4 py-3">{c.valid_from}</td>
              <td className="px-4 py-3">{c.valid_until || '-'}</td>
              <td className="px-4 py-3">{c.created_at}</td>
              <td className="px-4 py-3 flex gap-2 whitespace-nowrap">
                <button className="px-3 py-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-600 rounded text-xs font-medium">Sửa</button>
                <button className="px-3 py-1 bg-pink-100 hover:bg-pink-200 text-pink-600 rounded text-xs font-medium">Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Phân trang */}
      <div className="flex items-center justify-between px-3 py-2 text-sm text-gray-600">
        <div>Tổng: <span className="font-medium text-gray-800">{filtered.length}</span> coupon — Trang {currentPage}/{totalPages}</div>
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
  </section>
  );
};

export default AdminCoupon;
