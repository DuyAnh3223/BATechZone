import express from 'express';
import {
  listPublishedPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  uploadPostImage,
  listPostImages,
  deletePostImage
} from '../controllers/postController.js';
import { uploadPostImage as uploadMiddleware } from '../middlewares/upload.js';

const router = express.Router();

router.get('/published', listPublishedPosts);
router.get('/:id', getPost);
router.post('/', createPost);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);

// CKEditor / image upload
router.post('/upload-image', uploadMiddleware.single('upload'), uploadPostImage);
router.get('/:postId/images', listPostImages);
router.post('/delete-image', deletePostImage);

export default router;
