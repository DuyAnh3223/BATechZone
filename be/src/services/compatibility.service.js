import CompatibilityDAO from '../daos/compatibility.dao.js';
import ProductDAO from '../daos/product.dao.js';
import { query } from '../libs/db.js';
class CompatibilityService {

    normalize(str) {
        return CompatibilityDAO.normalize(str);
    }

    async loadAllRules() {
        return CompatibilityDAO.getAllRules();
    }

    getAttributeValueFromProduct(product, attributeId) {
        if(!product?.attributes) return null;
        const attribute = product.attributes.find(attr => attr.attribute_id === attributeId);
        return attribute?.value_name || null;
    }

      /**
     * ✅ FIXED: Get compatibility filters for BuildPC
     * @param {number} targetCategoryId - Category đích (VD: 5 = Mainboard)
     * @param {object} selectedComponents - { 1: 4, 35: 30 } = { categoryId: variantId }
     * @returns {Promise<Array>} - Array of filters
     */
    async getCompatibilityFilters(targetCategoryId, selectedComponents) {
    const rules = await this.loadAllRules();
    const filters = [];

    try {
        console.log('🔍 [getCompatibilityFilters] targetCategoryId:', targetCategoryId);

        // Load selected components with full attribute data
        const loadedComponents = {};
        for (const [categoryIdKey, variantId] of Object.entries(selectedComponents)) {
            if (variantId) {
                const product = await ProductDAO.getProductByVariantId(variantId);
                if (product) {
                    loadedComponents[categoryIdKey] = product;
                }
            }
        }

        // Find applicable rules (both directions)
        const applicableRules = rules.filter(rule => 
            rule.is_active === 1 && (
                rule.category_1_id === targetCategoryId || 
                rule.category_2_id === targetCategoryId
            )
        );

        for (const rule of applicableRules) {
            let sourceComponent = null;
            let sourceAttributeId = null;
            let targetAttributeId = null;

            // Determine source and target
            if (rule.category_1_id === targetCategoryId) {
                sourceComponent = loadedComponents[rule.category_2_id];
                sourceAttributeId = rule.attribute_2_id;
                targetAttributeId = rule.attribute_1_id;
            } else {
                sourceComponent = loadedComponents[rule.category_1_id];
                sourceAttributeId = rule.attribute_1_id;
                targetAttributeId = rule.attribute_2_id;
            }

            if (! sourceComponent) continue;

            // Get source attribute_value_id
            const sourceAttribute = sourceComponent.attributes.find(
                attr => attr.attribute_id === sourceAttributeId
            );
            
            if (!sourceAttribute) continue;

            const sourceAttributeValueId = sourceAttribute.attribute_value_id;

            // Get compatible values from compatibility_values table
            const ruleValues = await CompatibilityDAO.getRuleValues(rule.rule_id);
            const compatibleValues = [];

            for (const rv of ruleValues) {
                if (rv.attribute_value_1_id === sourceAttributeValueId) {
                    compatibleValues.push({
                        attribute_value_id: rv.attribute_value_2_id,
                        value_name: rv.value_2_name
                    });
                } else if (rv.attribute_value_2_id === sourceAttributeValueId) {
                    compatibleValues.push({
                        attribute_value_id: rv. attribute_value_1_id,
                        value_name: rv.value_1_name
                    });
                }
            }

            // Remove duplicates
            const uniqueMap = new Map();
            compatibleValues.forEach(cv => {
                uniqueMap.set(cv.attribute_value_id, cv);
            });

            const finalValues = Array.from(uniqueMap.values());

            if (finalValues.length > 0) {
                filters.push({
                    ruleId: rule.rule_id,
                    ruleName: rule.rule_name,
                    attributeId: targetAttributeId,
                    compatibleValues: finalValues,
                    matchType: rule.match_type,
                    sourceValue: sourceAttribute.value_name,
                    // ✨ NEW:  Thêm attribute name để hiển thị
                    attributeName: await this.getAttributeName(targetAttributeId)
                });
            }
        }

        return filters;
        } catch (error) {
            console.error('[Error in CompatibilityService: getCompatibilityFilters]', error);
            throw error;
        }
    }

