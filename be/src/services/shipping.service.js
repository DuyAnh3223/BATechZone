import axios from 'axios';
import { GHN_CONFIG, validateGHNConfig } from '../config/ghn.config.js';

/**
 * Service để tương tác với API Giao Hàng Nhanh
 */
class GHNService {
  constructor() {
    // Validate config khi khởi tạo
    validateGHNConfig();
    
    // Tạo axios instance với config mặc định
    this.client = axios. create({
      baseURL: GHN_CONFIG.BASE_URL,
      timeout: GHN_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        'Token': GHN_CONFIG.API_TOKEN,
      },
    });
  }

  /**
   * Lấy danh sách tỉnh/thành phố
   * API: GET /master-data/province
   */
  async getProvinces() {
    try {
      const response = await this.client. get('/master-data/province');
      
      if (response.data.code !== 200) {
        throw new Error(response.data.message || 'Không thể lấy danh sách tỉnh/thành');
      }
      
      // Response trả về: ProvinceID, ProvinceName, Code
      return response.data. data;
    } catch (error) {
      console.error('Error getting provinces from GHN:', error);
      throw new Error(error.response?.data?.message || 'Không thể lấy danh sách tỉnh/thành từ GHN');
    }
  }

  /**
   * Lấy danh sách quận/huyện theo tỉnh
   * API: POST /master-data/district
   * @param {number} provinceId - ID của tỉnh/thành (ProvinceID)
   */
  async getDistricts(provinceId) {
    try {
      const response = await this. client.post('/master-data/district', {
        province_id: parseInt(provinceId),
      });
      
      if (response. data.code !== 200) {
        throw new Error(response. data.message || 'Không thể lấy danh sách quận/huyện');
      }
      
      // Response trả về: DistrictID, ProvinceID, DistrictName, Code, Type, SupportType
      return response.data.data;
    } catch (error) {
      console.error('Error getting districts from GHN:', error);
      throw new Error(error.response?.data?.message || 'Không thể lấy danh sách quận/huyện từ GHN');
    }
  }

  /**
   * Lấy danh sách phường/xã theo quận
   * API: POST /master-data/ward? district_id
   * @param {number} districtId - ID của quận/huyện (DistrictID)
   */
  async getWards(districtId) {
    try {
      const response = await this.client.post('/master-data/ward? district_id', {
        district_id: parseInt(districtId),
      });
      
      if (response.data.code !== 200) {
        throw new Error(response.data.message || 'Không thể lấy danh sách phường/xã');
      }
      
      // Response trả về: WardCode, DistrictID, WardName
      return response.data.data;
    } catch (error) {
      console.error('Error getting wards from GHN:', error);
      throw new Error(error.response?.data?.message || 'Không thể lấy danh sách phường/xã từ GHN');
    }
  }

  /**
   * Lấy danh sách dịch vụ vận chuyển khả dụng
   * API: POST /v2/shipping-order/available-services
   * @param {number} fromDistrict - ID quận/huyện gửi hàng
   * @param {number} toDistrict - ID quận/huyện nhận hàng
   */
  async getAvailableServices(fromDistrict, toDistrict) {
    try {
      const response = await this. client.post('/v2/shipping-order/available-services', {
        shop_id: parseInt(GHN_CONFIG.SHOP_ID),
        from_district:  parseInt(fromDistrict || GHN_CONFIG.FROM_DISTRICT_ID),
        to_district: parseInt(toDistrict),
      });
      
      if (response.data.code !== 200) {
        throw new Error(response.data.message || 'Không thể lấy danh sách dịch vụ');
      }
      
      // Response:  service_id, short_name, service_type_id
      return response.data.data;
    } catch (error) {
      console.error('Error getting available services from GHN:', error);
      throw new Error(error.response?.data?.message || 'Không thể lấy danh sách dịch vụ vận chuyển từ GHN');
    }
  }

  /**
   * Tính phí vận chuyển
   * API:  POST /v2/shipping-order/fee
   * @param {Object} params - Thông tin để tính phí
   */
  async calculateShippingFee(params) {
    try {
      const {
        toDistrictId,
        toWardCode,
        weight = GHN_CONFIG.DEFAULT_WEIGHT,
        length = GHN_CONFIG.DEFAULT_LENGTH,
        width = GHN_CONFIG.DEFAULT_WIDTH,
        height = GHN_CONFIG.DEFAULT_HEIGHT,
        insuranceValue = 0,
        codValue = 0,
        serviceId = null,
        serviceTypeId = null,
        coupon = null,
        items = null,
      } = params;

      // Validate required params
      if (!toDistrictId || ! toWardCode) {
        throw new Error('Thiếu thông tin địa chỉ giao hàng (toDistrictId, toWardCode)');
      }

      const requestData = {
        from_district_id: parseInt(GHN_CONFIG.FROM_DISTRICT_ID),
        from_ward_code: GHN_CONFIG.FROM_WARD_CODE,
        service_id: serviceId ?  parseInt(serviceId) : null,
        service_type_id:  serviceTypeId || (serviceId ? null : GHN_CONFIG.SERVICE_TYPE_ID),
        to_district_id: parseInt(toDistrictId),
        to_ward_code: toWardCode. toString(),
        height: parseInt(height),
        length: parseInt(length),
        weight: parseInt(weight),
        width: parseInt(width),
        insurance_value: parseInt(insuranceValue),
        cod_value: parseInt(codValue),
        coupon: coupon || null,
      };

      // Thêm items nếu có (cho trường hợp tính từng sản phẩm)
      if (items && Array.isArray(items)) {
        requestData.items = items;
      }

      const response = await this.client.post('/v2/shipping-order/fee', requestData, {
        headers: {
          'Token': GHN_CONFIG.API_TOKEN,
          'ShopId': GHN_CONFIG. SHOP_ID. toString(),
        },
      });

      if (response.data. code !== 200) {
        throw new Error(response.data. message || 'Không thể tính phí vận chuyển');
      }

      // Response đầy đủ theo docs
      return {
        total:  response.data.data.total,
        serviceFee: response.data.data.service_fee,
        insuranceFee: response.data.data.insurance_fee,
        pickStationFee: response.data. data.pick_station_fee || 0,
        couponValue: response.data.data.coupon_value || 0,
        r2sFee: response.data.data. r2s_fee || 0,
        returnAgain: response.data.data.return_again || 0,
        documentReturn: response.data.data. document_return || 0,
        doubleCheck: response.data.data.double_check || 0,
        codFee: response.data.data. cod_fee || 0,
        pickRemoteAreasFee: response.data.data. pick_remote_areas_fee || 0,
        deliverRemoteAreasFee: response.data.data.deliver_remote_areas_fee || 0,
        codFailedFee: response.data.data.cod_failed_fee || 0,
      };
    } catch (error) {
      console.error('Error calculating shipping fee from GHN:', error);
      
      // Trả về thông tin lỗi chi tiết hơn
      if (error.response?.data) {
        throw new Error(error.response.data.message || 'Không thể tính phí vận chuyển');
      }
      
      throw new Error(error.message || 'Không thể tính phí vận chuyển từ GHN');
    }
  }

  /**
   * Tính thời gian dự kiến giao hàng
   * API: POST /v2/shipping-order/leadtime
   * @param {number} toDistrictId - ID quận/huyện đích
   * @param {string} toWardCode - Mã phường/xã đích
   * @param {number} serviceId - ID dịch vụ vận chuyển
   * @param {number} fromDistrictId - ID quận/huyện gửi (optional)
   * @param {string} fromWardCode - Mã phường/xã gửi (optional)
   */
  async calculateExpectedDeliveryTime(toDistrictId, toWardCode, serviceId, fromDistrictId = null, fromWardCode = null) {
    try {
      const requestData = {
        from_district_id: parseInt(fromDistrictId || GHN_CONFIG.FROM_DISTRICT_ID),
        from_ward_code: fromWardCode || GHN_CONFIG.FROM_WARD_CODE,
        to_district_id: parseInt(toDistrictId),
        to_ward_code: toWardCode.toString(),
        service_id: parseInt(serviceId),
      };

      const response = await this.client.post('/v2/shipping-order/leadtime', requestData, {
        headers: {
          'Token': GHN_CONFIG.API_TOKEN,
          'ShopId': GHN_CONFIG.SHOP_ID.toString(),
        },
      });

      if (response.data.code !== 200) {
        throw new Error(response.data.message || 'Không thể tính thời gian giao hàng');
      }

      return {
        leadtime: response.data.data.leadtime, // Timestamp dự kiến giao
        orderDate: response.data.data.order_date, // Timestamp ngày tạo đơn
      };
    } catch (error) {
      console.error('Error calculating delivery time from GHN:', error);
      throw new Error(error.response?.data?.message || 'Không thể tính thời gian giao hàng từ GHN');
    }
  }
}

// Export singleton instance
export default new GHNService();