import React from 'react';

const reviews = [
  {
    review_id: 1,
    user_id: 2,
    variant_id: 7,
    order_id: 15,
    rating: 5,
    title: 'Sản phẩm tuyệt vời',
    comment: 'Chạy rất mát và hiệu năng mạnh, shop tư vấn nhiệt tình.',
    is_verified_purchase: true,
    is_approved: true,
    helpful_count: 3,
    created_at: '2024-04-18',
    updated_at: '2024-04-18',
  },
  {
    review_id: 2,
    user_id: 3,
    variant_id: 11,
    order_id: 22,
    rating: 4,
    title: 'Ổn trong tầm giá',
    comment: 'Giao hàng nhanh nhưng đóng gói hơi sơ sài.',
    is_verified_purchase: true,
    is_approved: false,
    helpful_count: 1,
    created_at: '2024-04-20',
    updated_at: '2024-04-20',
  }
];

const AdminReview = () => (
  <section>
    <div className="mb-6 flex items-center justify-between">
      <h1 className="text-2xl font-bold text-gray-800">Quản lý đánh giá sản phẩm (Review)</h1>
    </div>
    <div className="overflow-x-auto rounded-xl bg-white shadow pb-2">
      <table className="min-w-[1300px] w-full text-left">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 font-semibold text-gray-600">ID</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Người dùng</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Phiên bản</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Đơn hàng</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Đánh giá</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Tiêu đề</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Nội dung</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Check mua</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Duyệt</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Hữu ích</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Ngày tạo</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Ngày sửa</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Hành động</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {reviews.map((r) => (
            <tr key={r.review_id} className="hover:bg-blue-50 transition">
              <td className="px-4 py-3 font-medium text-gray-800">{r.review_id}</td>
              <td className="px-4 py-3">{r.user_id}</td>
              <td className="px-4 py-3">{r.variant_id}</td>
              <td className="px-4 py-3">{r.order_id || '-'}</td>
              <td className="px-4 py-3">{'★'.repeat(r.rating)}<span className="text-gray-500">{'★'.repeat(5-r.rating)}</span></td>
              <td className="px-4 py-3">{r.title}</td>
              <td className="px-4 py-3 max-w-[230px] truncate" title={r.comment}>{r.comment}</td>
              <td className="px-4 py-3 text-center">{r.is_verified_purchase ? <span className="text-green-600 font-bold">✔</span> : <span className="text-gray-400 font-bold">×</span>}</td>
              <td className="px-4 py-3 text-center">{r.is_approved ? <span className="text-green-600 font-bold">Đã duyệt</span> : <span className="text-yellow-600 font-bold">Chưa duyệt</span>}</td>
              <td className="px-4 py-3 text-center">{r.helpful_count}</td>
              <td className="px-4 py-3">{r.created_at}</td>
              <td className="px-4 py-3">{r.updated_at}</td>
              <td className="px-4 py-3 flex gap-2 whitespace-nowrap">
                <button className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-xs font-medium">Ẩn</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);

export default AdminReview;
