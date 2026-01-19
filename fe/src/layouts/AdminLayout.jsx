import React, { useEffect } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { User2, Home, Box, ShoppingCart, ListOrdered, Percent, Bell, Search, Users, Star, MapPin, Wrench, Tags, Book, Heart, CreditCard, LifeBuoy, Eye, LogOut, Shield } from "lucide-react";
import { useAdminAuthStore } from "@/stores/useAdminAuthStore";
import adminAvatar from "../assets/react.svg"; // dùng tạm hình có sẵn

const menu = [
  { icon: <Home size={18} />, label: "Bảng điều khiển", to: "/admin/dashboard" },
  { icon: <Users size={18} />, label: "Người dùng", to: "/admin/users" },
  { icon: <Tags size={18} />, label: "Danh mục", to: "/admin/categories" },
  { icon: <Box size={18} />, label: "Sản phẩm", to: "/admin/products" },
  { icon: <Box size={18} />, label: "Bộ máy vi tính", to: "/admin/bundles" },
  { icon: <ListOrdered size={18} />, label: "Đơn hàng", to: "/admin/orders" },
  { icon: <CreditCard size={18} />, label: "Trả góp", to: "/admin/installments" },
  { icon: <Shield size={18} />, label: "Bảo hành", to: "/admin/warranty" },
  { icon: <Percent size={18} />, label: "Mã giảm giá", to: "/admin/coupons" },
  
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const { user, loading, checkAuth, signOut } = useAdminAuthStore();

  useEffect(() => {
    // Check auth when component mounts
    // If user just logged in, they will have token but checkAuth verifies it's valid
    const token = localStorage.getItem('admin_access_token');
    if (token && !user) {
      // Have token but no user data - verify token
      checkAuth();
    }
    // No token and no user - skip checkAuth, let redirect useEffect handle it
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Chỉ chạy 1 lần khi mount

  useEffect(() => {
    // Redirect to login if not authenticated (after loading completes)
    const token = localStorage.getItem('admin_access_token');
    if (!loading && !user && !token) {
      navigate('/admin/login');
    }
  }, [loading, user, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

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
                <div className="font-semibold text-gray-700">{user?.username || 'Admin'}</div>
                <div className="text-xs text-gray-400">Quản trị viên</div>
              </div>
              <button 
                onClick={handleSignOut}
                className="ml-2 p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                title="Đăng xuất"
              >
                <LogOut size={18} />
              </button>
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
