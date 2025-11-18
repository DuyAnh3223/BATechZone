import React from 'react';
import ImageUploader from '@/components/common/ImageUploader';

const CategoryImageUploader = ({ currentImageUrl, onFileSelected }) => {
  return (
    <ImageUploader
      currentImageUrl={currentImageUrl}
      onFileSelected={onFileSelected}
      label="Hình ảnh danh mục"
      aspectRatio="16/9"
      placeholder="Kéo thả hình ảnh danh mục vào đây"
    />
  );
};

export default CategoryImageUploader;
