import React from 'react';
import { Link } from 'react-router-dom';
import { translatePostStatus, translatePostType } from '../../utils/statusTranslations';

const posts = [
  {
    post_id: 1,
    user_id: 1,
    title: 'Hướng dẫn build PC gaming 2024',
    slug: 'huong-dan-build-pc-gaming-2024',
    content: 'Nội dung chi tiết về cách build PC gaming...',
    excerpt: 'Cách build PC chơi game tối ưu nhất 2024...',
    featured_image: '',
    post_type: 'guide',
    status: 'published',
    view_count: 260,
    like_count: 45,
    comment_count: 12,
    published_at: '2024-05-01',
    created_at: '2024-04-22',
    updated_at: '2024-04-28',
  },
  {
    post_id: 2,
    user_id: 2,
    title: 'Top 5 CPU tốt nhất năm 2024',
    slug: 'top-5-cpu-tot-nhat-2024',
    content: 'Danh sách các CPU đáng mua nhất...',
    excerpt: 'Top CPU tốt dành cho game và đồ họa...',
    featured_image: '',
    post_type: 'blog',
    status: 'published',
    view_count: 170,
    like_count: 29,
    comment_count: 8,
    published_at: '2024-05-10',
    created_at: '2024-04-27',
    updated_at: '2024-04-30',
  },
];

const typeClass = type =>
  type === 'guide' ? 'bg-blue-100 text-blue-700'
    : type === 'review' ? 'bg-yellow-100 text-yellow-700'
    : type === 'news' ? 'bg-red-100 text-red-700'
    : 'bg-green-100 text-green-700';

const statusClass = status =>
  status === 'published' ? 'bg-green-100 text-green-700'
    : status === 'draft' ? 'bg-yellow-100 text-yellow-700'
    : 'bg-gray-100 text-gray-500';

const AdminPost = () => (
  <section>
    <div className="mb-6 flex items-center justify-between">
      <h1 className="text-2xl font-bold text-gray-800">Quản lý bài viết (Posts)</h1>
      <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 text-white px-6 py-2 rounded-lg font-semibold shadow transition">+ Thêm bài viết</button>
    </div>
    <div className="overflow-x-auto rounded-xl bg-white shadow pb-2">
      <table className="min-w-[1300px] w-full text-left">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 font-semibold text-gray-600">ID</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Người dùng</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Tiêu đề</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Slug</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Loại</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Trạng thái</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Lượt xem</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Thích</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Bình luận</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Ngày đăng</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Hành động</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {posts.map(post => (
            <tr key={post.post_id} className="hover:bg-blue-50 transition">
              <td className="px-4 py-3 font-medium text-gray-800">{post.post_id}</td>
              <td className="px-4 py-3">{post.user_id}</td>
              <td className="px-4 py-3 font-semibold">{post.title}</td>
              <td className="px-4 py-3">{post.slug}</td>
              <td className="px-4 py-3"><span className={`px-3 py-0.5 rounded-full text-xs font-semibold ${typeClass(post.post_type)}`}>{translatePostType(post.post_type)}</span></td>
              <td className="px-4 py-3"><span className={`px-3 py-0.5 rounded-full text-xs font-semibold ${statusClass(post.status)}`}>{translatePostStatus(post.status)}</span></td>
              <td className="px-4 py-3 text-center">{post.view_count}</td>
              <td className="px-4 py-3 text-center">{post.like_count}</td>
              <td className="px-4 py-3 text-center">{post.comment_count}</td>
              <td className="px-4 py-3">{post.published_at || '-'}</td>
              <td className="px-4 py-3 flex gap-2 whitespace-nowrap">
                <Link to={`/admin/posts/${post.post_id}`} className="px-3 py-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-600 rounded text-xs font-medium">Chi tiết</Link>
                <button className="px-3 py-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-600 rounded text-xs font-medium">Sửa</button>
                <button className="px-3 py-1 bg-pink-100 hover:bg-pink-200 text-pink-600 rounded text-xs font-medium">Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);

export default AdminPost;
