import Post from '../models/Post.js';
import PostImage from '../models/PostImage.js';

const PostService = {
  async getById(id) {
    return await Post.findById(id);
  },

  async getBySlug(slug) {
    return await Post.findBySlug(slug);
  },

  async listPublished() {
    return await Post.findAllPublished();
  },

  async create(data) {
    return await Post.create(data);
  },

  async update(id, data) {
    return await Post.update(id, data);
  },

  async delete(id) {
    return await Post.delete(id);
  },

  async addImage(data) {
    return await PostImage.create(data);
  },

  async getImages(postId) {
    return await PostImage.findByPostId(postId);
  }
,
  async deleteImage(id) {
    return await PostImage.delete(id);
  }
};

export default PostService;
