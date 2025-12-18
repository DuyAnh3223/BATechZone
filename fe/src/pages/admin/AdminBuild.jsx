import React, { useMemo, useState } from 'react';
import { Button } from "@/components/ui/button";

const builds = [
  {
    build_id: 1,
    user_id: 2,
    build_name: 'Gaming Build 2024',
    description: 'Build gaming cao cấp cho 4K gaming',
    total_price: 72860000,
    is_public: true,
    is_saved: true,
    view_count: 150,
    like_count: 35,
    created_at: '2024-04-10',
    updated_at: '2024-04-20',
  },
  {
    build_id: 2,
    user_id: 3,
    build_name: 'Workstation Pro',
    description: 'Build cho công việc đồ họa và render',
    total_price: 95500000,
    is_public: false,
    is_saved: true,
    view_count: 45,
    like_count: 12,
    created_at: '2024-03-25',
    updated_at: '2024-04-15',
  }
];

// Dữ liệu mẫu build_items
const build_items = [
  { build_item_id: 1, build_id: 1, variant_id: 1001, component_type: 'CPU', quantity: 1, unit_price: 12990000, notes: 'i9-13900K', added_at: '2024-04-10' },
  { build_item_id: 2, build_id: 1, variant_id: 1002, component_type: 'VGA', quantity: 1, unit_price: 45990000, notes: 'RTX 4090', added_at: '2024-04-10' },
  { build_item_id: 3, build_id: 1, variant_id: 1003, component_type: 'RAM', quantity: 2, unit_price: 3290000, notes: 'DDR5 16GB', added_at: '2024-04-10' },
  { build_item_id: 4, build_id: 2, variant_id: 2001, component_type: 'CPU', quantity: 1, unit_price: 14990000, notes: 'Ryzen 9 7950X', added_at: '2024-03-25' },
  { build_item_id: 5, build_id: 2, variant_id: 2002, component_type: 'SSD', quantity: 1, unit_price: 5990000, notes: 'WD SN850X 2TB', added_at: '2024-03-25' },
];

const PAGE_SIZE_OPTIONS = [5, 10, 20];

