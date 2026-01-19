import VariantSerialDAO from '../daos/warranty/variantSerial.dao.js';
import VariantSerial from '../models/warranty/VariantSerial.js';

/**
 * VariantSerialService - Business Logic Layer
 */
class VariantSerialService {

  /**
   * Auto generated serial number 
   * FORMAT: PREFIX + {Variant_ID} + {YYYY} + Sequential Number (4 digits starting from 0001)
   * Sequential number is counted for each variant
   */
  generateSerialNumber(variantId, prefix = 'SN', sequenceNumber) {
    const year = new Date().getFullYear();
    const sequentialNumber = String(sequenceNumber).padStart(4, '0');
    return `${prefix}${variantId}${year}${sequentialNumber}`;
  }

  /**
   * Auto-generate serials for a variant based on quantity
   * This will create serial numbers starting from the next available sequence
   */
  async autoGenerateSerials(variantId, quantity) {
    //console.log(`🔵 autoGenerateSerials called - variantId: ${variantId}, quantity: ${quantity}`);
    
    if (!variantId || variantId <= 0) {
      throw new Error('variant_id không hợp lệ');
    }

    if (!quantity || quantity <= 0) {
      throw new Error('quantity phải là số nguyên dương');
    }

    // Get existing serials count for this variant to determine starting sequence
    //console.log(`🔍 Fetching existing serials for variant ${variantId}...`);
    const existingSerials = await VariantSerialDAO.findByVariantId(variantId);
    //console.log(`📊 Found ${existingSerials.length} existing serials`);
    const startingSequence = existingSerials.length + 1;
    //console.log(`🔢 Starting sequence: ${startingSequence}`);

    // Generate serial numbers
    const serialNumbers = [];
    for (let i = 0; i < quantity; i++) {
      const serialNumber = this.generateSerialNumber(variantId, 'SN', startingSequence + i);
      serialNumbers.push(serialNumber);
    }
    //console.log(`✅ Generated serial numbers:`, serialNumbers);

    // Bulk create serials
    const serials = serialNumbers.map(sn => ({
      variant_id: variantId,
      serial_number: sn,
      status: 'in_stock'
    }));

    //console.log(`💾 Inserting ${serials.length} serials into database...`);
    const result = await VariantSerialDAO.bulkInsert(serials);
    //console.log(`✅ Bulk insert result:`, result);

    return {
      success: true,
      message: `Đã tạo ${quantity} serial tự động`,
      data: {
        variant_id: variantId,
        quantity: quantity,
        serial_numbers: serialNumbers
      }
    };
  }

  /**
   * Auto-generate serials for PC Bundle (serial_type = 'pc_bundle')
   * This will create serial numbers starting from the next available sequence
   * FORMAT: BUNDLE + {Variant_ID} + {YYYY} + Sequential Number (4 digits)
   * @param {number} variantId - Bundle variant ID
   * @param {number} quantity - Number of bundle serials to generate
   */
  async autoGenerateSerialsForBundle(variantId, quantity) {
    console.log(`🔵 autoGenerateSerialsForBundle called - variantId: ${variantId}, quantity: ${quantity}`);
    
    if (!variantId || variantId <= 0) {
      throw new Error('variant_id không hợp lệ');
    }

    if (!quantity || quantity <= 0) {
      throw new Error('quantity phải là số nguyên dương');
    }

    // Get existing serials count for this variant to determine starting sequence
    console.log(`🔍 Fetching existing serials for bundle variant ${variantId}...`);
    const existingSerials = await VariantSerialDAO.findByVariantId(variantId);
    console.log(`📊 Found ${existingSerials.length} existing serials`);
    const startingSequence = existingSerials.length + 1;
    console.log(`🔢 Starting sequence: ${startingSequence}`);

    // Generate serial numbers with BUNDLE prefix
    const serialNumbers = [];
    for (let i = 0; i < quantity; i++) {
      const serialNumber = this.generateSerialNumber(variantId, 'BUNDLE', startingSequence + i);
      serialNumbers.push(serialNumber);
    }
    console.log(`✅ Generated bundle serial numbers:`, serialNumbers);

    // Bulk create serials with serial_type = 'pc_bundle'
    const serials = serialNumbers.map(sn => ({
      variant_id: variantId,
      serial_number: sn,
      status: 'in_stock',
      serial_type: 'pc_bundle'
    }));

    console.log(`💾 Inserting ${serials.length} bundle serials into database...`);
    const result = await VariantSerialDAO.bulkInsert(serials);
    console.log(`✅ Bulk insert result:`, result);

    return {
      success: true,
      message: `Đã tạo ${quantity} serial cho PC Bundle`,
      data: {
        variant_id: variantId,
        quantity: quantity,
        serial_type: 'pc_bundle',
        serial_numbers: serialNumbers
      }
    };
  }

