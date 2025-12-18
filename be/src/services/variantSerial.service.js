import VariantSerialDAO from '../daos/warranty/variantSerial.dao.js';
import {
  CreateSerialDTO,
  UpdateSerialDTO,
  ReserveSerialDTO,
  BulkCreateSerialDTO
} from '../dtos/variantSerial.dto.js';

/**
 * VariantSerialService - Business Logic Layer
 */
class VariantSerialService {

  /**
   * Create new serial
   */
  async createSerial(data) {
    const dto = new CreateSerialDTO(data);
    const validation = dto.validate();

    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    // Check if serial number already exists
    const existingSerial = await VariantSerialDAO.findBySerialNumber(dto.serial_number);
    if (existingSerial) {
      throw new Error(`Serial number "${dto.serial_number}" đã tồn tại`);
    }

    const serialId = await VariantSerialDAO.create(dto);
    const serial = await VariantSerialDAO.findById(serialId);
    
    return {
      success: true,
      message: 'Tạo serial thành công',
      data: serial.toJSON()
    };
  }

  /**
   * Bulk create serials
   */
  async bulkCreateSerials(data) {
    const dto = new BulkCreateSerialDTO(data);
    const validation = dto.validate();

    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    // Check for existing serial numbers
    const existingChecks = await Promise.all(
      dto.serial_numbers.map(sn => VariantSerialDAO.existsBySerialNumber(sn))
    );

    const duplicates = dto.serial_numbers.filter((sn, idx) => existingChecks[idx]);
    if (duplicates.length > 0) {
      throw new Error(`Serial numbers đã tồn tại: ${duplicates.join(', ')}`);
    }

    // Bulk insert
    const serials = dto.getSerials();
    await VariantSerialDAO.bulkInsert(serials);

    return {
      success: true,
      message: `Đã tạo ${serials.length} serial thành công`,
      data: {
        variant_id: dto.variant_id,
        count: serials.length
      }
    };
  }

  /**
   * Get serial by ID
   */
  async getSerialById(serialId) {
    const serial = await VariantSerialDAO.findById(serialId);
    
    if (!serial) {
      throw new Error('Serial không tồn tại');
    }

    return {
      success: true,
      data: serial.toJSON()
    };
  }

  /**
   * Get serial by serial number
   */
  async getSerialByNumber(serialNumber) {
    const serial = await VariantSerialDAO.findBySerialNumber(serialNumber);
    
    if (!serial) {
      throw new Error('Serial không tồn tại');
    }

    return {
      success: true,
      data: serial.toJSON()
    };
  }

  /**
   * Get serials by variant ID
   */
  async getSerialsByVariant(variantId, status = null) {
    const serials = await VariantSerialDAO.findByVariantId(variantId, status);
    
    return {
      success: true,
      data: serials.map(s => s.toJSON()),
      count: serials.length
    };
  }

  /**
   * Update serial
   */
  async updateSerial(serialId, data) {
    const dto = new UpdateSerialDTO(data);
    const validation = dto.validate();

    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    const serial = await VariantSerialDAO.findById(serialId);
    if (!serial) {
      throw new Error('Serial không tồn tại');
    }

    const updates = dto.getUpdateData();
    const updated = await VariantSerialDAO.update(serialId, updates);

    if (!updated) {
      throw new Error('Cập nhật serial thất bại');
    }

    const updatedSerial = await VariantSerialDAO.findById(serialId);
    
    return {
      success: true,
      message: 'Cập nhật serial thành công',
      data: updatedSerial.toJSON()
    };
  }

  /**
   * Delete serial
   */
  async deleteSerial(serialId) {
    const serial = await VariantSerialDAO.findById(serialId);
    if (!serial) {
      throw new Error('Serial không tồn tại');
    }

    // Don't allow delete if already sold
    if (serial.status === 'sold') {
      throw new Error('Không thể xóa serial đã bán');
    }

    const deleted = await VariantSerialDAO.delete(serialId);
    
    if (!deleted) {
      throw new Error('Xóa serial thất bại');
    }

    return {
      success: true,
      message: 'Xóa serial thành công'
    };
  }

  /**
   * Reserve serials for order
   */
  async reserveSerials(data) {
    const dto = new ReserveSerialDTO(data);
    const validation = dto.validate();

    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    // Check available stock
    const availableCount = await VariantSerialDAO.getAvailableCount(dto.variant_id);
    if (availableCount < dto.quantity) {
      throw new Error(`Không đủ hàng trong kho. Có sẵn: ${availableCount}, Yêu cầu: ${dto.quantity}`);
    }

    // Find and reserve serials
    const availableSerials = await VariantSerialDAO.findAvailableSerials(
      dto.variant_id, 
      dto.quantity
    );

    const reservedSerials = [];
    for (const serial of availableSerials) {
      await VariantSerialDAO.update(serial.serial_id, {
        status: 'reserved',
        order_item_id: dto.order_item_id
      });
      reservedSerials.push(serial.serial_number);
    }

    return {
      success: true,
      message: `Đã đặt trước ${reservedSerials.length} serial`,
      data: {
        variant_id: dto.variant_id,
        order_item_id: dto.order_item_id,
        quantity: reservedSerials.length,
        serial_numbers: reservedSerials
      }
    };
  }

