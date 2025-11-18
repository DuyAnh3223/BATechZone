# 📸 Hướng dẫn Upload hình ảnh Category với Multer

## 🎯 Tổng quan

Hệ thống upload hình ảnh cho Category đã được cấu hình hoàn chỉnh sử dụng **Multer** - middleware xử lý `multipart/form-data` cho Node.js.

---

## 📁 Cấu trúc thư mục

```
be/
├── uploads/
│   ├── categories/     # Lưu hình ảnh category
│   ├── products/       # Lưu hình ảnh product
│   └── variants/       # Lưu hình ảnh variant
└── src/
    └── middleware/
        └── upload.js   # Cấu hình Multer
```

---

## ⚙️ Cấu hình Multer chi tiết

### 1. **Storage Configuration** (`upload.js`)

```javascript
const storageCategoryImage = multer.diskStorage({
    destination: function (req, file, cb) {
        ensureDir(categoriesRoot);  // Tạo thư mục nếu chưa tồn tại
        cb(null, categoriesRoot);   // Lưu vào uploads/categories/
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname).toLowerCase();
        const base = path.basename(file.originalname, ext)
                         .replace(/[^a-zA-Z0-9-_]/g, '') || 'category';
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${base}-${unique}${ext}`);
        // Tên file: category-1700123456789-123456789.jpg
    }
});
```

**Giải thích:**
- `destination`: Xác định thư mục lưu file
- `filename`: Tạo tên file unique để tránh trùng lặp
- Format: `{base}-{timestamp}-{random}.{ext}`

### 2. **File Filter** (Kiểm tra loại file)

```javascript
const fileFilter = (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowed.includes(file.mimetype)) {
        cb(null, true);  // Chấp nhận file
    } else {
        cb(new Error('Định dạng ảnh không được hỗ trợ'));
    }
};
```

**Giải thích:**
- Chỉ cho phép upload: JPEG, PNG, WebP, GIF
- Reject các file khác với error message

### 3. **Upload Middleware**

```javascript
export const uploadCategoryImage = multer({ 
    storage: storageCategoryImage,  // Sử dụng storage đã config
    fileFilter,                      // Áp dụng filter
    limits: { fileSize: 5 * 1024 * 1024 }  // Giới hạn 5MB
});
```

---

## 🛣️ API Routes (`categoryRoutes.js`)

```javascript
import { uploadCategoryImage as uploadMiddleware } from '../middleware/upload.js';

// Upload image route
router.post('/upload-image', 
    uploadMiddleware.single('image'),  // Multer middleware - field name: 'image'
    uploadCategoryImage                // Controller xử lý response
);
```

**Giải thích:**
- `.single('image')`: Upload 1 file duy nhất với field name là `'image'`
- Request phải là `multipart/form-data`
- File upload sẽ có trong `req.file`

---

## 🎮 Controller Handler (`categoryController.js`)

```javascript
export const uploadCategoryImage = async (req, res) => {
  try {
    // Kiểm tra có file không
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        message: 'No file uploaded' 
      });
    }

    // Tạo public URL để lưu vào database
    const imageUrl = getPublicUrlForCategory(req.file.filename);
    // imageUrl = "/uploads/categories/category-1700123456789-123456789.jpg"

    // Trả về thông tin file
    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        imageUrl,                    // Đường dẫn public để lưu DB
        filename: req.file.filename, // Tên file gốc
        size: req.file.size,         // Kích thước (bytes)
        mimetype: req.file.mimetype  // Loại file
      }
    });
  } catch (error) {
    console.error('Error uploading category image:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error.message 
    });
  }
};
```

---

## 🌐 Serve Static Files (`server.js`)

```javascript
// Cho phép truy cập file từ browser
app.use('/uploads', express.static(path.join(__dirname, '..', '..', 'uploads')));
```

**Kết quả:**
- File: `be/uploads/categories/image.jpg`
- URL: `http://localhost:5001/uploads/categories/image.jpg`

---

## 🧪 Cách sử dụng

### 1. **Upload hình ảnh từ Frontend**

```javascript
const handleImageUpload = async (file) => {
  const formData = new FormData();
  formData.append('image', file);  // Field name phải là 'image'

  try {
    const response = await fetch('http://localhost:5001/api/categories/upload-image', {
      method: 'POST',
      body: formData
      // Không set Content-Type header! Browser tự động set
    });

    const result = await response.json();
    
    if (result.success) {
      const imageUrl = result.data.imageUrl;
      // Lưu imageUrl này vào database
      console.log('Image URL:', imageUrl);
      // "/uploads/categories/category-1700123456789-123456789.jpg"
    }
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
```

### 2. **Tạo/Update Category với hình ảnh**

```javascript
// Bước 1: Upload image
const uploadResponse = await uploadImage(file);
const imageUrl = uploadResponse.data.imageUrl;

// Bước 2: Tạo/Update category với imageUrl
const categoryData = {
  category_name: "Laptop Gaming",
  slug: "laptop-gaming",
  description: "High-performance gaming laptops",
  image_url: imageUrl,  // Đường dẫn từ upload
  is_active: true
};

await fetch('http://localhost:5001/api/categories', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(categoryData)
});
```

### 3. **Hiển thị hình ảnh**

```jsx
// React component
<img 
  src={`http://localhost:5001${category.image_url}`} 
  alt={category.category_name}
/>

