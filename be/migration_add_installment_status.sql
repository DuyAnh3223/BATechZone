-- Migration: Thêm 'pending' và 'approved' vào ENUM status của bảng installments
-- Date: 2025-11-23

ALTER TABLE `installments` 
MODIFY COLUMN `status` ENUM('pending', 'approved', 'active', 'completed', 'overdue', 'cancelled') 
DEFAULT 'pending';

-- Cập nhật các record hiện tại nếu cần
-- UPDATE `installments` SET `status` = 'pending' WHERE `status` = 'active' AND created_at > DATE_SUB(NOW(), INTERVAL 1 DAY);
