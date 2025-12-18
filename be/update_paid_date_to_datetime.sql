-- Update paid_date column from DATE to DATETIME
-- This allows storing time information (hours, minutes, seconds) in addition to date

ALTER TABLE installment_payments 
MODIFY COLUMN paid_date DATETIME DEFAULT NULL;

-- Update down_payment_date column from DATE to DATETIME
ALTER TABLE installments
MODIFY COLUMN down_payment_date DATETIME DEFAULT NULL;
