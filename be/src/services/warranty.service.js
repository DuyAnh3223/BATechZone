import WarrantyDAO from '../daos/warranty/warranty.dao.js';
import VariantSerialDAO from '../daos/warranty/variantSerial.dao.js';
import { query } from '../libs/db.js';

/**
 * WarrantyService - Business Logic Layer for Warranty Management
 */
class WarrantyService {

  /**
   * Auto-activate warranties for sold serials
   * Creates one warranty record per serial
   * @param {number} orderItemId - Order item ID
   * @param {number} variantId - Variant ID
   * @param {number[]} soldSerialIds - Array of serial IDs that have been marked as sold
   * @param {object} connection - DB connection for transaction
   */
  async autoActivateWarranties(orderItemId, variantId, soldSerialIds, connection = null) {
    console.log(`🔵 autoActivateWarranties called - orderItemId: ${orderItemId}, variantId: ${variantId}, serialIds:`, soldSerialIds);
    
    try {
      if (!soldSerialIds || soldSerialIds.length === 0) {
        console.log(`⚠️ No sold serials to activate warranty`);
        return {
          success: true,
          message: 'No serials to activate warranty',
          data: { count: 0 }
        };
      }

      // Get warranty_period from product_variant
      let variants;
      if (connection) {
        [variants] = await connection.execute(
          'SELECT warranty_period FROM product_variants WHERE variant_id = ?',
          [variantId]
        );
      } else {
        [variants] = await query(
          'SELECT warranty_period FROM product_variants WHERE variant_id = ?',
          [variantId]
        );
      }

      if (variants.length === 0) {
        throw new Error(`Variant ${variantId} not found`);
      }

      const warrantyPeriod = variants[0].warranty_period || 12; // Default 12 months
      console.log(`📋 Warranty period for variant ${variantId}: ${warrantyPeriod} months`);

      console.log(`📦 Creating warranties for ${soldSerialIds.length} sold serials`);

      // Calculate warranty dates
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + warrantyPeriod);

      // Create warranty for each sold serial
      const warranties = soldSerialIds.map(serialId => ({
        serial_id: serialId,
        order_item_id: orderItemId,
        service_request_id: null,
        warranty_period: warrantyPeriod,
        start_date: startDate,
        end_date: endDate,
        status: 'active'
      }));

      console.log(`💾 Creating ${warranties.length} warranty records...`);
      
      // Bulk create warranties
      if (connection) {
        const sql = `
          INSERT INTO warranties 
          (serial_id, order_item_id, service_request_id, warranty_period, start_date, end_date, status) 
          VALUES ?
        `;
        const values = warranties.map(w => [
          w.serial_id,
          w.order_item_id,
          w.service_request_id,
          w.warranty_period,
          w.start_date,
          w.end_date,
          w.status
        ]);
        await connection.query(sql, [values]);
      } else {
        await WarrantyDAO.bulkCreate(warranties);
      }

      // Update warranty_id in variant_serials for each serial
      for (const serialId of soldSerialIds) {
        // Find the warranty we just created
        let warranty;
        if (connection) {
          const [rows] = await connection.execute(
            'SELECT * FROM warranties WHERE serial_id = ? ORDER BY created_at DESC LIMIT 1',
            [serialId]
          );
          warranty = rows[0];
        } else {
          warranty = await WarrantyDAO.findBySerialId(serialId);
        }
        
        if (warranty) {
          await VariantSerialDAO.update(serialId, {
            warranty_id: warranty.warranty_id
          }, connection);
        }
      }

      console.log(`✅ Activated ${warranties.length} warranties successfully`);

      return {
        success: true,
        message: `Đã kích hoạt ${warranties.length} bảo hành`,
        data: {
          order_item_id: orderItemId,
          variant_id: variantId,
          count: warranties.length,
          warranty_period: warrantyPeriod,
          start_date: startDate,
          end_date: endDate
        }
      };
    } catch (error) {
      console.error(`❌ Error activating warranties:`, error);
      throw error;
    }
  }

  /**
   * Get warranty by serial number
   */
  async getWarrantyBySerialNumber(serialNumber) {
    // Get serial
    const serial = await VariantSerialDAO.findBySerialNumber(serialNumber);
    if (!serial) {
      throw new Error('Serial không tồn tại');
    }

    // Get warranty
    const warranty = await WarrantyDAO.findBySerialId(serial.serial_id);
    if (!warranty) {
      throw new Error('Không tìm thấy thông tin bảo hành');
    }

    return {
      success: true,
      data: {
        serial: serial.toJSON(),
        warranty: warranty.toJSON()
      }
    };
  }

  /**
   * Get all warranties for an order item
   */
  async getWarrantiesByOrderItem(orderItemId) {
    const warranties = await WarrantyDAO.findByOrderItemId(orderItemId);
    
    return {
      success: true,
      data: warranties.map(w => w.toJSON()),
      count: warranties.length
    };
  }

  /**
   * Update warranty status
   */
  async updateWarrantyStatus(warrantyId, status) {
    const warranty = await WarrantyDAO.findById(warrantyId);
    if (!warranty) {
      throw new Error('Warranty không tồn tại');
    }

    const validStatuses = ['active', 'expired', 'claimed', 'void'];
    if (!validStatuses.includes(status)) {
      throw new Error(`Status không hợp lệ. Phải là: ${validStatuses.join(', ')}`);
    }

    await WarrantyDAO.update(warrantyId, { status });

    const updatedWarranty = await WarrantyDAO.findById(warrantyId);

    return {
      success: true,
      message: 'Cập nhật trạng thái bảo hành thành công',
      data: updatedWarranty.toJSON()
    };
  }

  /**
   * Get expiring warranties (within days)
   */
  async getExpiringWarranties(days = 30) {
    const warranties = await WarrantyDAO.getExpiringWarranties(days);
    
    return {
      success: true,
      data: warranties.map(w => w.toJSON()),
      count: warranties.length
    };
  }

  /**
   * Get active warranties
   */
  async getActiveWarranties() {
    const warranties = await WarrantyDAO.getActiveWarranties();
    
    return {
      success: true,
      data: warranties.map(w => w.toJSON()),
      count: warranties.length
    };
  }
}

export default new WarrantyService();
