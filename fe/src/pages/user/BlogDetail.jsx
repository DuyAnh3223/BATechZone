import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import mockPosts from '@/mock/posts';
import DOMPurify from 'dompurify';

const formatDate = (dateString) => {
  if (!dateString) return '-';
  try {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (e) {
    return dateString;
  }
};

const BlogDetail = () => {
  const { id } = useParams();
  const postId = parseInt(id, 10);
  const post = mockPosts.find(p => p.id === postId);

  const cleanHtml = useMemo(() => {
    if (!post) return '';
    return DOMPurify.sanitize(post.content_html || post.content_text || '');
  }, [post]);

  if (!post) {
    return (
      <div className="py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-semibold mb-4">Không tìm thấy bài viết</h2>
          <p className="text-gray-600 mb-6">Bài viết bạn tìm không tồn tại hoặc đã bị xóa.</p>
          <Link to="/blog">
            <Button variant="default">Quay lại danh sách</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main article */}
        <main className="md:col-span-2 bg-white p-6 rounded-md shadow-sm">
          {post.image && (
            <img src={post.image} alt={post.title} className="w-full h-64 object-cover rounded-md mb-6" />
          )}

          <div className="text-sm text-gray-500 mb-2">{formatDate(post.date)} • {post.readTime}</div>
          <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
          <div className="text-gray-700 mb-6">{post.excerpt}</div>

          <div className="prose max-w-none text-gray-800" dangerouslySetInnerHTML={{ __html: cleanHtml }} />

          <div className="mt-8 flex gap-2">
            <Link to="/blog">
              <Button variant="outline">Quay lại</Button>
            </Link>
            <Button variant="default">Chia sẻ</Button>
          </div>
        </main>

        {/* Right sidebar */}
        <aside className="md:col-span-1 space-y-6">
          {/* Nội dung bài viết (tóm tắt / plain text) */}
          <div className="p-4 border rounded-md bg-white">
            <h3 className="text-lg font-semibold mb-2">Nội dung bài viết</h3>
            <div className="text-sm text-gray-700 leading-relaxed">
              {post.content_text || post.excerpt}
            </div>
          </div>

          {/* Tin mới nhất */}
          <div className="p-4 border rounded-md bg-white">
            <h3 className="text-lg font-semibold mb-3">Tin mới nhất</h3>
            <ul className="space-y-3">
              {mockPosts
                .slice()
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .filter(p => p.id !== post.id)
                .slice(0, 5)
                .map((p) => (
                  <li key={p.id} className="flex items-start gap-3">
                    <Link to={`/blog/${p.id}`} className="w-16 h-12 block overflow-hidden rounded">
                      <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                    </Link>
                    <div>
                      <Link to={`/blog/${p.id}`} className="text-sm font-medium hover:text-blue-600">
                        {p.title}
                      </Link>
                      <div className="text-xs text-gray-500">{new Date(p.date).toLocaleDateString('vi-VN')}</div>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default BlogDetail;
