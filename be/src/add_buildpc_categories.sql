-- Thêm categories còn thiếu cho Build PC

-- Thêm categories mới
INSERT INTO `categories` (`category_id`, `category_name`, `slug`, `description`, `parent_category_id`, `image_url`, `icon`, `is_active`, `display_order`, `created_at`, `updated_at`) VALUES
(40, 'Monitor', 'monitor', 'Màn hình máy tính - Gaming monitor, màn hình văn phòng', NULL, '', NULL, 1, 40, NOW(), NOW()),
(41, 'Keyboard', 'keyboard', 'Bàn phím - Bàn phím cơ, bàn phím gaming', NULL, '', NULL, 1, 41, NOW(), NOW()),
(42, 'Mouse', 'mouse', 'Chuột máy tính - Chuột gaming, chuột văn phòng', NULL, '', NULL, 1, 42, NOW(), NOW()),
(43, 'Headphone', 'headphone', 'Tai nghe - Tai nghe gaming, tai nghe văn phòng', NULL, '', NULL, 1, 43, NOW(), NOW()),
(44, 'Speaker', 'speaker', 'Loa máy tính - Loa 2.0, 2.1, 5.1', NULL, '', NULL, 1, 44, NOW(), NOW()),
(45, 'Gaming Chair', 'gaming-chair', 'Ghế gaming - Ghế công thái học, ghế gaming cao cấp', NULL, '', NULL, 1, 45, NOW(), NOW()),
(46, 'Case Fan', 'case-fan', 'Quạt case - Quạt tản nhiệt RGB, quạt PWM', NULL, '', NULL, 1, 46, NOW(), NOW()),
(47, 'Air Cooler', 'air-cooler', 'Tản nhiệt khí - Tản nhiệt CPU tower, dual tower', 8, '', NULL, 1, 47, NOW(), NOW()),
(48, 'AIO Cooler', 'aio-cooler', 'Tản nhiệt nước AIO - Tản nước 240mm, 360mm', 8, '', NULL, 1, 48, NOW(), NOW()),
(49, 'Custom Water', 'custom-water', 'Tản nhiệt nước custom - Bộ kit tản nước custom loop', 8, '', NULL, 1, 49, NOW(), NOW())
ON DUPLICATE KEY UPDATE 
  `category_name` = VALUES(`category_name`),
  `description` = VALUES(`description`),
  `updated_at` = NOW();

-- Thêm sample products cho Monitor
INSERT INTO `products` (`product_id`, `category_id`, `product_name`, `slug`, `description`, `base_price`, `img_path`, `is_active`, `is_featured`, `created_at`, `updated_at`) VALUES
(300, 40, 'LG UltraGear 27GN800-B 27" QHD 144Hz', 'lg-27gn800-qhd-144hz', 'Màn hình gaming IPS 27 inch QHD 144Hz G-Sync Compatible', 8490000, '', 1, 1, NOW(), NOW()),
(301, 40, 'ASUS TUF VG27AQ 27" WQHD 165Hz', 'asus-tuf-vg27aq-wqhd-165hz', 'Màn hình gaming IPS 27 inch WQHD 165Hz G-Sync', 9990000, '', 1, 1, NOW(), NOW()),
(302, 40, 'Samsung Odyssey G5 32" QHD 144Hz', 'samsung-odyssey-g5-32-qhd-144hz', 'Màn hình gaming cong VA 32 inch QHD 144Hz', 7990000, '', 1, 0, NOW(), NOW())
ON DUPLICATE KEY UPDATE `updated_at` = NOW();

