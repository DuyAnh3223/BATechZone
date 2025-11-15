import Attribute from '../models/Attribute.js';
import AttributeValue from '../models/AttributeValue.js';


export const createAttribute = async (req, res) => {
  try {
    const { attribute_name, category_ids, values } = req.body; // nhận từ client
    
    // Check if attribute already exists
    let existingAttribute = await Attribute.getByName(attribute_name);
    let attributeId;

    if (existingAttribute) {
      // Attribute exists, just add new categories to it
      attributeId = existingAttribute.attribute_id;
      
      // Assign new categories if provided
      if (category_ids && Array.isArray(category_ids) && category_ids.length > 0) {
        // Get existing categories
        const existingCategories = await Attribute.getCategories(attributeId);
        const existingCategoryIds = existingCategories.map(c => c.category_id);
        
        // Filter out categories that are already assigned
        const newCategoryIds = category_ids.filter(id => !existingCategoryIds.includes(id));
        
        if (newCategoryIds.length > 0) {
          await Attribute.assignCategories(attributeId, newCategoryIds);
        }
      }

      // If values were provided, create them for existing attribute
      if (values && Array.isArray(values) && values.length > 0) {
        for (const v of values) {
          // v can be { value_name, color_code, image_url }
          await AttributeValue.create({
            attributeId,
            valueName: v.value_name || v.value || null,
            colorCode: v.color_code || v.colorCode || null,
            imageUrl: v.image_url || v.imageUrl || null
          });
        }
      }
    } else {
      // Create new attribute
      attributeId = await Attribute.create({
        attributeName: attribute_name, // map sang camelCase
      });

      // Assign categories if provided
      if (category_ids && Array.isArray(category_ids) && category_ids.length > 0) {
        await Attribute.assignCategories(attributeId, category_ids);
      }

      // If values provided when creating attribute, create them
      if (values && Array.isArray(values) && values.length > 0) {
        for (const v of values) {
          await AttributeValue.create({
            attributeId,
            valueName: v.value_name || v.value || null,
            colorCode: v.color_code || v.colorCode || null,
            imageUrl: v.image_url || v.imageUrl || null
          });
        }
      }
    }

    const attribute = await Attribute.getById(attributeId);
    const categories = await Attribute.getCategories(attributeId);

    res.status(201).json({
      ...attribute,
      categories,
      message: existingAttribute 
        ? 'Đã gán danh mục cho thuộc tính có sẵn' 
        : 'Tạo thuộc tính mới thành công'
    });
  } catch (error) {
    console.error('Error creating attribute:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAttribute = async (req, res) => {
  try {
    const attribute = await Attribute.getById(req.params.id);
    if (!attribute) {
      return res.status(404).json({ message: 'Attribute not found' });
    }
    const categories = await Attribute.getCategories(req.params.id);
    res.json({
      ...attribute,
      categories
    });
  } catch (error) {
    console.error('Error getting attribute:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteAttribute = async (req, res) => {
  try {
    const deleted = await Attribute.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Attribute not found' });
    }
    res.json({ message: 'Attribute deleted successfully' });
  } catch (error) {
    console.error('Error deleting attribute:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const listAttributes = async (req, res) => {
  try {
    console.log('Listing attributes with params:', req.query);
    const result = await Attribute.list(req.query);
    console.log('Attributes result:', result);
    res.json(result);
  } catch (error) {
    console.error('Error listing attributes:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const getAttributesByType = async (req, res) => {
  try {
    const attributes = await Attribute.getByType(req.params.type);
    res.json(attributes);
  } catch (error) {
    console.error('Error getting attributes by type:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update attribute (name, optionally create values)
export const updateAttribute = async (req, res) => {
  try {
    const attributeId = req.params.id;
    const { attribute_name, values } = req.body;

    // Update attribute basic fields
    const updated = await Attribute.update(attributeId, { attributeName: attribute_name });
    if (!updated) {
      // If nothing updated, still attempt to create values if provided
      // but return 404 if attribute not exist
      const existing = await Attribute.getById(attributeId);
      if (!existing) return res.status(404).json({ message: 'Attribute not found' });
    }

    // If values provided, create them
    if (values && Array.isArray(values) && values.length > 0) {
      // Use AttributeValue model to create values
      const AttributeValue = (await import('../models/AttributeValue.js')).default;
      for (const v of values) {
        await AttributeValue.create({
          attributeId,
          valueName: v.value_name || v.value || null,
          colorCode: v.color_code || v.colorCode || null,
          imageUrl: v.image_url || v.imageUrl || null
        });
      }
    }

    const attribute = await Attribute.getById(attributeId);
    const categories = await Attribute.getCategories(attributeId);
    res.json({ ...attribute, categories });
  } catch (error) {
    console.error('Error updating attribute:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update attribute categories
export const updateAttributeCategories = async (req, res) => {
  try {
    const { category_ids } = req.body;
    const attributeId = req.params.id;

    if (!Array.isArray(category_ids)) {
      return res.status(400).json({ message: 'category_ids must be an array' });
    }

    await Attribute.updateCategories(attributeId, category_ids);
    const categories = await Attribute.getCategories(attributeId);

    res.json({
      success: true,
      message: 'Categories updated successfully',
      categories
    });
  } catch (error) {
    console.error('Error updating attribute categories:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get attribute categories
export const getAttributeCategories = async (req, res) => {
  try {
    const categories = await Attribute.getCategories(req.params.id);
    res.json({ categories });
  } catch (error) {
    console.error('Error getting attribute categories:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Remove a category from attribute
export const removeAttributeCategory = async (req, res) => {
  try {
    const { id: attributeId, categoryId } = req.params;
    const removed = await Attribute.removeCategory(attributeId, categoryId);
    
    if (!removed) {
      return res.status(404).json({ message: 'Category not found for this attribute' });
    }

    res.json({
      success: true,
      message: 'Category removed successfully'
    });
  } catch (error) {
    console.error('Error removing attribute category:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

