import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import styles from "./ImageGallery.module.css";

// Base URL of backend for serving uploads
const BASE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const toAbsoluteUrl = (url) => {
  if (!url) return url;
  // If it's already absolute (http/https), return as-is
  if (/^https?:\/\//i.test(url)) return url;
  // If it's a public uploads path like /uploads/..., prefix backend base
  if (url.startsWith('/uploads')) return `${BASE_API_URL}${url}`;
  return url;
};

const PLACEHOLDER_MAIN = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400'><rect width='100%25' height='100%25' fill='%23eeeeee'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23888888' font-family='Arial' font-size='24'>No%20Image</text></svg>";
const PLACEHOLDER_THUMB = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'><rect width='100%25' height='100%25' fill='%23eeeeee'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23888888' font-family='Arial' font-size='12'>No%20Image</text></svg>";

const ImageGallery = ({ mainImage, productName, variantImages = [], isActive, isFeatured, onImageChange }) => {
  const [selectedImage, setSelectedImage] = useState(toAbsoluteUrl(mainImage) || PLACEHOLDER_MAIN);
  const [selectedImageObj, setSelectedImageObj] = useState(null);
  
  // Lấy ảnh chính (primary) hoặc ảnh đầu tiên
  const primaryImage = variantImages?.find(img => img.is_primary);
  const allImages = variantImages && variantImages.length > 0 ? variantImages : [];
  
  // Sắp xếp theo is_primary (primary đầu tiên), sau đó theo display_order
  const sortedImages = [...allImages].sort((a, b) => {
    if (a.is_primary && !b.is_primary) return -1;
    if (!a.is_primary && b.is_primary) return 1;
    return (a.display_order || 0) - (b.display_order || 0);
  });
  
  // Set display image từ variant images nếu có
  const displayImages = sortedImages.length > 0 ? sortedImages : [];
  const displayMainImage = toAbsoluteUrl(primaryImage?.image_url) || 
                          toAbsoluteUrl(displayImages.length > 0 ? displayImages[0]?.image_url : mainImage) ||
                          PLACEHOLDER_MAIN;

  // Tự động hiển thị ảnh chính khi variantImages thay đổi (click vào biến thể khác)
  useEffect(() => {
    if (primaryImage) {
      setSelectedImage(toAbsoluteUrl(primaryImage.image_url));
      setSelectedImageObj(primaryImage);
    } else if (displayImages.length > 0) {
      setSelectedImage(toAbsoluteUrl(displayImages[0].image_url));
      setSelectedImageObj(displayImages[0]);
    }
  }, [variantImages]);

  const handleThumbnailClick = (imageUrl, index, imageObj) => {
    const abs = toAbsoluteUrl(imageUrl);
    setSelectedImage(abs);
    setSelectedImageObj(imageObj);
    if (onImageChange) {
      onImageChange(abs, index);
    }
  };

  return (
    <div className={styles.imageGallery}>
      {/* Main Image */}
      <div className={styles.mainImageContainer}>
        <img
          src={selectedImage || displayMainImage}
          alt={productName}
          className={styles.mainImage}
          onError={(e) => {
            e.target.src = PLACEHOLDER_MAIN;
          }}
        />
        
        {/* Primary Badge on Main Image */}
        {selectedImageObj?.is_primary && (
          <div className={styles.statusBadgeContainer}>
            <div className="bg-yellow-500 text-white px-3 py-1 rounded-full flex items-center gap-1 text-xs font-medium shadow-lg">
              ⭐ Ảnh chính
            </div>
          </div>
        )}
        
        {/* Status Badge */}
        <div className={styles.statusBadgeContainer}>
          {isActive ? (
            <Badge className="bg-green-500 text-white font-medium px-4 py-2 text-sm shadow-lg">
              Còn hàng
            </Badge>
          ) : (
            <Badge className="bg-gray-500 text-white font-medium px-4 py-2 text-sm shadow-lg">
              Hết hàng
            </Badge>
          )}
        </div>
        
        {/* Featured Badge */}
        {isFeatured && (
          <div className={styles.featuredBadgeContainer}>
            <Badge className="bg-yellow-500 text-white font-bold px-4 py-2 text-sm shadow-lg">
              ⭐ Nổi bật
            </Badge>
          </div>
        )}
      </div>

      {/* Thumbnail Images */}
      {displayImages.length > 1 && (
        <div className={styles.thumbnailsContainer}>
          {displayImages.map((img, index) => (
            <div key={img.image_id || index} className="relative">
              <button
                onClick={() => handleThumbnailClick(img.image_url, index, img)}
                className={`${styles.thumbnailButton} ${
                  selectedImage === toAbsoluteUrl(img.image_url) ? styles.active : ''
                } relative`}
                title={img.alt_text || `Ảnh ${index + 1}`}
                type="button"
              >
                <img
                  src={toAbsoluteUrl(img.image_url)}
                  alt={img.alt_text || `Ảnh ${index + 1}`}
                  className={styles.thumbnailImage}
                  onError={(e) => {
                    e.target.src = PLACEHOLDER_THUMB;
                  }}
                />
                {/* Primary Badge on Thumbnail */}
                {img.is_primary && (
                  <div className="absolute top-0 right-0 bg-yellow-500 text-white text-xs px-1 py-0.5 rounded">
                    ⭐
                  </div>
                )}
              </button>
              {/* Alt Text Display */}
              {img.alt_text && (
                <p className="text-xs text-gray-600 mt-1 truncate" title={img.alt_text}>
                  {img.alt_text}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
