import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import mockPosts from '@/mock/posts';

const categories = [
  { value: "all", label: "Tất cả" },
  { value: "tin-cong-nghe", label: "Tin công nghệ" },
  { value: "danh-gia", label: "Đánh giá" },
  { value: "huong-dan", label: "Hướng dẫn" },
  { value: "meo-hay", label: "Mẹo hay" },
];

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  const filteredPosts =
    selectedCategory === "all"
      ? mockPosts
      : mockPosts.filter(
          (post) =>
            post.category &&
            post.category.toLowerCase().includes(selectedCategory.replace(/-/g, " "))
        );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Pagination slice (simple client-side)
  const startIndex = (currentPage - 1) * postsPerPage;
  const pagedPosts = filteredPosts.slice(startIndex, startIndex + postsPerPage);

  return (
    <div className="py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-1">Tin tức công nghệ</h1>
        <p className="text-gray-600">Cập nhật tin tức, đánh giá và hướng dẫn mới nhất</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main list */}
        <div className="md:col-span-2">
          {pagedPosts.map((post) => (
            <article
              key={post.id}
              className="flex flex-col md:flex-row gap-4 mb-6 pb-6 border-b border-gray-100 hover:bg-gray-50 p-3 rounded-md transition"
            >
              <Link to={`/blog/${post.id}`} className="block md:w-72 w-full flex-shrink-0">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-44 md:h-36 object-cover rounded-md"
                />
              </Link>

              <div className="flex-1">
                <div className="text-sm text-gray-500 mb-2 flex items-center gap-2">
                  <span>{formatDate(post.date)}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                  <span className="mx-2">•</span>
                  <span className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-700">{post.category}</span>
                </div>

                <h2 className="text-xl font-semibold mb-2">
                  <Link to={`/blog/${post.id}`} className="hover:text-blue-600 transition-colors">
                    {post.title}
                  </Link>
                </h2>

                <p className="text-gray-700 mb-3 line-clamp-3">{post.excerpt}</p>

                <div className="flex items-center gap-3">
                  <Button variant="outline" asChild>
                    <Link to={`/blog/${post.id}`} className="text-sm">Đọc tiếp</Link>
                  </Button>
                </div>
              </div>
            </article>
          ))}

          {/* Pagination */}
          <div className="mt-6 flex justify-center">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <div className="flex items-center px-3 border rounded-md">{currentPage}</div>
              <Button
                variant="outline"
                onClick={() =>
                  setCurrentPage(
                    Math.min(
                      Math.ceil(filteredPosts.length / postsPerPage) || 1,
                      currentPage + 1
                    )
                  )
                }
                disabled={currentPage >= Math.ceil(filteredPosts.length / postsPerPage)}
              >
                Next
              </Button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="md:col-span-1 space-y-6">
          <div className="p-4 border rounded-md">
            <h3 className="text-lg font-semibold mb-3">Danh mục</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              {categories.map((c) => (
                <li key={c.value}>
                  <button
                    onClick={() => setSelectedCategory(c.value)}
                    className={`text-left w-full ${selectedCategory === c.value ? 'text-blue-600 font-medium' : 'hover:text-blue-600'}`}
                  >
                    {c.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 border rounded-md">
            <h3 className="text-lg font-semibold mb-3">Bài viết mới</h3>
            <ul className="space-y-3 text-sm">
              {mockPosts.slice(0, 5).map((p) => (
                <li key={p.id} className="flex items-start gap-3">
                  <img src={p.image} alt={p.title} className="w-16 h-12 object-cover rounded" />
                  <div>
                    <Link to={`/blog/${p.id}`} className="hover:text-blue-600 text-sm font-medium">
                      {p.title}
                    </Link>
                    <div className="text-xs text-gray-500">{p.readTime} • {new Date(p.date).toLocaleDateString('vi-VN')}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 border rounded-md text-sm text-gray-700">
            <h3 className="text-lg font-semibold mb-3">Đăng ký nhận tin</h3>
            <p className="text-sm text-gray-500 mb-3">Nhập email để nhận thông báo khi có bài viết mới.</p>
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-2">
              <input type="email" placeholder="Email của bạn" className="px-3 py-2 border rounded-md" />
              <Button type="submit" variant="default">Đăng ký</Button>
            </form>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Blog;
