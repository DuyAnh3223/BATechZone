import AttributeValueService from '../services/attributeValue.services.js';

export const createAttributeValue = async (req, res) => {
  try {
    const value = await AttributeValueService.createAttributeValue(req.body);
    res.status(201).json(value);
  } catch (error) {
    console.error('Error creating attribute value:', error);
    res.status(400).json({ message: error.message });
  }
};

export const getAttributeValue = async (req, res) => {
  try {
    const value = await AttributeValueService.getAttributeValueById(req.params.id);
    res.json(value);
  } catch (error) {
    console.error('Error getting attribute value:', error);
    res.status(error.message === 'Không tìm thấy giá trị thuộc tính' ? 404 : 500).json({ message: error.message });
  }
};

export const updateAttributeValue = async (req, res) => {
  try {
    const value = await AttributeValueService.updateAttributeValue(req.params.id, req.body);
    res.json(value);
  } catch (error) {
    console.error('Error updating attribute value:', error);
    res.status(error.message === 'Không tìm thấy giá trị thuộc tính' ? 404 : 500).json({ message: error.message });
  }
};

export const deleteAttributeValue = async (req, res) => {
  try {
    await AttributeValueService.deleteAttributeValue(req.params.id);
    res.json({ message: 'Attribute value deleted successfully' });
  } catch (error) {
    console.error('Error deleting attribute value:', error);
    res.status(error.message === 'Không tìm thấy giá trị thuộc tính' ? 404 : 500).json({ message: error.message });
  }
};

export const listAttributeValues = async (req, res) => {
  try {
    const result = await AttributeValueService.listAttributeValues(req.query);
    res.json(result);
  } catch (error) {
    console.error('Error listing attribute values:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getAttributeValues = async (req, res) => {
  try {
    const result = await AttributeValueService.getAttributeValues(req.params.attributeId, req.query);
    res.json(result);
  } catch (error) {
    console.error('Error getting attribute values:', error);
    res.status(500).json({ message: error.message });
  }
};

export const bulkCreateAttributeValues = async (req, res) => {
  try {
    const count = await AttributeValueService.bulkCreateAttributeValues(req.body);
    res.status(201).json({ 
      message: 'Attribute values created successfully',
      count
    });
  } catch (error) {
    console.error('Error bulk creating attribute values:', error);
    res.status(400).json({ message: error.message });
  }
};

export const bulkDeleteAttributeValues = async (req, res) => {
  try {
    const count = await AttributeValueService.bulkDeleteAttributeValues(req.body.valueIds);
    res.json({ 
      message: 'Attribute values deleted successfully',
      count
    });
  } catch (error) {
    console.error('Error bulk deleting attribute values:', error);
    res.status(400).json({ message: error.message });
  }
};

export const getAttributeValuesByProductCategory = async (req, res) => {
  try {
    const values = await AttributeValueService.getAttributeValuesByProductCategory(req.params.productId);
    res.json({ success: true, data: values });
  } catch (error) {
    console.error('Error getting attribute values by product category:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
