import VariantImage from '../models/VariantImage.js';
import { getPublicUrlForVariant, mapPublicUrlToDiskPath } from '../middlewares/upload.js';

// Upload image for variant
export const uploadVariantImage = async (req, res) => {
  try {
    const { variantId } = req.params;
    
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        message: 'No file uploaded' 
      });
    }

    const imageUrl = getPublicUrlForVariant(variantId, req.file.filename);
    const displayOrder = parseInt(req.body.display_order) || 0;
    const isPrimary = req.body.is_primary === 'true' || req.body.is_primary === true;

    // If this image is set as primary, unset other primary images for this variant
    if (isPrimary) {
      const existingImages = await VariantImage.listByVariant(variantId);
      for (const img of existingImages) {
        if (img.is_primary) {
          await VariantImage.updatePrimary(img.image_id, false);
        }
      }
    }

    const imageId = await VariantImage.create({
      variant_id: variantId,
      image_url: imageUrl,
      alt_text: req.body.alt_text || null,
      is_primary: isPrimary,
      display_order: displayOrder
    });

    const image = await VariantImage.getById(imageId);

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      data: image
    });
  } catch (error) {
    console.error('Error uploading variant image:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error.message 
    });
  }
};

// Get all images of a variant
export const getVariantImages = async (req, res) => {
  try {
    const { variantId } = req.params;
    const images = await VariantImage.listByVariant(variantId);
    
    res.json({
      success: true,
      data: images
    });
  } catch (error) {
    console.error('Error getting variant images:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error.message 
    });
  }
};

// Get primary image of a variant
export const getPrimaryImage = async (req, res) => {
  try {
    const { variantId } = req.params;
    const image = await VariantImage.getPrimaryByVariant(variantId);
    
    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'No primary image found for this variant'
      });
    }

    res.json({
      success: true,
      data: image
    });
  } catch (error) {
    console.error('Error getting primary image:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error.message 
    });
  }
};

// Set image as primary
export const setPrimaryImage = async (req, res) => {
  try {
    const { imageId } = req.params;
    
    const image = await VariantImage.getById(imageId);
    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }

    // Unset other primary images for this variant
    const allImages = await VariantImage.listByVariant(image.variant_id);
    for (const img of allImages) {
      if (img.is_primary && img.image_id !== parseInt(imageId)) {
        await VariantImage.updatePrimary(img.image_id, false);
      }
    }

    // Set this image as primary
    await VariantImage.updatePrimary(imageId, true);

    res.json({
      success: true,
      message: 'Image set as primary successfully'
    });
  } catch (error) {
    console.error('Error setting primary image:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error.message 
    });
  }
};

// Update image metadata
export const updateImageMetadata = async (req, res) => {
  try {
    const { imageId } = req.params;
    const { alt_text, display_order } = req.body;

    const image = await VariantImage.getById(imageId);
    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }

    const updated = await VariantImage.update(imageId, {
      alt_text: alt_text !== undefined ? alt_text : image.alt_text,
      display_order: display_order !== undefined ? parseInt(display_order) : image.display_order
    });

    if (!updated) {
      return res.status(500).json({
        success: false,
        message: 'Failed to update image metadata'
      });
    }

    const updatedImage = await VariantImage.getById(imageId);

    res.json({
      success: true,
      message: 'Image metadata updated successfully',
      data: updatedImage
    });
  } catch (error) {
    console.error('Error updating image metadata:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error.message 
    });
  }
};

// Delete variant image
export const deleteVariantImage = async (req, res) => {
  try {
    const { imageId } = req.params;
    
    const image = await VariantImage.getById(imageId);
    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }

    // Delete file from disk
    const diskPath = mapPublicUrlToDiskPath(image.image_url);
    
    if (diskPath) {
      const fs = await import('fs/promises');
      try {
        await fs.unlink(diskPath);
      } catch (err) {
        if (err.code !== 'ENOENT') {
          console.error('Error deleting file from disk:', err);
        }
      }
    }

    // Delete from database
    const deleted = await VariantImage.delete(imageId);
    
    if (!deleted) {
      return res.status(500).json({
        success: false,
        message: 'Failed to delete image from database'
      });
    }

    res.json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting variant image:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error.message 
    });
  }
};

// Bulk upload images for variant
export const bulkUploadImages = async (req, res) => {
  try {
    const { variantId } = req.params;
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: 'No files uploaded' 
      });
    }

    const uploadedImages = [];
    let primarySet = false;

    // Check if variant already has a primary image
    const existingPrimary = await VariantImage.getPrimaryByVariant(variantId);
    if (existingPrimary) {
      primarySet = true;
    }

    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      const imageUrl = getPublicUrlForVariant(variantId, file.filename);
      const isPrimary = !primarySet && i === 0; // First image becomes primary if no primary exists

      const imageId = await VariantImage.create({
        variant_id: variantId,
        image_url: imageUrl,
        alt_text: null,
        is_primary: isPrimary,
        display_order: i
      });

      if (isPrimary) {
        primarySet = true;
      }

      uploadedImages.push({
        image_id: imageId,
        image_url: imageUrl,
        is_primary: isPrimary,
        display_order: i
      });
    }

    res.status(200).json({
      success: true,
      message: `${uploadedImages.length} images uploaded successfully`,
      data: uploadedImages
    });
  } catch (error) {
    console.error('Error bulk uploading images:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error.message 
    });
  }
};
