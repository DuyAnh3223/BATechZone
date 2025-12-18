class VariantSerial {
    constructor(data) {
        this.serial_id = data.serial_id;
        this.variant_id = data.variant_id;
        this.serial_number = data.serial_number;
        this.status = data.status;
        this.order_item_id = data.order_item_id;
        this.warranty_id = data.warranty_id;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }

    /**
   * Validate serial number format
   */
  static validateSerialNumber(serialNumber) {
    if (!serialNumber || serialNumber.trim().length === 0) {
      throw new Error('Serial number không được để trống');
    }
    if (serialNumber.length > 64) {
      throw new Error('Serial number không được vượt quá 64 ký tự');
    }
    return true;
  }

  /**
   * Validate status
   */
  static validateStatus(status) {
    const validStatuses = ['in_stock', 'reserved', 'sold', 'rma_in', 'rma_done', 'scrapped'];
    if (!validStatuses.includes(status)) {
      throw new Error(`Status không hợp lệ. Phải là một trong: ${validStatuses.join(', ')}`);
    }
    return true;
  }

    /**
   * Check if serial can be reserved
   */
  canBeReserved() {
    return this.status === 'in_stock';
  }

  /**
   * Check if serial can be sold
   */
  canBeSold() {
    return this.status === 'reserved';
  }

  /**
   * Check if serial can process RMA
   */
  canProcessRMA() {
    return this.status === 'sold';
  }

  /**
   * Get display status in Vietnamese
   */
  getDisplayStatus() {
    const statusMap = {
      in_stock: 'Trong kho',
      reserved: 'Đã đặt trước',
      sold: 'Đã bán',
      rma_in: 'Đang bảo hành',
      rma_done: 'Hoàn tất bảo hành',
      scrapped: 'Đã thanh lý'
    };
    return statusMap[this.status] || this.status;
  }

  toJSON() {
    return {
      serial_id: this.serial_id,
      variant_id: this.variant_id,
      serial_number: this.serial_number,
      status: this.status,
      display_status: this.getDisplayStatus(),
      order_item_id: this.order_item_id,
      warranty_id: this.warranty_id,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }
}

export default VariantSerial;