    async getAttributeName(attributeId) {
        const sql = `SELECT attribute_name FROM attributes WHERE attribute_id = ? `;
        const rows = await query(sql, [attributeId]);
        return rows[0]?. attribute_name || '';
}

     /**
     * ✅ FIXED:  Validate entire build
     */
    async validateBuild(selectedComponents) {
        const rules = await this.loadAllRules();
        const issues = [];
        const warnings = [];

        try {
            console.log('🔍 [validateBuild] selectedComponents:', selectedComponents);

            // 1. Load tất cả components
            const loadedComponents = {};
            for (const [categoryId, variantId] of Object. entries(selectedComponents)) {
                if (variantId) {
                    const product = await ProductDAO.getProductByVariantId(variantId);
                    if (product) {
                        loadedComponents[categoryId] = product;
                        console.log(`  ✅ Loaded component ${categoryId}:`, product.product_name);
                    }
                }
            }

            const loadedCategoryIds = Object.keys(loadedComponents).map(k => parseInt(k));

            // 2. Kiểm tra tất cả rules
            const activeRules = rules.filter(rule => rule.is_active === 1);
            console.log(`  📋 Checking ${activeRules.length} active rules`);

            for (const rule of activeRules) {
                const hasCategory1 = loadedCategoryIds.includes(rule.category_1_id);
                const hasCategory2 = loadedCategoryIds.includes(rule.category_2_id);

                if (!hasCategory1 || !hasCategory2) {
                    continue; // Skip nếu thiếu component
                }

                const component1 = loadedComponents[rule. category_1_id];
                const component2 = loadedComponents[rule.category_2_id];

                // ✅ Lấy attribute_value_id thay vì string
                const attr1 = component1.attributes?.find(a => a.attribute_id === rule.attribute_1_id);
                const attr2 = component2.attributes?.find(a => a.attribute_id === rule.attribute_2_id);

                if (!attr1?. attribute_value_id || !attr2?.attribute_value_id) {
                    warnings.push({
                        ruleName: rule.rule_name,
                        type: 'missing_data',
                        message: `Không thể kiểm tra rule "${rule.rule_name}":  thiếu dữ liệu thuộc tính`,
                        component1: component1.product_name,
                        component2: component2.product_name
                    });
                    continue;
                }

                const valueId1 = attr1.attribute_value_id;
                const valueId2 = attr2.attribute_value_id;

                console.log(`  🔧 Checking rule "${rule.rule_name}": ${valueId1} vs ${valueId2}`);

                let isCompatible = false;

                if (rule.match_type === 'exact') {
                    // ✅ Exact: So sánh trực tiếp IDs
                    isCompatible = (valueId1 === valueId2);
                    
                } else if (rule.match_type === 'one_to_many' || rule.match_type === 'contains') {
                    // ✅ Check trong bảng compatibility_values
                    const ruleValues = await CompatibilityDAO. getRuleValues(rule.rule_id);
                    
                    isCompatible = ruleValues. some(rv => 
                        (rv.attribute_value_1_id === valueId1 && rv.attribute_value_2_id === valueId2) ||
                        (rv.attribute_value_1_id === valueId2 && rv.attribute_value_2_id === valueId1)
                    );
                }

                if (!isCompatible) {
                    issues.push({
                        ruleName: rule.rule_name,
                        type: 'incompatible',
                        message: `Không tương thích:  ${rule.rule_name}`,
                        component1: {
                            name: component1.product_name,
                            attributeValue: attr1.value_name
                        },
                        component2: {
                            name: component2.product_name,
                            attributeValue:  attr2.value_name
                        },
                        note: rule.note
                    });
                    console.log(`    ❌ INCOMPATIBLE`);
                } else {
                    console.log(`    ✅ Compatible`);
                }
            }

            const compatible = issues.length === 0;
            console.log(`✅ Validation complete: ${compatible ? 'COMPATIBLE' : 'INCOMPATIBLE'}`);

            return {
                compatible,
                issues,
                warnings,
                message: compatible 
                    ? 'Build tương thích' 
                    :  `Phát hiện ${issues.length} vấn đề không tương thích`
            };
            
        } catch (error) {
            console.error('[Error in CompatibilityService: validateBuild]', error);
            throw error;
        }
     }

