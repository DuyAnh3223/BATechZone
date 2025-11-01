import { Route } from 'react-router-dom';
import AdminLogin from '../pages/admin/AdminLogin';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminLayout from '../layouts/AdminLayout';
import AdminProduct from '../pages/admin/AdminProduct';
import AdminProductDetail from '../pages/admin/AdminProductDetail';
import AdminUser from '../pages/admin/AdminUser';
import AdminUserDetail from '../pages/admin/AdminUserDetail';
import AdminCoupon from '../pages/admin/AdminCoupon';
import AdminAddress from '../pages/admin/AdminAddress';
import AdminOrder from '../pages/admin/AdminOrder';
import AdminNotification from '../pages/admin/AdminNotification';
import AdminBuild from '../pages/admin/AdminBuild';
import AdminCategory from '../pages/admin/AdminCategory';
import AdminPost from '../pages/admin/AdminPost';
import AdminPostDetail from '../pages/admin/AdminPostDetail';
import AdminWishlist from '../pages/admin/AdminWishlist';
import AdminPayment from '../pages/admin/AdminPayment';
import AdminRecentView from '../pages/admin/AdminRecentView';
import AdminModeration from '../pages/admin/AdminModeration';
import AdminServiceCenter from '../pages/admin/AdminServiceCenter';

const AdminRoutes = () => (
  <>
    <Route path="/admin/login" element={<AdminLogin />} />
    <Route path="/admin/*" element={<AdminLayout />}>
      <Route index element={<AdminDashboard />} />
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="products" element={<AdminProduct />} />
      <Route path="products/:productId" element={<AdminProductDetail />} />
      <Route path="users" element={<AdminUser />} />
      <Route path="users/:userId" element={<AdminUserDetail />} />
      <Route path="coupons" element={<AdminCoupon />} />
      <Route path="addresses" element={<AdminAddress />} />
      <Route path="orders" element={<AdminOrder />} />
      <Route path="notifications" element={<AdminNotification />} />
      <Route path="builds" element={<AdminBuild />} />
      <Route path="categories" element={<AdminCategory />} />
      <Route path="posts" element={<AdminPost />} />
      <Route path="posts/:postId" element={<AdminPostDetail />} />
      <Route path="wishlists" element={<AdminWishlist />} />
      <Route path="payments" element={<AdminPayment />} />
      <Route path="recent-views" element={<AdminRecentView />} />
      <Route path="moderation" element={<AdminModeration />} />
      <Route path="service-center" element={<AdminServiceCenter />} />
      {/* Các màn admin khác có thể thêm ở đây */}
    </Route>
  </>
);

export default AdminRoutes;
