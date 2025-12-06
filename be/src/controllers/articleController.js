import ArticleService from '../services/ArticleService.js';

export const listArticles = async (req, res) => {
  try {
    const articles = await ArticleService.listAll();
    res.json({ data: articles });
  } catch (error) {
    console.error('Error listing articles', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getArticle = async (req, res) => {
  try {
    const article = await ArticleService.getById(req.params.id);
    if (!article) return res.status(404).json({ message: 'Not found' });
    res.json({ data: article });
  } catch (error) {
    console.error('Error getting article', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createArticle = async (req, res) => {
  try {
    const created = await ArticleService.create(req.body);
    res.status(201).json({ data: created });
  } catch (error) {
    console.error('Error creating article', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateArticle = async (req, res) => {
  try {
    const updated = await ArticleService.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Not found' });
    const article = await ArticleService.getById(req.params.id);
    res.json({ data: article });
  } catch (error) {
    console.error('Error updating article', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteArticle = async (req, res) => {
  try {
    const deleted = await ArticleService.delete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Not found' });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting article', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
