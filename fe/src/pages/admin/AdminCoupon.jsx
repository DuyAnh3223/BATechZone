import React from 'react';

const coupons = [
  {
    coupon_id: 1,
    coupon_code: 'WELCOME2025',
    description: 'Giảm 10% cho khách mới',
    discount_type: 'percentage',
    discount_value: 10.00,
    max_discount_amount: null,
    min_order_amount: 1000000,
    usage_limit: 100,
    used_count: 30,
    is_active: true,
    valid_from: '2024-05-01',
    valid_until: '2024-07-01',
    created_at: '2024-04-30',
  },
  {
    coupon_id: 2,
    coupon_code: 'TECH500K',
    description: 'Giảm 500K cho đơn từ 10 triệu',
    discount_type: 'fixed_amount',
    discount_value: 500000.00,
    max_discount_amount: null,
    min_order_amount: 10000000,
    usage_limit: 50,
    used_count: 10,
    is_active: false,
    valid_from: '2024-05-15',
    valid_until: '2024-07-15',
    created_at: '2024-05-10',
  }
];

const AdminCoupon = () => (
  <section>
    <div className="mb-6 flex items-center justify-between">
      <h1 className="text-2xl font-bold text-gray-800">Quản lý mã giảm giá/Coupon</h1>
      <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 text-white px-6 py-2 rounded-lg font-semibold shadow transition">+ Thêm coupon</button>
    </div>
    <div className="overflow-x-auto rounded-xl bg-white shadow pb-2">
      <table className="min-w-[1250px] w-full text-left">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 font-semibold text-gray-600">ID</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Mã coupon</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Mô tả</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Loại</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Giá trị</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Giảm tối đa</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Đơn tối thiểu</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Giới hạn lượt</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Đã dùng</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Kích hoạt</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Hiệu lực từ</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Hiệu lực đến</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Ngày tạo</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Hành động</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {coupons.map((c) => (
            <tr key={c.coupon_id} className="hover:bg-blue-50 transition">
              <td className="px-4 py-3 font-medium text-gray-800">{c.coupon_id}</td>
              <td className="px-4 py-3 font-semibold text-blue-800 uppercase">{c.coupon_code}</td>
              <td className="px-4 py-3 max-w-[180px] truncate" title={c.description}>{c.description || '-'}</td>
              <td className="px-4 py-3">{c.discount_type === 'percentage' ? 'Phần trăm' : 'VNĐ'}</td>
              <td className="px-4 py-3">{c.discount_type === 'percentage' ? `${c.discount_value}%` : `${c.discount_value.toLocaleString()} ₫`}</td>
              <td className="px-4 py-3">{c.max_discount_amount ? `${c.max_discount_amount.toLocaleString()} ₫` : '-'}</td>
              <td className="px-4 py-3">{c.min_order_amount.toLocaleString()} ₫</td>
              <td className="px-4 py-3 text-center">{c.usage_limit || '-'}</td>
              <td className="px-4 py-3 text-center">{c.used_count}</td>
              <td className="px-4 py-3 text-center">{c.is_active ? <span className="text-green-600 font-bold">●</span> : <span className="text-gray-400 font-bold">●</span>}</td>
              <td className="px-4 py-3">{c.valid_from}</td>
              <td className="px-4 py-3">{c.valid_until || '-'}</td>
              <td className="px-4 py-3">{c.created_at}</td>
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

export default AdminCoupon;
