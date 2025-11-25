-- ===================================================================
-- THÊM THUỘC TÍNH VÀ GIÁ TRỊ CHO CÁC DANH MỤC MỚI
-- ===================================================================

-- ===================================================================
-- 1. MONITOR (Màn hình) - Category ID: 40
-- ===================================================================

-- Thêm thuộc tính cho Monitor
INSERT INTO `attributes` (`attribute_name`, `attribute_type`, `display_order`, `is_active`) VALUES
('Hãng', 'other', 1, 1),           -- attribute_id: 42
('Kích thước', 'size', 2, 1),      -- attribute_id: 43
('Độ phân giải', 'other', 3, 1),   -- attribute_id: 44
('Tấm nền', 'other', 4, 1),        -- attribute_id: 45
('Tần số quét', 'other', 5, 1);    -- attribute_id: 46

-- Liên kết thuộc tính với Monitor
INSERT INTO `attribute_categories` (`attribute_id`, `category_id`) VALUES
(42, 40), (43, 40), (44, 40), (45, 40), (46, 40);

-- Giá trị thuộc tính cho Monitor
INSERT INTO `attribute_values` (`attribute_id`, `value_name`, `display_order`) VALUES
-- Hãng Monitor (attribute_id: 42)
(42, 'ASUS', 1), (42, 'MSI', 2), (42, 'LG', 3), (42, 'Samsung', 4), 
(42, 'Dell', 5), (42, 'Acer', 6), (42, 'ViewSonic', 7), (42, 'AOC', 8),
-- Kích thước (attribute_id: 43)
(43, '24 inch', 1), (43, '27 inch', 2), (43, '32 inch', 3), 
(43, '34 inch', 4), (43, '49 inch', 5),
-- Độ phân giải (attribute_id: 44)
(44, 'Full HD (1920x1080)', 1), (44, '2K (2560x1440)', 2), 
(44, '4K (3840x2160)', 3), (44, 'Ultrawide (3440x1440)', 4),
-- Tấm nền (attribute_id: 45)
(45, 'IPS', 1), (45, 'VA', 2), (45, 'TN', 3), (45, 'OLED', 4),
-- Tần số quét (attribute_id: 46)
(46, '60Hz', 1), (46, '75Hz', 2), (46, '144Hz', 3), 
(46, '165Hz', 4), (46, '240Hz', 5), (46, '360Hz', 6);

-- ===================================================================
-- 2. KEYBOARD (Bàn phím) - Category ID: 41
-- ===================================================================

INSERT INTO `attributes` (`attribute_name`, `attribute_type`, `display_order`, `is_active`) VALUES
('Hãng', 'other', 1, 1),           -- attribute_id: 47
('Loại bàn phím', 'other', 2, 1),  -- attribute_id: 48
('Loại switch', 'other', 3, 1),    -- attribute_id: 49
('Kết nối', 'other', 4, 1),        -- attribute_id: 50
('RGB', 'other', 5, 1);            -- attribute_id: 51

INSERT INTO `attribute_categories` (`attribute_id`, `category_id`) VALUES
(47, 41), (48, 41), (49, 41), (50, 41), (51, 41);

INSERT INTO `attribute_values` (`attribute_id`, `value_name`, `display_order`) VALUES
-- Hãng Keyboard (attribute_id: 47)
(47, 'Corsair', 1), (47, 'Logitech', 2), (47, 'Razer', 3), 
(47, 'SteelSeries', 4), (47, 'HyperX', 5), (47, 'Keychron', 6),
(47, 'DareU', 7), (47, 'Akko', 8),
-- Loại bàn phím (attribute_id: 48)
(48, 'Cơ (Mechanical)', 1), (48, 'Màng (Membrane)', 2), 
(48, 'Optical', 3), (48, 'Hybrid', 4),
-- Loại switch (attribute_id: 49)
(49, 'Cherry MX Red', 1), (49, 'Cherry MX Blue', 2), 
(49, 'Cherry MX Brown', 3), (49, 'Gateron Red', 4), 
(49, 'Gateron Blue', 5), (49, 'Gateron Brown', 6),
(49, 'Kailh Red', 7), (49, 'Kailh Blue', 8),
-- Kết nối (attribute_id: 50)
(50, 'USB có dây', 1), (50, 'Wireless 2.4GHz', 2), 
(50, 'Bluetooth', 3), (50, 'Dual Mode', 4), (50, 'Tri Mode', 5),
-- RGB (attribute_id: 51)
(51, 'Có RGB', 1), (51, 'Đơn sắc', 2), (51, 'Không đèn', 3);

