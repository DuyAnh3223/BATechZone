import ProductCard from '@/components/product/ProductCard';

const FeaturedProducts = ({ products, loading }) => {
  return (
    <section className="max-w-7xl mx-auto px-4">
      <h2 className="text-2xl font-bold mb-6">Sản phẩm nổi bật</h2>
      {loading ? (
        <div className="text-center py-8">Đang tải sản phẩm...</div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.product_id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">Chưa có sản phẩm nổi bật nào</div>
      )}
    </section>
  );
};

export default FeaturedProducts;
