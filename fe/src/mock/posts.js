const mockPosts = [
  {
    id: 1,
    title: "RTX 4000 Series: Bước đột phá trong công nghệ ray-tracing",
    slug: "rtx-4000-series-buoc-dot-pha-trong-ray-tracing",
    excerpt:
      "NVIDIA giới thiệu dòng card đồ họa GeForce RTX 4000 Series với kiến trúc Ada Lovelace mới...",
    image: "/uploads/blog/rtx4000.jpg",
    category: "Tin công nghệ",
    date: "2025-10-28",
    readTime: "5 phút",
    content_html: `
      <p>NVIDIA vừa giới thiệu dòng GeForce RTX 4000 Series với nhiều cải tiến về kiến trúc Ada Lovelace, cho hiệu năng ray-tracing vượt trội và khả năng xử lý AI nâng cao.</p>
      <h3>Điểm nổi bật</h3>
      <ul>
        <li>Tốc độ dò tia (ray-tracing) được cải thiện 2x so với thế hệ trước</li>
        <li>Bộ nhớ lớn hơn, băng thông cao hơn</li>
        <li>Tối ưu cho game và ứng dụng đồ họa chuyên sâu</li>
      </ul>
      <p>Đây là cột mốc quan trọng cho ngành công nghiệp GPU và sẽ tạo áp lực cạnh tranh lên AMD trong mảng chơi game cao cấp.</p>
    `,
    content_text: "NVIDIA giới thiệu dòng GeForce RTX 4000 Series...",
    author_id: 1,
    article_id: 1,
    status: 'published',
    featured_image_id: null,
    view_count: 1234,
    created_at: "2025-10-28 10:00:00",
    updated_at: "2025-10-28 10:00:00"
  },
  {
    id: 2,
    title: "So sánh Intel Core i9-14900K vs AMD Ryzen 9 7950X3D",
    slug: "so-sanh-intel-core-i9-14900k-vs-amd-ryzen-9-7950x3d",
    excerpt:
      "Cuộc chiến CPU high-end giữa Intel và AMD tiếp tục với những con chip mới nhất...",
    image: "/uploads/blog/cpu-showdown.jpg",
    category: "Đánh giá",
    date: "2025-10-27",
    readTime: "8 phút",
    content_html: `
      <p>Bài viết so sánh chi tiết hiệu năng đơn nhân và đa nhân giữa Intel Core i9-14900K và AMD Ryzen 9 7950X3D.</p>
      <h3>Hiệu năng</h3>
      <p>Trong nhiều tác vụ, Ryzen 9 7950X3D có lợi thế về đa luồng, trong khi Intel giữ lợi thế đơn nhân.</p>
    `,
    content_text: "So sánh hiệu năng Intel vs AMD...",
    author_id: 2,
    article_id: 2,
    status: 'published',
    featured_image_id: null,
    view_count: 980,
    created_at: "2025-10-27 09:00:00",
    updated_at: "2025-10-27 09:00:00"
  },
  {
    id: 3,
    title: "Hướng dẫn build PC Gaming giá rẻ năm 2025",
    slug: "huong-dan-build-pc-gaming-2025",
    excerpt:
      "Cùng PC Hardware Store tìm hiểu cách build một cấu hình PC Gaming hợp lý với ngân sách dưới 15 triệu...",
    image: "/uploads/blog/build-pc-2025.jpg",
    category: "Hướng dẫn",
    date: "2025-10-26",
    readTime: "10 phút",
    content_html: `
      <p>Trong hướng dẫn này, chúng tôi chọn những linh kiện có hiệu năng/giá tốt nhất ở phân khúc giá rẻ.</p>
      <ol>
        <li>CPU: lựa chọn tiết kiệm nhưng đủ mạnh</li>
        <li>GPU: ưu tiên card có hiệu năng chơi game ở 1080p</li>
      </ol>
    `,
    content_text: "Hướng dẫn build PC Gaming...",
    author_id: 1,
    article_id: 3,
    status: 'published',
    featured_image_id: null,
    view_count: 450,
    created_at: "2025-10-26 08:00:00",
    updated_at: "2025-10-26 08:00:00"
  }
];

export default mockPosts;
