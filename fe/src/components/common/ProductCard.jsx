import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const ProductCard = ({ product }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  // Map data từ API format hoặc mock format
  const productName = product.product_name || product.name;
  const categoryName = product.category_name || product.category;
  const price = product.base_price || product.price || 0;
  const imageUrl = product.image_url || product.image || 'https://via.placeholder.com/300';
  const productId = product.product_id || product.id;
  
  // Tính discount nếu có compare_at_price từ variant (sẽ xử lý sau)
  // Tạm thời dùng discount từ product nếu có
  const discount = product.discount || 0;
  const finalPrice = discount > 0 ? price * (1 - discount / 100) : price;
  const originalPrice = discount > 0 ? price : null;

  return (
    <div className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:border-blue-200 transition-all duration-300 flex flex-col h-full">
      {/* Image Container with Overlay */}
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
          {/* Discount Badge */}
          {discount > 0 && (
            <div className="absolute top-3 left-3 z-10">
              <Badge className="bg-red-500 hover:bg-red-600 text-white font-bold px-3 py-1 text-xs shadow-lg rounded-md border-0">
                -{discount}%
              </Badge>
            </div>
          )}
          {/* Category Badge */}
          <div className="absolute top-3 right-3 z-10">
            <Badge variant="secondary" className="text-xs bg-white/95 backdrop-blur-sm text-gray-700 font-medium shadow-sm border-0 rounded-md px-2.5 py-1">
              {categoryName || 'Chưa phân loại'}
            </Badge>
          </div>
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
        </div>
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
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
              {formatPrice(finalPrice)}
            </span>
            {discount > 0 && originalPrice && (
              <span className="text-sm text-gray-400 line-through font-medium">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>
        </div>

        {/* Button */}
        <Button 
          className="w-full mt-auto font-semibold py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
          style={{
            backgroundColor: '#2563eb',
            color: '#ffffff'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#1d4ed8';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#2563eb';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
          onClick={(e) => {
            e.preventDefault();
            // Handle add to cart - sẽ xử lý sau
          }}
        >
          Thêm vào giỏ
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;