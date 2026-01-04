
-- ============================================
-- 1. INSERT ATTRIBUTES (with explicit IDs)
-- ============================================

-- Attributes cho CPU (Category 1)
INSERT INTO attributes (attribute_id, attribute_name, display_order, is_active) VALUES
(100, 'Thương hiệu CPU', 1, 1),
(101, 'Socket CPU', 2, 1),
(102, 'Số nhân', 3, 1),
(103, 'Số luồng', 4, 1),
(104, 'Tốc độ xung nhịp', 5, 1);

-- Attributes cho VGA (Category 2)
INSERT INTO attributes (attribute_id, attribute_name, display_order, is_active) VALUES
(105, 'Thương hiệu GPU', 10, 1),
(106, 'Bộ nhớ VGA', 11, 1),
(107, 'Series GPU', 12, 1);

-- Attributes cho SSD (Category 4)
INSERT INTO attributes (attribute_id, attribute_name, display_order, is_active) VALUES
(108, 'Dung lượng SSD', 20, 1),
(109, 'Chuẩn kết nối', 21, 1),
(110, 'Tốc độ đọc', 22, 1);

-- Attributes cho RAM (Category 35)
INSERT INTO attributes (attribute_id, attribute_name, display_order, is_active) VALUES
(111, 'Dung lượng RAM', 30, 1),
(112, 'Bus RAM', 31, 1),
(113, 'Loại RAM', 32, 1);

-- Attributes cho Mainboard (Category 5)
INSERT INTO attributes (attribute_id, attribute_name, display_order, is_active) VALUES
(114, 'Socket Mainboard', 40, 1),
(115, 'Chipset', 41, 1),
(116, 'Form Factor', 42, 1);

-- ============================================
-- 2. INSERT ATTRIBUTE VALUES (with explicit IDs)
-- ============================================

-- Values cho "Thương hiệu CPU" (attribute_id = 100)
INSERT INTO attribute_values (attribute_value_id, attribute_id, value_name, display_order, is_active) VALUES
(400, 100, 'Intel', 1, 1),
(401, 100, 'AMD', 2, 1);

-- Values cho "Socket CPU" (attribute_id = 101)
INSERT INTO attribute_values (attribute_value_id, attribute_id, value_name, display_order, is_active) VALUES
(402, 101, 'LGA1200', 1, 1),
(403, 101, 'LGA1700', 2, 1),
(404, 101, 'AM4', 3, 1),
(405, 101, 'AM5', 4, 1);

-- Values cho "Số nhân" (attribute_id = 102)
INSERT INTO attribute_values (attribute_value_id, attribute_id, value_name, display_order, is_active) VALUES
(406, 102, '4 nhân', 1, 1),
(407, 102, '6 nhân', 2, 1),
(408, 102, '8 nhân', 3, 1),
(409, 102, '12 nhân', 4, 1),
(410, 102, '16 nhân', 5, 1);

-- Values cho "Số luồng" (attribute_id = 103)
INSERT INTO attribute_values (attribute_value_id, attribute_id, value_name, display_order, is_active) VALUES
(411, 103, '8 luồng', 1, 1),
(412, 103, '12 luồng', 2, 1),
(413, 103, '16 luồng', 3, 1),
(414, 103, '24 luồng', 4, 1);

-- Values cho "Tốc độ xung nhịp" (attribute_id = 104)
INSERT INTO attribute_values (attribute_value_id, attribute_id, value_name, display_order, is_active) VALUES
(415, 104, '3.6 GHz', 1, 1),
(416, 104, '3.9 GHz', 2, 1),
(417, 104, '4.5 GHz', 3, 1);

-- Values cho "Thương hiệu GPU" (attribute_id = 105)
INSERT INTO attribute_values (attribute_value_id, attribute_id, value_name, display_order, is_active) VALUES
(418, 105, 'NVIDIA', 1, 1),
(419, 105, 'AMD', 2, 1);

-- Values cho "Bộ nhớ VGA" (attribute_id = 106)
INSERT INTO attribute_values (attribute_value_id, attribute_id, value_name, display_order, is_active) VALUES
(420, 106, '6GB', 1, 1),
(421, 106, '8GB', 2, 1),
(422, 106, '12GB', 3, 1),
(423, 106, '16GB', 4, 1);

-- Values cho "Series GPU" (attribute_id = 107)
INSERT INTO attribute_values (attribute_value_id, attribute_id, value_name, display_order, is_active) VALUES
(424, 107, 'RTX 3060', 1, 1),
(425, 107, 'RTX 4060', 2, 1),
(426, 107, 'RTX 4070', 3, 1),
(427, 107, 'RX 6600', 4, 1),
(428, 107, 'RX 7600', 5, 1);

-- Values cho "Dung lượng SSD" (attribute_id = 108)
INSERT INTO attribute_values (attribute_value_id, attribute_id, value_name, display_order, is_active) VALUES
(429, 108, '256GB', 1, 1),
(430, 108, '512GB', 2, 1),
(431, 108, '1TB', 3, 1),
(432, 108, '2TB', 4, 1);

