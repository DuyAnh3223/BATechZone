-- ============================================
-- Migration: Update service_requests for warranty flow
-- Version: 002
-- Created: 2025-12-20
-- Purpose: Add warranty-specific fields to support both online and walk-in customers
-- ============================================

-- STEP 1: Drop existing foreign keys
ALTER TABLE `service_requests` 
  DROP FOREIGN KEY IF EXISTS `service_requests_ibfk_1`,
  DROP FOREIGN KEY IF EXISTS `service_requests_ibfk_2`;

-- STEP 2: Allow NULL user_id for walk-in customers
ALTER TABLE `service_requests` 
  MODIFY `user_id` INT(11) NULL COMMENT 'NULL for walk-in customers';

-- STEP 3: Add warranty-related columns
ALTER TABLE `service_requests`
  ADD COLUMN `warranty_id` INT(11) NULL COMMENT 'Link to warranties table' AFTER `user_id`,
  ADD COLUMN `serial_id` INT(11) NULL COMMENT 'Link to variant_serials table' AFTER `warranty_id`,
  ADD COLUMN `request_source` ENUM('online', 'walk_in', 'phone', 'email') DEFAULT 'online' COMMENT 'Request origin' AFTER `request_type`;

-- STEP 4: Add customer contact info for walk-in customers
ALTER TABLE `service_requests`
  ADD COLUMN `customer_name` VARCHAR(100) NULL COMMENT 'Name for walk-in customers' AFTER `serial_id`,
  ADD COLUMN `customer_phone` VARCHAR(20) NULL COMMENT 'Phone for walk-in customers' AFTER `customer_name`,
  ADD COLUMN `customer_email` VARCHAR(100) NULL COMMENT 'Email for walk-in customers' AFTER `customer_phone`;

-- STEP 5: Add images column for problem documentation
ALTER TABLE `service_requests`
  ADD COLUMN `images` JSON NULL COMMENT 'Array of image URLs [{url, description}]' AFTER `description`;

-- STEP 6: Add rejection and progress tracking
ALTER TABLE `service_requests`
  ADD COLUMN `rejection_reason` TEXT NULL COMMENT 'Detailed rejection reason' AFTER `resolution`,
  ADD COLUMN `progress_notes` JSON NULL COMMENT 'Timeline of updates [{timestamp, note, by_user_id}]' AFTER `rejection_reason`;

-- STEP 7: Expand status enum to match warranty flow
ALTER TABLE `service_requests`
  MODIFY `status` ENUM(
    'pending',              -- Chờ duyệt (online) hoặc chờ tiếp nhận (walk-in)
    'approved',             -- Đã duyệt - chờ user mang sản phẩm đến
    'received',             -- Đã tiếp nhận sản phẩm tại cửa hàng
    'inspecting',           -- Đang kiểm tra tình trạng
    'warranty_accepted',    -- Chấp nhận bảo hành
    'warranty_rejected',    -- Từ chối bảo hành
    'repairing_inhouse',    -- Đang sửa tại cửa hàng
    'sent_to_manufacturer', -- Đã gửi về hãng
    'repairing_manufacturer',-- Hãng đang sửa
    'repaired',             -- Đã sửa xong
    'ready_for_pickup',     -- Sẵn sàng để khách lấy
    'completed',            -- Hoàn tất (đã trả khách)
    'cancelled'             -- Đã hủy
  ) DEFAULT 'pending' COMMENT 'Current warranty status';

-- STEP 8: Add timestamp columns for tracking
ALTER TABLE `service_requests`
  ADD COLUMN `approved_at` TIMESTAMP NULL COMMENT 'When request approved' AFTER `resolved_at`,
  ADD COLUMN `received_at` TIMESTAMP NULL COMMENT 'When product received at store' AFTER `approved_at`,
  ADD COLUMN `inspected_at` TIMESTAMP NULL COMMENT 'When inspection completed' AFTER `received_at`,
  ADD COLUMN `rejected_at` TIMESTAMP NULL COMMENT 'When warranty rejected' AFTER `inspected_at`,
  ADD COLUMN `completed_at` TIMESTAMP NULL COMMENT 'When customer picked up' AFTER `rejected_at`;

-- STEP 9: Add indexes for performance
ALTER TABLE `service_requests`
  ADD INDEX `idx_warranty_id` (`warranty_id`),
  ADD INDEX `idx_serial_id` (`serial_id`),
  ADD INDEX `idx_request_source` (`request_source`),
  ADD INDEX `idx_customer_phone` (`customer_phone`),
  ADD INDEX `idx_status` (`status`),
  ADD INDEX `idx_created_status` (`created_at`, `status`);

-- STEP 10: Re-add foreign keys with proper constraints
ALTER TABLE `service_requests`
  ADD CONSTRAINT `fk_sr_user` 
    FOREIGN KEY (`user_id`) 
    REFERENCES `users` (`user_id`) 
    ON DELETE SET NULL
    ON UPDATE CASCADE,
    
  ADD CONSTRAINT `fk_sr_warranty` 
    FOREIGN KEY (`warranty_id`) 
    REFERENCES `warranties` (`warranty_id`) 
    ON DELETE CASCADE
    ON UPDATE CASCADE,
    
  ADD CONSTRAINT `fk_sr_serial` 
    FOREIGN KEY (`serial_id`) 
    REFERENCES `variant_serials` (`serial_id`) 
    ON DELETE CASCADE
    ON UPDATE CASCADE,
    
  ADD CONSTRAINT `fk_sr_assigned_to` 
    FOREIGN KEY (`assigned_to`) 
    REFERENCES `users` (`user_id`) 
    ON DELETE SET NULL
    ON UPDATE CASCADE;

