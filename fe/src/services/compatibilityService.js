import api from '@/lib/axios';

export const compatibilityService = {
  /**
   * Get compatibility filters for a component type
   * @param {string} targetType - cpu, mainboard, ram, vga, case
   * @param {Object} selectedComponents - { cpu: variantId, mainboard: variantId, ... }
   */
  async getCompatibilityFilters(targetType, selectedComponents) {
    try {
      const response = await api.post('/compatibility/filters', {
        targetType,
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
