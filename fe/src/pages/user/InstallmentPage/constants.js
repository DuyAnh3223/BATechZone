export const provinces = [
  { name: 'TP. Hồ Chí Minh', code: 'hcm' },
  { name: 'Hà Nội', code: 'hanoi' },
  { name: 'Đà Nẵng', code: 'danang' },
  { name: 'Hải Phòng', code: 'haiphong' },
  { name: 'Cần Thơ', code: 'cantho' },
  { name: 'Bình Dương', code: 'binhdung' },
  { name: 'Đồng Nai', code: 'dongnai' },
  { name: 'Bà Rịa - Vũng Tàu', code: 'bariavungtau' },
];

export const districtsByProvince = {
  hcm: [
    'Quận 1', 'Quận 2', 'Quận 3', 'Quận 4', 'Quận 5', 'Quận 6', 'Quận 7', 'Quận 8', 'Quận 9', 'Quận 10',
    'Quận 11', 'Quận 12', 'Quận Bình Thạnh', 'Quận Bình Tân', 'Quận Gò Vấp', 'Quận Phú Nhuận', 
    'Quận Tân Bình', 'Quận Tân Phú', 'Quận Thủ Đức', 'Huyện Bình Chánh', 'Huyện Cần Giờ', 'Huyện Hóc Môn'
  ],
  hanoi: [
    'Ba Đình', 'Bắc Từ Liêm', 'Chương Mỹ', 'Đan Phượng', 'Đông Anh', 'Gia Lâm', 'Hà Đông', 
    'Hoài Đức', 'Hoàng Mai', 'Long Biên', 'Phú Xuyên', 'Quốc Oai', 'Sơn Tây', 'Thanh Oai', 
    'Thanh Trì', 'Thạch Thất', 'Tây Hồ', 'Từ Liêm', 'Ứng Hòa'
  ],
  danang: ['Hải Châu', 'Cẩm Lệ', 'Ngũ Hành Sơn', 'Liên Chiểu', 'Sơn Trà', 'Thanh Khê'],
  haiphong: ['Hồng Bàng', 'Ngô Quyền', 'Lê Chân', 'Đồ Sơn', 'Kiến An', 'An Dương', 'Thủy Nguyên', 'Tiên Lãng'],
  cantho: ['Ninh Kiều', 'Bình Thủy', 'Cờ Đỏ', 'Phong Điền', 'Châu Thành', 'Vĩnh Thạnh', 'Thot Nốt'],
  binhdung: ['Thủ Dầu Một', 'Bến Cát', 'Dầu Tiếng', 'Chơn Thành', 'Phú Giáo', 'Tân Uyên'],
  dongnai: ['Biên Hoà', 'Long Khánh', 'Nhơn Trạch', 'Tân Phú', 'Vĩnh Cửu', 'Định Quán', 'Thống Nhất'],
  bariavungtau: ['Vũng Tàu', 'Bà Rịa', 'Long Điền', 'Đất Đỏ', 'Châu Đức', 'Xuyên Mộc', 'Tuy Phong']
};

export const installmentPolicies = [
  { months: 6, interest_rate: 2.2, min_down_payment: 20, name: 'Trả góp 6 tháng' },
  { months: 8, interest_rate: 1.9, min_down_payment: 20, name: 'Trả góp 8 tháng' },
  { months: 9, interest_rate: 1.9, min_down_payment: 20, name: 'Trả góp 9 tháng' },
  { months: 12, interest_rate: 1.9, min_down_payment: 20, name: 'Trả góp 12 tháng' },
  { months: 15, interest_rate: 1.9, min_down_payment: 20, name: 'Trả góp 15 tháng' },
  { months: 18, interest_rate: 1.9, min_down_payment: 20, name: 'Trả góp 18 tháng' },
];

export const downPaymentOptions = [
  { value: 20, label: '20%' },
  { value: 30, label: '30%' },
  { value: 40, label: '40%' },
  { value: 50, label: '50%' },
];
