import multer from 'multer';
import path from 'path';
import fs from 'fs';

const ensureDir = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};

const uploadsRoot = path.resolve(process.cwd(), 'uploads');

const variantsRoot = path.join(uploadsRoot, 'variants');
const categoriesRoot = path.join(uploadsRoot, 'categories');
const productsRoot = path.join(uploadsRoot, 'products');
const articlesRoot = path.join(uploadsRoot, 'articles');
const postsRoot = path.join(uploadsRoot, 'posts');
const warrantyRoot = path.join(uploadsRoot, 'warranty');
const tempRoot = path.join(uploadsRoot, 'temp');

ensureDir(variantsRoot);
ensureDir(categoriesRoot);
ensureDir(productsRoot);
ensureDir(articlesRoot);
ensureDir(postsRoot);
ensureDir(warrantyRoot);
ensureDir(tempRoot);

const sanitize = (s) => String(s || '').replace(/[^a-zA-Z0-9-_]/g, '');

const storageDynamic = multer.diskStorage({
    destination: function (req, file, cb) {
        const variantId = sanitize(req.params?.variantId || 'common');
        const dir = path.join(variantsRoot, variantId);
        ensureDir(dir);
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname).toLowerCase();
        const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9-_]/g, '') || 'img';
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${base}-${unique}${ext}`);
    }
});

const fileFilter = (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Định dạng ảnh không được hỗ trợ'));
};

export const uploadVariantImage = multer({ storage: storageDynamic, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

// Storage for category images
const storageCategoryImage = multer.diskStorage({
    destination: function (req, file, cb) {
        ensureDir(categoriesRoot);
        cb(null, categoriesRoot);
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname).toLowerCase();
        const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9-_]/g, '') || 'category';
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${base}-${unique}${ext}`);
    }
});

export const uploadCategoryImage = multer({ 
    storage: storageCategoryImage, 
    fileFilter, 
    limits: { fileSize: 5 * 1024 * 1024 } 
});

// Storage for product images
const storageProductImage = multer.diskStorage({
    destination: function (req, file, cb) {
        ensureDir(productsRoot);
        cb(null, productsRoot);
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname).toLowerCase();
        const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9-_]/g, '') || 'product';
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${base}-${unique}${ext}`);
    }
});

export const uploadProductImage = multer({ 
    storage: storageProductImage, 
    fileFilter, 
    limits: { fileSize: 5 * 1024 * 1024 } 
});

//  storage for post images (uploads/posts)
const storagePostImage = multer.diskStorage({
    destination: function (req, file, cb) {
        // optional: you can organize by postId if provided (req.body.postId or req.params.postId)
        const postId = sanitize(req.body?.postId || req.params?.postId || 'common');
        const dir = path.join(postsRoot, postId);
        ensureDir(dir);
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname).toLowerCase();
        const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9-_]/g, '') || 'post';
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${base}-${unique}${ext}`);
    }
});


export const uploadPostImage = multer({
    storage: storagePostImage,
    fileFilter,
    limits: { fileSize: 6 * 1024 * 1024 } // 6MB, tuỳ bạn chỉnh
});

// Storage for warranty request images (uploads/warranty)
const storageWarrantyImage = multer.diskStorage({
    destination: function (req, file, cb) {
        ensureDir(warrantyRoot);
        cb(null, warrantyRoot);
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname).toLowerCase();
        const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9-_]/g, '') || 'warranty';
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${base}-${unique}${ext}`);
    }
});

export const uploadWarrantyImage = multer({
    storage: storageWarrantyImage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB per image
});



export const getPublicUrlForVariant = (variantId, filename) => {
    return `/uploads/variants/${sanitize(variantId)}/${filename}`;
};

export const getPublicUrlForCategory = (filename) => {
    return `/uploads/categories/${filename}`;
};

export const getPublicUrlForProduct = (filename) => {
    return `/uploads/products/${filename}`;
};

export const getPublicUrlForPost = (postId, filename) => {
    // store relative path so easy to move host later
    return `/uploads/posts/${sanitize(postId || 'common')}/${filename}`;
};

export const getPublicUrlForWarranty = (filename) => {
    return `/uploads/warranty/${filename}`;
};


export const mapPublicUrlToDiskPath = (publicUrl) => {
    // expects /uploads/variants/{variantId}/{filename}
    const parts = publicUrl.split('/').filter(Boolean);
    const idx = parts.findIndex(p => p === 'uploads');
    if (idx === -1) return null;
    const rel = parts.slice(idx + 1); // variants/{variantId}/{filename}
    return path.join(uploadsRoot, ...rel);
};

// helper safe delete file
export const safeUnlink = (filePath) => {
    try {
        if (!filePath) return;
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    } catch (e) {
        console.error('safeUnlink error:', e.message);
    }
};
