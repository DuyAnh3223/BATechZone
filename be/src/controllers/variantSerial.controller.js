import VariantSerialService from '../services/variantSerial.service.js';
import { SearchSerialDTO } from '../dtos/variantSerial.dto.js';

/**
 * VariantSerialController - HTTP Request Handler
 */
class VariantSerialController {

  /**
   * Create new serial
   * POST /api/serials
   */
  async createSerial(req, res) {
    try {
      const result = await VariantSerialService.createSerial(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Bulk create serials
   * POST /api/serials/bulk
   */
  async bulkCreateSerials(req, res) {
    try {
      const result = await VariantSerialService.bulkCreateSerials(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Get serial by ID
   * GET /api/serials/:id
   */
  async getSerialById(req, res) {
    try {
      const serialId = parseInt(req.params.id);
      const result = await VariantSerialService.getSerialById(serialId);
      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Get serial by serial number
   * GET /api/serials/number/:serialNumber
   */
  async getSerialByNumber(req, res) {
    try {
      const serialNumber = req.params.serialNumber;
      const result = await VariantSerialService.getSerialByNumber(serialNumber);
      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Get serials by variant
   * GET /api/serials/variant/:variantId
   */
  async getSerialsByVariant(req, res) {
    try {
      const variantId = parseInt(req.params.variantId);
      const status = req.query.status || null;
      const result = await VariantSerialService.getSerialsByVariant(variantId, status);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Update serial
   * PUT /api/serials/:id
   */
  async updateSerial(req, res) {
    try {
      const serialId = parseInt(req.params.id);
      const result = await VariantSerialService.updateSerial(serialId, req.body);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Delete serial
   * DELETE /api/serials/:id
   */
  async deleteSerial(req, res) {
    try {
      const serialId = parseInt(req.params.id);
      const result = await VariantSerialService.deleteSerial(serialId);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Reserve serials for order
   * POST /api/serials/reserve
   */
  async reserveSerials(req, res) {
    try {
      const result = await VariantSerialService.reserveSerials(req.body);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Confirm sale
   * POST /api/serials/confirm-sale/:orderItemId
   */
  async confirmSale(req, res) {
    try {
      const orderItemId = parseInt(req.params.orderItemId);
      const result = await VariantSerialService.confirmSale(orderItemId);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Cancel reservation
   * POST /api/serials/cancel-reservation/:orderItemId
   */
  async cancelReservation(req, res) {
    try {
      const orderItemId = parseInt(req.params.orderItemId);
      const result = await VariantSerialService.cancelReservation(orderItemId);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Process RMA
   * POST /api/serials/rma
   */
  async processRMA(req, res) {
    try {
      const { serial_number, warranty_id } = req.body;
      
      if (!serial_number) {
        return res.status(400).json({
          success: false,
          message: 'serial_number là bắt buộc'
        });
      }

      const result = await VariantSerialService.processRMA(serial_number, warranty_id);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Complete RMA
   * POST /api/serials/rma/complete
   */
  async completeRMA(req, res) {
    try {
      const { serial_number } = req.body;
      
      if (!serial_number) {
        return res.status(400).json({
          success: false,
          message: 'serial_number là bắt buộc'
        });
      }

      const result = await VariantSerialService.completeRMA(serial_number);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Scrap serial
   * POST /api/serials/:id/scrap
   */
  async scrapSerial(req, res) {
    try {
      const serialId = parseInt(req.params.id);
      const result = await VariantSerialService.scrapSerial(serialId);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Get inventory summary
   * GET /api/serials/inventory/:variantId
   */
  async getInventorySummary(req, res) {
    try {
      const variantId = parseInt(req.params.variantId);
      const result = await VariantSerialService.getInventorySummary(variantId);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Search serials with filters
   * GET /api/serials
   */
  async searchSerials(req, res) {
    try {
      const searchDTO = new SearchSerialDTO(req.query);
      const validation = searchDTO.validate();

      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          message: validation.errors.join(', ')
        });
      }

      const filters = searchDTO.getFilters();
      const result = await VariantSerialService.searchSerials(
        filters,
        searchDTO.page,
        searchDTO.limit
      );
      
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

export default new VariantSerialController();