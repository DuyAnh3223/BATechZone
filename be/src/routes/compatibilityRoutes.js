import express from 'express';
import CompatibilityService from '../services/compatibilityService.js';

const router = express.Router();

/**
 * POST /api/compatibility/filters
 * Get compatibility filters for a component type based on selected components
 * Body: { targetType: 'cpu|mainboard|ram|vga|case', selectedComponents: { cpu: variantId, mainboard: variantId, ... } }
 */
router.post('/filters', async (req, res) => {
  try {
    const { targetType, selectedComponents } = req.body;

    if (!targetType) {
      return res.status(400).json({
        success: false,
        message: 'targetType is required'
      });
    }

    const result = await CompatibilityService.getCompatibilityFilters(
      targetType,
      selectedComponents || {}
    );

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Error getting compatibility filters:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

/**
 * POST /api/compatibility/validate
 * Validate complete build compatibility
 * Body: { selectedComponents: { cpu: variantId, mainboard: variantId, ram: variantId, vga: variantId, case: variantId } }
 */
router.post('/validate', async (req, res) => {
  try {
    const { selectedComponents } = req.body;

    if (!selectedComponents || Object.keys(selectedComponents).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'selectedComponents is required'
      });
    }

    const result = await CompatibilityService.validateBuild(selectedComponents);

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Error validating build:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

export default router;
