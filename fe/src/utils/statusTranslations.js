// Mapping các trạng thái từ tiếng Anh sang tiếng Việt

export const translateOrderStatus = (status) => {
  const map = {
    'pending': 'Chờ xử lý',
    'confirmed': 'Đã xác nhận',
    'processing': 'Đang xử lý',
    'shipping': 'Đang giao hàng',
    'delivered': 'Đã giao hàng',
    'cancelled': 'Đã hủy',
    'refunded': 'Đã hoàn tiền'
  };
  return map[status] || status;
};

export const translatePaymentStatus = (status) => {
  const map = {
    'unpaid': 'Chưa thanh toán',
    'paid': 'Đã thanh toán',
    'partially_paid': 'Thanh toán một phần',
    'refunded': 'Đã hoàn tiền',
    'pending': 'Chờ thanh toán',
    'completed': 'Hoàn thành',
    'failed': 'Thất bại'
  };
  return map[status] || status;
};

export const translatePaymentMethod = (method) => {
  const map = {
    'cod': 'Thanh toán khi nhận hàng',
    'bank_transfer': 'Chuyển khoản ngân hàng',
    'credit_card': 'Thẻ tín dụng',
    'e_wallet': 'Ví điện tử',
    'installment': 'Trả góp'
  };
  return map[method] || method;
};

export const translateWarrantyStatus = (status) => {
  const map = {
    'active': 'Đang hiệu lực',
    'expired': 'Đã hết hạn',
    'claimed': 'Đã yêu cầu',
    'void': 'Vô hiệu'
  };
  return map[status] || status;
};

export const translateWarrantyType = (type) => {
  const map = {
    'manufacturer': 'Bảo hành hãng',
    'store': 'Bảo hành cửa hàng',
    'extended': 'Bảo hành mở rộng'
  };
  return map[type] || type;
};

export const translateServiceRequestStatus = (status) => {
  const map = {
    'pending': 'Chờ xử lý',
    'processing': 'Đang xử lý',
    'completed': 'Hoàn thành',
    'rejected': 'Từ chối',
    'cancelled': 'Đã hủy'
  };
  return map[status] || status;
};

export const translateServiceRequestType = (type) => {
  const map = {
    'warranty': 'Bảo hành',
    'repair': 'Sửa chữa',
    'return': 'Đổi trả'
  };
  return map[type] || type;
};

export const translatePriority = (priority) => {
  const map = {
    'low': 'Thấp',
    'medium': 'Trung bình',
    'high': 'Cao',
    'urgent': 'Khẩn cấp'
  };
  return map[priority] || priority;
};

export const translateNotificationType = (type) => {
  const map = {
    'order': 'Đơn hàng',
    'promotion': 'Khuyến mãi',
    'system': 'Hệ thống',
    'review': 'Đánh giá',
    'message': 'Tin nhắn'
  };
  return map[type] || type;
};

export const translateReportStatus = (status) => {
  const map = {
    'pending': 'Chờ xử lý',
    'reviewing': 'Đang xem xét',
    'resolved': 'Đã xử lý',
    'rejected': 'Từ chối'
  };
  return map[status] || status;
};

export const translateReportType = (type) => {
  const map = {
    'fake_product': 'Sản phẩm giả',
    'inappropriate_content': 'Nội dung không phù hợp',
    'misleading_info': 'Thông tin sai lệch',
    'other': 'Khác'
  };
  return map[type] || type;
};

export const translatePostStatus = (status) => {
  const map = {
    'draft': 'Bản nháp',
    'published': 'Đã xuất bản',
    'archived': 'Đã lưu trữ'
  };
  return map[status] || status;
};

export const translatePostType = (type) => {
  const map = {
    'blog': 'Blog',
    'news': 'Tin tức',
    'guide': 'Hướng dẫn',
    'review': 'Đánh giá'
  };
  return map[type] || type;
};

export const translateUserRole = (role) => {
  const map = {
    'customer': 'Khách hàng',
    'admin': 'Quản trị viên',
    'shipper': 'Người giao hàng'
  };
  return map[role] || role;
};

export const translateAddressType = (type) => {
  const map = {
    'home': 'Nhà riêng',
    'office': 'Văn phòng',
    'other': 'Khác'
  };
  return map[type] || type;
};

