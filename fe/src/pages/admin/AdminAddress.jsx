import React from 'react';
import { translateAddressType } from '../../utils/statusTranslations';

const addresses = [
  {
    address_id: 1,
    user_id: 2,
    recipient_name: 'John Doe',
    phone: '0912345678',
    address_line1: '123 Nguyễn Văn Linh',
    address_line2: null,
    city: 'TP. Hồ Chí Minh',
    district: 'Quận 7',
    ward: 'Phường Tân Phú',
    postal_code: '700000',
    country: 'Vietnam',
    is_default: true,
    address_type: 'home',
    created_at: '2024-04-01',
    updated_at: '2024-04-10',
  },
    {
    address_id: 2,
    user_id: 3,
    recipient_name: 'Jane Smith',
    phone: '0923456789',
    address_line1: '456 Lê Văn Việt, P. Tăng Nhơn Phú A',
    address_line2: 'Lầu 2, Tòa nhà B',
    city: 'TP. Hồ Chí Minh',
    district: 'Quận 9',
    ward: 'Phường Tăng Nhơn Phú A',
    postal_code: '700000',
    country: 'Vietnam',
    is_default: false,
    address_type: 'office',
    created_at: '2024-03-15',
    updated_at: '2024-04-05',
  }
];

const AdminAddress = () => (
  <section>
    <div className="mb-6 flex items-center justify-between">
      <h1 className="text-2xl font-bold text-gray-800">Quản lý địa chỉ</h1>
      <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 text-white px-6 py-2 rounded-lg font-semibold shadow transition">+ Thêm địa chỉ</button>
    </div>
    <div className="overflow-x-auto rounded-xl bg-white shadow pb-2">
      <table className="min-w-[1400px] w-full text-left">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 font-semibold text-gray-600">ID</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Người dùng</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Tên người nhận</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Số điện thoại</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Địa chỉ</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Tỉnh/Thành</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Quận/Huyện</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Phường/Xã</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Mặc định</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Loại</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Ngày tạo</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Hành động</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {addresses.map((addr) => (
            <tr key={addr.address_id} className="hover:bg-blue-50 transition">
              <td className="px-4 py-3 font-medium text-gray-800">{addr.address_id}</td>
              <td className="px-4 py-3">{addr.user_id}</td>
              <td className="px-4 py-3">{addr.recipient_name}</td>
              <td className="px-4 py-3">{addr.phone}</td>
              <td className="px-4 py-3 max-w-[250px] truncate" title={`${addr.address_line1}${addr.address_line2 ? `, ${addr.address_line2}` : ''}`}>{`${addr.address_line1}${addr.address_line2 ? `, ${addr.address_line2}` : ''}`}</td>
              <td className="px-4 py-3">{addr.city}</td>
              <td className="px-4 py-3">{addr.district}</td>
              <td className="px-4 py-3">{addr.ward}</td>
              <td className="px-4 py-3 text-center">{addr.is_default ? <span className="text-green-600 font-bold">✔</span> : <span className="text-gray-400 font-bold">×</span>}</td>
              <td className="px-4 py-3">{translateAddressType(addr.address_type)}</td>
              <td className="px-4 py-3">{addr.created_at}</td>
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

export default AdminAddress;
