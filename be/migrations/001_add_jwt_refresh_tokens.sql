-- ====================================================================
-- Migration: Add JWT Refresh Token Columns
-- Date: 2025-12-17
-- Description: Add separate refresh token columns for admin and user sessions
--              to support JWT multi-session authentication
-- ====================================================================

-- Check current table structure
SELECT 
    COLUMN_NAME, 
    COLUMN_TYPE, 
    IS_NULLABLE, 
    COLUMN_COMMENT 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'batechzone' 
  AND TABLE_NAME = 'users' 
  AND COLUMN_NAME IN ('session_token', 'admin_session_token', 'user_session_token', 'admin_refresh_token', 'user_refresh_token');

-- ====================================================================
-- STEP 1: Add new JWT refresh token columns
-- ====================================================================

ALTER TABLE `users`
ADD COLUMN `admin_refresh_token` VARCHAR(512) DEFAULT NULL COMMENT 'JWT refresh token for admin session (role=2)' AFTER `user_session_token`,
ADD COLUMN `user_refresh_token` VARCHAR(512) DEFAULT NULL COMMENT 'JWT refresh token for user session (role=0,1)' AFTER `admin_refresh_token`;

-- ====================================================================
-- STEP 2: (Optional) Add indexes for faster token lookups
-- ====================================================================

-- Index for admin refresh token lookups
CREATE INDEX idx_admin_refresh_token ON `users`(`admin_refresh_token`(255));

-- Index for user refresh token lookups
CREATE INDEX idx_user_refresh_token ON `users`(`user_refresh_token`(255));

-- ====================================================================
-- STEP 3: Clear all existing session tokens (Force re-login)
-- This ensures clean migration - all users must login again with JWT
-- ====================================================================

UPDATE `users` 
SET 
    `session_token` = NULL,
    `admin_session_token` = NULL,
    `user_session_token` = NULL,
    `admin_refresh_token` = NULL,
    `user_refresh_token` = NULL
WHERE 1=1;

-- ====================================================================
-- STEP 4: (Optional - Future Cleanup) 
-- After migration is stable and tested, you can drop old session columns
-- UNCOMMENT THESE LINES WHEN READY TO REMOVE OLD SESSION TOKENS:
-- ====================================================================

-- ALTER TABLE `users` DROP COLUMN `session_token`;
-- ALTER TABLE `users` DROP COLUMN `admin_session_token`;
-- ALTER TABLE `users` DROP COLUMN `user_session_token`;

-- ====================================================================
-- Verification: Check new structure
-- ====================================================================

DESCRIBE `users`;

-- Count users by role
SELECT 
    role,
    CASE role
        WHEN 0 THEN 'Customer'
        WHEN 1 THEN 'Shipper'
        WHEN 2 THEN 'Admin'
    END as role_name,
    COUNT(*) as total_users,
    SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active_users
FROM `users`
GROUP BY role;

-- ====================================================================
-- Migration completed successfully
-- ====================================================================
-- Next steps:
-- 1. Update User model with JWT methods
-- 2. Update auth middleware to use JWT
-- 3. Update auth controller to generate JWT tokens
-- 4. Test login flows for both admin and user
-- 5. After stable operation, drop old session columns (Step 4)
-- ====================================================================
