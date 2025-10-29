import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data
const mockPosts = [
  {
    id: 1,
    title: "RTX 4000 Series: Bước đột phá trong công nghệ ray-tracing",
    excerpt:
      "NVIDIA giới thiệu dòng card đồ họa GeForce RTX 4000 Series với kiến trúc Ada Lovelace mới...",
    image: "https://via.placeholder.com/600x400",
    category: "Hardware News",
    date: "2025-10-28",
    readTime: "5 phút",
  },
  {
    id: 2,
    title: "So sánh chi tiết Intel Core i9 14900K vs AMD Ryzen 9 7950X3D",
    excerpt:
      "Cuộc chiến CPU high-end giữa Intel và AMD tiếp tục được đẩy lên cao trào với những con chip mới nhất...",
    image: "https://via.placeholder.com/600x400",
    category: "Reviews",
    date: "2025-10-27",
    readTime: "8 phút",
  },
  {
    id: 3,
    title: "Hướng dẫn build PC Gaming giá rẻ năm 2025",
    excerpt:
      "Cùng PC Hardware Store tìm hiểu cách build một cấu hình PC Gaming hợp lý với ngân sách dưới 15 triệu...",
    image: "https://via.placeholder.com/600x400",
    category: "Guides",
    date: "2025-10-26",
    readTime: "10 phút",
  },
  // Add more posts...
];

const categories = [
  { value: "all", label: "Tất cả" },
  { value: "hardware-news", label: "Tin công nghệ" },
  { value: "reviews", label: "Đánh giá" },
  { value: "guides", label: "Hướng dẫn" },
  { value: "tips", label: "Mẹo hay" },
];

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  const filteredPosts =
    selectedCategory === "all"
      ? mockPosts
      : mockPosts.filter((post) =>
          post.category.toLowerCase().includes(selectedCategory)
        );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Tin tức công nghệ</h1>
        <p className="text-gray-600">
          Cập nhật tin tức, đánh giá và hướng dẫn mới nhất về công nghệ
        </p>
      </div>

      {/* Category Filter */}
      <div className="mb-8">
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Chọn danh mục" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Blog Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <Card key={post.id}>
            <CardHeader className="p-0">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                <span>{formatDate(post.date)}</span>
                <span>•</span>
                <span>{post.readTime}</span>
              </div>
              <CardTitle className="mb-2 line-clamp-2">
                <Link
                  to={`/blog/${post.id}`}
                  className="hover:text-blue-600 transition-colors"
                >
                  {post.title}
                </Link>
              </CardTitle>
              <CardDescription className="line-clamp-3">
                {post.excerpt}
              </CardDescription>
            </CardContent>
            <CardFooter className="p-6 pt-0">
              <Button variant="outline" asChild className="w-full">
                <Link to={`/blog/${post.id}`}>Đọc thêm</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-8 flex justify-center">
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button variant="outline" disabled>
            {currentPage}
          </Button>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={
              currentPage === Math.ceil(filteredPosts.length / postsPerPage)
            }
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Blog;