    // ============================================
    // CRUD Operations for Rules
    // ============================================

    /**
     * Create a new compatibility rule
     * @param {object} ruleData - Rule data
     * @returns {Promise<number>} - Created rule ID
     */
    async createRule(ruleData) {
        try {
            // Validate required fields
            if (!ruleData.rule_name || !ruleData.category_1_id || !ruleData.attribute_1_id ||
                !ruleData.category_2_id || !ruleData.attribute_2_id) {
                throw new Error('Missing required fields for rule creation');
            }

            // Validate match_type
            if (ruleData.match_type && !['exact', 'contains', 'one_to_many'].includes(ruleData.match_type)) {
                throw new Error('Invalid match_type. Must be "exact", "contains", or "one_to_many"');
            }

            console.log('📝 [createRule] Creating new rule:', ruleData.rule_name);
            
            const ruleId = await CompatibilityDAO.createRule(ruleData);
            
            console.log(`✅ Rule created with ID: ${ruleId}`);
            return ruleId;

        } catch (error) {
            console.error('[Error in CompatibilityService: createRule]', error);
            throw error;
        }
    }

    /**
     * Get rule by ID
     * @param {number} ruleId - Rule ID
     * @returns {Promise<object|null>} - Rule object or null
     */
    async getRuleById(ruleId) {
        try {
            if (!ruleId || typeof ruleId !== 'number') {
                throw new Error('Invalid rule ID');
            }

            const rule = await CompatibilityDAO.findRuleById(ruleId);
            
            if (!rule) {
                console.log(`⚠️ Rule not found: ${ruleId}`);
                return null;
            }

            return rule;

        } catch (error) {
            console.error('[Error in CompatibilityService: getRuleById]', error);
            throw error;
        }
    }

    /**
     * Update an existing rule
     * @param {number} ruleId - Rule ID
     * @param {object} ruleData - Updated rule data
     * @returns {Promise<boolean>} - Success status
     */
    async updateRule(ruleId, ruleData) {
        try {
            if (!ruleId || typeof ruleId !== 'number') {
                throw new Error('Invalid rule ID');
            }

            // Check if rule exists
            const existingRule = await CompatibilityDAO.findRuleById(ruleId);
            if (!existingRule) {
                throw new Error(`Rule not found: ${ruleId}`);
            }

            // Validate match_type if provided
            if (ruleData.match_type && !['exact', 'contains', 'one_to_many'].includes(ruleData.match_type)) {
                throw new Error('Invalid match_type. Must be "exact", "contains", or "one_to_many"');
            }

            console.log(`📝 [updateRule] Updating rule ${ruleId}`);
            
            const affectedRows = await CompatibilityDAO.updateRule(ruleId, ruleData);
            
            if (affectedRows > 0) {
                console.log(`✅ Rule ${ruleId} updated successfully`);
                return true;
            } else {
                console.log(`⚠️ No changes made to rule ${ruleId}`);
                return false;
            }

        } catch (error) {
            console.error('[Error in CompatibilityService: updateRule]', error);
            throw error;
        }
    }

    /**
     * Soft delete a rule (set is_active = 0)
     * @param {number} ruleId - Rule ID
     * @returns {Promise<boolean>} - Success status
     */
    async deleteRule(ruleId) {
        try {
            if (!ruleId || typeof ruleId !== 'number') {
                throw new Error('Invalid rule ID');
            }

            // Check if rule exists
            const existingRule = await CompatibilityDAO.findRuleById(ruleId);
            if (!existingRule) {
                throw new Error(`Rule not found: ${ruleId}`);
            }

            console.log(`🗑️ [deleteRule] Soft deleting rule ${ruleId}`);
            
            const affectedRows = await CompatibilityDAO.deleteRule(ruleId);
            
            if (affectedRows > 0) {
                console.log(`✅ Rule ${ruleId} deleted successfully`);
                return true;
            } else {
                console.log(`⚠️ Failed to delete rule ${ruleId}`);
                return false;
            }

        } catch (error) {
            console.error('[Error in CompatibilityService: deleteRule]', error);
            throw error;
        }
    }

