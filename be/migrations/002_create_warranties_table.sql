-- Create warranties table
DROP TABLE IF EXISTS `warranties`
GO
CREATE TABLE IF NOT EXISTS `warranties` (
  `warranty_id` INT PRIMARY KEY AUTO_INCREMENT,
  `serial_id` INT NOT NULL,
  `order_item_id` INT NOT NULL,
  `service_request_id` INT NULL,
  `warranty_period` INT NOT NULL COMMENT 'Warranty period in months',
  `start_date` DATETIME NOT NULL,
  `end_date` DATETIME NOT NULL,
  `status` ENUM('active', 'expired', 'claimed', 'void') DEFAULT 'active',
  `notes` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (`serial_id`) REFERENCES `variant_serials`(`serial_id`) ON DELETE CASCADE,
  FOREIGN KEY (`order_item_id`) REFERENCES `order_items`(`order_item_id`) ON DELETE CASCADE,
  
  INDEX `idx_serial_id` (`serial_id`),
  INDEX `idx_order_item_id` (`order_item_id`),
  INDEX `idx_status` (`status`),
  INDEX `idx_dates` (`start_date`, `end_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add warranty_period column to product_variants if not exists
ALTER TABLE `product_variants` 
ADD COLUMN IF NOT EXISTS `warranty_period` INT DEFAULT 12 COMMENT 'Warranty period in months';
