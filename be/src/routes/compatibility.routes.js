import express from 'express';
import compatibilityController from '../controllers/compatibility.controller.js';

const router = express.Router();

// ============================================
// BuildPC Compatibility Routes
// ============================================

/**
 * POST /api/compatibility/filters
 * Get compatibility filters for BuildPC
 * Body: { targetCategoryId: number, selectedComponents: { categoryId: variantId, ... } }
 */
router.post('/filters', (req, res) => compatibilityController.getCompatibilityFilters(req, res));

/**
 * POST /api/compatibility/validate
 * Validate complete build compatibility
 * Body: { selectedComponents: { categoryId: variantId, ... } }
 */
router.post('/validate', (req, res) => compatibilityController.validateBuild(req, res));

// ============================================
// Rules Management Routes
// ============================================

/**
 * GET /api/compatibility/rules
 * Get all compatibility rules
 * Query: ?active=true (optional, filter active rules only)
 */
router.get('/rules', (req, res) => compatibilityController.getAllRules(req, res));

/**
 * POST /api/compatibility/rules
 * Create a new compatibility rule
 * Body: { rule_name, category_1_id, attribute_1_id, category_2_id, attribute_2_id, match_type, is_active, note }
 */
router.post('/rules', (req, res) => compatibilityController.createRule(req, res));

/**
 * GET /api/compatibility/rules/:ruleId
 * Get rule by ID
 */
router.get('/rules/:ruleId', (req, res) => compatibilityController.getRuleById(req, res));

/**
 * PUT /api/compatibility/rules/:ruleId
 * Update an existing rule
 * Body: { rule_name, category_1_id, attribute_1_id, category_2_id, attribute_2_id, match_type, is_active, note }
 */
router.put('/rules/:ruleId', (req, res) => compatibilityController.updateRule(req, res));

/**
 * DELETE /api/compatibility/rules/:ruleId
 * Soft delete a rule (set is_active = 0)
 */
router.delete('/rules/:ruleId', (req, res) => compatibilityController.deleteRule(req, res));

// ============================================
// Rule Values Management Routes
// ============================================

/**
 * GET /api/compatibility/rules/:ruleId/values
 * Get all value pairs for a rule
 */
router.get('/rules/:ruleId/values', (req, res) => compatibilityController.getRuleValues(req, res));

/**
 * POST /api/compatibility/rules/:ruleId/values
 * Add a value pair to a rule
 * Body: { attribute_value_1_id:  number, attribute_value_2_id: number }
 */
router.post('/rules/:ruleId/values', (req, res) => compatibilityController.addRuleValue(req, res));

/**
 * DELETE /api/compatibility/values/:valueId
 * Delete a value pair
 */
router.delete('/values/:valueId', (req, res) => compatibilityController.deleteRuleValue(req, res));

// ============================================
// Helper Routes
// ============================================

/**
 * GET /api/compatibility/attributes/:attributeId/values
 * Get all possible values for an attribute
 */
router.get('/attributes/:attributeId/values', (req, res) => compatibilityController.getAttributeValues(req, res));

export default router;
