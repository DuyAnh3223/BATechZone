import productDao from '../daos/product.dao.js';

class CompatibilityService {
  // Socket to DDR type mapping for CPU compatibility
  static SOCKET_TO_DDR_MAP = {
    'LGA 1200 (10th)': ['DDR4'],
    'LGA 1700 (12th, 13th, 14th)': ['DDR4', 'DDR5'],
    'LGA 1851 (Core Ultra)': ['DDR5'],
    'AM4 (3000, 5000)': ['DDR4'],
    'AM5 (7000, 9000)': ['DDR5'],
  };

  /**
   * Get attribute value from product attributes
   */
  static getAttributeValue(product, attributeName) {
    if (!product || !product.attributes) return null;
    const attr = product.attributes.find(a => a.attribute_name === attributeName);
    return attr?.value_name || null;
  }

  /**
   * Check CPU ↔ Mainboard compatibility (Socket)
   */
  static checkCpuMainboardCompatibility(cpu, mainboard) {
    const cpuSocket = this.getAttributeValue(cpu, 'CPU theo Socket');
    const mbSocket = this.getAttributeValue(mainboard, 'Socket Hỗ Trợ');
    
    if (!cpuSocket || !mbSocket) return { compatible: true, reason: 'Missing socket data' };
    
    const compatible = cpuSocket === mbSocket;
    return {
      compatible,
      reason: compatible 
        ? `Socket compatible: ${cpuSocket}` 
        : `Socket mismatch: CPU has ${cpuSocket}, Mainboard supports ${mbSocket}`
    };
  }

  /**
   * Check CPU ↔ RAM compatibility (DDR type via Socket mapping)
   */
  static checkCpuRamCompatibility(cpu, ram) {
    const cpuSocket = this.getAttributeValue(cpu, 'CPU theo Socket');
    const ramType = this.getAttributeValue(ram, 'Loại RAM');
    
    if (!cpuSocket || !ramType) return { compatible: true, reason: 'Missing data' };
    
    const supportedDDR = this.SOCKET_TO_DDR_MAP[cpuSocket] || [];
    const compatible = supportedDDR.includes(ramType);
    
    return {
      compatible,
      reason: compatible
        ? `RAM type ${ramType} compatible with CPU socket ${cpuSocket}`
        : `RAM type ${ramType} not compatible with CPU socket ${cpuSocket} (supports: ${supportedDDR.join(', ')})`
    };
  }

  /**
   * Check RAM ↔ Mainboard compatibility (DDR type)
   */
  static checkRamMainboardCompatibility(ram, mainboard) {
    const ramType = this.getAttributeValue(ram, 'Loại RAM');
    const mbRamType = this.getAttributeValue(mainboard, 'Loại RAM Hỗ Trợ');
    
    if (!ramType || !mbRamType) return { compatible: true, reason: 'Missing RAM type data' };
    
    const compatible = ramType === mbRamType;
    return {
      compatible,
      reason: compatible
        ? `RAM type ${ramType} compatible with Mainboard`
        : `RAM type mismatch: ${ramType} vs Mainboard supports ${mbRamType}`
    };
  }

  /**
   * Check Mainboard ↔ Case compatibility (Form Factor)
   */
  static checkMainboardCaseCompatibility(mainboard, caseItem) {
    const mbFormFactor = this.getAttributeValue(mainboard, 'Kiểu Kích Thước (Form Factor)');
    const caseFormFactor = this.getAttributeValue(caseItem, 'Kích thước Mainboard');
    
    if (!mbFormFactor || !caseFormFactor) return { compatible: true, reason: 'Missing form factor data' };
    
    // Normalize form factor strings for comparison
    const normalizeMbFF = mbFormFactor.trim().replace(/\s+/g, ' ').replace(/–/g, '-').replace(/\s*-\s*/g, '-');
    const normalizeCaseFF = caseFormFactor.trim().replace(/\s+/g, ' ').replace(/–/g, '-').replace(/\s*-\s*/g, '-');
    
    const compatible = normalizeMbFF === normalizeCaseFF;
    return {
      compatible,
      reason: compatible
        ? `Form factor ${mbFormFactor} compatible`
        : `Form factor mismatch: Mainboard ${mbFormFactor} vs Case supports ${caseFormFactor}`
    };
  }

