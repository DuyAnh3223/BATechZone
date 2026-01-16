import api from '@/lib/axios';

export const compatibilityService = {
  /**
   * Get all compatibility rules
   */
  async getAllRules() {
    try {
      const response = await api.get('/compatibility/rules');
      return response.data;
    } catch (error) {
      console.error('Error getting rules:', error);
      throw error;
    }
  },

  /**
   * Get rule by ID
   */
  async getRuleById(ruleId) {
    try {
      const response = await api.get(`/compatibility/rules/${ruleId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting rule:', error);
      throw error;
    }
  },

  /**
   * Create new rule
   */
  async createRule(ruleData) {
    try {
      const response = await api.post('/compatibility/rules', ruleData);
      return response.data;
    } catch (error) {
      console.error('Error creating rule:', error);
      throw error;
    }
  },

  /**
   * Update rule
   */
  async updateRule(ruleId, ruleData) {
    try {
      const response = await api.put(`/compatibility/rules/${ruleId}`, ruleData);
      return response.data;
    } catch (error) {
      console.error('Error updating rule:', error);
      throw error;
    }
  },

  /**
   * Delete rule
   */
  async deleteRule(ruleId) {
    try {
      const response = await api.delete(`/compatibility/rules/${ruleId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting rule:', error);
      throw error;
    }
  },

  /**
   * Get rule mappings/values
   */
  async getRuleMappings(ruleId) {
    try {
      const response = await api.get(`/compatibility/rules/${ruleId}/values`);
      return response.data;
    } catch (error) {
      console.error('Error getting rule mappings:', error);
      throw error;
    }
  },

  /**
   * Add mapping to rule
   */
  async addRuleMapping(ruleId, attributeValue1Id, attributeValue2Id) {
    try {
      const payload = {
        attribute_value_1_id: attributeValue1Id,
        attribute_value_2_id: attributeValue2Id
      };
      console.log('Adding mapping payload:', payload);
      const response = await api.post(`/compatibility/rules/${ruleId}/values`, payload);
      return response.data;
    } catch (error) {
      console.error('Error adding rule mapping:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  },

  /**
   * Delete mapping from rule
   */
  async deleteRuleMapping(ruleId, mappingId) {
    try {
      const response = await api.delete(`/compatibility/values/${mappingId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting rule mapping:', error);
      throw error;
    }
  },

  /**
   * Get compatibility filters for a component type
   * @param {number} targetCategoryId - Target category ID (1=CPU, 5=Mainboard, etc.)
   * @param {Object} selectedComponents - { categoryId: variantId, ... }
   */
  async getCompatibilityFilters(targetCategoryId, selectedComponents) {
    try {
      const response = await api.post('/compatibility/filters', {
        targetCategoryId,
        selectedComponents
      });
      
      return response.data;
    } catch (error) {
      console.error('Error getting compatibility filters:', error);
      throw error;
    }
  },

  /**
   * Validate complete build compatibility
   * @param {Object} selectedComponents - { cpu: variantId, mainboard: variantId, ... }
   */
  async validateBuild(selectedComponents) {
    try {
      const response = await api.post('/compatibility/validate', {
        selectedComponents
      });
      return response.data;
    } catch (error) {
      console.error('Error validating build:', error);
      throw error;
    }
  }
};
