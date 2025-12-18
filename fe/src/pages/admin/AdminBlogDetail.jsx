import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const mockPost = {
  post_id: 1,
  user_id: 1,
  title: 'Hướng dẫn build PC gaming 2024',
  slug: 'huong-dan-build-pc-gaming-2024',
  content: 'Nội dung chi tiết về cách build PC gaming...',
  post_type: 'guide',
  status: 'published',
  view_count: 260,
  like_count: 45,
  comment_count: 12,
  published_at: '2024-05-01',
  created_at: '2024-04-22',
  updated_at: '2024-04-28',
};

const mockArticle = {
  article_id: 1,
  post_id: 1,
  category_id: 3,
  tags: 'build pc,gaming,hướng dẫn',
  meta_title: 'Hướng dẫn build PC chơi game 2024',
  meta_description: 'Cách build PC chơi game tối ưu nhất năm 2024',
  reading_time: 15,
  seo_keywords: 'build pc,pc gaming,huong dan',
};

const Tab = ({active, onClick, children}) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${active ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700 hover:bg-indigo-100 hover:text-indigo-700'}`}
  >
    {children}
  </button>
);

const Row = ({label, value}) => (
  <div>
    <div className="text-gray-500 text-sm">{label}</div>
    <div className="font-semibold break-words">{value || '-'}</div>
  </div>
);

const AdminPostDetail = () => {
  const { postId } = useParams();
  const [tab, setTab] = useState('post');

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Chi tiết bài viết #{postId}</h1>
          <div className="text-gray-500 text-sm">Quản lý Post · Article (SEO/Meta)</div>
        </div>
        <Link to="/admin/posts" className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm">← Quay lại danh sách</Link>
      </div>

      <div className="flex gap-2 mb-6">
        <Tab active={tab==='post'} onClick={()=>setTab('post')}>Post</Tab>
        <Tab active={tab==='article'} onClick={()=>setTab('article')}>Article</Tab>
      </div>

      {tab==='post' && (
        <div className="bg-white rounded-xl shadow p-5 grid md:grid-cols-2 gap-4">
          <Row label="Tiêu đề" value={mockPost.title} />
          <Row label="Slug" value={mockPost.slug} />
          <Row label="Loại" value={mockPost.post_type} />
          <Row label="Trạng thái" value={mockPost.status} />
          <Row label="Ngày đăng" value={mockPost.published_at} />
          <div className="md:col-span-2">
            <div className="text-gray-500 text-sm">Nội dung</div>
            <div className="whitespace-pre-wrap border rounded p-3 text-sm">{mockPost.content}</div>
          </div>
        </div>
      )}

      {tab==='article' && (
        <div className="bg-white rounded-xl shadow p-5 grid md:grid-cols-2 gap-4">
          <Row label="ID Danh mục" value={mockArticle.category_id} />
          <Row label="Thẻ" value={mockArticle.tags} />
          <Row label="Tiêu đề meta" value={mockArticle.meta_title} />
          <Row label="Thời gian đọc (phút)" value={mockArticle.reading_time} />
          <Row label="Từ khóa SEO" value={mockArticle.seo_keywords} />
          <div className="md:col-span-2">
            <div className="text-gray-500 text-sm">Mô tả meta</div>
            <div className="whitespace-pre-wrap border rounded p-3 text-sm">{mockArticle.meta_description}</div>
          </div>
        </div>
      )}
    </section>
  );
};

export default AdminPostDetail;
