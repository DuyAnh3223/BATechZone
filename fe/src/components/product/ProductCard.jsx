import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ShoppingCart, Package, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useCartStore } from '@/stores/useCartStore';
import { useCartItemStore } from '@/stores/useCartItemStore';
import { useUserAuthStore } from '@/stores/useUserAuthStore';
import { variantService } from '@/services/variantService';
import { useState, useEffect } from 'react';

// Base URL for serving uploads
const BASE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const toAbsoluteUrl = (url) => {
  if (!url) return url;
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith('/uploads')) return `${BASE_API_URL}${url}`;
  return url;
};

const ProductCard = ({ product }) => {
  const { getOrCreateCart } = useCartStore();
  const { addToCart } = useCartItemStore();
  const { user } = useUserAuthStore();
  // Use local state instead of global store to avoid conflicts
  const [variantImages, setVariantImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [variants, setVariants] = useState([]);
  const [successDialog, setSuccessDialog] = useState({ open: false, message: '' });
  const [defaultVariant, setDefaultVariant] = useState(null);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  // Map data từ API format
  const productName = product.product_name || product.name;
  const categoryName = product.category_name || product.category;
  // Lấy giá từ default variant
  const price = defaultVariant?.price || 0;
  const imageUrl = product.image_url || product.image || null;
  const productId = product.product_id || product.id;
  
  // Check stock: prioritize backend total_stock, fallback to variants check
  const hasStock = product.total_stock !== undefined
    ? product.total_stock > 0
    : (variants.length > 0 
        ? variants.some(v => v.is_active && (v.stock_quantity > 0 || v.stockQuantity > 0))
        : (product.is_active !== undefined ? product.is_active : true));
  
  const isActive = hasStock;
  const isFeatured = product.is_featured || false;

  // Get primary image from variantImages, or first image, or fallback to product imageUrl
  const getPrimaryImage = () => {
    if (variantImages && variantImages.length > 0) {
      const primary = variantImages.find(img => img.is_primary);
      return toAbsoluteUrl(primary?.image_url || variantImages[0]?.image_url);
    }
    return imageUrl ? toAbsoluteUrl(imageUrl) : null;
  };

  const displayImageUrl = getPrimaryImage();

  // Fetch variant images when component mounts
  useEffect(() => {
    const loadVariantImages = async () => {
      try {
        setLoadingImages(true);
        // Call API directly instead of using global store
        const variantsResponse = await variantService.getVariantsByProductId(productId);
        const loadedVariants = variantsResponse?.data || variantsResponse || [];
        
        if (variants && variants.length > 0) {
          const firstVariant = variants.find(v => v.is_default) || variants[0];
          setDefaultVariant(firstVariant); // Lưu default variant để lấy giá
          
          if (firstVariant?.variant_id) {
            // Fetch images for the first variant
            try {
              const imagesResponse = await variantService.getVariantImages(firstVariant.variant_id);
              const images = imagesResponse?.data || imagesResponse || [];
              setVariantImages(images);
            } catch (error) {
              console.error('Error loading variant images:', error);
              setVariantImages([]);
            }
          }
        }
      } catch (error) {
        console.error('Error loading variants:', error);
      } finally {
        setLoadingImages(false);
      }
    };

    loadVariantImages();
  }, [productId]);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isActive) {
      toast.error('Sản phẩm hiện đang hết hàng');
      return;
    }
    try {
      // 1. Lấy variants của sản phẩm để tìm default variant - call API directly
      const variantsResponse = await variantService.getVariantsByProductId(productId);
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

      setSuccessDialog({ 
        open: true, 
        message: 'Đã thêm sản phẩm vào giỏ hàng thành công!' 
      });
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
          {displayImageUrl ? (
            <img
              src={displayImageUrl}
              alt={productName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                e.target.style.display = 'none';
                if (e.target.nextElementSibling) {
                  e.target.nextElementSibling.style.display = 'flex';
                }
              }}
            />
          ) : null}
          {/* Placeholder when no image */}
          <div 
            className={`w-full h-full bg-gray-200 flex items-center justify-center ${displayImageUrl ? 'hidden' : ''}`}
          >
            <span className="text-gray-400 text-sm">Không có ảnh</span>
          </div>
          
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

export default ProductCard;