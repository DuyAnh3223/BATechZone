import CompatibilityService from '../services/compatibility.service.js';

class CompatibilityController {

    // ============================================
    // BuildPC Compatibility
    // ============================================

    /**
     * POST /api/compatibility/filters
     * Get compatibility filters for BuildPC
     */
    async getCompatibilityFilters(req, res) {
        try {
            const { targetCategoryId, selectedComponents } = req.body;

            if (!targetCategoryId) {
                return res.status(400).json({
                    success: false,
                    message: 'targetCategoryId is required'
                });
            }

            const filters = await CompatibilityService.getCompatibilityFilters(
                targetCategoryId,
                selectedComponents || {}
            );

            return res.json({
                success: true,
                data: {
                    targetCategoryId,
                    filters,
                    count: filters.length
                }
            });

        } catch (error) {
            console.error('[CompatibilityController: getCompatibilityFilters]', error);
            return res.status(500).json({
                success: false,
                message: error.message || 'Internal server error'
            });
        }
    }

    /**
     * POST /api/compatibility/validate
     * Validate complete build compatibility
     */
    async validateBuild(req, res) {
        try {
            const { selectedComponents } = req.body;

            if (!selectedComponents || Object.keys(selectedComponents).length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'selectedComponents is required and must not be empty'
                });
            }

            const result = await CompatibilityService.validateBuild(selectedComponents);

