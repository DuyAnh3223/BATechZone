import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProductStore } from '@/stores/useProductStore';
import { useCategoryStore } from '@/stores/useCategoryStore';
import ProductCard from '@/components/common/ProductCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { products, loading: productsLoading, fetchProducts } = useProductStore();
  const { categories, loading: categoriesLoading, fetchCategories } = useCategoryStore();

  const banners = [
    'https://via.placeholder.com/1200x400?text=Gaming+PC+Sale',
    'https://via.placeholder.com/1200x400?text=New+RTX+4000+Series',
    'https://via.placeholder.com/1200x400?text=SSD+Promotion',
  ];

  // Fetch featured products (is_featured = true, is_active = true)
  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        await fetchProducts({
          is_active: true,
          is_featured: true,
          limit: 8,
          page: 1,
          sortBy: 'created_at',
          sortOrder: 'DESC'
        });
      } catch (error) {
        console.error('Error loading featured products:', error);
      }
    };

    loadFeaturedProducts();
  }, [fetchProducts]);

  // Fetch featured categories (active categories, chỉ lấy parent categories)
  useEffect(() => {
    const loadFeaturedCategories = async () => {
      try {
        await fetchCategories({
          is_active: true,
          parentId: null, // Chỉ lấy parent categories (null = không có parent)
          limit: 8,
          page: 1
        });
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };

    loadFeaturedCategories();
  }, [fetchCategories]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
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
        {categoriesLoading ? (
          <div className="text-center py-8">Đang tải danh mục...</div>
        ) : categories.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.slice(0, 8).map((category) => (
              <Link
                key={category.category_id}
                to={`/category/${category.category_id}`}
                className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow"
              >
                <img
                  src={category.image_url || 'https://via.placeholder.com/200'}
                  alt={category.category_name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/200';
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <h3 className="text-white font-semibold">{category.category_name}</h3>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">Chưa có danh mục nào</div>
        )}
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">Sản phẩm nổi bật</h2>
        {productsLoading ? (
          <div className="text-center py-8">Đang tải sản phẩm...</div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.product_id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">Chưa có sản phẩm nổi bật nào</div>
        )}
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
          <form className="max-w-2xl mx-auto flex items-center w-full gap-0">
            <Input
              type="email"
              placeholder="Nhập email của bạn"
              className="flex-[8] rounded-r-none"
              style={{
                backgroundColor: '#ffffff',
                color: '#111827',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRight: 'none',
                borderRadius: '6px 0 0 6px'
              }}
            />
            <Button
              type="submit"
              className="flex-[2] px-3 py-1 rounded-l-none h-9 flex items-center justify-center font-semibold"
              style={{
                backgroundColor: '#dc2626', // red-600
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderLeft: 'none',
                borderRadius: '0 6px 6px 0',
                height: '36px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#b91c1c'; // red-700
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#dc2626'; // red-600
              }}
            >
              Đăng ký
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;
