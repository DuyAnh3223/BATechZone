import mockPosts from './posts';
import mockArticles from './articles';

// Simple in-memory mock API. Data is mutated in-memory for dev/demo purposes.
const posts = JSON.parse(JSON.stringify(mockPosts));
const articles = JSON.parse(JSON.stringify(mockArticles));

let nextPostId = posts.reduce((m, p) => Math.max(m, p.id), 0) + 1;
let nextArticleId = articles.reduce((m, a) => Math.max(m, a.id), 0) + 1;

const delay = (ms = 150) => new Promise(r => setTimeout(r, ms));

const mockApi = {
  async listPosts({ articleId } = {}) {
    await delay();
    if (articleId) return posts.filter(p => p.article_id === Number(articleId));
    return posts.slice().sort((a,b)=> new Date(b.created_at) - new Date(a.created_at));
  },
  async getPost(id) {
    await delay();
    return posts.find(p => p.id === Number(id)) || null;
  },
  async createPost(data) {
    await delay();
    const now = new Date().toISOString().slice(0,19).replace('T',' ');
    const post = {
      id: nextPostId++,
      title: data.title || 'Untitled',
      slug: data.slug || (data.title||'untitled').toLowerCase().replace(/[^a-z0-9]+/g,'-'),
      excerpt: data.excerpt || '',
      image: data.image || '',
      content_html: data.content_html || '',
      content_text: data.content_text || '',
      author_id: data.author_id || 1,
      article_id: data.article_id || null,
      status: data.status || 'draft',
      featured_image_id: null,
      view_count: 0,
      created_at: now,
      updated_at: now
    };
    posts.push(post);
    return post;
  },
  async updatePost(id, data) {
    await delay();
    const idx = posts.findIndex(p=>p.id===Number(id));
    if (idx===-1) return null;
    posts[idx] = { ...posts[idx], ...data, updated_at: new Date().toISOString().slice(0,19).replace('T',' ') };
    return posts[idx];
  },
  async deletePost(id) {
    await delay();
    const idx = posts.findIndex(p=>p.id===Number(id));
    if (idx===-1) return false;
    posts.splice(idx,1);
    return true;
  },
  async listArticles() { await delay(); return articles.slice(); },
  async createArticle(data) {
    await delay();
    const now = new Date().toISOString().slice(0,19).replace('T',' ');
    const a = { id: nextArticleId++, name: data.name, slug: data.slug || (data.name||'').toLowerCase().replace(/[^a-z0-9]+/g,'-'), description: data.description||'', created_at: now, updated_at: now };
    articles.push(a);
    return a;
  },
  async deleteArticle(id) {
    await delay();
    const idx = articles.findIndex(a=>a.id===Number(id));
    if (idx===-1) return false;
    // also remove article reference from posts
    posts.forEach(p=>{ if (p.article_id===Number(id)) p.article_id = null; });
    articles.splice(idx,1);
    return true;
  }
};

export default mockApi;
