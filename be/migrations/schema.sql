
CREATE TABLE `attributes` (
  `attribute_id` int(11) NOT NULL,
  `attribute_name` varchar(100) NOT NULL,
  `display_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `attributes`
--

INSERT INTO `attributes` (`attribute_id`, `attribute_name`, `display_order`, `is_active`, `created_at`) VALUES
(1, 'Hãng', 1, 1, '2026-01-04 12:31:19'),
(2, 'Dòng CPU', 2, 1, '2026-01-04 12:31:19'),
(3, 'CPU theo Socket', 3, 1, '2026-01-04 12:31:19'),
(4, 'Thế hệ CPU', 4, 1, '2026-01-04 12:31:19'),
(5, 'Nhu cầu sử dụng', 5, 1, '2026-01-04 12:31:19'),
(6, 'Kiểu Bộ Nhớ', 6, 1, '2026-01-04 12:31:19'),
(7, 'Kích Thước Bộ Nhớ', 7, 1, '2026-01-04 12:31:19'),
(8, 'Dung Lượng', 8, 1, '2026-01-04 12:31:19'),
(9, 'Loại Ổ Cứng', 9, 1, '2026-01-04 12:31:19'),
(10, 'Giao diện PCIe', 10, 1, '2026-01-04 12:31:19'),
(11, 'Socket Hỗ Trợ', 11, 1, '2026-01-04 12:31:19'),
(12, 'Chipset', 12, 1, '2026-01-04 12:31:19'),
(13, 'Kiểu Kích Thước (Form Factor)', 13, 1, '2026-01-04 12:31:19'),
(14, 'Số Khe Cắm RAM', 14, 1, '2026-01-04 12:31:19'),
(15, 'Công Suất Nguồn', 15, 1, '2026-01-04 12:31:19'),
(16, 'Chuẩn Nguồn', 16, 1, '2026-01-04 12:31:19'),
(17, 'Kiểu Dây Nguồn', 17, 1, '2026-01-04 12:31:19'),
(18, 'Kích Cỡ', 18, 1, '2026-01-04 12:31:19'),
(19, 'Kích thước Mainboard', 19, 1, '2026-01-04 12:31:19'),
(20, 'Tốc Độ Vòng Quay', 20, 1, '2026-01-04 12:31:19'),
(21, 'Loại RAM', 21, 1, '2026-01-04 12:31:19'),
(22, 'Bus RAM', 22, 1, '2026-01-04 12:31:19'),
(23, 'Tần Số Quét', 23, 1, '2026-01-04 12:31:19'),
(24, 'Độ Phân Giải', 24, 1, '2026-01-04 12:31:19'),
(25, 'Tấm Nền', 25, 1, '2026-01-04 12:31:19'),
(26, 'Kích Thước', 26, 1, '2026-01-04 12:31:19');


CREATE TABLE `attributes_categories` (
  `attribute_category_id` int(11) NOT NULL,
  `attribute_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `is_variant_attribute` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `attributes_categories`
--

INSERT INTO `attributes_categories` (`attribute_category_id`, `attribute_id`, `category_id`, `is_variant_attribute`) VALUES
(1, 1, 1, 0),
(2, 2, 1, 0),
(3, 3, 1, 0),
(4, 4, 1, 0),
(5, 1, 2, 0),
(6, 5, 2, 0),
(7, 6, 2, 0),
(8, 7, 2, 0),
(9, 1, 4, 0),
(10, 8, 4, 1),
(11, 9, 4, 0),
(12, 10, 4, 0),
(13, 1, 5, 0),
(14, 11, 5, 0),
(15, 12, 5, 0),
(16, 13, 5, 0),
(17, 14, 5, 0),
(18, 1, 6, 0),
(19, 15, 6, 1),
(20, 16, 6, 0),
(21, 17, 6, 0),
(22, 1, 7, 0),
(23, 18, 7, 0),
(24, 19, 7, 0),
(25, 1, 13, 0),
(26, 8, 13, 1),
(27, 20, 13, 0),
(28, 21, 35, 0),
(29, 1, 35, 0),
(30, 22, 35, 0),
(31, 8, 35, 1),
(32, 1, 40, 0),
(33, 23, 40, 0),
(34, 24, 40, 0),
(35, 25, 40, 0),
(36, 26, 40, 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `attribute_values`
--

CREATE TABLE `attribute_values` (
  `attribute_value_id` int(11) NOT NULL,
  `attribute_id` int(11) NOT NULL,
  `value_name` varchar(100) NOT NULL,
  `display_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `attribute_values`
--

INSERT INTO `attribute_values` (`attribute_value_id`, `attribute_id`, `value_name`, `display_order`, `is_active`, `created_at`) VALUES
(1, 1, 'Intel', 1, 1, '2026-01-04 12:31:19'),
(2, 1, 'AMD', 2, 1, '2026-01-04 12:31:19'),
(3, 1, 'NVIDIA', 3, 1, '2026-01-04 12:31:19'),
(4, 1, 'Asus', 4, 1, '2026-01-04 12:31:19'),
(5, 1, 'Gigabyte', 5, 1, '2026-01-04 12:31:19'),
(6, 1, 'MSI', 6, 1, '2026-01-04 12:31:19'),
(7, 1, 'Asrock', 7, 1, '2026-01-04 12:31:19'),
(8, 1, 'Sapphire', 8, 1, '2026-01-04 12:31:19'),
(9, 1, 'Inno3D', 9, 1, '2026-01-04 12:31:19'),
(10, 1, 'Colorful', 10, 1, '2026-01-04 12:31:19'),
(11, 1, 'Corsair', 11, 1, '2026-01-04 12:31:19'),
(12, 1, 'Western Digital', 12, 1, '2026-01-04 12:31:19'),
(13, 1, 'Samsung', 13, 1, '2026-01-04 12:31:19'),
(14, 1, 'Lexar', 14, 1, '2026-01-04 12:31:19'),
(15, 1, 'Kingston', 15, 1, '2026-01-04 12:31:19'),
(16, 1, 'PNY', 16, 1, '2026-01-04 12:31:19'),
(17, 1, 'Apacer', 17, 1, '2026-01-04 12:31:19'),
(18, 1, 'Seagate', 18, 1, '2026-01-04 12:31:19'),
(19, 1, 'Toshiba', 19, 1, '2026-01-04 12:31:19'),
(20, 1, 'Adata', 20, 1, '2026-01-04 12:31:19'),
(21, 1, 'GSkill', 21, 1, '2026-01-04 12:31:19'),
(22, 1, 'TeamGroup', 22, 1, '2026-01-04 12:31:19'),
(23, 1, 'KingMax', 23, 1, '2026-01-04 12:31:19'),
(24, 1, 'Xigmatek', 24, 1, '2026-01-04 12:31:19'),
(25, 1, 'Cooler Master', 25, 1, '2026-01-04 12:31:19'),
(26, 1, 'Antec', 26, 1, '2026-01-04 12:31:19'),
(27, 1, 'Segotep', 27, 1, '2026-01-04 12:31:19'),
(28, 1, 'Cougar', 28, 1, '2026-01-04 12:31:19'),
(29, 1, 'Jonsbo', 29, 1, '2026-01-04 12:31:19'),
(30, 1, 'Viewsonic', 30, 1, '2026-01-04 12:31:19'),
(31, 1, 'AOC', 31, 1, '2026-01-04 12:31:19'),
(32, 1, 'VSP', 32, 1, '2026-01-04 12:31:19'),
(33, 1, 'Dell', 33, 1, '2026-01-04 12:31:19'),
(34, 1, 'HP', 34, 1, '2026-01-04 12:31:19'),
(35, 2, 'Intel Core I3', 1, 1, '2026-01-04 12:31:19'),
(36, 2, 'Intel Core I5', 2, 1, '2026-01-04 12:31:19'),
(37, 2, 'Intel Core I7', 3, 1, '2026-01-04 12:31:19'),
(38, 2, 'AMD Ryzen 3', 4, 1, '2026-01-04 12:31:19'),
(39, 2, 'AMD Ryzen 5', 5, 1, '2026-01-04 12:31:19'),
(40, 2, 'AMD Ryzen 7', 6, 1, '2026-01-04 12:31:19'),
(41, 2, 'Intel Core Ultra 5', 7, 1, '2026-01-04 12:31:19'),
(42, 2, 'Intel Core Ultra 7', 8, 1, '2026-01-04 12:31:19'),
(43, 3, 'LGA 1200 (10th)', 1, 1, '2026-01-04 12:31:19'),
(44, 3, 'LGA 1700 (12th, 13th, 14th)', 2, 1, '2026-01-04 12:31:19'),
(45, 3, 'LGA 1851 (Core Ultra)', 3, 1, '2026-01-04 12:31:19'),
(46, 3, 'AM4 (3000, 5000)', 4, 1, '2026-01-04 12:31:19'),
(47, 3, 'AM5 (7000, 9000)', 5, 1, '2026-01-04 12:31:19'),
(48, 4, 'Intel Cooper Lake (10th)', 1, 1, '2026-01-04 12:31:19'),
(49, 4, 'Intel Alder Lake (12th)', 2, 1, '2026-01-04 12:31:19'),
(50, 4, 'Intel Raptor Lake (13th)', 3, 1, '2026-01-04 12:31:19'),
(51, 4, 'Intel Raptor Lake Refresh (14th)', 4, 1, '2026-01-04 12:31:19'),
(52, 4, 'Intel Arrow Lake (Core Ultra)', 5, 1, '2026-01-04 12:31:19'),
(53, 4, 'AMD Ryzen 3000 series', 6, 1, '2026-01-04 12:31:19'),
(54, 4, 'AMD Ryzen 5000 series', 7, 1, '2026-01-04 12:31:19'),
(55, 4, 'AMD Ryzen 7000 series', 8, 1, '2026-01-04 12:31:19'),
(56, 4, 'AMD Ryzen 9000 series', 9, 1, '2026-01-04 12:31:19'),
(57, 5, 'Gaming', 1, 1, '2026-01-04 12:31:19'),
(58, 5, 'Đồ Họa, Kiến Trúc', 2, 1, '2026-01-04 12:31:19'),
(59, 5, 'Phổ Thông, Văn Phòng', 3, 1, '2026-01-04 12:31:19'),
(60, 6, 'GDDR5', 1, 1, '2026-01-04 12:31:19'),
(61, 6, 'GDDR6', 2, 1, '2026-01-04 12:31:19'),
(62, 6, 'GDD6X', 3, 1, '2026-01-04 12:31:19'),
(63, 6, 'GDDR7', 4, 1, '2026-01-04 12:31:19'),
(64, 7, '2GB', 1, 1, '2026-01-04 12:31:19'),
(65, 7, '4GB', 2, 1, '2026-01-04 12:31:19'),
(66, 7, '6GB', 3, 1, '2026-01-04 12:31:19'),
(67, 7, '8GB', 4, 1, '2026-01-04 12:31:19'),
(68, 7, '12GB', 5, 1, '2026-01-04 12:31:19'),
(69, 7, '16GB', 6, 1, '2026-01-04 12:31:19'),
(70, 8, '128GB', 1, 1, '2026-01-04 12:31:19'),
(71, 8, '256GB', 2, 1, '2026-01-04 12:31:19'),
(72, 8, '512GB', 3, 1, '2026-01-04 12:31:19'),
(73, 8, '1TB', 4, 1, '2026-01-04 12:31:19'),
(74, 8, '2TB', 5, 1, '2026-01-04 12:31:19'),
(75, 8, '4TB', 6, 1, '2026-01-04 12:31:19'),
(76, 8, '6TB', 7, 1, '2026-01-04 12:31:19'),
(77, 8, '8TB', 8, 1, '2026-01-04 12:31:19'),
(78, 8, '10TB', 9, 1, '2026-01-04 12:31:19'),
(79, 8, '8GB ( 1 X 8GB)', 10, 1, '2026-01-04 12:31:19'),
(80, 8, '16GB (1 X 16GB)', 11, 1, '2026-01-04 12:31:19'),
(81, 8, '16GB (2 X 8GB)', 12, 1, '2026-01-04 12:31:19'),
(82, 8, '32GB (1 X 32GB)', 13, 1, '2026-01-04 12:31:19'),
(83, 8, '32GB (2 X 16GB)', 14, 1, '2026-01-04 12:31:19'),
(84, 9, '2.5\" SATA', 1, 1, '2026-01-04 12:31:19'),
(85, 9, 'M.2 SATA', 2, 1, '2026-01-04 12:31:19'),
(86, 9, 'M.2 NVME', 3, 1, '2026-01-04 12:31:19'),
(87, 10, 'PCIe Gen 3.0 x4', 1, 1, '2026-01-04 12:31:19'),
(88, 10, 'PCIe Gen 4.0 x4', 2, 1, '2026-01-04 12:31:19'),
(89, 10, 'PCIe Gen 5.0 x4', 3, 1, '2026-01-04 12:31:19'),
(90, 11, 'LGA 1200 (10th)', 1, 1, '2026-01-04 12:31:19'),
(91, 11, 'LGA 1700 (12th, 13th, 14th)', 2, 1, '2026-01-04 12:31:19'),
(92, 11, 'LGA 1851 (Core Ultra)', 3, 1, '2026-01-04 12:31:19'),
(93, 11, 'AM4 (3000, 5000)', 4, 1, '2026-01-04 12:31:19'),
(94, 11, 'AM5 (7000, 9000)', 5, 1, '2026-01-04 12:31:19'),
(95, 12, 'Intel H510 (LGA 1200)', 1, 1, '2026-01-04 12:31:19'),
(96, 12, 'Intel B560 (LGA 1200)', 2, 1, '2026-01-04 12:31:19'),
(97, 12, 'Intel Z590 (LGA 1200)', 3, 1, '2026-01-04 12:31:19'),
(98, 12, 'Intel H610 (LGA 1700)', 4, 1, '2026-01-04 12:31:19'),
(99, 12, 'Intel B760 (LGA 1700)', 5, 1, '2026-01-04 12:31:19'),
(100, 12, 'Intel Z790 (LGA 1700)', 6, 1, '2026-01-04 12:31:19'),
(101, 12, 'Intel B860 (LGA 1851)', 7, 1, '2026-01-04 12:31:19'),
(102, 12, 'Intel Z890 (LGA 1851)', 8, 1, '2026-01-04 12:31:19'),
(103, 12, 'AMD B450 (AM4)', 9, 1, '2026-01-04 12:31:19'),
(104, 12, 'AMD A520 (AM4)', 10, 1, '2026-01-04 12:31:19'),
(105, 12, 'AMD A620 (AM5)', 11, 1, '2026-01-04 12:31:19'),
(106, 12, 'AMD B650 (AM5)', 12, 1, '2026-01-04 12:31:19'),
(107, 12, 'AMD X670 (AM5)', 13, 1, '2026-01-04 12:31:19'),
(108, 13, 'Mini ITX', 1, 1, '2026-01-04 12:31:19'),
(109, 13, 'M-ATX', 2, 1, '2026-01-04 12:31:19'),
(110, 13, 'ATX', 3, 1, '2026-01-04 12:31:19'),
(111, 13, 'E-ATX', 4, 1, '2026-01-04 12:31:19'),
(112, 14, '2 khe', 1, 1, '2026-01-04 12:31:19'),
(113, 14, '4 khe', 2, 1, '2026-01-04 12:31:19'),
(114, 14, '8 khe', 3, 1, '2026-01-04 12:31:19'),
(115, 15, '350W', 1, 1, '2026-01-04 12:31:19'),
(116, 15, '400W', 2, 1, '2026-01-04 12:31:19'),
(117, 15, '450W', 3, 1, '2026-01-04 12:31:19'),
(118, 15, '500W', 4, 1, '2026-01-04 12:31:19'),
(119, 15, '650W', 5, 1, '2026-01-04 12:31:19'),
(120, 15, '800W', 6, 1, '2026-01-04 12:31:19'),
(121, 15, '1000W', 7, 1, '2026-01-04 12:31:19'),
(122, 16, '80 Plus', 1, 1, '2026-01-04 12:31:19'),
(123, 16, '80 Plus Bronze', 2, 1, '2026-01-04 12:31:19'),
(124, 16, '80 Plus Silver', 3, 1, '2026-01-04 12:31:19'),
(125, 16, '80 Plus Gold', 4, 1, '2026-01-04 12:31:19'),
(126, 16, '80 Plus Platinum', 5, 1, '2026-01-04 12:31:19'),
(127, 17, 'Non Modular (Dây liền)', 1, 1, '2026-01-04 12:31:19'),
(128, 17, 'Full Modular (Dây rời)', 2, 1, '2026-01-04 12:31:19'),
(129, 18, 'Full Tower', 1, 1, '2026-01-04 12:31:19'),
(130, 18, 'Mid Tower', 2, 1, '2026-01-04 12:31:19'),
(131, 18, 'Mini Tower', 3, 1, '2026-01-04 12:31:19'),
(132, 18, 'Mini ITX', 4, 1, '2026-01-04 12:31:19'),
(133, 19, 'Mini – ITX', 1, 1, '2026-01-04 12:31:19'),
(134, 19, 'M- ATX', 2, 1, '2026-01-04 12:31:19'),
(135, 19, 'ATX', 3, 1, '2026-01-04 12:31:19'),
(136, 19, 'E-ATX', 4, 1, '2026-01-04 12:31:19'),
(137, 20, '5400 RPM', 1, 1, '2026-01-04 12:31:19'),
(138, 20, '7200 RPM', 2, 1, '2026-01-04 12:31:19'),
(139, 21, 'DDR4', 1, 1, '2026-01-04 12:31:19'),
(140, 21, 'DDR5', 2, 1, '2026-01-04 12:31:19'),
(141, 22, 'DDR4 3200 MHz', 1, 1, '2026-01-04 12:31:19'),
(142, 22, 'DDR4 3600 MHz', 2, 1, '2026-01-04 12:31:19'),
(143, 22, 'DDR5 6000 Mhz', 3, 1, '2026-01-04 12:31:19'),
(144, 22, 'DDR5 5600 Mhz', 4, 1, '2026-01-04 12:31:19'),
(145, 22, 'DDR5 6400 Mhz', 5, 1, '2026-01-04 12:31:19'),
(146, 22, 'DDR5 5200 MHz', 6, 1, '2026-01-04 12:31:19'),
(147, 23, '60 Hz', 1, 1, '2026-01-04 12:31:19'),
(148, 23, '75 Hz', 2, 1, '2026-01-04 12:31:19'),
(149, 23, '100 Hz', 3, 1, '2026-01-04 12:31:19'),
(150, 23, '120 Hz', 4, 1, '2026-01-04 12:31:19'),
(151, 23, '144 Hz', 5, 1, '2026-01-04 12:31:19'),
(152, 23, '165 Hz', 6, 1, '2026-01-04 12:31:19'),
(153, 23, '180 Hz', 7, 1, '2026-01-04 12:31:19'),
(154, 23, '240 Hz', 8, 1, '2026-01-04 12:31:19'),
(155, 23, '360 Hz', 9, 1, '2026-01-04 12:31:19'),
(156, 24, 'HD + (1600 * 900)', 1, 1, '2026-01-04 12:31:19'),
(157, 24, 'Full HD (1920 *1080)', 2, 1, '2026-01-04 12:31:19'),
(158, 24, '2K QHD (2560x1440)', 3, 1, '2026-01-04 12:31:19'),
(159, 24, '4K (3840x2160)', 4, 1, '2026-01-04 12:31:19'),
(160, 25, 'IPS', 1, 1, '2026-01-04 12:31:19'),
(161, 25, 'VA', 2, 1, '2026-01-04 12:31:19'),
(162, 25, 'TN', 3, 1, '2026-01-04 12:31:19'),
(163, 26, '15.6 inch', 1, 1, '2026-01-04 12:31:19'),
(164, 26, '21.5 inch', 2, 1, '2026-01-04 12:31:19'),
(165, 26, '23.8 inch', 3, 1, '2026-01-04 12:31:19'),
(166, 26, '24.5 inch', 4, 1, '2026-01-04 12:31:19'),
(167, 26, '27 inch', 5, 1, '2026-01-04 12:31:19'),
(168, 26, '32 inch', 6, 1, '2026-01-04 12:31:19');


--
-- Cấu trúc bảng cho bảng `categories_attributes_values`
--

CREATE TABLE `categories_attributes_values` (
  `cav_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `attribute_id` int(11) NOT NULL,
  `attribute_value_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `categories_attributes_values`
--

INSERT INTO `categories_attributes_values` (`cav_id`, `category_id`, `attribute_id`, `attribute_value_id`) VALUES
(1, 1, 1, 2),
(2, 1, 1, 1),
(4, 1, 2, 35),
(5, 1, 2, 36),
(6, 1, 2, 37),
(7, 1, 2, 38),
(8, 1, 2, 39),
(9, 1, 2, 40),
(10, 1, 2, 41),
(11, 1, 2, 42),
(19, 1, 3, 43),
(20, 1, 3, 44),
(21, 1, 3, 45),
(22, 1, 3, 46),
(23, 1, 3, 47),
(26, 1, 4, 48),
(27, 1, 4, 49),
(28, 1, 4, 50),
(29, 1, 4, 51),
(30, 1, 4, 52),
(31, 1, 4, 53),
(32, 1, 4, 54),
(33, 1, 4, 55),
(34, 1, 4, 56),
(41, 2, 1, 2),
(42, 2, 1, 7),
(43, 2, 1, 4),
(44, 2, 1, 10),
(45, 2, 1, 5),
(46, 2, 1, 9),
(47, 2, 1, 6),
(48, 2, 1, 3),
(49, 2, 1, 8),
(56, 2, 5, 57),
(57, 2, 5, 58),
(58, 2, 5, 59),
(59, 2, 6, 60),
(60, 2, 6, 61),
(61, 2, 6, 62),
(62, 2, 6, 63),
(66, 2, 7, 64),
(67, 2, 7, 65),
(68, 2, 7, 66),
(69, 2, 7, 67),
(70, 2, 7, 68),
(71, 2, 7, 69),
(73, 4, 1, 17),
(74, 4, 1, 11),
(75, 4, 1, 5),
(76, 4, 1, 15),
(77, 4, 1, 14),
(78, 4, 1, 6),
(79, 4, 1, 16),
(80, 4, 1, 13),
(81, 4, 1, 12),
(88, 4, 8, 70),
(89, 4, 8, 73),
(90, 4, 8, 71),
(91, 4, 8, 74),
(92, 4, 8, 72),
(95, 4, 9, 84),
(96, 4, 9, 85),
(97, 4, 9, 86),
(98, 4, 10, 87),
(99, 4, 10, 88),
(100, 4, 10, 89),
(101, 5, 1, 2),
(102, 5, 1, 7),
(103, 5, 1, 4),
(104, 5, 1, 5),
(105, 5, 1, 1),
(106, 5, 1, 6),
(108, 5, 11, 90),
(109, 5, 11, 91),
(110, 5, 11, 92),
(111, 5, 11, 93),
(112, 5, 11, 94),
(115, 5, 12, 95),
(116, 5, 12, 96),
(117, 5, 12, 97),
(118, 5, 12, 98),
(119, 5, 12, 99),
(120, 5, 12, 100),
(121, 5, 12, 101),
(122, 5, 12, 102),
(123, 5, 12, 103),
(124, 5, 12, 104),
(125, 5, 12, 105),
(126, 5, 12, 106),
(127, 5, 12, 107),
(130, 5, 13, 108),
(131, 5, 13, 109),
(132, 5, 13, 110),
(133, 5, 13, 111),
(137, 5, 14, 112),
(138, 5, 14, 113),
(139, 5, 14, 114),
(140, 6, 1, 26),
(141, 6, 1, 4),
(142, 6, 1, 25),
(143, 6, 1, 11),
(144, 6, 1, 5),
(145, 6, 1, 6),
(146, 6, 1, 24),
(147, 6, 15, 115),
(148, 6, 15, 116),
(149, 6, 15, 117),
(150, 6, 15, 118),
(151, 6, 15, 119),
(152, 6, 15, 120),
(153, 6, 15, 121),
(154, 6, 16, 122),
(155, 6, 16, 123),
(156, 6, 16, 124),
(157, 6, 16, 125),
(158, 6, 16, 126),
(161, 6, 17, 127),
(162, 6, 17, 128),
(164, 7, 1, 4),
(165, 7, 1, 25),
(166, 7, 1, 11),
(167, 7, 1, 28),
(168, 7, 1, 29),
(169, 7, 1, 6),
(170, 7, 1, 27),
(171, 7, 1, 24),
(179, 7, 18, 129),
(180, 7, 18, 130),
(181, 7, 18, 131),
(182, 7, 18, 132),
(186, 7, 19, 133),
(187, 7, 19, 134),
(188, 7, 19, 135),
(189, 7, 19, 136),
(193, 13, 1, 18),
(194, 13, 1, 19),
(195, 13, 1, 12),
(196, 13, 8, 78),
(197, 13, 8, 73),
(198, 13, 8, 74),
(199, 13, 8, 75),
(200, 13, 8, 76),
(201, 13, 8, 77),
(203, 13, 20, 137),
(204, 13, 20, 138),
(206, 35, 21, 139),
(207, 35, 21, 140),
(209, 35, 1, 20),
(210, 35, 1, 11),
(211, 35, 1, 21),
(212, 35, 1, 23),
(213, 35, 1, 15),
(214, 35, 1, 14),
(215, 35, 1, 16),
(216, 35, 1, 22),
(224, 35, 22, 141),
(225, 35, 22, 142),
(226, 35, 22, 143),
(227, 35, 22, 144),
(228, 35, 22, 145),
(229, 35, 22, 146),
(231, 35, 8, 80),
(232, 35, 8, 81),
(233, 35, 8, 82),
(234, 35, 8, 83),
(235, 35, 8, 79),
(238, 40, 1, 31),
(239, 40, 1, 4),
(240, 40, 1, 33),
(241, 40, 1, 5),
(242, 40, 1, 34),
(243, 40, 1, 6),
(244, 40, 1, 13),
(245, 40, 1, 30),
(246, 40, 1, 32),
(253, 40, 23, 147),
(254, 40, 23, 148),
(255, 40, 23, 149),
(256, 40, 23, 150),
(257, 40, 23, 151),
(258, 40, 23, 152),
(259, 40, 23, 153),
(260, 40, 23, 154),
(261, 40, 23, 155),
(268, 40, 24, 156),
(269, 40, 24, 157),
(270, 40, 24, 158),
(271, 40, 24, 159),
(275, 40, 25, 160),
(276, 40, 25, 161),
(277, 40, 25, 162),
(278, 40, 26, 163),
(279, 40, 26, 164),
(280, 40, 26, 165),
(281, 40, 26, 166),
(282, 40, 26, 167),
(283, 40, 26, 168);


CREATE TABLE `products` (
  `product_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `base_price` decimal(12,2) NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `is_featured` tinyint(1) DEFAULT 0,
  `view_count` int(11) DEFAULT 0,
  `rating_average` decimal(3,2) DEFAULT 0.00,
  `review_count` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `img_path` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `products`
--

INSERT INTO `products` (`product_id`, `category_id`, `product_name`, `slug`, `description`, `base_price`, `is_active`, `is_featured`, `view_count`, `rating_average`, `review_count`, `created_at`, `updated_at`, `img_path`) VALUES
(395, 13, 'Seagate 500GB', 'seagate-500gb', 'Mô tả Seagate 500GB', 0.00, 1, 1, 0, 0.00, 0, '2026-01-04 16:36:19', '2026-01-04 16:36:19', NULL),
(396, 1, 'AMD Ryzen 5 5700X3D', 'amd-ryzen-5-5700x3d', 'Mắc quá đi', 4700000.00, 1, 1, 0, 0.00, 0, '2026-01-04 16:43:50', '2026-01-04 16:43:50', NULL),
(397, 1, 'CPU Intel Core i5-12400F (Up to 4.4Ghz, 6 Nhân 12 Luồng, 18MB Cache, Socket Intel LGA 1700)', 'cpu-intel-core-i5-12400f-up-to-44ghz-6-nhan-12-luong-18mb-cache-socket-intel-lga-1700', 'CPU Intel Core i5-12400F - CPU thuộc thế hệ thứ 12 (Alder Lake) thiết kế tối ưu cho các game thủ và những người sáng tạo nội dung bán chuyên.', 2900000.00, 1, 1, 0, 0.00, 0, '2026-01-04 17:15:45', '2026-01-04 17:15:45', NULL),
(398, 1, 'CPU Intel Core i5-12400 (Upto 4.4Ghz, 6 nhân 12 luồng, 18MB Cache, 65W) - Socket Intel LGA 1700)', 'cpu-intel-core-i5-12400-upto-44ghz-6-nhan-12-luong-18mb-cache-65w-socket-intel-lga-1700', 'CPU Intel Core i5-12400 là bước nhảy vọt của Intel ở thế hệ thứ 12, mang trong mình sức mạnh bền bỉ, sẵn sàng cùng bạn chinh chiến mọi tựa game AAA hay xử lý chồng chất những deadline đồ họa phức tạp', 4400000.00, 1, 0, 0, 0.00, 0, '2026-01-04 17:25:43', '2026-01-04 17:25:43', NULL),
(399, 1, 'CPU Intel Core i5-13400 (up to 4.6Ghz, 10 nhân 16 luồng, 20MB Cache, 65W) - Socket Intel LGA 1700/Raptor Lake) ', 'cpu-intel-core-i5-13400-up-to-46ghz-10-nhan-16-luong-20mb-cache-65w-socket-intel-lga-1700raptor-lake', 'CPU Intel Core i5-13400 - Bộ vi xử lý không quá cao cấp để gây lãng phí, nhưng cũng không hề yếu để phải đắn đo khi làm việc nặng hay chơi game.', 5100000.00, 1, 0, 0, 0.00, 0, '2026-01-04 17:34:58', '2026-01-04 17:34:58', NULL),
(400, 13, 'Ổ Cứng HDD SEAGATE Barracuda 4TB 3.5 inch 5400RPM, SATA III, 256MB Cache', 'o-cung-hdd-seagate-barracuda-4tb-35-inch-5400rpm-sata-iii-256mb-cache-st4000dm004', 'Ổ cứng truyền thống HDD với ưu thế là độ bền và dung lượng cao vẫn là một phần không thể thiếu được trong một chiếc máy tính. Đặc biệt là trong thời đại công nghệ hiện nay.', 3600000.00, 1, 1, 0, 0.00, 0, '2026-01-04 17:41:50', '2026-01-04 17:43:47', NULL),
(401, 13, 'Ổ Cứng HDD SEAGATE IronWolf 10TB 3.5 inch, 7200RPM ,SATA III3, 256MB Cache', 'o-cung-hdd-seagate-ironwolf-10tb-35-inch-7200rpm-sata-iii3-256mb-cache', 'Ổ cứng Seagate IronWolf 10TB — lưu trữ dữ liệu lớn, chạy ổn định, phù hợp cho PC, NAS, server nhỏ. Tốc độ quay cao và bộ nhớ đệm lớn giúp truy xuất dữ liệu nhanh, đáng tin cậy cho công việc và giải trí.', 10300000.00, 1, 0, 0, 0.00, 0, '2026-01-04 17:48:16', '2026-01-04 17:48:16', NULL),
(402, 13, 'Ổ Cứng HDD Toshiba P300 4TB 3.5 inch, 5400RPM, SATA III, 128MB Cache', 'o-cung-hdd-toshiba-p300-4tb-35-inch-5400rpm-sata-iii-128mb-cache', 'Thiết kế này giúp cho tốc độ đọc và ghi chính xác hơn, nhanh hơn và truy cập nhanh vào dữ liệu của bạn.', 3400000.00, 1, 0, 0, 0.00, 0, '2026-01-04 17:51:09', '2026-01-04 17:51:09', NULL),
(403, 35, 'RAM Desktop Kingston Fury Beast 16GB (1x16GB) DDR4 3200MHz', 'ram-desktop-kingston-fury-beast-16gb-1x16gb-ddr4-3200mhz', 'Ram Desktop Kingston Fury là dòng Ram phổ thông nhắm đến hiệu năng/ giá bán được nhiều khách hàng tin dùng. Phiên bản Kingston Fury mới được thay đổi nhẹ về thiết kế để bắt mắt hơn.', 3100000.00, 1, 1, 0, 0.00, 0, '2026-01-04 17:56:56', '2026-01-04 17:56:56', NULL),
(404, 35, 'RAM Desktop Kingston Fury Beast 16GB (1x16GB) DDR5 5600MHz', 'ram-desktop-kingston-fury-beast-16gb-1x16gb-ddr5-5600mhz', 'Ram Desktop Kingston Fury Beast là dòng RAM hiệu năng cao của Kingston trên nền tảng DDR5 mới nhất cho tốc độ cực nhanh. ', 5300000.00, 1, 0, 0, 0.00, 0, '2026-01-04 18:01:00', '2026-01-04 18:01:00', NULL),
(405, 35, 'RAM Desktop Kingston Fury Beast RGB EXPO 32GB (1x32GB) DDR5 6000MHz', 'ram-desktop-kingston-fury-beast-rgb-expo-32gb-1x32gb-ddr5-6000mhz', 'RAM và kit RAM DDR5 của Kingston FURY có tích hợp AMD EXPO (Công nghệ Extended Profiles của AMD để ép xung) được tự xác nhận trên bo mạch chủ AM5', 11000000.00, 1, 0, 0, 0.00, 0, '2026-01-04 18:06:06', '2026-01-04 18:06:06', NULL),
(406, 2, 'Card màn hình Asus DUAL-RTX 3050-6G', 'card-man-hinh-asus-dual-rtx-3050-6g', 'ASUS Dual RTX 3050 6GB GDDR6 là một sản phẩm đáng chú ý trong phân khúc card đồ họa tầm trung, có khả năng xử lý đồ họa 3D mượt mà, hỗ trợ công nghệ ray tracing và DLSS.', 4650000.00, 1, 0, 0, 0.00, 0, '2026-01-04 18:12:25', '2026-01-04 18:12:25', NULL),
(407, 2, 'Card màn hình Gigabyte RTX 3050 WINFORCE OC V2-6G', 'card-man-hinh-gigabyte-rtx-3050-winforce-oc-v2-6g', 'Card màn hình Gigabyte GeForce RTX 3050 WINDFORCE OC 6G được thiết kế với phong cách tối giản, phù hợp với mọi cấu hình máy tính.', 4700000.00, 1, 0, 0, 0.00, 0, '2026-01-04 18:16:29', '2026-01-04 18:16:29', NULL),
(408, 2, 'Card màn hình MSI RTX 5060 8G VENTUS 2X OC GDDR7', 'card-man-hinh-msi-rtx-5060-8g-ventus-2x-oc-gddr7', 'MSI RTX 5060 8G VENTUS 2X OC là card đồ họa tầm trung mới nhất từ NVIDIA RTX 50-series, trang bị 8GB VRAM GDDR7 cho hiệu năng mạnh mẽ, đặc biệt trong chơi game, đồ họa và làm việc sáng tạo.', 9100000.00, 1, 0, 0, 0.00, 0, '2026-01-04 18:22:03', '2026-01-04 18:22:03', NULL),
(409, 4, 'Ổ Cứng SSD Samsung 980 500GB – M.2 2280 PCIe Gen3 x4 (Đọc 3100MB/s - Ghi 2600MB/s)', 'o-cung-ssd-samsung-980-500gb-m2-2280-pcie-gen3-x4-doc-3100mbs-ghi-2600mbs', 'Ổ cứng SSD Samsung 980 là dòng sản phẩm SSD M.2 NVME PCIe Gen 3 mới nhất của Samsung. Đây là dòng ổ cứng hàng đầu thích hợp cho nhu cầu lưu trữ tốc độ cao: edit ảnh, video, chơi games,..', 3000000.00, 1, 0, 0, 0.00, 0, '2026-01-04 18:29:18', '2026-01-04 18:29:18', NULL),
(410, 4, 'Ổ Cứng SSD CORSAIR MP600 CORE XT 1TB – M.2 2280 PCIe Gen4 x4 (Đọc 5900MB/s - Ghi 5000MB/s)', 'o-cung-ssd-corsair-mp600-core-xt-1tb-m2-2280-pcie-gen4-x4-doc-5900mbs-ghi-5000mbs', 'Ổ cứng SSD Corsair MP600 CORE XT là một sản phẩm cao cấp của thương hiệu nổi tiếng CORSAIR. Với dung lượng lưu trữ 1TB, giao diện NVMe PCIe Gen4 x4 và kích thước M.2 2280, ổ cứng này hứa hẹn mang đến hiệu năng và tốc độ đáng chú ý cho người dùng.', 3800000.00, 1, 0, 0, 0.00, 0, '2026-01-04 18:32:28', '2026-01-04 18:32:28', NULL),
(411, 4, 'Ổ Cứng SSD Gigabyte 4000E 1TB – M.2 2280 PCIe Gen4 x4 (Đọc 4000MB/s - Ghi 3900MB/s)', 'o-cung-ssd-gigabyte-4000e-1tb-m2-2280-pcie-gen4-x4-doc-4000mbs-ghi-3900mbs', 'Ổ cứng SSD Gigabyte 4000E là một bước đột phá trong công nghệ lưu trữ, mang đến hiệu năng vượt trội với giao diện PCIe 4.0 x4 và chuẩn NVMe 1.4. Với thiết kế M.2 2280 nhỏ gọn.', 3500000.00, 1, 0, 0, 0.00, 0, '2026-01-04 18:46:00', '2026-01-04 18:46:00', NULL),
(412, 5, 'Mainboard ASUS TUF GAMING Z790 PLUS WIFI DDR5', 'mainboard-asus-tuf-gaming-z790-plus-wifi-ddr5', 'Mainboard Asus TUF Gaming Z790 PLUS Wifi DDR5 là một bo mạch chủ có tất cả các yếu tố thiết yếu của bộ xử lý Intel® mới nhất và kết hợp chúng với các tính năng sẵn sàng cho nhu cầu gaming.', 7000000.00, 1, 0, 0, 0.00, 0, '2026-01-04 18:49:52', '2026-01-04 18:49:52', NULL),
(413, 5, 'Mainboard MSI PRO B760M-E DDR4', 'mainboard-msi-pro-b760m-e-ddr4', 'Tốc độ truyền tải dữ liệu nhanh hơn: Rút ngắn thời gian truyền tải giữa RAM, CPU và các thành phần khác, giúp thiết bị của bạn hoạt động nhanh nhạy hơn.', 2300000.00, 1, 0, 0, 0.00, 0, '2026-01-04 18:55:07', '2026-01-04 18:55:07', NULL),
(414, 5, 'Mainboard Gigabyte Z890M AORUS ELITE WIFI7', 'mainboard-gigabyte-z890m-aorus-elite-wifi7', 'Mainboard Gigabyte Z890M AORUS ELITE WIFI7 là bo mạch chủ Micro-ATX DDR5 cao cấp dành cho CPU Intel Core Ultra (Socket LGA1851), phù hợp cho PC gaming & làm việc hiệu năng cao.', 6100000.00, 1, 0, 0, 0.00, 0, '2026-01-04 19:01:46', '2026-01-04 19:01:46', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `products_attribute_values`
--

CREATE TABLE `products_attribute_values` (
  `product_id` int(11) NOT NULL,
  `attribute_value_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `products_attribute_values`
--

INSERT INTO `products_attribute_values` (`product_id`, `attribute_value_id`) VALUES
(395, 18),
(395, 137),
(396, 2),
(396, 39),
(396, 46),
(396, 54),
(397, 1),
(397, 36),
(397, 44),
(397, 49),
(398, 1),
(398, 36),
(398, 44),
(398, 49),
(399, 1),
(399, 36),
(399, 44),
(399, 50),
(400, 18),
(400, 75),
(400, 137),
(401, 18),
(401, 78),
(401, 138),
(402, 19),
(402, 75),
(402, 137),
(403, 15),
(403, 80),
(403, 139),
(403, 141),
(404, 15),
(404, 80),
(404, 140),
(404, 144),
(405, 15),
(405, 82),
(405, 140),
(405, 143),
(406, 3),
(406, 57),
(406, 61),
(406, 66),
(407, 5),
(407, 57),
(407, 61),
(407, 66),
(408, 6),
(408, 57),
(408, 63),
(408, 67),
(409, 13),
(409, 72),
(409, 86),
(409, 87),
(410, 11),
(410, 73),
(410, 86),
(410, 88),
(411, 5),
(411, 73),
(411, 86),
(411, 88),
(412, 1),
(412, 91),
(412, 100),
(412, 110),
(412, 113),
(413, 6),
(413, 91),
(413, 99),
(413, 109),
(413, 112),
(414, 5),
(414, 92),
(414, 102),
(414, 109),
(414, 113);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `product_variants`
--

CREATE TABLE `product_variants` (
  `variant_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `sku` varchar(100) NOT NULL,
  `variant_name` varchar(255) DEFAULT NULL,
  `price` decimal(12,2) NOT NULL,
  `stock_quantity` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `is_default` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `warranty_period` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `product_variants`
--

INSERT INTO `product_variants` (`variant_id`, `product_id`, `sku`, `variant_name`, `price`, `stock_quantity`, `is_active`, `is_default`, `created_at`, `updated_at`, `warranty_period`) VALUES
(597, 395, 'PRD-1T-1', '1TB', 700000.00, 3, 1, 1, '2026-01-04 16:36:19', '2026-01-04 16:36:19', 12),
(598, 395, 'PRD-2T-2', '2TB', 700000.00, 3, 1, 0, '2026-01-04 16:36:19', '2026-01-04 16:36:19', 12),
(599, 395, 'PRD-4T-3', '4TB', 700000.00, 3, 1, 0, '2026-01-04 16:36:19', '2026-01-04 16:36:19', 121),
(600, 396, 'AR5-396-030666', 'Mặc định', 4700000.00, 3, 1, 1, '2026-01-04 16:43:50', '2026-01-04 16:43:50', 36),
(601, 397, 'CIC-397-945039', 'Mặc định', 2900000.00, 3, 1, 1, '2026-01-04 17:15:45', '2026-01-04 17:15:45', 36),
(602, 398, 'CIC-398-543739', 'Mặc định', 4400000.00, 3, 1, 1, '2026-01-04 17:25:43', '2026-01-04 17:25:43', 36),
(603, 399, 'CIC-399-098537', 'Mặc định', 5100000.00, 3, 1, 1, '2026-01-04 17:34:58', '2026-01-04 17:34:58', 36),
(604, 400, 'ỔCH-400-510127', 'Mặc định', 3600000.00, 3, 1, 1, '2026-01-04 17:41:50', '2026-01-04 17:41:50', 24),
(605, 401, 'ỔCH-401-896349', 'Mặc định', 10300000.00, 3, 1, 1, '2026-01-04 17:48:16', '2026-01-04 17:48:16', 36),
(606, 402, 'ỔCH-402-069368', 'Mặc định', 3400000.00, 3, 1, 1, '2026-01-04 17:51:09', '2026-01-04 17:51:09', 24),
(607, 403, 'RDK-403-416369', 'Mặc định', 3100000.00, 3, 1, 1, '2026-01-04 17:56:56', '2026-01-04 17:56:56', 36),
(608, 404, 'RDK-404-660059', 'Mặc định', 5300000.00, 3, 1, 1, '2026-01-04 18:01:00', '2026-01-04 18:01:00', 36),
(609, 405, 'RDK-405-966067', 'Mặc định', 11000000.00, 3, 1, 1, '2026-01-04 18:06:06', '2026-01-04 18:06:06', 36),
(610, 406, 'CMH-406-345662', 'Mặc định', 4650000.00, 3, 1, 1, '2026-01-04 18:12:25', '2026-01-04 18:12:25', 36),
(611, 407, 'CMH-407-589830', 'Mặc định', 4700000.00, 3, 1, 1, '2026-01-04 18:16:29', '2026-01-04 18:16:29', 36),
(612, 408, 'CMH-408-923104', 'Mặc định', 9100000.00, 3, 1, 1, '2026-01-04 18:22:03', '2026-01-04 18:22:03', 36),
(613, 409, 'ỔCS-409-358366', 'Mặc định', 3000000.00, 3, 1, 1, '2026-01-04 18:29:18', '2026-01-04 18:29:18', 60),
(614, 410, 'ỔCS-410-548425', 'Mặc định', 3800000.00, 3, 1, 1, '2026-01-04 18:32:28', '2026-01-04 18:32:28', 60),
(615, 411, 'ỔCS-411-360417', 'Mặc định', 3500000.00, 3, 1, 1, '2026-01-04 18:46:00', '2026-01-04 18:46:00', 36),
(616, 412, 'MAT-412-592586', 'Mặc định', 7000000.00, 3, 1, 1, '2026-01-04 18:49:52', '2026-01-04 18:49:52', 36),
(617, 413, 'MMP-413-907513', 'Mặc định', 2300000.00, 3, 1, 1, '2026-01-04 18:55:07', '2026-01-04 18:55:07', 36),
(618, 414, 'MGZ-414-306460', 'Mặc định', 6100000.00, 3, 1, 1, '2026-01-04 19:01:46', '2026-01-04 19:01:46', 36);


CREATE TABLE `variants_attribute_values` (
  `variant_id` int(11) NOT NULL,
  `attribute_value_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `variants_attribute_values`
--

INSERT INTO `variants_attribute_values` (`variant_id`, `attribute_value_id`) VALUES
(597, 73),
(598, 74),
(599, 75);


--
-- Chỉ mục cho bảng `attributes`
--
ALTER TABLE `attributes`
  ADD PRIMARY KEY (`attribute_id`);

--
-- Chỉ mục cho bảng `attributes_categories`
--
ALTER TABLE `attributes_categories`
  ADD PRIMARY KEY (`attribute_category_id`),
  ADD KEY `attribute_categories_ibfk_1` (`attribute_id`),
  ADD KEY `attribute_categories_ibfk_2` (`category_id`);

--
-- Chỉ mục cho bảng `attribute_values`
--
ALTER TABLE `attribute_values`
  ADD PRIMARY KEY (`attribute_value_id`),
  ADD UNIQUE KEY `unique_attribute_value` (`attribute_id`,`value_name`),
  ADD UNIQUE KEY `uk_attribute_value` (`attribute_id`,`value_name`),
  ADD KEY `idx_attribute_id` (`attribute_id`);

--
-- Chỉ mục cho bảng `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`category_id`),
  ADD KEY `idx_parent_category` (`parent_category_id`),
  ADD KEY `idx_is_active` (`is_active`);

--
-- Chỉ mục cho bảng `categories_attributes_values`
--
ALTER TABLE `categories_attributes_values`
  ADD PRIMARY KEY (`cav_id`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `attribute_id` (`attribute_id`),
  ADD KEY `attribute_value_id` (`attribute_value_id`);

--
-- Chỉ mục cho bảng `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`product_id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `idx_category_id` (`category_id`),
  ADD KEY `idx_slug` (`slug`),
  ADD KEY `idx_is_active` (`is_active`),
  ADD KEY `idx_is_featured` (`is_featured`);
ALTER TABLE `products` ADD FULLTEXT KEY `idx_search` (`product_name`,`description`);

--
-- Chỉ mục cho bảng `products_attribute_values`
--
ALTER TABLE `products_attribute_values`
  ADD PRIMARY KEY (`product_id`,`attribute_value_id`),
  ADD KEY `products_attribute_values_ibfk_2` (`attribute_value_id`);

--
-- Chỉ mục cho bảng `product_variants`
--
ALTER TABLE `product_variants`
  ADD PRIMARY KEY (`variant_id`),
  ADD UNIQUE KEY `sku` (`sku`),
  ADD KEY `idx_product_id` (`product_id`),
  ADD KEY `idx_sku` (`sku`),
  ADD KEY `idx_is_active` (`is_active`);

  
-- Chỉ mục cho bảng `variants_attribute_values`
--
ALTER TABLE `variants_attribute_values`
  ADD PRIMARY KEY (`variant_id`,`attribute_value_id`),
  ADD KEY `idx_variant_id` (`variant_id`),
  ADD KEY `idx_attribute_value_id` (`attribute_value_id`);

--
-- Các ràng buộc cho bảng `attributes_categories`
--
ALTER TABLE `attributes_categories`
  ADD CONSTRAINT `attributes_categories_ibfk_1` FOREIGN KEY (`attribute_id`) REFERENCES `attributes` (`attribute_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `attributes_categories_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `attribute_values`
--
ALTER TABLE `attribute_values`
  ADD CONSTRAINT `attribute_values_ibfk_1` FOREIGN KEY (`attribute_id`) REFERENCES `attributes` (`attribute_id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `categories`
--
ALTER TABLE `categories`
  ADD CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`parent_category_id`) REFERENCES `categories` (`category_id`) ON DELETE SET NULL;

--
-- Các ràng buộc cho bảng `categories_attributes_values`
--
ALTER TABLE `categories_attributes_values`
  ADD CONSTRAINT `categories_attributes_values_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `categories_attributes_values_ibfk_2` FOREIGN KEY (`attribute_id`) REFERENCES `attributes` (`attribute_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `categories_attributes_values_ibfk_3` FOREIGN KEY (`attribute_value_id`) REFERENCES `attribute_values` (`attribute_value_id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`);

--
-- Các ràng buộc cho bảng `products_attribute_values`
--
ALTER TABLE `products_attribute_values`
  ADD CONSTRAINT `products_attribute_values_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `products_attribute_values_ibfk_2` FOREIGN KEY (`attribute_value_id`) REFERENCES `attribute_values` (`attribute_value_id`);

--
-- Các ràng buộc cho bảng `product_variants`
--
ALTER TABLE `product_variants`
  ADD CONSTRAINT `product_variants_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE;

-- Các ràng buộc cho bảng `variants_attribute_values`
--
ALTER TABLE `variants_attribute_values`
  ADD CONSTRAINT `variants_attribute_values_ibfk_1` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`variant_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `variants_attribute_values_ibfk_2` FOREIGN KEY (`attribute_value_id`) REFERENCES `attribute_values` (`attribute_value_id`) ON DELETE CASCADE;
