# ImageUploader Component - Examples

Generic component để upload ảnh với drag & drop, preview, validation.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `currentImageUrl` | string | - | URL ảnh hiện tại (edit mode) |
| `onImageUploaded` | function | - | Callback khi upload thành công: `(url) => void` |
| `uploadFunction` | function | - | Hàm upload file: `(file) => Promise<response>` |
| `label` | string | "Hình ảnh" | Label hiển thị |
| `maxSize` | number | 5242880 (5MB) | Kích thước file tối đa (bytes) |
| `allowedTypes` | string[] | image types | MIME types cho phép |
| `aspectRatio` | string | "16/9" | CSS aspect ratio cho preview |
| `showUrlDisplay` | boolean | false | Hiển thị URL debug info |
| `placeholder` | string | "Kéo thả hình ảnh vào đây" | Text trong drag area |

## Example 1: Category Image

```jsx
import ImageUploader from '@/components/common/ImageUploader';
import { useCategoryStore } from '@/stores/useCategoryStore';

const CategoryImageUploader = ({ currentImageUrl, onImageUploaded }) => {
  const { uploadCategoryImage } = useCategoryStore();

  return (
    <ImageUploader
      currentImageUrl={currentImageUrl}
      onImageUploaded={onImageUploaded}
      uploadFunction={uploadCategoryImage}
      label="Hình ảnh danh mục"
      aspectRatio="16/9"
      placeholder="Kéo thả hình ảnh danh mục vào đây"
    />
  );
};
```

## Example 2: User Avatar (Circle)

```jsx
import ImageUploader from '@/components/common/ImageUploader';
import { useAuthStore } from '@/stores/useAuthStore';

const UserAvatarUploader = ({ currentAvatar, onAvatarUploaded }) => {
  const { uploadUserAvatar } = useAuthStore();

  return (
    <ImageUploader
      currentImageUrl={currentAvatar}
      onImageUploaded={onAvatarUploaded}
      uploadFunction={uploadUserAvatar}
      label="Ảnh đại diện"
      aspectRatio="1/1"
      maxSize={2 * 1024 * 1024} // 2MB
      placeholder="Kéo thả avatar vào đây"
    />
  );
};
```

## Example 3: Product Main Image

```jsx
import ImageUploader from '@/components/common/ImageUploader';
import { useProductStore } from '@/stores/useProductStore';

const ProductMainImageUploader = ({ currentImageUrl, onImageUploaded }) => {
  const { uploadProductImage } = useProductStore();

  return (
    <ImageUploader
      currentImageUrl={currentImageUrl}
      onImageUploaded={onImageUploaded}
      uploadFunction={uploadProductImage}
      label="Hình ảnh chính"
      aspectRatio="4/3"
      placeholder="Kéo thả hình ảnh sản phẩm vào đây"
      showUrlDisplay={true} // Show URL for debugging
    />
  );
};
```

## Example 4: Variant Image (Square)

```jsx
import ImageUploader from '@/components/common/ImageUploader';
import { useVariantStore } from '@/stores/useVariantStore';

const VariantImageUploader = ({ variantId, currentImageUrl, onImageUploaded }) => {
  const { uploadVariantImage } = useVariantStore();

  // Wrap upload function to include variantId
  const uploadWithId = async (file) => {
    return await uploadVariantImage(variantId, file);
  };

  return (
    <ImageUploader
      currentImageUrl={currentImageUrl}
      onImageUploaded={onImageUploaded}
      uploadFunction={uploadWithId}
      label="Hình ảnh biến thể"
      aspectRatio="1/1"
      placeholder="Kéo thả hình ảnh biến thể vào đây"
    />
  );
};
```

## Example 5: Custom File Types (PDF, Images)

```jsx
import ImageUploader from '@/components/common/ImageUploader';

const DocumentUploader = ({ currentDocUrl, onDocUploaded }) => {
  const uploadDocument = async (file) => {
    const formData = new FormData();
    formData.append('document', file);
    const response = await api.post('/documents/upload', formData);
    return response;
  };

  return (
    <ImageUploader
      currentImageUrl={currentDocUrl}
      onImageUploaded={onDocUploaded}
      uploadFunction={uploadDocument}
      label="Tài liệu"
      allowedTypes={['application/pdf', 'image/jpeg', 'image/png']}
      maxSize={10 * 1024 * 1024} // 10MB
      aspectRatio="auto"
      placeholder="Kéo thả tài liệu vào đây"
    />
  );
};
```

## Backend Service Setup

### 1. Create Upload Service (Example)

```javascript
// services/userService.js
export const uploadUserAvatar = async (file) => {
  const formData = new FormData();
  formData.append('avatar', file);
  
  const response = await api.post('/users/upload-avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  
  return response;
};
```

### 2. Add to Zustand Store

```javascript
// stores/useAuthStore.js
import { uploadUserAvatar as uploadUserAvatarService } from '@/services/userService';

export const useAuthStore = create((set) => ({
  user: null,
  
  uploadUserAvatar: async (file) => {
    try {
      const response = await uploadUserAvatarService(file);
      toast.success('Upload avatar thành công');
      return response;
    } catch (error) {
      toast.error('Upload avatar thất bại');
      throw error;
    }
  },
}));
```

## Notes

1. **Upload Function Format**: Hàm upload phải trả về response có cấu trúc:
   ```javascript
   {
     data: { imageUrl: '/uploads/...' }, // hoặc
     imageUrl: '/uploads/...',            // hoặc
     data: { url: '/uploads/...' },       // hoặc
     url: '/uploads/...'
   }
   ```

2. **Aspect Ratio**: Sử dụng CSS aspect ratio:
   - `"1/1"` - Square (avatar, icon)
   - `"4/3"` - Standard photo
   - `"16/9"` - Widescreen
   - `"auto"` - Natural dimensions

3. **File Size**: Tính theo bytes:
   - 1MB = 1024 * 1024 = 1048576
   - 5MB = 5 * 1024 * 1024 = 5242880

4. **MIME Types**: Common types:
   - Images: `['image/jpeg', 'image/png', 'image/webp', 'image/gif']`
   - PDF: `['application/pdf']`
   - Documents: `['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']`

5. **URL Handling**: Component tự động xử lý:
   - Absolute URLs (http://...) - giữ nguyên
   - Relative URLs (/uploads/...) - thêm VITE_API_URL
