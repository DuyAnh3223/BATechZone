import { useEffect, useState, useRef } from 'react';
import { productService } from '@/services/productService';
import { variantService } from '@/services/variantService';
import { ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useCartStore } from '@/stores/useCartStore';
import { useCartItemStore } from '@/stores/useCartItemStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { useVariantStore } from '@/stores/useVariantStore';

const AllComponents = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [variantImages, setVariantImages] = useState({}); // product_id -> image_url from uploads
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef(null);
  const { getOrCreateCart } = useCartStore();
  const { addToCart } = useCartItemStore();
  const { user } = useAuthStore();
  const { fetchVariantsByProductId } = useVariantStore();

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
        
        // Lấy ảnh primary của variant đầu tiên cho mỗi sản phẩm
        const imagesMap = {};
        for (const product of products) {
          try {
            const image = await variantService.getFirstVariantPrimaryImage(product.product_id);
            if (image?.image_url) {
              imagesMap[product.product_id] = image.image_url;
            }
          } catch (error) {
            console.error(`Error loading image for product ${product.product_id}:`, error);
          }
        }
        setVariantImages(imagesMap);
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
      const scrollAmount = 320; // width of card + gap
      if (direction === 'left') {
        carouselRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleAddToCart = async (productId, e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      // 1. Lấy variants của sản phẩm để tìm default variant
      const variantsResponse = await fetchVariantsByProductId(productId);
      const variants = variantsResponse?.data || variantsResponse || [];
      
      if (!variants || variants.length === 0) {
        toast.error('Sản phẩm không có biến thể');
        return;
      }

      // Tìm variant mặc định hoặc lấy variant đầu tiên
      const defaultVariant = variants.find(v => v.is_default) || variants[0];
      
      if (!defaultVariant) {
        toast.error('Không tìm thấy biến thể sản phẩm');
        return;
      }

      // 2. Lấy hoặc tạo giỏ hàng
      let cartData = {};
      if (user) {
        cartData.userId = user.user_id;
      } else {
        // Guest cart
        let sessionId = localStorage.getItem('guest_session_id');
        if (!sessionId) {
          sessionId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          localStorage.setItem('guest_session_id', sessionId);
        }
        cartData.sessionId = sessionId;
      }

      const cartResponse = await getOrCreateCart(cartData);
      const cart = cartResponse?.data || cartResponse;
      
      const cartId = cart?.cart_id || cart?.cartId;
      if (!cartId) {
        toast.error('Không thể tạo giỏ hàng');
        return;
      }

      // 3. Thêm sản phẩm vào giỏ hàng
      await addToCart({
        cartId: cartId,
        variantId: defaultVariant.variant_id,
        quantity: 1
      });

      toast.success('Đã thêm sản phẩm vào giỏ hàng');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error(error.response?.data?.message || 'Không thể thêm vào giỏ hàng');
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Linh kiện</h2>
          <p className="text-sm text-gray-600 mt-1">Khám phá toàn bộ các linh kiện máy tính chất lượng cao</p>
        </div>
        <Link 
          to="/products" 
          className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
        >
          Xem tất cả →
        </Link>
      </div>

      {/* Carousel Container */}
      <div className="relative">
        {/* Left Arrow Button */}
        <button
          onClick={() => handleScroll('left')}
          className="glide__arrow--override glide__arrow--left absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white border border-gray-300 rounded-full p-2 hover:bg-gray-100 transition-colors shadow-md hover:shadow-lg"
          aria-label="Previous products"
        >
          <ChevronLeft size={20} className="text-gray-700" />
        </button>

        {/* Carousel Content */}
        <div
          ref={carouselRef}
          className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide"
          style={{ scrollBehavior: 'smooth' }}
        >
          {allProducts.map((product) => (
            <div key={product.product_id} className="flex-shrink-0 w-80">
              <Card className="h-full hover:shadow-lg transition-shadow overflow-hidden flex flex-col">
                {/* Product Image */}
                <div className="relative overflow-hidden bg-gray-100">
                  <div className="relative aspect-square w-full">
                    <img
                      src={variantImages[product.product_id] ? `http://localhost:5001${variantImages[product.product_id]}` : product.image_url || 'data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22250%22><rect width=%22100%25%22 height=%22100%25%22 fill=%22%23eeeeee%22/><text x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 fill=%22%23888888%22 font-family=%22Arial%22 font-size=%2220%22>No Image</text></svg>'}
                      alt={product.product_name}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22250%22><rect width=%22100%25%22 height=%22100%25%22 fill=%22%23eeeeee%22/><text x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 fill=%22%23888888%22 font-family=%22Arial%22 font-size=%2220%22>No Image</text></svg>';
                      }}
                    />
                  {product.discount && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      -{product.discount}%
                    </div>
                  )}
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4 flex flex-col flex-1">
                  {/* Category Name */}
                  {product.category_name && (
                    <div className="mb-1">
                      <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                        {product.category_name}
                      </span>
                    </div>
                  )}
                  
                  <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 text-sm min-h-[2.5rem]">
                    {product.product_name}
                  </h3>

                  {/* Price Section */}
                  <div className="mb-3 flex items-baseline gap-2">
                    <span className="text-lg font-bold text-red-600">
                      {formatPrice(product.default_variant_price)}
                    </span>
                    {product.max_variant_price && product.max_variant_price > product.default_variant_price && (
                      <span className="text-sm text-gray-500 line-through">
                        {formatPrice(product.max_variant_price)}
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-auto">
                    <Link
                      to={`/product/${product.product_id}`}
                      className="flex-1"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-xs"
                      >
                        Xem
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      className="flex-1 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={(e) => handleAddToCart(product.product_id, e)}
                    >
                      <ShoppingCart className="w-4 h-4 mr-1" />
                      Thêm vào giỏ
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>

        {/* Right Arrow Button */}
        <button
          onClick={() => handleScroll('right')}
          className="glide__arrow--override glide__arrow--right absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white border border-gray-300 rounded-full p-2 hover:bg-gray-100 transition-colors shadow-md hover:shadow-lg"
          aria-label="Next products"
        >
          <ChevronRight size={20} className="text-gray-700" />
        </button>
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
