import { useEffect, useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { productService } from '@/services/productService';

const RecentlyViewedProducts = () => {
  const [viewedProducts, setViewedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef(null);

  useEffect(() => {
    const loadRecentlyViewed = async () => {
      try {
        setLoading(true);
        // Lấy danh sách ID sản phẩm đã xem từ localStorage
        const viewedIds = JSON.parse(localStorage.getItem('recentlyViewedProducts') || '[]');
        
        if (viewedIds.length === 0) {
          setLoading(false);
          return;
        }

        // Lấy thông tin chi tiết của các sản phẩm đã xem (tối đa 12 sản phẩm)
        const productPromises = viewedIds.slice(0, 12).map(id => 
          productService.getProduct(id).catch(err => {
            console.log(`Product ${id} not found, will be removed from recently viewed`);
            return null;
          })
        );
        
        const products = await Promise.all(productPromises);
        // Lọc bỏ các sản phẩm không tồn tại hoặc không active
        const validProducts = products.filter(p => p && p.data && p.data.is_active);
        
        // Update localStorage to only keep valid product IDs
        const validIds = validProducts.map(p => p.data.product_id);
        if (validIds.length !== viewedIds.length) {
          localStorage.setItem('recentlyViewedProducts', JSON.stringify(validIds));
        }
        
        setViewedProducts(validProducts.map(p => p.data));
      } catch (error) {
        console.error('Error loading recently viewed products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRecentlyViewed();

    // Lắng nghe sự kiện cập nhật từ localStorage
    const handleStorageChange = () => {
      loadRecentlyViewed();
    };

    window.addEventListener('recentlyViewedUpdated', handleStorageChange);
    
    return () => {
      window.removeEventListener('recentlyViewedUpdated', handleStorageChange);
    };
  }, []);

  const handleScroll = (direction) => {
    if (carouselRef.current) {
      const firstCard = carouselRef.current.querySelector('div');
      const scrollAmount = firstCard ? firstCard.offsetWidth + 16 : 304; // card width + gap
      if (direction === 'left') {
        carouselRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  // Không hiển thị nếu chưa có sản phẩm nào được xem
  if (loading || viewedProducts.length === 0) {
    return null;
  }

  return (
    <section className="max-w-7xl mx-auto px-4">
      <h2 className="text-2xl font-bold mb-6">Sản phẩm đã xem</h2>
      
      {/* Carousel Container */}
      <div className="relative">
        {/* Left Arrow Button */}
        {viewedProducts.length > 4 && (
          <button
            onClick={() => handleScroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white border border-gray-300 rounded-full p-2 hover:bg-gray-100 transition-colors shadow-md hover:shadow-lg"
            aria-label="Previous products"
          >
            <ChevronLeft size={20} className="text-gray-700" />
          </button>
        )}

        {/* Carousel Content */}
        <div
          ref={carouselRef}
          className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide"
          style={{ scrollBehavior: 'smooth' }}
        >
          {viewedProducts.map((product) => (
            <div key={product.product_id} className="flex-shrink-0" style={{ width: 'calc((100% - 3rem) / 4)' }}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Right Arrow Button */}
        {viewedProducts.length > 4 && (
          <button
            onClick={() => handleScroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white border border-gray-300 rounded-full p-2 hover:bg-gray-100 transition-colors shadow-md hover:shadow-lg"
            aria-label="Next products"
          >
            <ChevronRight size={20} className="text-gray-700" />
          </button>
        )}
      </div>
    </section>
  );
};

export default RecentlyViewedProducts;
