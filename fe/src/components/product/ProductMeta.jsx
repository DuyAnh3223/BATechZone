const ProductMeta = ({ product }) => {
  return (
    <div className="space-y-3 text-sm">
      <div className="flex items-center gap-2">
        <span className="text-gray-500 min-w-[120px]">Mã sản phẩm:</span>
        <span className="font-medium">#{product.product_id}</span>
      </div>
      {product.slug && (
        <div className="flex items-center gap-2">
          <span className="text-gray-500 min-w-[120px]">Slug:</span>
          <span className="font-medium">{product.slug}</span>
        </div>
      )}
      <div className="flex items-center gap-2">
        <span className="text-gray-500 min-w-[120px]">Lượt xem:</span>
        <span className="font-medium">{product.view_count || 0}</span>
      </div>
    </div>
  );
};

export default ProductMeta;
