-- ===================================================================
-- THÊM SẢN PHẨM CHO 3 DANH MỤC CON CỦA COOLING
-- ===================================================================

-- ===================================================================
-- AIR COOLER (Tản nhiệt khí) - Category ID: 47
-- ===================================================================

-- Thêm sản phẩm Air Cooler
INSERT INTO `products` (`product_id`, `category_id`, `product_name`, `slug`, `description`, `base_price`, `is_active`, `is_featured`, `view_count`, `rating_average`, `review_count`, `created_at`, `updated_at`, `img_path`) VALUES
(370, 47, 'Noctua NH-D15 chromax.black', 'noctua-nh-d15-chromax-black', 'Tản nhiệt khí dual tower cao cấp 140mm', 2690000.00, 1, 1, 0, 0.00, 0, NOW(), NOW(), ''),
(371, 47, 'be quiet! Dark Rock Pro 4', 'be-quiet-dark-rock-pro-4', 'Tản nhiệt khí dual tower Silent Wings PWM 135mm', 2390000.00, 1, 1, 0, 0.00, 0, NOW(), NOW(), ''),
(372, 47, 'Cooler Master Hyper 212 Black Edition', 'cooler-master-hyper-212-black', 'Tản nhiệt khí tower đơn 120mm', 990000.00, 1, 0, 0, 0.00, 0, NOW(), NOW(), ''),
(373, 47, 'Deepcool AK400', 'deepcool-ak400', 'Tản nhiệt khí tower đơn 120mm giá rẻ', 690000.00, 1, 0, 0, 0.00, 0, NOW(), NOW(), ''),
(374, 47, 'Thermalright Peerless Assassin 120 SE', 'thermalright-peerless-assassin-120', 'Tản nhiệt khí dual tower 120mm hiệu năng cao', 890000.00, 1, 1, 0, 0.00, 0, NOW(), NOW(), ''),
(375, 47, 'Arctic Freezer 34 eSports DUO', 'arctic-freezer-34-esports-duo', 'Tản nhiệt khí dual fan 120mm', 1190000.00, 1, 0, 0, 0.00, 0, NOW(), NOW(), '');

-- Thêm biến thể cho Air Cooler
INSERT INTO `product_variants` (`variant_id`, `product_id`, `sku`, `variant_name`, `price`, `stock_quantity`, `is_active`, `is_default`, `created_at`, `updated_at`) VALUES
-- Noctua NH-D15 chromax.black
(570, 370, 'NOCT-NHD15-CHROMAX', 'Standard', 2690000.00, 20, 1, 1, NOW(), NOW()),
-- be quiet! Dark Rock Pro 4
(571, 371, 'BQ-DRP4-STD', 'Standard', 2390000.00, 15, 1, 1, NOW(), NOW()),
-- Cooler Master Hyper 212
(572, 372, 'CM-H212-BLK', 'Black Edition', 990000.00, 40, 1, 1, NOW(), NOW()),
-- Deepcool AK400
(573, 373, 'DEEP-AK400-STD', 'Standard', 690000.00, 50, 1, 1, NOW(), NOW()),
-- Thermalright Peerless Assassin
(574, 374, 'THER-PA120-SE', 'SE Edition', 890000.00, 35, 1, 1, NOW(), NOW()),
-- Arctic Freezer 34
(575, 375, 'ARC-F34-DUO', 'eSports DUO', 1190000.00, 30, 1, 1, NOW(), NOW());

-- Thêm thuộc tính cho Air Cooler variants
-- Noctua NH-D15 chromax.black (570)
INSERT INTO `variant_attributes` (`variant_id`, `attribute_value_id`) 
SELECT 570, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 77 AND av.value_name = 'Noctua'
UNION ALL SELECT 570, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 78 AND av.value_name = 'Tower đôi'
UNION ALL SELECT 570, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 79 AND av.value_name = '6 ống nhiệt'
UNION ALL SELECT 570, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 80 AND av.value_name = 'Universal'
UNION ALL SELECT 570, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 81 AND av.value_name = 'Không đèn';

