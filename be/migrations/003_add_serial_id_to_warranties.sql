-- Add serial_id column to existing warranties table
-- Run this if you already have warranties table without serial_id

-- Add serial_id column
ALTER TABLE `warranties` 
ADD COLUMN `serial_id` INT NOT NULL AFTER `warranty_id`;

-- Add warranty_type if not exists
ALTER TABLE `warranties`
ADD COLUMN `warranty_type` ENUM('manufacturer', 'seller', 'extended') DEFAULT 'manufacturer' AFTER `warranty_period`;

-- Add foreign key constraint
ALTER TABLE `warranties`
ADD CONSTRAINT `fk_warranties_serial` 
FOREIGN KEY (`serial_id`) REFERENCES `variant_serials`(`serial_id`) ON DELETE CASCADE;

-- Add index for serial_id
ALTER TABLE `warranties`
ADD INDEX `idx_serial_id` (`serial_id`);

-- Add warranty_period to product_variants if not exists
ALTER TABLE `product_variants` 
ADD COLUMN `warranty_period` INT DEFAULT 12 COMMENT 'Warranty period in months';
