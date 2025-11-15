const StockStatus = ({ isAvailable, currentStock, selectedVariant }) => {
  return (
    <div className="mb-4">
      {isAvailable ? (
        <div className="space-y-1">
          <p className="text-green-600 font-medium flex items-center gap-2">
            <span className="w-2 h-2 bg-green-600 rounded-full"></span>
            {selectedVariant ? 'Biến thể còn hàng' : 'Sản phẩm còn hàng'}
          </p>
          {currentStock !== null && (
            <p className="text-sm text-gray-600">
              Còn lại: <span className="font-medium">{currentStock}</span> sản phẩm
            </p>
          )}
        </div>
      ) : (
        <p className="text-gray-500 font-medium flex items-center gap-2">
          <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
          {selectedVariant ? 'Biến thể đã hết hàng' : 'Sản phẩm đã hết hàng'}
        </p>
      )}
    </div>
  );
};

export default StockStatus;
