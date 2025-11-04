import React, { useMemo, useState } from 'react';

const categories = [
  {
    category_id: 1,
    category_name: 'Linh kiện máy tính',
    slug: 'linh-kien-may-tinh',
    description: 'Các linh kiện máy tính',
    parent_category_id: null,
    image_url: '',
    icon: 'cpu',
    is_active: true,
    display_order: 1,
    created_at: '2024-04-01',
    updated_at: '2024-04-10',
  },
  {
    category_id: 2,
    category_name: 'Laptop',
    slug: 'laptop',
    description: 'Laptop các loại',
    parent_category_id: null,
    image_url: '',
    icon: 'laptop',
    is_active: true,
    display_order: 2,
    created_at: '2024-04-04',
    updated_at: '2024-04-09',
  },
  {
    category_id: 3,
    category_name: 'CPU',
    slug: 'cpu',
    description: 'Bộ vi xử lý',
    parent_category_id: 1,
    image_url: '',
    icon: 'cpu',
    is_active: true,
    display_order: 3,
    created_at: '2024-04-05',
    updated_at: '2024-04-15',
  }
];

const PAGE_SIZE_OPTIONS = [5, 10, 20];

const AdminCategory = () => {
  const [search, setSearch] = useState("");
  const [active, setActive] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return categories.filter(cat => {
      const matchText = !q || cat.category_name.toLowerCase().includes(q) || cat.slug.toLowerCase().includes(q);
      const matchActive = active === "" || String(cat.is_active) === active;
      return matchText && matchActive;
    });
  }, [search, active]);

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
      <h1 className="text-2xl font-bold text-gray-800">Quản lý danh mục (Categories)</h1>
      <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 text-white px-6 py-2 rounded-lg font-semibold shadow transition">+ Thêm danh mục</button>
    </div>

    {/* Bộ lọc nhanh */}
    <div className="mb-3 flex flex-wrap items-center gap-2">
      <input value={search} onChange={(e)=>{ setSearch(e.target.value); setPage(1); }} className="border rounded px-3 py-2 w-full md:w-72" placeholder="Tìm theo tên/slug..." />
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
      <table className="min-w-[1100px] w-full text-left">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 font-semibold text-gray-600">ID</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Tên danh mục</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Slug</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Mô tả</th>
            <th className="px-4 py-3 font-semibold text-gray-600">ID Danh mục cha</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Icon</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Thứ tự</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Kích hoạt</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Ngày tạo</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Hành động</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {paginated.map((cat) => (
            <tr key={cat.category_id} className="hover:bg-blue-50 transition">
              <td className="px-4 py-3 font-medium text-gray-800">{cat.category_id}</td>
              <td className="px-4 py-3 font-semibold">{cat.category_name}</td>
              <td className="px-4 py-3">{cat.slug}</td>
              <td className="px-4 py-3 max-w-[220px] truncate" title={cat.description}>{cat.description}</td>
              <td className="px-4 py-3">{cat.parent_category_id || '-'}</td>
              <td className="px-4 py-3 text-blue-700">{cat.icon || '-'}</td>
              <td className="px-4 py-3 text-center">{cat.display_order}</td>
              <td className="px-4 py-3 text-center">{cat.is_active ? <span className="text-green-600 font-bold">✔</span> : <span className="text-gray-400 font-bold">×</span>}</td>
              <td className="px-4 py-3">{cat.created_at}</td>
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
        <div>Tổng: <span className="font-medium text-gray-800">{filtered.length}</span> danh mục — Trang {currentPage}/{totalPages}</div>
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

export default AdminCategory;
