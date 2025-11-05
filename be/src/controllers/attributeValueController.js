import AttributeValue from '../models/AttributeValue.js';

// Attribute Value Controllers
export const createAttributeValue = async (req, res) => {
  try {
    const { value_name, attribute_id } = req.body;
    const attributeValueId = await AttributeValue.create({
          attributeId: attribute_id,
          valueName: value_name,
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