            return res.json({
                success: true,
                data: result
            });

        } catch (error) {
            console.error('[CompatibilityController: validateBuild]', error);
            return res.status(500).json({
                success: false,
                message: error.message || 'Internal server error'
            });
        }
    }

    // ============================================
    // Rules Management
    // ============================================

    /**
     * GET /api/compatibility/rules
     * Get all compatibility rules
     */
    async getAllRules(req, res) {
        try {
            const rules = await CompatibilityService.loadAllRules();

            const activeOnly = req.query.active === 'true';
            const filteredRules = activeOnly ? rules.filter(r => r.is_active === 1) : rules;

            return res.json({
                success: true,
                data: {
                    rules: filteredRules,
                    count: filteredRules.length,
                    total: rules.length
                }
            });

        } catch (error) {
            console.error('[CompatibilityController: getAllRules]', error);
            return res.status(500).json({
                success: false,
                message: error.message || 'Internal server error'
            });
        }
    }

    /**
     * POST /api/compatibility/rules
     * Create a new compatibility rule
     */
    async createRule(req, res) {
        try {
            const ruleData = req.body;

            // Validate using service method
            const validation = CompatibilityService.validateRuleData(ruleData);
            if (!validation.valid) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: validation.errors
                });
            }

            const ruleId = await CompatibilityService.createRule(ruleData);

            return res.status(201).json({
                success: true,
                data: {
                    ruleId,
                    message: 'Rule created successfully'
                }
            });

        } catch (error) {
            console.error('[CompatibilityController: createRule]', error);
            return res.status(500).json({
                success: false,
                message: error.message || 'Internal server error'
            });
        }
    }

    /**
     * GET /api/compatibility/rules/:ruleId
     * Get rule by ID
     */
    async getRuleById(req, res) {
        try {
            const ruleId = parseInt(req.params.ruleId);

            if (isNaN(ruleId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid rule ID'
                });
            }

            const rule = await CompatibilityService.getRuleById(ruleId);

            if (!rule) {
                return res.status(404).json({
                    success: false,
                    message: 'Rule not found'
                });
            }

            return res.json({
                success: true,
                data: rule
            });

        } catch (error) {
            console.error('[CompatibilityController: getRuleById]', error);
            return res.status(500).json({
                success: false,
                message: error.message || 'Internal server error'
            });
        }
    }

    /**
     * PUT /api/compatibility/rules/:ruleId
     * Update an existing rule
     */
    async updateRule(req, res) {
        try {
            const ruleId = parseInt(req.params.ruleId);
            const ruleData = req.body;

            if (isNaN(ruleId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid rule ID'
                });
            }

            const updated = await CompatibilityService.updateRule(ruleId, ruleData);

            if (!updated) {
                return res.status(404).json({
                    success: false,
                    message: 'Rule not found or no changes made'
                });
            }

            return res.json({
                success: true,
                data: {
                    message: 'Rule updated successfully'
                }
            });

        } catch (error) {
            console.error('[CompatibilityController: updateRule]', error);
            return res.status(500).json({
                success: false,
                message: error.message || 'Internal server error'
            });
        }
    }

    /**
     * DELETE /api/compatibility/rules/:ruleId
     * Soft delete a rule
     */
    async deleteRule(req, res) {
        try {
            const ruleId = parseInt(req.params.ruleId);

            if (isNaN(ruleId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid rule ID'
                });
            }

            const deleted = await CompatibilityService.deleteRule(ruleId);

            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: 'Rule not found'
                });
            }

            return res.json({
                success: true,
                data: {
                    message: 'Rule deleted successfully'
                }
            });

        } catch (error) {
            console.error('[CompatibilityController: deleteRule]', error);
            return res.status(500).json({
                success: false,
                message: error.message || 'Internal server error'
            });
        }
    }

    // ============================================
    // Rule Values Management
    // ============================================

    /**
     * GET /api/compatibility/rules/:ruleId/values
     * Get all values for a rule
     */
    async getRuleValues(req, res) {
        try {
            const ruleId = parseInt(req.params.ruleId);

            if (isNaN(ruleId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid rule ID'
                });
            }

            const values = await CompatibilityService.getRuleValues(ruleId);

            return res.json({
                success: true,
                data: {
                    ruleId,
                    values,
                    count: values.length
                }
            });

        } catch (error) {
            console.error('[CompatibilityController: getRuleValues]', error);
            
            if (error.message.includes('not found')) {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }

            return res.status(500).json({
                success: false,
                message: error.message || 'Internal server error'
            });
        }
    }

    /**
     * POST /api/compatibility/rules/:ruleId/values
     * Add a value pair to a rule
     */
    async addRuleValue(req, res) {
         try {
            const ruleId = parseInt(req.params.ruleId);
            // ✅ CHANGE: Nhận attribute_value IDs
            const { attribute_value_1_id, attribute_value_2_id } = req.body;

            if (isNaN(ruleId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid rule ID'
                });
            }

            // ✅ CHANGE: Validate IDs thay vì strings
            if (! attribute_value_1_id || !attribute_value_2_id) {
                return res.status(400).json({
                    success: false,
                    message: 'Both attribute_value_1_id and attribute_value_2_id are required'
                });
            }

            if (typeof attribute_value_1_id !== 'number' || typeof attribute_value_2_id !== 'number') {
                return res. status(400).json({
                    success: false,
                    message: 'attribute_value_1_id and attribute_value_2_id must be numbers'
                });
            }

            // ✅ CHANGE: Pass IDs to service
            const valueId = await CompatibilityService.addRuleValue(
                ruleId, 
                attribute_value_1_id, 
                attribute_value_2_id
            );

            return res.status(201).json({
                success: true,
                data: {
                    valueId,
                    message: 'Value pair added successfully'
                }
            });
        } catch (error) {
            console.error('[CompatibilityController: addRuleValue]', error);
            
            if (error.message.includes('not found')) {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }

            return res.status(500).json({
                success: false,
                message: error.message || 'Internal server error'
            });
        }
    }

    /**
     * DELETE /api/compatibility/values/:valueId
     * Delete a value pair
     */
    async deleteRuleValue(req, res) {
        try {
            const valueId = parseInt(req.params.valueId);

            if (isNaN(valueId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid value ID'
                });
            }

            const deleted = await CompatibilityService.deleteRuleValue(valueId);

            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: 'Value not found'
                });
            }

            return res.json({
                success: true,
                data: {
                    message: 'Value deleted successfully'
                }
            });

        } catch (error) {
            console.error('[CompatibilityController: deleteRuleValue]', error);
            return res.status(500).json({
                success: false,
                message: error.message || 'Internal server error'
            });
        }
    }

    // ============================================
    // Helper Endpoints
    // ============================================

    /**
     * GET /api/compatibility/attributes/:attributeId/values
     * Get all possible values for an attribute
     */
    async getAttributeValues(req, res) {
        try {
            const attributeId = parseInt(req.params.attributeId);

            if (isNaN(attributeId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid attribute ID'
                });
            }

            const values = await CompatibilityService.getAttributeValues(attributeId);

            return res.json({
                success: true,
                data: {
                    attributeId,
                    values,
                    count: values.length
                }
            });

        } catch (error) {
            console.error('[CompatibilityController: getAttributeValues]', error);
            return res.status(500).json({
                success: false,
                message: error.message || 'Internal server error'
            });
        }
    }

}

export default new CompatibilityController();