const AdminBuild = () => {
  const [showDetail, setShowDetail] = useState(false);
  const [selectedBuild, setSelectedBuild] = useState(null);
  const [search, setSearch] = useState("");
  const [isPublic, setIsPublic] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return builds.filter(b => {
      const matchText = !q || b.build_name.toLowerCase().includes(q) || (b.description || '').toLowerCase().includes(q);
      const matchPublic = isPublic === "" || String(b.is_public) === isPublic;
      return matchText && matchPublic;
    });
  }, [search, isPublic]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  const goPage = (p) => setPage(Math.min(Math.max(1, p), totalPages));

  const openDetail = (build) => {
    setSelectedBuild(build);
    setShowDetail(true);
  };
  const closeDetail = () => {
    setShowDetail(false);
    setSelectedBuild(null);
  };
  const getItems = (build_id) => build_items.filter((x) => x.build_id === build_id);

  return (
    <section>
      {/* Tiêu đề quản lý nằm trên thanh lọc nhanh */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý cấu hình PC (Builds)</h1>
        <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 text-white px-6 py-2 rounded-lg font-semibold shadow transition">+ Thêm cấu hình</button>
      </div>
      {/* Bộ lọc nhanh */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <input value={search} onChange={(e)=>{ setSearch(e.target.value); setPage(1); }} className="border rounded px-3 py-2 w-full md:w-72" placeholder="Tìm theo tên/mô tả..." />
        <select value={isPublic} onChange={(e)=>{ setIsPublic(e.target.value); setPage(1); }} className="border rounded px-3 py-2">
          <option value="">Tất cả</option>
          <option value="true">Public</option>
          <option value="false">Private</option>
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
        <table className="min-w-[1200px] w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 font-semibold text-gray-600">ID</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Người dùng</th>
              <th className="px-4 py-3 font-semibold text-gray-600">Tên cấu hình</th>
              <th className="px-4 py-3 font-semibold text-gray-600">Mô tả</th>
              <th className="px-4 py-3 font-semibold text-gray-600">Tổng giá</th>
              <th className="px-4 py-3 font-semibold text-gray-600">Công khai</th>
              <th className="px-4 py-3 font-semibold text-gray-600">Đã lưu</th>
              <th className="px-4 py-3 font-semibold text-gray-600">Lượt xem</th>
              <th className="px-4 py-3 font-semibold text-gray-600">Thích</th>
              <th className="px-4 py-3 font-semibold text-gray-600">Ngày tạo</th>
              <th className="px-4 py-3 font-semibold text-gray-600">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y">
          {paginated.map((build) => (
              <tr key={build.build_id} className="hover:bg-blue-50 transition">
                <td className="px-4 py-3 font-medium text-gray-800">{build.build_id}</td>
                <td className="px-4 py-3">{build.user_id}</td>
                <td className="px-4 py-3 font-semibold">{build.build_name}</td>
                <td className="px-4 py-3 max-w-[250px] truncate" title={build.description}>{build.description}</td>
                <td className="px-4 py-3 font-semibold text-blue-700">{build.total_price.toLocaleString()} ₫</td>
                <td className="px-4 py-3 text-center">{build.is_public ? <span className="text-green-600 font-bold">✔</span> : <span className="text-gray-400 font-bold">×</span>}</td>
                <td className="px-4 py-3 text-center">{build.is_saved ? <span className="text-green-600 font-bold">✔</span> : <span className="text-gray-400 font-bold">×</span>}</td>
                <td className="px-4 py-3 text-center">{build.view_count}</td>
                <td className="px-4 py-3 text-center">{build.like_count}</td>
                <td className="px-4 py-3">{build.created_at}</td>
                <td className="px-4 py-3 flex gap-2 whitespace-nowrap">
                  <button onClick={() => openDetail(build)} className="px-3 py-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-600 rounded text-xs font-medium">Chi tiết</button>
                  <button className="px-3 py-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-600 rounded text-xs font-medium">Sửa</button>
                  <button className="px-3 py-1 bg-pink-100 hover:bg-pink-200 text-pink-600 rounded text-xs font-medium">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Phân trang */}
      <div className="flex items-center justify-between px-1 md:px-0 py-2 text-sm text-gray-600">
        <div>Tổng: <span className="font-medium text-gray-800">{filtered.length}</span> builds — Trang {currentPage}/{totalPages}</div>
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

      {showDetail && selectedBuild && (
        <div className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center transition">
          <div className="bg-white rounded-xl shadow-xl w-[92vw] max-w-3xl p-6 relative z-50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Thành phần cấu hình: <span className="text-blue-700">{selectedBuild.build_name}</span></h2>
              <button onClick={closeDetail} className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm">Đóng</button>
            </div>
            <table className="w-full min-w-[600px] text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-gray-700 font-semibold">#</th>
                  <th className="px-4 py-2 text-gray-700 font-semibold">Thành phần</th>
                  <th className="px-4 py-2 text-gray-700 font-semibold">ID Phiên bản</th>
                  <th className="px-4 py-2 text-gray-700 font-semibold">Số lượng</th>
                  <th className="px-4 py-2 text-gray-700 font-semibold">Đơn giá</th>
                  <th className="px-4 py-2 text-gray-700 font-semibold">Ghi chú</th>
                  <th className="px-4 py-2 text-gray-700 font-semibold">Thêm lúc</th>
                </tr>
              </thead>
              <tbody>
                {getItems(selectedBuild.build_id).length === 0 ? (
                  <tr><td className="px-4 py-3 text-gray-500 text-center" colSpan={7}>Chưa có thành phần nào trong build này.</td></tr>
                ) : (
                  getItems(selectedBuild.build_id).map((item, idx) => (
                    <tr key={item.build_item_id} className="hover:bg-gray-100 transition">
                      <td className="px-4 py-2">{idx + 1}</td>
                      <td className="px-4 py-2">{item.component_type || '-'}</td>
                      <td className="px-4 py-2">{item.variant_id}</td>
                      <td className="px-4 py-2">{item.quantity}</td>
                      <td className="px-4 py-2">{item.unit_price.toLocaleString()} ₫</td>
                      <td className="px-4 py-2">{item.notes || '-'}</td>
                      <td className="px-4 py-2">{item.added_at}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
};

export default AdminBuild;
