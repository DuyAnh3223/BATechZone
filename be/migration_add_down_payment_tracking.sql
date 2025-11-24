-- Migration: Add down payment tracking fields to installments table
-- Date: 2025-11-24
-- Purpose: Track down payment status and date

-- Add new columns
ALTER TABLE installments
ADD COLUMN down_payment_status ENUM('pending', 'paid', 'cancelled') DEFAULT 'pending' AFTER down_payment,
ADD COLUMN down_payment_date DATETIME NULL AFTER down_payment_status,
ADD COLUMN down_payment_note TEXT NULL AFTER down_payment_date;

-- Add index for querying by down_payment_status
CREATE INDEX idx_down_payment_status ON installments(down_payment_status);

-- Update existing records: if status is not 'pending', assume down_payment is paid
UPDATE installments 
SET down_payment_status = 'paid',
    down_payment_date = created_at
WHERE status IN ('approved', 'active', 'completed');

-- Verify changes
SELECT installment_id, down_payment, down_payment_status, down_payment_date, status 
FROM installments 
LIMIT 5;
