import ProductCard from "@/components/product/ProductCard";

const ProductGrid = ({ products, loading }) => {
  if (loading) {
    return <div className="text-center py-12">Đang tải sản phẩm...</div>;
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        Không tìm thấy sản phẩm nào
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.product_id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
