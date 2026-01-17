/**
 * Cấu hình API Giao Hàng Nhanh
 * Tài liệu: https://api.ghn.vn/home/docs/detail
 */

export const GHN_CONFIG = {
  // API URL
  BASE_URL: process.env.GHN_API_URL || 'https://dev-online-gateway.ghn.vn/shiip/public-api',
  
  // API Token - Lấy từ https://dev-online-gateway.ghn.vn/
  API_TOKEN: process.env.GHN_API_TOKEN,
  
  // Shop ID - Lấy từ tài khoản GHN của bạn
  SHOP_ID: process.env.GHN_SHOP_ID,
  
  // Địa chỉ kho hàng mặc định (nơi gửi hàng)
  FROM_DISTRICT_ID: process.env.GHN_FROM_DISTRICT_ID || 1442, // Quận 1, TP. HCM
  FROM_WARD_CODE: process.env.GHN_FROM_WARD_CODE || '21211', // Phường Bến Nghé
  
  // Cấu hình mặc định cho đơn hàng
  DEFAULT_WEIGHT:  200, // gram
  DEFAULT_LENGTH: 30, // cm
  DEFAULT_WIDTH: 20, // cm
  DEFAULT_HEIGHT: 10, // cm
  
  // Loại dịch vụ mặc định
  // 1: Hỏa tốc (Express)
  // 2: Chuyển phát tiêu chuẩn (Standard) - E-commerce Delivery
  // 3: Tiết kiệm (Saving)
  SERVICE_TYPE_ID: 2,
  
  // Timeout cho API calls
  TIMEOUT: 10000, // 10 seconds
};

/**
 * Validate GHN configuration
 */
export const validateGHNConfig = () => {
  const requiredFields = ['API_TOKEN', 'SHOP_ID'];
  const missingFields = requiredFields. filter(field => !GHN_CONFIG[field]);
  
  if (missingFields.length > 0) {
    throw new Error(`Missing GHN configuration:  ${missingFields.join(', ')}`);
  }
};