-- be quiet! Dark Rock Pro 4 (571)
INSERT INTO `variant_attributes` (`variant_id`, `attribute_value_id`) 
SELECT 571, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 77 AND av.value_name = 'be quiet!'
UNION ALL SELECT 571, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 78 AND av.value_name = 'Tower đôi'
UNION ALL SELECT 571, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 79 AND av.value_name = '7+ ống nhiệt'
UNION ALL SELECT 571, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 80 AND av.value_name = 'Universal'
UNION ALL SELECT 571, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 81 AND av.value_name = 'Không đèn';

-- Cooler Master Hyper 212 (572)
INSERT INTO `variant_attributes` (`variant_id`, `attribute_value_id`) 
SELECT 572, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 77 AND av.value_name = 'Cooler Master'
UNION ALL SELECT 572, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 78 AND av.value_name = 'Tower đơn'
UNION ALL SELECT 572, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 79 AND av.value_name = '4 ống nhiệt'
UNION ALL SELECT 572, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 80 AND av.value_name = 'Universal'
UNION ALL SELECT 572, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 81 AND av.value_name = 'Không đèn';

-- Deepcool AK400 (573)
INSERT INTO `variant_attributes` (`variant_id`, `attribute_value_id`) 
SELECT 573, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 77 AND av.value_name = 'Deepcool'
UNION ALL SELECT 573, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 78 AND av.value_name = 'Tower đơn'
UNION ALL SELECT 573, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 79 AND av.value_name = '4 ống nhiệt'
UNION ALL SELECT 573, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 80 AND av.value_name = 'Universal'
UNION ALL SELECT 573, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 81 AND av.value_name = 'Không đèn';

-- Thermalright Peerless Assassin (574)
INSERT INTO `variant_attributes` (`variant_id`, `attribute_value_id`) 
SELECT 574, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 77 AND av.value_name = 'Thermalright'
UNION ALL SELECT 574, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 78 AND av.value_name = 'Tower đôi'
UNION ALL SELECT 574, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 79 AND av.value_name = '6 ống nhiệt'
UNION ALL SELECT 574, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 80 AND av.value_name = 'Universal'
UNION ALL SELECT 574, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 81 AND av.value_name = 'RGB ARGB';

-- Arctic Freezer 34 (575)
INSERT INTO `variant_attributes` (`variant_id`, `attribute_value_id`) 
SELECT 575, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 77 AND av.value_name = 'Arctic'
UNION ALL SELECT 575, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 78 AND av.value_name = 'Tower đơn'
UNION ALL SELECT 575, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 79 AND av.value_name = '4 ống nhiệt'
UNION ALL SELECT 575, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 80 AND av.value_name = 'Universal'
UNION ALL SELECT 575, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 81 AND av.value_name = 'Không đèn';

-- ===================================================================
-- AIO COOLER (Tản nhiệt nước AIO) - Category ID: 48
-- ===================================================================

-- Thêm sản phẩm AIO Cooler
INSERT INTO `products` (`product_id`, `category_id`, `product_name`, `slug`, `description`, `base_price`, `is_active`, `is_featured`, `view_count`, `rating_average`, `review_count`, `created_at`, `updated_at`, `img_path`) VALUES
(380, 48, 'Corsair iCUE H150i ELITE LCD XT', 'corsair-h150i-elite-lcd-xt', 'Tản nước AIO 360mm LCD Display RGB', 5890000.00, 1, 1, 0, 0.00, 0, NOW(), NOW(), ''),
(381, 48, 'NZXT Kraken Z73 RGB', 'nzxt-kraken-z73-rgb', 'Tản nước AIO 360mm LCD màn hình 2.36 inch', 6490000.00, 1, 1, 0, 0.00, 0, NOW(), NOW(), ''),
(382, 48, 'MSI MAG CORELIQUID 360R V2', 'msi-mag-coreliquid-360r-v2', 'Tản nước AIO 360mm ARGB', 2990000.00, 1, 1, 0, 0.00, 0, NOW(), NOW(), ''),
(383, 48, 'Cooler Master MasterLiquid ML240L V2', 'cooler-master-ml240l-v2', 'Tản nước AIO 240mm RGB giá rẻ', 1690000.00, 1, 0, 0, 0.00, 0, NOW(), NOW(), ''),
(384, 48, 'Deepcool LT520', 'deepcool-lt520', 'Tản nước AIO 240mm ARGB', 1990000.00, 1, 0, 0, 0.00, 0, NOW(), NOW(), ''),
(385, 48, 'ASUS ROG RYUJIN II 360', 'asus-rog-ryujin-ii-360', 'Tản nước AIO 360mm LCD Asetek Gen7 pump', 7990000.00, 1, 1, 0, 0.00, 0, NOW(), NOW(), '');

