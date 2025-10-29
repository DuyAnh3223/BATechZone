const ProductCard = ({ product }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <span className="text-sm text-gray-500">{product.category}</span>
        <h3 className="font-semibold text-lg mb-2 hover:text-blue-600">
          {product.name}
        </h3>
        <div className="flex items-baseline mb-2">
          <span className="text-xl font-bold text-red-600">
            {formatPrice(product.price * (1 - product.discount / 100))}
          </span>
          {product.discount > 0 && (
            <>
              <span className="ml-2 text-sm text-gray-500 line-through">
                {formatPrice(product.price)}
              </span>
              <span className="ml-2 text-sm text-red-600">
                -{product.discount}%
              </span>
            </>
          )}
        </div>
        <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Thêm vào giỏ
        </button>
      </div>
    </div>
  );
};

export default ProductCard;