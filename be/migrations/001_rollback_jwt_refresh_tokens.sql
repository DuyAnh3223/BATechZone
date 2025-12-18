-- ====================================================================
-- Rollback Migration: Remove JWT Refresh Token Columns
-- Date: 2025-12-17
-- Description: Rollback script to remove JWT refresh token columns
--              and restore session-based authentication
-- ====================================================================

-- ====================================================================
-- STEP 1: Remove indexes
-- ====================================================================

DROP INDEX IF EXISTS idx_admin_refresh_token ON `users`;
DROP INDEX IF EXISTS idx_user_refresh_token ON `users`;

-- ====================================================================
-- STEP 2: Clear all JWT refresh tokens
-- ====================================================================

UPDATE `users` 
SET 
    `admin_refresh_token` = NULL,
    `user_refresh_token` = NULL
WHERE 1=1;

-- ====================================================================
-- STEP 3: Remove JWT refresh token columns
-- ====================================================================

ALTER TABLE `users`
DROP COLUMN IF EXISTS `admin_refresh_token`,
DROP COLUMN IF EXISTS `user_refresh_token`;

-- ====================================================================
-- STEP 4: Clear old session tokens (force re-login with session-based auth)
-- ====================================================================

UPDATE `users` 
SET 
    `session_token` = NULL,
    `admin_session_token` = NULL,
    `user_session_token` = NULL
WHERE 1=1;

-- ====================================================================
-- Verification: Check structure
-- ====================================================================

DESCRIBE `users`;

-- Check that JWT columns are removed
SELECT COUNT(*) as jwt_columns_exist
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'batechzone' 
  AND TABLE_NAME = 'users' 
  AND COLUMN_NAME IN ('admin_refresh_token', 'user_refresh_token');

-- Should return 0 if rollback successful

-- ====================================================================
-- Rollback completed
-- ====================================================================
-- Users will need to login again with session-based authentication
-- ====================================================================
