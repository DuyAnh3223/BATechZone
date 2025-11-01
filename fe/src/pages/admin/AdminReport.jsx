import React from 'react';

const reports = [
  {
    report_id: 1,
    user_id: 2,
    variant_id: 1002,
    report_type: 'fake_product',
    description: 'Nghi ngờ sản phẩm không chính hãng.',
    status: 'reviewing',
    admin_notes: 'Đang xác minh với nhà cung cấp',
    created_at: '2024-04-22 09:10',
    resolved_at: null,
  },
  {
    report_id: 2,
    user_id: 3,
    variant_id: 2005,
    report_type: 'inappropriate_content',
    description: 'Mô tả có ngôn ngữ không phù hợp.',
    status: 'resolved',
    admin_notes: 'Đã chỉnh sửa nội dung mô tả',
    created_at: '2024-04-25 14:35',
    resolved_at: '2024-04-26 10:05',
  },
];

const statusClass = (s) => (
  s === 'pending' ? 'bg-gray-100 text-gray-600' :
  s === 'reviewing' ? 'bg-yellow-100 text-yellow-700' :
  s === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-pink-100 text-pink-700'
);

const typeBadge = (t) => (
  t === 'fake_product' ? 'bg-red-100 text-red-700' :
  t === 'inappropriate_content' ? 'bg-purple-100 text-purple-700' :
  t === 'misleading_info' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
);

const AdminReport = () => (
  <section>
    <div className="mb-6 flex items-center justify-between">
      <h1 className="text-2xl font-bold text-gray-800">Quản lý báo cáo vi phạm (Reports)</h1>
      <div className="flex gap-2">
        <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 text-white px-4 py-2 rounded-lg font-semibold shadow transition">Làm mới</button>
      </div>
    </div>
    <div className="overflow-x-auto rounded-xl bg-white shadow pb-2">
      <table className="min-w-[1200px] w-full text-left">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 font-semibold text-gray-600">ID</th>
            <th className="px-4 py-3 font-semibold text-gray-600">User ID</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Variant ID</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Loại báo cáo</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Mô tả</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Trạng thái</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Ghi chú admin</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Tạo lúc</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Giải quyết lúc</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Hành động</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {reports.map((r) => (
            <tr key={r.report_id} className="hover:bg-blue-50 transition">
              <td className="px-4 py-3 font-medium text-gray-800">{r.report_id}</td>
              <td className="px-4 py-3">{r.user_id}</td>
              <td className="px-4 py-3">{r.variant_id}</td>
              <td className="px-4 py-3"><span className={`px-3 py-0.5 rounded-full text-xs font-semibold ${typeBadge(r.report_type)}`}>{r.report_type}</span></td>
              <td className="px-4 py-3 max-w-[260px] truncate" title={r.description}>{r.description}</td>
              <td className="px-4 py-3"><span className={`px-3 py-0.5 rounded-full text-xs font-semibold ${statusClass(r.status)}`}>{r.status}</span></td>
              <td className="px-4 py-3 max-w-[220px] truncate" title={r.admin_notes || ''}>{r.admin_notes || '-'}</td>
              <td className="px-4 py-3">{r.created_at}</td>
              <td className="px-4 py-3">{r.resolved_at || '-'}</td>
              <td className="px-4 py-3 flex gap-2 whitespace-nowrap">
                {r.status !== 'resolved' && r.status !== 'rejected' && (
                  <button className="px-3 py-1 bg-green-100 hover:bg-green-200 text-green-700 rounded text-xs font-medium">Đánh dấu resolved</button>
                )}
                {r.status !== 'rejected' && (
                  <button className="px-3 py-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded text-xs font-medium">Đang xem xét</button>
                )}
                <button className="px-3 py-1 bg-pink-100 hover:bg-pink-200 text-pink-600 rounded text-xs font-medium">Từ chối</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);

export default AdminReport;
