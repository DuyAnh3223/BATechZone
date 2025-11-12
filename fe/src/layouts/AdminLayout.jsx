import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import { User2, Home, Box, ShoppingCart, ListOrdered, Percent, Bell, Search, Users, Star, MapPin, Wrench, Tags, Book, Heart, CreditCard, TriangleAlert, LifeBuoy, Eye, Palette } from "lucide-react";
import adminAvatar from "../assets/react.svg"; // dùng tạm hình có sẵn

const menu = [
  { icon: <Home size={18} />, label: "Bảng điều khiển", to: "/admin/dashboard" },
  { icon: <Users size={18} />, label: "Người dùng", to: "/admin/users" },
  { icon: <Box size={18} />, label: "Sản phẩm", to: "/admin/products" },
  { icon: <Palette size={18} />, label: "Thuộc tính", to: "/admin/attributes", indent: true },
  { icon: <TriangleAlert size={18} />, label: "Kiểm duyệt", to: "/admin/moderation", indent: true },
  { icon: <Tags size={18} />, label: "Danh mục", to: "/admin/categories" },
  { icon: <ListOrdered size={18} />, label: "Đơn hàng", to: "/admin/orders" },
  { icon: <CreditCard size={18} />, label: "Thanh toán", to: "/admin/payments" },
  { icon: <Percent size={18} />, label: "Mã giảm giá", to: "/admin/coupons" },
  { icon: <Bell size={18} />, label: "Thông báo", to: "/admin/notifications" },
  { icon: <Book size={18} />, label: "Bài viết", to: "/admin/posts" },
  { icon: <Wrench size={18} />, label: "Cấu hình PC", to: "/admin/builds" },
  { icon: <LifeBuoy size={18} />, label: "Trung tâm dịch vụ", to: "/admin/service-center" },
];

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-blue-100">
      {/* Sidebar */}
      <aside className="w-60 bg-white shadow-lg flex flex-col py-6 px-3">
        <div className="font-extrabold text-xl mb-10 pl-2 text-blue-700">BATechZone</div>
        <nav className="flex-1 flex flex-col gap-1">
          {menu.map((item, idx) => (
            <NavLink
              end
              key={idx}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 ${item.indent ? 'pl-8' : 'px-4'} py-2 rounded-lg font-medium text-sm transition ${isActive ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"}`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      {/* Main section */}
      <section className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="h-16 flex items-center px-8 justify-between bg-white shadow gap-8">
          <div className="flex items-center gap-3 flex-1">
            <button className="block md:hidden p-2"><span className="sr-only">Menu</span></button>
            <div className="relative w-80 max-w-full">
              <input type="text" placeholder="Tìm kiếm..." className="w-full border rounded-lg pl-10 pr-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-300" />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative text-gray-500 hover:text-blue-700 p-2">
              <Bell size={22} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 border-l pl-4">
              <img src={adminAvatar} alt="Avatar" className="w-9 h-9 rounded-full border border-blue-200 bg-white shadow" />
              <div className="text-right">
                <div className="font-semibold text-gray-700">Admin</div>
                <div className="text-xs text-gray-400">Quản trị viên</div>
              </div>
            </div>
          </div>
        </header>
        {/* Nội dung động dashboard... */}
        <main className="flex-1 overflow-y-auto p-8"> 
          <Outlet />
        </main>
      </section>
    </div>
  );
};

export default AdminLayout;
