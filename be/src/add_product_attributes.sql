-- ===================================================================
-- THÊM THUỘC TÍNH CHO CÁC VARIANT SẢN PHẨM MỚI
-- ===================================================================
-- Lưu ý: Chạy file add_missing_attributes.sql trước để có attribute_id và attribute_value_id đúng

-- ===================================================================
-- MONITOR PRODUCTS (Category 40)
-- ===================================================================

-- Product 300: LG UltraGear 27GN800-B - Variant 500
-- Hãng: LG, Kích thước: 27 inch, Độ phân giải: 2K, Tấm nền: IPS, Tần số quét: 144Hz
INSERT INTO `variant_attributes` (`variant_id`, `attribute_value_id`) 
SELECT 500, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 42 AND av.value_name = 'LG'
UNION ALL SELECT 500, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 43 AND av.value_name = '27 inch'
UNION ALL SELECT 500, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 44 AND av.value_name = '2K (2560x1440)'
UNION ALL SELECT 500, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 45 AND av.value_name = 'IPS'
UNION ALL SELECT 500, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 46 AND av.value_name = '144Hz';

-- Product 301: ASUS TUF VG27AQ - Variant 501
-- Hãng: ASUS, Kích thước: 27 inch, Độ phân giải: 2K, Tấm nền: IPS, Tần số quét: 165Hz
INSERT INTO `variant_attributes` (`variant_id`, `attribute_value_id`) 
SELECT 501, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 42 AND av.value_name = 'ASUS'
UNION ALL SELECT 501, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 43 AND av.value_name = '27 inch'
UNION ALL SELECT 501, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 44 AND av.value_name = '2K (2560x1440)'
UNION ALL SELECT 501, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 45 AND av.value_name = 'IPS'
UNION ALL SELECT 501, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 46 AND av.value_name = '165Hz';

-- Product 302: Samsung Odyssey G5 - Variant 502
-- Hãng: Samsung, Kích thước: 32 inch, Độ phân giải: 2K, Tấm nền: VA, Tần số quét: 144Hz
INSERT INTO `variant_attributes` (`variant_id`, `attribute_value_id`) 
SELECT 502, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 42 AND av.value_name = 'Samsung'
UNION ALL SELECT 502, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 43 AND av.value_name = '32 inch'
UNION ALL SELECT 502, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 44 AND av.value_name = '2K (2560x1440)'
UNION ALL SELECT 502, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 45 AND av.value_name = 'VA'
UNION ALL SELECT 502, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 46 AND av.value_name = '144Hz';

-- ===================================================================
-- KEYBOARD PRODUCTS (Category 41)
-- ===================================================================

-- Product 310: Logitech G Pro X - Variant 510
-- Hãng: Logitech, Loại: Cơ, Switch: GX Blue (tương đương Cherry MX Blue), Kết nối: USB có dây, RGB: Có RGB
INSERT INTO `variant_attributes` (`variant_id`, `attribute_value_id`) 
SELECT 510, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 47 AND av.value_name = 'Logitech'
UNION ALL SELECT 510, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 48 AND av.value_name = 'Cơ (Mechanical)'
UNION ALL SELECT 510, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 49 AND av.value_name = 'Cherry MX Blue'
UNION ALL SELECT 510, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 50 AND av.value_name = 'USB có dây'
UNION ALL SELECT 510, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 51 AND av.value_name = 'Có RGB';

-- Product 311: Corsair K70 RGB MK.2 - Variant 511
-- Hãng: Corsair, Loại: Cơ, Switch: Cherry MX Red, Kết nối: USB có dây, RGB: Có RGB
INSERT INTO `variant_attributes` (`variant_id`, `attribute_value_id`) 
SELECT 511, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 47 AND av.value_name = 'Corsair'
UNION ALL SELECT 511, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 48 AND av.value_name = 'Cơ (Mechanical)'
UNION ALL SELECT 511, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 49 AND av.value_name = 'Cherry MX Red'
UNION ALL SELECT 511, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 50 AND av.value_name = 'USB có dây'
UNION ALL SELECT 511, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 51 AND av.value_name = 'Có RGB';

