import { useEffect, useState, useRef } from 'react';
import { productService } from '@/services/productService';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '@/components/product/ProductCard';

const AllComponents = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef(null);

  // Fetch all active products directly from service
  useEffect(() => {
    const loadAllProducts = async () => {
      try {
        setLoading(true);
        const response = await productService.listProducts({
          is_active: true,
          limit: 100,
          page: 1,
          sortBy: 'created_at',
          sortOrder: 'DESC'
        });
        const products = response.data || [];
        setAllProducts(products);
      } catch (error) {
        console.error('Error loading all products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAllProducts();
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

  if (loading) {
    return (
      <div className="w-full bg-white rounded-lg shadow-sm p-6">
        <div className="h-64 bg-gray-200 animate-pulse rounded-lg"></div>
      </div>
    );
  }

  if (!allProducts || allProducts.length === 0) {
    return null;
  }

  return (
    <section className="max-w-7xl mx-auto px-4">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Linh kiện</h2>
        <p className="text-sm text-gray-600 mt-1">Khám phá toàn bộ các linh kiện máy tính chất lượng cao</p>
      </div>

      {/* Carousel Container */}
      <div className="relative">
        {/* Left Arrow Button */}
        {allProducts.length > 4 && (
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
          {allProducts.map((product) => (
            <div key={product.product_id} className="flex-shrink-0" style={{ width: 'calc((100% - 3rem) / 4)' }}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Right Arrow Button */}
        {allProducts.length > 4 && (
          <button
            onClick={() => handleScroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white border border-gray-300 rounded-full p-2 hover:bg-gray-100 transition-colors shadow-md hover:shadow-lg"
            aria-label="Next products"
          >
            <ChevronRight size={20} className="text-gray-700" />
          </button>
        )}
      </div>

      {/* Custom scrollbar hide style */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default AllComponents;