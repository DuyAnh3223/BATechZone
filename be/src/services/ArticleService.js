import Article from '../models/Article.js';

const ArticleService = {
  async getById(id) {
    return await Article.findById(id);
  },

  async getBySlug(slug) {
    return await Article.findBySlug(slug);
  },

  async listAll() {
    return await Article.findAll();
  },

  async create(data) {
    return await Article.create(data);
  },

  async update(id, data) {
    return await Article.update(id, data);
  },

  async delete(id) {
    return await Article.delete(id);
  }
};

export default ArticleService;
