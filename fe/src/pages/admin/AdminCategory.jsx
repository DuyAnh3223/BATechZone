import React from 'react';

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

const AdminCategory = () => (
  <section>
    <div className="mb-6 flex items-center justify-between">
      <h1 className="text-2xl font-bold text-gray-800">Quản lý danh mục (Categories)</h1>
      <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 text-white px-6 py-2 rounded-lg font-semibold shadow transition">+ Thêm danh mục</button>
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
          {categories.map((cat) => (
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
    </div>
  </section>
);

export default AdminCategory;
