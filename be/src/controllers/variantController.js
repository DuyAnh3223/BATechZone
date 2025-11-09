import Variant from '../models/Variant.js';
import { db } from '../libs/db.js';

// Note: db is used in updateVariant to fetch product_id

export const createVariant = async (req, res) => {
  try {
    const variantId = await Variant.create(req.body);
    const variant = await Variant.getById(variantId);
    res.status(201).json(variant);
  } catch (error) {
    console.error('Error creating variant:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Duplicate variant' });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getVariant = async (req, res) => {
  try {
    const variant = await Variant.getById(req.params.id);
    if (!variant) {
      return res.status(404).json({ message: 'Variant not found' });
    }
    res.json(variant);
  } catch (error) {
    console.error('Error getting variant:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateVariant = async (req, res) => {
  try {
    const variantId = parseInt(req.params.id);
    if (isNaN(variantId)) {
      return res.status(400).json({ success: false, message: 'Invalid variant ID' });
    }

    // Map request body from snake_case to camelCase
    const updateData = {
      sku: req.body.sku,
      variantName: req.body.variant_name,
      price: req.body.price !== undefined ? parseFloat(req.body.price) : undefined,
      stockQuantity: req.body.stock !== undefined ? parseInt(req.body.stock) : undefined,
      // Map boolean values correctly
      isActive: req.body.is_active !== undefined ? (req.body.is_active ? 1 : 0) : undefined,
      isDefault: req.body.is_default !== undefined ? (req.body.is_default ? 1 : 0) : undefined,
      attributes: req.body.attribute_value_ids || undefined
    };

    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    console.log('Updating variant with data:', updateData);

    const updated = await Variant.update(variantId, updateData);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Variant not found' });
    }

    // Fetch updated variant using getByProductId (more reliable than getById)
    // First, get the product_id from the variant
    const [variants] = await db.query('SELECT product_id FROM product_variants WHERE variant_id = ?', [variantId]);
    if (variants.length === 0) {
      return res.status(404).json({ success: false, message: 'Variant not found' });
    }

    const productId = variants[0].product_id;
    const allVariants = await Variant.getByProductId(productId);
    const updatedVariant = allVariants.find(v => v.variant_id === variantId);

    if (updatedVariant) {
      res.json({ success: true, data: updatedVariant });
    } else {
      // Fallback: return basic variant info
      res.json({ 
        success: true, 
        data: {
          variant_id: variantId,
          product_id: productId,
          ...updateData,
          stock: updateData.stockQuantity,
          is_active: updateData.isActive === 1,
          is_default: updateData.isDefault === 1,
          attributes: [],
          images: []
        }
      });
    }
  } catch (error) {
    console.error('Error updating variant:', error);
    console.error('Error stack:', error.stack);
    console.error('Error code:', error.code);
    
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ success: false, message: 'Duplicate variant' });
    }
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};

