-- Script to generate payments for installment_id 8
-- Run this in MySQL Workbench or phpMyAdmin

-- First, check if installment exists and get details
SELECT * FROM installments WHERE installment_id = 8;

-- Generate 6 payments (num_terms = 6) for installment_id 8
-- Adjust the dates based on start_date (2025-11-21)

INSERT INTO installment_payments 
    (installment_id, payment_no, due_date, paid_date, amount, status, note)
VALUES
    (8, 1, '2025-12-22', NULL, 1073521.56, 'pending', NULL),
    (8, 2, '2026-01-22', NULL, 1073521.56, 'pending', NULL),
    (8, 3, '2026-02-22', NULL, 1073521.56, 'pending', NULL),
    (8, 4, '2026-03-22', NULL, 1073521.56, 'pending', NULL),
    (8, 5, '2026-04-22', NULL, 1073521.56, 'pending', NULL),
    (8, 6, '2026-05-22', NULL, 1073521.56, 'pending', NULL);

-- Verify the payments were created
SELECT * FROM installment_payments WHERE installment_id = 8 ORDER BY payment_no;

-- Note: If you get duplicate key error, payments already exist
-- In that case, check existing payments first:
-- SELECT * FROM installment_payments WHERE installment_id = 8;