-- ===================================================================
-- 3. MOUSE (Chuột) - Category ID: 42
-- ===================================================================

INSERT INTO `attributes` (`attribute_name`, `attribute_type`, `display_order`, `is_active`) VALUES
('Hãng', 'other', 1, 1),           -- attribute_id: 52
('Kiểu chuột', 'other', 2, 1),     -- attribute_id: 53
('DPI', 'other', 3, 1),            -- attribute_id: 54
('Kết nối', 'other', 4, 1),        -- attribute_id: 55
('RGB', 'other', 5, 1);            -- attribute_id: 56

INSERT INTO `attribute_categories` (`attribute_id`, `category_id`) VALUES
(52, 42), (53, 42), (54, 42), (55, 42), (56, 42);

INSERT INTO `attribute_values` (`attribute_id`, `value_name`, `display_order`) VALUES
-- Hãng Mouse (attribute_id: 52)
(52, 'Logitech', 1), (52, 'Razer', 2), (52, 'SteelSeries', 3),
(52, 'Corsair', 4), (52, 'HyperX', 5), (52, 'Glorious', 6),
(52, 'DareU', 7), (52, 'Asus ROG', 8),
-- Kiểu chuột (attribute_id: 53)
(53, 'Gaming', 1), (53, 'Văn phòng', 2), 
(53, 'Ergonomic', 3), (53, 'Ultra-light', 4),
-- DPI (attribute_id: 54)
(54, '800-1600 DPI', 1), (54, '3200 DPI', 2), 
(54, '6400 DPI', 3), (54, '12000 DPI', 4), 
(54, '16000 DPI', 5), (54, '25600 DPI', 6),
-- Kết nối (attribute_id: 55)
(55, 'USB có dây', 1), (55, 'Wireless 2.4GHz', 2), 
(55, 'Bluetooth', 3), (55, 'Dual Mode', 4),
-- RGB (attribute_id: 56)
(56, 'Có RGB', 1), (56, 'Đơn sắc', 2), (56, 'Không đèn', 3);

-- ===================================================================
-- 4. HEADPHONE (Tai nghe) - Category ID: 43
-- ===================================================================

INSERT INTO `attributes` (`attribute_name`, `attribute_type`, `display_order`, `is_active`) VALUES
('Hãng', 'other', 1, 1),           -- attribute_id: 57
('Loại tai nghe', 'other', 2, 1),  -- attribute_id: 58
('Kết nối', 'other', 3, 1),        -- attribute_id: 59
('Micro', 'other', 4, 1),          -- attribute_id: 60
('RGB', 'other', 5, 1);            -- attribute_id: 61

INSERT INTO `attribute_categories` (`attribute_id`, `category_id`) VALUES
(57, 43), (58, 43), (59, 43), (60, 43), (61, 43);

INSERT INTO `attribute_values` (`attribute_id`, `value_name`, `display_order`) VALUES
-- Hãng Headphone (attribute_id: 57)
(57, 'Logitech', 1), (57, 'Razer', 2), (57, 'SteelSeries', 3),
(57, 'Corsair', 4), (57, 'HyperX', 5), (57, 'Sony', 6),
(57, 'Edifier', 7), (57, 'JBL', 8),
-- Loại tai nghe (attribute_id: 58)
(58, 'Gaming', 1), (58, 'Âm nhạc', 2), 
(58, 'Chống ồn (ANC)', 3), (58, 'Văn phòng', 4),
-- Kết nối (attribute_id: 59)
(59, 'Jack 3.5mm', 1), (59, 'USB', 2), 
(59, 'Wireless 2.4GHz', 3), (59, 'Bluetooth', 4),
-- Micro (attribute_id: 60)
(60, 'Có mic rời', 1), (60, 'Mic gắn liền', 2), 
(60, 'Không mic', 3),
-- RGB (attribute_id: 61)
(61, 'Có RGB', 1), (61, 'Đơn sắc', 2), (61, 'Không đèn', 3);

