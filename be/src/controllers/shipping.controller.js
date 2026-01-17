import shippingService from "../services/shipping.service.js";

/**
 * Lấy danh sách tỉnh/thành phố
 * GET /api/shipping/provinces
 */
export const getProvinces = async (req, res) => {
  try {
    const provinces = await shippingService.getProvinces();
    
    res.json({
      success: true,
      data: provinces,
      message: 'Lấy danh sách tỉnh/thành công',
    });
  } catch (error) {
    console.error('Error in getProvinces:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Lấy danh sách quận/huyện theo tỉnh
 * GET /api/shipping/districts/: provinceId
 */
export const getDistricts = async (req, res) => {
  try {
    const { provinceId } = req.params;
    
    if (!provinceId) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu provinceId',
      });
    }
    
    const districts = await shippingService.getDistricts(parseInt(provinceId));
    
    res.json({
      success: true,
      data: districts,
      message:  'Lấy danh sách quận/huyện thành công',
    });
  } catch (error) {
    console.error('Error in getDistricts:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Lấy danh sách phường/xã theo quận
 * GET /api/shipping/wards/:districtId
 */
export const getWards = async (req, res) => {
  try {
    const { districtId } = req.params;
    
    if (!districtId) {
      return res. status(400).json({
        success: false,
        message:  'Thiếu districtId',
      });
    }
    
    const wards = await shippingService.getWards(parseInt(districtId));
    
    res.json({
      success: true,
      data: wards,
      message:  'Lấy danh sách phường/xã thành công',
    });
  } catch (error) {
    console.error('Error in getWards:', error);
    res.status(500).json({
      success: false,
      message:  error.message,
    });
  }
};

/**
 * Lấy danh sách dịch vụ vận chuyển khả dụng
 * POST /api/shipping/services
 * Body: { fromDistrict?, toDistrict }
 */
export const getAvailableServices = async (req, res) => {
  try {
    const { fromDistrict, toDistrict } = req.body;
    
    if (!toDistrict) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu toDistrict',
      });
    }
    
    const services = await shippingService.getAvailableServices(fromDistrict, toDistrict);
    
    res.json({
      success: true,
      data: services,
      message: 'Lấy danh sách dịch vụ thành công',
    });
  } catch (error) {
    console.error('Error in getAvailableServices:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Tính phí vận chuyển
 * POST /api/shipping/calculate-fee
 * Body: {
 *   toDistrictId,
 *   toWardCode,
 *   weight?,
 *   length?,
 *   width?,
 *   height?,
 *   insuranceValue?,
 *   codValue?,
 *   serviceId?,
 *   serviceTypeId?,
 *   coupon?,
 *   items? 
 * }
 */
export const calculateShippingFee = async (req, res) => {
  try {
    const {
      toDistrictId,
      toWardCode,
      weight,
      length,
      width,
      height,
      insuranceValue,
      codValue,
      serviceId,
      serviceTypeId,
      coupon,
      items,
    } = req.body;
    
    // Validate required fields
    if (!toDistrictId || !toWardCode) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin địa chỉ giao hàng (toDistrictId, toWardCode)',
      });
    }
    
    const shippingFee = await shippingService.calculateShippingFee({
      toDistrictId,
      toWardCode,
      weight,
      length,
      width,
      height,
      insuranceValue,
      codValue,
      serviceId,
      serviceTypeId,
      coupon,
      items,
    });
    
    res.json({
      success: true,
      data: shippingFee,
      message: 'Tính phí vận chuyển thành công',
    });
  } catch (error) {
    console.error('Error in calculateShippingFee:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Tính thời gian dự kiến giao hàng
 * POST /api/shipping/delivery-time
 * Body: { toDistrictId, toWardCode, serviceId, fromDistrictId?, fromWardCode? }
 */
export const calculateDeliveryTime = async (req, res) => {
  try {
    const { toDistrictId, toWardCode, serviceId, fromDistrictId, fromWardCode } = req.body;
    
    if (!toDistrictId || ! toWardCode || !serviceId) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin (toDistrictId, toWardCode, serviceId)',
      });
    }
    
    const deliveryTime = await shippingService.calculateExpectedDeliveryTime(
      toDistrictId,
      toWardCode,
      serviceId,
      fromDistrictId,
      fromWardCode
    );
    
    // Chuyển timestamp thành ngày giờ dễ đọc
    const leadtimeDate = new Date(deliveryTime.leadtime * 1000);
    const orderDate = new Date(deliveryTime.orderDate * 1000);
    
    res.json({
      success: true,
      data: {
        leadtime: deliveryTime.leadtime,
        orderDate: deliveryTime.orderDate,
        leadtimeFormatted: leadtimeDate. toLocaleString('vi-VN'),
        orderDateFormatted: orderDate.toLocaleString('vi-VN'),
        estimatedDays: Math.ceil((deliveryTime.leadtime - deliveryTime.orderDate) / 86400), // số ngày
      },
      message: 'Tính thời gian giao hàng thành công',
    });
  } catch (error) {
    console.error('Error in calculateDeliveryTime:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};