  /**
   * Create new serial
   */
  async createSerial(data) {
    // Validate
    if (!data.variant_id || typeof data.variant_id !== 'number' || data.variant_id <= 0) {
      throw new Error('variant_id là bắt buộc và phải là số nguyên dương');
    }
    
    if (!data.serial_number || data.serial_number.trim().length === 0) {
      throw new Error('serial_number là bắt buộc');
    }
    
    if (data.serial_number.length > 64) {
      throw new Error('serial_number không được vượt quá 64 ký tự');
    }

    const validStatuses = ['in_stock', 'reserved', 'sold', 'rma_in', 'rma_done', 'scrapped'];
    if (data.status && !validStatuses.includes(data.status)) {
      throw new Error(`status phải là một trong: ${validStatuses.join(', ')}`);
    }

    // Check if serial number already exists
    const existingSerial = await VariantSerialDAO.findBySerialNumber(data.serial_number);
    if (existingSerial) {
      throw new Error(`Serial number "${data.serial_number}" đã tồn tại`);
    }

    const serialData = {
      variant_id: data.variant_id,
      serial_number: data.serial_number,
      status: data.status || 'in_stock'
    };

    const serialId = await VariantSerialDAO.create(serialData);
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
    // Validate
    if (!data.variant_id || typeof data.variant_id !== 'number' || data.variant_id <= 0) {
      throw new Error('variant_id là bắt buộc và phải là số nguyên dương');
    }
    
    if (!Array.isArray(data.serial_numbers)) {
      throw new Error('serial_numbers phải là một mảng');
    }
    
    if (data.serial_numbers.length === 0) {
      throw new Error('serial_numbers không được rỗng');
    }
    
    if (data.serial_numbers.length > 100) {
      throw new Error('Chỉ có thể tạo tối đa 100 serial một lần');
    }

    // Check duplicates in array
    const uniqueSerials = new Set(data.serial_numbers);
    if (uniqueSerials.size !== data.serial_numbers.length) {
      throw new Error('serial_numbers chứa các giá trị trùng lặp');
    }

    // Validate each serial number
    data.serial_numbers.forEach((sn, index) => {
      if (!sn || sn.trim().length === 0) {
        throw new Error(`serial_numbers[${index}] không được để trống`);
      }
      if (sn && sn.length > 64) {
        throw new Error(`serial_numbers[${index}] không được vượt quá 64 ký tự`);
      }
    });

    // Check for existing serial numbers
    const existingChecks = await Promise.all(
      data.serial_numbers.map(sn => VariantSerialDAO.existsBySerialNumber(sn))
    );

    const duplicates = data.serial_numbers.filter((sn, idx) => existingChecks[idx]);
    if (duplicates.length > 0) {
      throw new Error(`Serial numbers đã tồn tại: ${duplicates.join(', ')}`);
    }

    // Bulk insert
    const serials = data.serial_numbers.map(sn => ({
      variant_id: data.variant_id,
      serial_number: sn.trim(),
      status: 'in_stock'
    }));
    
    await VariantSerialDAO.bulkInsert(serials);

    return {
      success: true,
      message: `Đã tạo ${serials.length} serial thành công`,
      data: {
        variant_id: data.variant_id,
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
    // Validate
    if (data.status) {
      const validStatuses = ['in_stock', 'reserved', 'sold', 'rma_in', 'rma_done', 'scrapped'];
      if (!validStatuses.includes(data.status)) {
        throw new Error(`status phải là một trong: ${validStatuses.join(', ')}`);
      }
    }

    if (data.order_item_id !== undefined && data.order_item_id !== null) {
      if (typeof data.order_item_id !== 'number' || data.order_item_id <= 0) {
        throw new Error('order_item_id phải là số nguyên dương');
      }
    }

    if (data.warranty_id !== undefined && data.warranty_id !== null) {
      if (typeof data.warranty_id !== 'number' || data.warranty_id <= 0) {
        throw new Error('warranty_id phải là số nguyên dương');
      }
    }

    const serial = await VariantSerialDAO.findById(serialId);
    if (!serial) {
      throw new Error('Serial không tồn tại');
    }

    // Build update data
    const updates = {};
    if (data.status !== undefined) updates.status = data.status;
    if (data.order_item_id !== undefined) updates.order_item_id = data.order_item_id;
    if (data.warranty_id !== undefined) updates.warranty_id = data.warranty_id;

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
   * @param {object} data - Reserve data containing variant_id, quantity, order_item_id
   * @param {object} connection - Optional DB connection for transactions
   */
  async reserveSerials(data, connection = null) {
    // Validate
    if (!data.variant_id || typeof data.variant_id !== 'number' || data.variant_id <= 0) {
      throw new Error('variant_id là bắt buộc và phải là số nguyên dương');
    }
    
    if (!data.order_item_id || typeof data.order_item_id !== 'number' || data.order_item_id <= 0) {
      throw new Error('order_item_id là bắt buộc và phải là số nguyên dương');
    }
    
    const quantity = data.quantity || 1;
    if (typeof quantity !== 'number' || quantity <= 0) {
      throw new Error('quantity phải là số nguyên dương');
    }

    // Check available stock
    const availableCount = await VariantSerialDAO.getAvailableCount(data.variant_id, connection);
    if (availableCount < quantity) {
      throw new Error(`Không đủ hàng trong kho. Có sẵn: ${availableCount}, Yêu cầu: ${quantity}`);
    }

    // Find and reserve serials
    const availableSerials = await VariantSerialDAO.findAvailableSerials(
      data.variant_id, 
      quantity,
      connection
    );

    const reservedSerials = [];
    for (const serial of availableSerials) {
      await VariantSerialDAO.update(serial.serial_id, {
        status: 'reserved',
        order_item_id: data.order_item_id
      }, connection);
      reservedSerials.push(serial.serial_number);
    }

    return {
      success: true,
      message: `Đã đặt trước ${reservedSerials.length} serial`,
      data: {
        variant_id: data.variant_id,
        order_item_id: data.order_item_id,
        quantity: reservedSerials.length,
        serial_numbers: reservedSerials
      }
    };
  }

  /**
   * Confirm sale (reserved -> sold)
   * @param {number} orderItemId - Order item ID
   * @param {object} connection - Optional DB connection for transactions
   * @returns {Promise<{success: boolean, message: string, data: object, soldSerialIds: number[]}>}
   */
  async confirmSale(orderItemId, connection = null) {
    const serials = await VariantSerialDAO.findByOrderItemId(orderItemId, connection);
    
    if (serials.length === 0) {
      throw new Error('Không tìm thấy serial cho order item này');
    }

    const reservedSerials = serials.filter(s => s.status === 'reserved');
    if (reservedSerials.length === 0) {
      throw new Error('Không có serial nào ở trạng thái reserved');
    }

    const soldSerialIds = [];
    for (const serial of reservedSerials) {
      await VariantSerialDAO.update(serial.serial_id, {
        status: 'sold'
      }, connection);
      soldSerialIds.push(serial.serial_id);
    }

    return {
      success: true,
      message: `Đã xác nhận bán ${reservedSerials.length} serial`,
      data: {
        order_item_id: orderItemId,
        quantity: reservedSerials.length
      },
      soldSerialIds // Return serial IDs for warranty activation
    };
  }

  /**
   * Cancel reservation (reserved -> in_stock)
   * @param {number} orderItemId - Order item ID
   * @param {object} connection - Optional DB connection for transactions
   */
  async cancelReservation(orderItemId, connection = null) {
    const serials = await VariantSerialDAO.findByOrderItemId(orderItemId, connection);
    
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
      }, connection);
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