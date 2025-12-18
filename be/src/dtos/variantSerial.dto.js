/**
 * CreateSerialDTO - DTO for creating new serial
 */
class CreateSerialDTO {
  constructor(data) {
    this.variant_id = data.variant_id;
    this.serial_number = data.serial_number;
    this.status = data.status || 'in_stock';
  }

  validate() {
    const errors = [];

    if (!this.variant_id) {
      errors.push('variant_id là bắt buộc');
    }
    if (typeof this.variant_id !== 'number' || this.variant_id <= 0) {
      errors.push('variant_id phải là số nguyên dương');
    }
    if (!this.serial_number || this.serial_number.trim().length === 0) {
      errors.push('serial_number là bắt buộc');
    }
    if (this.serial_number && this.serial_number.length > 64) {
      errors.push('serial_number không được vượt quá 64 ký tự');
    }

    const validStatuses = ['in_stock', 'reserved', 'sold', 'rma_in', 'rma_done', 'scrapped'];
    if (this.status && !validStatuses.includes(this.status)) {
      errors.push(`status phải là một trong: ${validStatuses.join(', ')}`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

/**
 * UpdateSerialDTO - DTO for updating serial
 */
class UpdateSerialDTO {
  constructor(data) {
    this.status = data.status;
    this.order_item_id = data.order_item_id;
    this.warranty_id = data.warranty_id;
  }

  validate() {
    const errors = [];

    if (this.status) {
      const validStatuses = ['in_stock', 'reserved', 'sold', 'rma_in', 'rma_done', 'scrapped'];
      if (!validStatuses.includes(this.status)) {
        errors.push(`status phải là một trong: ${validStatuses.join(', ')}`);
      }
    }

    if (this.order_item_id !== undefined && this.order_item_id !== null) {
      if (typeof this.order_item_id !== 'number' || this.order_item_id <= 0) {
        errors.push('order_item_id phải là số nguyên dương');
      }
    }

    if (this.warranty_id !== undefined && this.warranty_id !== null) {
      if (typeof this.warranty_id !== 'number' || this.warranty_id <= 0) {
        errors.push('warranty_id phải là số nguyên dương');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  getUpdateData() {
    const data = {};
    if (this.status !== undefined) data.status = this.status;
    if (this.order_item_id !== undefined) data.order_item_id = this.order_item_id;
    if (this.warranty_id !== undefined) data.warranty_id = this.warranty_id;
    return data;
  }
}

/**
 * ReserveSerialDTO - DTO for reserving serial
 */
class ReserveSerialDTO {
  constructor(data) {
    this.variant_id = data.variant_id;
    this.order_item_id = data.order_item_id;
    this.quantity = data.quantity || 1;
  }

  validate() {
    const errors = [];

    if (!this.variant_id) {
      errors.push('variant_id là bắt buộc');
    }
    if (typeof this.variant_id !== 'number' || this.variant_id <= 0) {
      errors.push('variant_id phải là số nguyên dương');
    }
    if (!this.order_item_id) {
      errors.push('order_item_id là bắt buộc');
    }
    if (typeof this.order_item_id !== 'number' || this.order_item_id <= 0) {
      errors.push('order_item_id phải là số nguyên dương');
    }
    if (typeof this.quantity !== 'number' || this.quantity <= 0) {
      errors.push('quantity phải là số nguyên dương');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

/**
 * BulkCreateSerialDTO - DTO for bulk creating serials
 */
class BulkCreateSerialDTO {
  constructor(data) {
    this.variant_id = data.variant_id;
    this.serial_numbers = data.serial_numbers || [];
  }

  validate() {
    const errors = [];

    if (!this.variant_id) {
      errors.push('variant_id là bắt buộc');
    }
    if (typeof this.variant_id !== 'number' || this.variant_id <= 0) {
      errors.push('variant_id phải là số nguyên dương');
    }
    if (!Array.isArray(this.serial_numbers)) {
      errors.push('serial_numbers phải là một mảng');
    }
    if (this.serial_numbers.length === 0) {
      errors.push('serial_numbers không được rỗng');
    }
    if (this.serial_numbers.length > 100) {
      errors.push('Chỉ có thể tạo tối đa 100 serial một lần');
    }

    // Check duplicates in array
    const uniqueSerials = new Set(this.serial_numbers);
    if (uniqueSerials.size !== this.serial_numbers.length) {
      errors.push('serial_numbers chứa các giá trị trùng lặp');
    }

    // Validate each serial number
    this.serial_numbers.forEach((sn, index) => {
      if (!sn || sn.trim().length === 0) {
        errors.push(`serial_numbers[${index}] không được để trống`);
      }
      if (sn && sn.length > 64) {
        errors.push(`serial_numbers[${index}] không được vượt quá 64 ký tự`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  getSerials() {
    return this.serial_numbers.map(sn => ({
      variant_id: this.variant_id,
      serial_number: sn.trim(),
      status: 'in_stock'
    }));
  }
}

/**
 * SearchSerialDTO - DTO for searching serials
 */
class SearchSerialDTO {
  constructor(query) {
    this.variant_id = query.variant_id ? parseInt(query.variant_id) : null;
    this.status = query.status || null;
    this.order_item_id = query.order_item_id ? parseInt(query.order_item_id) : null;
    this.serial_number = query.serial_number || null;
    this.page = query.page ? parseInt(query.page) : 1;
    this.limit = query.limit ? parseInt(query.limit) : 20;
  }

  validate() {
    const errors = [];

    if (this.page < 1) {
      errors.push('page phải lớn hơn 0');
    }
    if (this.limit < 1 || this.limit > 100) {
      errors.push('limit phải từ 1 đến 100');
    }

    if (this.status) {
      const validStatuses = ['in_stock', 'reserved', 'sold', 'rma_in', 'rma_done', 'scrapped'];
      if (!validStatuses.includes(this.status)) {
        errors.push(`status phải là một trong: ${validStatuses.join(', ')}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  getFilters() {
    const filters = {};
    if (this.variant_id) filters.variant_id = this.variant_id;
    if (this.status) filters.status = this.status;
    if (this.order_item_id) filters.order_item_id = this.order_item_id;
    if (this.serial_number) filters.serial_number = this.serial_number;
    return filters;
  }
}

export {
  CreateSerialDTO,
  UpdateSerialDTO,
  ReserveSerialDTO,
  BulkCreateSerialDTO,
  SearchSerialDTO
};