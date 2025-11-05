import Attribute from '../models/Attribute.js';
import AttributeValue from '../models/AttributeValue.js';

export const createAttribute = async (req, res) => {
  try {
    const { attribute_name } = req.body; // nhận từ client
    const existingAttribute = await Attribute.getByName(attribute_name);
        if (existingAttribute) {
            return res.status(409).json({
                success: false,
                message: "Attribute đã tồn tại"
            });
        }

    const attributeId = await Attribute.create({
      attributeName: attribute_name, // map sang camelCase
    });
    const attribute = await Attribute.getById(attributeId);
    res.status(201).json(attribute);
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
    res.json(attribute);
  } catch (error) {
    console.error('Error getting attribute:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateAttribute = async (req, res) => {
  try {
    const updated = await Attribute.update(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ message: 'Attribute not found' });
    }
    const attribute = await Attribute.getById(req.params.id);
    res.json(attribute);
  } catch (error) {
    console.error('Error updating attribute:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteAttribute = async (req, res) => {
  try {
    const deleted = await Attribute.delete(req.params.attributeName);
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
    const result = await Attribute.list(req.query);
    res.json(result);
  } catch (error) {
    console.error('Error listing attributes:', error);
    res.status(500).json({ message: 'Internal server error' });
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

// Attribute Value Controllers
export const createAttributeValue = async (req, res) => {
  try {
    const valueId = await AttributeValue.create(req.body);
    const value = await AttributeValue.getById(valueId);
    res.status(201).json(value);
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
    const updated = await AttributeValue.update(req.params.id, req.body);
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
    const values = await AttributeValue.getByAttributeId(req.params.attributeId);
    res.json(values);
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
