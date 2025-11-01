import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { translateUserRole, translateOrderStatus } from '../../utils/statusTranslations';

const mockUser = { user_id: 2, username: 'john_doe', email: 'john@example.com', full_name: 'John Doe', role: 'customer', phone: '0912345678', created_at: '2024-04-01' };
const addresses = [ { address_id: 1, user_id: 2, recipient_name: 'John Doe', phone: '0912345678', address: '123 Nguyễn Văn Linh, Q7, HCM', is_default: true }, ];
const orders = [ { order_id: 1, order_number: 'ORD-2024-001', total_amount: 19170000, status: 'delivered', created_at: '2024-04-15' } ];
const wishlists = [ { wishlist_id: 1, user_id: 2, wishlist_name: 'My Wishlist', is_default: true, is_public: false, created_at: '2024-04-23' } ];

const Tab = ({active, onClick, children}) => (
  <button onClick={onClick} className={`px-4 py-2 rounded-lg text-sm font-medium ${active ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>{children}</button>
);

const AdminUserDetail = () => {
  const { userId } = useParams();
  const [tab, setTab] = useState('overview');

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Chi tiết người dùng #{userId}</h1>
          <div className="text-gray-500 text-sm">Tổng quan • Địa chỉ • Đơn hàng • Wishlists</div>
        </div>
        <Link to="/admin/users" className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm">← Quay lại danh sách</Link>
      </div>

      <div className="flex gap-2 mb-6">
        <Tab active={tab==='overview'} onClick={()=>setTab('overview')}>Tổng quan</Tab>
        <Tab active={tab==='addresses'} onClick={()=>setTab('addresses')}>Địa chỉ</Tab>
        <Tab active={tab==='orders'} onClick={()=>setTab('orders')}>Đơn hàng</Tab>
        <Tab active={tab==='wishlists'} onClick={()=>setTab('wishlists')}>Wishlists</Tab>
      </div>

      {tab==='overview' && (
        <div className="bg-white rounded-xl shadow p-5 grid md:grid-cols-2 gap-4">
          <div><div className="text-gray-500 text-sm">Tên đăng nhập</div><div className="font-semibold">{mockUser.username}</div></div>
          <div><div className="text-gray-500 text-sm">Email</div><div className="font-semibold">{mockUser.email}</div></div>
          <div><div className="text-gray-500 text-sm">Họ tên</div><div className="font-semibold">{mockUser.full_name}</div></div>
          <div><div className="text-gray-500 text-sm">SĐT</div><div className="font-semibold">{mockUser.phone}</div></div>
          <div><div className="text-gray-500 text-sm">Vai trò</div><div className="font-semibold">{translateUserRole(mockUser.role)}</div></div>
          <div><div className="text-gray-500 text-sm">Ngày tạo</div><div className="font-semibold">{mockUser.created_at}</div></div>
        </div>
      )}

      {tab==='addresses' && (
        <div className="bg-white rounded-xl shadow p-5 overflow-x-auto">
          <table className="min-w-[700px] w-full text-left">
            <thead className="bg-gray-50"><tr><th className="px-4 py-2">ID</th><th className="px-4 py-2">Người nhận</th><th className="px-4 py-2">SĐT</th><th className="px-4 py-2">Địa chỉ</th><th className="px-4 py-2">Mặc định</th></tr></thead>
            <tbody className="divide-y">
              {addresses.map(a => (
                <tr key={a.address_id}><td className="px-4 py-2">{a.address_id}</td><td className="px-4 py-2">{a.recipient_name}</td><td className="px-4 py-2">{a.phone}</td><td className="px-4 py-2">{a.address}</td><td className="px-4 py-2">{a.is_default ? '✔' : '—'}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab==='orders' && (
        <div className="bg-white rounded-xl shadow p-5 overflow-x-auto">
          <table className="min-w-[700px] w-full text-left">
            <thead className="bg-gray-50"><tr><th className="px-4 py-2">ID Đơn hàng</th><th className="px-4 py-2">Mã đơn</th><th className="px-4 py-2">Tổng</th><th className="px-4 py-2">Trạng thái</th><th className="px-4 py-2">Ngày tạo</th></tr></thead>
            <tbody className="divide-y">
              {orders.map(o => (<tr key={o.order_id}><td className="px-4 py-2">{o.order_id}</td><td className="px-4 py-2">{o.order_number}</td><td className="px-4 py-2">{o.total_amount.toLocaleString()} ₫</td><td className="px-4 py-2">{translateOrderStatus(o.status)}</td><td className="px-4 py-2">{o.created_at}</td></tr>))}
            </tbody>
          </table>
        </div>
      )}

      {tab==='wishlists' && (
        <div className="bg-white rounded-xl shadow p-5 overflow-x-auto">
          <table className="min-w-[650px] w-full text-left">
            <thead className="bg-gray-50"><tr><th className="px-4 py-2">ID Wishlist</th><th className="px-4 py-2">Tên</th><th className="px-4 py-2">Mặc định</th><th className="px-4 py-2">Công khai</th><th className="px-4 py-2">Ngày tạo</th></tr></thead>
            <tbody className="divide-y">
              {wishlists.map(w => (<tr key={w.wishlist_id}><td className="px-4 py-2">{w.wishlist_id}</td><td className="px-4 py-2">{w.wishlist_name}</td><td className="px-4 py-2">{w.is_default ? '✔' : '—'}</td><td className="px-4 py-2">{w.is_public ? '✔' : '—'}</td><td className="px-4 py-2">{w.created_at}</td></tr>))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default AdminUserDetail;
