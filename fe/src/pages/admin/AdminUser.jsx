import React from 'react';
import { translateUserRole } from '../../utils/statusTranslations';

const users = [
  {
    user_id: 1,
    username: 'admin',
    email: 'admin@techstore.com',
    full_name: 'Administrator',
    phone: '09012345670',
    role: 'admin',
    is_active: true,
    created_at: '2024-03-12',
    updated_at: '2024-04-01',
    last_login: '2024-04-25',
  },
  {
    user_id: 2,
    username: 'john_doe',
    email: 'john@example.com',
    full_name: 'John Doe',
    phone: '0912345678',
    role: 'customer',
    is_active: true,
    created_at: '2024-04-04',
    updated_at: '2024-04-06',
    last_login: '2024-04-25',
  },
  {
    user_id: 3,
    username: 'jane_smith',
    email: 'jane@example.com',
    full_name: 'Jane Smith',
    phone: '0923456789',
    role: 'customer',
    is_active: false,
    created_at: '2024-03-29',
    updated_at: '2024-04-02',
    last_login: null,
  }
];

const roleClass = (role) =>
  role === 'admin' ? 'bg-pink-100 text-pink-700' :
  role === 'shipper' ? 'bg-yellow-100 text-yellow-700' :
  'bg-blue-100 text-blue-700';

const AdminUser = () => (
  <section>
    <div className="mb-6 flex items-center justify-between">
      <h1 className="text-2xl font-bold text-gray-800">Quản lý người dùng</h1>
      <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 text-white px-6 py-2 rounded-lg font-semibold shadow transition">+ Thêm user</button>
    </div>
    <div className="overflow-x-auto rounded-xl bg-white shadow pb-2">
      <table className="min-w-[1000px] w-full text-left">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 font-semibold text-gray-600">ID</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Tên đăng nhập</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Email</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Tên đầy đủ</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Số điện thoại</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Vai trò</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Kích hoạt</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Ngày tạo</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Ngày sửa</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Lần đăng nhập cuối</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Hành động</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {users.map((user) => (
            <tr key={user.user_id} className="hover:bg-blue-50 transition">
              <td className="px-4 py-3 font-medium text-gray-800">{user.user_id}</td>
              <td className="px-4 py-3">{user.username}</td>
              <td className="px-4 py-3">{user.email}</td>
              <td className="px-4 py-3">{user.full_name}</td>
              <td className="px-4 py-3">{user.phone}</td>
              <td className="px-4 py-3"><span className={`px-3 py-0.5 rounded-full text-xs font-semibold ${roleClass(user.role)}`}>{translateUserRole(user.role)}</span></td>
              <td className="px-4 py-3 text-center">
                {user.is_active ? <span className="text-green-600 font-bold">●</span> : <span className="text-gray-400 font-bold">●</span>}
              </td>
              <td className="px-4 py-3">{user.created_at}</td>
              <td className="px-4 py-3">{user.updated_at}</td>
              <td className="px-4 py-3">{user.last_login || '-'}</td>
              <td className="px-4 py-3 flex gap-2">
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

export default AdminUser;