-- Values cho "Chuẩn kết nối" (attribute_id = 109)
INSERT INTO attribute_values (attribute_value_id, attribute_id, value_name, display_order, is_active) VALUES
(433, 109, 'SATA 3', 1, 1),
(434, 109, 'NVMe PCIe 3.0', 2, 1),
(435, 109, 'NVMe PCIe 4.0', 3, 1);

-- Values cho "Tốc độ đọc" (attribute_id = 110)
INSERT INTO attribute_values (attribute_value_id, attribute_id, value_name, display_order, is_active) VALUES
(436, 110, '500 MB/s', 1, 1),
(437, 110, '3500 MB/s', 2, 1),
(438, 110, '7000 MB/s', 3, 1);

-- Values cho "Dung lượng RAM" (attribute_id = 111)
INSERT INTO attribute_values (attribute_value_id, attribute_id, value_name, display_order, is_active) VALUES
(439, 111, '8GB', 1, 1),
(440, 111, '16GB', 2, 1),
(441, 111, '32GB', 3, 1),
(442, 111, '64GB', 4, 1);

-- Values cho "Bus RAM" (attribute_id = 112)
INSERT INTO attribute_values (attribute_value_id, attribute_id, value_name, display_order, is_active) VALUES
(443, 112, '2400MHz', 1, 1),
(444, 112, '3200MHz', 2, 1),
(445, 112, '3600MHz', 3, 1),
(446, 112, '6000MHz', 4, 1);

-- Values cho "Loại RAM" (attribute_id = 113)
INSERT INTO attribute_values (attribute_value_id, attribute_id, value_name, display_order, is_active) VALUES
(447, 113, 'DDR4', 1, 1),
(448, 113, 'DDR5', 2, 1);

-- Values cho "Socket Mainboard" (attribute_id = 114)
INSERT INTO attribute_values (attribute_value_id, attribute_id, value_name, display_order, is_active) VALUES
(449, 114, 'LGA1200', 1, 1),
(450, 114, 'LGA1700', 2, 1),
(451, 114, 'AM4', 3, 1),
(452, 114, 'AM5', 4, 1);

-- Values cho "Chipset" (attribute_id = 115)
INSERT INTO attribute_values (attribute_value_id, attribute_id, value_name, display_order, is_active) VALUES
(453, 115, 'B660', 1, 1),
(454, 115, 'Z690', 2, 1),
(455, 115, 'B550', 3, 1),
(456, 115, 'X570', 4, 1);

-- Values cho "Form Factor" (attribute_id = 116)
INSERT INTO attribute_values (attribute_value_id, attribute_id, value_name, display_order, is_active) VALUES
(457, 116, 'ATX', 1, 1),
(458, 116, 'Micro-ATX', 2, 1),
(459, 116, 'Mini-ITX', 3, 1);

-- ============================================
-- 3. MAP ATTRIBUTES TO CATEGORIES
-- ============================================

-- CPU (Category 1) - Product Attributes
INSERT INTO attributes_categories (attribute_id, category_id, is_variant_attribute) VALUES
(100, 1, 0),  -- Thương hiệu CPU (Product attribute)
(101, 1, 0),  -- Socket CPU (Product attribute)
(102, 1, 1),  -- Số nhân (Variant attribute - có thể tạo variant khác nhau)
(103, 1, 0),  -- Số luồng (Product attribute)
(104, 1, 1);  -- Tốc độ xung nhịp (Variant attribute)

-- VGA (Category 2)
INSERT INTO attributes_categories (attribute_id, category_id, is_variant_attribute) VALUES
(105, 2, 0),  -- Thương hiệu GPU (Product attribute)
(106, 2, 1),  -- Bộ nhớ VGA (Variant attribute - 6GB/8GB/12GB)
(107, 2, 0);  -- Series GPU (Product attribute)

-- SSD (Category 4)
INSERT INTO attributes_categories (attribute_id, category_id, is_variant_attribute) VALUES
(108, 4, 1),  -- Dung lượng SSD (Variant attribute - 256GB/512GB/1TB/2TB)
(109, 4, 0),  -- Chuẩn kết nối (Product attribute)
(110, 4, 0);  -- Tốc độ đọc (Product attribute)

-- RAM (Category 35)
INSERT INTO attributes_categories (attribute_id, category_id, is_variant_attribute) VALUES
(111, 35, 1), -- Dung lượng RAM (Variant attribute - 8GB/16GB/32GB)
(112, 35, 1), -- Bus RAM (Variant attribute - 2400/3200/3600)
(113, 35, 0); -- Loại RAM (Product attribute - DDR4/DDR5)

-- Mainboard (Category 5)
INSERT INTO attributes_categories (attribute_id, category_id, is_variant_attribute) VALUES
(114, 5, 0),  -- Socket Mainboard (Product attribute)
(115, 5, 1),  -- Chipset (Variant attribute - B660/Z690)
(116, 5, 1);  -- Form Factor (Variant attribute - ATX/mATX/ITX)