  /**
   * Check GPU ↔ Case compatibility (GPU length)
   */
  static checkGpuCaseCompatibility(gpu, caseItem) {
    const gpuLengthStr = this.getAttributeValue(gpu, 'Độ dài GPU (mm)');
    const maxGpuLengthStr = this.getAttributeValue(caseItem, 'Độ dài GPU tối đa (mm)');
    
    if (!gpuLengthStr || !maxGpuLengthStr) return { compatible: true, reason: 'Missing GPU length data' };
    
    const gpuLength = parseFloat(gpuLengthStr);
    const maxGpuLength = parseFloat(maxGpuLengthStr);
    
    if (isNaN(gpuLength) || isNaN(maxGpuLength)) return { compatible: true, reason: 'Invalid GPU length data' };
    
    const compatible = gpuLength <= maxGpuLength;
    return {
      compatible,
      reason: compatible
        ? `GPU length ${gpuLength}mm fits in case (max: ${maxGpuLength}mm)`
        : `GPU too long: ${gpuLength}mm exceeds case max ${maxGpuLength}mm`
    };
  }

  /**
   * Get compatibility filters based on selected components
   * @param {string} targetType - The component type to filter (cpu, mainboard, ram, vga, case)
   * @param {Object} selectedComponents - Already selected components { cpu, mainboard, ram, vga, case }
   */
  static async getCompatibilityFilters(targetType, selectedComponents) {
    const filters = [];

    try {
      // Only check compatibility for core components
      if (!['cpu', 'mainboard', 'ram', 'vga', 'case'].includes(targetType)) {
        return { filters: [], message: 'No compatibility check needed' };
      }

      // Get full product data for selected components if needed
      const components = {};
      for (const [type, variantId] of Object.entries(selectedComponents)) {
        if (variantId && ['cpu', 'mainboard', 'ram', 'vga', 'case'].includes(type)) {
          const product = await productDao.getProductByVariantId(variantId);
          if (product) {
            components[type] = product;
          }
        }
      }

      // CPU ↔ Mainboard (Socket compatibility)
      if (targetType === 'mainboard' && components.cpu) {
        const cpuSocket = this.getAttributeValue(components.cpu, 'CPU theo Socket');
        if (cpuSocket) {
          filters.push({
            attributeName: 'Socket Hỗ Trợ',
            values: [cpuSocket],
            reason: `Tương thích với CPU socket ${cpuSocket}`
          });
        }
      }

      if (targetType === 'cpu' && components.mainboard) {
        const mbSocket = this.getAttributeValue(components.mainboard, 'Socket Hỗ Trợ');
        if (mbSocket) {
          filters.push({
            attributeName: 'CPU theo Socket',
            values: [mbSocket],
            reason: `Tương thích với Mainboard socket ${mbSocket}`
          });
        }
      }

      // RAM compatibility (Priority: Mainboard > CPU)
      if (targetType === 'ram') {
        if (components.mainboard) {
          const mbRamType = this.getAttributeValue(components.mainboard, 'Loại RAM Hỗ Trợ');
          if (mbRamType) {
            filters.push({
              attributeName: 'Loại RAM',
              values: [mbRamType],
              reason: `Tương thích với Mainboard hỗ trợ ${mbRamType}`
            });
          }
        } else if (components.cpu) {
          const cpuSocket = this.getAttributeValue(components.cpu, 'CPU theo Socket');
          const supportedDDR = this.SOCKET_TO_DDR_MAP[cpuSocket] || [];
          if (supportedDDR.length > 0) {
            filters.push({
              attributeName: 'Loại RAM',
              values: supportedDDR,
              reason: `Tương thích với CPU hỗ trợ ${supportedDDR.join(', ')}`
            });
          }
        }
      }

      // Mainboard ↔ Case (Form Factor)
      if (targetType === 'case' && components.mainboard) {
        const mbFormFactor = this.getAttributeValue(components.mainboard, 'Kiểu Kích Thước (Form Factor)');
        if (mbFormFactor) {
          filters.push({
            attributeName: 'Kích thước Mainboard',
            values: [mbFormFactor],
            reason: `Tương thích với Mainboard form factor ${mbFormFactor}`
          });
        }
      }

      if (targetType === 'mainboard' && components.case) {
        const caseFormFactor = this.getAttributeValue(components.case, 'Kích thước Mainboard');
        if (caseFormFactor) {
          filters.push({
            attributeName: 'Kiểu Kích Thước (Form Factor)',
            values: [caseFormFactor],
            reason: `Tương thích với Case hỗ trợ ${caseFormFactor}`
          });
        }
      }

      // GPU ↔ Case (GPU length) - Note: This is harder to filter by attribute, might need custom handling
      // For now, we'll return the filter info but actual filtering might need to be done differently

      return {
        filters,
        message: filters.length > 0 ? 'Compatibility filters applied' : 'No compatibility constraints'
      };

    } catch (error) {
      console.error('Error getting compatibility filters:', error);
      return {
        filters: [],
        message: 'Error checking compatibility',
        error: error.message
      };
    }
  }

