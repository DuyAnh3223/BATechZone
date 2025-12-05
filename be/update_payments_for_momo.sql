-- Update payments table to support Momo payment method
-- Run this SQL to add 'momo' to payment_method enum

ALTER TABLE `payments` 
MODIFY COLUMN `payment_method` ENUM('cod','bank_transfer','credit_card','e_wallet','installment','momo') NOT NULL;

-- Also update payment_status to include 'cancelled' and 'paid' statuses
ALTER TABLE `payments` 
MODIFY COLUMN `payment_status` ENUM('pending','completed','failed','refunded','cancelled','paid') DEFAULT 'pending';

-- Note: 'momo' bao gồm cả thanh toán QR và ATM
-- Momo gateway sẽ tự động hiển thị cả 2 options cho người dùng