-- Product 312: Keychron K2 V2 - Variant 512
-- Hãng: Keychron, Loại: Cơ, Switch: Gateron Brown, Kết nối: Dual Mode, RGB: Có RGB
INSERT INTO `variant_attributes` (`variant_id`, `attribute_value_id`) 
SELECT 512, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 47 AND av.value_name = 'Keychron'
UNION ALL SELECT 512, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 48 AND av.value_name = 'Cơ (Mechanical)'
UNION ALL SELECT 512, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 49 AND av.value_name = 'Gateron Brown'
UNION ALL SELECT 512, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 50 AND av.value_name = 'Dual Mode'
UNION ALL SELECT 512, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 51 AND av.value_name = 'Có RGB';

-- ===================================================================
-- MOUSE PRODUCTS (Category 42)
-- ===================================================================

-- Product 320: Logitech G304 - Variant 520
-- Hãng: Logitech, Kiểu: Gaming, DPI: 12000, Kết nối: Wireless 2.4GHz, RGB: Không đèn
INSERT INTO `variant_attributes` (`variant_id`, `attribute_value_id`) 
SELECT 520, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 52 AND av.value_name = 'Logitech'
UNION ALL SELECT 520, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 53 AND av.value_name = 'Gaming'
UNION ALL SELECT 520, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 54 AND av.value_name = '12000 DPI'
UNION ALL SELECT 520, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 55 AND av.value_name = 'Wireless 2.4GHz'
UNION ALL SELECT 520, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 56 AND av.value_name = 'Không đèn';

-- Product 321: Razer Viper Ultimate - Variant 521
-- Hãng: Razer, Kiểu: Gaming, DPI: 16000, Kết nối: Wireless 2.4GHz, RGB: Có RGB
INSERT INTO `variant_attributes` (`variant_id`, `attribute_value_id`) 
SELECT 521, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 52 AND av.value_name = 'Razer'
UNION ALL SELECT 521, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 53 AND av.value_name = 'Gaming'
UNION ALL SELECT 521, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 54 AND av.value_name = '16000 DPI'
UNION ALL SELECT 521, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 55 AND av.value_name = 'Wireless 2.4GHz'
UNION ALL SELECT 521, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 56 AND av.value_name = 'Có RGB';

-- Product 322: SteelSeries Rival 3 - Variant 522
-- Hãng: SteelSeries, Kiểu: Gaming, DPI: 12000, Kết nối: Wireless 2.4GHz, RGB: Có RGB
INSERT INTO `variant_attributes` (`variant_id`, `attribute_value_id`) 
SELECT 522, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 52 AND av.value_name = 'SteelSeries'
UNION ALL SELECT 522, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 53 AND av.value_name = 'Gaming'
UNION ALL SELECT 522, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 54 AND av.value_name = '12000 DPI'
UNION ALL SELECT 522, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 55 AND av.value_name = 'Wireless 2.4GHz'
UNION ALL SELECT 522, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 56 AND av.value_name = 'Có RGB';

-- ===================================================================
-- HEADPHONE PRODUCTS (Category 43)
-- ===================================================================

-- Product 330: HyperX Cloud II - Variant 530
-- Hãng: HyperX, Loại: Gaming, Kết nối: USB, Micro: Có mic rời, RGB: Không đèn
INSERT INTO `variant_attributes` (`variant_id`, `attribute_value_id`) 
SELECT 530, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 57 AND av.value_name = 'HyperX'
UNION ALL SELECT 530, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 58 AND av.value_name = 'Gaming'
UNION ALL SELECT 530, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 59 AND av.value_name = 'USB'
UNION ALL SELECT 530, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 60 AND av.value_name = 'Có mic rời'
UNION ALL SELECT 530, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 61 AND av.value_name = 'Không đèn';

-- Product 331: Razer BlackShark V2 Pro - Variant 531
-- Hãng: Razer, Loại: Gaming, Kết nối: Wireless 2.4GHz, Micro: Có mic rời, RGB: Có RGB
INSERT INTO `variant_attributes` (`variant_id`, `attribute_value_id`) 
SELECT 531, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 57 AND av.value_name = 'Razer'
UNION ALL SELECT 531, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 58 AND av.value_name = 'Gaming'
UNION ALL SELECT 531, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 59 AND av.value_name = 'Wireless 2.4GHz'
UNION ALL SELECT 531, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 60 AND av.value_name = 'Có mic rời'
UNION ALL SELECT 531, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 61 AND av.value_name = 'Có RGB';

