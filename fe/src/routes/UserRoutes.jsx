import { Route } from 'react-router-dom';
import UserLayout from '../layouts/UserLayout';
import Blog from '../pages/user/Blog';
import BuildPC from '../pages/user/BuildPC';
import Cart from '../pages/user/Cart';
import Checkout from '../pages/user/Checkout';
import Home from '../pages/user/Home';
import ProductDetail from '../pages/user/ProductDetail';
import ProductList from '../pages/user/ProductList';
import Profile from '../pages/user/Profile';
import ReturnPolicy from '../pages/user/ReturnPolicy';
import ShipTracking from '../pages/user/ShipTracking';
import WarrantyCheck from '../pages/user/WarrantyCheck';
import WarrantyPolicy from '../pages/user/WarrantyPolicy';
import Wishlist from '../pages/user/Wishlist';
import SignIn from '../pages/auth/SignIn';
import SignUp from '../pages/auth/SignUp';

const UserRoutes = () => {
  return (
    <>
      <Route path="/" element={<UserLayout />}>
        <Route index element={<Home />} />
        <Route path="build-pc" element={<BuildPC />} />
        <Route path="blog" element={<Blog />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="product/:productId" element={<ProductDetail />} />
        <Route path="category/:categoryId" element={<ProductList />} />
        <Route path="products" element={<ProductList />} />
        <Route path="profile" element={<Profile />} />
        <Route path="return-policy" element={<ReturnPolicy />} />
        <Route path="shipping-track" element={<ShipTracking />} />
        <Route path="warranty-check" element={<WarrantyCheck />} />
        <Route path="warranty-policy" element={<WarrantyPolicy />} />
        <Route path="wishlist" element={<Wishlist />} />
      </Route>
      <Route path="/auth/signin" element={<SignIn />} />
      <Route path="/auth/signup" element={<SignUp />} />
    </>
  );
}
export default UserRoutes;
