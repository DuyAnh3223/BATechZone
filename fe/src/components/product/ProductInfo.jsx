import { Badge } from "@/components/ui/badge";

const ProductInfo = ({ product, currentPrice, basePrice, selectedVariant }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-3 text-gray-900">
        {product.product_name}
      </h1>
      
      <div className="flex items-center gap-2 mb-4">
        <Badge variant="secondary" className="text-sm px-3 py-1">
          Danh mục: {product.category_name || 'Chưa phân loại'}
        </Badge>
      </div>

      {/* Price Display */}
      <div className="mb-4">
        <div className="flex items-baseline gap-4">
          <span className="text-4xl font-bold text-red-600">
            {formatPrice(currentPrice)}
          </span>
          {selectedVariant && basePrice && basePrice !== selectedVariant.price && (
            <span className="text-xl text-gray-400 line-through">
              {formatPrice(basePrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
