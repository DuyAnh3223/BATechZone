/**
 * bundle.service.js - Business logic for PC Bundles
 */

import BundleDAO from '../daos/bundle.dao.js';
import VariantSerialService from './variantSerial.service.js';

class BundleService {
  
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // CREATE BUNDLE
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  /**
   * ✅ Tạo bundle mới (hoàn chỉnh)
   */

  generateSlug(productName) {
        if (!productName) return null;
        return productName
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
            .replace(/đ/g, 'd')
            .replace(/Đ/g, 'D')
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

  async createBundle(bundleData) {
    try {
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      // 1. VALIDATION: Kiểm tra components và số lượng tồn kho
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      
      if (!bundleData.components || bundleData.components.length === 0) {
        throw new Error('Bundle phải có ít nhất 1 linh kiện');
      }
      
      // Tính max stock có thể tạo từ các linh kiện
      const maxBundleStock = await BundleDAO.calculateMaxBundleStock(bundleData.components);
      
      // Lấy số lượng bundle muốn tạo (mặc định là 0 nếu không có)
      const requestedQuantity = bundleData.quantity || 0;
      
      // Validate số lượng
      if (requestedQuantity < 0) {
        throw new Error('Số lượng bundle phải >= 0');
      }
      
      if (requestedQuantity > maxBundleStock) {
        throw new Error(
          `Không đủ linh kiện để tạo ${requestedQuantity} bundle. ` +
          `Tối đa có thể tạo: ${maxBundleStock} bundle dựa trên tồn kho linh kiện`
        );
      }
      
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      // 2. TẠO PRODUCT
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      
      const productData = {
        category_id: bundleData.category_id || 1, // Category "PC Bundle"
        product_name: bundleData.bundle_name,
        slug: this.generateSlug(bundleData.bundle_name),
        description: bundleData.description,
        base_price: bundleData.price,
        is_active: bundleData.is_active ?? 1,
        is_featured:  bundleData.is_featured ??  0
      };
      
      const productId = await BundleDAO.createBundleProduct(productData);
      
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      // 3. TẠO VARIANT
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      
      const variantData = {
        product_id: productId,
        sku: bundleData.sku || `BUNDLE-${Date.now()}`,
        variant_name: bundleData.bundle_name,
        price: bundleData.price,
        warranty_period: bundleData.warranty_period || 24,
        is_active: 1,
        is_default:  1,
        discount_percent: bundleData.discount_percent || 0,
        discount_start_date: bundleData.discount_start_date || null,
        discount_end_date: bundleData.discount_end_date || null
      };
      
      const variantId = await BundleDAO.createBundleVariant(variantData);
      
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      // 4. THÊM LINH KIỆN VÀO BUNDLE
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      
      await BundleDAO.addBundleItems(variantId, bundleData.components);
      
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      // 5. TỰ ĐỘNG TẠO SERIAL CHO BUNDLE (serial_type = 'pc_bundle')
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      
      if (requestedQuantity > 0) {
        const serialResult = await VariantSerialService.autoGenerateSerialsForBundle(
          variantId, 
          requestedQuantity
        );
        
        console.log(`✅ Đã tạo ${requestedQuantity} serial cho bundle variant_id: ${variantId}`, serialResult.data.serial_numbers);
      }
      
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      // 6. LẤY VÀ TRẢ VỀ BUNDLE ĐÃ TẠO
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      
      const bundle = await this.getBundleDetail(variantId);
      
      return {
        ...bundle,
        max_stock: maxBundleStock,
        created_quantity: requestedQuantity
      };
      
    } catch (error) {
      throw new Error(`Lỗi tạo bundle: ${error.message}`);
    }
  }
  
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // READ BUNDLE
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  /**
   * ✅ Lấy danh sách bundles
   */
  async getBundles(filters = {}) {
    const bundles = await BundleDAO.getBundles(filters);
    
    // Tính giá sau giảm
    return bundles.map(bundle => ({
      ...bundle,
      final_price: this.calculateFinalPrice(bundle. price, bundle.discount_percent, bundle.discount_start_date, bundle.discount_end_date)
    }));
  }
  
  /**
   * ✅ Lấy chi tiết bundle + linh kiện
   */
  async getBundleDetail(variantId) {
    const bundle = await BundleDAO.getBundleById(variantId);
    
    if (!bundle) {
      throw new Error('Bundle không tồn tại');
    }
    
    // Lấy danh sách linh kiện
    const components = await BundleDAO.getBundleItems(variantId);
    
    // Tính tổng giá gốc từ linh kiện
    const originalPrice = components.reduce((sum, comp) => sum + (comp.price * comp.quantity), 0);
    
    // Tính giá sau giảm
    const finalPrice = this.calculateFinalPrice(bundle.price, bundle.discount_percent, bundle.discount_start_date, bundle.discount_end_date);
    
    return {
      ...bundle,
      components,
      original_price: originalPrice,
      final_price:  finalPrice,
      savings: originalPrice - finalPrice
    };
  }
  
  /**
   * ✅ Kiểm tra tồn kho bundle
   */
  async checkBundleStock(variantId) {
    const stock = await BundleDAO.getBundleStock(variantId);
    return {
      variant_id: variantId,
      available_stock: stock,
      in_stock: stock > 0
    };
  }
  
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // UPDATE BUNDLE
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  /**
   * ✅ Cập nhật bundle
   */
  async updateBundle(variantId, bundleData) {
    try {
      const bundle = await BundleDAO.getBundleById(variantId);
      
      if (!bundle) {
        throw new Error('Bundle không tồn tại');
      }
      
      // Cập nhật product
      if (bundleData.bundle_name || bundleData.description || bundleData.img_path) {
        const productData = {
          product_name: bundleData.bundle_name || bundle.product_name,
          description: bundleData.description || null,
          img_path: bundleData.img_path || bundle.img_path,
          is_active: bundleData.is_active ?? bundle.is_active,
          is_featured: bundleData.is_featured ?? bundle.is_featured
        };
        
        await BundleDAO.updateBundleProduct(bundle.product_id, productData);
      }
      
      // Cập nhật variant
      const variantData = {
        variant_name: bundleData.bundle_name || bundle.variant_name,
        price: bundleData.price ?? bundle.price,
        warranty_period: bundleData.warranty_period ?? bundle.warranty_period,
        discount_percent: bundleData.discount_percent ?? bundle.discount_percent,
        discount_start_date: bundleData.discount_start_date || null,
        discount_end_date: bundleData.discount_end_date || null,
        is_active: bundleData.is_active ?? bundle.is_active
      };
      
      await BundleDAO.updateBundleVariant(variantId, variantData);
      
      // Cập nhật linh kiện (nếu có)
      if (bundleData.components) {
        await BundleDAO.addBundleItems(variantId, bundleData.components);
      }
      
      return await this.getBundleDetail(variantId);
      
    } catch (error) {
      throw new Error(`Lỗi cập nhật bundle: ${error.message}`);
    }
  }
  
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // DELETE BUNDLE
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  /**
   * ✅ Xóa bundle (soft delete)
   */
  async deleteBundle(variantId) {
    const success = await BundleDAO.deleteBundle(variantId);
    
    if (!success) {
      throw new Error('Không thể xóa bundle');
    }
    
    return { message: 'Đã xóa bundle thành công' };
  }
  
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // HELPER METHODS
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  /**
   * Tính giá sau giảm
   */
  calculateFinalPrice(price, discountPercent, startDate, endDate) {
    // Kiểm tra thời hạn giảm giá
    const now = new Date();
    const start = startDate ?  new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    
    const isValidDiscount = 
      discountPercent > 0 &&
      (! start || now >= start) &&
      (!end || now <= end);
    
    if (!isValidDiscount) {
      return price;
    }
    
    return price * (1 - discountPercent / 100);
  }
}


export default new BundleService();