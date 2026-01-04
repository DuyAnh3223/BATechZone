-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 04, 2026 at 01:52 PM
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
  `address_line1` varchar(255) NOT NULL,
  `address_line2` varchar(255) DEFAULT NULL,
  `city` varchar(100) NOT NULL,
  `district` varchar(100) DEFAULT NULL,
  `ward` varchar(100) DEFAULT NULL,
  `postal_code` varchar(20) DEFAULT NULL,
  `country` varchar(50) DEFAULT 'Vietnam',
  `is_default` tinyint(1) DEFAULT 0,
  `address_type` enum('home','office','other') DEFAULT 'home',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `addresses`
--

INSERT INTO `addresses` (`address_id`, `user_id`, `recipient_name`, `phone`, `address_line1`, `address_line2`, `city`, `district`, `ward`, `postal_code`, `country`, `is_default`, `address_type`, `created_at`, `updated_at`) VALUES
(53, 21, 'Nguyễn Văn A', '0908786561', '123 Thạch Lãm', NULL, 'hcm', 'Quận 1', NULL, NULL, 'Vietnam', 0, 'other', '2025-11-24 14:41:59', '2025-11-24 14:41:59'),
(71, NULL, 'Nguyễn Văn A', '0123456789', '32 Bùi Ngọ', NULL, 'hcm', 'q1', NULL, NULL, 'Vietnam', 0, 'other', '2025-12-18 05:03:36', '2025-12-18 05:03:36'),
(72, 23, 'Demo', '0908887776', '32 Demo', NULL, 'hcm', 'Quận 9', NULL, NULL, 'Vietnam', 0, 'other', '2025-12-18 05:08:23', '2025-12-18 05:08:23'),
(73, NULL, 'Demo', '0908887776', '32 Demo', NULL, 'hcm', 'Quận 12', NULL, NULL, 'Vietnam', 0, 'other', '2025-12-18 07:28:26', '2025-12-18 07:28:26'),
(74, 23, 'demo776', '0908887776', '32 Demo', NULL, 'hcm', 'Quận 5', NULL, NULL, 'Vietnam', 0, 'other', '2025-12-18 07:30:54', '2025-12-18 07:30:54'),
(75, 23, 'demo776', '0908887776', '32 Demo', NULL, 'hcm', 'Quận Gò Vấp', NULL, NULL, 'Vietnam', 0, 'other', '2025-12-18 07:39:32', '2025-12-18 07:39:32'),
(76, 23, 'demo776', '0908887776', '32 Demo', NULL, 'hcm', 'Quận 10', NULL, NULL, 'Vietnam', 0, 'other', '2025-12-18 07:58:55', '2025-12-18 07:58:55'),
(77, NULL, 'Demo', '0908887776', '32 Demo', NULL, 'hcm', 'q1', NULL, NULL, 'Vietnam', 0, 'other', '2025-12-19 14:52:09', '2025-12-19 14:52:09'),
(78, NULL, 'Demo', '0908887776', '32 Demo', NULL, 'hcm', 'q1', NULL, NULL, 'Vietnam', 0, 'other', '2025-12-20 06:57:11', '2025-12-20 06:57:11'),
(79, NULL, 'Demo', '0908887776', '32 Demo', NULL, 'hcm', 'q1', NULL, NULL, 'Vietnam', 0, 'other', '2025-12-20 06:57:14', '2025-12-20 06:57:14'),
(80, NULL, 'Demo', '0908887776', '32 Demo', NULL, 'hcm', 'q1', NULL, NULL, 'Vietnam', 0, 'other', '2025-12-20 06:57:40', '2025-12-20 06:57:40'),
(81, NULL, 'Demo', '0908887776', '32 Demo', NULL, 'hcm', 'q1', NULL, NULL, 'Vietnam', 0, 'other', '2025-12-20 06:59:04', '2025-12-20 06:59:04'),
(82, NULL, 'Demo', '0908887776', '32 Demo', NULL, 'hcm', 'q1', NULL, NULL, 'Vietnam', 0, 'other', '2025-12-20 07:07:15', '2025-12-20 07:07:15'),
(83, NULL, 'Demo', '0908887776', '32 Demo', NULL, 'hcm', 'q1', NULL, NULL, 'Vietnam', 0, 'other', '2025-12-20 07:28:51', '2025-12-20 07:28:51'),
(84, NULL, 'Demo', '0908887776', '32 Demo', NULL, 'hcm', 'q1', NULL, NULL, 'Vietnam', 0, 'other', '2025-12-20 07:33:54', '2025-12-20 07:33:54'),
(85, NULL, 'Demo', '0908887776', '32 Demo', NULL, 'hcm', 'q1', NULL, NULL, 'Vietnam', 0, 'other', '2025-12-20 07:38:14', '2025-12-20 07:38:14'),
(86, NULL, 'Demo', '0908887776', '32 Demo', NULL, 'hcm', 'q1', NULL, NULL, 'Vietnam', 0, 'other', '2025-12-20 07:48:04', '2025-12-20 07:48:04'),
(87, NULL, 'Demo', '0908887776', '32 Demo', NULL, 'hcm', 'q1', NULL, NULL, 'Vietnam', 0, 'other', '2025-12-20 07:57:06', '2025-12-20 07:57:06'),
(88, NULL, 'Demo', '0908887776', '32 Demo', NULL, 'hcm', 'q1', NULL, NULL, 'Vietnam', 0, 'other', '2025-12-20 08:01:49', '2025-12-20 08:01:49'),
(89, NULL, 'Demo', '0908887776', '32 Demo', NULL, 'hcm', 'q1', NULL, NULL, 'Vietnam', 0, 'other', '2025-12-20 08:11:12', '2025-12-20 08:11:12'),
(90, 20, 'Demo', '0908887776', '32 Demo', NULL, 'hcm', 'q1', NULL, NULL, 'Vietnam', 0, 'other', '2025-12-20 14:50:24', '2025-12-20 14:50:24'),
(91, NULL, 'Demo', '0908887776', '32 Demo', NULL, 'hcm', 'q1', NULL, NULL, 'Vietnam', 0, 'other', '2025-12-20 17:10:59', '2025-12-20 17:10:59'),
(92, 20, 'New Address', '0908787671', '32 Bùi Ngọ', NULL, 'TP. Hồ Chí Minh', NULL, NULL, NULL, 'Vietnam', 1, 'home', '2025-12-25 11:50:17', '2025-12-25 11:50:17'),
(93, 20, 'New Address1', '0908787671', '32 Bùi Ngọ', NULL, 'TP. Hồ Chí Minh', NULL, NULL, NULL, 'Vietnam', 0, 'home', '2025-12-25 11:54:41', '2025-12-25 11:54:41'),
(94, NULL, 'Trần Thị B', '0908787671', '32 Bùi Ngọ', NULL, 'hcm', 'q1', NULL, NULL, 'Vietnam', 0, 'other', '2025-12-26 11:35:27', '2025-12-26 11:35:27'),
(95, NULL, 'Trần Thị B', '0908787671', '32 Bùi Ngọ', NULL, 'hcm', 'q1', NULL, NULL, 'Vietnam', 0, 'other', '2025-12-26 11:35:30', '2025-12-26 11:35:30'),
(96, NULL, 'Trần Thị B', '0908787671', '32 Bùi Ngọ', NULL, 'hcm', 'q1', NULL, NULL, 'Vietnam', 0, 'other', '2025-12-26 11:36:57', '2025-12-26 11:36:57'),
(97, NULL, 'Trần Thị B', '0908787671', '32 Bùi Ngọ', NULL, 'hanoi', 'Ba Đình', NULL, NULL, 'Vietnam', 0, 'other', '2025-12-30 13:42:36', '2025-12-30 13:42:36'),
(98, NULL, 'Trần Thị B', '0908787671', '32 Bùi Ngọ', NULL, 'hanoi', 'Ba Đình', NULL, NULL, 'Vietnam', 0, 'other', '2025-12-30 13:49:36', '2025-12-30 13:49:36'),
(99, 23, 'demo776', '0908787671', '32 Bùi Ngọ', NULL, 'hcm', 'Quận 1', NULL, NULL, 'Vietnam', 0, 'other', '2025-12-30 14:14:56', '2025-12-30 14:14:56'),
(100, NULL, 'demo776', '0908787671', '32 Bùi Ngọ', NULL, 'hcm', 'Quận 1', NULL, NULL, 'Vietnam', 0, 'other', '2025-12-30 14:19:02', '2025-12-30 14:19:02'),
(104, NULL, 'Le Van C', '0908787671', '32 Bùi Ngọ', NULL, 'hcm', 'Quận 1', NULL, NULL, 'Vietnam', 0, 'other', '2025-12-30 15:09:35', '2025-12-30 15:09:35'),
(105, NULL, 'Trần Thị B', '0908787671', '32 Bùi Ngọ', NULL, 'hcm', 'q1', NULL, NULL, 'Vietnam', 0, 'other', '2025-12-30 15:10:38', '2025-12-30 15:10:38'),
(106, NULL, 'Nguyễn Văn A', '0908786561', '123 Thạch Lãm', NULL, 'hcm', 'q1', NULL, NULL, 'Vietnam', 0, 'other', '2025-12-30 15:13:31', '2025-12-30 15:13:31'),
(107, NULL, 'Le Van C', '0908787671', '32 Bùi Ngọ', NULL, 'hcm', 'Quận 7', NULL, NULL, 'Vietnam', 0, 'other', '2025-12-30 15:17:34', '2025-12-30 15:17:34'),
(108, NULL, 'Trần Thị B', '0908787671', '32 Bùi Ngọ', NULL, 'hcm', 'Quận 1', NULL, NULL, 'Vietnam', 0, 'other', '2025-12-30 15:51:54', '2025-12-30 15:51:54'),
(109, NULL, 'Trần Thị B', '0908787671', '32 Bùi Ngọ', NULL, 'hcm', 'Quận 1', NULL, NULL, 'Vietnam', 0, 'other', '2025-12-30 15:53:58', '2025-12-30 15:53:58'),
(111, 25, 'Phạm Văn C', '0908988881', '32 Bùi Ngọ', NULL, 'hcm', 'Quận 1', NULL, NULL, 'Vietnam', 0, 'other', '2025-12-30 16:25:54', '2025-12-30 16:25:54'),
(112, 25, 'phamvanc881', '0908988881', '32 Bùi Ngọ', NULL, 'hcm', 'Quận 7', NULL, NULL, 'Vietnam', 0, 'other', '2025-12-30 16:35:11', '2025-12-30 16:35:11');

-- --------------------------------------------------------

--
-- Table structure for table `articles`
--

CREATE TABLE `articles` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `attributes`
--