-- ===================================================================
-- 5. SPEAKER (Loa) - Category ID: 44
-- ===================================================================

INSERT INTO `attributes` (`attribute_name`, `attribute_type`, `display_order`, `is_active`) VALUES
('Hãng', 'other', 1, 1),           -- attribute_id: 62
('Loại loa', 'other', 2, 1),       -- attribute_id: 63
('Công suất', 'other', 3, 1),      -- attribute_id: 64
('Kết nối', 'other', 4, 1),        -- attribute_id: 65
('RGB', 'other', 5, 1);            -- attribute_id: 66

INSERT INTO `attribute_categories` (`attribute_id`, `category_id`) VALUES
(62, 44), (63, 44), (64, 44), (65, 44), (66, 44);

INSERT INTO `attribute_values` (`attribute_id`, `value_name`, `display_order`) VALUES
-- Hãng Speaker (attribute_id: 62)
(62, 'Edifier', 1), (62, 'Logitech', 2), (62, 'Creative', 3),
(62, 'JBL', 4), (62, 'Harman Kardon', 5), (62, 'Razer', 6),
-- Loại loa (attribute_id: 63)
(63, '2.0', 1), (63, '2.1', 2), (63, '5.1', 3), (63, 'Soundbar', 4),
-- Công suất (attribute_id: 64)
(64, '10W - 20W', 1), (64, '20W - 50W', 2), 
(64, '50W - 100W', 3), (64, 'Trên 100W', 4),
-- Kết nối (attribute_id: 65)
(65, 'Jack 3.5mm', 1), (65, 'USB', 2), 
(65, 'Bluetooth', 3), (65, 'Optical', 4),
-- RGB (attribute_id: 66)
(66, 'Có RGB', 1), (66, 'Đơn sắc', 2), (66, 'Không đèn', 3);

-- ===================================================================
-- 6. GAMING CHAIR (Ghế gaming) - Category ID: 45
-- ===================================================================

INSERT INTO `attributes` (`attribute_name`, `attribute_type`, `display_order`, `is_active`) VALUES
('Hãng', 'other', 1, 1),           -- attribute_id: 67
('Chất liệu', 'other', 2, 1),      -- attribute_id: 68
('Tính năng', 'other', 3, 1),      -- attribute_id: 69
('Màu sắc', 'color', 4, 1),        -- attribute_id: 70
('Trọng tải', 'other', 5, 1);      -- attribute_id: 71

INSERT INTO `attribute_categories` (`attribute_id`, `category_id`) VALUES
(67, 45), (68, 45), (69, 45), (70, 45), (71, 45);

INSERT INTO `attribute_values` (`attribute_id`, `value_name`, `display_order`) VALUES
-- Hãng Gaming Chair (attribute_id: 67)
(67, 'DXRacer', 1), (67, 'Secretlab', 2), (67, 'E-Dra', 3),
(67, 'AKRacing', 4), (67, 'Corsair', 5), (67, 'Noblechairs', 6),
-- Chất liệu (attribute_id: 68)
(68, 'Da PU', 1), (68, 'Da thật', 2), 
(68, 'Vải lưới', 3), (68, 'Vải cao cấp', 4),
-- Tính năng (attribute_id: 69)
(69, 'Massage', 1), (69, 'Ngả 180°', 2), 
(69, 'Tựa chân', 3), (69, 'Điều chỉnh 4D', 4),
-- Màu sắc (attribute_id: 70)
(70, 'Đen', 1), (70, 'Đỏ đen', 2), (70, 'Xanh đen', 3),
(70, 'Trắng đen', 4), (70, 'Hồng', 5),
-- Trọng tải (attribute_id: 71)
(71, 'Dưới 100kg', 1), (71, '100-120kg', 2), 
(71, '120-150kg', 3), (71, 'Trên 150kg', 4);

