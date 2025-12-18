import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import mockApi from '@/mock/mockApi';

const AdminPostEditor = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState({ title: '', slug: '', excerpt: '', content_html: '', article_id: null, status: 'draft' });
  const [articles, setArticles] = useState([]);

  useEffect(()=>{
    (async()=>{
      const as = await mockApi.listArticles(); setArticles(as);
      if (postId) {
        const p = await mockApi.getPost(postId);
        if (p) setPost(p);
      }
    })();
  }, [postId]);

  const handleSave = async () => {
    if (postId) {
      await mockApi.updatePost(postId, post);
    } else {
      await mockApi.createPost(post);
    }
    navigate('/admin/posts');
  };

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{postId ? 'Sửa bài viết' : 'Thêm bài viết'}</h1>
      </div>

      <div className="bg-white p-4 rounded shadow space-y-4">
        <div>
          <label className="block text-sm text-gray-600">Tiêu đề</label>
          <input value={post.title} onChange={e=>setPost({...post, title: e.target.value})} className="w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm text-gray-600">Danh mục</label>
          <select value={post.article_id||''} onChange={e=>setPost({...post, article_id: e.target.value ? Number(e.target.value) : null})} className="w-full border rounded px-3 py-2">
            <option value="">-- Chọn danh mục --</option>
            {articles.map(a=> (<option key={a.id} value={a.id}>{a.name}</option>))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-600">Excerpt</label>
          <textarea value={post.excerpt} onChange={e=>setPost({...post, excerpt: e.target.value})} className="w-full border rounded px-3 py-2" rows={3} />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-2">Nội dung</label>
          <div className="bg-white border rounded">
            <CKEditor
              editor={ ClassicEditor }
              data={post.content_html || ''}
              onChange={ ( event, editor ) => {
                const data = editor.getData();
                setPost(prev=>({ ...prev, content_html: data }));
              } }
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={handleSave} className="px-4 py-2 bg-indigo-600 text-white rounded">Lưu</button>
          <button onClick={()=>navigate('/admin/posts')} className="px-4 py-2 border rounded">Hủy</button>
        </div>
      </div>
    </section>
  );
};

export default AdminPostEditor;
