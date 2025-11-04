import React, { useState } from 'react';
import { translateReportStatus, translateReportType } from '../../utils/statusTranslations';

const reviews = [ { review_id: 2, user_id: 3, variant_id: 11, rating: 4, title: 'Ổn trong tầm giá', comment: 'Giao nhanh', is_verified_purchase: true, is_approved: false, created_at: '2024-04-20' } ];
const reports = [ { report_id: 2, user_id: 3, variant_id: 2005, report_type: 'inappropriate_content', description: 'Mô tả không phù hợp', status: 'reviewing', created_at: '2024-04-25' } ];

const Tab = ({active, onClick, children}) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${active ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700 hover:bg-indigo-100 hover:text-indigo-700'}`}
  >
    {children}
  </button>
);

const AdminModeration = () => {
  const [tab, setTab] = useState('reviews');
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Moderation</h1>
      </div>
      <div className="flex gap-2 mb-6">
        <Tab active={tab==='reviews'} onClick={()=>setTab('reviews')}>Reviews</Tab>
        <Tab active={tab==='reports'} onClick={()=>setTab('reports')}>Reports</Tab>
      </div>

      {tab==='reviews' && (
        <div className="bg-white rounded-xl shadow p-5 overflow-x-auto">
          <table className="min-w-[900px] w-full text-left">
            <thead className="bg-gray-50"><tr><th className="px-4 py-2">ID</th><th className="px-4 py-2">Người dùng</th><th className="px-4 py-2">Phiên bản</th><th className="px-4 py-2">Đánh giá</th><th className="px-4 py-2">Tiêu đề</th><th className="px-4 py-2">Ngày tạo</th><th className="px-4 py-2">Hành động</th></tr></thead>
            <tbody className="divide-y">
              {reviews.map(r => (
                <tr key={r.review_id}><td className="px-4 py-2">{r.review_id}</td><td className="px-4 py-2">{r.user_id}</td><td className="px-4 py-2">{r.variant_id}</td><td className="px-4 py-2">{r.rating}</td><td className="px-4 py-2 max-w-[260px] truncate" title={r.title}>{r.title}</td><td className="px-4 py-2">{r.created_at}</td><td className="px-4 py-2 whitespace-nowrap"><button className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-xs font-medium">Ẩn</button></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab==='reports' && (
        <div className="bg-white rounded-xl shadow p-5 overflow-x-auto">
          <table className="min-w-[900px] w-full text-left">
            <thead className="bg-gray-50"><tr><th className="px-4 py-2">ID</th><th className="px-4 py-2">Người dùng</th><th className="px-4 py-2">Phiên bản</th><th className="px-4 py-2">Loại</th><th className="px-4 py-2">Mô tả</th><th className="px-4 py-2">Trạng thái</th><th className="px-4 py-2">Hành động</th></tr></thead>
            <tbody className="divide-y">
              {reports.map(r => (
                <tr key={r.report_id}><td className="px-4 py-2">{r.report_id}</td><td className="px-4 py-2">{r.user_id}</td><td className="px-4 py-2">{r.variant_id}</td><td className="px-4 py-2">{translateReportType(r.report_type)}</td><td className="px-4 py-2 max-w-[260px] truncate" title={r.description}>{r.description}</td><td className="px-4 py-2">{translateReportStatus(r.status)}</td><td className="px-4 py-2 whitespace-nowrap"><button className="px-3 py-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded text-xs font-medium">Đang xem xét</button> <button className="px-3 py-1 bg-green-100 hover:bg-green-200 text-green-700 rounded text-xs font-medium">Đã xử lý</button></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default AdminModeration;
