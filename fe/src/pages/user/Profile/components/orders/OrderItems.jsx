const OrderItems = ({ items, loading, formatPrice }) => {
  return (
    <div>
      <h3 className="font-semibold text-lg mb-3">Sản phẩm</h3>
      {loading ? (
        <div className="text-center py-4 text-gray-500 text-base">
          Đang tải chi tiết...
        </div>
      ) : !items || items.length === 0 ? (
        <div className="text-center py-4 text-gray-500 text-base">
          Không có sản phẩm
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="flex gap-4 items-start p-4 border rounded-lg">
              {/* Product Image */}
              <div className="flex-shrink-0">
                <img
                  src={
                    item.imageUrl 
                      ? `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}${item.imageUrl}`
                      : '/placeholder-product.png'
                  }
                  alt={item.productName || item.product_name}
                  className="w-20 h-20 object-cover rounded-lg border-2 border-gray-200"
                  onError={(e) => {
                    e.target.src = '/placeholder-product.png';
                  }}
                />
              </div>
              
              {/* Product Info */}
              <div className="flex-1">
                <p className="font-medium text-base">{item.productName || item.product_name}</p>
                {(item.variantName || item.variant_name) && (
                  <p className="text-base text-gray-500">{item.variantName || item.variant_name}</p>
                )}
                {item.sku && (
                  <p className="text-base text-gray-400">SKU: {item.sku}</p>
                )}
              </div>
              
              {/* Price Info */}
              <div className="text-right">
                <p className="text-base text-gray-500">x{item.quantity}</p>
                <p className="font-semibold text-lg">
                  {formatPrice((item.unitPrice || item.unit_price || item.price) * item.quantity)}
                </p>
                {(item.discountAmount || item.discount_amount || 0) > 0 && (
                  <p className="text-sm text-green-600">
                    -{formatPrice(item.discountAmount || item.discount_amount)}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderItems;
