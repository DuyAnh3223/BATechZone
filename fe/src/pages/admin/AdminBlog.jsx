import React, { useMemo, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { translatePostStatus, translatePostType } from '../../utils/statusTranslations';
import mockApi from '@/mock/mockApi';


const typeClass = type =>
  type === 'guide' ? 'bg-blue-100 text-blue-700'
    : type === 'review' ? 'bg-yellow-100 text-yellow-700'
    : type === 'news' ? 'bg-red-100 text-red-700'
    : 'bg-green-100 text-green-700';

const statusClass = status =>
  status === 'published' ? 'bg-green-100 text-green-700'
    : status === 'draft' ? 'bg-yellow-100 text-yellow-700'
    : 'bg-gray-100 text-gray-500';

const PAGE_SIZE_OPTIONS = [5, 10, 20];

const AddArticleForm = ({ onAdd }) => {
  const [name, setName] = useState('');
  return (
    <form onSubmit={e=>{ e.preventDefault(); onAdd(name); setName(''); }} className="flex gap-2">
      <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Thêm danh mục" className="flex-1 border px-2 py-1 rounded text-sm" />
      <button type="submit" className="px-3 py-1 bg-indigo-600 text-white rounded text-sm">Thêm</button>
    </form>
  );
};

const AdminPost = () => {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [posts, setPosts] = useState([]);
  const [articles, setArticles] = useState([]);
  const [selectedArticleId, setSelectedArticleId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const [ps, as] = await Promise.all([mockApi.listPosts(), mockApi.listArticles()]);
      setPosts(ps);
      setArticles(as);
    })();
  }, []);

  const types = useMemo(() => Array.from(new Set(posts.map(p => p.post_type || ''))).filter(Boolean), [posts]);
  const statuses = useMemo(() => Array.from(new Set(posts.map(p => p.status || ''))).filter(Boolean), [posts]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return posts.filter(p => {
      if (selectedArticleId && Number(p.article_id) !== Number(selectedArticleId)) return false;
      const t = (p.title || '').toLowerCase();
      const s = (p.slug || '').toLowerCase();
      const matchText = !q || t.includes(q) || s.includes(q);
      const matchType = !type || p.post_type === type;
      const matchStatus = !status || p.status === status;
      return matchText && matchType && matchStatus;
    });
  }, [search, type, status, posts, selectedArticleId]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  const goPage = (p) => setPage(Math.min(Math.max(1, p), totalPages));

  const handleRefresh = async () => {
    const ps = await mockApi.listPosts();
    setPosts(ps);
  };

  const handleAddArticle = async (name) => {
    if (!name || !name.trim()) return;
    const slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g,'-');
    const a = await mockApi.createArticle({ name: name.trim(), slug, description: '' });
    setArticles(prev => [...prev, a]);
  };

  const handleDeleteArticle = async (id) => {
    if (!window.confirm('Xóa danh mục này? Các bài viết sẽ mất liên kết.')) return;
    const ok = await mockApi.deleteArticle(id);
    if (ok) setArticles(prev => prev.filter(a=>a.id!==id));
    handleRefresh();
  };

  return (
  <section>
    <div className="mb-6 flex items-center justify-between">
      <h1 className="text-2xl font-bold text-gray-800">Quản lý bài viết (Posts)</h1>
      <Link to="/admin/posts/new" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 text-white px-6 py-2 rounded-lg font-semibold shadow transition">+ Thêm bài viết</Link>
    </div>

    {/* Bộ lọc nhanh */}
    <div className="mb-3 flex flex-wrap items-center gap-2">
      <input value={search} onChange={(e)=>{ setSearch(e.target.value); setPage(1); }} className="border rounded px-3 py-2 w-full md:w-72" placeholder="Tìm theo tiêu đề/slug..." />
      <select value={type} onChange={(e)=>{ setType(e.target.value); setPage(1); }} className="border rounded px-3 py-2">
        <option value="">Tất cả loại</option>
        {types.map(t => (<option key={t} value={t}>{t}</option>))}
      </select>
      <select value={status} onChange={(e)=>{ setStatus(e.target.value); setPage(1); }} className="border rounded px-3 py-2">
        <option value="">Tất cả trạng thái</option>
        {statuses.map(s => (<option key={s} value={s}>{s}</option>))}
      </select>
      <div className="ml-auto flex items-center gap-2">
        <span className="text-sm text-gray-500">Hiển thị</span>
        <select value={pageSize} onChange={(e)=>{ setPageSize(Number(e.target.value)); setPage(1); }} className="border rounded px-2 py-1 text-sm">
          {PAGE_SIZE_OPTIONS.map(s => (<option key={s} value={s}>{s}</option>))}
        </select>
        <span className="text-sm text-gray-500">mục/trang</span>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <main className="md:col-span-2">
        <div className="overflow-x-auto rounded-xl bg-white shadow pb-2">
          <table className="min-w-[900px] w-full text-left">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 font-semibold text-gray-600">ID</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Tiêu đề</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Slug</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Danh mục</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Trạng thái</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Lượt xem</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Ngày đăng</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Hành động</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {paginated.map(post => (
            <tr key={post.id} className="hover:bg-blue-50 transition">
              <td className="px-4 py-3 font-medium text-gray-800">{post.id}</td>
              <td className="px-4 py-3 font-semibold">{post.title}</td>
              <td className="px-4 py-3">{post.slug}</td>
              <td className="px-4 py-3">{articles.find(a=>a.id===post.article_id)?.name || '-'}</td>
              <td className="px-4 py-3"><span className={`px-3 py-0.5 rounded-full text-xs font-semibold ${statusClass(post.status)}`}>{translatePostStatus(post.status)}</span></td>
              <td className="px-4 py-3 text-center">{post.view_count || 0}</td>
              <td className="px-4 py-3">{new Date(post.created_at).toLocaleDateString()}</td>
              <td className="px-4 py-3 flex gap-2 whitespace-nowrap">
                <Link to={`/admin/posts/${post.id}`} className="px-3 py-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-600 rounded text-xs font-medium">Chi tiết</Link>
                <button onClick={()=>navigate(`/admin/posts/${post.id}/edit`)} className="px-3 py-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-600 rounded text-xs font-medium">Sửa</button>
                <button onClick={async()=>{ if(window.confirm('Xóa bài viết?')){ await mockApi.deletePost(post.id); handleRefresh(); } }} className="px-3 py-1 bg-pink-100 hover:bg-pink-200 text-pink-600 rounded text-xs font-medium">Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
        </div>

        {/* Phân trang */}
        <div className="flex items-center justify-between px-1 md:px-0 py-2 text-sm text-gray-600">
          <div>Tổng: <span className="font-medium text-gray-800">{filtered.length}</span> bài — Trang {currentPage}/{totalPages}</div>
          <div className="flex items-center gap-1">
            <button onClick={()=>goPage(currentPage-1)} disabled={currentPage===1} className="px-3 py-1 rounded border disabled:opacity-50">Trước</button>
            {Array.from({length: totalPages}).slice(0,5).map((_,i)=>{
              const p = i+1; return (
                <button key={p} onClick={()=>goPage(p)} className={`px-3 py-1 rounded border ${p===currentPage ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'}`}>{p}</button>
              );
            })}
            <button onClick={()=>goPage(currentPage+1)} disabled={currentPage===totalPages} className="px-3 py-1 rounded border disabled:opacity-50">Sau</button>
          </div>
        </div>
      </main>

      <aside className="md:col-span-1">
        <div className="bg-white p-4 rounded shadow space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Danh mục bài viết</h3>
            <button className="text-sm text-blue-600" onClick={()=>{ setSelectedArticleId(null); setSearch(''); setPage(1); }}>Tất cả</button>
          </div>
          <div className="space-y-2 max-h-64 overflow-auto">
            {articles.map(a=> (
              <div key={a.id} className={`flex items-center justify-between p-2 rounded ${Number(selectedArticleId)===Number(a.id) ? 'bg-indigo-50' : ''}`}>
                <button onClick={()=>{ setSelectedArticleId(a.id); setPage(1); }} className="text-sm text-left">{a.name}</button>
                <div className="flex gap-2">
                  <button title="Xóa" onClick={()=>handleDeleteArticle(a.id)} className="text-xs text-red-600">Xóa</button>
                </div>
              </div>
            ))}
          </div>

          <div>
            <AddArticleForm onAdd={handleAddArticle} />
          </div>
        </div>
      </aside>
    </div>
    {/* Phân trang */}
    <div className="flex items-center justify-between px-1 md:px-0 py-2 text-sm text-gray-600">
      <div>Tổng: <span className="font-medium text-gray-800">{filtered.length}</span> bài — Trang {currentPage}/{totalPages}</div>
      <div className="flex items-center gap-1">
        <button onClick={()=>goPage(currentPage-1)} disabled={currentPage===1} className="px-3 py-1 rounded border disabled:opacity-50">Trước</button>
        {Array.from({length: totalPages}).slice(0,5).map((_,i)=>{
          const p = i+1; return (
            <button key={p} onClick={()=>goPage(p)} className={`px-3 py-1 rounded border ${p===currentPage ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'}`}>{p}</button>
          );
        })}
        <button onClick={()=>goPage(currentPage+1)} disabled={currentPage===totalPages} className="px-3 py-1 rounded border disabled:opacity-50">Sau</button>
      </div>
    </div>
  </section>
  );
};

export default AdminPost;
