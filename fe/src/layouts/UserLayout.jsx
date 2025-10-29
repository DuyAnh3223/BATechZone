import { Outlet } from 'react-router';
import { Link } from 'react-router';
import { useState } from 'react';
import { ShoppingCart, User, Menu, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const categories = [
  { name: 'CPU - Bộ vi xử lý', href: '/category/cpu' },
  { name: 'Mainboard - Bo mạch chủ', href: '/category/mainboard' },
  { name: 'RAM - Bộ nhớ trong', href: '/category/ram' },
  { name: 'VGA - Card màn hình', href: '/category/vga' },
  { name: 'SSD - Ổ cứng', href: '/category/storage' },
  { name: 'PSU - Nguồn máy tính', href: '/category/psu' },
  { name: 'Case - Vỏ máy tính', href: '/category/case' },
  { name: 'Cooling - Tản nhiệt', href: '/category/cooling' },
];

const UserLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen flex flex-col w-full">
      {/* Top Navigation */}
      <nav className="bg-blue-600 w-full">
        <div className="w-full max-w-[1920px] mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <span className="text-white text-xl font-bold">PC Hardware Store</span>
            </Link>

            {/* Search Bar */}
            <div className="flex-1 max-w-3xl mx-4">
              <div className="relative flex items-center w-full">
                <Input
                  type="text"
                  className="w-full pr-10"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button 
                  variant="ghost" 
                  className="absolute right-0 hover:bg-transparent"
                >
                  <Search className="h-5 w-5 text-gray-500" />
                </Button>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Button variant="ghost" asChild className="text-white hover:text-gray-200">
                <Link to="/cart">
                  <ShoppingCart className="h-5 w-5" />
                </Link>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-white hover:text-gray-200">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Link to="/profile">Tài khoản</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/orders">Đơn hàng</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>Đăng xuất</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white hover:text-gray-200"
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Categories Navigation */}
      <div className="bg-gray-100 shadow-md w-full">
        <div className="w-full max-w-[1920px] mx-auto px-4">
          <NavigationMenu className="w-full">
            <NavigationMenuList className="flex items-center space-x-8 py-3 overflow-x-auto">
              {categories.map((category) => (
                <NavigationMenuItem key={category.name}>
                  <NavigationMenuLink asChild>
                    <Link
                      to={category.href}
                      className="text-gray-600 hover:text-blue-600 whitespace-nowrap text-sm font-medium"
                    >
                      {category.name}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <nav className="px-2 pt-2 pb-3 space-y-1">
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link to="/cart" className="flex items-center">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Giỏ hàng
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link to="/profile" className="flex items-center">
                <User className="h-5 w-5 mr-2" />
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
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Youtube</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
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
    </div>
  );
};

export default UserLayout;
