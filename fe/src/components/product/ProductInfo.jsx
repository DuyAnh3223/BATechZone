import { Badge } from "@/components/ui/badge";

const ProductInfo = ({ product, currentPrice, basePrice, selectedVariant, discountInfo }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const { isDiscountActive = false, discountPercent = 0, discountPrice = 0, originalPrice = 0 } = discountInfo || {};
  const savings = originalPrice - discountPrice;

  return (
    <div>
      <h1 className="text-xl font-bold mb-2 text-gray-900">
        {product.product_name}
      </h1>
      
      <div className="flex items-center gap-2 mb-3">
        <Badge variant="secondary" className="text-xs px-2 py-0.5">
          Danh mục: {product.category_name || 'Chưa phân loại'}
        </Badge>
      </div>

      {/* Price Display */}
      <div className="mb-3">
        {isDiscountActive ? (
          <div className="bg-gradient-to-r from-red-50 to-orange-50 p-3 rounded-lg border-2 border-red-200">
            <div className="mb-1">
              <span className="text-xs text-gray-600 font-medium">Giá khuyến mãi:</span>
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-2xl font-bold text-red-600">
                {formatPrice(discountPrice)}
              </span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(originalPrice)}
              </span>
              <Badge className="bg-red-500 hover:bg-red-600 text-white font-bold px-2 py-0.5 text-xs">
                Tiết kiệm {formatPrice(savings)}
              </Badge>
            </div>
          </div>
        ) : (
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-bold text-red-600">
              {formatPrice(currentPrice)}
            </span>
            {selectedVariant && basePrice && basePrice !== selectedVariant.price && (
              <span className="text-lg text-gray-400 line-through">
                {formatPrice(basePrice)}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductInfo;