-- ============================================
-- 4. MAP ATTRIBUTE VALUES TO CATEGORIES
-- (Bảng categories_attributes_values)
-- ============================================

-- CPU Category (1)
INSERT INTO categories_attributes_values (category_id, attribute_id, attribute_value_id) VALUES
-- Thương hiệu CPU
(1, 100, 400), -- Intel
(1, 100, 401), -- AMD
-- Socket CPU
(1, 101, 402), -- LGA1200
(1, 101, 403), -- LGA1700
(1, 101, 404), -- AM4
(1, 101, 405), -- AM5
-- Số nhân
(1, 102, 406), -- 4 nhân
(1, 102, 407), -- 6 nhân
(1, 102, 408), -- 8 nhân
(1, 102, 409), -- 12 nhân
(1, 102, 410), -- 16 nhân
-- Số luồng
(1, 103, 411), -- 8 luồng
(1, 103, 412), -- 12 luồng
(1, 103, 413), -- 16 luồng
(1, 103, 414), -- 24 luồng
-- Tốc độ xung nhịp
(1, 104, 415), -- 3.6 GHz
(1, 104, 416), -- 3.9 GHz
(1, 104, 417); -- 4.5 GHz

-- VGA Category (2)
INSERT INTO categories_attributes_values (category_id, attribute_id, attribute_value_id) VALUES
-- Thương hiệu GPU
(2, 105, 418), -- NVIDIA
(2, 105, 419), -- AMD
-- Bộ nhớ VGA
(2, 106, 420), -- 6GB
(2, 106, 421), -- 8GB
(2, 106, 422), -- 12GB
(2, 106, 423), -- 16GB
-- Series GPU
(2, 107, 424), -- RTX 3060
(2, 107, 425), -- RTX 4060
(2, 107, 426), -- RTX 4070
(2, 107, 427), -- RX 6600
(2, 107, 428); -- RX 7600

-- SSD Category (4)
INSERT INTO categories_attributes_values (category_id, attribute_id, attribute_value_id) VALUES
-- Dung lượng SSD
(4, 108, 429), -- 256GB
(4, 108, 430), -- 512GB
(4, 108, 431), -- 1TB
(4, 108, 432), -- 2TB
-- Chuẩn kết nối
(4, 109, 433), -- SATA 3
(4, 109, 434), -- NVMe PCIe 3.0
(4, 109, 435), -- NVMe PCIe 4.0
-- Tốc độ đọc
(4, 110, 436), -- 500 MB/s
(4, 110, 437), -- 3500 MB/s
(4, 110, 438); -- 7000 MB/s

-- RAM Category (35)
INSERT INTO categories_attributes_values (category_id, attribute_id, attribute_value_id) VALUES
-- Dung lượng RAM
(35, 111, 439), -- 8GB
(35, 111, 440), -- 16GB
(35, 111, 441), -- 32GB
(35, 111, 442), -- 64GB
-- Bus RAM
(35, 112, 443), -- 2400MHz
(35, 112, 444), -- 3200MHz
(35, 112, 445), -- 3600MHz
(35, 112, 446), -- 6000MHz
-- Loại RAM
(35, 113, 447), -- DDR4
(35, 113, 448); -- DDR5

-- Mainboard Category (5)
INSERT INTO categories_attributes_values (category_id, attribute_id, attribute_value_id) VALUES
-- Socket Mainboard
(5, 114, 449), -- LGA1200
(5, 114, 450), -- LGA1700
(5, 114, 451), -- AM4
(5, 114, 452), -- AM5
-- Chipset
(5, 115, 453), -- B660
(5, 115, 454), -- Z690
(5, 115, 455), -- B550
(5, 115, 456), -- X570
-- Form Factor
(5, 116, 457), -- ATX
(5, 116, 458), -- Micro-ATX
(5, 116, 459); -- Mini-ITX

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check attributes
SELECT * FROM attributes WHERE attribute_id >= 100;

-- Check attribute values
SELECT * FROM attribute_values WHERE attribute_value_id >= 400;

-- Check attribute-category mappings
SELECT ac.*, a.attribute_name, c.category_name 
FROM attributes_categories ac
JOIN attributes a ON ac.attribute_id = a.attribute_id
JOIN categories c ON ac.category_id = c.category_id
WHERE ac.attribute_id >= 100;

-- Check category-attribute-value mappings
SELECT cav.*, c.category_name, a.attribute_name, av.value_name
FROM categories_attributes_values cav
JOIN categories c ON cav.category_id = c.category_id
JOIN attributes a ON cav.attribute_id = a.attribute_id
JOIN attribute_values av ON cav.attribute_value_id = av.attribute_value_id
WHERE cav.attribute_id >= 100
ORDER BY c.category_name, a.attribute_name, av.display_order;
