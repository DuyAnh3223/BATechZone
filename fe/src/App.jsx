import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import UserLayout from './layouts/UserLayout';
import AdminLayout from './layouts/AdminLayout';
import Home from './pages/user/Home';
import Blog from './pages/user/Blog';
import BuildPC from './pages/user/BuildPC';
import Cart from './pages/user/Cart';
import Checkout from './pages/user/Checkout';
import ProductDetail from './pages/user/ProductDetail';
import ProductList from './pages/user/ProductList';
import Profile from './pages/user/Profile';
import ReturnPolicy from './pages/user/ReturnPolicy';
import ShipTracking from './pages/user/ShipTracking';
import WarrantyCheck from './pages/user/WarrantyCheck';
import WarrantyPolicy from './pages/user/WarrantyPolicy';
import Wishlist from './pages/user/Wishlist';
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProduct from './pages/admin/AdminProduct';
import AdminProductDetail from './pages/admin/AdminProductDetail';
import AdminUser from './pages/admin/AdminUser';
import AdminUserDetail from './pages/admin/AdminUserDetail';
import AdminCoupon from './pages/admin/AdminCoupon';
import AdminAddress from './pages/admin/AdminAddress';
import AdminOrder from './pages/admin/AdminOrder';
import AdminNotification from './pages/admin/AdminNotification';
import AdminBuild from './pages/admin/AdminBuild';
import AdminCategory from './pages/admin/AdminCategory';
import AdminPost from './pages/admin/AdminPost';
import AdminPostDetail from './pages/admin/AdminPostDetail';
import AdminWishlist from './pages/admin/AdminWishlist';
import AdminPayment from './pages/admin/AdminPayment';
import AdminRecentView from './pages/admin/AdminRecentView';
import AdminModeration from './pages/admin/AdminModeration';
import AdminServiceCenter from './pages/admin/AdminServiceCenter';

function App() {
  return (
    <>
      <Toaster />
    <BrowserRouter>
      <Routes>
          {/* User Routes */}
          <Route path="/" element={<UserLayout />}>
            <Route index element={<Home />} />
            <Route path="build-pc" element={<BuildPC />} />
            <Route path="blog" element={<Blog />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="product/:productId" element={<ProductDetail />} />
            <Route path="category/:categoryId" element={<ProductList />} />
            <Route path="profile" element={<Profile />} />
            <Route path="return-policy" element={<ReturnPolicy />} />
            <Route path="shipping-track" element={<ShipTracking />} />
            <Route path="warranty-check" element={<WarrantyCheck />} />
            <Route path="warranty-policy" element={<WarrantyPolicy />} />
            <Route path="wishlist" element={<Wishlist />} />
          </Route>
          <Route path="/auth/signin" element={<SignIn />} />
          <Route path="/auth/signup" element={<SignUp />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/*" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/login" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<AdminProduct />} />
            <Route path="products/:productId" element={<AdminProductDetail />} />
            <Route path="users" element={<AdminUser />} />
            <Route path="users/:userId" element={<AdminUserDetail />} />
            <Route path="coupons" element={<AdminCoupon />} />
            <Route path="orders" element={<AdminOrder />} />
            <Route path="notifications" element={<AdminNotification />} />
            <Route path="builds" element={<AdminBuild />} />
            <Route path="categories" element={<AdminCategory />} />
            <Route path="posts" element={<AdminPost />} />
            <Route path="posts/:postId" element={<AdminPostDetail />} />
            <Route path="payments" element={<AdminPayment />} />
            <Route path="recent-views" element={<AdminRecentView />} />
            <Route path="moderation" element={<AdminModeration />} />
            <Route path="service-center" element={<AdminServiceCenter />} />
          </Route>
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
