
CREATE TABLE `attributes` (
  `attribute_id` int(11) NOT NULL,
  `attribute_name` varchar(100) NOT NULL,
  `attribute_code` varchar(50) DEFAULT NULL,
  `is_compatibility_key` tinyint(1) DEFAULT 0,
  `compatibility_group` varchar(50) DEFAULT NULL,
  `display_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `attributes`
--

INSERT INTO `attributes` (`attribute_id`, `attribute_name`, `attribute_code`, `is_compatibility_key`, `compatibility_group`, `display_order`, `is_active`, `created_at`) VALUES
(1, 'Hãng', 'cpu_brand', 0, NULL, 1, 1, '2026-01-04 12:31:19'),
(2, 'Dòng CPU', 'cpu_series', 0, NULL, 2, 1, '2026-01-04 12:31:19'),
(3, 'CPU theo Socket', 'cpu_socket', 1, 'socket', 3, 1, '2026-01-04 12:31:19'),
(4, 'Thế hệ CPU', 'cpu_generation', 0, NULL, 4, 1, '2026-01-04 12:31:19'),
(5, 'Nhu cầu sử dụng', NULL, 0, NULL, 5, 1, '2026-01-04 12:31:19'),
(6, 'Kiểu Bộ Nhớ', NULL, 0, NULL, 6, 1, '2026-01-04 12:31:19'),
(7, 'Kích Thước Bộ Nhớ', NULL, 0, NULL, 7, 1, '2026-01-04 12:31:19'),
(8, 'Dung Lượng', 'storage_capacity', 0, NULL, 8, 1, '2026-01-04 12:31:19'),
(9, 'Loại Ổ Cứng', 'storage_type', 0, NULL, 9, 1, '2026-01-04 12:31:19'),
(10, 'Giao diện PCIe', 'storage_interface', 0, NULL, 10, 1, '2026-01-04 12:31:19'),
(11, 'Socket Hỗ Trợ', 'mb_socket_support', 1, 'socket', 11, 1, '2026-01-04 12:31:19'),
(12, 'Chipset', 'mb_chipset', 0, NULL, 12, 1, '2026-01-04 12:31:19'),
(13, 'Kiểu Kích Thước (Form Factor)', 'mb_form_factor', 1, 'form_factor', 13, 1, '2026-01-04 12:31:19'),
(14, 'Số Khe Cắm RAM', 'mb_ram_slots', 0, NULL, 14, 1, '2026-01-04 12:31:19'),
(15, 'Công Suất Nguồn', 'psu_wattage', 0, NULL, 15, 1, '2026-01-04 12:31:19'),
(16, 'Chuẩn Nguồn', 'psu_standard', 0, NULL, 16, 1, '2026-01-04 12:31:19'),
(17, 'Kiểu Dây Nguồn', 'psu_cable_type', 0, NULL, 17, 1, '2026-01-04 12:31:19'),
(18, 'Kích Cỡ', 'case_size', 0, NULL, 18, 1, '2026-01-04 12:31:19'),
(19, 'Kích thước Mainboard', 'case_mb_support', 1, 'form_factor', 19, 1, '2026-01-04 12:31:19'),
(20, 'Tốc Độ Vòng Quay', 'cooler_fan_speed', 0, NULL, 20, 1, '2026-01-04 12:31:19'),
(21, 'Loại RAM', 'ram_type', 1, 'ram_type', 21, 1, '2026-01-04 12:31:19'),
(22, 'Bus RAM', 'ram_bus', 0, NULL, 22, 1, '2026-01-04 12:31:19'),
(23, 'Tần Số Quét', 'monitor_refresh_rate', 0, NULL, 23, 1, '2026-01-04 12:31:19'),
(24, 'Độ Phân Giải', 'monitor_resolution', 0, NULL, 24, 1, '2026-01-04 12:31:19'),
(25, 'Tấm Nền', 'monitor_panel', 0, NULL, 25, 1, '2026-01-04 12:31:19'),
(26, 'Kích Thước', 'monitor_size', 0, NULL, 26, 1, '2026-01-04 12:31:19'),
(27, 'Thế hệ bộ nhớ', 'ram_generation', 0, NULL, 0, 1, '2026-01-11 03:18:00'),
(28, 'Loại RAM Hỗ Trợ', 'mb_ram_type_support', 1, 'ram_type', 0, 1, '2026-01-11 03:18:58'),
(29, 'Độ dài GPU tối đa (mm)', 'case_max_gpu_length', 1, 'gpu_length', 0, 1, '2026-01-11 03:26:46'),
(30, 'Độ dài GPU (mm)', 'gpu_length', 1, 'gpu_length', 0, 1, '2026-01-11 03:27:03');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `attributes`
--
ALTER TABLE `attributes`
  ADD PRIMARY KEY (`attribute_id`),
  ADD UNIQUE KEY `attribute_code` (`attribute_code`),
  ADD KEY `idx_attribute_code` (`attribute_code`),
  ADD KEY `idx_compatibility_key` (`is_compatibility_key`),
  ADD KEY `idx_compatibility_group` (`compatibility_group`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `attributes`
--
ALTER TABLE `attributes`
  MODIFY `attribute_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;
COMMIT;


CREATE TABLE `attributes_categories` (
  `attribute_category_id` int(11) NOT NULL,
  `attribute_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `is_variant_attribute` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `attributes_categories`
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
(36, 26, 40, 0),
(38, 28, 5, 0),
(40, 29, 7, 0),
(41, 30, 2, 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `attributes_categories`
--
ALTER TABLE `attributes_categories`
  ADD PRIMARY KEY (`attribute_category_id`),
  ADD KEY `attribute_categories_ibfk_1` (`attribute_id`),
  ADD KEY `attribute_categories_ibfk_2` (`category_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `attributes_categories`
--
ALTER TABLE `attributes_categories`
  MODIFY `attribute_category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `attributes_categories`
--
ALTER TABLE `attributes_categories`
  ADD CONSTRAINT `attributes_categories_ibfk_1` FOREIGN KEY (`attribute_id`) REFERENCES `attributes` (`attribute_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `attributes_categories_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE CASCADE;
COMMIT;


CREATE TABLE `attribute_values` (
  `attribute_value_id` int(11) NOT NULL,
  `attribute_id` int(11) NOT NULL,
  `value_name` varchar(100) NOT NULL,
  `display_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `attribute_values`
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
(168, 26, '32 inch', 6, 1, '2026-01-04 12:31:19'),
(169, 4, 'AMD Zen 4', 0, 1, '2026-01-11 03:12:10'),
(170, 4, 'AMD Zen 5', 0, 1, '2026-01-11 03:12:18'),
(171, 4, 'AMD Zen 3', 0, 1, '2026-01-11 03:12:52'),
(172, 4, 'AMD Zen 3 ( Ryzen 5000 series)', 0, 1, '2026-01-11 03:13:20'),
(173, 4, 'AMD Zen 4 (Ryzen 7000 series)', 0, 1, '2026-01-11 03:14:01'),
(174, 28, 'DDR4', 0, 1, '2026-01-11 03:19:25'),
(175, 28, 'DDR5', 0, 1, '2026-01-11 03:19:29'),
(176, 13, 'Mini - ITX', 0, 1, '2026-01-11 04:02:20'),
(177, 13, 'Mini-ITX', 0, 1, '2026-01-11 04:02:33'),
(178, 13, 'M - ATX', 0, 1, '2026-01-11 04:03:01'),
(179, 13, 'E - ATX', 0, 1, '2026-01-11 04:03:08'),
(180, 19, 'Mini - ITX', 0, 1, '2026-01-11 04:03:26'),
(181, 19, 'M - ATX', 0, 1, '2026-01-11 04:03:30'),
(182, 19, 'E - ATX', 0, 1, '2026-01-11 04:03:40');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `attribute_values`
--
ALTER TABLE `attribute_values`
  ADD PRIMARY KEY (`attribute_value_id`),
  ADD UNIQUE KEY `unique_attribute_value` (`attribute_id`,`value_name`),
  ADD UNIQUE KEY `uk_attribute_value` (`attribute_id`,`value_name`),
  ADD KEY `idx_attribute_id` (`attribute_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `attribute_values`
--
ALTER TABLE `attribute_values`
  MODIFY `attribute_value_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=183;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `attribute_values`
--
ALTER TABLE `attribute_values`
  ADD CONSTRAINT `attribute_values_ibfk_1` FOREIGN KEY (`attribute_id`) REFERENCES `attributes` (`attribute_id`) ON DELETE CASCADE;
COMMIT;


CREATE TABLE `categories` (
  `category_id` int(11) NOT NULL,
  `category_name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `parent_category_id` int(11) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `icon` varchar(100) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `display_order` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`category_id`, `category_name`, `description`, `parent_category_id`, `image_url`, `icon`, `is_active`, `display_order`, `created_at`, `updated_at`) VALUES
(1, 'CPU', 'Bộ vi xử lý trung tâm (Central Processing Unit) - Lựa chọn CPU phù hợp cho hệ thống của bạn', NULL, '/uploads/categories/CPU-1763457142421-41099656.webp', NULL, 1, 1, '2025-11-05 12:37:11', '2025-11-18 09:12:22'),
(2, 'VGA', 'Card đồ họa (Video Graphics Array) - Card màn hình cao cấp cho gaming và đồ họa', NULL, '/uploads/categories/VGA-1763457150324-84510626.webp', NULL, 1, 2, '2025-11-05 12:37:11', '2025-11-18 09:12:30'),
(4, 'SSD', 'Ổ cứng thể rắn (Solid State Drive) - SSD NVMe, SATA tốc độ cao', NULL, '/uploads/categories/SSD-1763457167579-214129801.webp', NULL, 1, 4, '2025-11-05 12:37:11', '2025-11-18 09:12:47'),
(5, 'Mainboard', 'Bo mạch chủ (Motherboard) - Mainboard Intel, AMD các dòng ATX, mATX, ITX', NULL, '/uploads/categories/MAINBOARD-1763457180313-19278038.webp', NULL, 1, 5, '2025-11-05 12:37:11', '2025-11-18 09:13:00'),
(6, 'PSU', 'Bộ nguồn máy tính (Power Supply Unit) - PSU 80 Plus Bronze, Gold, Platinum', NULL, '/uploads/categories/PSU-1763457190031-894247274.webp', NULL, 1, 6, '2025-11-05 12:37:11', '2025-11-18 09:13:10'),
(7, 'Case', 'Vỏ máy tính (Computer Case) - Case PC ATX, mATX, ITX với quạt RGB, tản nhiệt tốt', NULL, '/uploads/categories/CASE-1763457197140-926410204.webp', NULL, 1, 7, '2025-11-05 12:37:11', '2025-11-18 09:13:17'),
(8, 'Cooling', 'Tản nhiệt và làm mát - Quạt case, tản nhiệt CPU, tản nhiệt nước AIO', NULL, '/uploads/categories/cooling-1763787556488-628471150.jpg', NULL, 1, 8, '2025-11-05 12:37:11', '2025-11-22 04:59:16'),
(13, 'HDD', 'Ổ đĩa cứng (Hard Disk Drive) là thiết bị lưu trữ dữ liệu chính cho máy tính', NULL, '/uploads/categories/hdd-1763456945816-496007346.jpg', NULL, 1, 0, '2025-11-08 14:08:34', '2025-11-18 09:09:05'),
(35, 'RAM', NULL, NULL, '/uploads/categories/RAM-1763457131288-611013067.webp', NULL, 1, 0, '2025-11-16 13:14:05', '2025-11-18 09:12:11'),
(40, 'Monitor', 'Màn hình máy tính - Gaming monitor, màn hình văn phòng', NULL, '/uploads/categories/monitor-1764063376896-496519534.jpg', NULL, 1, 40, '2025-11-25 08:58:13', '2025-11-25 09:36:16'),
(41, 'Keyboard', 'Bàn phím - Bàn phím cơ, bàn phím gaming', NULL, '/uploads/categories/keyboard-1764062589551-543344518.jpg', NULL, 1, 41, '2025-11-25 08:58:13', '2025-11-25 09:23:09'),
(42, 'Mouse', 'Chuột máy tính - Chuột gaming, chuột văn phòng', NULL, '/uploads/categories/mousewebp-1764063346830-923804201.jpg', NULL, 1, 42, '2025-11-25 08:58:13', '2025-11-25 09:35:46'),
(43, 'Headphone', 'Tai nghe - Tai nghe gaming, tai nghe văn phòng', NULL, '/uploads/categories/headphone-1764063358432-185276737.jpg', NULL, 1, 43, '2025-11-25 08:58:13', '2025-11-25 09:35:58'),
(44, 'Speaker', 'Loa máy tính - Loa 2.0, 2.1, 5.1', NULL, '/uploads/categories/speaker-1764063399190-71396739.jpg', NULL, 1, 44, '2025-11-25 08:58:13', '2025-11-25 09:36:39'),
(45, 'Gaming Chair', 'Ghế gaming - Ghế công thái học, ghế gaming cao cấp', NULL, '/uploads/categories/gaming_chair-1764062273403-428459301.jpg', NULL, 1, 45, '2025-11-25 08:58:13', '2025-11-25 09:17:53'),
(46, 'Case Fan', 'Quạt case - Quạt tản nhiệt RGB, quạt PWM', NULL, '/uploads/categories/case_fan-1764062438647-791625777.jpg', NULL, 1, 46, '2025-11-25 08:58:13', '2025-11-25 09:20:38'),
(47, 'Air Cooler', 'Tản nhiệt khí - Tản nhiệt CPU tower, dual tower', 8, '/uploads/categories/air_cooler-1764063453689-131504214.jpg', NULL, 1, 47, '2025-11-25 08:58:13', '2025-11-25 09:37:33'),
(48, 'AIO Cooler', 'Tản nhiệt nước AIO - Tản nước 240mm, 360mm', 8, '/uploads/categories/aio_cooler-1764063468237-385237851.jpg', NULL, 1, 48, '2025-11-25 08:58:13', '2025-11-25 09:37:48'),
(49, 'Custom Water', 'Tản nhiệt nước custom - Bộ kit tản nước custom loop', 8, '/uploads/categories/custom_water-1764063311202-157641460.jpg', NULL, 1, 49, '2025-11-25 08:58:13', '2025-11-25 10:40:27');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`category_id`),
  ADD KEY `idx_parent_category` (`parent_category_id`),
  ADD KEY `idx_is_active` (`is_active`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `categories`
--
ALTER TABLE `categories`
  ADD CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`parent_category_id`) REFERENCES `categories` (`category_id`) ON DELETE SET NULL;
COMMIT;


CREATE TABLE `categories_attributes_values` (
  `cav_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `attribute_id` int(11) NOT NULL,
  `attribute_value_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories_attributes_values`
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
(283, 40, 26, 168),
(288, 1, 4, 172),
(289, 1, 4, 173),
(290, 5, 28, 174),
(291, 5, 28, 175),
(295, 5, 13, 176),
(296, 5, 13, 178),
(297, 5, 13, 110),
(298, 5, 13, 179),
(299, 7, 19, 180),
(300, 7, 19, 181),
(301, 7, 19, 135),
(302, 7, 19, 182);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories_attributes_values`
--
ALTER TABLE `categories_attributes_values`
  ADD PRIMARY KEY (`cav_id`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `attribute_id` (`attribute_id`),
  ADD KEY `attribute_value_id` (`attribute_value_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories_attributes_values`
--
ALTER TABLE `categories_attributes_values`
  MODIFY `cav_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=303;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `categories_attributes_values`
--
ALTER TABLE `categories_attributes_values`
  ADD CONSTRAINT `categories_attributes_values_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `categories_attributes_values_ibfk_2` FOREIGN KEY (`attribute_id`) REFERENCES `attributes` (`attribute_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `categories_attributes_values_ibfk_3` FOREIGN KEY (`attribute_value_id`) REFERENCES `attribute_values` (`attribute_value_id`) ON DELETE CASCADE;
COMMIT;


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
-- Dumping data for table `products`
--

INSERT INTO `products` (`product_id`, `category_id`, `product_name`, `slug`, `description`, `base_price`, `is_active`, `is_featured`, `view_count`, `rating_average`, `review_count`, `created_at`, `updated_at`, `img_path`) VALUES
(1, 1, 'Intel Core I5 10400f', 'intel-core-i5-10400f', NULL, 3400000.00, 1, 0, 0, 0.00, 0, '2026-01-15 11:15:43', '2026-01-15 11:15:43', NULL),
(2, 1, 'Intel Core I3 10105f', 'intel-core-i3-10105f', NULL, 1800000.00, 1, 0, 0, 0.00, 0, '2026-01-15 11:17:09', '2026-01-15 11:17:09', NULL),
(3, 1, 'Intel Core I3 12100f', 'intel-core-i3-12100f', NULL, 2100000.00, 1, 1, 0, 0.00, 0, '2026-01-15 11:19:57', '2026-01-15 11:19:57', NULL),
(4, 1, 'Intel Core I5 12400f', 'intel-core-i5-12400f', NULL, 2800000.00, 1, 1, 0, 0.00, 0, '2026-01-15 11:22:44', '2026-01-15 11:22:44', NULL),
(5, 1, 'Intel Core I5 13500', 'intel-core-i5-13500', NULL, 5500000.00, 1, 1, 0, 0.00, 0, '2026-01-15 11:24:10', '2026-01-15 11:24:10', NULL),
(6, 1, 'Intel Core i7 14700f', 'intel-core-i7-14700f', NULL, 7000000.00, 1, 1, 0, 0.00, 0, '2026-01-15 11:25:36', '2026-01-15 11:25:36', NULL),
(7, 1, 'Intel Core I5 14600kf', 'intel-core-i5-14600kf', NULL, 6000000.00, 1, 1, 0, 0.00, 0, '2026-01-15 11:26:38', '2026-01-15 11:26:38', NULL),
(8, 1, 'CPU AMD Ryzen 5 5600X (3.7 GHz Upto 4.6GHz / 35MB / 6 Cores, 12 Threads / 65W / Socket AM4)', 'cpu-amd-ryzen-5-5600x-37-ghz-upto-46ghz-35mb-6-cores-12-threads-65w-socket-am4', NULL, 2800000.00, 1, 1, 0, 0.00, 0, '2026-01-15 11:28:10', '2026-01-15 11:28:10', NULL),
(9, 1, 'CPU AMD Ryzen 7 5700X (3.4 GHz Upto 4.6GHz / 36MB / 8 Cores, 16 Threads / 65W / Socket AM4)', 'cpu-amd-ryzen-7-5700x-34-ghz-upto-46ghz-36mb-8-cores-16-threads-65w-socket-am4', NULL, 4500000.00, 1, 0, 0, 0.00, 0, '2026-01-15 11:29:00', '2026-01-15 11:29:00', NULL),
(10, 1, 'CPU AMD Ryzen Ryzen 5 7500F (3.7 GHz Upto 5.0GHz / 38MB / 6 Cores, 12 Threads / 65W / Socket AM5)', 'cpu-amd-ryzen-ryzen-5-7500f-37-ghz-upto-50ghz-38mb-6-cores-12-threads-65w-socket-am5', NULL, 3200000.00, 1, 1, 0, 0.00, 0, '2026-01-15 11:30:05', '2026-01-15 11:30:05', NULL),
(11, 1, 'CPU AMD Ryzen 5 7600X (4.7 GHz Upto 5.3GHz / 38MB / 6 Cores, 12 Threads / 105W / Socket AM5)', 'cpu-amd-ryzen-5-7600x-47-ghz-upto-53ghz-38mb-6-cores-12-threads-105w-socket-am5', NULL, 5000000.00, 1, 0, 0, 0.00, 0, '2026-01-15 11:31:06', '2026-01-15 11:31:06', NULL),
(12, 1, ' CPU AMD Ryzen 7 7700X (4.5 GHz Upto 5.4GHz / 40MB / 8 Cores, 16 Threads / 105W / Socket AM5)', 'cpu-amd-ryzen-7-7700x-45-ghz-upto-54ghz-40mb-8-cores-16-threads-105w-socket-am5', NULL, 8000000.00, 1, 1, 0, 0.00, 0, '2026-01-15 11:32:20', '2026-01-15 11:33:29', NULL),
(13, 1, 'CPU AMD Ryzen 7 7800X3D (4.2Ghz up to 5.0Ghz/105MB/8 cores 16 threads/120W/Socket AM5)', 'cpu-amd-ryzen-7-7800x3d-42ghz-up-to-50ghz105mb8-cores-16-threads120wsocket-am5', NULL, 9000000.00, 1, 0, 0, 0.00, 0, '2026-01-15 11:33:06', '2026-01-15 11:33:06', NULL),
(14, 5, 'Mainboard ASROCK H510M-HDV/M.2 SE', 'mainboard-asrock-h510m-hdvm2-se', NULL, 1500000.00, 1, 0, 0, 0.00, 0, '2026-01-15 11:36:30', '2026-01-15 11:36:30', NULL),
(15, 5, 'Mainboard ASROCK B560M PRO4/ac (Intel B560, Socket 1200, m-ATX, 4 khe Ram DDR4)', 'mainboard-asrock-b560m-pro4ac-intel-b560-socket-1200-m-atx-4-khe-ram-ddr4', NULL, 2300000.00, 1, 0, 0, 0.00, 0, '2026-01-15 11:37:27', '2026-01-15 11:37:27', NULL),
(16, 5, 'Mainboard Asus PRIME H610M-K D4', 'mainboard-asus-prime-h610m-k-d4', NULL, 1800000.00, 1, 0, 0, 0.00, 0, '2026-01-15 11:39:43', '2026-01-15 11:39:43', NULL),
(17, 5, 'Mainboard Asus B760M-AYW WIFI D4', 'mainboard-asus-b760m-ayw-wifi-d4', NULL, 2800000.00, 1, 1, 0, 0.00, 0, '2026-01-15 11:40:40', '2026-01-15 11:40:40', NULL),
(18, 5, 'Mainboard MSI MAG B760M MORTAR WIFI II DDR5', 'mainboard-msi-mag-b760m-mortar-wifi-ii-ddr5', NULL, 4800000.00, 1, 1, 0, 0.00, 0, '2026-01-15 11:41:54', '2026-01-15 11:41:54', NULL),
(19, 5, 'Mainboard MSI B760M GAMING PLUS WIFI DDR4', 'mainboard-msi-b760m-gaming-plus-wifi-ddr4', NULL, 3300000.00, 1, 1, 0, 0.00, 0, '2026-01-15 11:42:53', '2026-01-15 11:43:03', NULL),
(20, 5, 'Bo mạch chủ GIGABYTE Z790 AORUS MASTER DDR5', 'bo-mach-chu-gigabyte-z790-aorus-master-ddr5', NULL, 15000000.00, 1, 1, 0, 0.00, 0, '2026-01-15 11:44:19', '2026-01-15 11:44:19', NULL),
(21, 5, 'Mainboard ASUS TUF GAMING B450M-PLUS (AMD B450, Socket AM4, m-ATX, 4 khe RAM DRR4)', 'mainboard-asus-tuf-gaming-b450m-plus-amd-b450-socket-am4-m-atx-4-khe-ram-drr4', NULL, 2900000.00, 1, 1, 0, 0.00, 0, '2026-01-15 11:46:18', '2026-01-15 11:46:18', NULL),
(22, 5, 'Mainboard ASROCK A520M/ac ', 'mainboard-asrock-a520mac', NULL, 1700000.00, 1, 1, 0, 0.00, 0, '2026-01-15 11:47:28', '2026-01-15 11:47:28', NULL),
(23, 5, 'Mainboard MSI PRO A620M-E DDR5', 'mainboard-msi-pro-a620m-e-ddr5', NULL, 2600000.00, 1, 1, 0, 0.00, 0, '2026-01-15 11:48:27', '2026-01-15 11:48:27', NULL),
(24, 5, 'Mainboard Gigabyte B650M AORUS ELITE AX', 'mainboard-gigabyte-b650m-aorus-elite-ax', NULL, 4400000.00, 1, 1, 0, 0.00, 0, '2026-01-15 11:49:36', '2026-01-15 11:49:36', NULL),
(25, 5, 'Mainboard ASUS ROG B650E-F GAMING WIFI', 'mainboard-asus-rog-b650e-f-gaming-wifi', NULL, 7800000.00, 1, 1, 0, 0.00, 0, '2026-01-15 11:50:51', '2026-01-15 11:50:51', NULL),
(26, 5, 'Mainboard MSI X670E GAMING PLUS WIFI DDR5', 'mainboard-msi-x670e-gaming-plus-wifi-ddr5', NULL, 7500000.00, 1, 1, 0, 0.00, 0, '2026-01-15 11:51:51', '2026-01-15 11:51:51', NULL),
(27, 35, 'RAM Desktop Corsair Vengeance RGB RS DDR4 3200MHz', 'ram-desktop-corsair-vengeance-rgb-rs-ddr4-3200mhz', NULL, 0.00, 1, 0, 0, 0.00, 0, '2026-01-15 11:54:48', '2026-01-15 11:54:48', NULL),
(28, 35, 'RAM Desktop Kingston Fury Beast (KF432C16BB1/16 - KF432C16BB1/16WP) 16GB (1x16GB) DDR4 3200MHz', 'ram-desktop-kingston-fury-beast-kf432c16bb116-kf432c16bb116wp-16gb-1x16gb-ddr4-3200mhz', NULL, 3000000.00, 1, 0, 0, 0.00, 0, '2026-01-15 11:56:58', '2026-01-15 11:56:58', NULL),
(29, 35, 'RAM Desktop KINGSTON Fury Beast RGB 32GB (1x32GB) DDR5 6400MHz', 'ram-desktop-kingston-fury-beast-rgb-32gb-1x32gb-ddr5-6400mhz', NULL, 7000000.00, 1, 1, 0, 0.00, 0, '2026-01-15 11:58:13', '2026-01-15 11:58:13', NULL),
(30, 35, 'Ram Desktop Corsair Vengeance RGB White Heatspreader (CMH32GX5M2E6000C36W) 32GB (2x16GB) DDR5 6000MHz', 'ram-desktop-corsair-vengeance-rgb-white-heatspreader-cmh32gx5m2e6000c36w-32gb-2x16gb-ddr5-6000mhz', NULL, 10000000.00, 1, 0, 0, 0.00, 0, '2026-01-15 11:59:07', '2026-01-15 11:59:07', NULL),
(31, 13, 'Ổ Cứng HDD SEAGATE Barracuda 4TB 3.5 inch 5400RPM, SATA III, 256MB Cache (ST4000DM004)', 'o-cung-hdd-seagate-barracuda-4tb-35-inch-5400rpm-sata-iii-256mb-cache-st4000dm004', NULL, 3500000.00, 1, 0, 0, 0.00, 0, '2026-01-15 12:00:20', '2026-01-15 12:00:20', NULL),
(33, 13, 'Ổ Cứng HDD WD 4TB Blue 3.5 inch, 5400RPM, SATA III, 256MB Cache (WD40EZAX)', 'o-cung-hdd-wd-4tb-blue-35-inch-5400rpm-sata-iii-256mb-cache-wd40ezax', NULL, 3800000.00, 1, 0, 0, 0.00, 0, '2026-01-15 12:01:41', '2026-01-15 12:01:41', NULL),
(34, 13, 'Ổ Cứng HDD Toshiba P300 2TB Red 3.5 inch, 7200RPM, SATA III, 256MB Cache (HDWD320AZSTA/HDWD320UZSVA)', 'o-cung-hdd-toshiba-p300-2tb-red-35-inch-7200rpm-sata-iii-256mb-cache-hdwd320azstahdwd320uzsva', NULL, 3000000.00, 1, 0, 0, 0.00, 0, '2026-01-15 12:03:37', '2026-01-15 12:03:37', NULL),
(35, 4, 'Ổ Cứng SSD Samsung 870 EVO 500GB 2.5 inch SATA III ( Đọc 560MB/s - Ghi 530MB/s) - (MZ-77E500BW)', 'o-cung-ssd-samsung-870-evo-500gb-25-inch-sata-iii-doc-560mbs-ghi-530mbs-mz-77e500bw', NULL, 2.80, 1, 0, 0, 0.00, 0, '2026-01-15 12:04:55', '2026-01-15 12:04:55', NULL),
(37, 4, 'Ổ Cứng SSD Samsung 980 250GB – M.2 2280 PCIe Gen3 x4 (Đọc 2900MB/s - Ghi 1300MB/s) ', 'o-cung-ssd-samsung-980-250gb-m2-2280-pcie-gen3-x4-doc-2900mbs-ghi-1300mbs', NULL, 2000000.00, 1, 0, 0, 0.00, 0, '2026-01-15 12:07:43', '2026-01-15 12:07:43', NULL),
(38, 4, 'Ổ Cứng SSD KINGSTON A400 256GB 2.5 inch SATA III (Đọc 500MB/s - Ghi 450MB/s)', 'o-cung-ssd-kingston-a400-256gb-25-inch-sata-iii-doc-500mbs-ghi-450mbs', NULL, 1600000.00, 1, 0, 0, 0.00, 0, '2026-01-15 12:08:47', '2026-01-15 12:08:47', NULL),
(39, 4, 'Ổ Cứng SSD CORSAIR MP600 CORE XT 1TB – M.2 2280 PCIe Gen4 x4 (Đọc 5900MB/s - Ghi 5000MB/s)', 'o-cung-ssd-corsair-mp600-core-xt-1tb-m2-2280-pcie-gen4-x4-doc-5900mbs-ghi-5000mbs', NULL, 3800000.00, 1, 0, 0, 0.00, 0, '2026-01-15 12:10:01', '2026-01-15 12:10:01', NULL),
(40, 2, 'Card màn hình Asus DUAL RTX 4060-O8G-V2', 'card-man-hinh-asus-dual-rtx-4060-o8g-v2', NULL, 8800000.00, 1, 0, 2, 0.00, 0, '2026-01-15 12:12:47', '2026-01-15 12:28:52', NULL),
(41, 2, 'VGA Gigabyte RTX 4070 WINDFORCE 2X OC V2 12GB', 'vga-gigabyte-rtx-4070-windforce-2x-oc-v2-12gb', NULL, 16000000.00, 1, 0, 0, 0.00, 0, '2026-01-15 12:13:55', '2026-01-15 12:13:55', NULL),
(42, 2, 'Card màn hình MSI RTX 5060 8G VENTUS 2X OC GDDR7', 'card-man-hinh-msi-rtx-5060-8g-ventus-2x-oc-gddr7', NULL, 9000000.00, 1, 0, 0, 0.00, 0, '2026-01-15 12:14:48', '2026-01-15 12:14:48', NULL),
(43, 2, 'Card màn hình Asus DUAL RX 6600 XT-O8G', 'card-man-hinh-asus-dual-rx-6600-xt-o8g', NULL, 8000000.00, 1, 0, 0, 0.00, 0, '2026-01-15 12:15:59', '2026-01-15 12:15:59', NULL),
(44, 2, 'VGA Asus Dual Radeon RX 6500 XT OC 4GB DUAL-RX6500XT-O4G-V2', 'vga-asus-dual-radeon-rx-6500-xt-oc-4gb-dual-rx6500xt-o4g-v2', NULL, 3600000.00, 1, 0, 0, 0.00, 0, '2026-01-15 12:17:06', '2026-01-15 12:17:06', NULL),
(45, 6, 'Nguồn Asus PRIME 650B BLACK ( 80 Plus Bronze)', 'nguon-asus-prime-650b-black-80-plus-bronze', NULL, 1300000.00, 1, 0, 0, 0.00, 0, '2026-01-15 12:18:59', '2026-01-15 12:18:59', NULL),
(46, 6, 'Nguồn máy tính Corsair RM1000e ATX 3.1 1000W (80 Plus Gold/ Màu Đen)', 'nguon-may-tinh-corsair-rm1000e-atx-31-1000w-80-plus-gold-mau-den', NULL, 4400000.00, 1, 0, 0, 0.00, 0, '2026-01-15 12:19:59', '2026-01-15 12:19:59', NULL),
(47, 6, 'Nguồn Xigmatek X-POWER III 650 - 600W EN45990 (Màu Đen)', 'nguon-xigmatek-x-power-iii-650-600w-en45990-mau-den', NULL, 900000.00, 1, 0, 0, 0.00, 0, '2026-01-15 12:20:52', '2026-01-15 12:20:52', NULL),
(48, 6, 'Nguồn máy tính MSI MAG A650BNL - 650W (80 Plus Bronze)', 'nguon-may-tinh-msi-mag-a650bnl-650w-80-plus-bronze', NULL, 1100000.00, 1, 0, 0, 0.00, 0, '2026-01-15 12:21:52', '2026-01-15 12:21:52', NULL),
(49, 7, 'Vỏ máy tính Corsair FRAME 5000D RS White (ATX/mid tower)', 'vo-may-tinh-corsair-frame-5000d-rs-white-atxmid-tower', NULL, 3800000.00, 1, 0, 0, 0.00, 0, '2026-01-15 12:24:27', '2026-01-15 12:24:27', NULL),
(50, 7, 'Vỏ Case Asus TUF GAMING GT502 HORIZON WHITE(MATX/Mid tower)', 'vo-case-asus-tuf-gaming-gt502-horizon-whitematxmid-tower', NULL, 4000000.00, 1, 0, 0, 0.00, 0, '2026-01-15 12:25:07', '2026-01-15 12:25:07', NULL),
(51, 7, 'Vỏ case MSI MAG FORGE 120A AIRFLOW (Mid Tower/Màu Đen/Tặng 6 fan RGB)', 'vo-case-msi-mag-forge-120a-airflow-mid-towermau-dentang-6-fan-rgb', NULL, 900000.00, 1, 0, 0, 0.00, 0, '2026-01-15 12:25:48', '2026-01-15 12:25:48', NULL),
(52, 7, 'Vỏ case Jonsbo TK-1 White ( Mid Tower/Màu Trắng)', 'vo-case-jonsbo-tk-1-white-mid-towermau-trang', NULL, 2400000.00, 1, 0, 0, 0.00, 0, '2026-01-15 12:26:42', '2026-01-15 12:26:42', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `products`
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
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`);
COMMIT;


CREATE TABLE `products_attribute_values` (
  `product_id` int(11) NOT NULL,
  `attribute_value_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products_attribute_values`
--

INSERT INTO `products_attribute_values` (`product_id`, `attribute_value_id`) VALUES
(1, 1),
(1, 36),
(1, 43),
(1, 48),
(2, 1),
(2, 35),
(2, 43),
(2, 48),
(3, 1),
(3, 35),
(3, 44),
(3, 49),
(4, 1),
(4, 36),
(4, 44),
(4, 49),
(5, 1),
(5, 36),
(5, 44),
(5, 50),
(6, 1),
(6, 37),
(6, 44),
(6, 51),
(7, 1),
(7, 36),
(7, 44),
(7, 51),
(8, 2),
(8, 39),
(8, 46),
(8, 172),
(9, 2),
(9, 39),
(9, 46),
(9, 172),
(10, 2),
(10, 39),
(10, 47),
(10, 173),
(11, 2),
(11, 39),
(11, 47),
(11, 173),
(12, 2),
(12, 40),
(12, 47),
(12, 173),
(13, 2),
(13, 40),
(13, 47),
(13, 173),
(14, 7),
(14, 90),
(14, 95),
(14, 112),
(14, 174),
(14, 178),
(15, 7),
(15, 90),
(15, 96),
(15, 113),
(15, 174),
(15, 178),
(16, 4),
(16, 91),
(16, 98),
(16, 112),
(16, 174),
(16, 178),
(17, 4),
(17, 91),
(17, 99),
(17, 112),
(17, 174),
(17, 178),
(18, 6),
(18, 91),
(18, 99),
(18, 113),
(18, 175),
(18, 178),
(19, 6),
(19, 91),
(19, 99),
(19, 113),
(19, 174),
(19, 178),
(20, 5),
(20, 91),
(20, 100),
(20, 113),
(20, 175),
(20, 178),
(21, 4),
(21, 93),
(21, 103),
(21, 113),
(21, 174),
(21, 178),
(22, 7),
(22, 93),
(22, 104),
(22, 112),
(22, 174),
(22, 178),
(23, 6),
(23, 94),
(23, 105),
(23, 112),
(23, 175),
(23, 178),
(24, 5),
(24, 94),
(24, 106),
(24, 113),
(24, 175),
(24, 178),
(25, 4),
(25, 94),
(25, 106),
(25, 113),
(25, 175),
(25, 178),
(26, 6),
(26, 94),
(26, 107),
(26, 113),
(26, 175),
(26, 178),
(27, 11),
(27, 139),
(27, 141),
(28, 15),
(28, 80),
(28, 139),
(28, 141),
(29, 15),
(29, 82),
(29, 140),
(29, 145),
(30, 11),
(30, 83),
(30, 140),
(30, 143),
(31, 18),
(31, 75),
(31, 137),
(33, 12),
(33, 75),
(33, 137),
(34, 19),
(34, 74),
(34, 138),
(35, 13),
(35, 72),
(35, 84),
(35, 87),
(37, 13),
(37, 71),
(37, 86),
(37, 87),
(38, 15),
(38, 71),
(38, 84),
(38, 87),
(39, 73),
(39, 86),
(39, 88),
(40, 4),
(40, 57),
(40, 61),
(40, 67),
(41, 5),
(41, 57),
(41, 61),
(41, 68),
(42, 6),
(42, 57),
(42, 63),
(42, 67),
(43, 2),
(43, 57),
(43, 61),
(43, 67),
(44, 4),
(44, 59),
(44, 61),
(44, 65),
(45, 4),
(45, 119),
(45, 123),
(45, 127),
(46, 121),
(46, 125),
(46, 128),
(47, 24),
(47, 119),
(47, 122),
(47, 127),
(48, 6),
(48, 119),
(48, 123),
(48, 127),
(49, 11),
(49, 130),
(49, 181),
(50, 4),
(50, 130),
(50, 181),
(51, 6),
(51, 130),
(51, 181),
(52, 29),
(52, 130),
(52, 181);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `products_attribute_values`
--
ALTER TABLE `products_attribute_values`
  ADD PRIMARY KEY (`product_id`,`attribute_value_id`),
  ADD KEY `products_attribute_values_ibfk_2` (`attribute_value_id`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `products_attribute_values`
--
ALTER TABLE `products_attribute_values`
  ADD CONSTRAINT `products_attribute_values_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `products_attribute_values_ibfk_2` FOREIGN KEY (`attribute_value_id`) REFERENCES `attribute_values` (`attribute_value_id`);
COMMIT;


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
  `warranty_period` int(11) DEFAULT NULL,
  `discount_percent` decimal(12,2) DEFAULT 0.00,
  `discount_start_date` datetime DEFAULT NULL,
  `discount_end_date` datetime DEFAULT NULL,
  `variant_type` enum('component','bundle') DEFAULT 'component'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_variants`
--

INSERT INTO `product_variants` (`variant_id`, `product_id`, `sku`, `variant_name`, `price`, `stock_quantity`, `is_active`, `is_default`, `created_at`, `updated_at`, `warranty_period`, `discount_percent`, `discount_start_date`, `discount_end_date`, `variant_type`) VALUES
(1, 1, 'C01-P0001-V00', 'Mặc định', 3400000.00, 3, 1, 1, '2026-01-15 11:15:43', '2026-01-15 11:15:43', 36, 20.00, '2026-01-01 00:00:00', '2026-01-30 00:00:00', 'component'),
(2, 2, 'C01-P0002-V00', 'Mặc định', 1800000.00, 2, 1, 1, '2026-01-15 11:17:09', '2026-01-15 11:17:09', 36, 10.00, '2026-01-01 00:00:00', '2026-01-30 00:00:00', 'component'),
(3, 3, 'C01-P0003-V00', 'Mặc định', 2100000.00, 2, 1, 1, '2026-01-15 11:19:57', '2026-01-15 11:19:57', 36, 10.00, '2026-01-01 00:00:00', '2026-01-30 00:00:00', 'component'),
(4, 4, 'C01-P0004-V00', 'Mặc định', 2800000.00, 3, 1, 1, '2026-01-15 11:22:44', '2026-01-15 11:22:44', 36, 20.00, '2026-01-01 00:00:00', '2026-01-30 00:00:00', 'component'),
(5, 5, 'C01-P0005-V00', 'Mặc định', 5500000.00, 2, 1, 1, '2026-01-15 11:24:10', '2026-01-15 11:24:10', 36, 10.00, '2026-01-01 00:00:00', '2026-01-30 00:00:00', 'component'),
(6, 6, 'C01-P0006-V00', 'Mặc định', 7000000.00, 2, 1, 1, '2026-01-15 11:25:36', '2026-01-15 11:25:36', 36, 13.00, '2026-01-01 00:00:00', '2026-01-31 00:00:00', 'component'),
(7, 7, 'C01-P0007-V00', 'Mặc định', 6000000.00, 2, 1, 1, '2026-01-15 11:26:39', '2026-01-15 11:26:39', 36, 15.00, '2026-01-01 00:00:00', '2026-01-31 00:00:00', 'component'),
(8, 8, 'C01-P0008-V00', 'Mặc định', 2800000.00, 0, 1, 1, '2026-01-15 11:28:10', '2026-01-17 14:35:21', 36, 15.00, '2026-01-01 00:00:00', '2026-01-30 00:00:00', 'component'),
(9, 9, 'C01-P0009-V00', 'Mặc định', 4500000.00, 2, 1, 1, '2026-01-15 11:29:00', '2026-01-15 11:29:00', 36, 10.00, '2026-01-01 00:00:00', '2026-01-30 00:00:00', 'component'),
(10, 10, 'C01-P0010-V00', 'Mặc định', 3200000.00, 2, 1, 1, '2026-01-15 11:30:05', '2026-01-15 11:30:05', 36, 15.00, '2026-01-01 00:00:00', '2026-01-30 00:00:00', 'component'),
(11, 11, 'C01-P0011-V00', 'Mặc định', 5000000.00, 0, 1, 1, '2026-01-15 11:31:06', '2026-01-17 14:41:55', 36, 15.00, '2026-01-01 00:00:00', '2026-01-31 00:00:00', 'component'),
(12, 12, 'C01-P0012-V00', 'Mặc định', 8000000.00, 0, 1, 1, '2026-01-15 11:32:20', '2026-01-17 15:31:48', 36, 10.00, '2026-01-01 00:00:00', '2026-01-15 00:00:00', 'component'),
(13, 13, 'C01-P0013-V00', 'Mặc định', 9000000.00, 2, 1, 1, '2026-01-15 11:33:06', '2026-01-15 11:33:06', 36, 10.00, '2026-01-01 00:00:00', '2026-01-15 00:00:00', 'component'),
(14, 14, 'C05-P0014-V00', 'Mặc định', 1500000.00, 2, 1, 1, '2026-01-15 11:36:30', '2026-01-15 11:36:30', 36, 20.00, '2026-01-01 00:00:00', NULL, 'component'),
(15, 15, 'C05-P0015-V00', 'Mặc định', 2300000.00, 2, 1, 1, '2026-01-15 11:37:27', '2026-01-15 11:37:27', 36, 10.00, '2026-01-01 00:00:00', '2026-01-15 00:00:00', 'component'),
(16, 16, 'C05-P0016-V00', 'Mặc định', 1800000.00, 2, 1, 1, '2026-01-15 11:39:43', '2026-01-15 11:39:43', 36, 10.00, '2026-01-01 00:00:00', '2026-01-15 00:00:00', 'component'),
(17, 17, 'C05-P0017-V00', 'Mặc định', 2800000.00, 2, 1, 1, '2026-01-15 11:40:40', '2026-01-15 11:40:40', 36, 10.00, '2026-01-01 00:00:00', '2026-01-15 00:00:00', 'component'),
(18, 18, 'C05-P0018-V00', 'Mặc định', 4800000.00, 3, 1, 1, '2026-01-15 11:41:54', '2026-01-15 11:41:54', 36, 15.00, '2026-01-01 00:00:00', '2026-01-15 00:00:00', 'component'),
(19, 19, 'C05-P0019-V00', 'Mặc định', 3300000.00, 2, 1, 1, '2026-01-15 11:42:53', '2026-01-15 11:42:53', 36, 10.00, '2026-01-08 00:00:00', '2026-01-15 00:00:00', 'component'),
(20, 20, 'C05-P0020-V00', 'Mặc định', 15000000.00, 0, 1, 1, '2026-01-15 11:44:19', '2026-01-17 15:11:17', 36, 10.00, '2026-01-01 00:00:00', '2026-01-15 00:00:00', 'component'),
(21, 21, 'C05-P0021-V00', 'Mặc định', 2900000.00, 2, 1, 1, '2026-01-15 11:46:18', '2026-01-15 11:46:18', 36, 10.00, '2026-01-01 00:00:00', '2026-01-15 00:00:00', 'component'),
(22, 22, 'C05-P0022-V00', 'Mặc định', 1700000.00, 2, 1, 1, '2026-01-15 11:47:28', '2026-01-15 11:47:28', 24, 15.00, '2026-01-01 00:00:00', '2026-01-15 00:00:00', 'component'),
(23, 23, 'C05-P0023-V00', 'Mặc định', 2600000.00, 2, 1, 1, '2026-01-15 11:48:27', '2026-01-15 11:48:27', 36, 15.00, '2026-01-01 00:00:00', '2026-01-15 00:00:00', 'component'),
(24, 24, 'C05-P0024-V00', 'Mặc định', 4400000.00, 2, 1, 1, '2026-01-15 11:49:36', '2026-01-15 11:49:36', 36, 10.00, '2026-01-01 00:00:00', '2026-01-15 00:00:00', 'component'),
(25, 25, 'C05-P0025-V00', 'Mặc định', 7800000.00, 2, 1, 1, '2026-01-15 11:50:51', '2026-01-15 11:50:51', 36, 10.00, '2026-01-01 00:00:00', '2026-01-15 00:00:00', 'component'),
(26, 26, 'C05-P0026-V00', 'Mặc định', 7500000.00, 2, 1, 1, '2026-01-15 11:51:51', '2026-01-15 11:51:51', 36, 15.00, '2026-01-01 00:00:00', '2026-01-15 00:00:00', 'component'),
(27, 27, 'PRD-8G-1', '8GB ( 1 X 8GB)', 800000.00, 2, 1, 0, '2026-01-15 11:54:48', '2026-01-15 11:54:48', 36, 0.00, NULL, NULL, 'component'),
(28, 27, 'PRD-16-2', '16GB (1 X 16GB)', 1400000.00, 2, 1, 0, '2026-01-15 11:54:48', '2026-01-15 11:54:48', 36, 0.00, NULL, NULL, 'component'),
(29, 27, 'PRD-16-3', '16GB (2 X 8GB)', 1500000.00, 2, 1, 1, '2026-01-15 11:54:48', '2026-01-15 11:54:48', 36, 10.00, '2026-01-01 00:00:00', '2026-01-15 00:00:00', 'component'),
(30, 28, 'C35-P0028-V00', 'Mặc định', 3000000.00, 2, 1, 1, '2026-01-15 11:56:58', '2026-01-15 11:56:58', 36, 0.00, NULL, NULL, 'component'),
(31, 29, 'C35-P0029-V00', 'Mặc định', 7000000.00, 2, 1, 1, '2026-01-15 11:58:13', '2026-01-15 11:58:13', 36, 10.00, '2026-01-01 00:00:00', '2026-01-15 00:00:00', 'component'),
(32, 30, 'C35-P0030-V00', 'Mặc định', 10000000.00, 2, 1, 1, '2026-01-15 11:59:07', '2026-01-15 11:59:07', 36, 0.00, NULL, NULL, 'component'),
(33, 31, 'C13-P0031-V00', 'Mặc định', 3500000.00, 2, 1, 1, '2026-01-15 12:00:20', '2026-01-15 12:00:20', 24, 10.00, '2026-01-01 00:00:00', '2026-01-16 00:00:00', 'component'),
(35, 33, 'C13-P0033-V00', 'Mặc định', 3800000.00, 2, 1, 1, '2026-01-15 12:01:41', '2026-01-15 12:01:41', 24, 0.00, NULL, NULL, 'component'),
(36, 34, 'C13-P0034-V00', 'Mặc định', 3000000.00, 2, 1, 1, '2026-01-15 12:03:37', '2026-01-15 12:03:37', 24, 0.00, NULL, NULL, 'component'),
(37, 35, 'C04-P0035-V00', 'Mặc định', 2.80, 2, 1, 1, '2026-01-15 12:04:55', '2026-01-15 12:04:55', 60, 0.00, NULL, NULL, 'component'),
(39, 37, 'C04-P0037-V00', 'Mặc định', 2000000.00, 2, 1, 1, '2026-01-15 12:07:43', '2026-01-15 12:07:43', 60, 0.00, NULL, NULL, 'component'),
(40, 38, 'C04-P0038-V00', 'Mặc định', 1600000.00, 2, 1, 1, '2026-01-15 12:08:47', '2026-01-15 12:08:47', 60, 0.00, NULL, NULL, 'component'),
(41, 39, 'C04-P0039-V00', 'Mặc định', 3800000.00, 2, 1, 1, '2026-01-15 12:10:01', '2026-01-15 12:10:01', 60, 10.00, '2026-01-15 00:00:00', '2026-01-31 00:00:00', 'component'),
(42, 40, 'C02-P0040-V00', 'Mặc định', 8800000.00, 0, 1, 1, '2026-01-15 12:12:47', '2026-01-18 03:57:30', 36, 0.00, NULL, NULL, 'component'),
(43, 41, 'C02-P0041-V00', 'Mặc định', 16000000.00, 2, 1, 1, '2026-01-15 12:13:55', '2026-01-15 12:13:55', 36, 0.00, NULL, NULL, 'component'),
(44, 42, 'C02-P0042-V00', 'Mặc định', 9000000.00, 0, 1, 1, '2026-01-15 12:14:48', '2026-01-17 15:22:17', 36, 0.00, NULL, NULL, 'component'),
(45, 43, 'C02-P0043-V00', 'Mặc định', 8000000.00, 0, 1, 1, '2026-01-15 12:15:59', '2026-01-18 04:05:10', 36, 0.00, NULL, NULL, 'component'),
(46, 44, 'C02-P0044-V00', 'Mặc định', 3600000.00, 2, 1, 1, '2026-01-15 12:17:06', '2026-01-15 12:17:06', 36, 0.00, NULL, NULL, 'component'),
(47, 45, 'C06-P0045-V00', 'Mặc định', 1300000.00, 2, 1, 1, '2026-01-15 12:18:59', '2026-01-15 12:18:59', 72, 0.00, NULL, NULL, 'component'),
(48, 46, 'C06-P0046-V00', 'Mặc định', 4400000.00, 2, 1, 1, '2026-01-15 12:19:59', '2026-01-15 12:19:59', 84, 0.00, NULL, NULL, 'component'),
(49, 47, 'C06-P0047-V00', 'Mặc định', 900000.00, 2, 1, 1, '2026-01-15 12:20:52', '2026-01-15 12:20:52', 36, 0.00, NULL, NULL, 'component'),
(50, 48, 'C06-P0048-V00', 'Mặc định', 1100000.00, 2, 1, 1, '2026-01-15 12:21:52', '2026-01-15 12:21:52', 60, 0.00, NULL, NULL, 'component'),
(51, 49, 'C07-P0049-V00', 'Mặc định', 3800000.00, 2, 1, 1, '2026-01-15 12:24:27', '2026-01-15 12:24:27', 24, 0.00, NULL, NULL, 'component'),
(52, 50, 'C07-P0050-V00', 'Mặc định', 4000000.00, 2, 1, 1, '2026-01-15 12:25:07', '2026-01-15 12:25:07', 24, 0.00, NULL, NULL, 'component'),
(53, 51, 'C07-P0051-V00', 'Mặc định', 900000.00, 2, 1, 1, '2026-01-15 12:25:48', '2026-01-15 12:25:48', 12, 0.00, NULL, NULL, 'component'),
(54, 52, 'C07-P0052-V00', 'Mặc định', 2400000.00, 2, 1, 1, '2026-01-15 12:26:42', '2026-01-15 12:26:42', 12, 0.00, NULL, NULL, 'component');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `product_variants`
--
ALTER TABLE `product_variants`
  ADD PRIMARY KEY (`variant_id`),
  ADD UNIQUE KEY `sku` (`sku`),
  ADD KEY `idx_product_id` (`product_id`),
  ADD KEY `idx_sku` (`sku`),
  ADD KEY `idx_is_active` (`is_active`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `product_variants`
--
ALTER TABLE `product_variants`
  MODIFY `variant_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `product_variants`
--
ALTER TABLE `product_variants`
  ADD CONSTRAINT `product_variants_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE;
COMMIT;


CREATE TABLE `compatibility_rules` (
  `rule_id` int(11) NOT NULL,
  `rule_name` varchar(100) NOT NULL COMMENT 'VD: CPU-Mainboard Socket',
  `category_1_id` int(11) NOT NULL COMMENT 'Category nguồn (VD: CPU)',
  `attribute_1_id` int(11) NOT NULL COMMENT 'Attribute của category 1',
  `category_2_id` int(11) NOT NULL COMMENT 'Category đích (VD: Mainboard)',
  `attribute_2_id` int(11) NOT NULL COMMENT 'Attribute c��a category 2',
  `match_type` enum('exact','one_to_many','contains') DEFAULT 'exact' COMMENT 'exact=khớp chính xác, one_to_many=1→nhiều, contains=chứa',
  `is_active` tinyint(1) DEFAULT 1,
  `note` text DEFAULT NULL COMMENT 'Ghi chú cho admin',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `compatibility_rules`
--

INSERT INTO `compatibility_rules` (`rule_id`, `rule_name`, `category_1_id`, `attribute_1_id`, `category_2_id`, `attribute_2_id`, `match_type`, `is_active`, `note`, `created_at`, `updated_at`) VALUES
(1, 'Kiểm tra tương thích giữa CPU - Mainboard: Socket', 1, 3, 5, 11, 'exact', 1, 'Socket của CPU phải khớp chính xác với socket mà Mainboard hỗ trợ', '2026-01-16 06:13:10', '2026-01-16 10:27:43'),
(2, 'Kiểm tra tương thích giữa Mainboard - RAM: Loại Ram ', 5, 28, 35, 21, 'exact', 1, NULL, '2026-01-16 09:11:57', '2026-01-16 10:21:40'),
(3, 'Kiểm tra tương thích giữa Mainboard - Case: Form Factor', 7, 19, 5, 13, 'one_to_many', 1, NULL, '2026-01-16 10:24:11', '2026-01-16 10:34:56'),
(4, 'Kiểm tra tương thích giữa CPU - Ram: Loại Ram', 1, 3, 35, 21, 'one_to_many', 1, NULL, '2026-01-16 10:34:44', '2026-01-16 10:34:44');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `compatibility_rules`
--
ALTER TABLE `compatibility_rules`
  ADD PRIMARY KEY (`rule_id`),
  ADD KEY `idx_category_1` (`category_1_id`),
  ADD KEY `idx_category_2` (`category_2_id`),
  ADD KEY `idx_is_active` (`is_active`),
  ADD KEY `attribute_1_id` (`attribute_1_id`),
  ADD KEY `attribute_2_id` (`attribute_2_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `compatibility_rules`
--
ALTER TABLE `compatibility_rules`
  MODIFY `rule_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `compatibility_rules`
--
ALTER TABLE `compatibility_rules`
  ADD CONSTRAINT `compatibility_rules_ibfk_1` FOREIGN KEY (`category_1_id`) REFERENCES `categories` (`category_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `compatibility_rules_ibfk_2` FOREIGN KEY (`category_2_id`) REFERENCES `categories` (`category_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `compatibility_rules_ibfk_3` FOREIGN KEY (`attribute_1_id`) REFERENCES `attributes` (`attribute_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `compatibility_rules_ibfk_4` FOREIGN KEY (`attribute_2_id`) REFERENCES `attributes` (`attribute_id`) ON DELETE CASCADE;
COMMIT;


CREATE TABLE `compatibility_values` (
  `cv_id` int(11) NOT NULL,
  `rule_id` int(11) NOT NULL,
  `attribute_value_1_id` int(11) NOT NULL,
  `attribute_value_2_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `compatibility_values`
--

INSERT INTO `compatibility_values` (`cv_id`, `rule_id`, `attribute_value_1_id`, `attribute_value_2_id`, `created_at`) VALUES
(1, 1, 44, 91, '2026-01-16 08:18:40'),
(2, 1, 43, 90, '2026-01-16 10:20:03'),
(3, 1, 45, 92, '2026-01-16 10:20:23'),
(4, 1, 46, 93, '2026-01-16 10:20:31'),
(5, 1, 47, 94, '2026-01-16 10:20:35'),
(6, 2, 174, 139, '2026-01-16 10:21:52'),
(7, 2, 175, 140, '2026-01-16 10:21:55'),
(8, 3, 182, 179, '2026-01-16 10:36:13'),
(9, 3, 182, 110, '2026-01-16 10:36:17'),
(10, 3, 182, 178, '2026-01-16 10:36:20'),
(11, 3, 182, 176, '2026-01-16 10:36:23'),
(12, 3, 135, 110, '2026-01-16 10:36:26'),
(13, 3, 135, 178, '2026-01-16 10:36:29'),
(14, 3, 135, 176, '2026-01-16 10:36:32'),
(15, 3, 181, 178, '2026-01-16 10:36:35'),
(16, 3, 181, 176, '2026-01-16 10:36:38'),
(17, 3, 180, 176, '2026-01-16 10:36:41'),
(19, 4, 43, 139, '2026-01-16 10:38:56'),
(20, 4, 44, 139, '2026-01-16 10:38:58'),
(21, 4, 44, 140, '2026-01-16 10:39:01'),
(22, 4, 45, 140, '2026-01-16 10:39:04'),
(23, 4, 46, 139, '2026-01-16 10:39:07'),
(24, 4, 47, 140, '2026-01-16 10:39:10');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `compatibility_values`
--
ALTER TABLE `compatibility_values`
  ADD PRIMARY KEY (`cv_id`),
  ADD KEY `idx_rule_id` (`rule_id`),
  ADD KEY `idx_rule_lookup` (`rule_id`),
  ADD KEY `idx_attribute_value_1` (`attribute_value_1_id`),
  ADD KEY `idx_attribute_value_2` (`attribute_value_2_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `compatibility_values`
--
ALTER TABLE `compatibility_values`
  MODIFY `cv_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `compatibility_values`
--
ALTER TABLE `compatibility_values`
  ADD CONSTRAINT `compatibility_values_ibfk_1` FOREIGN KEY (`rule_id`) REFERENCES `compatibility_rules` (`rule_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `compatibility_values_ibfk_av1` FOREIGN KEY (`attribute_value_1_id`) REFERENCES `attribute_values` (`attribute_value_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `compatibility_values_ibfk_av2` FOREIGN KEY (`attribute_value_2_id`) REFERENCES `attribute_values` (`attribute_value_id`) ON DELETE CASCADE;
COMMIT;


--
-- Table structure for table `variant_serials`
--

CREATE TABLE `variant_serials` (
  `serial_id` int(11) NOT NULL,
  `variant_id` int(11) NOT NULL,
  `serial_number` varchar(64) NOT NULL,
  `status` enum('in_stock','reserved','sold','rma_in','rma_done','scrapped') NOT NULL DEFAULT 'in_stock',
  `order_item_id` int(11) DEFAULT NULL,
  `warranty_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `serial_type` enum('component','pc_bundle') NOT NULL DEFAULT 'component'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `variant_serials`
--

INSERT INTO `variant_serials` (`serial_id`, `variant_id`, `serial_number`, `status`, `order_item_id`, `warranty_id`, `created_at`, `updated_at`, `serial_type`) VALUES
(1, 1, 'SN120260001', 'in_stock', NULL, NULL, '2026-01-15 11:15:43', '2026-01-15 11:15:43', 'component'),
(2, 1, 'SN120260002', 'in_stock', NULL, NULL, '2026-01-15 11:15:43', '2026-01-15 11:15:43', 'component'),
(3, 1, 'SN120260003', 'in_stock', NULL, NULL, '2026-01-15 11:15:43', '2026-01-15 11:15:43', 'component'),
(4, 2, 'SN220260001', 'in_stock', NULL, NULL, '2026-01-15 11:17:09', '2026-01-15 11:17:09', 'component'),
(5, 2, 'SN220260002', 'in_stock', NULL, NULL, '2026-01-15 11:17:09', '2026-01-15 11:17:09', 'component'),
(6, 3, 'SN320260001', 'in_stock', NULL, NULL, '2026-01-15 11:19:57', '2026-01-15 11:19:57', 'component'),
(7, 3, 'SN320260002', 'in_stock', NULL, NULL, '2026-01-15 11:19:57', '2026-01-15 11:19:57', 'component'),
(8, 4, 'SN420260001', 'in_stock', NULL, NULL, '2026-01-15 11:22:44', '2026-01-15 11:22:44', 'component'),
(9, 4, 'SN420260002', 'in_stock', NULL, NULL, '2026-01-15 11:22:44', '2026-01-15 11:22:44', 'component'),
(10, 4, 'SN420260003', 'in_stock', NULL, NULL, '2026-01-15 11:22:44', '2026-01-15 11:22:44', 'component'),
(11, 5, 'SN520260001', 'in_stock', NULL, NULL, '2026-01-15 11:24:10', '2026-01-15 11:24:10', 'component'),
(12, 5, 'SN520260002', 'in_stock', NULL, NULL, '2026-01-15 11:24:10', '2026-01-15 11:24:10', 'component'),
(13, 6, 'SN620260001', 'in_stock', NULL, NULL, '2026-01-15 11:25:36', '2026-01-15 11:25:36', 'component'),
(14, 6, 'SN620260002', 'in_stock', NULL, NULL, '2026-01-15 11:25:36', '2026-01-15 11:25:36', 'component'),
(15, 7, 'SN720260001', 'in_stock', NULL, NULL, '2026-01-15 11:26:39', '2026-01-15 11:26:39', 'component'),
(16, 7, 'SN720260002', 'in_stock', NULL, NULL, '2026-01-15 11:26:39', '2026-01-15 11:26:39', 'component'),
(17, 8, 'SN820260001', 'reserved', 171, NULL, '2026-01-15 11:28:10', '2026-01-17 14:32:03', 'component'),
(18, 8, 'SN820260002', 'reserved', 172, NULL, '2026-01-15 11:28:10', '2026-01-17 14:35:21', 'component'),
(19, 9, 'SN920260001', 'in_stock', NULL, NULL, '2026-01-15 11:29:00', '2026-01-15 11:29:00', 'component'),
(20, 9, 'SN920260002', 'in_stock', NULL, NULL, '2026-01-15 11:29:00', '2026-01-15 11:29:00', 'component'),
(21, 10, 'SN1020260001', 'in_stock', NULL, NULL, '2026-01-15 11:30:05', '2026-01-15 11:30:05', 'component'),
(22, 10, 'SN1020260002', 'in_stock', NULL, NULL, '2026-01-15 11:30:05', '2026-01-15 11:30:05', 'component'),
(23, 11, 'SN1120260001', 'reserved', 170, NULL, '2026-01-15 11:31:06', '2026-01-17 14:26:49', 'component'),
(24, 11, 'SN1120260002', 'reserved', 173, NULL, '2026-01-15 11:31:06', '2026-01-17 14:41:55', 'component'),
(25, 12, 'SN1220260001', 'reserved', 176, NULL, '2026-01-15 11:32:20', '2026-01-17 15:17:48', 'component'),
(26, 12, 'SN1220260002', 'reserved', 180, NULL, '2026-01-15 11:32:20', '2026-01-17 15:31:48', 'component'),
(27, 13, 'SN1320260001', 'in_stock', NULL, NULL, '2026-01-15 11:33:06', '2026-01-15 11:33:06', 'component'),
(28, 13, 'SN1320260002', 'in_stock', NULL, NULL, '2026-01-15 11:33:06', '2026-01-15 11:33:06', 'component'),
(29, 14, 'SN1420260001', 'in_stock', NULL, NULL, '2026-01-15 11:36:30', '2026-01-15 11:36:30', 'component'),
(30, 14, 'SN1420260002', 'in_stock', NULL, NULL, '2026-01-15 11:36:30', '2026-01-15 11:36:30', 'component'),
(31, 15, 'SN1520260001', 'in_stock', NULL, NULL, '2026-01-15 11:37:27', '2026-01-15 11:37:27', 'component'),
(32, 15, 'SN1520260002', 'in_stock', NULL, NULL, '2026-01-15 11:37:27', '2026-01-15 11:37:27', 'component'),
(33, 16, 'SN1620260001', 'in_stock', NULL, NULL, '2026-01-15 11:39:43', '2026-01-15 11:39:43', 'component'),
(34, 16, 'SN1620260002', 'in_stock', NULL, NULL, '2026-01-15 11:39:43', '2026-01-15 11:39:43', 'component'),
(35, 17, 'SN1720260001', 'in_stock', NULL, NULL, '2026-01-15 11:40:40', '2026-01-15 11:40:40', 'component'),
(36, 17, 'SN1720260002', 'in_stock', NULL, NULL, '2026-01-15 11:40:40', '2026-01-15 11:40:40', 'component'),
(37, 18, 'SN1820260001', 'in_stock', NULL, NULL, '2026-01-15 11:41:54', '2026-01-15 11:41:54', 'component'),
(38, 18, 'SN1820260002', 'in_stock', NULL, NULL, '2026-01-15 11:41:54', '2026-01-15 11:41:54', 'component'),
(39, 18, 'SN1820260003', 'in_stock', NULL, NULL, '2026-01-15 11:41:54', '2026-01-15 11:41:54', 'component'),
(40, 19, 'SN1920260001', 'in_stock', NULL, NULL, '2026-01-15 11:42:53', '2026-01-15 11:42:53', 'component'),
(41, 19, 'SN1920260002', 'in_stock', NULL, NULL, '2026-01-15 11:42:53', '2026-01-15 11:42:53', 'component'),
(42, 20, 'SN2020260001', 'reserved', 169, NULL, '2026-01-15 11:44:19', '2026-01-16 15:07:27', 'component'),
(43, 20, 'SN2020260002', 'reserved', 175, NULL, '2026-01-15 11:44:19', '2026-01-17 15:11:17', 'component'),
(44, 21, 'SN2120260001', 'in_stock', NULL, NULL, '2026-01-15 11:46:18', '2026-01-15 11:46:18', 'component'),
(45, 21, 'SN2120260002', 'in_stock', NULL, NULL, '2026-01-15 11:46:18', '2026-01-15 11:46:18', 'component'),
(46, 22, 'SN2220260001', 'in_stock', NULL, NULL, '2026-01-15 11:47:28', '2026-01-15 11:47:28', 'component'),
(47, 22, 'SN2220260002', 'in_stock', NULL, NULL, '2026-01-15 11:47:28', '2026-01-15 11:47:28', 'component'),
(48, 23, 'SN2320260001', 'in_stock', NULL, NULL, '2026-01-15 11:48:27', '2026-01-15 11:48:27', 'component'),
(49, 23, 'SN2320260002', 'in_stock', NULL, NULL, '2026-01-15 11:48:27', '2026-01-15 11:48:27', 'component'),
(50, 24, 'SN2420260001', 'in_stock', NULL, NULL, '2026-01-15 11:49:36', '2026-01-15 11:49:36', 'component'),
(51, 24, 'SN2420260002', 'in_stock', NULL, NULL, '2026-01-15 11:49:36', '2026-01-15 11:49:36', 'component'),
(52, 25, 'SN2520260001', 'in_stock', NULL, NULL, '2026-01-15 11:50:51', '2026-01-15 11:50:51', 'component'),
(53, 25, 'SN2520260002', 'in_stock', NULL, NULL, '2026-01-15 11:50:51', '2026-01-15 11:50:51', 'component'),
(54, 26, 'SN2620260001', 'in_stock', NULL, NULL, '2026-01-15 11:51:51', '2026-01-15 11:51:51', 'component'),
(55, 26, 'SN2620260002', 'in_stock', NULL, NULL, '2026-01-15 11:51:51', '2026-01-15 11:51:51', 'component'),
(56, 27, 'SN2720260001', 'in_stock', NULL, NULL, '2026-01-15 11:54:48', '2026-01-15 11:54:48', 'component'),
(57, 27, 'SN2720260002', 'in_stock', NULL, NULL, '2026-01-15 11:54:48', '2026-01-15 11:54:48', 'component'),
(58, 28, 'SN2820260001', 'in_stock', NULL, NULL, '2026-01-15 11:54:48', '2026-01-15 11:54:48', 'component'),
(59, 28, 'SN2820260002', 'in_stock', NULL, NULL, '2026-01-15 11:54:48', '2026-01-15 11:54:48', 'component'),
(60, 29, 'SN2920260001', 'in_stock', NULL, NULL, '2026-01-15 11:54:48', '2026-01-15 11:54:48', 'component'),
(61, 29, 'SN2920260002', 'in_stock', NULL, NULL, '2026-01-15 11:54:48', '2026-01-15 11:54:48', 'component'),
(62, 30, 'SN3020260001', 'in_stock', NULL, NULL, '2026-01-15 11:56:58', '2026-01-15 11:56:58', 'component'),
(63, 30, 'SN3020260002', 'in_stock', NULL, NULL, '2026-01-15 11:56:58', '2026-01-15 11:56:58', 'component'),
(64, 31, 'SN3120260001', 'in_stock', NULL, NULL, '2026-01-15 11:58:13', '2026-01-15 11:58:13', 'component'),
(65, 31, 'SN3120260002', 'in_stock', NULL, NULL, '2026-01-15 11:58:13', '2026-01-15 11:58:13', 'component'),
(66, 32, 'SN3220260001', 'in_stock', NULL, NULL, '2026-01-15 11:59:07', '2026-01-15 11:59:07', 'component'),
(67, 32, 'SN3220260002', 'in_stock', NULL, NULL, '2026-01-15 11:59:07', '2026-01-15 11:59:07', 'component'),
(68, 33, 'SN3320260001', 'in_stock', NULL, NULL, '2026-01-15 12:00:20', '2026-01-15 12:00:20', 'component'),
(69, 33, 'SN3320260002', 'in_stock', NULL, NULL, '2026-01-15 12:00:20', '2026-01-15 12:00:20', 'component'),
(72, 35, 'SN3520260001', 'in_stock', NULL, NULL, '2026-01-15 12:01:41', '2026-01-15 12:01:41', 'component'),
(73, 35, 'SN3520260002', 'in_stock', NULL, NULL, '2026-01-15 12:01:41', '2026-01-15 12:01:41', 'component'),
(74, 36, 'SN3620260001', 'in_stock', NULL, NULL, '2026-01-15 12:03:37', '2026-01-15 12:03:37', 'component'),
(75, 36, 'SN3620260002', 'in_stock', NULL, NULL, '2026-01-15 12:03:37', '2026-01-15 12:03:37', 'component'),
(76, 37, 'SN3720260001', 'in_stock', NULL, NULL, '2026-01-15 12:04:55', '2026-01-15 12:04:55', 'component'),
(77, 37, 'SN3720260002', 'in_stock', NULL, NULL, '2026-01-15 12:04:55', '2026-01-15 12:04:55', 'component'),
(80, 39, 'SN3920260001', 'in_stock', NULL, NULL, '2026-01-15 12:07:43', '2026-01-15 12:07:43', 'component'),
(81, 39, 'SN3920260002', 'in_stock', NULL, NULL, '2026-01-15 12:07:43', '2026-01-15 12:07:43', 'component'),
(82, 40, 'SN4020260001', 'in_stock', NULL, NULL, '2026-01-15 12:08:47', '2026-01-15 12:08:47', 'component'),
(83, 40, 'SN4020260002', 'in_stock', NULL, NULL, '2026-01-15 12:08:47', '2026-01-15 12:08:47', 'component'),
(84, 41, 'SN4120260001', 'in_stock', NULL, NULL, '2026-01-15 12:10:01', '2026-01-15 12:10:01', 'component'),
(85, 41, 'SN4120260002', 'in_stock', NULL, NULL, '2026-01-15 12:10:01', '2026-01-15 12:10:01', 'component'),
(86, 42, 'SN4220260001', 'reserved', 168, NULL, '2026-01-15 12:12:47', '2026-01-16 15:05:04', 'component'),
(87, 42, 'SN4220260002', 'reserved', 181, NULL, '2026-01-15 12:12:47', '2026-01-18 03:57:30', 'component'),
(88, 43, 'SN4320260001', 'in_stock', NULL, NULL, '2026-01-15 12:13:55', '2026-01-15 12:13:55', 'component'),
(89, 43, 'SN4320260002', 'in_stock', NULL, NULL, '2026-01-15 12:13:55', '2026-01-15 12:13:55', 'component'),
(90, 44, 'SN4420260001', 'reserved', 177, NULL, '2026-01-15 12:14:48', '2026-01-17 15:20:29', 'component'),
(91, 44, 'SN4420260002', 'reserved', 178, NULL, '2026-01-15 12:14:48', '2026-01-17 15:22:17', 'component'),
(92, 45, 'SN4520260001', 'reserved', 174, NULL, '2026-01-15 12:15:59', '2026-01-17 15:01:45', 'component'),
(93, 45, 'SN4520260002', 'reserved', 184, NULL, '2026-01-15 12:15:59', '2026-01-18 04:05:10', 'component'),
(94, 46, 'SN4620260001', 'in_stock', NULL, NULL, '2026-01-15 12:17:06', '2026-01-15 12:17:06', 'component'),
(95, 46, 'SN4620260002', 'in_stock', NULL, NULL, '2026-01-15 12:17:06', '2026-01-15 12:17:06', 'component'),
(96, 47, 'SN4720260001', 'in_stock', NULL, NULL, '2026-01-15 12:18:59', '2026-01-15 12:18:59', 'component'),
(97, 47, 'SN4720260002', 'in_stock', NULL, NULL, '2026-01-15 12:18:59', '2026-01-15 12:18:59', 'component'),
(98, 48, 'SN4820260001', 'in_stock', NULL, NULL, '2026-01-15 12:19:59', '2026-01-15 12:19:59', 'component'),
(99, 48, 'SN4820260002', 'in_stock', NULL, NULL, '2026-01-15 12:19:59', '2026-01-15 12:19:59', 'component'),
(100, 49, 'SN4920260001', 'in_stock', NULL, NULL, '2026-01-15 12:20:52', '2026-01-15 12:20:52', 'component'),
(101, 49, 'SN4920260002', 'in_stock', NULL, NULL, '2026-01-15 12:20:52', '2026-01-15 12:20:52', 'component'),
(102, 50, 'SN5020260001', 'in_stock', NULL, NULL, '2026-01-15 12:21:52', '2026-01-15 12:21:52', 'component'),
(103, 50, 'SN5020260002', 'in_stock', NULL, NULL, '2026-01-15 12:21:52', '2026-01-15 12:21:52', 'component'),
(104, 51, 'SN5120260001', 'in_stock', NULL, NULL, '2026-01-15 12:24:27', '2026-01-15 12:24:27', 'component'),
(105, 51, 'SN5120260002', 'in_stock', NULL, NULL, '2026-01-15 12:24:27', '2026-01-15 12:24:27', 'component'),
(106, 52, 'SN5220260001', 'in_stock', NULL, NULL, '2026-01-15 12:25:07', '2026-01-15 12:25:07', 'component'),
(107, 52, 'SN5220260002', 'in_stock', NULL, NULL, '2026-01-15 12:25:07', '2026-01-15 12:25:07', 'component'),
(108, 53, 'SN5320260001', 'in_stock', NULL, NULL, '2026-01-15 12:25:48', '2026-01-15 12:25:48', 'component'),
(109, 53, 'SN5320260002', 'in_stock', NULL, NULL, '2026-01-15 12:25:48', '2026-01-15 12:25:48', 'component'),
(110, 54, 'SN5420260001', 'in_stock', NULL, NULL, '2026-01-15 12:26:42', '2026-01-15 12:26:42', 'component'),
(111, 54, 'SN5420260002', 'in_stock', NULL, NULL, '2026-01-15 12:26:42', '2026-01-15 12:26:42', 'component');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `variant_serials`
--
ALTER TABLE `variant_serials`
  ADD PRIMARY KEY (`serial_id`),
  ADD UNIQUE KEY `uk_variant_serial` (`variant_id`,`serial_number`),
  ADD KEY `idx_serial` (`serial_number`),
  ADD KEY `idx_variant_status` (`variant_id`,`status`),
  ADD KEY `idx_order_item` (`order_item_id`),
  ADD KEY `idx_warranty` (`warranty_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `variant_serials`
--
ALTER TABLE `variant_serials`
  MODIFY `serial_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=112;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `variant_serials`
--
ALTER TABLE `variant_serials`
  ADD CONSTRAINT `vs_fk_order_item` FOREIGN KEY (`order_item_id`) REFERENCES `order_items` (`order_item_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `vs_fk_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`variant_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `vs_fk_warranty` FOREIGN KEY (`warranty_id`) REFERENCES `warranties` (`warranty_id`) ON DELETE SET NULL;
COMMIT;



CREATE TABLE `bundle_items` (
  `bundle_item_id` int(11) NOT NULL,
  `bundle_variant_id` int(11) NOT NULL,
  `component_variant_id` int(11) NOT NULL,
  `quantity` int(11) DEFAULT 1,
  `display_order` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bundle_items`
--
ALTER TABLE `bundle_items`
  ADD PRIMARY KEY (`bundle_item_id`),
  ADD KEY `bundle_variant_id` (`bundle_variant_id`),
  ADD KEY `component_variant_id` (`component_variant_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bundle_items`
--
ALTER TABLE `bundle_items`
  MODIFY `bundle_item_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bundle_items`
--
ALTER TABLE `bundle_items`
  ADD CONSTRAINT `bundle_items_ibfk_1` FOREIGN KEY (`bundle_variant_id`) REFERENCES `product_variants` (`variant_id`),
  ADD CONSTRAINT `bundle_items_ibfk_2` FOREIGN KEY (`component_variant_id`) REFERENCES `product_variants` (`variant_id`);
COMMIT;