-- ===================================================================
-- 7. CASE FAN (Quạt case) - Category ID: 46
-- ===================================================================

INSERT INTO `attributes` (`attribute_name`, `attribute_type`, `display_order`, `is_active`) VALUES
('Hãng', 'other', 1, 1),           -- attribute_id: 72
('Kích thước', 'size', 2, 1),      -- attribute_id: 73
('Tốc độ', 'other', 3, 1),         -- attribute_id: 74
('RGB', 'other', 4, 1),            -- attribute_id: 75
('Loại bearing', 'other', 5, 1);   -- attribute_id: 76

INSERT INTO `attribute_categories` (`attribute_id`, `category_id`) VALUES
(72, 46), (73, 46), (74, 46), (75, 46), (76, 46);

INSERT INTO `attribute_values` (`attribute_id`, `value_name`, `display_order`) VALUES
-- Hãng Case Fan (attribute_id: 72)
(72, 'Corsair', 1), (72, 'NZXT', 2), (72, 'Cooler Master', 3),
(72, 'Thermaltake', 4), (72, 'Deepcool', 5), (72, 'be quiet!', 6),
(72, 'Noctua', 7), (72, 'Arctic', 8),
-- Kích thước (attribute_id: 73)
(73, '120mm', 1), (73, '140mm', 2), (73, '200mm', 3),
-- Tốc độ (attribute_id: 74)
(74, '1000-1500 RPM', 1), (74, '1500-2000 RPM', 2), (74, '2000+ RPM', 3),
-- RGB (attribute_id: 75)
(75, 'RGB ARGB', 1), (75, 'RGB', 2), (75, 'Đơn sắc', 3), (75, 'Không đèn', 4),
-- Loại bearing (attribute_id: 76)
(76, 'Rifle Bearing', 1), (76, 'Fluid Dynamic Bearing', 2), 
(76, 'Magnetic Levitation', 3), (76, 'Hydraulic Bearing', 4);

-- ===================================================================
-- 8. AIR COOLER (Tản nhiệt khí) - Category ID: 47
-- ===================================================================

INSERT INTO `attributes` (`attribute_name`, `attribute_type`, `display_order`, `is_active`) VALUES
('Hãng', 'other', 1, 1),           -- attribute_id: 77
('Loại tản', 'other', 2, 1),       -- attribute_id: 78
('Số ống nhiệt', 'other', 3, 1),   -- attribute_id: 79
('Socket hỗ trợ', 'other', 4, 1),  -- attribute_id: 80
('RGB', 'other', 5, 1);            -- attribute_id: 81

INSERT INTO `attribute_categories` (`attribute_id`, `category_id`) VALUES
(77, 47), (78, 47), (79, 47), (80, 47), (81, 47);

INSERT INTO `attribute_values` (`attribute_id`, `value_name`, `display_order`) VALUES
-- Hãng Air Cooler (attribute_id: 77)
(77, 'Noctua', 1), (77, 'be quiet!', 2), (77, 'Cooler Master', 3),
(77, 'Deepcool', 4), (77, 'Thermalright', 5), (77, 'Arctic', 6),
-- Loại tản (attribute_id: 78)
(78, 'Tower đơn', 1), (78, 'Tower đôi', 2), (78, 'Low profile', 3),
-- Số ống nhiệt (attribute_id: 79)
(79, '2 ống nhiệt', 1), (79, '4 ống nhiệt', 2), 
(79, '5 ống nhiệt', 3), (79, '6 ống nhiệt', 4), (79, '7+ ống nhiệt', 5),
-- Socket hỗ trợ (attribute_id: 80)
(80, 'Intel LGA1700', 1), (80, 'Intel LGA1200', 2), (80, 'Intel LGA1151', 3),
(80, 'AMD AM5', 4), (80, 'AMD AM4', 5), (80, 'Universal', 6),
-- RGB (attribute_id: 81)
(81, 'RGB ARGB', 1), (81, 'RGB', 2), (81, 'Không đèn', 3);

