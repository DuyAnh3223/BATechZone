import AttributeService from '../services/attribute.services.js';

export const createAttribute = async (req, res) => {
  try {
    const result = await AttributeService.createAttribute(req.body);
    const attribute = await AttributeService.getAttributeById(result.attributeId);
    
    res.status(201).json({
      ...attribute,
      message: result.isExisting 
        ? 'Đã gán danh mục cho thuộc tính có sẵn' 
        : 'Tạo thuộc tính mới thành công'
    });
  } catch (error) {
    console.error('Error creating attribute:', error);
    res.status(400).json({ message: error.message });
  }
};

export const getAttribute = async (req, res) => {
  try {
    const attribute = await AttributeService.getAttributeById(req.params.id);
    res.json(attribute);
  } catch (error) {
    console.error('Error getting attribute:', error);
    res.status(error.message === 'Không tìm thấy thuộc tính' ? 404 : 500).json({ message: error.message });
  }
};

export const deleteAttribute = async (req, res) => {
  try {
    await AttributeService.deleteAttribute(req.params.id);
    res.json({ message: 'Attribute deleted successfully' });
  } catch (error) {
    console.error('Error deleting attribute:', error);
    res.status(error.message === 'Không tìm thấy thuộc tính' ? 404 : 500).json({ message: error.message });
  }
};

export const listAttributes = async (req, res) => {
  try {
    const result = await AttributeService.listAttributes(req.query);
    res.json(result);
  } catch (error) {
    console.error('Error listing attributes:', error);
    res.status(500).json({ message: error.message });
  }
};

export const updateAttribute = async (req, res) => {
  try {
    await AttributeService.updateAttribute(req.params.id, req.body);
    const attribute = await AttributeService.getAttributeById(req.params.id);
    res.json(attribute);
  } catch (error) {
    console.error('Error updating attribute:', error);
    res.status(error.message === 'Không tìm thấy thuộc tính' ? 404 : 500).json({ message: error.message });
  }
};

export const updateAttributeCategories = async (req, res) => {
  try {
    const categories = await AttributeService.updateAttributeCategories(req.params.id, req.body.category_ids);
    res.json({
      success: true,
      message: 'Categories updated successfully',
      categories
    });
  } catch (error) {
    console.error('Error updating attribute categories:', error);
    res.status(400).json({ message: error.message });
  }
};

export const getAttributeCategories = async (req, res) => {
  try {
    const categories = await AttributeService.getAttributeCategories(req.params.id);
    res.json({ categories });
  } catch (error) {
    console.error('Error getting attribute categories:', error);
    res.status(500).json({ message: error.message });
  }
};

export const removeAttributeCategory = async (req, res) => {
  try {
    const { id: attributeId, categoryId } = req.params;
    await AttributeService.removeAttributeCategory(attributeId, categoryId);
    res.json({
      success: true,
      message: 'Category removed successfully'
    });
  } catch (error) {
    console.error('Error removing attribute category:', error);
    res.status(500).json({ message: error.message });
  }
};

