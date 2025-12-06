import PostService from '../services/PostService.js';
import { getPublicUrlForPost, mapPublicUrlToDiskPath, safeUnlink } from '../middlewares/upload.js';
import sanitizeHtml from '../utils/sanitizeHtml.js';

export const listPublishedPosts = async (req, res) => {
  try {
    const posts = await PostService.listPublished();
    res.json({ data: posts });
  } catch (error) {
    console.error('Error listing posts', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getPost = async (req, res) => {
  try {
    const post = await PostService.getById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Not found' });
    res.json({ data: post });
  } catch (error) {
    console.error('Error getting post', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createPost = async (req, res) => {
  try {
    // sanitize HTML content server-side
    const body = { ...req.body };
    if (body.content_html) body.content_html = sanitizeHtml(body.content_html);

    const data = body;
    const created = await PostService.create(data);
    res.status(201).json({ data: created });
  } catch (error) {
    console.error('Error creating post', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updatePost = async (req, res) => {
  try {
    // sanitize HTML content server-side on update
    const body = { ...req.body };
    if (body.content_html) body.content_html = sanitizeHtml(body.content_html);

    const updated = await PostService.update(req.params.id, body);
    if (!updated) return res.status(404).json({ message: 'Not found' });
    const post = await PostService.getById(req.params.id);
    res.json({ data: post });
  } catch (error) {
    console.error('Error updating post', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deletePost = async (req, res) => {
  try {
    const deleted = await PostService.delete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Not found' });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting post', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// CKEditor image upload handler
export const uploadPostImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ uploaded: false, error: { message: 'No file uploaded' } });

    const postId = req.body.postId || null;
    const publicUrl = getPublicUrlForPost(postId, req.file.filename);

    // Optional: persist to post_images table
    const img = await PostService.addImage({
      post_id: postId,
      url: publicUrl,
      filename: req.file.filename,
      mime: req.file.mimetype,
      size: req.file.size,
      is_featured: 0,
      sort_order: 0,
      uploaded_by: req.user?.id || null
    });

    // CKEditor expects { uploaded: 1, fileName, url } or the adapter expects { url }
    res.status(201).json({ uploaded: 1, fileName: req.file.filename, url: publicUrl, data: img });
  } catch (error) {
    console.error('Error uploading post image', error);
    res.status(500).json({ uploaded: false, error: { message: 'Internal server error' } });
  }
};

export const listPostImages = async (req, res) => {
  try {
    const postId = req.params.postId;
    const images = await PostService.getImages(postId);
    res.json({ data: images });
  } catch (error) {
    console.error('Error listing post images', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deletePostImage = async (req, res) => {
  try {
    const { imageId, imageUrl } = req.body;
    if (!imageId && !imageUrl) return res.status(400).json({ message: 'imageId or imageUrl required' });

    // delete DB record if imageId provided
    const deletedFromDb = imageId ? await PostService.deleteImage?.(imageId) : true;

    // delete file from disk
    if (imageUrl) {
      const diskPath = mapPublicUrlToDiskPath(imageUrl);
      if (diskPath) safeUnlink(diskPath);
    }

    res.json({ success: true, deletedFromDb });
  } catch (error) {
    console.error('Error deleting post image', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
