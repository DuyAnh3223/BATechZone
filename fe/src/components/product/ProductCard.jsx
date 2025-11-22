import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Package } from 'lucide-react';
import { toast } from 'sonner';
import { useCartStore } from '@/stores/useCartStore';
import { useCartItemStore } from '@/stores/useCartItemStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { useVariantStore } from '@/stores/useVariantStore';
import { useState, useEffect } from 'react';

const ProductCard = ({ product }) => {
  const { getOrCreateCart } = useCartStore();
  const { addToCart } = useCartItemStore();
  const { user } = useAuthStore();
  const { fetchVariantsByProductId } = useVariantStore();
  const [variantImages, setVariantImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  // Map data từ API format
  const productName = product.product_name || product.name;
  const categoryName = product.category_name || product.category;
  // Lấy giá từ default variant hoặc variant đầu tiên (vì product không còn base_price)
  const price = product.default_variant_price || product.min_variant_price || product.price || 0;
  const imageUrl = product.image_url || product.image || 'https://via.placeholder.com/300';
  const productId = product.product_id || product.id;
  const isActive = product.is_active !== undefined ? product.is_active : true;
  const isFeatured = product.is_featured || false;

  // Fetch variant images when component mounts
  useEffect(() => {
    const loadVariantImages = async () => {
      try {
        setLoadingImages(true);
        const variantsResponse = await fetchVariantsByProductId(productId);
        const variants = variantsResponse?.data || variantsResponse || [];
        
        if (variants && variants.length > 0) {
          const firstVariant = variants[0];
          // Try to get images from variant - if not available, fallback to product image
          if (firstVariant.variant_id) {
            // Note: variant images are not loaded here, just setting empty array
            // Images will be fetched only when user views the product detail
            setVariantImages([]);
          }
        }
      } catch (error) {
        console.error('Error loading variant images:', error);
      } finally {
        setLoadingImages(false);
      }
    };

    loadVariantImages();
  }, [productId, fetchVariantsByProductId]);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isActive) {
      toast.error('Sản phẩm hiện đang hết hàng');
      return;
    }

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

      // // Kiểm tra tồn kho
      // if (!defaultVariant.is_active || (defaultVariant.stock_quantity ?? 0) <= 0) {
      //   toast.error('Biến thể này hiện đang hết hàng');
      //   return;
      // }

      // 2. Lấy hoặc tạo giỏ hàng
      let cartData = {};
      if (user) {
        cartData.userId = user.user_id;
      } else {
        // Guest cart - lấy từ localStorage hoặc tạo mới
        let sessionId = localStorage.getItem('guest_session_id');
        if (!sessionId) {
          sessionId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          localStorage.setItem('guest_session_id', sessionId);
        }
        cartData.sessionId = sessionId;
      }

      const cartResponse = await getOrCreateCart(cartData);
      const cart = cartResponse?.data || cartResponse;
      
      console.log('Cart response:', cartResponse);
      console.log('Cart data:', cart);

      const cartId = cart?.cart_id || cart?.cartId;
      if (!cartId) {
        console.error('Invalid cart structure:', cart);
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

  return (
    <div className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:border-blue-200 transition-all duration-300 flex flex-col h-full">
      {/* Image Container */}
      <Link to={`/product/${productId}`} className="relative block overflow-hidden bg-gray-100">
        <div className="relative aspect-square w-full">
          <img
            src={imageUrl}
            alt={productName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300';
            }}
          />
          
          {/* Featured Badge */}
          {isFeatured && (
            <div className="absolute top-3 left-3 z-10">
              <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold px-3 py-1 text-xs shadow-lg rounded-md border-0">
                ⭐ Nổi bật
              </Badge>
            </div>
          )}
          
          {/* Stock Status Badge */}
          <div className="absolute top-3 right-3 z-10">
            {isActive ? (
              <Badge className="bg-green-500 text-white font-medium px-3 py-1 text-xs shadow-lg rounded-md border-0">
                Còn hàng
              </Badge>
            ) : (
              <Badge className="bg-gray-500 text-white font-medium px-3 py-1 text-xs shadow-lg rounded-md border-0">
                Hết hàng
              </Badge>
            )}
          </div>
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
        </div>
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Category */}
        {categoryName && (
          <div className="mb-2">
            <span className="text-xs text-gray-500 font-medium">
              {categoryName}
            </span>
          </div>
        )}

        {/* Product Name */}
        <Link to={`/product/${productId}`} className="flex-1">
          <h3 className="font-semibold text-base mb-3 text-gray-900 group-hover:text-blue-600 line-clamp-2 min-h-[3rem] transition-colors duration-200">
            {productName}
          </h3>
        </Link>

        {/* Price Section */}
        <div className="mb-4">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-2xl font-bold text-red-600 tracking-tight">
              {formatPrice(price)}
            </span>
          </div>
        </div>

        {/* Add to Cart Button */}
        <Button 
          className={`w-full mt-auto font-semibold py-2.5 rounded-lg shadow-sm transition-all duration-200 ${
            isActive 
              ? 'hover:shadow-md' 
              : 'opacity-60 cursor-not-allowed'
          }`}
          style={{
            backgroundColor: isActive ? '#2563eb' : '#9ca3af',
            color: '#ffffff'
          }}
          onMouseEnter={(e) => {
            if (isActive) {
              e.currentTarget.style.backgroundColor = '#1d4ed8';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }
          }}
          onMouseLeave={(e) => {
            if (isActive) {
              e.currentTarget.style.backgroundColor = '#2563eb';
              e.currentTarget.style.transform = 'translateY(0)';
            }
          }}
          onClick={handleAddToCart}
          disabled={!isActive}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          {isActive ? 'Thêm vào giỏ' : 'Hết hàng'}
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;