-- Variants cho Monitor
INSERT INTO `product_variants` (`variant_id`, `product_id`, `sku`, `variant_name`, `price`, `stock_quantity`, `is_active`, `is_default`, `created_at`, `updated_at`) VALUES
(500, 300, 'LG-27GN800-STD', 'Standard', 8490000, 25, 1, 1, NOW(), NOW()),
(501, 301, 'ASUS-VG27AQ-STD', 'Standard', 9990000, 18, 1, 1, NOW(), NOW()),
(502, 302, 'SAM-G5-32-STD', 'Standard', 7990000, 30, 1, 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE `updated_at` = NOW();

-- Thêm sample products cho Keyboard
INSERT INTO `products` (`product_id`, `category_id`, `product_name`, `slug`, `description`, `base_price`, `img_path`, `is_active`, `is_featured`, `created_at`, `updated_at`) VALUES
(310, 41, 'Logitech G Pro X Mechanical Gaming Keyboard', 'logitech-g-pro-x-mechanical', 'Bàn phím cơ gaming với switch GX Blue', 3290000, '', 1, 1, NOW(), NOW()),
(311, 41, 'Corsair K70 RGB MK.2 Cherry MX Red', 'corsair-k70-rgb-mk2-red', 'Bàn phím cơ full-size RGB Cherry MX Red', 3890000, '', 1, 1, NOW(), NOW()),
(312, 41, 'Keychron K2 V2 Wireless Mechanical', 'keychron-k2-v2-wireless', 'Bàn phím cơ 75% không dây Gateron Brown', 2190000, '', 1, 0, NOW(), NOW())
ON DUPLICATE KEY UPDATE `updated_at` = NOW();

-- Variants cho Keyboard
INSERT INTO `product_variants` (`variant_id`, `product_id`, `sku`, `variant_name`, `price`, `stock_quantity`, `is_active`, `is_default`, `created_at`, `updated_at`) VALUES
(510, 310, 'LOGI-GPROX-STD', 'GX Blue Switch', 3290000, 40, 1, 1, NOW(), NOW()),
(511, 311, 'CORS-K70-RED', 'Cherry MX Red', 3890000, 25, 1, 1, NOW(), NOW()),
(512, 312, 'KEY-K2-BROWN', 'Gateron Brown', 2190000, 50, 1, 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE `updated_at` = NOW();

-- Thêm sample products cho Mouse
INSERT INTO `products` (`product_id`, `category_id`, `product_name`, `slug`, `description`, `base_price`, `img_path`, `is_active`, `is_featured`, `created_at`, `updated_at`) VALUES
(320, 42, 'Logitech G304 Lightspeed Wireless', 'logitech-g304-lightspeed', 'Chuột gaming không dây HERO 12K DPI', 990000, '', 1, 1, NOW(), NOW()),
(321, 42, 'Razer Viper Ultimate Wireless', 'razer-viper-ultimate-wireless', 'Chuột gaming không dây Focus+ 20K DPI', 2990000, '', 1, 1, NOW(), NOW()),
(322, 42, 'SteelSeries Rival 3 Wireless', 'steelseries-rival-3-wireless', 'Chuột gaming không dây TrueMove Air 18K DPI', 1490000, '', 1, 0, NOW(), NOW())
ON DUPLICATE KEY UPDATE `updated_at` = NOW();

-- Variants cho Mouse
INSERT INTO `product_variants` (`variant_id`, `product_id`, `sku`, `variant_name`, `price`, `stock_quantity`, `is_active`, `is_default`, `created_at`, `updated_at`) VALUES
(520, 320, 'LOGI-G304-BLK', 'Black', 990000, 60, 1, 1, NOW(), NOW()),
(521, 321, 'RAZER-VIPER-ULT', 'Ultimate', 2990000, 30, 1, 1, NOW(), NOW()),
(522, 322, 'SS-RIVAL3-WL', 'Wireless', 1490000, 45, 1, 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE `updated_at` = NOW();

-- Thêm sample products cho Headphone
INSERT INTO `products` (`product_id`, `category_id`, `product_name`, `slug`, `description`, `base_price`, `img_path`, `is_active`, `is_featured`, `created_at`, `updated_at`) VALUES
(330, 43, 'HyperX Cloud II Gaming Headset', 'hyperx-cloud-ii-gaming', 'Tai nghe gaming 7.1 surround sound', 2390000, '', 1, 1, NOW(), NOW()),
(331, 43, 'Razer BlackShark V2 Pro Wireless', 'razer-blackshark-v2-pro', 'Tai nghe gaming không dây THX Spatial Audio', 3990000, '', 1, 1, NOW(), NOW()),
(332, 43, 'SteelSeries Arctis 7 Wireless', 'steelseries-arctis-7-wireless', 'Tai nghe gaming không dây DTS Headphone:X v2.0', 3290000, '', 1, 0, NOW(), NOW())
ON DUPLICATE KEY UPDATE `updated_at` = NOW();

-- Variants cho Headphone
INSERT INTO `product_variants` (`variant_id`, `product_id`, `sku`, `variant_name`, `price`, `stock_quantity`, `is_active`, `is_default`, `created_at`, `updated_at`) VALUES
(530, 330, 'HX-CLOUD2-RED', 'Red', 2390000, 35, 1, 1, NOW(), NOW()),
(531, 331, 'RAZER-BS-V2-PRO', 'Pro', 3990000, 20, 1, 1, NOW(), NOW()),
(532, 332, 'SS-ARCTIS7-BLK', 'Black', 3290000, 28, 1, 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE `updated_at` = NOW();

-- Thêm sample products cho Speaker
INSERT INTO `products` (`product_id`, `category_id`, `product_name`, `slug`, `description`, `base_price`, `img_path`, `is_active`, `is_featured`, `created_at`, `updated_at`) VALUES
(340, 44, 'Logitech Z906 5.1 Surround Sound', 'logitech-z906-51-surround', 'Loa 5.1 THX certified 500W RMS', 6590000, '', 1, 1, NOW(), NOW()),
(341, 44, 'Creative Pebble V3 2.0', 'creative-pebble-v3-20', 'Loa 2.0 USB-C RGB 8W RMS', 690000, '', 1, 0, NOW(), NOW()),
(342, 44, 'Edifier R1280T 2.0 Bookshelf', 'edifier-r1280t-20-bookshelf', 'Loa bookshelf 2.0 42W RMS', 1990000, '', 1, 0, NOW(), NOW())
ON DUPLICATE KEY UPDATE `updated_at` = NOW();

-- Variants cho Speaker
INSERT INTO `product_variants` (`variant_id`, `product_id`, `sku`, `variant_name`, `price`, `stock_quantity`, `is_active`, `is_default`, `created_at`, `updated_at`) VALUES
(540, 340, 'LOGI-Z906-51', '5.1 System', 6590000, 15, 1, 1, NOW(), NOW()),
(541, 341, 'CREA-PEB-V3', 'RGB', 690000, 80, 1, 1, NOW(), NOW()),
(542, 342, 'EDI-R1280T-BLK', 'Black', 1990000, 50, 1, 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE `updated_at` = NOW();

-- Thêm sample products cho Gaming Chair
INSERT INTO `products` (`product_id`, `category_id`, `product_name`, `slug`, `description`, `base_price`, `img_path`, `is_active`, `is_featured`, `created_at`, `updated_at`) VALUES
(350, 45, 'Secretlab TITAN Evo 2022', 'secretlab-titan-evo-2022', 'Ghế gaming cao cấp NEO Hybrid Leatherette', 13490000, '', 1, 1, NOW(), NOW()),
(351, 45, 'Herman Miller X Logitech G Embody', 'herman-miller-embody-gaming', 'Ghế gaming công thái học cao cấp', 37990000, '', 1, 1, NOW(), NOW()),
(352, 45, 'Razer Iskur Gaming Chair', 'razer-iskur-gaming-chair', 'Ghế gaming hỗ trợ lưng tích hợp', 8990000, '', 1, 0, NOW(), NOW())
ON DUPLICATE KEY UPDATE `updated_at` = NOW();

-- Variants cho Gaming Chair
INSERT INTO `product_variants` (`variant_id`, `product_id`, `sku`, `variant_name`, `price`, `stock_quantity`, `is_active`, `is_default`, `created_at`, `updated_at`) VALUES
(550, 350, 'SEC-TITAN-2022-M', 'Medium', 13490000, 10, 1, 1, NOW(), NOW()),
(551, 351, 'HM-EMBODY-GM', 'Gaming Edition', 37990000, 5, 1, 1, NOW(), NOW()),
(552, 352, 'RAZER-ISKUR-BLK', 'Black', 8990000, 15, 1, 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE `updated_at` = NOW();

-- Thêm sample products cho Case Fan
INSERT INTO `products` (`product_id`, `category_id`, `product_name`, `slug`, `description`, `base_price`, `img_path`, `is_active`, `is_featured`, `created_at`, `updated_at`) VALUES
(360, 46, 'Lian Li UNI FAN SL120 V2 3-Pack', 'lianli-uni-fan-sl120-v2-3pack', 'Bộ 3 quạt 120mm ARGB modular', 2290000, '', 1, 1, NOW(), NOW()),
(361, 46, 'Corsair iCUE SP120 RGB ELITE 3-Pack', 'corsair-sp120-rgb-elite-3pack', 'Bộ 3 quạt 120mm RGB PWM', 1690000, '', 1, 0, NOW(), NOW()),
(362, 46, 'Noctua NF-A12x25 PWM', 'noctua-nf-a12x25-pwm', 'Quạt 120mm PWM cao cấp', 790000, '', 1, 0, NOW(), NOW())
ON DUPLICATE KEY UPDATE `updated_at` = NOW();

-- Variants cho Case Fan
INSERT INTO `product_variants` (`variant_id`, `product_id`, `sku`, `variant_name`, `price`, `stock_quantity`, `is_active`, `is_default`, `created_at`, `updated_at`) VALUES
(560, 360, 'LL-UNIFAN-SL120-3P', '3-Pack', 2290000, 40, 1, 1, NOW(), NOW()),
(561, 361, 'CORS-SP120-ELITE-3P', '3-Pack', 1690000, 50, 1, 1, NOW(), NOW()),
(562, 362, 'NOCT-NF-A12-SGL', 'Single', 790000, 100, 1, 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE `updated_at` = NOW();

-- Cập nhật CATEGORY_MAP trong BuildPC.jsx cần các ID:
-- monitor: 40, keyboard: 41, mouse: 42, headphone: 43, speaker: 44
-- gamingChair: 45, caseFan: 46, airCooler: 47, aioCooler: 48, customWater: 49

COMMIT;
