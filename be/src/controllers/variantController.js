import Variant from '../models/Variant.js';

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
    const updated = await Variant.update(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ message: 'Variant not found' });
    }
    const variant = await Variant.getById(req.params.id);
    res.json(variant);
  } catch (error) {
    console.error('Error updating variant:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Duplicate variant' });
    }
    res.status(500).json({ message: 'Internal server error' });
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
    const variants = await Variant.getByProductId(req.params.productId);
    res.json(variants);
  } catch (error) {
    console.error('Error getting variants by product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
