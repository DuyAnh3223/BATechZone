import Attribute from '../models/Attribute.js';


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

