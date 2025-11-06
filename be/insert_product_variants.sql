-- Insert 8 sample product variants
-- Tạo dữ liệu mẫu cho bảng product_variants

INSERT INTO `product_variants` (`product_id`, `sku`, `variant_name`, `price`, `compare_at_price`, `cost_price`, `stock_quantity`, `weight`, `dimensions`, `is_active`, `is_default`, `created_at`, `updated_at`) VALUES

-- CPU Intel Core i9-13900K (product_id: 17)
(17, 'INT-I9-13900K-001', 'Intel Core i9-13900K - Box', 12990000.00, 13990000.00, 11500000.00, 25, 0.15, '37.5 x 45.0 x 11.5 mm', 1, 1, NOW(), NOW()),

-- CPU AMD Ryzen 9 7950X (product_id: 18)
(18, 'AMD-R9-7950X-001', 'AMD Ryzen 9 7950X - Box', 11990000.00, 12990000.00, 10500000.00, 18, 0.15, '40.0 x 40.0 x 11.5 mm', 1, 1, NOW(), NOW()),

-- VGA NVIDIA RTX 4090 24GB (product_id: 19)
(19, 'NVD-RTX4090-24GB-001', 'NVIDIA GeForce RTX 4090 24GB - Founder Edition', 45990000.00, 47990000.00, 42000000.00, 8, 2.2, '304 x 137 x 61 mm', 1, 1, NOW(), NOW()),

-- VGA AMD RX 7900 XTX 24GB (product_id: 20)
(20, 'AMD-RX7900XTX-24GB-001', 'AMD Radeon RX 7900 XTX 24GB - Reference', 32990000.00, 34990000.00, 29500000.00, 12, 1.8, '287 x 125 x 51 mm', 1, 1, NOW(), NOW()),

-- RAM Corsair Vengeance RGB DDR5 32GB (product_id: 21)
(21, 'COR-VEN-RGB-DDR5-32GB-6000', 'Corsair Vengeance RGB DDR5 32GB (2x16GB) 6000MHz CL30', 5490000.00, 5990000.00, 4800000.00, 45, 0.08, '133 x 40 x 7 mm', 1, 1, NOW(), NOW()),

-- RAM Kingston Fury Beast DDR5 32GB (product_id: 22)
(22, 'KIN-FURY-BEAST-DDR5-32GB-5600', 'Kingston Fury Beast DDR5 32GB (2x16GB) 5600MHz CL36', 4290000.00, 4690000.00, 3800000.00, 52, 0.07, '133 x 40 x 7 mm', 1, 1, NOW(), NOW()),

-- SSD Samsung 980 PRO 2TB (product_id: 23)
(23, 'SAM-980PRO-2TB-NVMe', 'Samsung 980 PRO 2TB M.2 NVMe PCIe 4.0', 8990000.00, 9490000.00, 7800000.00, 30, 0.01, '80 x 22 x 2.38 mm', 1, 1, NOW(), NOW()),

-- SSD WD Black SN850X 1TB (product_id: 24)
(24, 'WD-SN850X-1TB-NVMe', 'WD Black SN850X 1TB M.2 NVMe PCIe 4.0', 4490000.00, 4890000.00, 3900000.00, 38, 0.01, '80 x 22 x 2.38 mm', 1, 1, NOW(), NOW());