    // ============================================
    // CRUD Operations for Rule Values
    // ============================================

    /**
     * Get all values for a rule
     * @param {number} ruleId - Rule ID
     * @returns {Promise<Array>} - Array of value pairs
     */
    async getRuleValues(ruleId) {
        try {
            if (!ruleId || typeof ruleId !== 'number') {
                throw new Error('Invalid rule ID');
            }

            // Check if rule exists
            const rule = await CompatibilityDAO.findRuleById(ruleId);
            if (!rule) {
                throw new Error(`Rule not found: ${ruleId}`);
            }

            const values = await CompatibilityDAO.getRuleValues(ruleId);
            
            console.log(`📋 Found ${values.length} value pairs for rule ${ruleId}`);
            return values;

        } catch (error) {
            console.error('[Error in CompatibilityService: getRuleValues]', error);
            throw error;
        }
    }

    /**
     * Add a value pair to a rule
     * @param {number} ruleId - Rule ID
     * @param {number} attributeValue1Id - First attribute_value_id
     * @param {number} attributeValue2Id - Second attribute_value_id
     * @returns {Promise<number>} - Created value ID
     */
    async addRuleValue(ruleId, attributeValue1Id, attributeValue2Id) {
        try {
            if (!ruleId || typeof ruleId !== 'number') {
                throw new Error('Invalid rule ID');
            }

            if (!attributeValue1Id || !attributeValue2Id) {
                throw new Error('Both attributeValue1Id and attributeValue2Id are required');
            }

            // Check if rule exists
            const rule = await CompatibilityDAO.findRuleById(ruleId);
            if (!rule) {
                throw new Error(`Rule not found: ${ruleId}`);
            }

            console.log(`➕ [addRuleValue] Adding value pair to rule ${ruleId}: ${attributeValue1Id} ↔ ${attributeValue2Id}`);
            
            const valueId = await CompatibilityDAO.addRuleValue(ruleId, attributeValue1Id, attributeValue2Id);
            
            console.log(`✅ Value pair added with ID: ${valueId}`);
            return valueId;

        } catch (error) {
            console.error('[Error in CompatibilityService: addRuleValue]', error);
            throw error;
        }
    }

    /**
     * Delete a value pair
     * @param {number} valueId - Value ID
     * @returns {Promise<boolean>} - Success status
     */
    async deleteRuleValue(valueId) {
        try {
            if (!valueId || typeof valueId !== 'number') {
                throw new Error('Invalid value ID');
            }

            console.log(`🗑️ [deleteRuleValue] Deleting value ${valueId}`);
            
            const affectedRows = await CompatibilityDAO.deleteRuleValue(valueId);
            
            if (affectedRows > 0) {
                console.log(`✅ Value ${valueId} deleted successfully`);
                return true;
            } else {
                console.log(`⚠️ Value ${valueId} not found or already deleted`);
                return false;
            }

        } catch (error) {
            console.error('[Error in CompatibilityService: deleteRuleValue]', error);
            throw error;
        }
    }

    // ============================================
    // Helper Methods
    // ============================================

    /**
     * Get all possible values for an attribute
     * @param {number} attributeId - Attribute ID
     * @returns {Promise<Array<string>>} - Array of attribute value names
     */
    async getAttributeValues(attributeId) {
        try {
            if (!attributeId || typeof attributeId !== 'number') {
                throw new Error('Invalid attribute ID');
            }

            const values = await CompatibilityDAO.getAttributeValues(attributeId);
            
            console.log(`📋 Found ${values.length} values for attribute ${attributeId}`);
            return values;

        } catch (error) {
            console.error('[Error in CompatibilityService: getAttributeValues]', error);
            throw error;
        }
    }

