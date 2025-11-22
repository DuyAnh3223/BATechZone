import { Outlet, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { ShoppingCart, Cpu, User, Menu, X, Search, LogIn, LogOut, ChevronRight, Bell, Tag, Copy, Check } from "lucide-react";
import { useAuth } from '@/context/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useCategoryStore } from '@/stores/useCategoryStore';
import { useNotificationStore } from '@/stores/useNotificationStore';
import { useCartItemStore } from '@/stores/useCartItemStore';
import { useCouponStore } from '@/stores/useCouponStore';
import { couponService } from '@/services/couponService';
import CartDropdown from '@/components/common/CartDropdown';
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [menuCloseTimeout, setMenuCloseTimeout] = useState(null);
  const { categoryTree, fetchCategoryTree, categories, fetchCategories, loading: categoriesLoading } = useCategoryStore();
  const { notifications, unreadCount, loading: notificationsLoading, fetchNotifications, markAsRead, markAllAsRead } = useNotificationStore();
  const { cartItems } = useCartItemStore();
  const { coupons, fetchCoupons, loading: couponsLoading } = useCouponStore();
  
  // Calculate total cart items count (sum of quantities)
  const cartItemsCount = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
  
  // Coupon dialog state
  const [isCouponDialogOpen, setIsCouponDialogOpen] = useState(false);
  const [copiedCouponCode, setCopiedCouponCode] = useState(null);

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
      toast.success(`Đã copy mã giảm giá: ${couponCode}`);
      setTimeout(() => setCopiedCouponCode(null), 2000);
    } catch (error) {
      toast.error('Không thể copy mã giảm giá');
    }
  };


  // Function to load categories (memoized with useCallback)
  const loadCategories = useCallback(async () => {
    try {
      // Try to fetch tree first
      const tree = await fetchCategoryTree();
      // If tree is empty, try to fetch parent categories as fallback
      if (!tree || tree.length === 0) {
        console.log('Tree is empty, fetching parent categories as fallback...');
        await fetchCategories({
          is_active: true,
          parentId: null,
          limit: 100,
          page: 1
        });
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
      // Fallback: try to fetch parent categories
      try {
        await fetchCategories({
          is_active: true,
          parentId: null,
          limit: 100,
          page: 1
        });
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
      }
    }
  }, [fetchCategoryTree, fetchCategories]);

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

  // Fetch notifications when user is logged in
  useEffect(() => {
    if (user) {
      const loadNotifications = async () => {
        try {
          await fetchNotifications({ limit: 10, page: 1 });
        } catch (error) {
          console.error('Failed to load notifications:', error);
        }
      };
      loadNotifications();
      // Refresh notifications every 30 seconds
      const interval = setInterval(loadNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user, fetchNotifications]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col w-full">
      {/* Top Navigation */}
      <nav className="bg-blue-600 w-full">
        <div className="w-full max-w-[1920px] mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <span className="text-white text-xl font-bold">PC Hardware Store</span>
            </Link>

            {/* Search Bar */}
            <div className="flex-1 max-w-3xl mx-4">
              <div className="flex items-center w-full gap-0">
                <Input
                  type="text"
                  className="flex-[8] bg-white text-gray-900 placeholder-gray-500 border-white/80 focus-visible:ring-white/40 rounded-r-none border-r-0"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      // Handle search
                      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
                    }
                  }}
                />
                <Button 
                  variant="ghost" 
                  className="flex-[2] bg-white text-gray-900 hover:bg-gray-100 px-3 py-1 rounded-l-none border border-l-0 border-white/80 h-9 flex items-center justify-center"
                  onClick={() => {
                    if (searchQuery.trim()) {
                      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
                    }
                  }}
                >
                  <Search className="size-4 mr-1.5" />
                  <span className="text-sm font-medium whitespace-nowrap">Tìm kiếm</span>
                </Button>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
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

              {/* Notification Bell - Only show if user is logged in */}
              {user && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon-lg" 
                      className="relative transition-all duration-300 ease-in-out"
                      style={{
                        position: 'relative',
                        backgroundColor: '#fbbf24', // yellow-400
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
                        e.currentTarget.style.backgroundColor = '#f59e0b'; // yellow-500 (darker on hover)
                        e.currentTarget.style.transform = 'scale(1.1)';
                        e.currentTarget.style.transition = 'all 0.3s ease-in-out';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#fbbf24'; // yellow-400
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.transition = 'all 0.3s ease-in-out';
                      }}
                    >
                      <Bell className="size-6" style={{ color: '#ffffff' }} />
                      {unreadCount > 0 && (
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
                          {unreadCount > 99 ? '99+' : unreadCount}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80 max-h-[400px] overflow-y-auto">
                    <div className="flex items-center justify-between px-2 py-1.5 border-b">
                      <span className="font-semibold text-sm">Thông báo</span>
                      {unreadCount > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-xs"
                          onClick={(e) => {
                            e.preventDefault();
                            markAllAsRead();
                          }}
                        >
                          Đánh dấu tất cả đã đọc
                        </Button>
                      )}
                    </div>
                    {notificationsLoading ? (
                      <div className="px-4 py-8 text-center text-gray-500 text-sm">
                        Đang tải thông báo...
                      </div>
                    ) : notifications.length > 0 ? (
                      <>
                        {notifications.map((notification) => {
                          const notifId = notification.notification_id || notification.id;
                          const isRead = notification.is_read || false;
                          return (
                            <DropdownMenuItem
                              key={notifId}
                              className={`px-3 py-2.5 cursor-pointer ${!isRead ? 'bg-blue-50' : ''}`}
                              onClick={() => {
                                if (!isRead) {
                                  markAsRead(notifId);
                                }
                                if (notification.link_url) {
                                  navigate(notification.link_url);
                                }
                              }}
                            >
                              <div className="flex flex-col w-full">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex-1">
                                    <p className={`text-sm font-medium ${!isRead ? 'text-gray-900' : 'text-gray-600'}`}>
                                      {notification.title || notification.content}
                                    </p>
                                    {notification.content && notification.title && (
                                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                        {notification.content}
                                      </p>
                                    )}
                                    <p className="text-xs text-gray-400 mt-1">
                                      {new Date(notification.created_at).toLocaleDateString('vi-VN', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })}
                                    </p>
                                  </div>
                                  {!isRead && (
                                    <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1" />
                                  )}
                                </div>
                              </div>
                            </DropdownMenuItem>
                          );
                        })}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link to="/profile?tab=notifications" className="text-center text-sm text-blue-600 hover:text-blue-700">
                            Xem tất cả thông báo
                          </Link>
                        </DropdownMenuItem>
                      </>
                    ) : (
                      <div className="px-4 py-8 text-center text-gray-500 text-sm">
                        Chưa có thông báo nào
                      </div>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              
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
      <div className="bg-gray-100 shadow-md w-full">
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
                  ) : (categoryTree && categoryTree.length > 0) ? (
                    categoryTree.map((parentCategory) => (
                      <div key={parentCategory.category_id} className="group/sub relative">
                        <Link
                          to={`/category/${parentCategory.category_id}`}
                          className="flex items-center justify-between px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors rounded-md mx-1"
                          onClick={() => setIsCategoryMenuOpen(false)}
                        >
                          <span className="font-medium text-sm">{parentCategory.category_name}</span>
                          {parentCategory.children && parentCategory.children.length > 0 && (
                            <ChevronRight className="size-4 text-gray-400 group-hover/sub:text-blue-600 transition-colors" />
                          )}
                        </Link>
                        
                        {/* Subcategories */}
                        {parentCategory.children && parentCategory.children.length > 0 && (
                          <div className="absolute left-full top-0 ml-1 w-64 bg-white rounded-lg shadow-xl border border-gray-200 opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible transition-all duration-200 py-2 z-50">
                            {parentCategory.children.map((childCategory) => (
                              <Link
                                key={childCategory.category_id}
                                to={`/category/${childCategory.category_id}`}
                                className="block px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors text-sm rounded-md mx-1"
                                onClick={() => setIsCategoryMenuOpen(false)}
                              >
                                {childCategory.category_name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (categories && categories.length > 0) ? (
                    // Fallback: Use categories if tree is empty
                    categories
                      .filter(cat => !cat.parent_category_id || cat.parent_category_id === null)
                      .map((category) => (
                        <div key={category.category_id} className="group/sub relative">
                          <Link
                            to={`/category/${category.category_id}`}
                            className="flex items-center justify-between px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors rounded-md mx-1"
                            onClick={() => setIsCategoryMenuOpen(false)}
                          >
                            <span className="font-medium text-sm">{category.category_name}</span>
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
            {user && (
              <Button variant="ghost" size="lg" className="w-full justify-start relative" asChild>
                <Link to="/profile?tab=notifications" className="flex items-center">
                  <Bell className="size-9 mr-2 text-blue-600" />
                  Thông báo
                  {unreadCount > 0 && (
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
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </Badge>
                  )}
                </Link>
              </Button>
            )}
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
        <div className="w-full max-w-[1920px] mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">Về chúng tôi</h3>
              <p className="text-gray-400">
                PC Hardware Store - Chuyên cung cấp linh kiện máy tính chính hãng với giá tốt nhất thị trường.
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
                <li>Email: support@pchardware.com</li>
                <li>Địa chỉ: 123 Đường ABC, Quận XYZ, TP.HCM</li>
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
            <p>&copy; 2025 PC Hardware Store. All rights reserved.</p>
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
    </div>
  );
};

export default UserLayout;
