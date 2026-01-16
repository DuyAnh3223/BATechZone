import { query } from "../libs/db.js";

class CompatibilityDAO {


    normalize(str) {
    if (!str) return '';
    return str
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/[^a-z0-9]/g, '')
      .replace(/^socket/i, '')
      .replace(/^amd/i, '')
      .replace(/^intel/i, '')
      .trim();
  }

    async getAllRules() {
        const sql = `
            SELECT * FROM compatibility_rules;  
        `;
        const rows = await query(sql);
        return rows;
    }

    async createRule(data) {
        const sql = `
            INSERT INTO compatibility_rules (
            rule_name,
            category_1_id,
            attribute_1_id,
            category_2_id,
            attribute_2_id,
            match_type,
            is_active,
            note)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?);
        `;
        const params = [
            data.rule_name,
            data.category_1_id,
            data.attribute_1_id,
            data.category_2_id,
            data.attribute_2_id,
            data.match_type || 'exact',
            data.is_active || 1,
            data.note || null
        ];
        const result = await query(sql, params);
        return result.insertId;
    }

    async findRuleById(ruleId) {
        const sql = `
            SELECT * FROM compatibility_rules
            WHERE rule_id = ?;
        `;
        const params = [ruleId];
        const rows = await query(sql, params);
        return rows[0] || null;
    }

    async updateRule(ruleId, data) {
        const sql = `
            UPDATE compatibility_rules
            SET rule_name = ?,
                category_1_id = ?,
                attribute_1_id = ?,
                category_2_id = ?,
                attribute_2_id = ?,
                match_type = ?,
                is_active = ?,
                note = ?
            WHERE rule_id = ?;`

        const params = [
            data.rule_name,
            data.category_1_id,
            data.attribute_1_id,
            data.category_2_id,
            data.attribute_2_id,
            data.match_type,
            data.is_active !== undefined ? data.is_active : 1,
            data.note || null,
            ruleId
        ];
        
        const result = await query(sql, params);
        return result.affectedRows;
    }


    async deleteRule(ruleId) {
        const sql = `
            UPDATE compatibility_rules
            SET is_active = 0
            WHERE rule_id = ?;
        `;
        const params = [ruleId];
        const result = await query(sql, params);
        return result.affectedRows;
    }


    /*
     *   Rule Values Management
     */

    async getRuleValues(ruleId) {
        const sql = `
            SELECT 
                cv.cv_id,
                cv.rule_id,
                cv.attribute_value_1_id,
                cv.attribute_value_2_id,
                av1.value_name AS value_1_name,
                av2.value_name AS value_2_name
            FROM compatibility_values cv
            LEFT JOIN attribute_values av1 ON cv.attribute_value_1_id = av1.attribute_value_id
            LEFT JOIN attribute_values av2 ON cv.attribute_value_2_id = av2.attribute_value_id
            WHERE cv.rule_id = ?
            ORDER BY av1.value_name, av2.value_name;
        `;
        const params = [ruleId];
        const rows = await query(sql, params);
        return rows;
    }

    async addRuleValue(ruleId, attributeValue1Id, attributeValue2Id) {
        const sql = `
            INSERT INTO compatibility_values (
                rule_id,
                attribute_value_1_id,
                attribute_value_2_id
            )
            VALUES (?, ?, ?);
        `;
        const params = [ruleId, attributeValue1Id, attributeValue2Id];
        const result = await query(sql, params);
        return result.insertId;
    }

    async deleteRuleValue(valueId) {
        const sql = `
            DELETE FROM compatibility_values
            WHERE cv_id = ?;
        `;
        const params = [valueId];
        const result = await query(sql, params);
        return result.affectedRows;
    }

    // Get Attribute Values for a given attribute

    async getAttributeValues(attributeId) {
        const sql = `
            SELECT attribute_value_id, value_name 
            FROM attribute_values
            WHERE attribute_id = ?
            ORDER BY value_name;
        `;
        const params = [attributeId];
        const rows = await query(sql, params);
        return rows; // Return objects with { attribute_value_id, value_name }
    }

    // ============================================
    // Validation Methods
    // ============================================

    /**
     * Check if attribute is used in any compatibility rule
     */
    async isAttributeUsedInRules(attributeId) {
        const sql = `
            SELECT COUNT(*) as count FROM compatibility_rules
            WHERE (attribute_1_id = ? OR attribute_2_id = ?)
            AND is_active = 1;
        `;
        const params = [attributeId, attributeId];
        const rows = await query(sql, params);
        return rows[0].count > 0;
    }

    /**
     * Check if attribute_value is used in any compatibility_values
     */
    async isAttributeValueUsedInCompatibility(attributeValueId) {
        const sql = `
            SELECT COUNT(*) as count FROM compatibility_values
            WHERE attribute_value_1_id = ? OR attribute_value_2_id = ?;
        `;
        const params = [attributeValueId, attributeValueId];
        const rows = await query(sql, params);
        return rows[0].count > 0;
    }

    /**
     * Get rules using this attribute
     */
    async getRulesUsingAttribute(attributeId) {
        const sql = `
            SELECT rule_id, rule_name FROM compatibility_rules
            WHERE (attribute_1_id = ? OR attribute_2_id = ?)
            AND is_active = 1;
        `;
        const params = [attributeId, attributeId];
        const rows = await query(sql, params);
        return rows;
    }

    /**
     * Get compatibility mappings using this attribute_value
     */
    async getCompatibilityMappingsUsingValue(attributeValueId) {
        const sql = `
            SELECT 
                cv.cv_id,
                cr.rule_name,
                av1.value_name AS value_1_name,
                av2.value_name AS value_2_name
            FROM compatibility_values cv
            JOIN compatibility_rules cr ON cv.rule_id = cr.rule_id
            LEFT JOIN attribute_values av1 ON cv.attribute_value_1_id = av1.attribute_value_id
            LEFT JOIN attribute_values av2 ON cv.attribute_value_2_id = av2.attribute_value_id
            WHERE cv.attribute_value_1_id = ? OR cv.attribute_value_2_id = ?;
        `;
        const params = [attributeValueId, attributeValueId];
        const rows = await query(sql, params);
        return rows;
    }
    
}

export default new CompatibilityDAO();