-- ===================================================================
-- 9. AIO COOLER (Tản nhiệt nước AIO) - Category ID: 48
-- ===================================================================

INSERT INTO `attributes` (`attribute_name`, `attribute_type`, `display_order`, `is_active`) VALUES
('Hãng', 'other', 1, 1),           -- attribute_id: 82
('Kích thước Radiator', 'size', 2, 1), -- attribute_id: 83
('Số quạt', 'other', 3, 1),        -- attribute_id: 84
('Socket hỗ trợ', 'other', 4, 1),  -- attribute_id: 85
('RGB', 'other', 5, 1);            -- attribute_id: 86

INSERT INTO `attribute_categories` (`attribute_id`, `category_id`) VALUES
(82, 48), (83, 48), (84, 48), (85, 48), (86, 48);

INSERT INTO `attribute_values` (`attribute_id`, `value_name`, `display_order`) VALUES
-- Hãng AIO Cooler (attribute_id: 82)
(82, 'Corsair', 1), (82, 'NZXT', 2), (82, 'Cooler Master', 3),
(82, 'Deepcool', 4), (82, 'MSI', 5), (82, 'ASUS', 6),
(82, 'Thermaltake', 7), (82, 'Arctic', 8),
-- Kích thước Radiator (attribute_id: 83)
(83, '120mm', 1), (83, '240mm', 2), (83, '280mm', 3),
(83, '360mm', 4), (83, '420mm', 5),
-- Số quạt (attribute_id: 84)
(84, '1 quạt', 1), (84, '2 quạt', 2), (84, '3 quạt', 3),
-- Socket hỗ trợ (attribute_id: 85)
(85, 'Intel LGA1700', 1), (85, 'Intel LGA1200', 2), (85, 'Intel LGA1151', 3),
(85, 'AMD AM5', 4), (85, 'AMD AM4', 5), (85, 'Universal', 6),
-- RGB (attribute_id: 86)
(86, 'RGB ARGB', 1), (86, 'RGB', 2), (86, 'LCD Display', 3), (86, 'Không đèn', 4);

-- ===================================================================
-- 10. CUSTOM WATER (Tản nước custom) - Category ID: 49
-- ===================================================================

INSERT INTO `attributes` (`attribute_name`, `attribute_type`, `display_order`, `is_active`) VALUES
('Hãng', 'other', 1, 1),           -- attribute_id: 87
('Loại linh kiện', 'other', 2, 1), -- attribute_id: 88
('Kích thước', 'size', 3, 1),      -- attribute_id: 89
('Chất liệu', 'other', 4, 1),      -- attribute_id: 90
('RGB', 'other', 5, 1);            -- attribute_id: 91

INSERT INTO `attribute_categories` (`attribute_id`, `category_id`) VALUES
(87, 49), (88, 49), (89, 49), (90, 49), (91, 49);

INSERT INTO `attribute_values` (`attribute_id`, `value_name`, `display_order`) VALUES
-- Hãng Custom Water (attribute_id: 87)
(87, 'EK Water Blocks', 1), (87, 'Bitspower', 2), (87, 'Corsair', 3),
(87, 'Thermaltake', 4), (87, 'Alphacool', 5), (87, 'Barrow', 6),
-- Loại linh kiện (attribute_id: 88)
(88, 'Water Block CPU', 1), (88, 'Water Block GPU', 2), 
(88, 'Radiator', 3), (88, 'Reservoir', 4), 
(88, 'Pump', 5), (88, 'Fitting', 6), (88, 'Ống', 7),
-- Kích thước (attribute_id: 89)
(89, '120mm', 1), (89, '240mm', 2), (89, '280mm', 3),
(89, '360mm', 4), (89, '480mm', 5),
-- Chất liệu (attribute_id: 90)
(90, 'Đồng (Copper)', 1), (90, 'Nhôm (Aluminum)', 2), 
(90, 'Acrylic', 3), (90, 'Thủy tinh', 4),
-- RGB (attribute_id: 91)
(91, 'RGB ARGB', 1), (91, 'RGB', 2), (91, 'Không đèn', 3);

-- ===================================================================
-- HOÀN TẤT
-- ===================================================================
