import React from 'react';
import { translateNotificationType } from '../../utils/statusTranslations';

const notifications = [
  {
    notification_id: 1,
    user_id: 2,
    notification_type: 'order',
    title: 'Đơn hàng đã được giao',
    content: 'Đơn hàng ORD-2024-001 đã được giao thành công',
    link_url: '/orders/ORD-2024-001',
    is_read: true,
    created_at: '2024-04-18',
    read_at: '2024-04-19',
  },
  {
    notification_id: 2,
    user_id: 3,
    notification_type: 'promotion',
    title: 'Khuyến mãi đặc biệt',
    content: 'Giảm giá 20% cho CPU Intel trong tuần này',
    link_url: '/promotions/cpu-intel-20',
    is_read: false,
    created_at: '2024-04-20',
    read_at: null,
  },
  {
    notification_id: 3,
    user_id: 1,
    notification_type: 'system',
    title: 'Hệ thống bảo trì',
    content: 'Hệ thống sẽ bảo trì vào 2AM ngày 30/04',
    link_url: null,
    is_read: true,
    created_at: '2024-04-25',
    read_at: '2024-04-25',
  }
];

const getTypeClass = (type) => {
  switch (type) {
    case 'order': return 'bg-blue-100 text-blue-700';
    case 'promotion': return 'bg-purple-100 text-purple-700';
    case 'system': return 'bg-gray-100 text-gray-600';
    case 'review': return 'bg-yellow-100 text-yellow-700';
    default: return 'bg-green-100 text-green-700';
  }
};

const AdminNotification = () => (
  <section>
    <div className="mb-6 flex items-center justify-between">
      <h1 className="text-2xl font-bold text-gray-800">Quản lý thông báo (Notifications)</h1>
      <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 text-white px-6 py-2 rounded-lg font-semibold shadow transition">+ Thêm thông báo</button>
    </div>
    <div className="overflow-x-auto rounded-xl bg-white shadow pb-2">
      <table className="min-w-[1200px] w-full text-left">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 font-semibold text-gray-600">ID</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Người dùng</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Loại</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Tiêu đề</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Nội dung</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Đã đọc</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Ngày tạo</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Ngày đọc</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Hành động</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {notifications.map((noti) => (
            <tr key={noti.notification_id} className="hover:bg-blue-50 transition">
              <td className="px-4 py-3 font-medium text-gray-800">{noti.notification_id}</td>
              <td className="px-4 py-3">{noti.user_id}</td>
              <td className="px-4 py-3"><span className={`px-3 py-0.5 rounded-full text-xs font-semibold ${getTypeClass(noti.notification_type)}`}>{translateNotificationType(noti.notification_type)}</span></td>
              <td className="px-4 py-3">{noti.title}</td>
              <td className="px-4 py-3 max-w-[250px] truncate" title={noti.content}>{noti.content}</td>
              <td className="px-4 py-3 text-center">{noti.is_read ? <span className="text-green-600 font-bold">✔</span> : <span className="text-gray-400 font-bold">×</span>}</td>
              <td className="px-4 py-3">{noti.created_at}</td>
              <td className="px-4 py-3">{noti.read_at || '-'}</td>
              <td className="px-4 py-3 flex gap-2 whitespace-nowrap">
                {!noti.is_read && <button className="px-3 py-1 bg-green-100 hover:bg-green-200 text-green-700 rounded text-xs font-medium">Đánh dấu đã đọc</button>}
                <button className="px-3 py-1 bg-pink-100 hover:bg-pink-200 text-pink-600 rounded text-xs font-medium">Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);

export default AdminNotification;
