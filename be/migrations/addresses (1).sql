-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 17, 2026 at 02:43 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `batechzone`
--

-- --------------------------------------------------------

--
-- Table structure for table `addresses`
--

CREATE TABLE `addresses` (
  `address_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `recipient_name` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `address_line` varchar(255) NOT NULL,
  `city` varchar(100) NOT NULL COMMENT 'Tên Tỉnh/Thành phố',
  `province_id` int(11) DEFAULT NULL COMMENT 'GHN Province ID',
  `district` varchar(100) DEFAULT NULL COMMENT 'Tên Quận/Huyện',
  `district_id` int(11) DEFAULT NULL COMMENT 'GHN District ID',
  `ward` varchar(100) DEFAULT NULL COMMENT 'Tên Phường/Xã',
  `ward_code` varchar(20) DEFAULT NULL COMMENT 'GHN Ward Code',
  `is_default` tinyint(1) DEFAULT 0,
  `type` enum('home','office','other') NOT NULL DEFAULT 'home',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `addresses`
--

INSERT INTO `addresses` (`address_id`, `user_id`, `recipient_name`, `phone`, `address_line`, `city`, `province_id`, `district`, `district_id`, `ward`, `ward_code`, `is_default`, `type`, `created_at`, `updated_at`) VALUES
(116, 27, 'Tôn Bảo', '0909887661', '32 Bùi Ngọ', 'TP. Hồ Chí Minh', 0, 'Quận 9', 0, 'Nhà Bè', '', 0, 'home', '2026-01-16 14:51:05', '2026-01-16 14:54:23'),
(117, 27, 'Trần Thị B', '0908787671', '32 Bùi Ngọ', 'hcm', NULL, 'q1', NULL, NULL, NULL, 0, 'home', '2026-01-16 14:57:23', '2026-01-16 14:57:23');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `addresses`
--
ALTER TABLE `addresses`
  ADD PRIMARY KEY (`address_id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_is_default` (`is_default`),
  ADD KEY `idx_province_id` (`province_id`),
  ADD KEY `idx_district_id` (`district_id`),
  ADD KEY `idx_ward_code` (`ward_code`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `addresses`
--
ALTER TABLE `addresses`
  MODIFY `address_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=118;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `addresses`
--
ALTER TABLE `addresses`
  ADD CONSTRAINT `addresses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