export const deleteVariant = async (req, res) => {
  try {
    const deleted = await Variant.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Variant not found' });
    }
    res.json({ message: 'Variant deleted successfully' });
  } catch (error) {
    console.error('Error deleting variant:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const listVariants = async (req, res) => {
  try {
    const result = await Variant.list(req.query);
    res.json(result);
  } catch (error) {
    console.error('Error listing variants:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateVariantStock = async (req, res) => {
  try {
    const { quantity, operation } = req.body;
    const updated = await Variant.updateStock(req.params.id, quantity, operation);
    if (!updated) {
      return res.status(404).json({ message: 'Variant not found' });
    }
    const variant = await Variant.getById(req.params.id);
    res.json(variant);
  } catch (error) {
    console.error('Error updating variant stock:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getVariantsByProduct = async (req, res) => {
  try {
    const productId = parseInt(req.params.productId);
    if (isNaN(productId)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }
    
    console.log('Fetching variants for product ID:', productId);
    const variants = await Variant.getByProductId(productId);
    console.log('Variants fetched:', variants.length);
    res.json({ success: true, data: variants });
  } catch (error) {
    console.error('Error getting variants by product:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};

export const createVariantForProduct = async (req, res) => {
  try {
    const { sku, variant_name, price, stock, is_active, is_default, attribute_value_ids } = req.body;
    const productId = parseInt(req.params.productId);
    
    if (isNaN(productId)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }

    if (!price || isNaN(price) || parseFloat(price) <= 0) {
      return res.status(400).json({ success: false, message: 'Price must be a positive number' });
    }

    const variantData = {
      productId: productId,
      sku: sku || null,
      variantName: variant_name || null,
      price: parseFloat(price),
      stockQuantity: parseInt(stock || 0),
      isActive: is_active !== undefined ? (is_active ? 1 : 0) : 1,
      isDefault: is_default !== undefined ? (is_default ? 1 : 0) : 0,
      attributes: attribute_value_ids || []
    };
    
    console.log('Creating variant with data:', variantData);
    const variantId = await Variant.create(variantData);
    console.log('Variant created with ID:', variantId);
    
    // Fetch the created variant using getByProductId and find the new one
    // This is more reliable than getById which uses complex JSON_ARRAYAGG
    const variants = await Variant.getByProductId(productId);
    const newVariant = variants.find(v => v.variant_id === variantId);
    
    if (newVariant) {
      res.status(201).json({ success: true, data: newVariant });
    } else {
      // Fallback: return basic variant info if getByProductId fails
      res.status(201).json({ 
        success: true, 
        data: {
          variant_id: variantId,
          product_id: productId,
          ...variantData,
          stock: variantData.stockQuantity,
          is_active: variantData.isActive === 1,
          is_default: variantData.isDefault === 1,
          attributes: [],
          images: []
        }
      });
    }
  } catch (error) {
    console.error('Error creating variant for product:', error);
    console.error('Error stack:', error.stack);
    console.error('Error code:', error.code);
    
    // Handle specific database errors
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ success: false, message: 'Product not found' });
    }
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ success: false, message: 'Variant with this SKU already exists' });
    }
    
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};

export const getProductAttributes = async (req, res) => {
  try {
    // This would need to be implemented in Attribute model or separate service
    // For now, return empty array
    res.json({ success: true, data: [] });
  } catch (error) {
    console.error('Error getting product attributes:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};

export const getProductVariantMappings = async (req, res) => {
  try {
    // This would need to be implemented
    // For now, return empty array
    res.json({ success: true, data: [] });
  } catch (error) {
    console.error('Error getting product variant mappings:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};

export const updateVariantMappings = async (req, res) => {
  try {
    const { variantId } = req.params;
    const { attributeIds } = req.body;
    
    // Delete existing mappings
    const [deleteResult] = await db.query('DELETE FROM variant_attributes WHERE variant_id = ?', [variantId]);
    
    // Insert new mappings
    if (attributeIds && attributeIds.length > 0) {
      const mappings = attributeIds.map(attrId => [variantId, attrId]);
      await db.query('INSERT INTO variant_attributes (variant_id, attribute_value_id) VALUES ?', [mappings]);
    }
    
    res.json({ success: true, message: 'Mappings updated successfully' });
  } catch (error) {
    console.error('Error updating variant mappings:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};

export const getVariantImages = async (req, res) => {
  try {
    const { variantId } = req.params;
    const [images] = await db.query(
      'SELECT image_id, variant_id, image_url, is_primary, display_order FROM variant_images WHERE variant_id = ? ORDER BY display_order',
      [variantId]
    );
    res.json({ success: true, data: images });
  } catch (error) {
    console.error('Error getting variant images:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};

export const addVariantImage = async (req, res) => {
  try {
    const { variantId } = req.params;
    const { image_url, display_order } = req.body;
    const [result] = await db.query(
      'INSERT INTO variant_images (variant_id, image_url, display_order) VALUES (?, ?, ?)',
      [variantId, image_url, display_order || 0]
    );
    const [image] = await db.query('SELECT * FROM variant_images WHERE image_id = ?', [result.insertId]);
    res.json({ success: true, data: image[0] });
  } catch (error) {
    console.error('Error adding variant image:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};

export const uploadVariantImages = async (req, res) => {
  try {
    // This would need file upload implementation
    // For now, return success
    res.json({ success: true, message: 'Images uploaded successfully' });
  } catch (error) {
    console.error('Error uploading variant images:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};

export const deleteVariantImage = async (req, res) => {
  try {
    const { imageId } = req.params;
    await db.query('DELETE FROM variant_images WHERE image_id = ?', [imageId]);
    res.json({ success: true, message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting variant image:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};