-- Thêm biến thể cho AIO Cooler
INSERT INTO `product_variants` (`variant_id`, `product_id`, `sku`, `variant_name`, `price`, `stock_quantity`, `is_active`, `is_default`, `created_at`, `updated_at`) VALUES
-- Corsair iCUE H150i
(580, 380, 'CORS-H150i-ELITE-LCD', 'Elite LCD XT', 5890000.00, 15, 1, 1, NOW(), NOW()),
-- NZXT Kraken Z73
(581, 381, 'NZXT-Z73-RGB', 'RGB', 6490000.00, 12, 1, 1, NOW(), NOW()),
-- MSI MAG CORELIQUID
(582, 382, 'MSI-CL360R-V2', 'V2', 2990000.00, 25, 1, 1, NOW(), NOW()),
-- Cooler Master ML240L
(583, 383, 'CM-ML240L-V2', 'V2 RGB', 1690000.00, 40, 1, 1, NOW(), NOW()),
-- Deepcool LT520
(584, 384, 'DEEP-LT520-240', '240mm', 1990000.00, 30, 1, 1, NOW(), NOW()),
-- ASUS ROG RYUJIN II
(585, 385, 'ASUS-RYUJIN2-360', '360mm', 7990000.00, 8, 1, 1, NOW(), NOW());

-- Thêm thuộc tính cho AIO Cooler variants
-- Corsair iCUE H150i (580)
INSERT INTO `variant_attributes` (`variant_id`, `attribute_value_id`) 
SELECT 580, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 82 AND av.value_name = 'Corsair'
UNION ALL SELECT 580, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 83 AND av.value_name = '360mm'
UNION ALL SELECT 580, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 84 AND av.value_name = '3 quạt'
UNION ALL SELECT 580, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 85 AND av.value_name = 'Universal'
UNION ALL SELECT 580, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 86 AND av.value_name = 'LCD Display';

-- NZXT Kraken Z73 (581)
INSERT INTO `variant_attributes` (`variant_id`, `attribute_value_id`) 
SELECT 581, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 82 AND av.value_name = 'NZXT'
UNION ALL SELECT 581, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 83 AND av.value_name = '360mm'
UNION ALL SELECT 581, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 84 AND av.value_name = '3 quạt'
UNION ALL SELECT 581, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 85 AND av.value_name = 'Universal'
UNION ALL SELECT 581, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 86 AND av.value_name = 'LCD Display';

-- MSI MAG CORELIQUID (582)
INSERT INTO `variant_attributes` (`variant_id`, `attribute_value_id`) 
SELECT 582, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 82 AND av.value_name = 'MSI'
UNION ALL SELECT 582, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 83 AND av.value_name = '360mm'
UNION ALL SELECT 582, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 84 AND av.value_name = '3 quạt'
UNION ALL SELECT 582, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 85 AND av.value_name = 'Universal'
UNION ALL SELECT 582, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 86 AND av.value_name = 'RGB ARGB';

-- Cooler Master ML240L (583)
INSERT INTO `variant_attributes` (`variant_id`, `attribute_value_id`) 
SELECT 583, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 82 AND av.value_name = 'Cooler Master'
UNION ALL SELECT 583, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 83 AND av.value_name = '240mm'
UNION ALL SELECT 583, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 84 AND av.value_name = '2 quạt'
UNION ALL SELECT 583, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 85 AND av.value_name = 'Universal'
UNION ALL SELECT 583, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 86 AND av.value_name = 'RGB';

