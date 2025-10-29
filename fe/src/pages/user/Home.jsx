import { useState } from 'react';
import { Link } from 'react-router';

// Mock data for featured products
const featuredProducts = [
  {
    id: 1,
    name: 'AMD Ryzen 7 5800X',
    category: 'CPU',
    price: 8990000,
    image: 'https://via.placeholder.com/300',
    discount: 10,
  },
  {
    id: 2,
    name: 'NVIDIA RTX 4070',
    category: 'VGA',
    price: 15990000,
    image: 'https://via.placeholder.com/300',
    discount: 5,
  },
  {
    id: 3,
    name: 'Samsung 970 EVO Plus 1TB',
    category: 'SSD',
    price: 2990000,
    image: 'https://via.placeholder.com/300',
    discount: 15,
  },
  {
    id: 4,
    name: 'ASUS ROG STRIX B550-F',
    category: 'Mainboard',
    price: 4990000,
    image: 'https://via.placeholder.com/300',
    discount: 0,
  },
];

// Mock data for featured categories
const featuredCategories = [
  {
    id: 1,
    name: 'CPU - Bộ vi xử lý',
    image: 'https://via.placeholder.com/200',
    href: '/category/cpu',
  },
  {
    id: 2,
    name: 'VGA - Card màn hình',
    image: 'https://via.placeholder.com/200',
    href: '/category/vga',
  },
  {
    id: 3,
    name: 'RAM - Bộ nhớ trong',
    image: 'https://via.placeholder.com/200',
    href: '/category/ram',
  },
  {
    id: 4,
    name: 'SSD - Ổ cứng',
    image: 'https://via.placeholder.com/200',
    href: '/category/storage',
  },
];

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const banners = [
    'https://via.placeholder.com/1200x400?text=Gaming+PC+Sale',
    'https://via.placeholder.com/1200x400?text=New+RTX+4000+Series',
    'https://via.placeholder.com/1200x400?text=SSD+Promotion',
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  // Format price with VND currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  return (
    <div className="space-y-8">
      {/* Hero Banner/Slider */}
      <div className="relative">
        <div className="relative h-[400px]">
          {banners.map((banner, index) => (
            <div
              key={index}
              className={`absolute w-full h-full transition-opacity duration-500 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={banner}
                alt={`Banner ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
        >
          ❮
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
        >
          ❯
        </button>
      </div>

      {/* Featured Categories */}
      <section className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">Danh mục nổi bật</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {featuredCategories.map((category) => (
            <Link
              key={category.id}
              to={category.href}
              className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow"
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <h3 className="text-white font-semibold">{category.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">Sản phẩm nổi bật</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <span className="text-sm text-gray-500">{product.category}</span>
                <h3 className="font-semibold text-lg mb-2 hover:text-blue-600">
                  {product.name}
                </h3>
                <div className="flex items-baseline mb-2">
                  <span className="text-xl font-bold text-red-600">
                    {formatPrice(product.price * (1 - product.discount / 100))}
                  </span>
                  {product.discount > 0 && (
                    <>
                      <span className="ml-2 text-sm text-gray-500 line-through">
                        {formatPrice(product.price)}
                      </span>
                      <span className="ml-2 text-sm text-red-600">
                        -{product.discount}%
                      </span>
                    </>
                  )}
                </div>
                <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Thêm vào giỏ
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">Tại sao chọn chúng tôi?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Giao hàng nhanh chóng</h3>
              <p className="text-gray-600">Giao hàng trong vòng 2h nội thành và 2-4 ngày toàn quốc</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Sản phẩm chính hãng</h3>
              <p className="text-gray-600">Cam kết 100% sản phẩm chính hãng, có giấy tờ đầy đủ</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Dịch vụ hậu mãi</h3>
              <p className="text-gray-600">Hỗ trợ kỹ thuật 24/7 và bảo hành dài hạn</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Subscription */}
      <section className="bg-blue-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Đăng ký nhận tin khuyến mãi</h2>
          <p className="mb-6">Nhận thông tin về sản phẩm mới và khuyến mãi hấp dẫn</p>
          <form className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Nhập email của bạn"
              className="flex-1 px-4 py-2 rounded-lg text-gray-900"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-yellow-500 text-gray-900 font-semibold rounded-lg hover:bg-yellow-400 transition-colors"
            >
              Đăng ký
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;
