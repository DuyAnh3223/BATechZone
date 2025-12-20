-- ============================================
-- ULTRA MINIMAL update for service_requests
-- Version: 004 - Simplified
-- Date: 2025-12-20
-- ============================================

-- Add ONLY essential columns
ALTER TABLE `service_requests`
  -- Contact phone (for different person from original buyer)
  ADD COLUMN `customer_phone` VARCHAR(20) NULL 
    COMMENT 'Contact phone if different from order buyer' 
    AFTER `serial_id`,
  
  -- Request source
  ADD COLUMN `request_source` ENUM('online', 'walk_in', 'phone', 'email') 
    DEFAULT 'online' 
    AFTER `request_type`,
  
  -- Assignment
  ADD COLUMN `assigned_to` INT(11) NULL 
    COMMENT 'Admin handling this request' 
    AFTER `priority`,
  
  -- Resolution details
  ADD COLUMN `resolution` TEXT NULL 
    COMMENT 'Final resolution/result' 
    AFTER `rejection_reason`;

-- Expand status enum for warranty flow
ALTER TABLE `service_requests`
  MODIFY `status` ENUM(
    'pending',              -- Chờ tiếp nhận
    'received',             -- Đã tiếp nhận sản phẩm
    'inspecting',           -- Đang kiểm tra
    'warranty_accepted',    -- Chấp nhận bảo hành - đang xử lý
    'warranty_rejected',    -- Từ chối bảo hành
    'repairing',            -- Đang sửa chữa
    'completed',            -- Đã hoàn tất
    'cancelled'             -- Đã hủy
  ) DEFAULT 'pending';

-- Add minimal indexes
ALTER TABLE `service_requests`
  ADD INDEX `idx_customer_phone` (`customer_phone`),
  ADD INDEX `idx_assigned_to` (`assigned_to`),
  ADD INDEX `idx_request_source` (`request_source`);

-- Add foreign key for assigned_to
ALTER TABLE `service_requests`
  ADD CONSTRAINT `fk_sr_assigned_to` 
    FOREIGN KEY (`assigned_to`) 
    REFERENCES `users` (`user_id`) 
    ON DELETE SET NULL 
    ON UPDATE CASCADE;

-- ============================================
-- USAGE NOTES:
-- ============================================
-- Timestamps sử dụng:
-- - created_at: Thời điểm tạo yêu cầu
-- - updated_at: Cập nhật gần nhất (tự động)
-- - resolved_at: Thời điểm hoàn tất (set khi status = completed/warranty_rejected)
--
-- Customer phone usage:
-- - NULL: Dùng phone từ order address
-- - NOT NULL: Dùng phone này (người liên hệ khác người mua)
--
-- Status flow:
-- pending → received → inspecting → warranty_accepted/warranty_rejected
--                                          ↓
--                                     repairing → ready_for_pickup → completed