  /**
   * Validate complete build compatibility
   * @param {Object} selectedComponents - { cpu, mainboard, ram, vga, case } with variant IDs
   */
  static async validateBuild(selectedComponents) {
    const issues = [];
    const warnings = [];

    try {
      // Get full product data for selected components
      const components = {};
      for (const [type, variantId] of Object.entries(selectedComponents)) {
        if (variantId) {
          const product = await productDao.getProductByVariantId(variantId);
          if (product) {
            components[type] = product;
          }
        }
      }

      // Check CPU ↔ Mainboard
      if (components.cpu && components.mainboard) {
        const result = this.checkCpuMainboardCompatibility(components.cpu, components.mainboard);
        if (!result.compatible) {
          issues.push({
            type: 'CPU-Mainboard',
            severity: 'error',
            message: result.reason
          });
        }
      }

      // Check CPU ↔ RAM
      if (components.cpu && components.ram) {
        const result = this.checkCpuRamCompatibility(components.cpu, components.ram);
        if (!result.compatible) {
          warnings.push({
            type: 'CPU-RAM',
            severity: 'warning',
            message: result.reason
          });
        }
      }

      // Check RAM ↔ Mainboard
      if (components.ram && components.mainboard) {
        const result = this.checkRamMainboardCompatibility(components.ram, components.mainboard);
        if (!result.compatible) {
          issues.push({
            type: 'RAM-Mainboard',
            severity: 'error',
            message: result.reason
          });
        }
      }

      // Check Mainboard ↔ Case
      if (components.mainboard && components.case) {
        const result = this.checkMainboardCaseCompatibility(components.mainboard, components.case);
        if (!result.compatible) {
          issues.push({
            type: 'Mainboard-Case',
            severity: 'error',
            message: result.reason
          });
        }
      }

      // Check GPU ↔ Case
      if (components.vga && components.case) {
        const result = this.checkGpuCaseCompatibility(components.vga, components.case);
        if (!result.compatible) {
          warnings.push({
            type: 'GPU-Case',
            severity: 'warning',
            message: result.reason
          });
        }
      }

      return {
        compatible: issues.length === 0,
        issues,
        warnings,
        message: issues.length === 0 
          ? 'Build is compatible' 
          : `Found ${issues.length} compatibility issue(s)`
      };

    } catch (error) {
      console.error('Error validating build:', error);
      return {
        compatible: false,
        issues: [{
          type: 'System',
          severity: 'error',
          message: 'Error validating build: ' + error.message
        }],
        warnings: []
      };
    }
  }
}

export default CompatibilityService;
