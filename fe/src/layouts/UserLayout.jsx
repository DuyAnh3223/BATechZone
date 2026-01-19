import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { ShoppingCart, Cpu, User, Menu, X, Search, LogIn, LogOut, ChevronRight, Bell, Tag, Copy, Check, Newspaper, CheckCircle, Shield } from "lucide-react";
import { useUserAuthStore } from '@/stores/useUserAuthStore';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useCategoryStore } from '@/stores/useCategoryStore';
import { useCartItemStore } from '@/stores/useCartItemStore';
import { useCartStore } from '@/stores/useCartStore';
import { useCouponStore } from '@/stores/useCouponStore';
import { couponService } from '@/services/couponService';
import CartDropdown from '@/components/common/CartDropdown';
import SearchBar from '@/components/search/SearchBar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const UserLayout = () => {
  const { user, loading: authLoading, checkAuth, signOut } = useUserAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [menuCloseTimeout, setMenuCloseTimeout] = useState(null);
  const { categories, fetchCategories, loading: categoriesLoading } = useCategoryStore();
  const { cartItems, fetchCartItems, reset: resetCartItems } = useCartItemStore();
  const { getOrCreateCart } = useCartStore();
  const { coupons, fetchCoupons, loading: couponsLoading } = useCouponStore();
  
  // Calculate total cart items count (sum of quantities)
  const cartItemsCount = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
  
  // Coupon dialog state
  const [isCouponDialogOpen, setIsCouponDialogOpen] = useState(false);
  const [copiedCouponCode, setCopiedCouponCode] = useState(null);
  const [successDialog, setSuccessDialog] = useState({ open: false, message: '' });
  
  // Side banners visibility state
  const [showSideBanners, setShowSideBanners] = useState(true);
  
  // Scroll position state for sticky banners
  const [scrollY, setScrollY] = useState(0);

  // Handle scroll for sticky banners
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check auth khi mount - Restore user session from token
  useEffect(() => {
    const token = localStorage.getItem('user_access_token');
    console.log('[UserLayout] Mount - token exists:', !!token, ', user exists:', !!user);
    // Only restore session if we have token but no user yet (after F5)
    // Don't call checkAuth if user already exists (just logged in)
    if (token && !user) {
      console.log('[UserLayout] Calling checkAuth to restore session...');
      checkAuth();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Chỉ chạy 1 lần khi mount

  // Load cart when user is authenticated (after login or session restore)
  useEffect(() => {
    const loadCart = async () => {
      if (user && user.user_id) {
        try {
          console.log('[UserLayout] Loading cart for user:', user.user_id);
          // Reset cart items first to clear old data
          resetCartItems();
          
          const cartResponse = await getOrCreateCart({ userId: user.user_id });
          if (cartResponse?.data?.cart_id || cartResponse?.cart_id) {
            const cartId = cartResponse.data?.cart_id || cartResponse.cart_id;
            await fetchCartItems(cartId);
            console.log('[UserLayout] Cart loaded successfully');
          }
        } catch (error) {
          console.error('[UserLayout] Failed to load cart:', error);
        }
      }
    };
    
    loadCart();
  }, [user, getOrCreateCart, fetchCartItems, resetCartItems]);

  // Load active coupons when dialog opens
  useEffect(() => {
    if (isCouponDialogOpen) {
      fetchCoupons({ is_active: 'true', pageSize: 50 });
    }
  }, [isCouponDialogOpen, fetchCoupons]);

  // Filter valid coupons (active, within valid period, not expired usage limit)
  const getValidCoupons = () => {
    if (!coupons || coupons.length === 0) return [];
    
    const now = new Date();
    return coupons.filter((coupon) => {
      // Kiểm tra is_active
      if (!coupon.is_active) return false;
      
      // Kiểm tra thời gian hiệu lực
      if (coupon.valid_from && new Date(coupon.valid_from) > now) return false;
      if (coupon.valid_until && new Date(coupon.valid_until) < now) return false;
      
      // Kiểm tra số lần sử dụng
      if (coupon.usage_limit && (coupon.used_count || 0) >= coupon.usage_limit) return false;
      
      return true;
    });
  };

  const validCoupons = getValidCoupons();

  // Function to copy coupon code
  const handleCopyCoupon = async (couponCode) => {
    try {
      await navigator.clipboard.writeText(couponCode);
      setCopiedCouponCode(couponCode);
      setSuccessDialog({ open: true, message: `Đã copy mã giảm giá: ${couponCode}` });
      setTimeout(() => setCopiedCouponCode(null), 2000);
    } catch (error) {
      toast.error('Không thể copy mã giảm giá');
    }
  };


  // Function to load categories (memoized with useCallback)
  const loadCategories = useCallback(async () => {
    try {
      await fetchCategories();
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  }, [fetchCategories]);

  // Fetch category tree on mount
  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // Refresh categories when window regains focus (user switches back to tab)
  useEffect(() => {
    const handleFocus = () => {
      // Refresh categories when user switches back to the tab
      loadCategories();
    };

    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [loadCategories]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (menuCloseTimeout) {
        clearTimeout(menuCloseTimeout);
      }
    };
  }, [menuCloseTimeout]);

  
  const handleLogout = async () => {
    try {
      // Reset cart items before logout
      resetCartItems();
      
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col w-full relative">
      {/* Left Side Banner - Sticky - Show on home page and Build PC page */}
      {showSideBanners && (location.pathname === '/' || location.pathname === '/build-pc') && (
        <div 
          className="hidden xl:block z-40"
          style={{
            position: scrollY > 600 ? 'fixed' : 'absolute',
            top: scrollY > 600 ? '160px' : '800px',
            left: '1rem',
            width: '160px',
            maxHeight: '600px',
            transition: 'all 0.3s ease-out'
          }}
        >
          <div className="relative">
            <a 
              href="#" 
              className="block"
              onClick={(e) => {
                e.preventDefault();
                // Add link to promotional page if needed
              }}
            >
              <img 
                src={`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/uploads/banner_header_top_left_right/banners_left.jpg`}
                alt="Left Banner"
                className="w-full h-auto object-cover rounded-lg shadow-lg"
              />
            </a>
          </div>
        </div>
      )}

      {/* Right Side Banner - Sticky - Show on home page and Build PC page */}
      {showSideBanners && (location.pathname === '/' || location.pathname === '/build-pc') && (
        <div 
          className="hidden xl:block z-40"
          style={{
            position: scrollY > 600 ? 'fixed' : 'absolute',
            top: scrollY > 600 ? '160px' : '800px',
            right: '1rem',
            width: '160px',
            maxHeight: '600px',
            transition: 'all 0.3s ease-out'
          }}
        >
          <div className="relative">
            <a 
              href="#" 
              className="block"
              onClick={(e) => {
                e.preventDefault();
                // Add link to promotional page if needed
              }}
            >
              <img 
                src={`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/uploads/banner_header_top_left_right/banners_right.jpg`}
                alt="Right Banner"
                className="w-full h-auto object-cover rounded-lg shadow-lg"
              />
            </a>
          </div>
        </div>
      )}

      {/* Promotional Header Banner */}
      <div className="w-full bg-gray-900">
        <div className="w-full max-w-[1920px] mx-auto">
          <a 
            href="#" 
            className="block w-full"
            onClick={(e) => {
              e.preventDefault();
              // Add link to promotional page if needed
              // navigate('/promotions');
            }}
          >
            <img 
              src={`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/uploads/banner_header_top_left_right/banners_header_top.gif`}
              alt="Promotional Banner"
              className="w-full h-auto object-cover"
              style={{ maxHeight: '120px' }}
            />
          </a>
        </div>
      </div>

      {/* Top Navigation */}
      <nav className="bg-blue-600 w-full sticky top-0 z-50">
        <div className="w-full max-w-[1920px] mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <span className="text-white text-xl font-bold">BATechZone</span>
            </Link>

            {/* Search Bar */}
            <SearchBar />

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {/* News Icon - Circular with purple background */}
              <Link
                to="/blog"
                className="relative transition-all duration-300 ease-in-out inline-flex items-center justify-center"
                style={{
                  position: "relative",
                  backgroundColor: "#a855f7",
                  color: "#ffffff",
                  borderRadius: "50%",
                  width: "48px",
                  height: "48px",
                  padding: "0",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: "scale(1)",
                  transition: "all 0.3s ease-in-out",
                  border: "none",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#9333ea";
                  e.currentTarget.style.transform = "scale(1.1)";
                  e.currentTarget.style.transition = "all 0.3s ease-in-out";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#a855f7";
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.transition = "all 0.3s ease-in-out";
                }}
              >
                <Newspaper className="size-6" style={{ color: "#ffffff" }} />
              </Link>
              {/* Shopping Cart Icon - Circular with blue background */}
              <CartDropdown cartItemsCount={cartItemsCount}>
                <div
                  className="relative transition-all duration-300 ease-in-out inline-flex items-center justify-center cursor-pointer"
                  style={{
                    position: 'relative',
                    backgroundColor: '#3b82f6', // blue-500
                    color: '#ffffff',
                    borderRadius: '50%',
                    width: '48px',
                    height: '48px',
                    padding: '0',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: 'scale(1)',
                    transition: 'all 0.3s ease-in-out',
                    border: 'none',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#2563eb'; // blue-600 (darker on hover)
                    e.currentTarget.style.transform = 'scale(1.1)';
                    e.currentTarget.style.transition = 'all 0.3s ease-in-out';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#3b82f6'; // blue-500
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.transition = 'all 0.3s ease-in-out';
                  }}
                >
                  <ShoppingCart className="size-6" style={{ color: '#ffffff' }} />
                  {cartItemsCount > 0 && (
                    <Badge 
                      className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 flex items-center justify-center bg-red-500 text-white text-xs font-bold border-2 border-white rounded-full"
                      style={{
                        position: 'absolute',
                        top: '-4px',
                        right: '-4px',
                        minWidth: '20px',
                        height: '20px',
                        padding: '0 6px',
                        backgroundColor: '#ef4444',
                        color: '#ffffff',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        border: '2px solid #ffffff',
                        borderRadius: '9999px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {cartItemsCount > 99 ? '99+' : cartItemsCount}
                    </Badge>
                  )}
                </div>
              </CartDropdown>

              {/* Build PC Icon */}
              <Link
                to="/build-pc"
                className="relative transition-all duration-300 ease-in-out inline-flex items-center justify-center"
                style={{
                  position: "relative",
                  backgroundColor: "#f97316",
                  color: "#ffffff",
                  borderRadius: "50%",
                  width: "48px",
                  height: "48px",
                  padding: "0",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: "scale(1)",
                  transition: "all 0.3s ease-in-out",
                  border: "none",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#ea580c";
                  e.currentTarget.style.transform = "scale(1.1)";
                  e.currentTarget.style.transition = "all 0.3s ease-in-out";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#f97316";
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.transition = "all 0.3s ease-in-out";
                }}
              >
                <Cpu className="size-6" style={{ color: "#ffffff" }} />
              </Link>

              {/* Coupon Icon - Circular with green background */}
              <Button
                variant="ghost"
                size="icon-lg"
                className="relative transition-all duration-300 ease-in-out"
                onClick={() => setIsCouponDialogOpen(true)}
                style={{
                  position: 'relative',
                  backgroundColor: '#10b981', // green-500
                  color: '#ffffff',
                  borderRadius: '50%',
                  width: '48px',
                  height: '48px',
                  padding: '0',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: 'scale(1)',
                  transition: 'all 0.3s ease-in-out',
                  border: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#059669'; // green-600 (darker on hover)
                  e.currentTarget.style.transform = 'scale(1.1)';
                  e.currentTarget.style.transition = 'all 0.3s ease-in-out';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#10b981'; // green-500
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.transition = 'all 0.3s ease-in-out';
                }}
              >
                <Tag className="size-6" style={{ color: '#ffffff' }} />
              </Button>

              {/* Warranty Check Icon - Circular with teal background */}
              <Link
                to="/warranty-check"
                className="relative transition-all duration-300 ease-in-out inline-flex items-center justify-center"
                style={{
                  position: 'relative',
                  backgroundColor: '#14b8a6', // teal-500
                  color: '#ffffff',
                  borderRadius: '50%',
                  width: '48px',
                  height: '48px',
                  padding: '0',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: 'scale(1)',
                  transition: 'all 0.3s ease-in-out',
                  border: 'none',
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#0d9488'; // teal-600 (darker on hover)
                  e.currentTarget.style.transform = 'scale(1.1)';
                  e.currentTarget.style.transition = 'all 0.3s ease-in-out';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#14b8a6'; // teal-500
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.transition = 'all 0.3s ease-in-out';
                }}
              >
                <Shield className="size-6" style={{ color: '#ffffff' }} />
              </Link>

              {/* User Account Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon-lg" 
                    className="relative transition-all duration-300 ease-in-out"
                    style={{
                      position: 'relative',
                      backgroundColor: '#10b981', // green-500
                      color: '#ffffff',
                      borderRadius: '50%',
                      width: '48px',
                      height: '48px',
                      padding: '0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transform: 'scale(1)',
                      transition: 'all 0.3s ease-in-out',
                      border: 'none'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#059669'; // green-600 (darker on hover)
                      e.currentTarget.style.transform = 'scale(1.1)';
                      e.currentTarget.style.transition = 'all 0.3s ease-in-out';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#10b981'; // green-500
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.transition = 'all 0.3s ease-in-out';
                    }}
                  >
                    <User className="size-6" style={{ color: '#ffffff' }} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {user ? (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/profile" className="flex items-center">
                          <User className="size-5 mr-2" />
                          Tài khoản
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/orders" className="flex items-center">
                          <ShoppingCart className="size-5 mr-2" />
                          Đơn hàng
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={handleLogout}>
                        <LogOut className="size-5 mr-2" />
                        Đăng xuất
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/auth/signin" className="flex items-center">
                          <LogIn className="size-5 mr-2" />
                          Đăng nhập
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/auth/signup" className="flex items-center">
                          <User className="size-5 mr-2" />
                          Đăng ký
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon-lg"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white hover:text-gray-200"
              >
                {isMenuOpen ? (
                  <X className="size-9 text-white" />
                ) : (
                  <Menu className="size-9 text-white" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Categories Navigation */}
      <div className="bg-gray-100 shadow-md w-full sticky top-20 z-40">
        <div className="w-full max-w-[1920px] mx-auto px-4">
          <div className="flex items-center py-3">
            {/* Category Menu Button */}
            <div 
              className="relative group"
              onMouseEnter={() => {
                // Clear any pending close timeout
                if (menuCloseTimeout) {
                  clearTimeout(menuCloseTimeout);
                  setMenuCloseTimeout(null);
                }
                setIsCategoryMenuOpen(true);
              }}
              onMouseLeave={() => {
                // Delay closing menu to allow user to move mouse into menu
                const timeout = setTimeout(() => {
                  setIsCategoryMenuOpen(false);
                }, 500); // 500ms delay - enough time to move mouse into menu
                setMenuCloseTimeout(timeout);
              }}
            >
              <Button
                data-slot="button"
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium text-sm"
                style={{
                  backgroundColor: '#1f2937', // gray-800
                  color: '#ffffff',
                  border: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#374151'; // gray-700
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#1f2937'; // gray-800
                }}
              >
                <Menu className="size-5" />
                <span>Danh mục</span>
              </Button>

              {/* Dropdown Menu */}
              {isCategoryMenuOpen && (
                <div 
                  className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50 py-2 max-h-[80vh] overflow-y-auto"
                  onMouseEnter={() => {
                    // Clear close timeout when mouse enters menu
                    if (menuCloseTimeout) {
                      clearTimeout(menuCloseTimeout);
                      setMenuCloseTimeout(null);
                    }
                    setIsCategoryMenuOpen(true);
                  }}
                  onMouseLeave={() => {
                    // Delay closing when mouse leaves menu
                    const timeout = setTimeout(() => {
                      setIsCategoryMenuOpen(false);
                    }, 500); // 500ms delay - enough time to move mouse back
                    setMenuCloseTimeout(timeout);
                  }}
                >
                  {categoriesLoading ? (
                    <div className="px-4 py-8 text-center text-gray-500 text-sm">
                      Đang tải danh mục...
                    </div>
                  ) : (categories && categories.length > 0) ? (
                    categories
                      .filter(cat => cat.isActive && !cat.parentId)
                      .map((parentCategory) => (
                      <div key={parentCategory.id} className="group/sub relative">
                        <Link
                          to={`/category/${parentCategory.id}`}
                          className="flex items-center justify-between px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors rounded-md mx-1"
                          onClick={() => setIsCategoryMenuOpen(false)}
                        >
                          <span className="font-medium text-sm">{parentCategory.name}</span>
                        </Link>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-8 text-center text-gray-500 text-sm">
                      Chưa có danh mục nào
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <nav className="px-2 pt-2 pb-3 space-y-2">
            <Button variant="ghost" size="lg" className="w-full justify-start relative" asChild>
              <Link to="/cart" className="flex items-center">
                <ShoppingCart className="size-9 mr-2 text-blue-600" />
                Giỏ hàng
                {cartItemsCount > 0 && (
                  <Badge 
                    className="ml-auto bg-red-500 text-white text-xs font-bold min-w-[20px] h-5 px-1.5 flex items-center justify-center"
                    style={{
                      backgroundColor: '#ef4444',
                      color: '#ffffff',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      minWidth: '20px',
                      height: '20px',
                      padding: '0 6px',
                      borderRadius: '9999px'
                    }}
                  >
                    {cartItemsCount > 99 ? '99+' : cartItemsCount}
                  </Badge>
                )}
              </Link>
            </Button>
            <Button variant="ghost" size="lg" className="w-full justify-start relative" asChild>
              <Link to="/build-pc" className="flex items-center">
                <Cpu className="size-9 mr-2 text-orange-500" />
                Build PC
              </Link>
            </Button>
            <Button 
              variant="ghost" 
              size="lg" 
              className="w-full justify-start"
              onClick={() => {
                setIsCouponDialogOpen(true);
                setIsMenuOpen(false);
              }}
            >
              <Tag className="size-9 mr-2 text-green-600" />
              Mã giảm giá
            </Button>
            <Button variant="ghost" size="lg" className="w-full justify-start" asChild>
              <Link to="/profile" className="flex items-center">
                <User className="size-9 mr-2 text-blue-600" />
                Tài khoản
              </Link>
            </Button>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-grow bg-gray-50 w-full">
        <div className="w-full max-w-[1920px] mx-auto px-4">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white w-full">
        <div className="w-full max-w-[1920px] mx-auto px-4 xl:px-48 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">Về chúng tôi</h3>
              <p className="text-gray-400">
                BATechZone - Chuyên cung cấp linh kiện máy tính chính hãng với giá tốt nhất thị trường.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Chính sách</h3>
              <ul className="space-y-2">
                <li><Link to="/policy/shipping" className="text-gray-400 hover:text-white">Chính sách vận chuyển</Link></li>
                <li><Link to="/policy/warranty" className="text-gray-400 hover:text-white">Chính sách bảo hành</Link></li>
                <li><Link to="/policy/return" className="text-gray-400 hover:text-white">Chính sách đổi trả</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Liên hệ</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Hotline: 1900-1234</li>
                <li>Email: support@batechzone.com</li>
                <li>Địa chỉ: 123 Đường Trần Hưng Đạo, Quận 1, TP.HCM</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Kết nối với chúng tôi</h3>
              <div className="flex items-center space-x-4">
                {/* Facebook - Blue */}
                <a 
                  href="#" 
                  className="transition-all duration-200 hover:scale-110"
                  style={{
                    color: '#1877F2', // Facebook blue
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#42A5F5'; // Lighter blue on hover
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#1877F2'; // Facebook blue
                  }}
                  aria-label="Facebook"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg 
                    style={{
                      width: '28px',
                      height: '28px',
                      fill: 'currentColor'
                    }}
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                
                {/* YouTube - Red */}
                <a 
                  href="#" 
                  className="transition-all duration-200 hover:scale-110"
                  style={{
                    color: '#FF0000', // YouTube red
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#FF4444'; // Lighter red on hover
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#FF0000'; // YouTube red
                  }}
                  aria-label="YouTube"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg 
                    style={{
                      width: '28px',
                      height: '28px',
                      fill: 'currentColor'
                    }}
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
                
                {/* Instagram - Gradient (Purple/Pink/Orange) */}
                <a 
                  href="#" 
                  className="transition-all duration-200 hover:scale-110"
                  style={{
                    textDecoration: 'none',
                    display: 'inline-block'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '0.8';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '1';
                  }}
                  aria-label="Instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg 
                    style={{
                      width: '28px',
                      height: '28px'
                    }}
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <linearGradient id="instagram-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f09433" />
                        <stop offset="25%" stopColor="#e6683c" />
                        <stop offset="50%" stopColor="#dc2743" />
                        <stop offset="75%" stopColor="#cc2366" />
                        <stop offset="100%" stopColor="#bc1888" />
                      </linearGradient>
                    </defs>
                    <path fill="url(#instagram-gradient)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.98-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.98-6.98C15.666.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.405a1.44 1.44 0 1 1-2.881 0 1.44 1.44 0 0 1 2.881 0z"/>
                  </svg>
                </a>
                
                {/* TikTok - White (for dark footer) */}
                <a 
                  href="#" 
                  className="transition-all duration-200 hover:scale-110"
                  style={{
                    color: '#FFFFFF', // White for dark footer
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#E5E7EB'; // Light gray on hover
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#FFFFFF'; // White
                  }}
                  aria-label="TikTok"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg 
                    style={{
                      width: '28px',
                      height: '28px',
                      fill: 'currentColor'
                    }}
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-8 text-center text-gray-400">
            <p>&copy; 2025 BATechZone. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Coupon Dialog */}
      <Dialog open={isCouponDialogOpen} onOpenChange={setIsCouponDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Tag className="h-6 w-6 text-green-600" />
              Mã giảm giá
            </DialogTitle>
            <DialogDescription>
              Chọn mã giảm giá để copy hoặc áp dụng trực tiếp
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            {couponsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
                <p className="text-sm text-gray-500">Đang tải mã giảm giá...</p>
              </div>
            ) : validCoupons.length > 0 ? (
              <div className="grid gap-4">
                {validCoupons.map((coupon) => {
                  const isCopied = copiedCouponCode === coupon.coupon_code;
                  const formatPrice = (price) => {
                    return new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(price);
                  };

                  const discountText = coupon.discount_type === 'percentage' 
                    ? `${coupon.discount_value}%` 
                    : formatPrice(coupon.discount_value);

                  return (
                    <div
                      key={coupon.coupon_id}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-bold text-lg text-green-600">
                              {coupon.coupon_code}
                            </span>
                            <Badge className="bg-green-100 text-green-800">
                              Giảm {discountText}
                            </Badge>
                          </div>
                          {coupon.description && (
                            <p className="text-sm text-gray-600 mb-2">
                              {coupon.description}
                            </p>
                          )}
                          <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                            {coupon.min_order_amount > 0 && (
                              <span>
                                Đơn tối thiểu: {formatPrice(coupon.min_order_amount)}
                              </span>
                            )}
                            {coupon.max_discount_amount && (
                              <span>
                                Giảm tối đa: {formatPrice(coupon.max_discount_amount)}
                              </span>
                            )}
                            {coupon.valid_until && (
                              <span>
                                HSD: {new Date(coupon.valid_until).toLocaleDateString('vi-VN')}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCopyCoupon(coupon.coupon_code)}
                            className="flex items-center gap-2"
                          >
                            {isCopied ? (
                              <>
                                <Check className="h-4 w-4 text-green-600" />
                                <span className="text-green-600">Đã copy</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-4 w-4" />
                                <span>Copy</span>
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Tag className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Hiện tại không có mã giảm giá nào</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={successDialog.open} onOpenChange={(open) => !open && setSuccessDialog({ open: false, message: '' })}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
            </div>
            <DialogTitle className="text-center text-xl">Thành công!</DialogTitle>
            <DialogDescription className="text-center text-base mt-2">
              {successDialog.message}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button 
              onClick={() => setSuccessDialog({ open: false, message: '' })}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserLayout;