-- Product 332: SteelSeries Arctis 7 - Variant 532
-- Hãng: SteelSeries, Loại: Gaming, Kết nối: Wireless 2.4GHz, Micro: Có mic rời, RGB: Đơn sắc
INSERT INTO `variant_attributes` (`variant_id`, `attribute_value_id`) 
SELECT 532, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 57 AND av.value_name = 'SteelSeries'
UNION ALL SELECT 532, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 58 AND av.value_name = 'Gaming'
UNION ALL SELECT 532, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 59 AND av.value_name = 'Wireless 2.4GHz'
UNION ALL SELECT 532, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 60 AND av.value_name = 'Có mic rời'
UNION ALL SELECT 532, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 61 AND av.value_name = 'Đơn sắc';

-- ===================================================================
-- SPEAKER PRODUCTS (Category 44)
-- ===================================================================

-- Product 340: Logitech Z906 - Variant 540
-- Hãng: Logitech, Loại: 5.1, Công suất: Trên 100W, Kết nối: Optical, RGB: Không đèn
INSERT INTO `variant_attributes` (`variant_id`, `attribute_value_id`) 
SELECT 540, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 62 AND av.value_name = 'Logitech'
UNION ALL SELECT 540, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 63 AND av.value_name = '5.1'
UNION ALL SELECT 540, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 64 AND av.value_name = 'Trên 100W'
UNION ALL SELECT 540, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 65 AND av.value_name = 'Optical'
UNION ALL SELECT 540, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 66 AND av.value_name = 'Không đèn';

-- Product 341: Creative Pebble V3 - Variant 541
-- Hãng: Creative, Loại: 2.0, Công suất: 10W-20W, Kết nối: USB, RGB: Có RGB
INSERT INTO `variant_attributes` (`variant_id`, `attribute_value_id`) 
SELECT 541, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 62 AND av.value_name = 'Creative'
UNION ALL SELECT 541, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 63 AND av.value_name = '2.0'
UNION ALL SELECT 541, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 64 AND av.value_name = '10W - 20W'
UNION ALL SELECT 541, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 65 AND av.value_name = 'USB'
UNION ALL SELECT 541, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 66 AND av.value_name = 'Có RGB';

-- Product 342: Edifier R1280T - Variant 542
-- Hãng: Edifier, Loại: 2.0, Công suất: 20W-50W, Kết nối: Jack 3.5mm, RGB: Không đèn
INSERT INTO `variant_attributes` (`variant_id`, `attribute_value_id`) 
SELECT 542, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 62 AND av.value_name = 'Edifier'
UNION ALL SELECT 542, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 63 AND av.value_name = '2.0'
UNION ALL SELECT 542, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 64 AND av.value_name = '20W - 50W'
UNION ALL SELECT 542, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 65 AND av.value_name = 'Jack 3.5mm'
UNION ALL SELECT 542, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 66 AND av.value_name = 'Không đèn';

-- ===================================================================
-- GAMING CHAIR PRODUCTS (Category 45)
-- ===================================================================

-- Product 350: Secretlab TITAN Evo 2022 - Variant 550
-- Hãng: Secretlab, Chất liệu: Da PU, Tính năng: Ngả 180°, Màu sắc: Đen, Trọng tải: 120-150kg
INSERT INTO `variant_attributes` (`variant_id`, `attribute_value_id`) 
SELECT 550, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 67 AND av.value_name = 'Secretlab'
UNION ALL SELECT 550, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 68 AND av.value_name = 'Da PU'
UNION ALL SELECT 550, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 69 AND av.value_name = 'Ngả 180°'
UNION ALL SELECT 550, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 70 AND av.value_name = 'Đen'
UNION ALL SELECT 550, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 71 AND av.value_name = '120-150kg';