  /**
   * Confirm sale (reserved -> sold)
   */
  async confirmSale(orderItemId) {
    const serials = await VariantSerialDAO.findByOrderItemId(orderItemId);
    
    if (serials.length === 0) {
      throw new Error('Không tìm thấy serial cho order item này');
    }

    const reservedSerials = serials.filter(s => s.status === 'reserved');
    if (reservedSerials.length === 0) {
      throw new Error('Không có serial nào ở trạng thái reserved');
    }

    for (const serial of reservedSerials) {
      await VariantSerialDAO.update(serial.serial_id, {
        status: 'sold'
      });
    }

    return {
      success: true,
      message: `Đã xác nhận bán ${reservedSerials.length} serial`,
      data: {
        order_item_id: orderItemId,
        quantity: reservedSerials.length
      }
    };
  }

  /**
   * Cancel reservation (reserved -> in_stock)
   */
  async cancelReservation(orderItemId) {
    const serials = await VariantSerialDAO.findByOrderItemId(orderItemId);
    
    if (serials.length === 0) {
      throw new Error('Không tìm thấy serial cho order item này');
    }

    const reservedSerials = serials.filter(s => s.status === 'reserved');
    if (reservedSerials.length === 0) {
      throw new Error('Không có serial nào ở trạng thái reserved');
    }

    for (const serial of reservedSerials) {
      await VariantSerialDAO.update(serial.serial_id, {
        status: 'in_stock',
        order_item_id: null
      });
    }

    return {
      success: true,
      message: `Đã hủy đặt trước ${reservedSerials.length} serial`,
      data: {
        order_item_id: orderItemId,
        quantity: reservedSerials.length
      }
    };
  }

  /**
   * Process RMA (sold -> rma_in)
   */
  async processRMA(serialNumber, warrantyId) {
    const serial = await VariantSerialDAO.findBySerialNumber(serialNumber);
    
    if (!serial) {
      throw new Error('Serial không tồn tại');
    }

    if (serial.status !== 'sold') {
      throw new Error('Chỉ có thể xử lý RMA cho serial đã bán');
    }

    await VariantSerialDAO.update(serial.serial_id, {
      status: 'rma_in',
      warranty_id: warrantyId
    });

    const updatedSerial = await VariantSerialDAO.findById(serial.serial_id);

    return {
      success: true,
      message: 'Đã tiếp nhận RMA',
      data: updatedSerial.toJSON()
    };
  }

  /**
   * Complete RMA (rma_in -> rma_done)
   */
  async completeRMA(serialNumber) {
    const serial = await VariantSerialDAO.findBySerialNumber(serialNumber);
    
    if (!serial) {
      throw new Error('Serial không tồn tại');
    }

    if (serial.status !== 'rma_in') {
      throw new Error('Serial không trong trạng thái RMA');
    }

    await VariantSerialDAO.update(serial.serial_id, {
      status: 'rma_done'
    });

    const updatedSerial = await VariantSerialDAO.findById(serial.serial_id);

    return {
      success: true,
      message: 'Đã hoàn tất RMA',
      data: updatedSerial.toJSON()
    };
  }

  /**
   * Scrap serial
   */
  async scrapSerial(serialId) {
    const serial = await VariantSerialDAO.findById(serialId);
    
    if (!serial) {
      throw new Error('Serial không tồn tại');
    }

    await VariantSerialDAO.update(serialId, {
      status: 'scrapped'
    });

    const updatedSerial = await VariantSerialDAO.findById(serialId);

    return {
      success: true,
      message: 'Đã thanh lý serial',
      data: updatedSerial.toJSON()
    };
  }

  /**
   * Get inventory summary
   */
  async getInventorySummary(variantId) {
    const summary = await VariantSerialDAO.getInventorySummary(variantId);
    
    return {
      success: true,
      data: summary
    };
  }

  /**
   * Search serials with pagination
   */
  async searchSerials(filters, page, limit) {
    const result = await VariantSerialDAO.findAll(filters, page, limit);
    
    return {
      success: true,
      data: result.data.map(s => s.toJSON()),
      pagination: result.pagination
    };
  }
}

export default new VariantSerialService();