-- Deepcool LT520 (584)
INSERT INTO `variant_attributes` (`variant_id`, `attribute_value_id`) 
SELECT 584, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 82 AND av.value_name = 'Deepcool'
UNION ALL SELECT 584, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 83 AND av.value_name = '240mm'
UNION ALL SELECT 584, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 84 AND av.value_name = '2 quạt'
UNION ALL SELECT 584, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 85 AND av.value_name = 'Universal'
UNION ALL SELECT 584, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 86 AND av.value_name = 'RGB ARGB';

-- ASUS ROG RYUJIN II (585)
INSERT INTO `variant_attributes` (`variant_id`, `attribute_value_id`) 
SELECT 585, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 82 AND av.value_name = 'ASUS'
UNION ALL SELECT 585, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 83 AND av.value_name = '360mm'
UNION ALL SELECT 585, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 84 AND av.value_name = '3 quạt'
UNION ALL SELECT 585, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 85 AND av.value_name = 'Universal'
UNION ALL SELECT 585, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 86 AND av.value_name = 'LCD Display';

-- ===================================================================
-- CUSTOM WATER (Tản nước custom) - Category ID: 49
-- ===================================================================

-- Thêm sản phẩm Custom Water
INSERT INTO `products` (`product_id`, `category_id`, `product_name`, `slug`, `description`, `base_price`, `is_active`, `is_featured`, `view_count`, `rating_average`, `review_count`, `created_at`, `updated_at`, `img_path`) VALUES
(390, 49, 'EK-Quantum Velocity² D-RGB - AMD Nickel + Plexi', 'ek-quantum-velocity2-amd', 'Water Block CPU AMD AM5/AM4 RGB', 3290000.00, 1, 1, 0, 0.00, 0, NOW(), NOW(), ''),
(391, 49, 'Corsair Hydro X Series XC7 RGB', 'corsair-hydro-x-xc7-rgb', 'Water Block CPU Intel LGA1700/1200 RGB', 3590000.00, 1, 1, 0, 0.00, 0, NOW(), NOW(), ''),
(392, 49, 'Bitspower Touchaqua Summit MS CPU Block', 'bitspower-summit-ms', 'Water Block CPU Universal Digital RGB', 2890000.00, 1, 0, 0, 0.00, 0, NOW(), NOW(), ''),
(393, 49, 'EK-CoolStream XE 360 Radiator', 'ek-coolstream-xe-360', 'Radiator 360mm độ dày 60mm', 3890000.00, 1, 1, 0, 0.00, 0, NOW(), NOW(), ''),
(394, 49, 'Alphacool NexXxoS ST30 360mm Radiator', 'alphacool-st30-360', 'Radiator 360mm độ dày 30mm đồng nguyên chất', 2690000.00, 1, 0, 0, 0.00, 0, NOW(), NOW(), ''),
(395, 49, 'Barrow SPB17-V2 Pump/Reservoir Combo', 'barrow-spb17-v2-combo', 'Bộ pump reservoir combo RGB 170mm', 1890000.00, 1, 0, 0, 0.00, 0, NOW(), NOW(), '');

-- Thêm biến thể cho Custom Water
INSERT INTO `product_variants` (`variant_id`, `product_id`, `sku`, `variant_name`, `price`, `stock_quantity`, `is_active`, `is_default`, `created_at`, `updated_at`) VALUES
-- EK-Quantum Velocity²
(590, 390, 'EK-VEL2-AMD-NP', 'AMD Nickel + Plexi', 3290000.00, 10, 1, 1, NOW(), NOW()),
-- Corsair Hydro X XC7
(591, 391, 'CORS-XC7-RGB', 'RGB', 3590000.00, 12, 1, 1, NOW(), NOW()),
-- Bitspower Summit MS
(592, 392, 'BP-SUMMIT-MS', 'Digital RGB', 2890000.00, 15, 1, 1, NOW(), NOW()),
-- EK-CoolStream XE 360
(593, 393, 'EK-CS-XE360', 'XE 360mm', 3890000.00, 8, 1, 1, NOW(), NOW()),
-- Alphacool ST30 360
(594, 394, 'ALPHA-ST30-360', 'ST30 360mm', 2690000.00, 12, 1, 1, NOW(), NOW()),
-- Barrow SPB17-V2
(595, 395, 'BARROW-SPB17-V2', 'RGB Combo', 1890000.00, 20, 1, 1, NOW(), NOW());

