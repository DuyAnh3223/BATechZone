import AttributeValue from '../models/AttributeValue.js';

// Attribute Value Controllers
export const createAttributeValue = async (req, res) => {
  try {
    const { 
      value_name, 
      attribute_id, 
      color_code, 
      image_url, 
      display_order, 
      is_active 
    } = req.body;
    
    const attributeValueId = await AttributeValue.create({
      attributeId: attribute_id,
      valueName: value_name,
      colorCode: color_code,
      imageUrl: image_url,
      displayOrder: display_order,
      isActive: is_active
    });
    
    const attributeValue = await AttributeValue.getById(attributeValueId);
    res.status(201).json(attributeValue);
  } catch (error) {
    console.error('Error creating attribute value:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAttributeValue = async (req, res) => {
  try {
    const value = await AttributeValue.getById(req.params.id);
    if (!value) {
      return res.status(404).json({ message: 'Attribute value not found' });
    }
    res.json(value);
  } catch (error) {
    console.error('Error getting attribute value:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateAttributeValue = async (req, res) => {
  try {
    const { value_name, color_code, image_url, display_order, is_active } = req.body;
    const valueData = {
      valueName: value_name,
      colorCode: color_code,
      imageUrl: image_url,
      displayOrder: display_order,
      isActive: is_active
    };

    const updated = await AttributeValue.update(req.params.id, valueData);
    if (!updated) {
      return res.status(404).json({ message: 'Attribute value not found' });
    }

    const value = await AttributeValue.getById(req.params.id);
    res.json(value);
  } catch (error) {
    console.error('Error updating attribute value:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


export const deleteAttributeValue = async (req, res) => {
  try {
    const deleted = await AttributeValue.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Attribute value not found' });
    }
    res.json({ message: 'Attribute value deleted successfully' });
  } catch (error) {
    console.error('Error deleting attribute value:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const listAttributeValues = async (req, res) => {
  try {
    const result = await AttributeValue.list(req.query);
    res.json(result);
  } catch (error) {
    console.error('Error listing attribute values:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAttributeValues = async (req, res) => {
  try {
    const { page, limit, sortBy, sortOrder } = req.query;
    const result = await AttributeValue.getByAttributeId(req.params.attributeId, {
      page: page || 1,
      limit: limit || 10,
      sortBy,
      sortOrder
    });
    res.json(result);
  } catch (error) {
    console.error('Error getting attribute values:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const bulkCreateAttributeValues = async (req, res) => {
  try {
    const count = await AttributeValue.bulkCreate(req.body);
    res.status(201).json({ 
      message: 'Attribute values created successfully',
      count
    });
  } catch (error) {
    console.error('Error bulk creating attribute values:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const bulkDeleteAttributeValues = async (req, res) => {
  try {
    const count = await AttributeValue.bulkDelete(req.body.valueIds);
    res.json({ 
      message: 'Attribute values deleted successfully',
      count
    });
  } catch (error) {
    console.error('Error bulk deleting attribute values:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};