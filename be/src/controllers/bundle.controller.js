/**
 * bundle.controller.js - API endpoints for PC Bundles
 */

import BundleService from "../services/bundle.service.js";

class BundleController {
  
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ADMIN APIs
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  /**
   * ✅ [POST] /api/admin/bundles
   * Tạo bundle mới
   */
  async createBundle(req, res) {
    try {
      const bundleData = req.body;
      const bundle = await BundleService.createBundle(bundleData);
      
      res.status(201).json({
        success: true,
        message: 'Tạo bundle thành công',
        data: bundle
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
  
  /**
   * ✅ [GET] /api/admin/bundles
   * Lấy danh sách bundles (Admin)
   */
  async getAdminBundles(req, res) {
    try {
      const filters = {
        search: req.query.search,
        is_active: req.query.is_active,
        min_price: req.query.min_price,
        max_price: req.query.max_price,
        sort_by: req.query.sort_by,
        sort_order: req.query.sort_order,
        limit: parseInt(req.query.limit) || 20,
        offset: parseInt(req.query.offset) || 0
      };
      
      const bundles = await BundleService.getBundles(filters);
      
      res.json({
        success: true,
        data: bundles,
        pagination: {
          limit: filters.limit,
          offset: filters.offset,
          total: bundles.length
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
  
  /**
   * ✅ [GET] /api/admin/bundles/:id
   * Lấy chi tiết bundle
   */
  async getBundleDetail(req, res) {
    try {
      const variantId = parseInt(req.params.id);
      const bundle = await BundleService.getBundleDetail(variantId);
      
      res.json({
        success: true,
        data: bundle
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }
  
  /**
   * ✅ [PUT] /api/admin/bundles/:id
   * Cập nhật bundle
   */
  async updateBundle(req, res) {
    try {
      const variantId = parseInt(req.params.id);
      const bundleData = req.body;
      
      const bundle = await BundleService.updateBundle(variantId, bundleData);
      
      res.json({
        success: true,
        message: 'Cập nhật bundle thành công',
        data: bundle
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error. message
      });
    }
  }
  
  /**
   * ✅ [DELETE] /api/admin/bundles/:id
   * Xóa bundle
   */
  async deleteBundle(req, res) {
    try {
      const variantId = parseInt(req.params.id);
      const result = await BundleService.deleteBundle(variantId);
      
      res.json({
        success: true,
        message: result.message
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
  
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // USER APIs
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  /**
   * ✅ [GET] /api/bundles
   * Lấy danh sách bundles (User)
   */
  async getUserBundles(req, res) {
    try {
      const filters = {
        is_active: 1, // Chỉ lấy bundle active
        search: req.query.search,
        min_price: req.query.min_price,
        max_price: req.query.max_price,
        sort_by: req.query.sort_by || 'p. created_at',
        sort_order: req.query.sort_order || 'DESC',
        limit: parseInt(req.query.limit) || 12,
        offset: parseInt(req.query.offset) || 0
      };
      
      const bundles = await BundleService.getBundles(filters);
      
      res.json({
        success: true,
        data:  bundles,
        pagination: {
          limit: filters.limit,
          offset: filters.offset,
          total: bundles.length
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
  
  /**
   * ✅ [GET] /api/bundles/:id
   * Lấy chi tiết bundle (User)
   */
  async getUserBundleDetail(req, res) {
    try {
      const variantId = parseInt(req.params.id);
      const bundle = await BundleService.getBundleDetail(variantId);
      
      // Kiểm tra bundle có active không
      if (!bundle. is_active) {
        return res.status(404).json({
          success: false,
          message: 'Bundle không khả dụng'
        });
      }
      
      res.json({
        success: true,
        data: bundle
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }
  
  /**
   * ✅ [GET] /api/bundles/:id/stock
   * Kiểm tra tồn kho bundle
   */
  async checkStock(req, res) {
    try {
      const variantId = parseInt(req.params.id);
      const stock = await BundleService.checkBundleStock(variantId);
      
      res.json({
        success: true,
        data: stock
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

export default new BundleController();