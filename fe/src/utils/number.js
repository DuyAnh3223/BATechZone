/**
 * Safely parse integer with fallback
 * @param {*} value - Value to parse
 * @param {number} fallback - Fallback value if parsing fails
 * @returns {number}
 */
export const safeParseInt = (value, fallback = 0) => {
  const parsed = parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};

/**
 * Safely parse float with fallback
 * @param {*} value - Value to parse
 * @param {number} fallback - Fallback value if parsing fails
 * @returns {number}
 */
export const safeParseFloat = (value, fallback = 0) => {
  const parsed = parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

/**
 * Format currency to Vietnamese Dong
 * @param {number} amount - Amount to format
 * @returns {string}
 */
export const formatCurrency = (amount) => {
  if (!Number.isFinite(amount)) {
    return '0 ₫';
  }
  
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

/**
 * Round to 2 decimal places
 * @param {number} value - Value to round
 * @returns {number}
 */
export const roundToTwo = (value) => {
  return Math.round((value + Number.EPSILON) * 100) / 100;
};
