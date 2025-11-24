/**
 * Installment Status Constants
 * Định nghĩa các trạng thái của hợp đồng trả góp
 */

export const INSTALLMENT_STATUS = {
  PENDING: 'pending',      // Chờ duyệt - khi mới tạo đơn hàng trả góp
  APPROVED: 'approved',    // Đã duyệt - admin đã duyệt hợp đồng
  ACTIVE: 'active',        // Hoạt động - đã thanh toán trả trước
  COMPLETED: 'completed',  // Hoàn thành - đã trả hết các kỳ
  REJECTED: 'rejected',    // Từ chối - admin từ chối
  CANCELLED: 'cancelled'   // Đã hủy - người dùng hoặc admin hủy
};

/**
 * Nhãn hiển thị cho các trạng thái
 */
export const INSTALLMENT_STATUS_LABELS = {
  [INSTALLMENT_STATUS.PENDING]: 'Chờ duyệt',
  [INSTALLMENT_STATUS.APPROVED]: 'Đã duyệt',
  [INSTALLMENT_STATUS.ACTIVE]: 'Hoạt động',
  [INSTALLMENT_STATUS.COMPLETED]: 'Hoàn thành',
  [INSTALLMENT_STATUS.REJECTED]: 'Từ chối',
  [INSTALLMENT_STATUS.CANCELLED]: 'Đã hủy'
};

/**
 * Màu sắc badge cho các trạng thái
 */
export const INSTALLMENT_STATUS_COLORS = {
  [INSTALLMENT_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
  [INSTALLMENT_STATUS.APPROVED]: 'bg-blue-100 text-blue-800 border border-blue-300',
  [INSTALLMENT_STATUS.ACTIVE]: 'bg-green-100 text-green-800 border border-green-300',
  [INSTALLMENT_STATUS.COMPLETED]: 'bg-gray-100 text-gray-800 border border-gray-300',
  [INSTALLMENT_STATUS.REJECTED]: 'bg-red-100 text-red-800 border border-red-300',
  [INSTALLMENT_STATUS.CANCELLED]: 'bg-gray-100 text-gray-800 border border-gray-300'
};

/**
 * Mô tả chi tiết cho từng trạng thái
 */
export const INSTALLMENT_STATUS_DESCRIPTIONS = {
  [INSTALLMENT_STATUS.PENDING]: 'Hợp đồng đang chờ admin xem xét và phê duyệt',
  [INSTALLMENT_STATUS.APPROVED]: 'Hợp đồng đã được duyệt, vui lòng thanh toán trả trước để kích hoạt',
  [INSTALLMENT_STATUS.ACTIVE]: 'Hợp đồng đang hoạt động, bạn có thể thanh toán các kỳ hàng tháng',
  [INSTALLMENT_STATUS.COMPLETED]: 'Hợp đồng đã hoàn thành, tất cả các kỳ đã được thanh toán',
  [INSTALLMENT_STATUS.REJECTED]: 'Hợp đồng đã bị từ chối bởi admin',
  [INSTALLMENT_STATUS.CANCELLED]: 'Hợp đồng đã bị hủy'
};

/**
 * Payment Status Constants
 */
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  OVERDUE: 'overdue',
  CANCELLED: 'cancelled'
};

export const PAYMENT_STATUS_LABELS = {
  [PAYMENT_STATUS.PENDING]: 'Chờ thanh toán',
  [PAYMENT_STATUS.PAID]: 'Đã thanh toán',
  [PAYMENT_STATUS.OVERDUE]: 'Quá hạn',
  [PAYMENT_STATUS.CANCELLED]: 'Đã hủy'
};

export const PAYMENT_STATUS_COLORS = {
  [PAYMENT_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800',
  [PAYMENT_STATUS.PAID]: 'bg-green-100 text-green-800',
  [PAYMENT_STATUS.OVERDUE]: 'bg-red-100 text-red-800',
  [PAYMENT_STATUS.CANCELLED]: 'bg-gray-100 text-gray-800'
};

/**
 * Helper function to get status label
 */
export const getInstallmentStatusLabel = (status) => {
  return INSTALLMENT_STATUS_LABELS[status] || status;
};

/**
 * Helper function to get status color
 */
export const getInstallmentStatusColor = (status) => {
  return INSTALLMENT_STATUS_COLORS[status] || 'bg-gray-100 text-gray-800';
};

/**
 * Helper function to get status description
 */
export const getInstallmentStatusDescription = (status) => {
  return INSTALLMENT_STATUS_DESCRIPTIONS[status] || '';
};

/**
 * Helper function to get payment status label
 */
export const getPaymentStatusLabel = (status) => {
  return PAYMENT_STATUS_LABELS[status] || status;
};

/**
 * Helper function to get payment status color
 */
export const getPaymentStatusColor = (status) => {
  return PAYMENT_STATUS_COLORS[status] || 'bg-gray-100 text-gray-800';
};
