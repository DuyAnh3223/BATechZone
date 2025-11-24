-- Migration: Separate session tokens for admin and user
-- Mục đích: Giải quyết vấn đề trùng session khi đăng nhập cả admin và user cùng lúc

-- Bước 1: Thêm 2 cột mới cho session token riêng
ALTER TABLE `users` 
ADD COLUMN `admin_session_token` VARCHAR(128) DEFAULT NULL COMMENT 'Session token for admin login' AFTER `session_token`,
ADD COLUMN `user_session_token` VARCHAR(128) DEFAULT NULL COMMENT 'Session token for user login' AFTER `admin_session_token`;

-- Bước 2: Migrate dữ liệu hiện có từ session_token sang token phù hợp
-- Admin (role = 2) -> admin_session_token
UPDATE `users` 
SET `admin_session_token` = `session_token` 
WHERE `role` = 2 AND `session_token` IS NOT NULL;

-- User (role = 0) -> user_session_token  
UPDATE `users` 
SET `user_session_token` = `session_token` 
WHERE `role` = 0 AND `session_token` IS NOT NULL;

-- Shipper (role = 1) -> user_session_token (vì shipper cũng là user)
UPDATE `users` 
SET `user_session_token` = `session_token` 
WHERE `role` = 1 AND `session_token` IS NOT NULL;

-- Bước 3: (Optional) Xóa cột session_token cũ sau khi đã migrate xong
-- Nếu muốn giữ lại để backup, có thể bỏ qua bước này
-- ALTER TABLE `users` DROP COLUMN `session_token`;

-- Bước 4: Thêm index để tối ưu query
ALTER TABLE `users` ADD INDEX `idx_admin_session` (`admin_session_token`);
ALTER TABLE `users` ADD INDEX `idx_user_session` (`user_session_token`);

-- Rollback script (nếu cần quay lại):
-- ALTER TABLE `users` DROP INDEX `idx_admin_session`;
-- ALTER TABLE `users` DROP INDEX `idx_user_session`;
-- ALTER TABLE `users` DROP COLUMN `admin_session_token`;
-- ALTER TABLE `users` DROP COLUMN `user_session_token`;