CREATE TABLE `attributes` (
  `attribute_id` int(11) NOT NULL,
  `attribute_name` varchar(100) NOT NULL,
  `display_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `attributes`
--

INSERT INTO `attributes` (`attribute_id`, `attribute_name`, `display_order`, `is_active`, `created_at`) VALUES
(1, 'Hãng', 1, 1, '2026-01-04 12:31:19'),
(2, 'Dòng CPU', 2, 1, '2026-01-04 12:31:19'),
(3, 'CPU theo Socket', 3, 1, '2026-01-04 12:31:19'),
(4, 'Thế hệ CPU', 4, 1, '2026-01-04 12:31:19'),
(5, 'Nhu cầu sử dụng', 5, 1, '2026-01-04 12:31:19'),
(6, 'Kiểu Bộ Nhớ', 6, 1, '2026-01-04 12:31:19'),
(7, 'Kích Thước Bộ Nhớ', 7, 1, '2026-01-04 12:31:19'),
(8, 'Dung Lượng', 8, 1, '2026-01-04 12:31:19'),
(9, 'Loại Ổ Cứng', 9, 1, '2026-01-04 12:31:19'),
(10, 'Giao diện PCIe', 10, 1, '2026-01-04 12:31:19'),
(11, 'Socket Hỗ Trợ', 11, 1, '2026-01-04 12:31:19'),
(12, 'Chipset', 12, 1, '2026-01-04 12:31:19'),
(13, 'Kiểu Kích Thước (Form Factor)', 13, 1, '2026-01-04 12:31:19'),
(14, 'Số Khe Cắm RAM', 14, 1, '2026-01-04 12:31:19'),
(15, 'Công Suất Nguồn', 15, 1, '2026-01-04 12:31:19'),
(16, 'Chuẩn Nguồn', 16, 1, '2026-01-04 12:31:19'),
(17, 'Kiểu Dây Nguồn', 17, 1, '2026-01-04 12:31:19'),
(18, 'Kích Cỡ', 18, 1, '2026-01-04 12:31:19'),
(19, 'Kích thước Mainboard', 19, 1, '2026-01-04 12:31:19'),
(20, 'Tốc Độ Vòng Quay', 20, 1, '2026-01-04 12:31:19'),
(21, 'Loại RAM', 21, 1, '2026-01-04 12:31:19'),
(22, 'Bus RAM', 22, 1, '2026-01-04 12:31:19'),
(23, 'Tần Số Quét', 23, 1, '2026-01-04 12:31:19'),
(24, 'Độ Phân Giải', 24, 1, '2026-01-04 12:31:19'),
(25, 'Tấm Nền', 25, 1, '2026-01-04 12:31:19'),
(26, 'Kích Thước', 26, 1, '2026-01-04 12:31:19');

-- --------------------------------------------------------

--
-- Table structure for table `attributes_categories`
--

CREATE TABLE `attributes_categories` (
  `attribute_category_id` int(11) NOT NULL,
  `attribute_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `is_variant_attribute` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `attributes_categories`
--

INSERT INTO `attributes_categories` (`attribute_category_id`, `attribute_id`, `category_id`, `is_variant_attribute`) VALUES
(1, 1, 1, 0),
(2, 2, 1, 0),
(3, 3, 1, 0),
(4, 4, 1, 0),
(5, 1, 2, 0),
(6, 5, 2, 0),
(7, 6, 2, 0),
(8, 7, 2, 0),
(9, 1, 4, 0),
(10, 8, 4, 1),
(11, 9, 4, 0),
(12, 10, 4, 0),
(13, 1, 5, 0),
(14, 11, 5, 0),
(15, 12, 5, 0),
(16, 13, 5, 0),
(17, 14, 5, 0),
(18, 1, 6, 0),
(19, 15, 6, 1),
(20, 16, 6, 0),
(21, 17, 6, 0),
(22, 1, 7, 0),
(23, 18, 7, 0),
(24, 19, 7, 0),
(25, 1, 13, 0),
(26, 8, 13, 1),
(27, 20, 13, 0),
(28, 21, 35, 0),
(29, 1, 35, 0),
(30, 22, 35, 0),
(31, 8, 35, 1),
(32, 1, 40, 0),
(33, 23, 40, 0),
(34, 24, 40, 0),
(35, 25, 40, 0),
(36, 26, 40, 0);

-- --------------------------------------------------------

--
-- Table structure for table `attribute_values`
--

CREATE TABLE `attribute_values` (
  `attribute_value_id` int(11) NOT NULL,
  `attribute_id` int(11) NOT NULL,
  `value_name` varchar(100) NOT NULL,
  `display_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `attribute_values`
--

INSERT INTO `attribute_values` (`attribute_value_id`, `attribute_id`, `value_name`, `display_order`, `is_active`, `created_at`) VALUES
(1, 1, 'Intel', 1, 1, '2026-01-04 12:31:19'),
(2, 1, 'AMD', 2, 1, '2026-01-04 12:31:19'),
(3, 1, 'NVIDIA', 3, 1, '2026-01-04 12:31:19'),
(4, 1, 'Asus', 4, 1, '2026-01-04 12:31:19'),
(5, 1, 'Gigabyte', 5, 1, '2026-01-04 12:31:19'),
(6, 1, 'MSI', 6, 1, '2026-01-04 12:31:19'),
(7, 1, 'Asrock', 7, 1, '2026-01-04 12:31:19'),
(8, 1, 'Sapphire', 8, 1, '2026-01-04 12:31:19'),
(9, 1, 'Inno3D', 9, 1, '2026-01-04 12:31:19'),
(10, 1, 'Colorful', 10, 1, '2026-01-04 12:31:19'),
(11, 1, 'Corsair', 11, 1, '2026-01-04 12:31:19'),
(12, 1, 'Western Digital', 12, 1, '2026-01-04 12:31:19'),
(13, 1, 'Samsung', 13, 1, '2026-01-04 12:31:19'),
(14, 1, 'Lexar', 14, 1, '2026-01-04 12:31:19'),
(15, 1, 'Kingston', 15, 1, '2026-01-04 12:31:19'),
(16, 1, 'PNY', 16, 1, '2026-01-04 12:31:19'),
(17, 1, 'Apacer', 17, 1, '2026-01-04 12:31:19'),
(18, 1, 'Seagate', 18, 1, '2026-01-04 12:31:19'),
(19, 1, 'Toshiba', 19, 1, '2026-01-04 12:31:19'),
(20, 1, 'Adata', 20, 1, '2026-01-04 12:31:19'),
(21, 1, 'GSkill', 21, 1, '2026-01-04 12:31:19'),
(22, 1, 'TeamGroup', 22, 1, '2026-01-04 12:31:19'),
(23, 1, 'KingMax', 23, 1, '2026-01-04 12:31:19'),
(24, 1, 'Xigmatek', 24, 1, '2026-01-04 12:31:19'),
(25, 1, 'Cooler Master', 25, 1, '2026-01-04 12:31:19'),
(26, 1, 'Antec', 26, 1, '2026-01-04 12:31:19'),
(27, 1, 'Segotep', 27, 1, '2026-01-04 12:31:19'),
(28, 1, 'Cougar', 28, 1, '2026-01-04 12:31:19'),
(29, 1, 'Jonsbo', 29, 1, '2026-01-04 12:31:19'),
(30, 1, 'Viewsonic', 30, 1, '2026-01-04 12:31:19'),
(31, 1, 'AOC', 31, 1, '2026-01-04 12:31:19'),
(32, 1, 'VSP', 32, 1, '2026-01-04 12:31:19'),
(33, 1, 'Dell', 33, 1, '2026-01-04 12:31:19'),
(34, 1, 'HP', 34, 1, '2026-01-04 12:31:19'),
(35, 2, 'Intel Core I3', 1, 1, '2026-01-04 12:31:19'),
(36, 2, 'Intel Core I5', 2, 1, '2026-01-04 12:31:19'),
(37, 2, 'Intel Core I7', 3, 1, '2026-01-04 12:31:19'),
(38, 2, 'AMD Ryzen 3', 4, 1, '2026-01-04 12:31:19'),
(39, 2, 'AMD Ryzen 5', 5, 1, '2026-01-04 12:31:19'),
(40, 2, 'AMD Ryzen 7', 6, 1, '2026-01-04 12:31:19'),
(41, 2, 'Intel Core Ultra 5', 7, 1, '2026-01-04 12:31:19'),
(42, 2, 'Intel Core Ultra 7', 8, 1, '2026-01-04 12:31:19'),
(43, 3, 'LGA 1200 (10th)', 1, 1, '2026-01-04 12:31:19'),
(44, 3, 'LGA 1700 (12th, 13th, 14th)', 2, 1, '2026-01-04 12:31:19'),
(45, 3, 'LGA 1851 (Core Ultra)', 3, 1, '2026-01-04 12:31:19'),
(46, 3, 'AM4 (3000, 5000)', 4, 1, '2026-01-04 12:31:19'),
(47, 3, 'AM5 (7000, 9000)', 5, 1, '2026-01-04 12:31:19'),
(48, 4, 'Intel Cooper Lake (10th)', 1, 1, '2026-01-04 12:31:19'),
(49, 4, 'Intel Alder Lake (12th)', 2, 1, '2026-01-04 12:31:19'),
(50, 4, 'Intel Raptor Lake (13th)', 3, 1, '2026-01-04 12:31:19'),
(51, 4, 'Intel Raptor Lake Refresh (14th)', 4, 1, '2026-01-04 12:31:19'),
(52, 4, 'Intel Arrow Lake (Core Ultra)', 5, 1, '2026-01-04 12:31:19'),
(53, 4, 'AMD Ryzen 3000 series', 6, 1, '2026-01-04 12:31:19'),
(54, 4, 'AMD Ryzen 5000 series', 7, 1, '2026-01-04 12:31:19'),
(55, 4, 'AMD Ryzen 7000 series', 8, 1, '2026-01-04 12:31:19'),
(56, 4, 'AMD Ryzen 9000 series', 9, 1, '2026-01-04 12:31:19'),
(57, 5, 'Gaming', 1, 1, '2026-01-04 12:31:19'),
(58, 5, 'Đồ Họa, Kiến Trúc', 2, 1, '2026-01-04 12:31:19'),
(59, 5, 'Phổ Thông, Văn Phòng', 3, 1, '2026-01-04 12:31:19'),
(60, 6, 'GDDR5', 1, 1, '2026-01-04 12:31:19'),
(61, 6, 'GDDR6', 2, 1, '2026-01-04 12:31:19'),
(62, 6, 'GDD6X', 3, 1, '2026-01-04 12:31:19'),
(63, 6, 'GDDR7', 4, 1, '2026-01-04 12:31:19'),
(64, 7, '2GB', 1, 1, '2026-01-04 12:31:19'),
(65, 7, '4GB', 2, 1, '2026-01-04 12:31:19'),
(66, 7, '6GB', 3, 1, '2026-01-04 12:31:19'),
(67, 7, '8GB', 4, 1, '2026-01-04 12:31:19'),
(68, 7, '12GB', 5, 1, '2026-01-04 12:31:19'),
(69, 7, '16GB', 6, 1, '2026-01-04 12:31:19'),
(70, 8, '128GB', 1, 1, '2026-01-04 12:31:19'),
(71, 8, '256GB', 2, 1, '2026-01-04 12:31:19'),
(72, 8, '512GB', 3, 1, '2026-01-04 12:31:19'),
(73, 8, '1TB', 4, 1, '2026-01-04 12:31:19'),
(74, 8, '2TB', 5, 1, '2026-01-04 12:31:19'),
(75, 8, '4TB', 6, 1, '2026-01-04 12:31:19'),
(76, 8, '6TB', 7, 1, '2026-01-04 12:31:19'),
(77, 8, '8TB', 8, 1, '2026-01-04 12:31:19'),
(78, 8, '10TB', 9, 1, '2026-01-04 12:31:19'),
(79, 8, '8GB ( 1 X 8GB)', 10, 1, '2026-01-04 12:31:19'),
(80, 8, '16GB (1 X 16GB)', 11, 1, '2026-01-04 12:31:19'),
(81, 8, '16GB (2 X 8GB)', 12, 1, '2026-01-04 12:31:19'),
(82, 8, '32GB (1 X 32GB)', 13, 1, '2026-01-04 12:31:19'),
(83, 8, '32GB (2 X 16GB)', 14, 1, '2026-01-04 12:31:19'),
(84, 9, '2.5\" SATA', 1, 1, '2026-01-04 12:31:19'),
(85, 9, 'M.2 SATA', 2, 1, '2026-01-04 12:31:19'),
(86, 9, 'M.2 NVME', 3, 1, '2026-01-04 12:31:19'),
(87, 10, 'PCIe Gen 3.0 x4', 1, 1, '2026-01-04 12:31:19'),
(88, 10, 'PCIe Gen 4.0 x4', 2, 1, '2026-01-04 12:31:19'),
(89, 10, 'PCIe Gen 5.0 x4', 3, 1, '2026-01-04 12:31:19'),
(90, 11, 'LGA 1200 (10th)', 1, 1, '2026-01-04 12:31:19'),
(91, 11, 'LGA 1700 (12th, 13th, 14th)', 2, 1, '2026-01-04 12:31:19'),
(92, 11, 'LGA 1851 (Core Ultra)', 3, 1, '2026-01-04 12:31:19'),
(93, 11, 'AM4 (3000, 5000)', 4, 1, '2026-01-04 12:31:19'),
(94, 11, 'AM5 (7000, 9000)', 5, 1, '2026-01-04 12:31:19'),
(95, 12, 'Intel H510 (LGA 1200)', 1, 1, '2026-01-04 12:31:19'),
(96, 12, 'Intel B560 (LGA 1200)', 2, 1, '2026-01-04 12:31:19'),
(97, 12, 'Intel Z590 (LGA 1200)', 3, 1, '2026-01-04 12:31:19'),
(98, 12, 'Intel H610 (LGA 1700)', 4, 1, '2026-01-04 12:31:19'),
(99, 12, 'Intel B760 (LGA 1700)', 5, 1, '2026-01-04 12:31:19'),
(100, 12, 'Intel Z790 (LGA 1700)', 6, 1, '2026-01-04 12:31:19'),
(101, 12, 'Intel B860 (LGA 1851)', 7, 1, '2026-01-04 12:31:19'),
(102, 12, 'Intel Z890 (LGA 1851)', 8, 1, '2026-01-04 12:31:19'),
(103, 12, 'AMD B450 (AM4)', 9, 1, '2026-01-04 12:31:19'),
(104, 12, 'AMD A520 (AM4)', 10, 1, '2026-01-04 12:31:19'),
(105, 12, 'AMD A620 (AM5)', 11, 1, '2026-01-04 12:31:19'),
(106, 12, 'AMD B650 (AM5)', 12, 1, '2026-01-04 12:31:19'),
(107, 12, 'AMD X670 (AM5)', 13, 1, '2026-01-04 12:31:19'),
(108, 13, 'Mini ITX', 1, 1, '2026-01-04 12:31:19'),
(109, 13, 'M-ATX', 2, 1, '2026-01-04 12:31:19'),
(110, 13, 'ATX', 3, 1, '2026-01-04 12:31:19'),
(111, 13, 'E-ATX', 4, 1, '2026-01-04 12:31:19'),
(112, 14, '2 khe', 1, 1, '2026-01-04 12:31:19'),
(113, 14, '4 khe', 2, 1, '2026-01-04 12:31:19'),
(114, 14, '8 khe', 3, 1, '2026-01-04 12:31:19'),
(115, 15, '350W', 1, 1, '2026-01-04 12:31:19'),
(116, 15, '400W', 2, 1, '2026-01-04 12:31:19'),
(117, 15, '450W', 3, 1, '2026-01-04 12:31:19'),
(118, 15, '500W', 4, 1, '2026-01-04 12:31:19'),
(119, 15, '650W', 5, 1, '2026-01-04 12:31:19'),
(120, 15, '800W', 6, 1, '2026-01-04 12:31:19'),
(121, 15, '1000W', 7, 1, '2026-01-04 12:31:19'),
(122, 16, '80 Plus', 1, 1, '2026-01-04 12:31:19'),
(123, 16, '80 Plus Bronze', 2, 1, '2026-01-04 12:31:19'),
(124, 16, '80 Plus Silver', 3, 1, '2026-01-04 12:31:19'),
(125, 16, '80 Plus Gold', 4, 1, '2026-01-04 12:31:19'),
(126, 16, '80 Plus Platinum', 5, 1, '2026-01-04 12:31:19'),
(127, 17, 'Non Modular (Dây liền)', 1, 1, '2026-01-04 12:31:19'),
(128, 17, 'Full Modular (Dây rời)', 2, 1, '2026-01-04 12:31:19'),
(129, 18, 'Full Tower', 1, 1, '2026-01-04 12:31:19'),
(130, 18, 'Mid Tower', 2, 1, '2026-01-04 12:31:19'),
(131, 18, 'Mini Tower', 3, 1, '2026-01-04 12:31:19'),
(132, 18, 'Mini ITX', 4, 1, '2026-01-04 12:31:19'),
(133, 19, 'Mini – ITX', 1, 1, '2026-01-04 12:31:19'),
(134, 19, 'M- ATX', 2, 1, '2026-01-04 12:31:19'),
(135, 19, 'ATX', 3, 1, '2026-01-04 12:31:19'),
(136, 19, 'E-ATX', 4, 1, '2026-01-04 12:31:19'),
(137, 20, '5400 RPM', 1, 1, '2026-01-04 12:31:19'),
(138, 20, '7200 RPM', 2, 1, '2026-01-04 12:31:19'),
(139, 21, 'DDR4', 1, 1, '2026-01-04 12:31:19'),
(140, 21, 'DDR5', 2, 1, '2026-01-04 12:31:19'),
(141, 22, 'DDR4 3200 MHz', 1, 1, '2026-01-04 12:31:19'),
(142, 22, 'DDR4 3600 MHz', 2, 1, '2026-01-04 12:31:19'),
(143, 22, 'DDR5 6000 Mhz', 3, 1, '2026-01-04 12:31:19'),
(144, 22, 'DDR5 5600 Mhz', 4, 1, '2026-01-04 12:31:19'),
(145, 22, 'DDR5 6400 Mhz', 5, 1, '2026-01-04 12:31:19'),
(146, 22, 'DDR5 5200 MHz', 6, 1, '2026-01-04 12:31:19'),
(147, 23, '60 Hz', 1, 1, '2026-01-04 12:31:19'),
(148, 23, '75 Hz', 2, 1, '2026-01-04 12:31:19'),
(149, 23, '100 Hz', 3, 1, '2026-01-04 12:31:19'),
(150, 23, '120 Hz', 4, 1, '2026-01-04 12:31:19'),
(151, 23, '144 Hz', 5, 1, '2026-01-04 12:31:19'),
(152, 23, '165 Hz', 6, 1, '2026-01-04 12:31:19'),
(153, 23, '180 Hz', 7, 1, '2026-01-04 12:31:19'),
(154, 23, '240 Hz', 8, 1, '2026-01-04 12:31:19'),
(155, 23, '360 Hz', 9, 1, '2026-01-04 12:31:19'),
(156, 24, 'HD + (1600 * 900)', 1, 1, '2026-01-04 12:31:19'),
(157, 24, 'Full HD (1920 *1080)', 2, 1, '2026-01-04 12:31:19'),
(158, 24, '2K QHD (2560x1440)', 3, 1, '2026-01-04 12:31:19'),
(159, 24, '4K (3840x2160)', 4, 1, '2026-01-04 12:31:19'),
(160, 25, 'IPS', 1, 1, '2026-01-04 12:31:19'),
(161, 25, 'VA', 2, 1, '2026-01-04 12:31:19'),
(162, 25, 'TN', 3, 1, '2026-01-04 12:31:19'),
(163, 26, '15.6 inch', 1, 1, '2026-01-04 12:31:19'),
(164, 26, '21.5 inch', 2, 1, '2026-01-04 12:31:19'),
(165, 26, '23.8 inch', 3, 1, '2026-01-04 12:31:19'),
(166, 26, '24.5 inch', 4, 1, '2026-01-04 12:31:19'),
(167, 26, '27 inch', 5, 1, '2026-01-04 12:31:19'),
(168, 26, '32 inch', 6, 1, '2026-01-04 12:31:19');

-- --------------------------------------------------------

--
-- Table structure for table `builds`
--

CREATE TABLE `builds` (
  `build_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `build_name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `total_price` decimal(12,2) DEFAULT 0.00,
  `is_public` tinyint(1) DEFAULT 0,
  `is_saved` tinyint(1) DEFAULT 1,
  `view_count` int(11) DEFAULT 0,
  `like_count` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `build_items`
--

CREATE TABLE `build_items` (
  `build_item_id` int(11) NOT NULL,
  `build_id` int(11) NOT NULL,
  `variant_id` int(11) NOT NULL,
  `component_type` varchar(50) DEFAULT NULL COMMENT 'CPU, GPU, RAM, Motherboard, etc.',
  `quantity` int(11) DEFAULT 1,
  `unit_price` decimal(12,2) NOT NULL,
  `notes` text DEFAULT NULL,
  `added_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `carts`
--

CREATE TABLE `carts` (
  `cart_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `session_id` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `expires_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `carts`
--

INSERT INTO `carts` (`cart_id`, `user_id`, `session_id`, `created_at`, `updated_at`, `expires_at`) VALUES
(1, NULL, 'guest_1763223671171_m9llpews6', '2025-11-15 16:30:52', '2025-11-15 16:30:52', '2025-12-15 16:30:52'),
(2, 6, NULL, '2025-11-16 02:29:53', '2025-11-16 02:29:53', '2025-12-16 02:29:53'),
(3, 6, NULL, '2025-11-16 02:29:53', '2025-11-16 02:29:53', '2025-12-16 02:29:53'),
(5, NULL, 'guest_1763273048440_dxnpt7o32', '2025-11-16 06:04:08', '2025-11-16 06:04:08', '2025-12-16 06:04:08'),
(6, NULL, 'guest_1763273048440_dxnpt7o32', '2025-11-16 06:04:08', '2025-11-16 06:04:08', '2025-12-16 06:04:08'),
(10, 20, NULL, '2025-11-24 13:26:23', '2025-11-24 13:26:23', '2025-12-24 13:26:23'),
(11, NULL, 'guest_1764417657819_1l2bl5eju', '2025-11-29 12:00:57', '2025-11-29 12:00:57', '2025-12-29 12:00:57'),
(12, NULL, 'guest_1764904178852_7r4onzqri', '2025-12-05 03:09:38', '2025-12-05 03:09:38', '2026-01-04 03:09:38'),
(13, NULL, 'guest_1764904178852_7r4onzqri', '2025-12-05 03:09:38', '2025-12-05 03:09:38', '2026-01-04 03:09:38'),
(14, NULL, 'guest_1765438362367_iykvwb2wy', '2025-12-11 07:32:42', '2025-12-11 07:32:42', '2026-01-10 07:32:42'),
(15, 23, NULL, '2025-12-18 05:10:55', '2025-12-18 05:10:55', '2026-01-17 05:10:55'),
(17, 25, NULL, '2025-12-30 16:26:21', '2025-12-30 16:26:21', '2026-01-29 16:26:21');

-- --------------------------------------------------------

--
-- Table structure for table `cart_items`
--

CREATE TABLE `cart_items` (
  `cart_item_id` int(11) NOT NULL,
  `cart_id` int(11) NOT NULL,
  `variant_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `added_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `category_id` int(11) NOT NULL,
  `category_name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `parent_category_id` int(11) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `icon` varchar(100) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `display_order` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`category_id`, `category_name`, `description`, `parent_category_id`, `image_url`, `icon`, `is_active`, `display_order`, `created_at`, `updated_at`) VALUES
(1, 'CPU', 'Bộ vi xử lý trung tâm (Central Processing Unit) - Lựa chọn CPU phù hợp cho hệ thống của bạn', NULL, '/uploads/categories/CPU-1763457142421-41099656.webp', NULL, 1, 1, '2025-11-05 12:37:11', '2025-11-18 09:12:22'),
(2, 'VGA', 'Card đồ họa (Video Graphics Array) - Card màn hình cao cấp cho gaming và đồ họa', NULL, '/uploads/categories/VGA-1763457150324-84510626.webp', NULL, 1, 2, '2025-11-05 12:37:11', '2025-11-18 09:12:30'),
(4, 'SSD', 'Ổ cứng thể rắn (Solid State Drive) - SSD NVMe, SATA tốc độ cao', NULL, '/uploads/categories/SSD-1763457167579-214129801.webp', NULL, 1, 4, '2025-11-05 12:37:11', '2025-11-18 09:12:47'),
(5, 'Mainboard', 'Bo mạch chủ (Motherboard) - Mainboard Intel, AMD các dòng ATX, mATX, ITX', NULL, '/uploads/categories/MAINBOARD-1763457180313-19278038.webp', NULL, 1, 5, '2025-11-05 12:37:11', '2025-11-18 09:13:00'),
(6, 'PSU', 'Bộ nguồn máy tính (Power Supply Unit) - PSU 80 Plus Bronze, Gold, Platinum', NULL, '/uploads/categories/PSU-1763457190031-894247274.webp', NULL, 1, 6, '2025-11-05 12:37:11', '2025-11-18 09:13:10'),
(7, 'Case', 'Vỏ máy tính (Computer Case) - Case PC ATX, mATX, ITX với quạt RGB, tản nhiệt tốt', NULL, '/uploads/categories/CASE-1763457197140-926410204.webp', NULL, 1, 7, '2025-11-05 12:37:11', '2025-11-18 09:13:17'),
(8, 'Cooling', 'Tản nhiệt và làm mát - Quạt case, tản nhiệt CPU, tản nhiệt nước AIO', NULL, '/uploads/categories/cooling-1763787556488-628471150.jpg', NULL, 1, 8, '2025-11-05 12:37:11', '2025-11-22 04:59:16'),
(13, 'HDD', 'Ổ đĩa cứng (Hard Disk Drive) là thiết bị lưu trữ dữ liệu chính cho máy tính', NULL, '/uploads/categories/hdd-1763456945816-496007346.jpg', NULL, 1, 0, '2025-11-08 14:08:34', '2025-11-18 09:09:05'),
(35, 'RAM', NULL, NULL, '/uploads/categories/RAM-1763457131288-611013067.webp', NULL, 1, 0, '2025-11-16 13:14:05', '2025-11-18 09:12:11'),
(40, 'Monitor', 'Màn hình máy tính - Gaming monitor, màn hình văn phòng', NULL, '/uploads/categories/monitor-1764063376896-496519534.jpg', NULL, 1, 40, '2025-11-25 08:58:13', '2025-11-25 09:36:16'),
(41, 'Keyboard', 'Bàn phím - Bàn phím cơ, bàn phím gaming', NULL, '/uploads/categories/keyboard-1764062589551-543344518.jpg', NULL, 1, 41, '2025-11-25 08:58:13', '2025-11-25 09:23:09'),
(42, 'Mouse', 'Chuột máy tính - Chuột gaming, chuột văn phòng', NULL, '/uploads/categories/mousewebp-1764063346830-923804201.jpg', NULL, 1, 42, '2025-11-25 08:58:13', '2025-11-25 09:35:46'),
(43, 'Headphone', 'Tai nghe - Tai nghe gaming, tai nghe văn phòng', NULL, '/uploads/categories/headphone-1764063358432-185276737.jpg', NULL, 1, 43, '2025-11-25 08:58:13', '2025-11-25 09:35:58'),
(44, 'Speaker', 'Loa máy tính - Loa 2.0, 2.1, 5.1', NULL, '/uploads/categories/speaker-1764063399190-71396739.jpg', NULL, 1, 44, '2025-11-25 08:58:13', '2025-11-25 09:36:39'),
(45, 'Gaming Chair', 'Ghế gaming - Ghế công thái học, ghế gaming cao cấp', NULL, '/uploads/categories/gaming_chair-1764062273403-428459301.jpg', NULL, 1, 45, '2025-11-25 08:58:13', '2025-11-25 09:17:53'),
(46, 'Case Fan', 'Quạt case - Quạt tản nhiệt RGB, quạt PWM', NULL, '/uploads/categories/case_fan-1764062438647-791625777.jpg', NULL, 1, 46, '2025-11-25 08:58:13', '2025-11-25 09:20:38'),
(47, 'Air Cooler', 'Tản nhiệt khí - Tản nhiệt CPU tower, dual tower', 8, '/uploads/categories/air_cooler-1764063453689-131504214.jpg', NULL, 1, 47, '2025-11-25 08:58:13', '2025-11-25 09:37:33'),
(48, 'AIO Cooler', 'Tản nhiệt nước AIO - Tản nước 240mm, 360mm', 8, '/uploads/categories/aio_cooler-1764063468237-385237851.jpg', NULL, 1, 48, '2025-11-25 08:58:13', '2025-11-25 09:37:48'),
(49, 'Custom Water', 'Tản nhiệt nước custom - Bộ kit tản nước custom loop', 8, '/uploads/categories/custom_water-1764063311202-157641460.jpg', NULL, 1, 49, '2025-11-25 08:58:13', '2025-11-25 10:40:27');

-- --------------------------------------------------------

--
-- Table structure for table `categories_attributes_values`
--

CREATE TABLE `categories_attributes_values` (
  `cav_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `attribute_id` int(11) NOT NULL,
  `attribute_value_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories_attributes_values`
--

INSERT INTO `categories_attributes_values` (`cav_id`, `category_id`, `attribute_id`, `attribute_value_id`) VALUES
(1, 1, 1, 2),
(2, 1, 1, 1),
(4, 1, 2, 35),
(5, 1, 2, 36),
(6, 1, 2, 37),
(7, 1, 2, 38),
(8, 1, 2, 39),
(9, 1, 2, 40),
(10, 1, 2, 41),
(11, 1, 2, 42),
(19, 1, 3, 43),
(20, 1, 3, 44),
(21, 1, 3, 45),
(22, 1, 3, 46),
(23, 1, 3, 47),
(26, 1, 4, 48),
(27, 1, 4, 49),
(28, 1, 4, 50),
(29, 1, 4, 51),
(30, 1, 4, 52),
(31, 1, 4, 53),
(32, 1, 4, 54),
(33, 1, 4, 55),
(34, 1, 4, 56),
(41, 2, 1, 2),
(42, 2, 1, 7),
(43, 2, 1, 4),
(44, 2, 1, 10),
(45, 2, 1, 5),
(46, 2, 1, 9),
(47, 2, 1, 6),
(48, 2, 1, 3),
(49, 2, 1, 8),
(56, 2, 5, 57),
(57, 2, 5, 58),
(58, 2, 5, 59),
(59, 2, 6, 60),
(60, 2, 6, 61),
(61, 2, 6, 62),
(62, 2, 6, 63),
(66, 2, 7, 64),
(67, 2, 7, 65),
(68, 2, 7, 66),
(69, 2, 7, 67),
(70, 2, 7, 68),
(71, 2, 7, 69),
(73, 4, 1, 17),
(74, 4, 1, 11),
(75, 4, 1, 5),
(76, 4, 1, 15),
(77, 4, 1, 14),
(78, 4, 1, 6),
(79, 4, 1, 16),
(80, 4, 1, 13),
(81, 4, 1, 12),
(88, 4, 8, 70),
(89, 4, 8, 73),
(90, 4, 8, 71),
(91, 4, 8, 74),
(92, 4, 8, 72),
(95, 4, 9, 84),
(96, 4, 9, 85),
(97, 4, 9, 86),
(98, 4, 10, 87),
(99, 4, 10, 88),
(100, 4, 10, 89),
(101, 5, 1, 2),
(102, 5, 1, 7),
(103, 5, 1, 4),
(104, 5, 1, 5),
(105, 5, 1, 1),
(106, 5, 1, 6),
(108, 5, 11, 90),
(109, 5, 11, 91),
(110, 5, 11, 92),
(111, 5, 11, 93),
(112, 5, 11, 94),
(115, 5, 12, 95),
(116, 5, 12, 96),
(117, 5, 12, 97),
(118, 5, 12, 98),
(119, 5, 12, 99),
(120, 5, 12, 100),
(121, 5, 12, 101),
(122, 5, 12, 102),
(123, 5, 12, 103),
(124, 5, 12, 104),
(125, 5, 12, 105),
(126, 5, 12, 106),
(127, 5, 12, 107),
(130, 5, 13, 108),
(131, 5, 13, 109),
(132, 5, 13, 110),
(133, 5, 13, 111),
(137, 5, 14, 112),
(138, 5, 14, 113),
(139, 5, 14, 114),
(140, 6, 1, 26),
(141, 6, 1, 4),
(142, 6, 1, 25),
(143, 6, 1, 11),
(144, 6, 1, 5),
(145, 6, 1, 6),
(146, 6, 1, 24),
(147, 6, 15, 115),
(148, 6, 15, 116),
(149, 6, 15, 117),
(150, 6, 15, 118),
(151, 6, 15, 119),
(152, 6, 15, 120),
(153, 6, 15, 121),
(154, 6, 16, 122),
(155, 6, 16, 123),
(156, 6, 16, 124),
(157, 6, 16, 125),
(158, 6, 16, 126),
(161, 6, 17, 127),
(162, 6, 17, 128),
(164, 7, 1, 4),
(165, 7, 1, 25),
(166, 7, 1, 11),
(167, 7, 1, 28),
(168, 7, 1, 29),
(169, 7, 1, 6),
(170, 7, 1, 27),
(171, 7, 1, 24),
(179, 7, 18, 129),
(180, 7, 18, 130),
(181, 7, 18, 131),
(182, 7, 18, 132),
(186, 7, 19, 133),
(187, 7, 19, 134),
(188, 7, 19, 135),
(189, 7, 19, 136),
(193, 13, 1, 18),
(194, 13, 1, 19),
(195, 13, 1, 12),
(196, 13, 8, 78),
(197, 13, 8, 73),
(198, 13, 8, 74),
(199, 13, 8, 75),
(200, 13, 8, 76),
(201, 13, 8, 77),
(203, 13, 20, 137),
(204, 13, 20, 138),
(206, 35, 21, 139),
(207, 35, 21, 140),
(209, 35, 1, 20),
(210, 35, 1, 11),
(211, 35, 1, 21),
(212, 35, 1, 23),
(213, 35, 1, 15),
(214, 35, 1, 14),
(215, 35, 1, 16),
(216, 35, 1, 22),
(224, 35, 22, 141),
(225, 35, 22, 142),
(226, 35, 22, 143),
(227, 35, 22, 144),
(228, 35, 22, 145),
(229, 35, 22, 146),
(231, 35, 8, 80),
(232, 35, 8, 81),
(233, 35, 8, 82),
(234, 35, 8, 83),
(235, 35, 8, 79),
(238, 40, 1, 31),
(239, 40, 1, 4),
(240, 40, 1, 33),
(241, 40, 1, 5),
(242, 40, 1, 34),
(243, 40, 1, 6),
(244, 40, 1, 13),
(245, 40, 1, 30),
(246, 40, 1, 32),
(253, 40, 23, 147),
(254, 40, 23, 148),
(255, 40, 23, 149),
(256, 40, 23, 150),
(257, 40, 23, 151),
(258, 40, 23, 152),
(259, 40, 23, 153),
(260, 40, 23, 154),
(261, 40, 23, 155),
(268, 40, 24, 156),
(269, 40, 24, 157),
(270, 40, 24, 158),
(271, 40, 24, 159),
(275, 40, 25, 160),
(276, 40, 25, 161),
(277, 40, 25, 162),
(278, 40, 26, 163),
(279, 40, 26, 164),
(280, 40, 26, 165),
(281, 40, 26, 166),
(282, 40, 26, 167),
(283, 40, 26, 168);

-- --------------------------------------------------------

--
-- Table structure for table `coupons`
--

CREATE TABLE `coupons` (
  `coupon_id` int(11) NOT NULL,
  `coupon_code` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `discount_type` enum('percentage','fixed_amount') NOT NULL,
  `discount_value` decimal(10,2) NOT NULL,
  `max_discount_amount` decimal(10,2) DEFAULT NULL,
  `min_order_amount` decimal(10,2) DEFAULT 0.00,
  `usage_limit` int(11) DEFAULT NULL,
  `used_count` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `valid_from` timestamp NOT NULL DEFAULT current_timestamp(),
  `valid_until` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `coupons`
--

INSERT INTO `coupons` (`coupon_id`, `coupon_code`, `description`, `discount_type`, `discount_value`, `max_discount_amount`, `min_order_amount`, `usage_limit`, `used_count`, `is_active`, `valid_from`, `valid_until`, `created_at`) VALUES
(1, 'SALE10', 'Giảm 10% cho đơn hàng từ 200.000đ', 'percentage', 10.00, 50000.00, 200000.00, 100, 0, 1, '2025-10-31 17:00:00', '2025-12-31 16:59:59', '2025-11-05 10:19:14'),
(2, 'DISCOUNT50', 'Giảm 50.000đ cho đơn hàng từ 300.000đ', 'fixed_amount', 50000.00, NULL, 300000.00, 50, 0, 1, '2025-10-31 17:00:00', '2025-12-31 16:59:59', '2025-11-05 10:19:14'),
(3, 'NEWUSER20', 'Giảm 20% cho khách hàng mới', 'percentage', 20.00, 100000.00, 0.00, 1, 0, 1, '2025-10-31 17:00:00', '2025-12-31 17:00:00', '2025-11-05 10:19:14'),
(4, 'BIGSALE100', 'Giảm 100.000đ cho đơn hàng từ 1.000.000đ', 'fixed_amount', 100000.00, NULL, 1000000.00, 500, 1, 1, '2025-10-31 17:00:00', '2025-12-24 17:00:00', '2025-11-05 10:19:14'),
(5, 'FREESHIP15', 'Giảm 15% cho tất cả đơn hàng', 'percentage', 15.00, 100000.00, 0.00, NULL, 3, 1, '2025-10-31 17:00:00', '2025-12-30 17:00:00', '2025-11-05 10:19:14'),
(6, 'BLACKFRIDAY', 'Giảm 30% tối đa 150.000đ cho mọi đơn hàng', 'percentage', 30.00, 150000.00, 0.00, 200, 0, 1, '2025-11-24 17:00:00', '2025-11-30 16:59:59', '2025-11-05 10:19:14'),
(7, 'WELCOME50', 'Tặng 50.000đ cho đơn hàng đầu tiên', 'fixed_amount', 50000.00, NULL, 100000.00, 1, 1, 1, '2025-10-31 17:00:00', '2025-12-31 17:00:00', '2025-11-05 10:19:14'),
(8, 'XMAS25', 'Giảm 25% cho mùa Giáng Sinh', 'percentage', 25.00, 120000.00, 300000.00, 300, 0, 1, '2025-11-30 17:00:00', '2025-12-31 16:59:59', '2025-11-05 10:19:14'),
(9, 'HELLO', 'Giam 7% cho don hang 100000', 'percentage', 7.00, NULL, 100000.00, NULL, 0, 0, '2025-11-05 01:00:00', '2025-11-20 13:00:00', '2025-11-05 10:33:52');

-- --------------------------------------------------------

--
-- Table structure for table `installments`
--

CREATE TABLE `installments` (
  `installment_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `total_amount` decimal(12,2) NOT NULL,
  `down_payment` decimal(12,2) DEFAULT 0.00,
  `down_payment_status` enum('pending','paid','not_required') DEFAULT 'pending' COMMENT 'pending: chờ thanh toán, paid: đã thanh toán, not_required: không yêu cầu (trả trước 0%)',
  `down_payment_date` datetime DEFAULT NULL,
  `down_payment_note` text DEFAULT NULL,
  `num_terms` int(11) NOT NULL,
  `monthly_payment` decimal(12,2) NOT NULL,
  `overdue_fee_percent_per_day` decimal(5,2) DEFAULT 0.00,
  `total_overdue_fee` decimal(12,2) DEFAULT 0.00,
  `interest_rate` decimal(5,2) DEFAULT 0.00,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `status` enum('pending','approved','active','completed','overdue','cancelled') DEFAULT 'approved',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `policy_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `installments`
--

INSERT INTO `installments` (`installment_id`, `order_id`, `user_id`, `total_amount`, `down_payment`, `down_payment_status`, `down_payment_date`, `down_payment_note`, `num_terms`, `monthly_payment`, `overdue_fee_percent_per_day`, `total_overdue_fee`, `interest_rate`, `start_date`, `end_date`, `status`, `created_at`, `policy_id`) VALUES
(40, 82, 20, 10298355.41, 0.00, 'not_required', NULL, NULL, 12, 858196.28, 1.00, 480589.92, 2.00, '2025-12-11', '2026-12-11', 'active', '2025-12-11 09:18:53', 8),
(41, 83, 20, 10061.73, 8000.00, 'paid', '2025-12-11 09:42:54', 'Thanh toán trả trước qua Chuyển khoản', 12, 171.81, 1.00, 29.21, 2.00, '2025-12-11', '2026-12-11', 'active', '2025-12-11 09:42:11', 8),
(42, 84, 20, 9516196.03, 2550000.00, 'pending', NULL, NULL, 6, 1161032.67, 0.00, 0.00, 50.00, '2025-12-11', '2026-06-11', 'approved', '2025-12-11 12:01:18', 1),
(43, 85, 20, 3739517.30, 658000.00, 'pending', NULL, NULL, 6, 513586.22, 0.00, 0.00, 50.00, '2025-12-11', '2026-06-11', 'approved', '2025-12-11 12:09:34', 1),
(44, 86, 20, 6783100.96, 0.00, 'not_required', NULL, NULL, 12, 565258.41, 1.00, 28262.91, 2.00, '2025-12-14', '2026-12-14', 'active', '2025-12-14 13:12:52', 8),
(45, 88, 23, 10853.95, 5000.00, 'paid', '2025-12-18 12:10:12', 'Thanh toán trả trước qua Chuyển khoản', 6, 975.66, 0.00, 0.00, 50.00, '2025-12-18', '2026-06-18', 'active', '2025-12-18 05:08:23', 1),
(46, 90, 23, 995775.00, 0.00, 'not_required', NULL, NULL, 6, 0.00, 0.00, 0.00, 2.00, '2025-12-18', '2026-06-18', 'active', '2025-12-18 07:30:54', 2),
(47, 91, 23, 11327.00, 2000.00, 'paid', '2025-12-18 14:40:09', 'Thanh toán trả trước qua Chuyển khoản', 6, 0.00, 0.00, 0.00, 50.00, '2025-12-18', '2026-06-18', 'active', '2025-12-18 07:39:32', 1),
(48, 92, 23, 10058.33, 0.00, 'not_required', NULL, NULL, 6, 0.00, 0.00, 0.00, 2.00, '2025-12-18', '2026-06-18', 'active', '2025-12-18 07:58:55', 2),
(49, 117, 23, 3307272.50, 329000.00, 'paid', '2025-12-30 21:15:39', 'Thanh toán trả trước qua Chuyển khoản', 6, 0.00, 0.00, 0.00, 2.00, '2025-12-30', '2026-06-30', 'active', '2025-12-30 14:14:56', 2),
(51, 132, 25, 7016645.00, 698000.00, 'paid', '2025-12-30 23:26:41', 'Thanh toán trả trước qua Chuyển khoản', 6, 1059250.63, 0.00, 0.00, 2.00, '2025-12-30', '2026-06-30', 'active', '2025-12-30 16:25:54', NULL),
(52, 133, 25, 7016645.00, 698000.00, 'paid', '2025-12-30 23:37:19', 'Thanh toán trả trước qua Chuyển khoản', 6, 1059250.63, 1.00, 0.00, 2.00, '2025-12-30', '2026-06-30', 'active', '2025-12-30 16:35:11', NULL),
(53, 134, 25, 6980000.00, 698000.00, 'paid', '2025-12-30 23:47:01', 'Thanh toán trả trước qua Chuyển khoản', 6, 1053107.50, 1.00, 0.00, 2.00, '2025-12-30', '2026-06-30', 'active', '2025-12-30 16:46:34', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `installment_payments`
--

CREATE TABLE `installment_payments` (
  `payment_id` int(11) NOT NULL,
  `installment_id` int(11) NOT NULL,
  `payment_no` int(11) NOT NULL,
  `due_date` date NOT NULL,
  `paid_date` datetime DEFAULT NULL,
  `amount` decimal(12,2) NOT NULL,
  `status` enum('pending','paid','overdue','failed') DEFAULT 'pending',
  `overdue_days` int(11) DEFAULT 0,
  `overdue_fee` decimal(12,2) DEFAULT 0.00,
  `note` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `installment_payments`
--

INSERT INTO `installment_payments` (`payment_id`, `installment_id`, `payment_no`, `due_date`, `paid_date`, `amount`, `status`, `overdue_days`, `overdue_fee`, `note`) VALUES
(82, 40, 1, '2025-12-01', '2025-12-11 00:00:00', 858196.28, 'paid', 10, 0.00, 'Thanh toán qua Chuyển khoản'),
(83, 40, 2, '2025-12-02', '2025-12-11 00:00:00', 858196.28, 'paid', 9, 77237.67, 'Thanh toán qua Chuyển khoản'),
(84, 40, 3, '2025-12-03', '2025-12-11 00:00:00', 858196.28, 'paid', 8, 68655.70, 'Thanh toán qua Chuyển khoản'),
(85, 40, 4, '2025-12-04', '2025-12-11 00:00:00', 858196.28, 'paid', 7, 60073.74, 'Thanh toán qua Chuyển khoản'),
(86, 40, 5, '2025-12-05', NULL, 858196.28, 'overdue', 25, 214549.07, NULL),
(87, 40, 6, '2026-06-11', '2025-12-11 00:00:00', 858196.28, 'paid', 0, 0.00, 'Thanh toán qua Momo'),
(88, 40, 7, '2026-07-11', '2025-12-11 00:00:00', 858196.28, 'paid', 0, 0.00, 'Thanh toán qua Momo'),
(89, 40, 8, '2026-08-11', '2025-12-11 00:00:00', 858196.28, 'paid', 0, 0.00, 'Thanh toán qua Momo'),
(90, 40, 9, '2026-09-11', '2025-12-11 13:22:44', 858196.28, 'paid', 0, 0.00, 'Thanh toán qua Momo'),
(91, 40, 10, '2026-10-11', '2025-12-11 20:25:31', 858196.28, 'paid', 0, 0.00, 'Thanh toán qua Momo'),
(92, 40, 11, '2026-11-11', NULL, 858196.28, 'pending', 0, 0.00, NULL),
(93, 40, 12, '2025-12-09', '2025-12-14 20:02:09', 1201474.79, 'paid', 5, 60073.74, 'Thanh toán qua Chuyển khoản'),
(94, 41, 1, '2025-12-13', NULL, 171.81, 'overdue', 17, 29.21, NULL),
(95, 41, 2, '2026-02-11', NULL, 171.81, 'pending', 0, 0.00, NULL),
(96, 41, 3, '2026-03-11', NULL, 171.81, 'pending', 0, 0.00, NULL),
(97, 41, 4, '2026-04-11', NULL, 171.81, 'pending', 0, 0.00, NULL),
(98, 41, 5, '2026-05-11', NULL, 171.81, 'pending', 0, 0.00, NULL),
(99, 41, 6, '2026-06-11', NULL, 171.81, 'pending', 0, 0.00, NULL),
(100, 41, 7, '2026-07-11', NULL, 171.81, 'pending', 0, 0.00, NULL),
(101, 41, 8, '2026-08-11', NULL, 171.81, 'pending', 0, 0.00, NULL),
(102, 41, 9, '2026-09-11', NULL, 171.81, 'pending', 0, 0.00, NULL),
(103, 41, 10, '2026-10-11', NULL, 171.81, 'pending', 0, 0.00, NULL),
(104, 41, 11, '2026-11-11', NULL, 171.81, 'pending', 0, 0.00, NULL),
(105, 41, 12, '2026-12-11', '2025-12-14 20:04:06', 173.53, 'pending', 0, 0.00, ''),
(106, 44, 1, '2025-12-13', '2025-12-14 20:14:10', 565258.41, 'paid', 1, 5652.58, 'Thanh toán qua Tiền mặt'),
(107, 44, 2, '2025-12-11', '2025-12-14 20:21:47', 565258.41, 'paid', 3, 16957.75, 'Thanh toán qua Chuyển khoản'),
(108, 44, 3, '2025-12-13', '2025-12-14 20:26:33', 565258.41, 'paid', 1, 5652.58, 'Thanh toán qua Momo'),
(109, 44, 4, '2026-04-14', NULL, 565258.41, 'pending', 0, 0.00, NULL),
(110, 44, 5, '2026-05-14', NULL, 565258.41, 'pending', 0, 0.00, NULL),
(111, 44, 6, '2026-06-14', NULL, 565258.41, 'pending', 0, 0.00, NULL),
(112, 44, 7, '2026-07-14', NULL, 565258.41, 'pending', 0, 0.00, NULL),
(113, 44, 8, '2026-08-14', NULL, 565258.41, 'pending', 0, 0.00, NULL),
(114, 44, 9, '2026-09-14', NULL, 565258.41, 'pending', 0, 0.00, NULL),
(115, 44, 10, '2026-10-14', NULL, 565258.41, 'pending', 0, 0.00, NULL),
(116, 44, 11, '2026-11-14', NULL, 565258.41, 'pending', 0, 0.00, NULL),
(117, 44, 12, '2026-12-14', '2025-12-14 20:13:43', 570910.99, 'paid', 0, 0.00, 'Thanh toán qua Chuyển khoản'),
(118, 45, 1, '2026-01-18', '2025-12-18 12:10:19', 975.66, 'paid', 0, 0.00, 'Thanh toán qua Chuyển khoản'),
(119, 45, 2, '2026-02-18', NULL, 975.66, 'pending', 0, 0.00, NULL),
(120, 45, 3, '2026-03-18', NULL, 975.66, 'pending', 0, 0.00, NULL),
(121, 45, 4, '2026-04-18', NULL, 975.66, 'pending', 0, 0.00, NULL),
(122, 45, 5, '2026-05-18', NULL, 975.66, 'pending', 0, 0.00, NULL),
(123, 45, 6, '2026-06-18', NULL, 975.66, 'pending', 0, 0.00, NULL),
(136, 48, 1, '2026-01-18', NULL, 1693.15, 'pending', 0, 0.00, NULL),
(137, 48, 2, '2026-02-18', NULL, 1690.36, 'pending', 0, 0.00, NULL),
(138, 48, 3, '2026-03-18', NULL, 1687.56, 'pending', 0, 0.00, NULL),
(139, 48, 4, '2026-04-18', NULL, 1684.77, 'pending', 0, 0.00, NULL),
(140, 48, 5, '2026-05-18', NULL, 1681.98, 'pending', 0, 0.00, NULL),
(141, 48, 6, '2026-06-18', NULL, 1679.18, 'pending', 0, 0.00, NULL),
(142, 49, 1, '2026-01-30', NULL, 0.00, 'pending', 0, 0.00, NULL),
(154, 51, 1, '2026-01-30', NULL, 1059250.63, 'pending', 0, 0.00, NULL),
(155, 51, 2, '2026-03-02', NULL, 1059250.63, 'pending', 0, 0.00, NULL),
(156, 51, 3, '2026-03-30', NULL, 1059250.63, 'pending', 0, 0.00, NULL),
(157, 51, 4, '2026-04-30', NULL, 1059250.63, 'pending', 0, 0.00, NULL),
(158, 51, 5, '2026-05-30', NULL, 1059250.63, 'pending', 0, 0.00, NULL),
(159, 51, 6, '2026-06-30', NULL, 1059250.63, 'pending', 0, 0.00, NULL),
(160, 52, 1, '2026-01-30', NULL, 1063638.58, 'pending', 0, 0.00, NULL),
(161, 52, 2, '2026-03-02', NULL, 1061883.40, 'pending', 0, 0.00, NULL),
(162, 52, 3, '2026-03-30', NULL, 1060128.22, 'pending', 0, 0.00, NULL),
(163, 52, 4, '2026-04-30', NULL, 1058373.04, 'pending', 0, 0.00, NULL),
(164, 52, 5, '2026-05-30', NULL, 1056617.86, 'pending', 0, 0.00, NULL),
(165, 52, 6, '2026-06-30', NULL, 1054862.68, 'pending', 0, 0.00, NULL),
(166, 53, 1, '2026-01-30', NULL, 1057470.00, 'pending', 0, 0.00, NULL),
(167, 53, 2, '2026-03-02', NULL, 1055725.00, 'pending', 0, 0.00, NULL),
(168, 53, 3, '2026-03-30', NULL, 1053980.00, 'pending', 0, 0.00, NULL),
(169, 53, 4, '2026-04-30', NULL, 1052235.00, 'pending', 0, 0.00, NULL),
(170, 53, 5, '2026-05-30', NULL, 1050490.00, 'pending', 0, 0.00, NULL),
(171, 53, 6, '2026-06-30', NULL, 1048745.00, 'pending', 0, 0.00, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `installment_policies`
--

CREATE TABLE `installment_policies` (
  `policy_id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `terms` int(11) NOT NULL,
  `interest_rate` decimal(5,2) NOT NULL DEFAULT 0.00,
  `min_down_payment` decimal(5,2) NOT NULL DEFAULT 0.00,
  `description` varchar(500) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `installment_fee_percent` decimal(5,2) NOT NULL DEFAULT 0.00 COMMENT 'Phí trả góp theo phần trăm tổng tiền, chia đều mỗi tháng',
  `overdue_fee_percent` decimal(5,2) NOT NULL DEFAULT 0.00 COMMENT 'Phí trễ hẹn % mỗi ngày'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `installment_policies`
--

INSERT INTO `installment_policies` (`policy_id`, `name`, `terms`, `interest_rate`, `min_down_payment`, `description`, `is_active`, `created_at`, `updated_at`, `installment_fee_percent`, `overdue_fee_percent`) VALUES
(1, 'Trả góp 6 tháng', 6, 50.00, 20.00, NULL, 0, '2025-11-29 11:47:36', '2025-12-30 13:35:39', 2.00, 0.00),
(2, 'Trả góp 6 tháng 0%', 6, 2.00, 0.00, 'Trả trong 6 tháng, không phát sinh lãi và phí.', 1, '2025-11-29 12:10:17', '2025-12-05 12:41:00', 0.00, 0.00),
(3, 'Trả góp 12 tháng lãi 3%', 12, 3.00, 20.00, 'Gói trả góp 12 tháng, lãi suất 3%/năm, phí hợp đồng 5%.', 1, '2025-11-29 12:10:17', '2025-11-29 12:10:17', 5.00, 0.00),
(4, 'Trả góp 18 tháng lãi 6%', 18, 6.00, 15.00, 'Trả góp 18 tháng, lãi suất 6%/năm, phí trả góp 8%.', 1, '2025-11-29 12:10:17', '2025-11-29 12:10:17', 8.00, 0.00),
(5, 'Trả góp 24 tháng', 24, 7.50, 10.00, 'Kỳ hạn dài nhất, lãi suất 7.5%/năm, phí hợp đồng 10%.', 1, '2025-11-29 12:10:17', '2025-11-29 12:10:17', 10.00, 0.00),
(6, 'Gói ưu đãi cho sản phẩm cao cấp', 9, 2.50, 40.00, 'Dành cho sản phẩm trị giá cao, yêu cầu trả trước 40%.', 1, '2025-11-29 12:10:17', '2025-11-29 12:10:17', 0.00, 0.00),
(8, 'Trả góp 12 tháng - Lãi suất thấp - Có Phí Overdue', 12, 2.00, 0.00, NULL, 1, '2025-12-11 07:16:53', '2025-12-11 07:16:53', 2.00, 1.00),
(9, 'Trả góp 6 tháng ưu đãi không phí, lãi suất thấp', 6, 2.00, 0.00, 'Phù hợp khách hàng trả nhanh, ưu đãi lớn, lãi suất thấp', 1, '2025-12-30 13:37:15', '2025-12-30 13:37:15', 0.00, 1.00);

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `order_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `order_number` varchar(50) NOT NULL,
  `address_id` int(11) DEFAULT NULL,
  `coupon_id` int(11) DEFAULT NULL,
  `order_status` enum('pending','confirmed','processing','shipping','delivered','cancelled','refunded') DEFAULT 'pending',
  `payment_status` enum('unpaid','paid','partially_paid','refunded') DEFAULT 'unpaid',
  `subtotal` decimal(12,2) NOT NULL,
  `discount_amount` decimal(10,2) DEFAULT 0.00,
  `shipping_fee` decimal(10,2) DEFAULT 0.00,
  `tax_amount` decimal(10,2) DEFAULT 0.00,
  `total_amount` decimal(12,2) NOT NULL,
  `notes` text DEFAULT NULL,
  `cancelled_reason` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `confirmed_at` timestamp NULL DEFAULT NULL,
  `shipped_at` timestamp NULL DEFAULT NULL,
  `delivered_at` timestamp NULL DEFAULT NULL,
  `cancelled_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`order_id`, `user_id`, `order_number`, `address_id`, `coupon_id`, `order_status`, `payment_status`, `subtotal`, `discount_amount`, `shipping_fee`, `tax_amount`, `total_amount`, `notes`, `cancelled_reason`, `created_at`, `updated_at`, `confirmed_at`, `shipped_at`, `delivered_at`, `cancelled_at`) VALUES
(46, 20, 'ORD88284166267', NULL, NULL, 'shipping', 'unpaid', 12000000.00, 0.00, 0.00, 0.00, 12000000.00, NULL, NULL, '2025-11-24 12:44:44', '2025-11-24 12:49:52', NULL, NULL, NULL, NULL),
(47, 21, 'ORD95319130334', 53, NULL, 'shipping', 'unpaid', 12000000.00, 0.00, 0.00, 0.00, 12000000.00, NULL, NULL, '2025-11-24 14:41:59', '2025-11-24 14:44:46', '2025-11-24 14:43:33', NULL, NULL, NULL),
(48, 20, 'ORD17748211898', NULL, NULL, 'pending', 'unpaid', 9000000.00, 0.00, 0.00, 0.00, 9000000.00, NULL, NULL, '2025-11-29 12:02:28', '2025-11-29 12:02:28', NULL, NULL, NULL, NULL),
(49, 20, 'ORD03856953127', NULL, NULL, 'pending', 'unpaid', 3290000.00, 0.00, 50000.00, 0.00, 3340000.00, NULL, NULL, '2025-12-05 03:04:16', '2025-12-05 03:04:16', NULL, NULL, NULL, NULL),
(50, 20, 'ORD04143586718', NULL, NULL, 'pending', 'unpaid', 9990000.00, 0.00, 50000.00, 0.00, 10040000.00, NULL, NULL, '2025-12-05 03:09:03', '2025-12-05 03:09:03', NULL, NULL, NULL, NULL),
(51, 20, 'ORD05419530689', NULL, NULL, 'pending', 'unpaid', 22660000.00, 0.00, 50000.00, 0.00, 22710000.00, NULL, NULL, '2025-12-05 03:30:19', '2025-12-05 03:30:19', NULL, NULL, NULL, NULL),
(52, 20, 'ORD08939750540', NULL, NULL, 'pending', 'unpaid', 2390000.00, 0.00, 50000.00, 0.00, 2440000.00, NULL, NULL, '2025-12-05 04:28:59', '2025-12-05 04:28:59', NULL, NULL, NULL, NULL),
(53, 20, 'ORD13429806332', NULL, NULL, 'pending', 'unpaid', 30000.00, 0.00, 50000.00, 0.00, 80000.00, NULL, NULL, '2025-12-05 05:43:49', '2025-12-05 05:43:49', NULL, NULL, NULL, NULL),
(54, 20, 'ORD13429810266', NULL, NULL, 'pending', 'unpaid', 30000.00, 0.00, 50000.00, 0.00, 80000.00, NULL, NULL, '2025-12-05 05:43:49', '2025-12-05 05:43:49', NULL, NULL, NULL, NULL),
(55, 20, 'ORD13475694198', NULL, NULL, 'pending', 'unpaid', 30000.00, 0.00, 50000.00, 0.00, 80000.00, NULL, NULL, '2025-12-05 05:44:35', '2025-12-05 05:44:35', NULL, NULL, NULL, NULL),
(56, 20, 'ORD13689538444', NULL, NULL, 'pending', 'unpaid', 3990000.00, 0.00, 50000.00, 0.00, 4040000.00, NULL, NULL, '2025-12-05 05:48:09', '2025-12-05 05:48:09', NULL, NULL, NULL, NULL),
(57, 20, 'ORD13689544225', NULL, NULL, 'pending', 'unpaid', 3990000.00, 0.00, 50000.00, 0.00, 4040000.00, NULL, NULL, '2025-12-05 05:48:09', '2025-12-05 05:48:09', NULL, NULL, NULL, NULL),
(58, 20, 'ORD13827679073', NULL, NULL, 'pending', 'unpaid', 990000.00, 0.00, 50000.00, 0.00, 1040000.00, NULL, NULL, '2025-12-05 05:50:27', '2025-12-05 05:50:27', NULL, NULL, NULL, NULL),
(59, 20, 'ORD13827683230', NULL, NULL, 'pending', 'unpaid', 990000.00, 0.00, 50000.00, 0.00, 1040000.00, NULL, NULL, '2025-12-05 05:50:27', '2025-12-05 05:50:27', NULL, NULL, NULL, NULL),
(60, 20, 'ORD14307217077', NULL, NULL, 'pending', 'unpaid', 3290000.00, 0.00, 50000.00, 0.00, 3340000.00, NULL, NULL, '2025-12-05 05:58:27', '2025-12-05 05:58:27', NULL, NULL, NULL, NULL),
(61, 20, 'ORD14850252370', NULL, NULL, 'pending', 'unpaid', 10000.00, 0.00, 50000.00, 0.00, 60000.00, NULL, NULL, '2025-12-05 06:07:30', '2025-12-05 06:07:30', NULL, NULL, NULL, NULL),
(62, 20, 'ORD15247269621', NULL, NULL, 'pending', 'unpaid', 20000.00, 0.00, 50000.00, 0.00, 70000.00, NULL, NULL, '2025-12-05 06:14:07', '2025-12-05 06:14:07', NULL, NULL, NULL, NULL),
(63, 20, 'ORD15653022528', NULL, NULL, 'pending', 'paid', 50000.00, 0.00, 50000.00, 0.00, 100000.00, NULL, NULL, '2025-12-05 06:20:53', '2025-12-05 06:20:53', NULL, NULL, NULL, NULL),
(64, 20, 'ORD16642084760', NULL, NULL, 'shipping', 'paid', 20000.00, 0.00, 50000.00, 0.00, 70000.00, NULL, NULL, '2025-12-05 06:37:22', '2025-12-05 06:37:22', NULL, NULL, NULL, NULL),
(65, 20, 'ORD17351702937', NULL, NULL, 'shipping', 'paid', 3290000.00, 0.00, 50000.00, 0.00, 3340000.00, NULL, NULL, '2025-12-05 06:49:11', '2025-12-05 06:49:11', NULL, NULL, NULL, NULL),
(66, 20, 'ORD19667478628', NULL, NULL, 'shipping', 'paid', 8490000.00, 0.00, 50000.00, 0.00, 8540000.00, NULL, NULL, '2025-12-05 07:27:47', '2025-12-05 07:27:47', NULL, NULL, NULL, NULL),
(67, 20, 'ORD21177096571', NULL, NULL, 'shipping', 'paid', 3990000.00, 0.00, 50000.00, 0.00, 4040000.00, NULL, NULL, '2025-12-05 07:52:57', '2025-12-05 07:52:57', NULL, NULL, NULL, NULL),
(68, 20, 'ORD21528536675', NULL, NULL, 'shipping', 'unpaid', 13280000.00, 0.00, 0.00, 0.00, 13280000.00, NULL, NULL, '2025-12-05 07:58:48', '2025-12-05 08:03:35', '2025-12-05 08:00:30', NULL, NULL, NULL),
(69, 20, 'ORD21744010559', NULL, NULL, 'pending', 'unpaid', 23280000.00, 0.00, 0.00, 0.00, 23280000.00, NULL, NULL, '2025-12-05 08:02:24', '2025-12-05 08:02:24', NULL, NULL, NULL, NULL),
(70, 20, 'ORD22032091503', NULL, NULL, 'shipping', 'paid', 70000.00, 0.00, 50000.00, 0.00, 120000.00, NULL, NULL, '2025-12-05 08:07:12', '2025-12-05 08:07:12', NULL, NULL, NULL, NULL),
(71, 20, 'ORD33826605110', NULL, NULL, 'pending', 'unpaid', 990000.00, 0.00, 0.00, 0.00, 990000.00, NULL, NULL, '2025-12-05 11:23:46', '2025-12-05 11:23:46', NULL, NULL, NULL, NULL),
(72, 20, 'ORD34206694276', NULL, NULL, 'pending', 'unpaid', 2500000.00, 0.00, 0.00, 0.00, 2500000.00, NULL, NULL, '2025-12-05 11:30:06', '2025-12-05 11:30:06', NULL, NULL, NULL, NULL),
(73, 20, 'ORD35425067017', NULL, NULL, 'shipping', 'unpaid', 2500000.00, 0.00, 0.00, 0.00, 2500000.00, NULL, NULL, '2025-12-05 11:50:25', '2025-12-05 12:00:06', NULL, NULL, NULL, NULL),
(74, 20, 'ORD36478055670', NULL, NULL, 'shipping', 'unpaid', 9990000.00, 0.00, 0.00, 0.00, 9990000.00, NULL, NULL, '2025-12-05 12:07:58', '2025-12-05 12:09:03', NULL, NULL, NULL, NULL),
(75, 20, 'ORD37150962125', NULL, NULL, 'shipping', 'unpaid', 19980000.00, 0.00, 0.00, 0.00, 19980000.00, NULL, NULL, '2025-12-05 12:19:10', '2025-12-05 12:20:17', NULL, NULL, NULL, NULL),
(76, 20, 'ORD37481094803', NULL, NULL, 'shipping', 'paid', 9990000.00, 0.00, 50000.00, 0.00, 10040000.00, NULL, NULL, '2025-12-05 12:24:41', '2025-12-05 12:24:41', NULL, NULL, NULL, NULL),
(77, 20, 'ORD38502917646', NULL, NULL, 'pending', 'unpaid', 19980000.00, 0.00, 0.00, 0.00, 19980000.00, NULL, NULL, '2025-12-05 12:41:42', '2025-12-05 12:41:42', NULL, NULL, NULL, NULL),
(78, 20, 'ORD38587363879', NULL, NULL, 'pending', 'unpaid', 29970000.00, 0.00, 0.00, 0.00, 29970000.00, NULL, NULL, '2025-12-05 12:43:07', '2025-12-05 12:43:07', NULL, NULL, NULL, NULL),
(79, 20, 'ORD39740387554', NULL, NULL, 'pending', 'unpaid', 39960000.00, 0.00, 0.00, 0.00, 39960000.00, NULL, NULL, '2025-12-05 13:02:20', '2025-12-05 13:02:20', NULL, NULL, NULL, NULL),
(80, 20, 'ORD39855467379', NULL, NULL, 'pending', 'unpaid', 3290000.00, 0.00, 0.00, 0.00, 3290000.00, NULL, NULL, '2025-12-05 13:04:15', '2025-12-05 13:04:15', NULL, NULL, NULL, NULL),
(81, 20, 'ORD40709129049', NULL, NULL, 'shipping', 'unpaid', 6580000.00, 0.00, 0.00, 0.00, 6580000.00, NULL, NULL, '2025-12-05 13:18:29', '2025-12-05 13:32:26', NULL, NULL, NULL, NULL),
(82, 20, 'ORD44733624691', NULL, NULL, 'pending', 'unpaid', 9990000.00, 0.00, 0.00, 0.00, 9990000.00, NULL, NULL, '2025-12-11 09:18:53', '2025-12-11 09:18:53', NULL, NULL, NULL, NULL),
(83, 20, 'ORD46131581070', NULL, NULL, 'shipping', 'unpaid', 10000.00, 0.00, 0.00, 0.00, 10000.00, NULL, NULL, '2025-12-11 09:42:11', '2025-12-11 09:42:54', NULL, NULL, NULL, NULL),
(84, 20, 'ORD54478765582', NULL, NULL, 'pending', 'unpaid', 8500000.00, 0.00, 0.00, 0.00, 8500000.00, NULL, NULL, '2025-12-11 12:01:18', '2025-12-11 12:01:18', NULL, NULL, NULL, NULL),
(85, 20, 'ORD54974756792', NULL, NULL, 'pending', 'unpaid', 3290000.00, 0.00, 0.00, 0.00, 3290000.00, NULL, NULL, '2025-12-11 12:09:34', '2025-12-11 12:09:34', NULL, NULL, NULL, NULL),
(86, 20, 'ORD17972178060', NULL, NULL, 'pending', 'unpaid', 6580000.00, 0.00, 0.00, 0.00, 6580000.00, NULL, NULL, '2025-12-14 13:12:52', '2025-12-14 13:12:52', NULL, NULL, NULL, NULL),
(87, NULL, 'ORD34216204311', 71, 5, 'shipping', 'paid', 9390000.00, 100000.00, 50000.00, 0.00, 9340000.00, NULL, NULL, '2025-12-18 05:03:36', '2025-12-18 05:03:36', NULL, NULL, NULL, NULL),
(88, 23, 'ORD34503946340', 72, NULL, 'delivered', 'unpaid', 10000.00, 0.00, 0.00, 0.00, 10000.00, NULL, NULL, '2025-12-18 05:08:23', '2025-12-18 06:07:45', NULL, NULL, NULL, NULL),
(89, NULL, 'ORD42906136668', 73, NULL, 'pending', 'unpaid', 990000.00, 0.00, 0.00, 0.00, 990000.00, NULL, NULL, '2025-12-18 07:28:26', '2025-12-18 07:28:26', NULL, NULL, NULL, NULL),
(90, 23, 'ORD43054769173', 74, NULL, 'pending', 'unpaid', 990000.00, 0.00, 0.00, 0.00, 990000.00, NULL, NULL, '2025-12-18 07:30:54', '2025-12-18 07:30:54', NULL, NULL, NULL, NULL),
(91, 23, 'ORD43572170399', 75, NULL, 'shipping', 'unpaid', 10000.00, 0.00, 0.00, 0.00, 10000.00, NULL, NULL, '2025-12-18 07:39:32', '2025-12-18 07:40:09', NULL, NULL, NULL, NULL),
(92, 23, 'ORD44735675996', 76, NULL, 'pending', 'unpaid', 10000.00, 0.00, 0.00, 0.00, 10000.00, NULL, NULL, '2025-12-18 07:58:55', '2025-12-18 07:58:55', NULL, NULL, NULL, NULL),
(93, NULL, 'ORD55929176813', 77, NULL, 'pending', 'unpaid', 10980000.00, 0.00, 50000.00, 0.00, 11030000.00, NULL, NULL, '2025-12-19 14:52:09', '2025-12-19 14:52:09', NULL, NULL, NULL, NULL),
(100, NULL, 'ORD16034232756', 84, NULL, 'delivered', 'paid', 100000.00, 0.00, 50000.00, 0.00, 150000.00, NULL, NULL, '2025-12-20 07:33:54', '2025-12-20 07:35:40', NULL, NULL, NULL, NULL),
(101, NULL, 'ORD16294503673', 85, NULL, 'delivered', 'paid', 50000.00, 0.00, 50000.00, 0.00, 100000.00, NULL, NULL, '2025-12-20 07:38:14', '2025-12-20 07:44:45', NULL, NULL, NULL, NULL),
(104, NULL, 'ORD17709381008', 88, NULL, 'delivered', 'paid', 50000.00, 0.00, 50000.00, 0.00, 100000.00, NULL, NULL, '2025-12-20 08:01:49', '2025-12-20 08:02:13', NULL, NULL, NULL, NULL),
(116, NULL, 'ORD02576566886', 98, NULL, 'delivered', 'unpaid', 100000.00, 0.00, 0.00, 0.00, 100000.00, NULL, NULL, '2025-12-30 13:49:36', '2025-12-30 14:00:14', '2025-12-30 14:00:06', '2025-12-30 14:00:12', '2025-12-30 14:00:14', NULL),
(117, 23, 'ORD04096765607', 99, NULL, 'shipping', 'unpaid', 3290000.00, 0.00, 0.00, 0.00, 3290000.00, NULL, NULL, '2025-12-30 14:14:56', '2025-12-30 14:15:39', NULL, '2025-12-30 14:15:39', NULL, NULL),
(118, NULL, 'ORD04342526949', 100, NULL, 'pending', 'unpaid', 3290000.00, 0.00, 0.00, 0.00, 3290000.00, NULL, NULL, '2025-12-30 14:19:02', '2025-12-30 14:19:02', NULL, NULL, NULL, NULL),
(122, NULL, 'ORD07375647264', 104, NULL, 'pending', 'unpaid', 3290000.00, 0.00, 0.00, 0.00, 3290000.00, NULL, NULL, '2025-12-30 15:09:35', '2025-12-30 15:09:35', NULL, NULL, NULL, NULL),
(123, NULL, 'ORD07438051928', 105, NULL, 'confirmed', 'paid', 3290000.00, 0.00, 50000.00, 0.00, 3340000.00, NULL, NULL, '2025-12-30 15:10:38', '2025-12-30 15:10:38', NULL, NULL, NULL, NULL),
(124, NULL, 'ORD07611819286', 106, NULL, 'shipping', 'paid', 9990000.00, 0.00, 50000.00, 0.00, 10040000.00, NULL, NULL, '2025-12-30 15:13:31', '2025-12-30 15:13:31', NULL, NULL, NULL, NULL),
(125, NULL, 'ORD07854764922', 107, NULL, 'pending', 'unpaid', 8490000.00, 0.00, 0.00, 0.00, 8490000.00, NULL, NULL, '2025-12-30 15:17:34', '2025-12-30 15:17:34', NULL, NULL, NULL, NULL),
(126, NULL, 'ORD09914084692', 108, NULL, 'pending', 'unpaid', 8490000.00, 0.00, 0.00, 0.00, 8490000.00, NULL, NULL, '2025-12-30 15:51:54', '2025-12-30 15:51:54', NULL, NULL, NULL, NULL),
(127, NULL, 'ORD10038762410', 109, NULL, 'pending', 'unpaid', 8490000.00, 0.00, 0.00, 0.00, 8490000.00, NULL, NULL, '2025-12-30 15:53:58', '2025-12-30 15:53:58', NULL, NULL, NULL, NULL),
(132, 25, 'ORD11954950955', 111, NULL, 'shipping', 'unpaid', 6980000.00, 0.00, 0.00, 0.00, 6980000.00, NULL, NULL, '2025-12-30 16:25:54', '2025-12-30 16:26:42', NULL, '2025-12-30 16:26:42', NULL, NULL),
(133, 25, 'ORD12511041306', 112, NULL, 'shipping', 'unpaid', 6980000.00, 0.00, 0.00, 0.00, 6980000.00, NULL, NULL, '2025-12-30 16:35:11', '2025-12-30 16:37:19', NULL, '2025-12-30 16:37:19', NULL, NULL),
(134, 25, 'ORD13194143618', 111, NULL, 'shipping', 'unpaid', 6980000.00, 0.00, 0.00, 0.00, 6980000.00, NULL, NULL, '2025-12-30 16:46:34', '2025-12-30 16:47:01', NULL, '2025-12-30 16:47:01', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `order_item_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `variant_id` int(11) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `variant_name` varchar(255) DEFAULT NULL,
  `sku` varchar(100) DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `unit_price` decimal(12,2) NOT NULL,
  `discount_amount` decimal(10,2) DEFAULT 0.00,
  `subtotal` decimal(12,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `payment_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `payment_method` enum('cod','installment','momo') NOT NULL,
  `payment_status` enum('pending','completed','failed','refunded','cancelled','paid') DEFAULT 'pending',
  `amount` decimal(12,2) NOT NULL,
  `transaction_id` varchar(100) DEFAULT NULL,
  `payment_gateway` varchar(50) DEFAULT NULL,
  `payment_details` text DEFAULT NULL,
  `paid_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`payment_id`, `order_id`, `payment_method`, `payment_status`, `amount`, `transaction_id`, `payment_gateway`, `payment_details`, `paid_at`, `created_at`, `updated_at`) VALUES
(17, 65, 'momo', 'paid', 3340000.00, NULL, 'momo', NULL, '2025-12-04 23:49:11', '2025-12-04 23:49:11', '2025-12-04 23:49:11'),
(20, 66, 'momo', 'paid', 8540000.00, 'BATECH_1764919624272', 'momo', NULL, '2025-12-05 00:27:47', '2025-12-05 00:27:47', '2025-12-05 00:27:47'),
(22, 67, 'momo', 'paid', 4040000.00, 'BATECH_1764921138073', 'momo', NULL, '2025-12-05 00:52:57', '2025-12-05 00:52:57', '2025-12-05 00:52:57'),
(23, 68, 'installment', 'pending', 13280000.00, 'TXN1764921528538897', NULL, NULL, NULL, '2025-12-05 00:58:48', '2025-12-05 00:58:48'),
(24, 69, 'installment', 'pending', 23280000.00, 'TXN1764921744013568', NULL, NULL, NULL, '2025-12-05 01:02:24', '2025-12-05 01:02:24'),
(26, 70, 'momo', 'paid', 120000.00, 'BATECH_1764921889136', 'momo', NULL, '2025-12-05 01:07:12', '2025-12-05 01:07:12', '2025-12-05 01:07:12'),
(28, 71, 'installment', 'pending', 990000.00, 'TXN1764933826608618', NULL, NULL, NULL, '2025-12-05 04:23:46', '2025-12-05 04:23:46'),
(29, 72, 'installment', 'pending', 2500000.00, 'TXN1764934206695947', NULL, NULL, NULL, '2025-12-05 04:30:06', '2025-12-05 04:30:06'),
(30, 73, 'installment', 'pending', 2500000.00, 'TXN1764935425069817', NULL, NULL, NULL, '2025-12-05 04:50:25', '2025-12-05 04:50:25'),
(32, 74, 'installment', 'pending', 9990000.00, 'TXN176493647805661', NULL, NULL, NULL, '2025-12-05 05:07:58', '2025-12-05 05:07:58'),
(33, 75, 'installment', 'pending', 19980000.00, 'TXN1764937150965119', NULL, NULL, NULL, '2025-12-05 05:19:10', '2025-12-05 05:19:10'),
(35, 76, 'momo', 'paid', 10040000.00, 'BATECH_1764937406052', 'momo', NULL, '2025-12-05 05:24:41', '2025-12-05 05:24:41', '2025-12-05 05:24:41'),
(36, 77, 'installment', 'pending', 19980000.00, 'TXN1764938502920835', NULL, NULL, NULL, '2025-12-05 05:41:42', '2025-12-05 05:41:42'),
(37, 78, 'installment', 'pending', 29970000.00, 'TXN1764938587364484', NULL, NULL, NULL, '2025-12-05 05:43:07', '2025-12-05 05:43:07'),
(38, 79, 'installment', 'pending', 39960000.00, 'TXN176493974038886', NULL, NULL, NULL, '2025-12-05 06:02:20', '2025-12-05 06:02:20'),
(39, 80, 'installment', 'pending', 3290000.00, 'TXN176493985546828', NULL, NULL, NULL, '2025-12-05 06:04:15', '2025-12-05 06:04:15'),
(40, 81, 'installment', 'pending', 6580000.00, 'TXN1764940709135361', NULL, NULL, NULL, '2025-12-05 06:18:29', '2025-12-05 06:18:29'),
(41, 82, 'installment', 'pending', 9990000.00, 'TXN1765444733626700', NULL, NULL, NULL, '2025-12-11 02:18:53', '2025-12-11 02:18:53'),
(42, 83, 'installment', 'pending', 10000.00, 'TXN176544613158311', NULL, NULL, NULL, '2025-12-11 02:42:11', '2025-12-11 02:42:11'),
(43, 84, 'installment', 'pending', 8500000.00, 'TXN1765454478768274', NULL, NULL, NULL, '2025-12-11 05:01:18', '2025-12-11 05:01:18'),
(44, 85, 'installment', 'pending', 3290000.00, 'TXN1765454974756531', NULL, NULL, NULL, '2025-12-11 05:09:34', '2025-12-11 05:09:34'),
(50, 86, 'installment', 'pending', 6580000.00, 'TXN1765717972180786', NULL, NULL, NULL, '2025-12-14 06:12:52', '2025-12-14 06:12:52'),
(53, 87, 'momo', 'paid', 9340000.00, 'BATECH_1766034152899', 'momo', NULL, '2025-12-17 22:03:36', '2025-12-17 22:03:36', '2025-12-17 22:03:36'),
(54, 88, 'installment', 'pending', 10000.00, 'TXN1766034503947947', NULL, NULL, NULL, '2025-12-17 22:08:23', '2025-12-17 22:08:23'),
(55, 89, 'installment', 'pending', 990000.00, 'TXN1766042906138375', NULL, NULL, NULL, '2025-12-18 00:28:26', '2025-12-18 00:28:26'),
(56, 90, 'installment', 'pending', 990000.00, 'TXN1766043054776348', NULL, NULL, NULL, '2025-12-18 00:30:54', '2025-12-18 00:30:54'),
(57, 91, 'installment', 'pending', 10000.00, 'TXN1766043572171658', NULL, NULL, NULL, '2025-12-18 00:39:32', '2025-12-18 00:39:32'),
(58, 92, 'installment', 'pending', 10000.00, 'TXN1766044735681184', NULL, NULL, NULL, '2025-12-18 00:58:55', '2025-12-18 00:58:55'),
(59, 93, 'cod', 'pending', 11030000.00, 'TXN1766155929178767', NULL, NULL, NULL, '2025-12-19 07:52:09', '2025-12-19 07:52:09'),
(61, 100, 'cod', 'pending', 150000.00, 'TXN1766216034238686', NULL, NULL, NULL, '2025-12-20 00:33:54', '2025-12-20 00:33:54'),
(62, 101, 'cod', 'pending', 100000.00, 'TXN1766216294509733', NULL, NULL, NULL, '2025-12-20 00:38:14', '2025-12-20 00:38:14'),
(66, 104, 'momo', 'paid', 100000.00, 'BATECH_1766217650278', 'momo', NULL, '2025-12-20 01:01:49', '2025-12-20 01:01:49', '2025-12-20 01:01:49'),
(74, 116, 'installment', 'pending', 100000.00, 'TXN176710257656982', NULL, NULL, NULL, '2025-12-30 13:49:36', '2025-12-30 13:49:36'),
(75, 117, 'installment', 'pending', 3290000.00, 'TXN1767104096769837', NULL, NULL, NULL, '2025-12-30 14:14:56', '2025-12-30 14:14:56'),
(76, 118, 'installment', 'pending', 3290000.00, 'TXN1767104342531422', NULL, NULL, NULL, '2025-12-30 14:19:02', '2025-12-30 14:19:02'),
(78, 122, 'installment', 'pending', 3290000.00, 'TXN1767107375661865', NULL, NULL, NULL, '2025-12-30 15:09:35', '2025-12-30 15:09:35'),
(79, 123, 'cod', 'paid', 3340000.00, 'TXN1767107438055915', NULL, NULL, '2025-12-30 15:10:38', '2025-12-30 15:10:38', '2025-12-30 15:10:38'),
(81, 124, 'momo', 'paid', 10040000.00, 'BATECH_1767107562628', 'momo', NULL, '2025-12-30 15:13:31', '2025-12-30 15:13:31', '2025-12-30 15:13:31'),
(82, 125, 'installment', 'pending', 8490000.00, 'TXN1767107854768846', NULL, NULL, NULL, '2025-12-30 15:17:34', '2025-12-30 15:17:34'),
(83, 126, 'installment', 'pending', 8490000.00, 'TXN1767109914090290', NULL, NULL, NULL, '2025-12-30 15:51:54', '2025-12-30 15:51:54'),
(84, 127, 'installment', 'pending', 8490000.00, 'TXN1767110038768593', NULL, NULL, NULL, '2025-12-30 15:53:58', '2025-12-30 15:53:58'),
(89, 132, 'installment', 'pending', 6980000.00, 'TXN1767111954955313', NULL, NULL, NULL, '2025-12-30 16:25:54', '2025-12-30 16:25:54'),
(90, 133, 'installment', 'pending', 6980000.00, 'TXN1767112511050494', NULL, NULL, NULL, '2025-12-30 16:35:11', '2025-12-30 16:35:11'),
(91, 134, 'installment', 'pending', 6980000.00, 'TXN1767113194149313', NULL, NULL, NULL, '2025-12-30 16:46:34', '2025-12-30 16:46:34');

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE `posts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `excerpt` text DEFAULT NULL,
  `content_html` longtext NOT NULL,
  `content_text` longtext DEFAULT NULL,
  `author_id` int(11) DEFAULT NULL,
  `article_id` bigint(20) UNSIGNED DEFAULT NULL,
  `status` enum('draft','published','archived') NOT NULL DEFAULT 'draft',
  `featured_image_id` bigint(20) UNSIGNED DEFAULT NULL,
  `view_count` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `product_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `base_price` decimal(12,2) NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `is_featured` tinyint(1) DEFAULT 0,
  `view_count` int(11) DEFAULT 0,
  `rating_average` decimal(3,2) DEFAULT 0.00,
  `review_count` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `img_path` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`product_id`, `category_id`, `product_name`, `slug`, `description`, `base_price`, `is_active`, `is_featured`, `view_count`, `rating_average`, `review_count`, `created_at`, `updated_at`, `img_path`) VALUES
(389, 1, 'Intel Core i5-14600KF', 'intel-core-i5-14600kf', 'CPU Intel Core i5-14600KF thế hệ 14 (Raptor Lake Refresh), 14 nhân 20 luồng, tốc độ tối đa 5.3GHz. Socket LGA 1700, hỗ trợ DDR4/DDR5, không tích hợp GPU. Phù hợp cho gaming và công việc đa nhiệm.', 6990000.00, 1, 1, 0, 0.00, 0, '2026-01-04 12:41:54', '2026-01-04 12:41:54', NULL),
(390, 35, 'Kingston Fury Beast DDR5 6000MHZ', 'kingston-fury-beast-ddr5-6000mhz', 'RAM Kingston Fury Beast DDR5 6000MHz - Hiệu năng cao, ổn định, tản nhiệt tốt. Hỗ trợ Intel XMP 3.0 và AMD EXPO. Thiết kế tản nhiệt nhôm cao cấp, LED RGB tùy chỉnh. Phù hợp cho gaming và workstation.', 2000000.00, 1, 1, 0, 0.00, 0, '2026-01-04 12:50:37', '2026-01-04 12:50:37', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `products_attribute_values`
--

CREATE TABLE `products_attribute_values` (
  `product_id` int(11) NOT NULL,
  `attribute_value_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products_attribute_values`
--

INSERT INTO `products_attribute_values` (`product_id`, `attribute_value_id`) VALUES
(389, 1),
(389, 36),
(389, 44),
(389, 51),
(390, 15),
(390, 140),
(390, 143);

-- --------------------------------------------------------

--
-- Table structure for table `product_variants`
--

CREATE TABLE `product_variants` (
  `variant_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `sku` varchar(100) NOT NULL,
  `variant_name` varchar(255) DEFAULT NULL,
  `price` decimal(12,2) NOT NULL,
  `stock_quantity` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `is_default` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `warranty_period` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_variants`
--

INSERT INTO `product_variants` (`variant_id`, `product_id`, `sku`, `variant_name`, `price`, `stock_quantity`, `is_active`, `is_default`, `created_at`, `updated_at`, `warranty_period`) VALUES
(587, 389, 'ICI-389-514365', 'Mặc định', 6990000.00, 3, 1, 1, '2026-01-04 12:41:54', '2026-01-04 12:41:54', 36),
(588, 390, 'FURY-DDR5-16GB-6000', '16GB (1 X 16GB)', 2000000.00, 100, 1, 1, '2026-01-04 12:50:37', '2026-01-04 12:50:37', 36),
(589, 390, 'FURY-DDR5-32GB-1x32-6000', '32GB (1 X 32GB)', 3800000.00, 60, 1, 0, '2026-01-04 12:50:37', '2026-01-04 12:50:37', 36),
(590, 390, 'FURY-DDR5-32GB-2x16-6000', '32GB (2 X 16GB)', 3500000.00, 80, 1, 0, '2026-01-04 12:50:37', '2026-01-04 12:50:37', 36);

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `review_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL COMMENT 'Đảm bảo user đã mua sản phẩm',
  `rating` tinyint(4) NOT NULL CHECK (`rating` between 1 and 5),
  `content` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `service_requests`
--

CREATE TABLE `service_requests` (
  `service_request_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL COMMENT 'NULL for walk-in customers',
  `warranty_id` int(11) DEFAULT NULL COMMENT 'Link to warranties table',
  `serial_id` int(11) DEFAULT NULL COMMENT 'Link to variant_serials table',
  `customer_name` varchar(100) DEFAULT NULL COMMENT 'Walk-in customer name',
  `customer_phone` varchar(20) DEFAULT NULL COMMENT 'Walk-in customer phone',
  `request_type` enum('warranty','repair','return','exchange','consultation') NOT NULL,
  `status` enum('pending','received','warranty_accepted','warranty_rejected','completed','cancelled') DEFAULT 'pending',
  `subject` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Array of image URLs [{url, description}]' CHECK (json_valid(`images`)),
  `priority` enum('low','medium','high','urgent') DEFAULT 'medium',
  `rejection_reason` text DEFAULT NULL,
  `resolution` text DEFAULT NULL COMMENT 'Final resolution/result',
  `progress_notes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`progress_notes`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `resolved_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `full_name` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `role` tinyint(4) DEFAULT 0 COMMENT '0=customer, 1=shipper, 2=admin',
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `last_login` timestamp NULL DEFAULT NULL,
  `session_token` varchar(128) DEFAULT NULL,
  `admin_session_token` varchar(128) DEFAULT NULL COMMENT 'Session token for admin login',
  `user_session_token` varchar(128) DEFAULT NULL COMMENT 'Session token for user login',
  `admin_refresh_token` varchar(512) DEFAULT NULL COMMENT 'JWT refresh token for admin session (role=2)',
  `user_refresh_token` varchar(512) DEFAULT NULL COMMENT 'JWT refresh token for user session (role=0,1)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `email`, `password_hash`, `full_name`, `phone`, `role`, `is_active`, `created_at`, `updated_at`, `last_login`, `session_token`, `admin_session_token`, `user_session_token`, `admin_refresh_token`, `user_refresh_token`) VALUES
(6, 'admin', 'admin@gmail.com', '$2b$10$84e9xqnTc50CPaf5pOldT.Ob9zW9/RVK.G3Whr.TdAncfRdE.UivG', 'admin', '0123456788', 2, 1, '2025-11-05 09:33:52', '2026-01-04 12:43:43', NULL, NULL, NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYsInVzZXJuYW1lIjoiYWRtaW4iLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsInJvbGUiOjIsInNlc3Npb25UeXBlIjoiYWRtaW4iLCJpYXQiOjE3Njc1MzA2MjMsImV4cCI6MTc2ODEzNTQyM30.bcS9UPxIOUvrlSyvaoMmyZMe5G7zLXWDjKyPKKgAAUs', NULL),
(20, 'tranthib671', 'thib@gmail.com', '$2b$10$KQc2staSc5WX/9OIkHi3reX8XJO8L51YDjK.N5YP5XpPaghoLS.rK', 'Trần Thị B', '0908787671', 0, 1, '2025-11-24 12:44:44', '2025-12-30 13:50:04', NULL, NULL, NULL, NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIwLCJ1c2VybmFtZSI6InRyYW50aGliNjcxIiwiZW1haWwiOiJ0aGliQGdtYWlsLmNvbSIsInJvbGUiOjAsInNlc3Npb25UeXBlIjoidXNlciIsImlhdCI6MTc2NzEwMjYwNCwiZXhwIjoxNzY3NzA3NDA0fQ.Z5ItBnXg5CNldNyXD0ddJ9nCfdrv8GdrfRZDG_cWxnc'),
(21, 'nguyenvana561', 'vana@gmail.com', '$2b$10$AUdU1V0dW6n0Eh1tJ1Nw6.vvvjGnlWOCVmHPXSMuuDCFolwPwXrLO', 'Nguyễn Văn A', '0908786561', 0, 1, '2025-11-24 14:41:59', '2025-12-17 12:58:48', NULL, NULL, NULL, NULL, NULL, NULL),
(23, 'demo776', 'duyanh0756@gmail.com', '$2b$10$zktOnaEqf4xAlpzcuLwnVuJoxqlh9L.NmN9QELfvohaYMDp6E3Vq2', 'Demo', '0908887776', 0, 1, '2025-12-18 05:08:23', '2025-12-30 13:54:53', NULL, NULL, NULL, NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIzLCJ1c2VybmFtZSI6ImRlbW83NzYiLCJlbWFpbCI6ImR1eWFuaDA3NTZAZ21haWwuY29tIiwicm9sZSI6MCwic2Vzc2lvblR5cGUiOiJ1c2VyIiwiaWF0IjoxNzY3MTAyODkzLCJleHAiOjE3Njc3MDc2OTN9.8IfB73hjTROn0Nb8dyHUEMipwjSOXj8rkpqGBpD43vM'),
(25, 'phamvanc881', 'vanc@gmail.com', '$2b$10$vvoggUuo3wInNzqPETBxNeoHvMOmnp6b3mMx/EBxAYhDs/d4PDqQK', 'Phạm Văn C', '0908988881', 0, 1, '2025-12-30 16:25:54', '2025-12-30 16:26:21', NULL, NULL, NULL, NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjI1LCJ1c2VybmFtZSI6InBoYW12YW5jODgxIiwiZW1haWwiOiJ2YW5jQGdtYWlsLmNvbSIsInJvbGUiOjAsInNlc3Npb25UeXBlIjoidXNlciIsImlhdCI6MTc2NzExMTk4MSwiZXhwIjoxNzY3NzE2NzgxfQ.-NWpuO47fwrariWU3BpAIVHbXnRMaqst-u7NGxdAZPI');

-- --------------------------------------------------------

--
-- Table structure for table `variants_attribute_values`
--

CREATE TABLE `variants_attribute_values` (
  `variant_id` int(11) NOT NULL,
  `attribute_value_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `variants_attribute_values`
--

INSERT INTO `variants_attribute_values` (`variant_id`, `attribute_value_id`) VALUES
(588, 80),
(589, 82),
(590, 83);

-- --------------------------------------------------------

--
-- Table structure for table `variant_images`
--

CREATE TABLE `variant_images` (
  `image_id` int(11) NOT NULL,
  `variant_id` int(11) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `alt_text` varchar(255) DEFAULT NULL,
  `is_primary` tinyint(1) DEFAULT 0,
  `display_order` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `variant_serials`
--

CREATE TABLE `variant_serials` (
  `serial_id` int(11) NOT NULL,
  `variant_id` int(11) NOT NULL,
  `serial_number` varchar(64) NOT NULL,
  `status` enum('in_stock','reserved','sold','rma_in','rma_done','scrapped') NOT NULL DEFAULT 'in_stock',
  `order_item_id` int(11) DEFAULT NULL,
  `warranty_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `variant_serials`
--

INSERT INTO `variant_serials` (`serial_id`, `variant_id`, `serial_number`, `status`, `order_item_id`, `warranty_id`, `created_at`, `updated_at`) VALUES
(975, 587, 'SN58720260001', 'in_stock', NULL, NULL, '2026-01-04 12:41:54', '2026-01-04 12:41:54'),
(976, 587, 'SN58720260002', 'in_stock', NULL, NULL, '2026-01-04 12:41:54', '2026-01-04 12:41:54'),
(977, 587, 'SN58720260003', 'in_stock', NULL, NULL, '2026-01-04 12:41:54', '2026-01-04 12:41:54'),
(978, 588, 'SN58820260001', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(979, 588, 'SN58820260002', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(980, 588, 'SN58820260003', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(981, 588, 'SN58820260004', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(982, 588, 'SN58820260005', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(983, 588, 'SN58820260006', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(984, 588, 'SN58820260007', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(985, 588, 'SN58820260008', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(986, 588, 'SN58820260009', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(987, 588, 'SN58820260010', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(988, 588, 'SN58820260011', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(989, 588, 'SN58820260012', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(990, 588, 'SN58820260013', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(991, 588, 'SN58820260014', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(992, 588, 'SN58820260015', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(993, 588, 'SN58820260016', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(994, 588, 'SN58820260017', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(995, 588, 'SN58820260018', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(996, 588, 'SN58820260019', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(997, 588, 'SN58820260020', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(998, 588, 'SN58820260021', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(999, 588, 'SN58820260022', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1000, 588, 'SN58820260023', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1001, 588, 'SN58820260024', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1002, 588, 'SN58820260025', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1003, 588, 'SN58820260026', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1004, 588, 'SN58820260027', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1005, 588, 'SN58820260028', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1006, 588, 'SN58820260029', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1007, 588, 'SN58820260030', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1008, 588, 'SN58820260031', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1009, 588, 'SN58820260032', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1010, 588, 'SN58820260033', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1011, 588, 'SN58820260034', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1012, 588, 'SN58820260035', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1013, 588, 'SN58820260036', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1014, 588, 'SN58820260037', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1015, 588, 'SN58820260038', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1016, 588, 'SN58820260039', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1017, 588, 'SN58820260040', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1018, 588, 'SN58820260041', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1019, 588, 'SN58820260042', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1020, 588, 'SN58820260043', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1021, 588, 'SN58820260044', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1022, 588, 'SN58820260045', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1023, 588, 'SN58820260046', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1024, 588, 'SN58820260047', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1025, 588, 'SN58820260048', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1026, 588, 'SN58820260049', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1027, 588, 'SN58820260050', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1028, 588, 'SN58820260051', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1029, 588, 'SN58820260052', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1030, 588, 'SN58820260053', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1031, 588, 'SN58820260054', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1032, 588, 'SN58820260055', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1033, 588, 'SN58820260056', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1034, 588, 'SN58820260057', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1035, 588, 'SN58820260058', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1036, 588, 'SN58820260059', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1037, 588, 'SN58820260060', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1038, 588, 'SN58820260061', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1039, 588, 'SN58820260062', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1040, 588, 'SN58820260063', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1041, 588, 'SN58820260064', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1042, 588, 'SN58820260065', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1043, 588, 'SN58820260066', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1044, 588, 'SN58820260067', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1045, 588, 'SN58820260068', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1046, 588, 'SN58820260069', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1047, 588, 'SN58820260070', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1048, 588, 'SN58820260071', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1049, 588, 'SN58820260072', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1050, 588, 'SN58820260073', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1051, 588, 'SN58820260074', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1052, 588, 'SN58820260075', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1053, 588, 'SN58820260076', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1054, 588, 'SN58820260077', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1055, 588, 'SN58820260078', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1056, 588, 'SN58820260079', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1057, 588, 'SN58820260080', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1058, 588, 'SN58820260081', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1059, 588, 'SN58820260082', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1060, 588, 'SN58820260083', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1061, 588, 'SN58820260084', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1062, 588, 'SN58820260085', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1063, 588, 'SN58820260086', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1064, 588, 'SN58820260087', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1065, 588, 'SN58820260088', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1066, 588, 'SN58820260089', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1067, 588, 'SN58820260090', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1068, 588, 'SN58820260091', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1069, 588, 'SN58820260092', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1070, 588, 'SN58820260093', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1071, 588, 'SN58820260094', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1072, 588, 'SN58820260095', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1073, 588, 'SN58820260096', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1074, 588, 'SN58820260097', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1075, 588, 'SN58820260098', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1076, 588, 'SN58820260099', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1077, 588, 'SN58820260100', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1078, 589, 'SN58920260001', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1079, 589, 'SN58920260002', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1080, 589, 'SN58920260003', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1081, 589, 'SN58920260004', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1082, 589, 'SN58920260005', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1083, 589, 'SN58920260006', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1084, 589, 'SN58920260007', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1085, 589, 'SN58920260008', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1086, 589, 'SN58920260009', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1087, 589, 'SN58920260010', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1088, 589, 'SN58920260011', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1089, 589, 'SN58920260012', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1090, 589, 'SN58920260013', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1091, 589, 'SN58920260014', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1092, 589, 'SN58920260015', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1093, 589, 'SN58920260016', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1094, 589, 'SN58920260017', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1095, 589, 'SN58920260018', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1096, 589, 'SN58920260019', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1097, 589, 'SN58920260020', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1098, 589, 'SN58920260021', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1099, 589, 'SN58920260022', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1100, 589, 'SN58920260023', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1101, 589, 'SN58920260024', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1102, 589, 'SN58920260025', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1103, 589, 'SN58920260026', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1104, 589, 'SN58920260027', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1105, 589, 'SN58920260028', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1106, 589, 'SN58920260029', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1107, 589, 'SN58920260030', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1108, 589, 'SN58920260031', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1109, 589, 'SN58920260032', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1110, 589, 'SN58920260033', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1111, 589, 'SN58920260034', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1112, 589, 'SN58920260035', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1113, 589, 'SN58920260036', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1114, 589, 'SN58920260037', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1115, 589, 'SN58920260038', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1116, 589, 'SN58920260039', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1117, 589, 'SN58920260040', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1118, 589, 'SN58920260041', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1119, 589, 'SN58920260042', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1120, 589, 'SN58920260043', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1121, 589, 'SN58920260044', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1122, 589, 'SN58920260045', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1123, 589, 'SN58920260046', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1124, 589, 'SN58920260047', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1125, 589, 'SN58920260048', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1126, 589, 'SN58920260049', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1127, 589, 'SN58920260050', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1128, 589, 'SN58920260051', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1129, 589, 'SN58920260052', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1130, 589, 'SN58920260053', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1131, 589, 'SN58920260054', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1132, 589, 'SN58920260055', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1133, 589, 'SN58920260056', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1134, 589, 'SN58920260057', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1135, 589, 'SN58920260058', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1136, 589, 'SN58920260059', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1137, 589, 'SN58920260060', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1138, 590, 'SN59020260001', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1139, 590, 'SN59020260002', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1140, 590, 'SN59020260003', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1141, 590, 'SN59020260004', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1142, 590, 'SN59020260005', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1143, 590, 'SN59020260006', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1144, 590, 'SN59020260007', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1145, 590, 'SN59020260008', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1146, 590, 'SN59020260009', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1147, 590, 'SN59020260010', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1148, 590, 'SN59020260011', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1149, 590, 'SN59020260012', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1150, 590, 'SN59020260013', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1151, 590, 'SN59020260014', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1152, 590, 'SN59020260015', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1153, 590, 'SN59020260016', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1154, 590, 'SN59020260017', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1155, 590, 'SN59020260018', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1156, 590, 'SN59020260019', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1157, 590, 'SN59020260020', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1158, 590, 'SN59020260021', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1159, 590, 'SN59020260022', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1160, 590, 'SN59020260023', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1161, 590, 'SN59020260024', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1162, 590, 'SN59020260025', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1163, 590, 'SN59020260026', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1164, 590, 'SN59020260027', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1165, 590, 'SN59020260028', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1166, 590, 'SN59020260029', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1167, 590, 'SN59020260030', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1168, 590, 'SN59020260031', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1169, 590, 'SN59020260032', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1170, 590, 'SN59020260033', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1171, 590, 'SN59020260034', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1172, 590, 'SN59020260035', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1173, 590, 'SN59020260036', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1174, 590, 'SN59020260037', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1175, 590, 'SN59020260038', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1176, 590, 'SN59020260039', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1177, 590, 'SN59020260040', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1178, 590, 'SN59020260041', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1179, 590, 'SN59020260042', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1180, 590, 'SN59020260043', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1181, 590, 'SN59020260044', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1182, 590, 'SN59020260045', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1183, 590, 'SN59020260046', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1184, 590, 'SN59020260047', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1185, 590, 'SN59020260048', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1186, 590, 'SN59020260049', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1187, 590, 'SN59020260050', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1188, 590, 'SN59020260051', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1189, 590, 'SN59020260052', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1190, 590, 'SN59020260053', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1191, 590, 'SN59020260054', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1192, 590, 'SN59020260055', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1193, 590, 'SN59020260056', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1194, 590, 'SN59020260057', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1195, 590, 'SN59020260058', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1196, 590, 'SN59020260059', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1197, 590, 'SN59020260060', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1198, 590, 'SN59020260061', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1199, 590, 'SN59020260062', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1200, 590, 'SN59020260063', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1201, 590, 'SN59020260064', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1202, 590, 'SN59020260065', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1203, 590, 'SN59020260066', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1204, 590, 'SN59020260067', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1205, 590, 'SN59020260068', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1206, 590, 'SN59020260069', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1207, 590, 'SN59020260070', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1208, 590, 'SN59020260071', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1209, 590, 'SN59020260072', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1210, 590, 'SN59020260073', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1211, 590, 'SN59020260074', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1212, 590, 'SN59020260075', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1213, 590, 'SN59020260076', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1214, 590, 'SN59020260077', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1215, 590, 'SN59020260078', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1216, 590, 'SN59020260079', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37'),
(1217, 590, 'SN59020260080', 'in_stock', NULL, NULL, '2026-01-04 12:50:37', '2026-01-04 12:50:37');

-- --------------------------------------------------------

--
-- Table structure for table `warranties`
--

CREATE TABLE `warranties` (
  `warranty_id` int(11) NOT NULL,
  `serial_id` int(11) NOT NULL,
  `order_item_id` int(11) NOT NULL,
  `warranty_period` int(11) NOT NULL COMMENT 'Thời gian bảo hành (tháng)',
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `status` enum('active','expired','claimed','void') DEFAULT 'active',
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `addresses`
--
ALTER TABLE `addresses`
  ADD PRIMARY KEY (`address_id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_is_default` (`is_default`);

--
-- Indexes for table `articles`
--
ALTER TABLE `articles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_articles_slug` (`slug`),
  ADD KEY `idx_articles_name` (`name`);

--
-- Indexes for table `attributes`
--
ALTER TABLE `attributes`
  ADD PRIMARY KEY (`attribute_id`);

--
-- Indexes for table `attributes_categories`
--
ALTER TABLE `attributes_categories`
  ADD PRIMARY KEY (`attribute_category_id`),
  ADD KEY `attribute_categories_ibfk_1` (`attribute_id`),
  ADD KEY `attribute_categories_ibfk_2` (`category_id`);

--
-- Indexes for table `attribute_values`
--
ALTER TABLE `attribute_values`
  ADD PRIMARY KEY (`attribute_value_id`),
  ADD UNIQUE KEY `unique_attribute_value` (`attribute_id`,`value_name`),
  ADD UNIQUE KEY `uk_attribute_value` (`attribute_id`,`value_name`),
  ADD KEY `idx_attribute_id` (`attribute_id`);

--
-- Indexes for table `builds`
--
ALTER TABLE `builds`
  ADD PRIMARY KEY (`build_id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_is_public` (`is_public`),
  ADD KEY `idx_created_at` (`created_at`);

--
-- Indexes for table `build_items`
--
ALTER TABLE `build_items`
  ADD PRIMARY KEY (`build_item_id`),
  ADD KEY `idx_build_id` (`build_id`),
  ADD KEY `idx_variant_id` (`variant_id`);

--
-- Indexes for table `carts`
--
ALTER TABLE `carts`
  ADD PRIMARY KEY (`cart_id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_session_id` (`session_id`);

--
-- Indexes for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD PRIMARY KEY (`cart_item_id`),
  ADD UNIQUE KEY `uk_cart_variant` (`cart_id`,`variant_id`),
  ADD KEY `idx_cart_id` (`cart_id`),
  ADD KEY `idx_variant_id` (`variant_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`category_id`),
  ADD KEY `idx_parent_category` (`parent_category_id`),
  ADD KEY `idx_is_active` (`is_active`);

--
-- Indexes for table `categories_attributes_values`
--
ALTER TABLE `categories_attributes_values`
  ADD PRIMARY KEY (`cav_id`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `attribute_id` (`attribute_id`),
  ADD KEY `attribute_value_id` (`attribute_value_id`);

--
-- Indexes for table `coupons`
--
ALTER TABLE `coupons`
  ADD PRIMARY KEY (`coupon_id`),
  ADD UNIQUE KEY `coupon_code` (`coupon_code`),
  ADD KEY `idx_coupon_code` (`coupon_code`),
  ADD KEY `idx_is_active` (`is_active`),
  ADD KEY `idx_valid_dates` (`valid_from`,`valid_until`);

--
-- Indexes for table `installments`
--
ALTER TABLE `installments`
  ADD PRIMARY KEY (`installment_id`),
  ADD KEY `fk_installment_order` (`order_id`),
  ADD KEY `idx_down_payment_status` (`down_payment_status`),
  ADD KEY `fk_installments_policy` (`policy_id`);

--
-- Indexes for table `installment_payments`
--
ALTER TABLE `installment_payments`
  ADD PRIMARY KEY (`payment_id`),
  ADD KEY `fk_payment_installment` (`installment_id`);

--
-- Indexes for table `installment_policies`
--
ALTER TABLE `installment_policies`
  ADD PRIMARY KEY (`policy_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`),
  ADD UNIQUE KEY `order_number` (`order_number`),
  ADD KEY `address_id` (`address_id`),
  ADD KEY `coupon_id` (`coupon_id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_order_number` (`order_number`),
  ADD KEY `idx_order_status` (`order_status`),
  ADD KEY `idx_payment_status` (`payment_status`),
  ADD KEY `idx_created_at` (`created_at`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`order_item_id`),
  ADD KEY `idx_order_id` (`order_id`),
  ADD KEY `idx_variant_id` (`variant_id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`payment_id`),
  ADD KEY `idx_order_id` (`order_id`),
  ADD KEY `idx_payment_status` (`payment_status`),
  ADD KEY `idx_transaction_id` (`transaction_id`);

--
-- Indexes for table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_posts_slug` (`slug`),
  ADD KEY `idx_posts_article` (`article_id`),
  ADD KEY `idx_posts_author` (`author_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`product_id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `idx_category_id` (`category_id`),
  ADD KEY `idx_slug` (`slug`),
  ADD KEY `idx_is_active` (`is_active`),
  ADD KEY `idx_is_featured` (`is_featured`);
ALTER TABLE `products` ADD FULLTEXT KEY `idx_search` (`product_name`,`description`);

--
-- Indexes for table `products_attribute_values`
--
ALTER TABLE `products_attribute_values`
  ADD PRIMARY KEY (`product_id`,`attribute_value_id`),
  ADD KEY `products_attribute_values_ibfk_2` (`attribute_value_id`);

--
-- Indexes for table `product_variants`
--
ALTER TABLE `product_variants`
  ADD PRIMARY KEY (`variant_id`),
  ADD UNIQUE KEY `sku` (`sku`),
  ADD KEY `idx_product_id` (`product_id`),
  ADD KEY `idx_sku` (`sku`),
  ADD KEY `idx_is_active` (`is_active`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`review_id`),
  ADD UNIQUE KEY `unique_review` (`user_id`,`product_id`,`order_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `order_id` (`order_id`);

--
-- Indexes for table `service_requests`
--
ALTER TABLE `service_requests`
  ADD PRIMARY KEY (`service_request_id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_request_type` (`request_type`),
  ADD KEY `idx_priority` (`priority`),
  ADD KEY `fk_sr_warranty` (`warranty_id`),
  ADD KEY `fk_sr_serial` (`serial_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_username` (`username`),
  ADD KEY `idx_role` (`role`),
  ADD KEY `idx_admin_session` (`admin_session_token`),
  ADD KEY `idx_user_session` (`user_session_token`);

--
-- Indexes for table `variants_attribute_values`
--
ALTER TABLE `variants_attribute_values`
  ADD PRIMARY KEY (`variant_id`,`attribute_value_id`),
  ADD KEY `idx_variant_id` (`variant_id`),
  ADD KEY `idx_attribute_value_id` (`attribute_value_id`);

--
-- Indexes for table `variant_images`
--
ALTER TABLE `variant_images`
  ADD PRIMARY KEY (`image_id`),
  ADD KEY `idx_variant_id` (`variant_id`),
  ADD KEY `idx_is_primary` (`is_primary`);

--
-- Indexes for table `variant_serials`
--
ALTER TABLE `variant_serials`
  ADD PRIMARY KEY (`serial_id`),
  ADD UNIQUE KEY `uk_variant_serial` (`variant_id`,`serial_number`),
  ADD KEY `idx_serial` (`serial_number`),
  ADD KEY `idx_variant_status` (`variant_id`,`status`),
  ADD KEY `idx_order_item` (`order_item_id`),
  ADD KEY `idx_warranty` (`warranty_id`);

--
-- Indexes for table `warranties`
--
ALTER TABLE `warranties`
  ADD PRIMARY KEY (`warranty_id`),
  ADD KEY `idx_order_item_id` (`order_item_id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_end_date` (`end_date`),
  ADD KEY `idx_serial_id` (`serial_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `addresses`
--
ALTER TABLE `addresses`
  MODIFY `address_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=113;

--
-- AUTO_INCREMENT for table `articles`
--
ALTER TABLE `articles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `attributes`
--
ALTER TABLE `attributes`
  MODIFY `attribute_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `attributes_categories`
--
ALTER TABLE `attributes_categories`
  MODIFY `attribute_category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `attribute_values`
--
ALTER TABLE `attribute_values`
  MODIFY `attribute_value_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=169;

--
-- AUTO_INCREMENT for table `builds`
--
ALTER TABLE `builds`
  MODIFY `build_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `build_items`
--
ALTER TABLE `build_items`
  MODIFY `build_item_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `carts`
--
ALTER TABLE `carts`
  MODIFY `cart_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `cart_items`
--
ALTER TABLE `cart_items`
  MODIFY `cart_item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=159;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- AUTO_INCREMENT for table `categories_attributes_values`
--
ALTER TABLE `categories_attributes_values`
  MODIFY `cav_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=285;

--
-- AUTO_INCREMENT for table `coupons`
--
ALTER TABLE `coupons`
  MODIFY `coupon_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `installments`
--
ALTER TABLE `installments`
  MODIFY `installment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- AUTO_INCREMENT for table `installment_payments`
--
ALTER TABLE `installment_payments`
  MODIFY `payment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=172;

--
-- AUTO_INCREMENT for table `installment_policies`
--
ALTER TABLE `installment_policies`
  MODIFY `policy_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=135;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `order_item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=166;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `payment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=92;

--
-- AUTO_INCREMENT for table `posts`
--
ALTER TABLE `posts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=391;

--
-- AUTO_INCREMENT for table `product_variants`
--
ALTER TABLE `product_variants`
  MODIFY `variant_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=591;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `review_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `service_requests`
--
ALTER TABLE `service_requests`
  MODIFY `service_request_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `variant_images`
--
ALTER TABLE `variant_images`
  MODIFY `image_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=202;

--
-- AUTO_INCREMENT for table `variant_serials`
--
ALTER TABLE `variant_serials`
  MODIFY `serial_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1218;

--
-- AUTO_INCREMENT for table `warranties`
--
ALTER TABLE `warranties`
  MODIFY `warranty_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `addresses`
--
ALTER TABLE `addresses`
  ADD CONSTRAINT `addresses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `attributes_categories`
--
ALTER TABLE `attributes_categories`
  ADD CONSTRAINT `attributes_categories_ibfk_1` FOREIGN KEY (`attribute_id`) REFERENCES `attributes` (`attribute_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `attributes_categories_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE CASCADE;

--
-- Constraints for table `attribute_values`
--
ALTER TABLE `attribute_values`
  ADD CONSTRAINT `attribute_values_ibfk_1` FOREIGN KEY (`attribute_id`) REFERENCES `attributes` (`attribute_id`) ON DELETE CASCADE;

--
-- Constraints for table `builds`
--
ALTER TABLE `builds`
  ADD CONSTRAINT `builds_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `build_items`
--
ALTER TABLE `build_items`
  ADD CONSTRAINT `build_items_ibfk_1` FOREIGN KEY (`build_id`) REFERENCES `builds` (`build_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `build_items_ibfk_2` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`variant_id`) ON DELETE CASCADE;

--
-- Constraints for table `carts`
--
ALTER TABLE `carts`
  ADD CONSTRAINT `carts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`cart_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `cart_items_ibfk_2` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`variant_id`) ON DELETE CASCADE;

--
-- Constraints for table `categories`
--
ALTER TABLE `categories`
  ADD CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`parent_category_id`) REFERENCES `categories` (`category_id`) ON DELETE SET NULL;

--
-- Constraints for table `categories_attributes_values`
--
ALTER TABLE `categories_attributes_values`
  ADD CONSTRAINT `categories_attributes_values_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `categories_attributes_values_ibfk_2` FOREIGN KEY (`attribute_id`) REFERENCES `attributes` (`attribute_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `categories_attributes_values_ibfk_3` FOREIGN KEY (`attribute_value_id`) REFERENCES `attribute_values` (`attribute_value_id`) ON DELETE CASCADE;

--
-- Constraints for table `installments`
--
ALTER TABLE `installments`
  ADD CONSTRAINT `fk_installment_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`),
  ADD CONSTRAINT `fk_installments_policy` FOREIGN KEY (`policy_id`) REFERENCES `installment_policies` (`policy_id`);

--
-- Constraints for table `installment_payments`
--
ALTER TABLE `installment_payments`
  ADD CONSTRAINT `fk_payment_installment` FOREIGN KEY (`installment_id`) REFERENCES `installments` (`installment_id`);

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`address_id`) REFERENCES `addresses` (`address_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `orders_ibfk_3` FOREIGN KEY (`coupon_id`) REFERENCES `coupons` (`coupon_id`) ON DELETE SET NULL;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`variant_id`);

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE;

--
-- Constraints for table `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `fk_posts_article` FOREIGN KEY (`article_id`) REFERENCES `articles` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_posts_author` FOREIGN KEY (`author_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`);

--
-- Constraints for table `products_attribute_values`
--
ALTER TABLE `products_attribute_values`
  ADD CONSTRAINT `products_attribute_values_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `products_attribute_values_ibfk_2` FOREIGN KEY (`attribute_value_id`) REFERENCES `attribute_values` (`attribute_value_id`);

--
-- Constraints for table `product_variants`
--
ALTER TABLE `product_variants`
  ADD CONSTRAINT `product_variants_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE;

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`),
  ADD CONSTRAINT `reviews_ibfk_3` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`);

--
-- Constraints for table `service_requests`
--
ALTER TABLE `service_requests`
  ADD CONSTRAINT `fk_sr_serial` FOREIGN KEY (`serial_id`) REFERENCES `variant_serials` (`serial_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_sr_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_sr_warranty` FOREIGN KEY (`warranty_id`) REFERENCES `warranties` (`warranty_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `variants_attribute_values`
--
ALTER TABLE `variants_attribute_values`
  ADD CONSTRAINT `variants_attribute_values_ibfk_1` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`variant_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `variants_attribute_values_ibfk_2` FOREIGN KEY (`attribute_value_id`) REFERENCES `attribute_values` (`attribute_value_id`) ON DELETE CASCADE;

--
-- Constraints for table `variant_images`
--
ALTER TABLE `variant_images`
  ADD CONSTRAINT `variant_images_ibfk_1` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`variant_id`) ON DELETE CASCADE;

--
-- Constraints for table `variant_serials`
--
ALTER TABLE `variant_serials`
  ADD CONSTRAINT `vs_fk_order_item` FOREIGN KEY (`order_item_id`) REFERENCES `order_items` (`order_item_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `vs_fk_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`variant_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `vs_fk_warranty` FOREIGN KEY (`warranty_id`) REFERENCES `warranties` (`warranty_id`) ON DELETE SET NULL;

--
-- Constraints for table `warranties`
--
ALTER TABLE `warranties`
  ADD CONSTRAINT `fk_warranties_serial` FOREIGN KEY (`serial_id`) REFERENCES `variant_serials` (`serial_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `warranties_ibfk_1` FOREIGN KEY (`order_item_id`) REFERENCES `order_items` (`order_item_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
