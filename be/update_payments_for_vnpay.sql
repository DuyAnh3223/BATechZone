-- Update payments table to support VNPay payment method
-- Run this SQL to add 'vnpay' to payment_method enum

ALTER TABLE `payments` 
MODIFY COLUMN `payment_method` ENUM('cod','bank_transfer','credit_card','e_wallet','installment','momo','vnpay') NOT NULL;

-- Note: VNPay supports multiple payment methods:
-- - ATM cards (Thẻ ATM nội địa)
-- - Credit/Debit cards (Thẻ thanh toán quốc tế)
-- - QR Code (VNPAY-QR)
-- - E-wallets integrated with VNPay