-- Product 351: Herman Miller X Logitech G Embody - Variant 551
-- Hãng: Logitech (collaboration), Chất liệu: Vải cao cấp, Tính năng: Điều chỉnh 4D, Màu sắc: Đen, Trọng tải: 120-150kg
INSERT INTO `variant_attributes` (`variant_id`, `attribute_value_id`) 
SELECT 551, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 67 AND av.value_name = 'Corsair'
UNION ALL SELECT 551, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 68 AND av.value_name = 'Vải cao cấp'
UNION ALL SELECT 551, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 69 AND av.value_name = 'Điều chỉnh 4D'
UNION ALL SELECT 551, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 70 AND av.value_name = 'Đen'
UNION ALL SELECT 551, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 71 AND av.value_name = '120-150kg';

-- Product 352: Razer Iskur - Variant 552
-- Hãng: DXRacer (use as alternative), Chất liệu: Da PU, Tính năng: Ngả 180°, Màu sắc: Đen, Trọng tải: 100-120kg
INSERT INTO `variant_attributes` (`variant_id`, `attribute_value_id`) 
SELECT 552, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 67 AND av.value_name = 'DXRacer'
UNION ALL SELECT 552, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 68 AND av.value_name = 'Da PU'
UNION ALL SELECT 552, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 69 AND av.value_name = 'Ngả 180°'
UNION ALL SELECT 552, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 70 AND av.value_name = 'Đen'
UNION ALL SELECT 552, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 71 AND av.value_name = '100-120kg';

-- ===================================================================
-- CASE FAN PRODUCTS (Category 46)
-- ===================================================================

-- Product 360: Lian Li UNI FAN SL120 V2 - Variant 560
-- Hãng: NZXT (use as alternative), Kích thước: 120mm, Tốc độ: 1500-2000 RPM, RGB: RGB ARGB, Loại bearing: Fluid Dynamic Bearing
INSERT INTO `variant_attributes` (`variant_id`, `attribute_value_id`) 
SELECT 560, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 72 AND av.value_name = 'NZXT'
UNION ALL SELECT 560, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 73 AND av.value_name = '120mm'
UNION ALL SELECT 560, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 74 AND av.value_name = '1500-2000 RPM'
UNION ALL SELECT 560, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 75 AND av.value_name = 'RGB ARGB'
UNION ALL SELECT 560, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 76 AND av.value_name = 'Fluid Dynamic Bearing';

-- Product 361: Corsair iCUE SP120 RGB ELITE - Variant 561
-- Hãng: Corsair, Kích thước: 120mm, Tốc độ: 1500-2000 RPM, RGB: RGB, Loại bearing: Magnetic Levitation
INSERT INTO `variant_attributes` (`variant_id`, `attribute_value_id`) 
SELECT 561, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 72 AND av.value_name = 'Corsair'
UNION ALL SELECT 561, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 73 AND av.value_name = '120mm'
UNION ALL SELECT 561, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 74 AND av.value_name = '1500-2000 RPM'
UNION ALL SELECT 561, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 75 AND av.value_name = 'RGB'
UNION ALL SELECT 561, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 76 AND av.value_name = 'Magnetic Levitation';

-- Product 362: Noctua NF-A12x25 PWM - Variant 562
-- Hãng: Noctua, Kích thước: 120mm, Tốc độ: 2000+ RPM, RGB: Không đèn, Loại bearing: Fluid Dynamic Bearing
INSERT INTO `variant_attributes` (`variant_id`, `attribute_value_id`) 
SELECT 562, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 72 AND av.value_name = 'Noctua'
UNION ALL SELECT 562, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 73 AND av.value_name = '120mm'
UNION ALL SELECT 562, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 74 AND av.value_name = '2000+ RPM'
UNION ALL SELECT 562, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 75 AND av.value_name = 'Không đèn'
UNION ALL SELECT 562, av.attribute_value_id FROM `attribute_values` av WHERE av.attribute_id = 76 AND av.value_name = 'Fluid Dynamic Bearing';

-- ===================================================================
-- HOÀN TẤT
-- ===================================================================

-- Ghi chú:
-- 1. File này thêm variant_attributes cho các sản phẩm từ categories 40-46
-- 2. Cần chạy add_missing_attributes.sql trước để có đầy đủ attributes và attribute_values
-- 3. Các attribute_value_id được lấy động bằng SELECT để đảm bảo đúng với database
-- 4. Một số hãng không có trong attribute_values nên dùng hãng tương tự (VD: Lian Li → NZXT)
