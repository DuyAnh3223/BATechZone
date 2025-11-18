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
ensureDir(variantsRoot);
ensureDir(categoriesRoot);

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

export const getPublicUrlForVariant = (variantId, filename) => {
    return `/uploads/variants/${sanitize(variantId)}/${filename}`;
};

export const getPublicUrlForCategory = (filename) => {
    return `/uploads/categories/${filename}`;
};

export const mapPublicUrlToDiskPath = (publicUrl) => {
    // expects /uploads/variants/{variantId}/{filename}
    const parts = publicUrl.split('/').filter(Boolean);
    const idx = parts.findIndex(p => p === 'uploads');
    if (idx === -1) return null;
    const rel = parts.slice(idx + 1); // variants/{variantId}/{filename}
    return path.join(uploadsRoot, ...rel);
};
