import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Package } from 'lucide-react';
import { toast } from 'sonner';

const ProductCard = ({ product }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  // Map data từ API format
  const productName = product.product_name || product.name;
  const categoryName = product.category_name || product.category;
  const price = product.base_price || product.price || 0;
  const imageUrl = product.image_url || product.image || 'https://via.placeholder.com/300';
  const productId = product.product_id || product.id;
  const isActive = product.is_active !== undefined ? product.is_active : true;
  const isFeatured = product.is_featured || false;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isActive) {
      toast.error('Sản phẩm hiện đang hết hàng');
      return;
    }
    
    // TODO: Implement add to cart functionality
    toast.success('Đã thêm sản phẩm vào giỏ hàng');
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