    /**
     * Validate if a rule configuration is valid
     * @param {object} ruleData - Rule data to validate
     * @returns {object} - Validation result { valid: boolean, errors: Array }
     */
    validateRuleData(ruleData) {
        const errors = [];

        if (!ruleData.rule_name) {
            errors.push('rule_name is required');
        }

        if (!ruleData.category_1_id || typeof ruleData.category_1_id !== 'number') {
            errors.push('category_1_id must be a valid number');
        }

        if (!ruleData.attribute_1_id || typeof ruleData.attribute_1_id !== 'number') {
            errors.push('attribute_1_id must be a valid number');
        }

        if (!ruleData.category_2_id || typeof ruleData.category_2_id !== 'number') {
            errors.push('category_2_id must be a valid number');
        }

        if (!ruleData.attribute_2_id || typeof ruleData.attribute_2_id !== 'number') {
            errors.push('attribute_2_id must be a valid number');
        }

        if (ruleData.match_type && !['exact', 'contains', 'one_to_many'].includes(ruleData.match_type)) {
            errors.push('match_type must be "exact", "contains", or "one_to_many"');
        }

        // Check if trying to create rule with same category
        if (ruleData.category_1_id === ruleData.category_2_id) {
            errors.push('category_1_id and category_2_id cannot be the same');
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    // ============================================
    // Protection Methods (Prevent delete/update when in use)
    // ============================================

    /**
     * Check if attribute can be deleted/modified
     * @param {number} attributeId - Attribute ID
     * @returns {Promise<{canModify: boolean, reason: string, usedInRules: Array}>}
     */
    async canModifyAttribute(attributeId) {
        try {
            const isUsed = await CompatibilityDAO.isAttributeUsedInRules(attributeId);
            
            if (!isUsed) {
                return {
                    canModify: true,
                    reason: 'Attribute is not used in any compatibility rules'
                };
            }

            const rules = await CompatibilityDAO.getRulesUsingAttribute(attributeId);
            
            return {
                canModify: false,
                reason: `Attribute is being used in ${rules.length} active compatibility rule(s)`,
                usedInRules: rules
            };

        } catch (error) {
            console.error('[Error in CompatibilityService: canModifyAttribute]', error);
            throw error;
        }
    }

    /**
     * Check if attribute_value can be deleted/modified
     * @param {number} attributeValueId - Attribute Value ID
     * @returns {Promise<{canModify: boolean, reason: string, usedInMappings: Array}>}
     */
    async canModifyAttributeValue(attributeValueId) {
        try {
            const isUsed = await CompatibilityDAO.isAttributeValueUsedInCompatibility(attributeValueId);
            
            if (!isUsed) {
                return {
                    canModify: true,
                    reason: 'Attribute value is not used in any compatibility mappings'
                };
            }

            const mappings = await CompatibilityDAO.getCompatibilityMappingsUsingValue(attributeValueId);
            
            return {
                canModify: false,
                reason: `Attribute value is being used in ${mappings.length} compatibility mapping(s)`,
                usedInMappings: mappings
            };

        } catch (error) {
            console.error('[Error in CompatibilityService: canModifyAttributeValue]', error);
            throw error;
        }
    }

    /**
     * Validate before deleting attribute
     * @param {number} attributeId - Attribute ID
     * @throws {Error} if attribute is in use
     */
    async validateAttributeDeletion(attributeId) {
        const check = await this.canModifyAttribute(attributeId);
        
        if (!check.canModify) {
            throw new Error(
                `Cannot delete attribute: ${check.reason}. ` +
                `Used in rules: ${check.usedInRules.map(r => r.rule_name).join(', ')}`
            );
        }
    }

    /**
     * Validate before deleting/updating attribute_value
     * @param {number} attributeValueId - Attribute Value ID
     * @throws {Error} if value is in use
     */
    async validateAttributeValueModification(attributeValueId) {
        const check = await this.canModifyAttributeValue(attributeValueId);
        
        if (!check.canModify) {
            throw new Error(
                `Cannot modify/delete attribute value: ${check.reason}. ` +
                `Used in rules: ${check.usedInMappings.map(m => m.rule_name).join(', ')}`
            );
        }
    }

}

export default new CompatibilityService();