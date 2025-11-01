import React from 'react';
import { translateServiceRequestStatus, translateServiceRequestType, translatePriority } from '../../utils/statusTranslations';

const requests = [
  {
    service_request_id: 10,
    user_id: 2,
    request_type: 'warranty',
    status: 'processing',
    subject: 'Kiểm tra bảo hành RAM',
    description: 'RAM có dấu hiệu không ổn định, cần kiểm tra',
    priority: 'high',
    assigned_to: 1,
    created_at: '2024-04-28 09:10',
    resolved_at: null,
  },
  {
    service_request_id: 11,
    user_id: 3,
    request_type: 'consultation',
    status: 'completed',
    subject: 'Tư vấn build PC 30 triệu',
    description: 'Cần tư vấn build PC để làm đồ họa và gaming nhẹ',
    priority: 'medium',
    assigned_to: null,
    created_at: '2024-04-21 12:00',
    resolved_at: '2024-04-22 15:30',
  }
];

const statusClass = (s) => (
  s === 'processing' ? 'bg-yellow-100 text-yellow-700' :
  s === 'completed' ? 'bg-green-100 text-green-700' :
  s === 'rejected' ? 'bg-pink-100 text-pink-700' : 'bg-gray-100 text-gray-600'
);

const AdminServiceRequest = () => (
  <section>
    <div className="mb-6 flex items-center justify-between">
      <h1 className="text-2xl font-bold text-gray-800">Quản lý yêu cầu dịch vụ (Service Requests)</h1>
      <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 text-white px-6 py-2 rounded-lg font-semibold shadow transition">+ Tạo yêu cầu</button>
    </div>
    <div className="overflow-x-auto rounded-xl bg-white shadow pb-2">
      <table className="min-w-[1200px] w-full text-left">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 font-semibold text-gray-600">ID</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Người dùng</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Loại</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Tiêu đề</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Trạng thái</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Mức ưu tiên</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Giao cho</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Tạo lúc</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Giải quyết lúc</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Hành động</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {requests.map(r => (
            <tr key={r.service_request_id} className="hover:bg-blue-50 transition">
              <td className="px-4 py-3 font-medium text-gray-800">{r.service_request_id}</td>
              <td className="px-4 py-3">{r.user_id}</td>
              <td className="px-4 py-3">{translateServiceRequestType(r.request_type)}</td>
              <td className="px-4 py-3 max-w-[260px] truncate" title={r.subject}>{r.subject}</td>
              <td className="px-4 py-3"><span className={`px-3 py-0.5 rounded-full text-xs font-semibold ${statusClass(r.status)}`}>{translateServiceRequestStatus(r.status)}</span></td>
              <td className="px-4 py-3">{translatePriority(r.priority)}</td>
              <td className="px-4 py-3">{r.assigned_to || '-'}</td>
              <td className="px-4 py-3">{r.created_at}</td>
              <td className="px-4 py-3">{r.resolved_at || '-'}</td>
              <td className="px-4 py-3 flex gap-2 whitespace-nowrap">
                <button className="px-3 py-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-600 rounded text-xs font-medium">Xem</button>
                <button className="px-3 py-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded text-xs font-medium">Giao việc</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);

export default AdminServiceRequest;
