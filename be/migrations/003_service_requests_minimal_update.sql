-- ============================================
-- Minimal update for service_requests table
-- Version: 003
-- Date: 2025-12-20
-- ============================================

-- Add missing columns
ALTER TABLE `service_requests`
  -- Customer contact for walk-in customers
  ADD COLUMN `customer_name` VARCHAR(100) NULL COMMENT 'Walk-in customer name' AFTER `serial_id`,
  ADD COLUMN `customer_phone` VARCHAR(20) NULL COMMENT 'Walk-in customer phone' AFTER `customer_name`,
  ADD COLUMN `customer_email` VARCHAR(100) NULL COMMENT 'Walk-in customer email' AFTER `customer_phone`,
  
  -- Request source
  ADD COLUMN `request_source` ENUM('online', 'walk_in', 'phone', 'email') DEFAULT 'online' COMMENT 'Request origin' AFTER `request_type`,
  
  -- Assignment
  ADD COLUMN `assigned_to` INT(11) NULL COMMENT 'Admin assigned to handle' AFTER `priority`,
  
  -- Resolution
  ADD COLUMN `resolution` TEXT NULL COMMENT 'Final resolution details' AFTER `rejection_reason`,
  
  -- Detailed timestamps
  ADD COLUMN `approved_at` TIMESTAMP NULL AFTER `resolved_at`,
  ADD COLUMN `received_at` TIMESTAMP NULL AFTER `approved_at`,
  ADD COLUMN `inspected_at` TIMESTAMP NULL AFTER `received_at`,
  ADD COLUMN `rejected_at` TIMESTAMP NULL AFTER `inspected_at`,
  ADD COLUMN `completed_at` TIMESTAMP NULL AFTER `rejected_at`;

-- Expand status enum
ALTER TABLE `service_requests`
  MODIFY `status` ENUM(
    'pending',              -- Chờ duyệt/tiếp nhận
    'approved',             -- Đã duyệt - chờ mang sp đến
    'received',             -- Đã tiếp nhận sp
    'inspecting',           -- Đang kiểm tra
    'warranty_accepted',    -- Chấp nhận bảo hành
    'warranty_rejected',    -- Từ chối bảo hành
    'repairing_inhouse',    -- Sửa tại cửa hàng
    'sent_to_manufacturer', -- Gửi về hãng
    'repairing_manufacturer',-- Hãng đang sửa
    'repaired',             -- Đã sửa xong
    'ready_for_pickup',     -- Sẵn sàng lấy
    'completed',            -- Hoàn tất
    'cancelled'             -- Đã hủy
  ) DEFAULT 'pending';

-- Add indexes
ALTER TABLE `service_requests`
  ADD INDEX `idx_request_source` (`request_source`),
  ADD INDEX `idx_customer_phone` (`customer_phone`),
  ADD INDEX `idx_assigned_to` (`assigned_to`);

-- Add foreign key for assigned_to
ALTER TABLE `service_requests`
  ADD CONSTRAINT `fk_sr_assigned_to` 
    FOREIGN KEY (`assigned_to`) 
    REFERENCES `users` (`user_id`) 
    ON DELETE SET NULL 
    ON UPDATE CASCADE;

-- Add check constraint
ALTER TABLE `service_requests`
  ADD CONSTRAINT `chk_customer_info` 
  CHECK (
    `user_id` IS NOT NULL 
    OR 
    (`customer_phone` IS NOT NULL AND `customer_name` IS NOT NULL)
  );
