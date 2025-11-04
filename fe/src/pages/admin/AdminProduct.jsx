import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

// Dữ liệu mẫu (giống cấu trúc bảng products)
const products = [
  {
    product_id: 1,
    category: 'CPU',
    product_name: 'Intel Core i9-13900K',
    slug: 'intel-core-i9-13900k',
    description: 'CPU Intel thế hệ 13, 24 nhân 32 luồng',
    brand: 'Intel',
    model: 'i9-13900K',
    base_price: 12990000,
    is_active: true,
    is_featured: true,
    view_count: 1290,
    rating_average: 4.95,
    review_count: 48,
    created_at: '2024-03-01',
    updated_at: '2024-04-18',
  },
  {
    product_id: 2,
    category: 'VGA',
    product_name: 'NVIDIA RTX 4090',
    slug: 'nvidia-rtx-4090',
    description: 'Card đồ họa RTX 4090 24GB GDDR6X',
    brand: 'NVIDIA',
    model: 'RTX-4090',
    base_price: 45990000,
    is_active: true,
    is_featured: true,
    view_count: 974,
    rating_average: 4.90,
    review_count: 42,
    created_at: '2024-03-05',
    updated_at: '2024-04-12',
  }
];

const PAGE_SIZE_OPTIONS = [5, 10, 20];

const AdminProduct = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const categories = useMemo(() => Array.from(new Set(products.map(p => p.category))), []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter(p => {
      const matchText = !q || p.product_name.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q);
      const matchCat = !category || p.category === category;
      return matchText && matchCat;
    });
  }, [search, category]);

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
      <h1 className="text-2xl font-bold text-gray-800">Quản lý sản phẩm</h1>
      <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 text-white px-6 py-2 rounded-lg font-semibold shadow transition">+ Thêm sản phẩm</button>
    </div>

    {/* Bộ lọc nhanh */}
    <div className="mb-3 flex flex-wrap items-center gap-2">
      <input
        value={search}
        onChange={(e)=>{ setSearch(e.target.value); setPage(1); }}
        className="border rounded px-3 py-2 w-full md:w-72"
        placeholder="Tìm theo tên/slug..."
      />
      <select
        value={category}
        onChange={(e)=>{ setCategory(e.target.value); setPage(1); }}
        className="border rounded px-3 py-2"
      >
        <option value="">Tất cả danh mục</option>
        {categories.map(c => (<option key={c} value={c}>{c}</option>))}
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
      <table className="min-w-[1300px] w-full text-left">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 font-semibold text-gray-600">ID</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Tên sản phẩm</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Slug</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Danh mục</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Mô tả</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Thương hiệu</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Mẫu</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Giá gốc</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Kích hoạt</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Nổi bật</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Lượt xem</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Điểm ĐG</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Số review</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Ngày tạo</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Hành động</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {paginated.map((prod) => (
            <tr key={prod.product_id} className="hover:bg-blue-50 transition">
              <td className="px-4 py-3 font-medium text-gray-800">{prod.product_id}</td>
              <td className="px-4 py-3">{prod.product_name}</td>
              <td className="px-4 py-3">{prod.slug}</td>
              <td className="px-4 py-3">{prod.category}</td>
              <td className="px-4 py-3 max-w-[220px] truncate" title={prod.description}>{prod.description}</td>
              <td className="px-4 py-3">{prod.brand || '-'}</td>
              <td className="px-4 py-3">{prod.model || '-'}</td>
              <td className="px-4 py-3 text-blue-700 font-semibold">{prod.base_price.toLocaleString()} ₫</td>
              <td className="px-4 py-3 text-center">{prod.is_active ? <span className="text-green-600 font-bold">●</span> : <span className="text-gray-400 font-bold">●</span>}</td>
              <td className="px-4 py-3 text-center">{prod.is_featured ? <span className="text-pink-600 font-bold">★</span> : <span className="text-gray-300 font-bold">★</span>}</td>
              <td className="px-4 py-3 text-center">{prod.view_count}</td>
              <td className="px-4 py-3 text-center">{prod.rating_average}</td>
              <td className="px-4 py-3 text-center">{prod.review_count}</td>
              <td className="px-4 py-3">{prod.created_at}</td>
              <td className="px-4 py-3 flex gap-2 whitespace-nowrap">
                <Link to={`/admin/products/${prod.product_id}`} className="px-3 py-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-600 rounded text-xs font-medium">Chi tiết</Link>
                <button className="px-3 py-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-600 rounded text-xs font-medium">Sửa</button>
                <button className="px-3 py-1 bg-pink-100 hover:bg-pink-200 text-pink-600 rounded text-xs font-medium">Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Phân trang */}
      <div className="flex items-center justify-between px-3 py-2 text-sm text-gray-600">
        <div>Tổng: <span className="font-medium text-gray-800">{filtered.length}</span> sản phẩm — Trang {currentPage}/{totalPages}</div>
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

export default AdminProduct;