-- STEP 11: Add check constraint - must have user OR customer contact
ALTER TABLE `service_requests`
  ADD CONSTRAINT `chk_customer_contact` 
  CHECK (
    `user_id` IS NOT NULL 
    OR 
    (`customer_phone` IS NOT NULL AND `customer_name` IS NOT NULL)
  );

-- STEP 12: Create view for easy querying
CREATE OR REPLACE VIEW `v_warranty_requests` AS
SELECT 
  sr.service_request_id,
  sr.request_type,
  sr.request_source,
  sr.status,
  sr.subject,
  sr.description,
  sr.images,
  sr.priority,
  sr.rejection_reason,
  sr.progress_notes,
  
  -- User info (registered customers)
  sr.user_id,
  u.full_name AS user_name,
  u.email AS user_email,
  u.phone AS user_phone,
  
  -- Walk-in customer info
  sr.customer_name,
  sr.customer_phone,
  sr.customer_email,
  
  -- Combined contact info
  COALESCE(u.full_name, sr.customer_name) AS contact_name,
  COALESCE(u.phone, sr.customer_phone) AS contact_phone,
  COALESCE(u.email, sr.customer_email) AS contact_email,
  
  -- Serial & Product info
  sr.serial_id,
  vs.serial_number,
  vs.status AS serial_status,
  pv.variant_id,
  pv.sku,
  p.product_id,
  p.product_name,
  
  -- Warranty info
  sr.warranty_id,
  w.warranty_period,
  w.start_date AS warranty_start,
  w.end_date AS warranty_end,
  w.status AS warranty_status,
  DATEDIFF(w.end_date, CURDATE()) AS days_remaining,
  
  -- Assignment
  sr.assigned_to,
  admin.full_name AS assigned_to_name,
  
  -- Resolution
  sr.resolution,
  
  -- Timestamps
  sr.created_at AS request_created,
  sr.updated_at AS last_updated,
  sr.approved_at,
  sr.received_at,
  sr.inspected_at,
  sr.rejected_at,
  sr.resolved_at,
  sr.completed_at,
  
  -- Calculated fields
  DATEDIFF(CURDATE(), sr.created_at) AS days_open,
  CASE 
    WHEN sr.status IN ('completed', 'cancelled') THEN 'closed'
    ELSE 'open'
  END AS is_open
  
FROM service_requests sr
LEFT JOIN users u ON sr.user_id = u.user_id
LEFT JOIN users admin ON sr.assigned_to = admin.user_id
LEFT JOIN warranties w ON sr.warranty_id = w.warranty_id
LEFT JOIN variant_serials vs ON sr.serial_id = vs.serial_id
LEFT JOIN product_variants pv ON vs.variant_id = pv.variant_id
LEFT JOIN products p ON pv.product_id = p.product_id;

-- STEP 13: Create index on view (if supported)
-- Note: MySQL doesn't support materialized views, but this helps query performance
CREATE INDEX idx_v_warranty_status ON service_requests(status, created_at);

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these to verify the migration succeeded:

-- 1. Check structure
-- DESCRIBE service_requests;

-- 2. Check constraints
-- SELECT CONSTRAINT_NAME, CONSTRAINT_TYPE 
-- FROM information_schema.TABLE_CONSTRAINTS 
-- WHERE TABLE_NAME = 'service_requests';

-- 3. Check indexes
-- SHOW INDEX FROM service_requests;

-- 4. Test view
-- SELECT * FROM v_warranty_requests LIMIT 5;

-- ============================================
-- ROLLBACK (if needed)
-- ============================================
/*
-- Drop the view
DROP VIEW IF EXISTS `v_warranty_requests`;

-- Drop new columns (reverse order)
ALTER TABLE `service_requests`
  DROP COLUMN `completed_at`,
  DROP COLUMN `rejected_at`,
  DROP COLUMN `inspected_at`,
  DROP COLUMN `received_at`,
  DROP COLUMN `approved_at`,
  DROP COLUMN `progress_notes`,
  DROP COLUMN `rejection_reason`,
  DROP COLUMN `images`,
  DROP COLUMN `customer_email`,
  DROP COLUMN `customer_phone`,
  DROP COLUMN `customer_name`,
  DROP COLUMN `request_source`,
  DROP COLUMN `serial_id`,
  DROP COLUMN `warranty_id`;

-- Restore original status enum
ALTER TABLE `service_requests`
  MODIFY `status` ENUM('pending','processing','completed','rejected','cancelled') DEFAULT 'pending';

-- Restore user_id as NOT NULL
ALTER TABLE `service_requests`
  MODIFY `user_id` INT(11) NOT NULL;

-- Drop check constraint
ALTER TABLE `service_requests`
  DROP CONSTRAINT `chk_customer_contact`;

-- Drop new foreign keys
ALTER TABLE `service_requests`
  DROP FOREIGN KEY `fk_sr_user`,
  DROP FOREIGN KEY `fk_sr_warranty`,
  DROP FOREIGN KEY `fk_sr_serial`,
  DROP FOREIGN KEY `fk_sr_assigned_to`;

-- Re-add original foreign keys
ALTER TABLE `service_requests`
  ADD CONSTRAINT `service_requests_ibfk_1` 
    FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `service_requests_ibfk_2` 
    FOREIGN KEY (`assigned_to`) REFERENCES `users` (`user_id`) ON DELETE SET NULL;
*/