// Hoặc nếu đã config base URL
<img 
  src={category.image_url} 
  alt={category.category_name}
/>
```

---

## 📊 Request/Response Flow

```
Client (React)                    Backend (Express)                    File System
     |                                   |                                   |
     | 1. POST /upload-image             |                                   |
     |    FormData: {image: file}        |                                   |
     |---------------------------------->|                                   |
     |                                   | 2. Multer middleware              |
     |                                   |    - Check file type              |
     |                                   |    - Check file size              |
     |                                   |    - Generate filename            |
     |                                   |---------------------------------->| 3. Save file
     |                                   |                                   |    uploads/categories/xxx.jpg
     |                                   | 4. req.file available             |
     |                                   |    in controller                  |
     |                                   |                                   |
     | 5. Response:                      |                                   |
     |    {imageUrl: "/uploads/..."}     |                                   |
     |<----------------------------------|                                   |
     |                                   |                                   |
     | 6. POST /categories               |                                   |
     |    {image_url: "/uploads/..."}    |                                   |
     |---------------------------------->| 7. Save to database               |
     |                                   |    categories.image_url           |
     |                                   |                                   |
```

---

## 🔒 Bảo mật và Xử lý lỗi

### Validation trong Multer:

1. **File type**: Chỉ cho phép image types
2. **File size**: Giới hạn 5MB
3. **Filename sanitization**: Loại bỏ ký tự đặc biệt

### Error Handling:

```javascript
// Trong controller
if (!req.file) {
  return res.status(400).json({ message: 'No file uploaded' });
}

// Multer errors
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        message: 'File quá lớn. Giới hạn 5MB' 
      });
    }
  }
  next(error);
});
```

---

## 📝 Database Schema

```sql
CREATE TABLE categories (
  category_id INT PRIMARY KEY AUTO_INCREMENT,
  category_name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  description TEXT,
  parent_category_id INT,
  image_url VARCHAR(500),  -- Lưu đường dẫn: /uploads/categories/xxx.jpg
  icon VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## 🎨 Frontend Example (React + Axios)

```jsx
import { useState } from 'react';
import axios from 'axios';

const CategoryImageUploader = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      alert('Chỉ chấp nhận file JPG, PNG, WebP');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File quá lớn. Giới hạn 5MB');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await axios.post(
        'http://localhost:5001/api/categories/upload-image',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );

      if (response.data.success) {
        setImageUrl(response.data.data.imageUrl);
        console.log('Upload success:', response.data.data);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload thất bại: ' + error.response?.data?.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input 
        type="file" 
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        disabled={uploading}
      />
      
      {uploading && <p>Đang upload...</p>}
      
      {imageUrl && (
        <div>
          <p>Image URL: {imageUrl}</p>
          <img 
            src={`http://localhost:5001${imageUrl}`} 
            alt="Preview" 
            style={{ maxWidth: '300px' }}
          />
        </div>
      )}
    </div>
  );
};
```

---

## 🚀 Testing với Postman

### 1. Upload Image:

```
POST http://localhost:5001/api/categories/upload-image
Body: form-data
  - Key: image (type: File)
  - Value: [Select image file]
```

**Response:**
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "data": {
    "imageUrl": "/uploads/categories/laptop-1700123456789-123456789.jpg",
    "filename": "laptop-1700123456789-123456789.jpg",
    "size": 245678,
    "mimetype": "image/jpeg"
  }
}
```

### 2. Create Category với image:

```
POST http://localhost:5001/api/categories
Body: JSON
{
  "category_name": "Laptop Gaming",
  "slug": "laptop-gaming",
  "image_url": "/uploads/categories/laptop-1700123456789-123456789.jpg",
  "is_active": true
}
```

---

## 📌 Lưu ý quan trọng

1. **Field name**: Phải là `'image'` (match với `.single('image')`)
2. **Content-Type**: Browser tự động set khi dùng FormData
3. **File path**: Lưu relative path (`/uploads/...`) vào DB, không phải absolute path
4. **Static serve**: File chỉ truy cập được vì có `app.use('/uploads', express.static(...))`
5. **Unique filename**: Timestamp + random number tránh trùng lặp
6. **Directory creation**: `ensureDir()` tự động tạo thư mục nếu chưa có

---

## 🔧 Troubleshooting

### Lỗi: "No file uploaded"
- Kiểm tra field name phải là `'image'`
- Đảm bảo Content-Type là `multipart/form-data`

### Lỗi: "Định dạng ảnh không được hỗ trợ"
- File không phải JPG, PNG, WebP, GIF
- Kiểm tra MIME type của file

### Lỗi: File quá lớn
- Vượt quá 5MB limit
- Compress image trước khi upload

### Hình ảnh không hiển thị
- Kiểm tra static serve config trong `server.js`
- Verify đường dẫn file trong DB
- Check file có tồn tại trong thư mục `uploads/categories/`

---

## 🎯 Tóm tắt

✅ **Multer** xử lý upload file từ `multipart/form-data`
✅ **Storage** config định nghĩa nơi lưu và tên file
✅ **Filter** kiểm tra loại file cho phép
✅ **Limits** giới hạn kích thước file
✅ **Static serve** cho phép truy cập file từ browser
✅ **Public URL** được lưu vào database để sử dụng frontend

---

Hệ thống hoàn chỉnh và sẵn sàng sử dụng! 🚀
