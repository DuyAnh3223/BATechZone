import { Badge } from "@/components/ui/badge";

const ProductImage = ({ imageUrl, productName, isActive, isFeatured }) => {
  const productImage = imageUrl || 'https://via.placeholder.com/600';

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <img
        src={productImage}
        alt={productName}
        className="w-full aspect-square object-cover rounded-lg shadow-lg"
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/600';
        }}
      />
      {/* Status Badge */}
      <div className="absolute top-4 right-4">
        {isActive ? (
          <Badge className="bg-green-500 text-white font-medium px-4 py-2 text-sm shadow-lg">
            Còn hàng
          </Badge>
        ) : (
          <Badge className="bg-gray-500 text-white font-medium px-4 py-2 text-sm shadow-lg">
            Hết hàng
          </Badge>
        )}
      </div>
      {/* Featured Badge */}
      {isFeatured && (
        <div className="absolute top-4 left-4">
          <Badge className="bg-yellow-500 text-white font-bold px-4 py-2 text-sm shadow-lg">
            ⭐ Nổi bật
          </Badge>
        </div>
      )}
    </div>
  );
};

export default ProductImage;