-- Thêm thuộc tính cho Custom Water variants
-- EK-Quantum Velocity² AMD (590)
INSERT INTO `variant_attributes` (`variant_id`, `attribute_value_id`) 
SELECT 590, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 87 AND av.value_name = 'EK Water Blocks'
UNION ALL SELECT 590, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 88 AND av.value_name = 'Water Block CPU'
UNION ALL SELECT 590, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 89 AND av.value_name = '120mm'
UNION ALL SELECT 590, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 90 AND av.value_name = 'Đồng (Copper)'
UNION ALL SELECT 590, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 91 AND av.value_name = 'RGB ARGB';

-- Corsair Hydro X XC7 (591)
INSERT INTO `variant_attributes` (`variant_id`, `attribute_value_id`) 
SELECT 591, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 87 AND av.value_name = 'Corsair'
UNION ALL SELECT 591, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 88 AND av.value_name = 'Water Block CPU'
UNION ALL SELECT 591, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 89 AND av.value_name = '120mm'
UNION ALL SELECT 591, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 90 AND av.value_name = 'Đồng (Copper)'
UNION ALL SELECT 591, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 91 AND av.value_name = 'RGB ARGB';

-- Bitspower Summit MS (592)
INSERT INTO `variant_attributes` (`variant_id`, `attribute_value_id`) 
SELECT 592, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 87 AND av.value_name = 'Bitspower'
UNION ALL SELECT 592, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 88 AND av.value_name = 'Water Block CPU'
UNION ALL SELECT 592, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 89 AND av.value_name = '120mm'
UNION ALL SELECT 592, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 90 AND av.value_name = 'Đồng (Copper)'
UNION ALL SELECT 592, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 91 AND av.value_name = 'RGB ARGB';

-- EK-CoolStream XE 360 (593)
INSERT INTO `variant_attributes` (`variant_id`, `attribute_value_id`) 
SELECT 593, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 87 AND av.value_name = 'EK Water Blocks'
UNION ALL SELECT 593, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 88 AND av.value_name = 'Radiator'
UNION ALL SELECT 593, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 89 AND av.value_name = '360mm'
UNION ALL SELECT 593, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 90 AND av.value_name = 'Đồng (Copper)'
UNION ALL SELECT 593, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 91 AND av.value_name = 'Không đèn';

-- Alphacool ST30 360 (594)
INSERT INTO `variant_attributes` (`variant_id`, `attribute_value_id`) 
SELECT 594, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 87 AND av.value_name = 'Alphacool'
UNION ALL SELECT 594, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 88 AND av.value_name = 'Radiator'
UNION ALL SELECT 594, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 89 AND av.value_name = '360mm'
UNION ALL SELECT 594, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 90 AND av.value_name = 'Đồng (Copper)'
UNION ALL SELECT 594, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 91 AND av.value_name = 'Không đèn';

-- Barrow SPB17-V2 (595)
INSERT INTO `variant_attributes` (`variant_id`, `attribute_value_id`) 
SELECT 595, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 87 AND av.value_name = 'Barrow'
UNION ALL SELECT 595, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 88 AND av.value_name = 'Pump'
UNION ALL SELECT 595, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 89 AND av.value_name = '120mm'
UNION ALL SELECT 595, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 90 AND av.value_name = 'Acrylic'
UNION ALL SELECT 595, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 91 AND av.value_name = 'RGB ARGB';

-- ===================================================================
-- HOÀN TẤT
-- ===================================================================

-- Tổng kết:
-- - Air Cooler (47): 6 sản phẩm, 6 variants (570-575)
-- - AIO Cooler (48): 6 sản phẩm, 6 variants (580-585)
-- - Custom Water (49): 6 sản phẩm, 6 variants (590-595)
-- - Tổng cộng: 18 sản phẩm mới với đầy đủ thuộc tính
