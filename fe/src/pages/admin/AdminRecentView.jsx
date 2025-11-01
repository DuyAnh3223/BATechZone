import React from 'react';

const topViewedVariants = [
  { variant_id: 1, product_name: 'Intel Core i9-13900K', variant_name: 'Box', views: 320 },
  { variant_id: 3, product_name: 'NVIDIA RTX 4090', variant_name: '24GB', views: 180 },
  { variant_id: 7, product_name: 'Corsair Vengeance DDR5', variant_name: '16GB', views: 155 },
];

const topReportedVariants = [
  { variant_id: 1002, product_name: 'Sản phẩm X', report_count: 7 },
  { variant_id: 2005, product_name: 'Sản phẩm Y', report_count: 5 },
];

const topActiveUsers = [
  { user_id: 2, username: 'john_doe', recent_views: 24 },
  { user_id: 3, username: 'jane_smith', recent_views: 18 },
  { user_id: 1, username: 'admin', recent_views: 10 },
];

const Card = ({title, children}) => (
  <div className="bg-white rounded-xl shadow p-5">
    <div className="font-semibold mb-3">{title}</div>
    {children}
  </div>
);

const AdminRecentView = () => {
  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Recent Views</h1>
        <div className="flex items-center gap-2 text-sm">
          <input type="date" className="border rounded px-3 py-2" />
          <span>—</span>
          <input type="date" className="border rounded px-3 py-2" />
          <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded">Lọc</button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <Card title="Top variants theo lượt xem">
          <div className="overflow-x-auto">
            <table className="min-w-[600px] w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2">ID Phiên bản</th>
                  <th className="px-4 py-2">Sản phẩm</th>
                  <th className="px-4 py-2">Biến thể</th>
                  <th className="px-4 py-2 text-right">Lượt xem</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {topViewedVariants.map(v => (
                  <tr key={v.variant_id}>
                    <td className="px-4 py-2">{v.variant_id}</td>
                    <td className="px-4 py-2">{v.product_name}</td>
                    <td className="px-4 py-2">{v.variant_name}</td>
                    <td className="px-4 py-2 text-right">{v.views}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card title="Top variants bị report nhiều">
          <div className="overflow-x-auto">
            <table className="min-w-[500px] w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2">ID Phiên bản</th>
                  <th className="px-4 py-2">Sản phẩm</th>
                  <th className="px-4 py-2 text-right">Lượt report</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {topReportedVariants.map(v => (
                  <tr key={v.variant_id}>
                    <td className="px-4 py-2">{v.variant_id}</td>
                    <td className="px-4 py-2">{v.product_name}</td>
                    <td className="px-4 py-2 text-right">{v.report_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <div className="mt-5">
        <Card title="Top users hoạt động (theo recent views)">
          <div className="overflow-x-auto">
            <table className="min-w-[500px] w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2">Người dùng</th>
                  <th className="px-4 py-2">Tên đăng nhập</th>
                  <th className="px-4 py-2 text-right">Lượt xem gần đây</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {topActiveUsers.map(u => (
                  <tr key={u.user_id}>
                    <td className="px-4 py-2">{u.user_id}</td>
                    <td className="px-4 py-2">{u.username}</td>
                    <td className="px-4 py-2 text-right">{u.recent_views}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default AdminRecentView;
