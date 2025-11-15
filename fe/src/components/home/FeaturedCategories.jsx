import { Link } from 'react-router-dom';

const FeaturedCategories = ({ categories, loading }) => {
  return (
    <section className="max-w-7xl mx-auto px-4">
      <h2 className="text-2xl font-bold mb-6">Danh mục nổi bật</h2>
      {loading ? (
        <div className="text-center py-8">Đang tải danh mục...</div>
      ) : categories.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.slice(0, 8).map((category) => (
            <Link
              key={category.category_id}
              to={`/category/${category.category_id}`}
              className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow"
            >
              <img
                src={category.image_url ? `http://localhost:5001${category.image_url}` : 'https://via.placeholder.com/200?text=No+Image'}
                alt={category.category_name}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/200?text=No+Image';
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <h3 className="text-white font-semibold">{category.category_name}</h3>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">Chưa có danh mục nào</div>
      )}
    </section>
  );
};

export default FeaturedCategories;
