import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import ImageGallery from "./ImageGallery";

const ProductImage = ({ imageUrl, productName, isActive, isFeatured, variantImages = [] }) => {
  // Use ImageGallery component for displaying images
  return (
    <ImageGallery 
      mainImage={imageUrl}
      productName={productName}
      variantImages={variantImages}
      isActive={isActive}
      isFeatured={isFeatured}
    />
  );
};

export default ProductImage;
