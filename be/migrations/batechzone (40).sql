-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 04, 2026 at 05:37 AM
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
(93, 'Dung lượng', 0, 1, '2026-01-02 15:07:37'),
(94, 'Số vòng quay', 0, 1, '2026-01-03 01:28:03'),
(95, 'Attr1', 0, 1, '2026-01-03 15:43:51'),
(96, 'Attr2', 0, 1, '2026-01-03 16:19:46');

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
(94, 93, 13, 0),
(95, 94, 13, 0),
(101, 96, 56, 1),
(104, 96, 55, 0);

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
(381, 96, 'AValue', 0, 1, '2026-01-03 16:36:25'),
(382, 96, 'AValue1', 0, 1, '2026-01-03 16:40:13');

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

--
-- Dumping data for table `cart_items`
--

INSERT INTO `cart_items` (`cart_item_id`, `cart_id`, `variant_id`, `quantity`, `added_at`, `updated_at`) VALUES
(69, 11, 501, 1, '2025-11-29 12:00:57', '2025-11-29 12:00:57'),
(118, 14, 501, 1, '2025-12-11 07:32:42', '2025-12-11 07:32:42'),
(149, 15, 510, 1, '2025-12-30 14:05:25', '2025-12-30 14:05:25'),
(155, 1, 521, 1, '2025-12-30 16:11:44', '2025-12-30 16:11:44'),
(156, 1, 531, 1, '2025-12-30 16:11:55', '2025-12-30 16:11:55'),
(157, 17, 531, 1, '2025-12-30 16:34:37', '2025-12-30 16:34:37'),
(158, 17, 521, 1, '2025-12-30 16:34:39', '2025-12-30 16:34:39');

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
(49, 'Custom Water', 'Tản nhiệt nước custom - Bộ kit tản nước custom loop', 8, '/uploads/categories/custom_water-1764063311202-157641460.jpg', NULL, 1, 49, '2025-11-25 08:58:13', '2025-11-25 10:40:27'),
(55, 'DEMO', NULL, NULL, '/uploads/categories/MAINBOARD-1767454750151-26395931.webp', NULL, 1, 0, '2026-01-03 15:39:10', '2026-01-03 15:39:10'),
(56, 'DEMO1', NULL, NULL, NULL, NULL, 1, 0, '2026-01-03 16:19:39', '2026-01-03 16:19:39');

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
(1, 55, 96, 381),
(2, 56, 96, 381),
(3, 56, 96, 382);

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

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`order_item_id`, `order_id`, `variant_id`, `product_name`, `variant_name`, `sku`, `quantity`, `unit_price`, `discount_amount`, `subtotal`, `created_at`) VALUES
(67, 46, 379, 'Intel Core i7-13700K', 'Box', 'INTEL-13700K-BOX', 1, 9000000.00, 0.00, 9000000.00, '2025-11-24 12:44:44'),
(68, 46, 400, 'Seasonic Focus GX-750', '750W Gold', 'SSN-GX750', 1, 3000000.00, 0.00, 3000000.00, '2025-11-24 12:44:44'),
(69, 47, 379, 'Intel Core i7-13700K', 'Box', 'INTEL-13700K-BOX', 1, 9000000.00, 0.00, 9000000.00, '2025-11-24 14:41:59'),
(70, 47, 400, 'Seasonic Focus GX-750', '750W Gold', 'SSN-GX750', 1, 3000000.00, 0.00, 3000000.00, '2025-11-24 14:41:59'),
(71, 48, 379, 'Intel Core i7-13700K', 'Box', 'INTEL-13700K-BOX', 1, 9000000.00, 0.00, 9000000.00, '2025-11-29 12:02:28'),
(72, 49, 510, 'Logitech G Pro X Mechanical Gaming Keyboard', 'GX Blue Switch', 'LOGI-GPROX-STD', 1, 3290000.00, 0.00, 3290000.00, '2025-12-05 03:04:16'),
(73, 50, 501, 'ASUS TUF VG27AQ 27\" WQHD 165Hz', 'Standard', 'ASUS-VG27AQ-STD', 1, 9990000.00, 0.00, 9990000.00, '2025-12-05 03:09:03'),
(74, 51, 530, 'HyperX Cloud II Gaming Headset', 'Red', 'HX-CLOUD2-RED', 1, 2390000.00, 0.00, 2390000.00, '2025-12-05 03:30:19'),
(75, 51, 510, 'Logitech G Pro X Mechanical Gaming Keyboard', 'GX Blue Switch', 'LOGI-GPROX-STD', 1, 3290000.00, 0.00, 3290000.00, '2025-12-05 03:30:19'),
(76, 51, 500, 'LG UltraGear 27GN800-B 27\" QHD 144Hz', 'Standard', 'LG-27GN800-STD', 2, 8490000.00, 0.00, 16980000.00, '2025-12-05 03:30:19'),
(77, 52, 530, 'HyperX Cloud II Gaming Headset', 'Red', 'HX-CLOUD2-RED', 1, 2390000.00, 0.00, 2390000.00, '2025-12-05 04:28:59'),
(78, 53, 511, 'Corsair K70 RGB MK.2 Cherry MX Red', 'Cherry MX Red', 'CORS-K70-RED', 3, 10000.00, 0.00, 30000.00, '2025-12-05 05:43:49'),
(79, 54, 511, 'Corsair K70 RGB MK.2 Cherry MX Red', 'Cherry MX Red', 'CORS-K70-RED', 3, 10000.00, 0.00, 30000.00, '2025-12-05 05:43:49'),
(80, 55, 511, 'Corsair K70 RGB MK.2 Cherry MX Red', 'Cherry MX Red', 'CORS-K70-RED', 3, 10000.00, 0.00, 30000.00, '2025-12-05 05:44:35'),
(81, 56, 531, 'Razer BlackShark V2 Pro Wireless', 'Pro', 'RAZER-BS-V2-PRO', 1, 3990000.00, 0.00, 3990000.00, '2025-12-05 05:48:09'),
(82, 57, 531, 'Razer BlackShark V2 Pro Wireless', 'Pro', 'RAZER-BS-V2-PRO', 1, 3990000.00, 0.00, 3990000.00, '2025-12-05 05:48:09'),
(83, 58, 520, 'Logitech G304 Lightspeed Wireless', 'Black', 'LOGI-G304-BLK', 1, 990000.00, 0.00, 990000.00, '2025-12-05 05:50:27'),
(84, 59, 520, 'Logitech G304 Lightspeed Wireless', 'Black', 'LOGI-G304-BLK', 1, 990000.00, 0.00, 990000.00, '2025-12-05 05:50:27'),
(85, 60, 510, 'Logitech G Pro X Mechanical Gaming Keyboard', 'GX Blue Switch', 'LOGI-GPROX-STD', 1, 3290000.00, 0.00, 3290000.00, '2025-12-05 05:58:27'),
(86, 61, 511, 'Corsair K70 RGB MK.2 Cherry MX Red', 'Cherry MX Red', 'CORS-K70-RED', 1, 10000.00, 0.00, 10000.00, '2025-12-05 06:07:30'),
(87, 62, 511, 'Corsair K70 RGB MK.2 Cherry MX Red', 'Cherry MX Red', 'CORS-K70-RED', 2, 10000.00, 0.00, 20000.00, '2025-12-05 06:14:07'),
(88, 63, 511, 'Corsair K70 RGB MK.2 Cherry MX Red', 'Cherry MX Red', 'CORS-K70-RED', 5, 10000.00, 0.00, 50000.00, '2025-12-05 06:20:53'),
(89, 64, 511, 'Corsair K70 RGB MK.2 Cherry MX Red', 'Cherry MX Red', 'CORS-K70-RED', 2, 10000.00, 0.00, 20000.00, '2025-12-05 06:37:22'),
(90, 65, 510, 'Logitech G Pro X Mechanical Gaming Keyboard', 'GX Blue Switch', 'LOGI-GPROX-STD', 1, 3290000.00, 0.00, 3290000.00, '2025-12-05 06:49:11'),
(91, 66, 500, 'LG UltraGear 27GN800-B 27\" QHD 144Hz', 'Standard', 'LG-27GN800-STD', 1, 8490000.00, 0.00, 8490000.00, '2025-12-05 07:27:47'),
(92, 67, 531, 'Razer BlackShark V2 Pro Wireless', 'Pro', 'RAZER-BS-V2-PRO', 1, 3990000.00, 0.00, 3990000.00, '2025-12-05 07:52:57'),
(93, 68, 510, 'Logitech G Pro X Mechanical Gaming Keyboard', 'GX Blue Switch', 'LOGI-GPROX-STD', 1, 3290000.00, 0.00, 3290000.00, '2025-12-05 07:58:48'),
(94, 68, 501, 'ASUS TUF VG27AQ 27\" WQHD 165Hz', 'Standard', 'ASUS-VG27AQ-STD', 1, 9990000.00, 0.00, 9990000.00, '2025-12-05 07:58:48'),
(95, 69, 511, 'Corsair K70 RGB MK.2 Cherry MX Red', 'Cherry MX Red', 'CORS-K70-RED', 1, 10000.00, 0.00, 10000.00, '2025-12-05 08:02:24'),
(96, 69, 510, 'Logitech G Pro X Mechanical Gaming Keyboard', 'GX Blue Switch', 'LOGI-GPROX-STD', 1, 3290000.00, 0.00, 3290000.00, '2025-12-05 08:02:24'),
(97, 69, 501, 'ASUS TUF VG27AQ 27\" WQHD 165Hz', 'Standard', 'ASUS-VG27AQ-STD', 2, 9990000.00, 0.00, 19980000.00, '2025-12-05 08:02:24'),
(98, 70, 511, 'Corsair K70 RGB MK.2 Cherry MX Red', 'Cherry MX Red', 'CORS-K70-RED', 7, 10000.00, 0.00, 70000.00, '2025-12-05 08:07:12'),
(99, 71, 520, 'Logitech G304 Lightspeed Wireless', 'Black', 'LOGI-G304-BLK', 1, 990000.00, 0.00, 990000.00, '2025-12-05 11:23:46'),
(100, 72, 374, 'Ổ Cứng HDD SEAGATE Barracuda 2TB 3.5 inch 7200RPM, SATA III, 256MB Cache (ST2000DM008)', 'Seagate-2TB-7200RPM', 'Seagate-2TB-7200RPM', 1, 2500000.00, 0.00, 2500000.00, '2025-12-05 11:30:06'),
(101, 73, 374, 'Ổ Cứng HDD SEAGATE Barracuda 2TB 3.5 inch 7200RPM, SATA III, 256MB Cache (ST2000DM008)', 'Seagate-2TB-7200RPM', 'Seagate-2TB-7200RPM', 1, 2500000.00, 0.00, 2500000.00, '2025-12-05 11:50:25'),
(102, 74, 501, 'ASUS TUF VG27AQ 27\" WQHD 165Hz', 'Standard', 'ASUS-VG27AQ-STD', 1, 9990000.00, 0.00, 9990000.00, '2025-12-05 12:07:58'),
(103, 75, 501, 'ASUS TUF VG27AQ 27\" WQHD 165Hz', 'Standard', 'ASUS-VG27AQ-STD', 2, 9990000.00, 0.00, 19980000.00, '2025-12-05 12:19:10'),
(104, 76, 501, 'ASUS TUF VG27AQ 27\" WQHD 165Hz', 'Standard', 'ASUS-VG27AQ-STD', 1, 9990000.00, 0.00, 9990000.00, '2025-12-05 12:24:41'),
(105, 77, 501, 'ASUS TUF VG27AQ 27\" WQHD 165Hz', 'Standard', 'ASUS-VG27AQ-STD', 2, 9990000.00, 0.00, 19980000.00, '2025-12-05 12:41:42'),
(106, 78, 501, 'ASUS TUF VG27AQ 27\" WQHD 165Hz', 'Standard', 'ASUS-VG27AQ-STD', 3, 9990000.00, 0.00, 29970000.00, '2025-12-05 12:43:07'),
(107, 79, 501, 'ASUS TUF VG27AQ 27\" WQHD 165Hz', 'Standard', 'ASUS-VG27AQ-STD', 4, 9990000.00, 0.00, 39960000.00, '2025-12-05 13:02:20'),
(108, 80, 510, 'Logitech G Pro X Mechanical Gaming Keyboard', 'GX Blue Switch', 'LOGI-GPROX-STD', 1, 3290000.00, 0.00, 3290000.00, '2025-12-05 13:04:15'),
(109, 81, 510, 'Logitech G Pro X Mechanical Gaming Keyboard', 'GX Blue Switch', 'LOGI-GPROX-STD', 2, 3290000.00, 0.00, 6580000.00, '2025-12-05 13:18:29'),
(110, 82, 501, 'ASUS TUF VG27AQ 27\" WQHD 165Hz', 'Standard', 'ASUS-VG27AQ-STD', 1, 9990000.00, 0.00, 9990000.00, '2025-12-11 09:18:53'),
(111, 83, 511, 'Corsair K70 RGB MK.2 Cherry MX Red', 'Cherry MX Red', 'CORS-K70-RED', 1, 10000.00, 0.00, 10000.00, '2025-12-11 09:42:11'),
(112, 84, 500, 'LG UltraGear 27GN800-B 27\" QHD 144Hz', 'Standard', 'LG-27GN800-STD', 1, 8490000.00, 0.00, 8490000.00, '2025-12-11 12:01:18'),
(113, 84, 511, 'Corsair K70 RGB MK.2 Cherry MX Red', 'Cherry MX Red', 'CORS-K70-RED', 1, 10000.00, 0.00, 10000.00, '2025-12-11 12:01:18'),
(114, 85, 510, 'Logitech G Pro X Mechanical Gaming Keyboard', 'GX Blue Switch', 'LOGI-GPROX-STD', 1, 3290000.00, 0.00, 3290000.00, '2025-12-11 12:09:34'),
(115, 86, 510, 'Logitech G Pro X Mechanical Gaming Keyboard', 'GX Blue Switch', 'LOGI-GPROX-STD', 2, 3290000.00, 0.00, 6580000.00, '2025-12-14 13:12:52'),
(116, 87, 500, 'LG UltraGear 27GN800-B 27\" QHD 144Hz', 'Standard', 'LG-27GN800-STD', 1, 8490000.00, 0.00, 8490000.00, '2025-12-18 05:03:36'),
(117, 87, 389, 'WD Blue NVMe 512GB', '512GB', 'WD-NVME-512GB', 1, 900000.00, 0.00, 900000.00, '2025-12-18 05:03:36'),
(118, 88, 511, 'Corsair K70 RGB MK.2 Cherry MX Red', 'Cherry MX Red', 'CORS-K70-RED', 1, 10000.00, 0.00, 10000.00, '2025-12-18 05:08:23'),
(119, 89, 520, 'Logitech G304 Lightspeed Wireless', 'Black', 'LOGI-G304-BLK', 1, 990000.00, 0.00, 990000.00, '2025-12-18 07:28:26'),
(120, 90, 520, 'Logitech G304 Lightspeed Wireless', 'Black', 'LOGI-G304-BLK', 1, 990000.00, 0.00, 990000.00, '2025-12-18 07:30:54'),
(121, 91, 511, 'Corsair K70 RGB MK.2 Cherry MX Red', 'Cherry MX Red', 'CORS-K70-RED', 1, 10000.00, 0.00, 10000.00, '2025-12-18 07:39:32'),
(122, 92, 511, 'Corsair K70 RGB MK.2 Cherry MX Red', 'Cherry MX Red', 'CORS-K70-RED', 1, 10000.00, 0.00, 10000.00, '2025-12-18 07:58:55'),
(123, 93, 501, 'ASUS TUF VG27AQ 27\" WQHD 165Hz', 'Standard', 'ASUS-VG27AQ-STD', 1, 9990000.00, 0.00, 9990000.00, '2025-12-19 14:52:09'),
(124, 93, 520, 'Logitech G304 Lightspeed Wireless', 'Black', 'LOGI-G304-BLK', 1, 990000.00, 0.00, 990000.00, '2025-12-19 14:52:09'),
(147, 116, 511, 'Corsair K70 RGB MK.2 Cherry MX Red', 'Cherry MX Red', 'CORS-K70-RED', 1, 100000.00, 0.00, 100000.00, '2025-12-30 13:49:36'),
(148, 117, 510, 'Logitech G Pro X Mechanical Gaming Keyboard', 'GX Blue Switch', 'LOGI-GPROX-STD', 1, 3290000.00, 0.00, 3290000.00, '2025-12-30 14:14:56'),
(149, 118, 510, 'Logitech G Pro X Mechanical Gaming Keyboard', 'GX Blue Switch', 'LOGI-GPROX-STD', 1, 3290000.00, 0.00, 3290000.00, '2025-12-30 14:19:02'),
(150, 122, 510, 'Logitech G Pro X Mechanical Gaming Keyboard', 'GX Blue Switch', 'LOGI-GPROX-STD', 1, 3290000.00, 0.00, 3290000.00, '2025-12-30 15:09:35'),
(151, 123, 510, 'Logitech G Pro X Mechanical Gaming Keyboard', 'GX Blue Switch', 'LOGI-GPROX-STD', 1, 3290000.00, 0.00, 3290000.00, '2025-12-30 15:10:38'),
(152, 124, 501, 'ASUS TUF VG27AQ 27\" WQHD 165Hz', 'Standard', 'ASUS-VG27AQ-STD', 1, 9990000.00, 0.00, 9990000.00, '2025-12-30 15:13:31'),
(153, 125, 500, 'LG UltraGear 27GN800-B 27\" QHD 144Hz', 'Standard', 'LG-27GN800-STD', 1, 8490000.00, 0.00, 8490000.00, '2025-12-30 15:17:34'),
(154, 126, 500, 'LG UltraGear 27GN800-B 27\" QHD 144Hz', 'Standard', 'LG-27GN800-STD', 1, 8490000.00, 0.00, 8490000.00, '2025-12-30 15:51:54'),
(155, 127, 500, 'LG UltraGear 27GN800-B 27\" QHD 144Hz', 'Standard', 'LG-27GN800-STD', 1, 8490000.00, 0.00, 8490000.00, '2025-12-30 15:53:58'),
(160, 132, 531, 'Razer BlackShark V2 Pro Wireless', 'Pro', 'RAZER-BS-V2-PRO', 1, 3990000.00, 0.00, 3990000.00, '2025-12-30 16:25:54'),
(161, 132, 521, 'Razer Viper Ultimate Wireless', 'Ultimate', 'RAZER-VIPER-ULT', 1, 2990000.00, 0.00, 2990000.00, '2025-12-30 16:25:54'),
(162, 133, 521, 'Razer Viper Ultimate Wireless', 'Ultimate', 'RAZER-VIPER-ULT', 1, 2990000.00, 0.00, 2990000.00, '2025-12-30 16:35:11'),
(163, 133, 531, 'Razer BlackShark V2 Pro Wireless', 'Pro', 'RAZER-BS-V2-PRO', 1, 3990000.00, 0.00, 3990000.00, '2025-12-30 16:35:11'),
(164, 134, 521, 'Razer Viper Ultimate Wireless', 'Ultimate', 'RAZER-VIPER-ULT', 1, 2990000.00, 0.00, 2990000.00, '2025-12-30 16:46:34'),
(165, 134, 531, 'Razer BlackShark V2 Pro Wireless', 'Pro', 'RAZER-BS-V2-PRO', 1, 3990000.00, 0.00, 3990000.00, '2025-12-30 16:46:34');

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
(264, 13, 'Ổ Cứng HDD SEAGATE Barracuda 2TB 3.5 inch 7200RPM, SATA III, 256MB Cache (ST2000DM008)', 'o-cung-hdd-seagate-barracuda-2tb-3-5-inch-7200rpm-sata-iii-256mb-cache-st2000dm008', NULL, 2500000.00, 1, 0, 14, 0.00, 0, '2025-11-24 12:30:39', '2025-12-30 12:36:09', ''),
(265, 1, 'Intel Core i5-13600K', 'intel-core-i5-13600k', NULL, 6000000.00, 1, 1, 10, 0.00, 0, '2025-11-24 05:32:43', '2025-11-29 12:41:46', ''),
(266, 1, 'AMD Ryzen 5 7600X', 'amd-ryzen-5-7600x', NULL, 5200000.00, 1, 1, 2, 0.00, 0, '2025-11-24 05:32:43', '2025-11-29 12:42:01', ''),
(267, 1, 'Intel Core i7-13700K', 'intel-core-i7-13700k', NULL, 9000000.00, 1, 1, 0, 0.00, 0, '2025-11-24 05:32:43', '2025-11-24 12:41:54', ''),
(268, 2, 'MSI GeForce RTX 4060', 'msi-geforce-rtx-4060', NULL, 7500000.00, 1, 0, 2, 0.00, 0, '2025-11-24 05:32:43', '2025-12-28 01:22:04', ''),
(269, 2, 'ASUS TUF RTX 4070', 'asus-tuf-rtx-4070', NULL, 16000000.00, 1, 0, 0, 0.00, 0, '2025-11-24 05:32:43', '2025-11-24 05:32:43', ''),
(270, 2, 'Gigabyte RX 7800 XT', 'gigabyte-rx-7800-xt', NULL, 14000000.00, 1, 0, 0, 0.00, 0, '2025-11-24 05:32:43', '2025-11-24 05:32:43', ''),
(271, 4, 'Samsung NVMe 1TB', 'samsung-nvme-1tb', NULL, 1800000.00, 1, 0, 0, 0.00, 0, '2025-11-24 05:32:43', '2025-11-24 05:32:43', ''),
(272, 4, 'WD Blue NVMe 512GB', 'wd-blue-nvme-512gb', NULL, 900000.00, 1, 0, 0, 0.00, 0, '2025-11-24 05:32:43', '2025-11-24 05:32:43', ''),
(273, 4, 'Crucial SATA 1TB', 'crucial-sata-1tb', NULL, 850000.00, 1, 0, 0, 0.00, 0, '2025-11-24 05:32:43', '2025-11-24 05:32:43', ''),
(274, 5, 'ASUS Prime Z790-A', 'asus-prime-z790-a', NULL, 4200000.00, 1, 0, 0, 0.00, 0, '2025-11-24 05:32:43', '2025-11-24 05:32:43', ''),
(275, 5, 'MSI MAG B650 Tomahawk', 'msi-mag-b650-tomahawk', NULL, 3200000.00, 1, 0, 0, 0.00, 0, '2025-11-24 05:32:43', '2025-11-24 05:32:43', ''),
(276, 5, 'Gigabyte B660M DS3H', 'gigabyte-b660m-ds3h', NULL, 1500000.00, 1, 0, 0, 0.00, 0, '2025-11-24 05:32:43', '2025-11-24 05:32:43', ''),
(277, 6, 'Corsair RM650x', 'corsair-rm650x', NULL, 2400000.00, 1, 0, 0, 0.00, 0, '2025-11-24 05:32:43', '2025-11-24 05:32:43', ''),
(278, 6, 'Seasonic Focus GX-750', 'seasonic-focus-gx-750', NULL, 3000000.00, 1, 1, 0, 0.00, 0, '2025-11-24 05:32:43', '2025-11-24 12:42:01', ''),
(279, 6, 'Cooler Master MWE 650', 'cooler-master-mwe-650', NULL, 1200000.00, 1, 0, 0, 0.00, 0, '2025-11-24 05:32:43', '2025-11-24 05:32:43', ''),
(280, 7, 'Corsair 4000D', 'corsair-4000d', NULL, 1800000.00, 1, 0, 0, 0.00, 0, '2025-11-24 05:32:43', '2025-11-24 05:32:43', ''),
(281, 7, 'Fractal Define 7 Compact', 'fractal-define-7-compact', NULL, 2500000.00, 1, 0, 0, 0.00, 0, '2025-11-24 05:32:43', '2025-11-24 05:32:43', ''),
(282, 7, 'NZXT H510', 'nzxt-h510', NULL, 1200000.00, 1, 0, 0, 0.00, 0, '2025-11-24 05:32:43', '2025-11-24 05:32:43', ''),
(283, 8, 'Corsair H100i AIO 240', 'corsair-h100i-aio-240', NULL, 2200000.00, 1, 0, 0, 0.00, 0, '2025-11-24 05:32:43', '2025-11-24 05:32:43', ''),
(284, 8, 'Noctua NH-D15', 'noctua-nh-d15', NULL, 2000000.00, 1, 0, 0, 0.00, 0, '2025-11-24 05:32:43', '2025-11-24 05:32:43', ''),
(285, 8, 'Deepcool LS520 AIO', 'deepcool-ls520-aio', NULL, 2100000.00, 1, 0, 2, 0.00, 0, '2025-11-24 05:32:43', '2025-11-25 04:53:56', ''),
(286, 13, 'Seagate Barracuda 1TB 7200RPM', 'seagate-barracuda-1tb-7200', NULL, 1400000.00, 1, 0, 2, 0.00, 0, '2025-11-24 05:32:43', '2025-12-30 12:36:10', ''),
(287, 13, 'WD Blue 4TB 5400RPM', 'wd-blue-4tb-5400', NULL, 2200000.00, 1, 0, 0, 0.00, 0, '2025-11-24 05:32:43', '2025-11-24 05:32:43', ''),
(288, 13, 'Toshiba 8TB 7200RPM', 'toshiba-8tb-7200', NULL, 4800000.00, 1, 0, 0, 0.00, 0, '2025-11-24 05:32:43', '2025-11-24 05:32:43', ''),
(289, 35, 'G.Skill Trident Z DDR4 16GB (2x8GB)', 'gskill-tridentz-ddr4-16gb', NULL, 900000.00, 1, 0, 0, 0.00, 0, '2025-11-24 05:32:43', '2025-11-24 05:32:43', ''),
(290, 35, 'Corsair Vengeance DDR5 32GB (2x16GB)', 'corsair-vengeance-ddr5-32gb', NULL, 2200000.00, 1, 0, 0, 0.00, 0, '2025-11-24 05:32:43', '2025-11-24 05:32:43', ''),
(291, 35, 'Kingston Fury DDR4 64GB (2x32GB)', 'kingston-fury-ddr4-64gb', NULL, 4200000.00, 1, 0, 0, 0.00, 0, '2025-11-24 05:32:43', '2025-11-24 05:32:43', ''),
(300, 40, 'LG UltraGear 27GN800-B 27\" QHD 144Hz', 'lg-27gn800-qhd-144hz', 'Màn hình gaming IPS 27 inch QHD 144Hz G-Sync Compatible', 8490000.00, 1, 1, 46, 0.00, 0, '2025-11-25 08:58:13', '2025-12-31 00:05:10', ''),
(301, 40, 'ASUS TUF VG27AQ 27\" WQHD 165Hz', 'asus-tuf-vg27aq-wqhd-165hz', 'Màn hình gaming IPS 27 inch WQHD 165Hz G-Sync', 9990000.00, 1, 1, 53, 0.00, 0, '2025-11-25 08:58:13', '2025-12-03 05:07:11', ''),
(302, 40, 'Samsung Odyssey G5 32\" QHD 144Hz', 'samsung-odyssey-g5-32-qhd-144hz', 'Màn hình gaming cong VA 32 inch QHD 144Hz', 7990000.00, 1, 0, 18, 0.00, 0, '2025-11-25 08:58:13', '2025-12-03 05:07:26', ''),
(310, 41, 'Logitech G Pro X Mechanical Gaming Keyboard', 'logitech-g-pro-x-mechanical', 'Bàn phím cơ gaming với switch GX Blue', 3290000.00, 1, 1, 32, 0.00, 0, '2025-11-25 08:58:13', '2025-12-31 00:05:21', ''),
(311, 41, 'Corsair K70 RGB MK.2 Cherry MX Red', 'corsair-k70-rgb-mk2-red', 'Bàn phím cơ full-size RGB Cherry MX Red', 3000.00, 1, 1, 24, 0.00, 0, '2025-11-25 08:58:13', '2025-12-11 12:41:20', ''),
(312, 41, 'Keychron K2 V2 Wireless Mechanical', 'keychron-k2-v2-wireless', 'Bàn phím cơ 75% không dây Gateron Brown', 2190000.00, 1, 0, 4, 0.00, 0, '2025-11-25 08:58:13', '2025-12-03 04:05:26', ''),
(320, 42, 'Logitech G304 Lightspeed Wireless', 'logitech-g304-lightspeed', 'Chuột gaming không dây HERO 12K DPI', 990000.00, 1, 1, 18, 0.00, 0, '2025-11-25 08:58:13', '2025-12-03 04:20:22', ''),
(321, 42, 'Razer Viper Ultimate Wireless', 'razer-viper-ultimate-wireless', 'Chuột gaming không dây Focus+ 20K DPI', 2990000.00, 1, 1, 32, 0.00, 0, '2025-11-25 08:58:13', '2025-12-05 04:55:38', ''),
(322, 42, 'SteelSeries Rival 3 Wireless', 'steelseries-rival-3-wireless', 'Chuột gaming không dây TrueMove Air 18K DPI', 1490000.00, 1, 0, 2, 0.00, 0, '2025-11-25 08:58:13', '2025-12-03 04:29:34', ''),
(330, 43, 'HyperX Cloud II Gaming Headset', 'hyperx-cloud-ii-gaming', 'Tai nghe gaming 7.1 surround sound', 2390000.00, 1, 1, 37, 0.00, 0, '2025-11-25 08:58:13', '2025-12-18 05:11:53', ''),
(331, 43, 'Razer BlackShark V2 Pro Wireless', 'razer-blackshark-v2-pro', 'Tai nghe gaming không dây THX Spatial Audio', 3990000.00, 1, 1, 12, 0.00, 0, '2025-11-25 08:58:13', '2025-12-03 04:20:28', ''),
(332, 43, 'SteelSeries Arctis 7 Wireless', 'steelseries-arctis-7-wireless', 'Tai nghe gaming không dây DTS Headphone:X v2.0', 3290000.00, 1, 0, 0, 0.00, 0, '2025-11-25 08:58:13', '2025-11-25 08:58:13', ''),
(340, 44, 'Logitech Z906 5.1 Surround Sound', 'logitech-z906-51-surround', 'Loa 5.1 THX certified 500W RMS', 6590000.00, 1, 1, 0, 0.00, 0, '2025-11-25 08:58:13', '2025-11-25 08:58:13', ''),
(341, 44, 'Creative Pebble V3 2.0', 'creative-pebble-v3-20', 'Loa 2.0 USB-C RGB 8W RMS', 690000.00, 1, 0, 0, 0.00, 0, '2025-11-25 08:58:13', '2025-11-25 08:58:13', ''),
(342, 44, 'Edifier R1280T 2.0 Bookshelf', 'edifier-r1280t-20-bookshelf', 'Loa bookshelf 2.0 42W RMS', 1990000.00, 1, 0, 0, 0.00, 0, '2025-11-25 08:58:13', '2025-11-25 08:58:13', ''),
(350, 45, 'Secretlab TITAN Evo 2022', 'secretlab-titan-evo-2022', 'Ghế gaming cao cấp NEO Hybrid Leatherette', 13490000.00, 1, 1, 4, 0.00, 0, '2025-11-25 08:58:13', '2025-11-25 09:56:35', ''),
(351, 45, 'Herman Miller X Logitech G Embody', 'herman-miller-embody-gaming', 'Ghế gaming công thái học cao cấp', 37990000.00, 1, 1, 0, 0.00, 0, '2025-11-25 08:58:13', '2025-11-25 08:58:13', ''),
(352, 45, 'Razer Iskur Gaming Chair', 'razer-iskur-gaming-chair', 'Ghế gaming hỗ trợ lưng tích hợp', 8990000.00, 1, 0, 0, 0.00, 0, '2025-11-25 08:58:13', '2025-11-25 08:58:13', ''),
(360, 46, 'Lian Li UNI FAN SL120 V2 3-Pack', 'lianli-uni-fan-sl120-v2-3pack', 'Bộ 3 quạt 120mm ARGB modular', 2290000.00, 1, 1, 0, 0.00, 0, '2025-11-25 08:58:13', '2025-11-25 08:58:13', ''),
(361, 46, 'Corsair iCUE SP120 RGB ELITE 3-Pack', 'corsair-sp120-rgb-elite-3pack', 'Bộ 3 quạt 120mm RGB PWM', 1690000.00, 1, 0, 0, 0.00, 0, '2025-11-25 08:58:13', '2025-11-25 08:58:13', ''),
(362, 46, 'Noctua NF-A12x25 PWM', 'noctua-nf-a12x25-pwm', 'Quạt 120mm PWM cao cấp', 790000.00, 1, 0, 0, 0.00, 0, '2025-11-25 08:58:13', '2025-11-25 08:58:13', ''),
(384, 1, 'Laptop Dell Inspiron 15 3000', 'laptop-dell-inspiron-15-3000', 'Laptop Dell Inspiron 15 3000 series - Phù hợp cho công việc văn phòng và học tập. Thiết kế mỏng nhẹ, hiệu năng ổn định.', 12990000.00, 1, 0, 0, 0.00, 0, '2026-01-04 04:14:15', '2026-01-04 04:14:15', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `products_attribute_values`
--

CREATE TABLE `products_attribute_values` (
  `product_id` int(11) NOT NULL,
  `attribute_value_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
(374, 264, 'Seagate-2TB-7200RPM', 'Seagate-2TB-7200RPM', 2500000.00, 10, 1, 1, '2025-11-24 12:30:39', '2025-12-30 13:05:38', 12),
(375, 265, 'INTEL-13600K-BOX', 'Box', 6000000.00, 10, 1, 1, '2025-11-24 05:32:43', '2025-12-30 13:05:38', 12),
(376, 265, 'INTEL-13600K-DELUXE', 'Deluxe', 6500000.00, 10, 1, 0, '2025-11-24 05:32:43', '2025-12-30 13:05:38', 12),
(377, 266, 'AMD-7600X-BOX', 'Box', 5200000.00, 10, 1, 1, '2025-11-24 05:32:43', '2025-12-30 13:05:38', 12),
(378, 266, 'AMD-7600X-OC', 'OC', 5600000.00, 10, 1, 0, '2025-11-24 05:32:43', '2025-12-30 13:05:38', 12),
(379, 267, 'INTEL-13700K-BOX', 'Box', 9000000.00, 10, 1, 1, '2025-11-24 05:32:43', '2025-12-30 13:05:38', 12),
(380, 267, 'INTEL-13700K-DELUXE', 'Deluxe', 9700000.00, 10, 1, 0, '2025-11-24 05:32:43', '2025-12-30 13:05:38', 12),
(381, 268, 'MSI-RTX4060-1', 'Standard', 7500000.00, 10, 1, 1, '2025-11-24 05:32:43', '2025-12-30 13:05:38', 12),
(382, 268, 'MSI-RTX4060-OC', 'OC Edition', 7900000.00, 10, 1, 0, '2025-11-24 05:32:43', '2025-12-30 13:05:38', 12),
(383, 269, 'ASUS-RTX4070-1', 'Standard', 16000000.00, 10, 1, 1, '2025-11-24 05:32:43', '2025-12-30 13:05:38', 12),
(384, 269, 'ASUS-RTX4070-OC', 'OC Edition', 16700000.00, 10, 1, 0, '2025-11-24 05:32:43', '2025-12-30 13:05:38', 12),
(385, 270, 'GIG-RX7800XT-1', 'Standard', 14000000.00, 10, 1, 1, '2025-11-24 05:32:43', '2025-12-30 13:05:38', 12),
(386, 270, 'GIG-RX7800XT-OC', 'OC Edition', 14600000.00, 10, 1, 0, '2025-11-24 05:32:43', '2025-12-30 13:05:38', 12),
(387, 271, 'SAM-NVME-1TB', '1TB', 1800000.00, 10, 1, 1, '2025-11-24 05:32:43', '2025-12-30 13:05:38', 12),
(388, 271, 'SAM-NVME-1TB-PRO', 'Pro', 2100000.00, 10, 1, 0, '2025-11-24 05:32:43', '2025-12-30 13:05:38', 12),
(389, 272, 'WD-NVME-512GB', '512GB', 900000.00, 10, 1, 1, '2025-11-24 05:32:43', '2025-12-30 13:05:38', 12),
(390, 272, 'WD-NVME-512GB-PRO', '512GB Pro', 1050000.00, 10, 1, 0, '2025-11-24 05:32:43', '2025-12-30 13:05:38', 12),
(391, 273, 'CRU-SATA-1TB', '1TB', 850000.00, 10, 1, 1, '2025-11-24 05:32:43', '2025-12-30 13:05:38', 12),
(392, 273, 'CRU-SATA-1TB-BUDGET', 'Budget', 780000.00, 10, 1, 0, '2025-11-24 05:32:43', '2025-12-30 13:05:38', 12),
(393, 274, 'ASUS-Z790A-ATX', 'ATX', 4200000.00, 10, 1, 1, '2025-11-24 05:32:43', '2025-12-30 13:05:38', 12),
(394, 274, 'ASUS-Z790A-PRO', 'Pro', 4500000.00, 10, 1, 0, '2025-11-24 05:32:43', '2025-12-30 13:05:38', 12),
(395, 275, 'MSI-B650-TOMAHAWK', 'Standard', 3200000.00, 10, 1, 1, '2025-11-24 05:32:43', '2025-12-30 13:05:38', 12),
(396, 275, 'MSI-B650-TOMAHAWK-MINI', 'mATX', 3400000.00, 10, 1, 0, '2025-11-24 05:32:43', '2025-12-30 13:05:38', 12),
(397, 276, 'GIG-B660M-DS3H', 'Standard', 1500000.00, 10, 1, 1, '2025-11-24 05:32:43', '2025-12-30 13:05:38', 12),
(398, 276, 'GIG-B660M-DS3H-LOW', 'Low Price', 1350000.00, 10, 1, 0, '2025-11-24 05:32:43', '2025-12-30 13:05:38', 12),
(399, 277, 'CRS-RM650X', '650W Gold', 2400000.00, 10, 1, 1, '2025-11-24 05:32:43', '2025-12-30 13:05:38', 12),
(400, 278, 'SSN-GX750', '750W Gold', 3000000.00, 10, 1, 1, '2025-11-24 05:32:43', '2025-12-30 13:05:38', 12),
(401, 279, 'CM-MWE650', '650W', 1200000.00, 10, 1, 1, '2025-11-24 05:32:43', '2025-12-30 13:05:38', 12),
(402, 277, 'CRS-RM650X-LTD', 'Limited', 2600000.00, 10, 1, 0, '2025-11-24 05:32:43', '2025-12-30 13:05:38', 12),
(403, 278, 'SSN-GX750-PL', 'Platinum', 3400000.00, 10, 1, 0, '2025-11-24 05:32:43', '2025-12-30 13:05:38', 12),
(404, 279, 'CM-MWE650-BUD', 'Budget', 1050000.00, 10, 1, 0, '2025-11-24 05:32:43', '2025-12-30 13:05:38', 12),
(405, 280, 'CRS-4000D-BL', 'Black', 1800000.00, 10, 1, 1, '2025-11-24 05:32:43', '2025-12-30 13:05:38', 12),
(406, 280, 'CRS-4000D-WT', 'White', 1850000.00, 10, 1, 0, '2025-11-24 05:32:43', '2025-12-30 13:05:38', 12),
(407, 281, 'FRA-DEFINE7-C', 'Compact', 2500000.00, 10, 1, 1, '2025-11-24 05:32:43', '2025-12-30 13:05:38', 12),
(408, 282, 'NZXT-H510', 'Standard', 1200000.00, 10, 1, 1, '2025-11-24 05:32:43', '2025-12-30 13:05:38', 12),
(409, 281, 'FRA-DEFINE7-MIN', 'Mini', 2300000.00, 10, 1, 0, '2025-11-24 05:32:43', '2025-12-30 13:05:38', 12),
(410, 282, 'NZXT-H510-LTD', 'Limited', 1350000.00, 10, 1, 0, '2025-11-24 05:32:43', '2025-12-30 13:05:38', 12),
(411, 283, 'CRS-H100I-240', '240mm', 2200000.00, 10, 1, 1, '2025-11-24 05:32:43', '2025-12-30 13:05:38', 12),
(412, 283, 'CRS-H100I-240-ELITE', 'Elite', 2600000.00, 10, 1, 0, '2025-11-24 05:32:43', '2025-12-30 13:05:38', 12),
(413, 284, 'NOCTUA-NH-D15', 'Dual Tower', 2000000.00, 10, 1, 1, '2025-11-24 05:32:43', '2025-12-30 13:05:38', 12),
(414, 284, 'NOCTUA-NH-D15-LTD', 'Limited', 2300000.00, 10, 1, 0, '2025-11-24 05:32:43', '2025-12-30 13:05:38', 12),
(415, 285, 'DEEP-LS520-240', '240mm', 2100000.00, 10, 1, 1, '2025-11-24 05:32:43', '2025-12-30 13:05:38', 12),
(416, 285, 'DEEP-LS520-AIR', 'Air', 1600000.00, 10, 1, 0, '2025-11-24 05:32:43', '2025-12-30 13:05:38', 12),
(417, 286, 'ST-1TB-7200', '1TB 7200RPM', 1400000.00, 10, 1, 1, '2025-11-24 05:32:43', '2025-12-30 13:05:38', 12),
(418, 286, 'ST-1TB-7200-BUD', '1TB Budget', 1300000.00, 10, 1, 0, '2025-11-24 05:32:43', '2025-12-30 13:05:38', 12),
(419, 287, 'WD-4TB-5400', '4TB 5400RPM', 2200000.00, 10, 1, 1, '2025-11-24 05:32:43', '2025-12-30 13:05:38', 12),
(420, 287, 'WD-4TB-5400-B', '4TB Budget', 2050000.00, 10, 1, 0, '2025-11-24 05:32:43', '2025-12-30 13:05:38', 12),
(421, 288, 'TOSH-8TB-7200', '8TB 7200RPM', 4800000.00, 10, 1, 1, '2025-11-24 05:32:43', '2025-12-30 13:05:38', 12),
(422, 288, 'TOSH-8TB-7200-PRO', 'Pro', 5100000.00, 10, 1, 0, '2025-11-24 05:32:43', '2025-12-30 13:05:38', 12),
(423, 289, 'GSK-TRIDENTZ-DDR4-16-1', '2x8GB Kit', 900000.00, 10, 1, 1, '2025-11-24 05:32:43', '2025-12-30 13:05:38', 12),
(424, 289, 'GSK-TRIDENTZ-DDR4-16-2', 'RGB Kit', 980000.00, 10, 1, 0, '2025-11-24 05:32:43', '2025-12-30 13:05:38', 12),
(425, 290, 'CRS-VENGE-DDR5-32-1', '2x16GB', 2200000.00, 10, 1, 1, '2025-11-24 05:32:43', '2025-12-30 13:05:38', 12),
(426, 290, 'CRS-VENGE-DDR5-32-2', '2x16GB RGB', 2350000.00, 10, 1, 0, '2025-11-24 05:32:43', '2025-12-30 13:05:38', 12),
(427, 291, 'KNG-FURY-DDR4-64-1', '2x32GB', 4200000.00, 10, 1, 1, '2025-11-24 05:32:43', '2025-12-30 13:05:38', 12),
(428, 291, 'KNG-FURY-DDR4-64-2', '2x32GB RGB', 4400000.00, 10, 1, 0, '2025-11-24 05:32:43', '2025-12-30 13:05:38', 12),
(500, 300, 'LG-27GN800-STD', 'Standard', 8490000.00, 3, 1, 1, '2025-11-25 08:58:13', '2025-12-30 16:05:16', 12),
(501, 301, 'ASUS-VG27AQ-STD', 'Standard', 9990000.00, 9, 1, 1, '2025-11-25 08:58:13', '2025-12-30 15:13:31', 12),
(502, 302, 'SAM-G5-32-STD', 'Standard', 7990000.00, 10, 1, 1, '2025-11-25 08:58:13', '2025-12-30 13:05:38', 12),
(510, 310, 'LOGI-GPROX-STD', 'GX Blue Switch', 3290000.00, 6, 1, 1, '2025-11-25 08:58:13', '2025-12-30 15:10:38', 12),
(511, 311, 'CORS-K70-RED', 'Cherry MX Red', 100000.00, 9, 1, 1, '2025-11-25 08:58:13', '2025-12-30 13:49:36', 12),
(512, 312, 'KEY-K2-BROWN', 'Gateron Brown', 2190000.00, 10, 1, 1, '2025-11-25 08:58:13', '2025-12-30 13:05:38', 12),
(520, 320, 'LOGI-G304-BLK', 'Black', 990000.00, 10, 1, 1, '2025-11-25 08:58:13', '2025-12-30 13:05:38', 12),
(521, 321, 'RAZER-VIPER-ULT', 'Ultimate', 2990000.00, 7, 1, 1, '2025-11-25 08:58:13', '2025-12-30 16:46:34', 12),
(522, 322, 'SS-RIVAL3-WL', 'Wireless', 1490000.00, 10, 1, 1, '2025-11-25 08:58:13', '2025-12-30 13:05:38', 12),
(530, 330, 'HX-CLOUD2-RED', 'Red', 2390000.00, 10, 1, 1, '2025-11-25 08:58:13', '2025-12-30 13:05:38', 12),
(531, 331, 'RAZER-BS-V2-PRO', 'Pro', 3990000.00, 7, 1, 1, '2025-11-25 08:58:13', '2025-12-30 16:46:34', 12),
(532, 332, 'SS-ARCTIS7-BLK', 'Black', 3290000.00, 10, 1, 1, '2025-11-25 08:58:13', '2025-12-30 13:05:38', 12),
(540, 340, 'LOGI-Z906-51', '5.1 System', 6590000.00, 10, 1, 1, '2025-11-25 08:58:13', '2025-12-30 13:05:38', 12),
(541, 341, 'CREA-PEB-V3', 'RGB', 690000.00, 10, 1, 1, '2025-11-25 08:58:13', '2025-12-30 13:05:38', 12),
(542, 342, 'EDI-R1280T-BLK', 'Black', 1990000.00, 10, 1, 1, '2025-11-25 08:58:13', '2025-12-30 13:05:38', 12),
(550, 350, 'SEC-TITAN-2022-M', 'Medium', 13490000.00, 10, 1, 1, '2025-11-25 08:58:13', '2025-12-30 13:05:38', 12),
(551, 351, 'HM-EMBODY-GM', 'Gaming Edition', 37990000.00, 10, 1, 1, '2025-11-25 08:58:13', '2025-12-30 13:05:38', 12),
(552, 352, 'RAZER-ISKUR-BLK', 'Black', 8990000.00, 10, 1, 1, '2025-11-25 08:58:13', '2025-12-30 13:05:38', 12),
(560, 360, 'LL-UNIFAN-SL120-3P', '3-Pack', 2290000.00, 10, 1, 1, '2025-11-25 08:58:13', '2025-12-30 13:05:38', 12),
(561, 361, 'CORS-SP120-ELITE-3P', '3-Pack', 1690000.00, 10, 1, 1, '2025-11-25 08:58:13', '2025-12-30 13:05:38', 12),
(562, 362, 'NOCT-NF-A12-SGL', 'Single', 790000.00, 10, 1, 1, '2025-11-25 08:58:13', '2025-12-30 13:05:38', 12),
(583, 384, 'LDI-384-055356', 'Mặc định', 12990000.00, 5, 1, 1, '2026-01-04 04:14:15', '2026-01-04 04:14:15', 12);

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
(6, 'admin', 'admin@gmail.com', '$2b$10$84e9xqnTc50CPaf5pOldT.Ob9zW9/RVK.G3Whr.TdAncfRdE.UivG', 'admin', '0123456788', 2, 1, '2025-11-05 09:33:52', '2026-01-03 16:15:03', NULL, NULL, NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYsInVzZXJuYW1lIjoiYWRtaW4iLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsInJvbGUiOjIsInNlc3Npb25UeXBlIjoiYWRtaW4iLCJpYXQiOjE3Njc0NTY5MDMsImV4cCI6MTc2ODA2MTcwM30.e-ftCfnbL99sY19byXCukJUl_l8gUVmBCvpj3zYzPMU', NULL),
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

--
-- Dumping data for table `variant_images`
--

INSERT INTO `variant_images` (`image_id`, `variant_id`, `image_url`, `alt_text`, `is_primary`, `display_order`, `created_at`) VALUES
(134, 500, '/uploads/variants/500/27GN800-B-S-01.jpg', 'LG 27GN800 Front View', 1, 1, '2025-12-03 03:50:42'),
(135, 500, '/uploads/variants/500/27GN800-B-S-02.jpg', 'LG 27GN800 Side View', 0, 2, '2025-12-03 03:50:42'),
(136, 500, '/uploads/variants/500/27GN800-B-S-03.jpg', 'LG 27GN800 Back View', 0, 3, '2025-12-03 03:50:42'),
(137, 500, '/uploads/variants/500/27GN800-B-S-04.jpg', 'LG 27GN800 Detail', 0, 4, '2025-12-03 03:50:42'),
(138, 500, '/uploads/variants/500/27GN800-B-S-05.jpg', 'LG 27GN800 Stand', 0, 5, '2025-12-03 03:50:42'),
(139, 500, '/uploads/variants/500/27GN800-B-S-07.jpg', 'LG 27GN800 Port', 0, 6, '2025-12-03 03:50:42'),
(140, 500, '/uploads/variants/500/27GN800-B-S-08.jpg', 'LG 27GN800 Display', 0, 7, '2025-12-03 03:50:42'),
(141, 501, '/uploads/variants/501/1.jpg', 'Image 1', 1, 1, '2025-12-03 03:50:42'),
(142, 501, '/uploads/variants/501/2.jpg', 'Image 2', 0, 2, '2025-12-03 03:50:42'),
(143, 501, '/uploads/variants/501/3.jpg', 'Image 3', 0, 3, '2025-12-03 03:50:42'),
(144, 502, '/uploads/variants/502/1.jpg', 'Image 1', 1, 1, '2025-12-03 03:50:42'),
(145, 502, '/uploads/variants/502/2.png', 'Image 2', 0, 2, '2025-12-03 03:50:42'),
(146, 502, '/uploads/variants/502/3.png', 'Image 3', 0, 3, '2025-12-03 03:50:42'),
(147, 502, '/uploads/variants/502/4.png', 'Image 4', 0, 4, '2025-12-03 03:50:42'),
(148, 502, '/uploads/variants/502/5.png', 'Image 5', 0, 5, '2025-12-03 03:50:42'),
(149, 502, '/uploads/variants/502/6.png', 'Image 6', 0, 6, '2025-12-03 03:50:42'),
(150, 502, '/uploads/variants/502/7.png', 'Image 7', 0, 7, '2025-12-03 03:50:42'),
(151, 510, '/uploads/variants/510/1.png', 'Image 1', 1, 1, '2025-12-03 03:50:43'),
(152, 510, '/uploads/variants/510/2.jpg', 'Image 2', 0, 2, '2025-12-03 03:50:43'),
(153, 510, '/uploads/variants/510/3.jpg', 'Image 3', 0, 3, '2025-12-03 03:50:43'),
(154, 511, '/uploads/variants/511/1.jpg', 'Image 1', 1, 1, '2025-12-03 03:50:43'),
(155, 511, '/uploads/variants/511/2.jpg', 'Image 2', 0, 2, '2025-12-03 03:50:43'),
(156, 511, '/uploads/variants/511/3.jpg', 'Image 3', 0, 3, '2025-12-03 03:50:43'),
(157, 511, '/uploads/variants/511/4.jpg', 'Image 4', 0, 4, '2025-12-03 03:50:43'),
(158, 512, '/uploads/variants/512/1.jpg', 'Image 1', 1, 1, '2025-12-03 03:50:43'),
(159, 512, '/uploads/variants/512/2.jpg', 'Image 2', 0, 2, '2025-12-03 03:50:43'),
(160, 512, '/uploads/variants/512/3.jpg', 'Image 3', 0, 3, '2025-12-03 03:50:43'),
(161, 520, '/uploads/variants/520/1.png', 'Image 1', 1, 1, '2025-12-03 03:50:43'),
(162, 520, '/uploads/variants/520/2.png', 'Image 2', 0, 2, '2025-12-03 03:50:43'),
(163, 520, '/uploads/variants/520/3.png', 'Image 3', 0, 3, '2025-12-03 03:50:43'),
(164, 520, '/uploads/variants/520/4.png', 'Image 4', 0, 4, '2025-12-03 03:50:43'),
(165, 521, '/uploads/variants/521/1.jpg', 'Image 1', 1, 1, '2025-12-03 03:50:43'),
(166, 521, '/uploads/variants/521/2.jpg', 'Image 2', 0, 2, '2025-12-03 03:50:43'),
(167, 521, '/uploads/variants/521/3.jpg', 'Image 3', 0, 3, '2025-12-03 03:50:43'),
(168, 521, '/uploads/variants/521/4.jpg', 'Image 4', 0, 4, '2025-12-03 03:50:43'),
(169, 522, '/uploads/variants/522/1.jpg', 'Image 1', 1, 1, '2025-12-03 03:50:43'),
(170, 522, '/uploads/variants/522/2.jpg', 'Image 2', 0, 2, '2025-12-03 03:50:43'),
(171, 522, '/uploads/variants/522/3.jpg', 'Image 3', 0, 3, '2025-12-03 03:50:43'),
(172, 522, '/uploads/variants/522/4.jpg', 'Image 4', 0, 4, '2025-12-03 03:50:43'),
(173, 522, '/uploads/variants/522/5.jpg', 'Image 5', 0, 5, '2025-12-03 03:50:43'),
(174, 530, '/uploads/variants/530/1.jpg', 'Image 1', 1, 1, '2025-12-03 03:50:43'),
(175, 530, '/uploads/variants/530/2.jpg', 'Image 2', 0, 2, '2025-12-03 03:50:43'),
(176, 530, '/uploads/variants/530/3.jpg', 'Image 3', 0, 3, '2025-12-03 03:50:43'),
(177, 530, '/uploads/variants/530/4.jpg', 'Image 4', 0, 4, '2025-12-03 03:50:43'),
(178, 531, '/uploads/variants/531/1.jpg', 'Image 1', 1, 1, '2025-12-03 03:50:43'),
(179, 531, '/uploads/variants/531/2.jpg', 'Image 2', 0, 2, '2025-12-03 03:50:43'),
(180, 531, '/uploads/variants/531/3.jpg', 'Image 3', 0, 3, '2025-12-03 03:50:43'),
(181, 532, '/uploads/variants/532/1.jpg', 'Image 1', 1, 1, '2025-12-03 03:50:43'),
(182, 532, '/uploads/variants/532/2.jpg', 'Image 2', 0, 2, '2025-12-03 03:50:43'),
(183, 532, '/uploads/variants/532/3.jpg', 'Image 3', 0, 3, '2025-12-03 03:50:43'),
(184, 541, '/uploads/variants/541/1.jpg', 'Image 1', 1, 1, '2025-12-03 03:50:43'),
(185, 541, '/uploads/variants/541/2.jpg', 'Image 2', 0, 2, '2025-12-03 03:50:43'),
(186, 541, '/uploads/variants/541/3.jpg', 'Image 3', 0, 3, '2025-12-03 03:50:43'),
(187, 542, '/uploads/variants/542/1.jpg', 'Image 1', 1, 1, '2025-12-03 03:50:43'),
(188, 542, '/uploads/variants/542/2.jpg', 'Image 2', 0, 2, '2025-12-03 03:50:43'),
(189, 542, '/uploads/variants/542/3.jpg', 'Image 3', 0, 3, '2025-12-03 03:50:43'),
(190, 552, '/uploads/variants/552/1.png', 'Image 1', 1, 1, '2025-12-03 03:50:43'),
(191, 552, '/uploads/variants/552/2.png', 'Image 2', 0, 2, '2025-12-03 03:50:43'),
(192, 552, '/uploads/variants/552/3.png', 'Image 3', 0, 3, '2025-12-03 03:50:43'),
(193, 561, '/uploads/variants/561/1.jpg', 'Image 1', 1, 1, '2025-12-03 03:50:43'),
(194, 561, '/uploads/variants/561/2.jpg', 'Image 2', 0, 2, '2025-12-03 03:50:43'),
(195, 561, '/uploads/variants/561/3.jpg', 'Image 3', 0, 3, '2025-12-03 03:50:43'),
(196, 562, '/uploads/variants/562/1.jpg', 'Image 1', 1, 1, '2025-12-03 03:50:43');

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
(130, 374, 'SN37420250001', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(131, 374, 'SN37420250002', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(132, 374, 'SN37420250003', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(133, 374, 'SN37420250004', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(134, 374, 'SN37420250005', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(135, 374, 'SN37420250006', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(136, 374, 'SN37420250007', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(137, 374, 'SN37420250008', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(138, 374, 'SN37420250009', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(139, 374, 'SN37420250010', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(140, 375, 'SN37520250001', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(141, 375, 'SN37520250002', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(142, 375, 'SN37520250003', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(143, 375, 'SN37520250004', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(144, 375, 'SN37520250005', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(145, 375, 'SN37520250006', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(146, 375, 'SN37520250007', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(147, 375, 'SN37520250008', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(148, 375, 'SN37520250009', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(149, 375, 'SN37520250010', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(150, 376, 'SN37620250001', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(151, 376, 'SN37620250002', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(152, 376, 'SN37620250003', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(153, 376, 'SN37620250004', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(154, 376, 'SN37620250005', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(155, 376, 'SN37620250006', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(156, 376, 'SN37620250007', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(157, 376, 'SN37620250008', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(158, 376, 'SN37620250009', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(159, 376, 'SN37620250010', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(160, 377, 'SN37720250001', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(161, 377, 'SN37720250002', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(162, 377, 'SN37720250003', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(163, 377, 'SN37720250004', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(164, 377, 'SN37720250005', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(165, 377, 'SN37720250006', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(166, 377, 'SN37720250007', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(167, 377, 'SN37720250008', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(168, 377, 'SN37720250009', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(169, 377, 'SN37720250010', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(170, 378, 'SN37820250001', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(171, 378, 'SN37820250002', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(172, 378, 'SN37820250003', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(173, 378, 'SN37820250004', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(174, 378, 'SN37820250005', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(175, 378, 'SN37820250006', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(176, 378, 'SN37820250007', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(177, 378, 'SN37820250008', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(178, 378, 'SN37820250009', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(179, 378, 'SN37820250010', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(180, 379, 'SN37920250001', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(181, 379, 'SN37920250002', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(182, 379, 'SN37920250003', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(183, 379, 'SN37920250004', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(184, 379, 'SN37920250005', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(185, 379, 'SN37920250006', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(186, 379, 'SN37920250007', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(187, 379, 'SN37920250008', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(188, 379, 'SN37920250009', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(189, 379, 'SN37920250010', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(190, 380, 'SN38020250001', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(191, 380, 'SN38020250002', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(192, 380, 'SN38020250003', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(193, 380, 'SN38020250004', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(194, 380, 'SN38020250005', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(195, 380, 'SN38020250006', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(196, 380, 'SN38020250007', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(197, 380, 'SN38020250008', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(198, 380, 'SN38020250009', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(199, 380, 'SN38020250010', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(200, 381, 'SN38120250001', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(201, 381, 'SN38120250002', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(202, 381, 'SN38120250003', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(203, 381, 'SN38120250004', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(204, 381, 'SN38120250005', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(205, 381, 'SN38120250006', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(206, 381, 'SN38120250007', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(207, 381, 'SN38120250008', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(208, 381, 'SN38120250009', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(209, 381, 'SN38120250010', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(210, 382, 'SN38220250001', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(211, 382, 'SN38220250002', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(212, 382, 'SN38220250003', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(213, 382, 'SN38220250004', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(214, 382, 'SN38220250005', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(215, 382, 'SN38220250006', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(216, 382, 'SN38220250007', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(217, 382, 'SN38220250008', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(218, 382, 'SN38220250009', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(219, 382, 'SN38220250010', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(220, 383, 'SN38320250001', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(221, 383, 'SN38320250002', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(222, 383, 'SN38320250003', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(223, 383, 'SN38320250004', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(224, 383, 'SN38320250005', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(225, 383, 'SN38320250006', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(226, 383, 'SN38320250007', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(227, 383, 'SN38320250008', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(228, 383, 'SN38320250009', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(229, 383, 'SN38320250010', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(230, 384, 'SN38420250001', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(231, 384, 'SN38420250002', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(232, 384, 'SN38420250003', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(233, 384, 'SN38420250004', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(234, 384, 'SN38420250005', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(235, 384, 'SN38420250006', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(236, 384, 'SN38420250007', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(237, 384, 'SN38420250008', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(238, 384, 'SN38420250009', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(239, 384, 'SN38420250010', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(240, 385, 'SN38520250001', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(241, 385, 'SN38520250002', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(242, 385, 'SN38520250003', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(243, 385, 'SN38520250004', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(244, 385, 'SN38520250005', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(245, 385, 'SN38520250006', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(246, 385, 'SN38520250007', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(247, 385, 'SN38520250008', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(248, 385, 'SN38520250009', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(249, 385, 'SN38520250010', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(250, 386, 'SN38620250001', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(251, 386, 'SN38620250002', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(252, 386, 'SN38620250003', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(253, 386, 'SN38620250004', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(254, 386, 'SN38620250005', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(255, 386, 'SN38620250006', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(256, 386, 'SN38620250007', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(257, 386, 'SN38620250008', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(258, 386, 'SN38620250009', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(259, 386, 'SN38620250010', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(260, 387, 'SN38720250001', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(261, 387, 'SN38720250002', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(262, 387, 'SN38720250003', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(263, 387, 'SN38720250004', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(264, 387, 'SN38720250005', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(265, 387, 'SN38720250006', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(266, 387, 'SN38720250007', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(267, 387, 'SN38720250008', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(268, 387, 'SN38720250009', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(269, 387, 'SN38720250010', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(270, 388, 'SN38820250001', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(271, 388, 'SN38820250002', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(272, 388, 'SN38820250003', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(273, 388, 'SN38820250004', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(274, 388, 'SN38820250005', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(275, 388, 'SN38820250006', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(276, 388, 'SN38820250007', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(277, 388, 'SN38820250008', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(278, 388, 'SN38820250009', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(279, 388, 'SN38820250010', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(280, 389, 'SN38920250001', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(281, 389, 'SN38920250002', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(282, 389, 'SN38920250003', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(283, 389, 'SN38920250004', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(284, 389, 'SN38920250005', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(285, 389, 'SN38920250006', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(286, 389, 'SN38920250007', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(287, 389, 'SN38920250008', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(288, 389, 'SN38920250009', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(289, 389, 'SN38920250010', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(290, 390, 'SN39020250001', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(291, 390, 'SN39020250002', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(292, 390, 'SN39020250003', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(293, 390, 'SN39020250004', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(294, 390, 'SN39020250005', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(295, 390, 'SN39020250006', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(296, 390, 'SN39020250007', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(297, 390, 'SN39020250008', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(298, 390, 'SN39020250009', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(299, 390, 'SN39020250010', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(300, 391, 'SN39120250001', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(301, 391, 'SN39120250002', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(302, 391, 'SN39120250003', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(303, 391, 'SN39120250004', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(304, 391, 'SN39120250005', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(305, 391, 'SN39120250006', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(306, 391, 'SN39120250007', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(307, 391, 'SN39120250008', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(308, 391, 'SN39120250009', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(309, 391, 'SN39120250010', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(310, 392, 'SN39220250001', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(311, 392, 'SN39220250002', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(312, 392, 'SN39220250003', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(313, 392, 'SN39220250004', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(314, 392, 'SN39220250005', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(315, 392, 'SN39220250006', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(316, 392, 'SN39220250007', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(317, 392, 'SN39220250008', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(318, 392, 'SN39220250009', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(319, 392, 'SN39220250010', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(320, 393, 'SN39320250001', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(321, 393, 'SN39320250002', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(322, 393, 'SN39320250003', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(323, 393, 'SN39320250004', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(324, 393, 'SN39320250005', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(325, 393, 'SN39320250006', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(326, 393, 'SN39320250007', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(327, 393, 'SN39320250008', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(328, 393, 'SN39320250009', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(329, 393, 'SN39320250010', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(330, 394, 'SN39420250001', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(331, 394, 'SN39420250002', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(332, 394, 'SN39420250003', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(333, 394, 'SN39420250004', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(334, 394, 'SN39420250005', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(335, 394, 'SN39420250006', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(336, 394, 'SN39420250007', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(337, 394, 'SN39420250008', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(338, 394, 'SN39420250009', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(339, 394, 'SN39420250010', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(340, 395, 'SN39520250001', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(341, 395, 'SN39520250002', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(342, 395, 'SN39520250003', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(343, 395, 'SN39520250004', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(344, 395, 'SN39520250005', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(345, 395, 'SN39520250006', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(346, 395, 'SN39520250007', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(347, 395, 'SN39520250008', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(348, 395, 'SN39520250009', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(349, 395, 'SN39520250010', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(350, 396, 'SN39620250001', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(351, 396, 'SN39620250002', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(352, 396, 'SN39620250003', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(353, 396, 'SN39620250004', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(354, 396, 'SN39620250005', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(355, 396, 'SN39620250006', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(356, 396, 'SN39620250007', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(357, 396, 'SN39620250008', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(358, 396, 'SN39620250009', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(359, 396, 'SN39620250010', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(360, 397, 'SN39720250001', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(361, 397, 'SN39720250002', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(362, 397, 'SN39720250003', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(363, 397, 'SN39720250004', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(364, 397, 'SN39720250005', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(365, 397, 'SN39720250006', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(366, 397, 'SN39720250007', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(367, 397, 'SN39720250008', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(368, 397, 'SN39720250009', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(369, 397, 'SN39720250010', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(370, 398, 'SN39820250001', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(371, 398, 'SN39820250002', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(372, 398, 'SN39820250003', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(373, 398, 'SN39820250004', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(374, 398, 'SN39820250005', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(375, 398, 'SN39820250006', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(376, 398, 'SN39820250007', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(377, 398, 'SN39820250008', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(378, 398, 'SN39820250009', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(379, 398, 'SN39820250010', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(380, 399, 'SN39920250001', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(381, 399, 'SN39920250002', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(382, 399, 'SN39920250003', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(383, 399, 'SN39920250004', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(384, 399, 'SN39920250005', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(385, 399, 'SN39920250006', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(386, 399, 'SN39920250007', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(387, 399, 'SN39920250008', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(388, 399, 'SN39920250009', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(389, 399, 'SN39920250010', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(390, 400, 'SN40020250001', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(391, 400, 'SN40020250002', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(392, 400, 'SN40020250003', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(393, 400, 'SN40020250004', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(394, 400, 'SN40020250005', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(395, 400, 'SN40020250006', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(396, 400, 'SN40020250007', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(397, 400, 'SN40020250008', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(398, 400, 'SN40020250009', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(399, 400, 'SN40020250010', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(400, 401, 'SN40120250001', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(401, 401, 'SN40120250002', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(402, 401, 'SN40120250003', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(403, 401, 'SN40120250004', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(404, 401, 'SN40120250005', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(405, 401, 'SN40120250006', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(406, 401, 'SN40120250007', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(407, 401, 'SN40120250008', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(408, 401, 'SN40120250009', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(409, 401, 'SN40120250010', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(410, 402, 'SN40220250001', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(411, 402, 'SN40220250002', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(412, 402, 'SN40220250003', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(413, 402, 'SN40220250004', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(414, 402, 'SN40220250005', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(415, 402, 'SN40220250006', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(416, 402, 'SN40220250007', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(417, 402, 'SN40220250008', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(418, 402, 'SN40220250009', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(419, 402, 'SN40220250010', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(420, 403, 'SN40320250001', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(421, 403, 'SN40320250002', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(422, 403, 'SN40320250003', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(423, 403, 'SN40320250004', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(424, 403, 'SN40320250005', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(425, 403, 'SN40320250006', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(426, 403, 'SN40320250007', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(427, 403, 'SN40320250008', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(428, 403, 'SN40320250009', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(429, 403, 'SN40320250010', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(430, 404, 'SN40420250001', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(431, 404, 'SN40420250002', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(432, 404, 'SN40420250003', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(433, 404, 'SN40420250004', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(434, 404, 'SN40420250005', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(435, 404, 'SN40420250006', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(436, 404, 'SN40420250007', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(437, 404, 'SN40420250008', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(438, 404, 'SN40420250009', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(439, 404, 'SN40420250010', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(440, 405, 'SN40520250001', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(441, 405, 'SN40520250002', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(442, 405, 'SN40520250003', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(443, 405, 'SN40520250004', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(444, 405, 'SN40520250005', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(445, 405, 'SN40520250006', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(446, 405, 'SN40520250007', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(447, 405, 'SN40520250008', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(448, 405, 'SN40520250009', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(449, 405, 'SN40520250010', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(450, 406, 'SN40620250001', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(451, 406, 'SN40620250002', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(452, 406, 'SN40620250003', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(453, 406, 'SN40620250004', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(454, 406, 'SN40620250005', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(455, 406, 'SN40620250006', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(456, 406, 'SN40620250007', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(457, 406, 'SN40620250008', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(458, 406, 'SN40620250009', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(459, 406, 'SN40620250010', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(460, 407, 'SN40720250001', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(461, 407, 'SN40720250002', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(462, 407, 'SN40720250003', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(463, 407, 'SN40720250004', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(464, 407, 'SN40720250005', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(465, 407, 'SN40720250006', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(466, 407, 'SN40720250007', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(467, 407, 'SN40720250008', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(468, 407, 'SN40720250009', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(469, 407, 'SN40720250010', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(470, 408, 'SN40820250001', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(471, 408, 'SN40820250002', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(472, 408, 'SN40820250003', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(473, 408, 'SN40820250004', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(474, 408, 'SN40820250005', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(475, 408, 'SN40820250006', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(476, 408, 'SN40820250007', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(477, 408, 'SN40820250008', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(478, 408, 'SN40820250009', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(479, 408, 'SN40820250010', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(480, 409, 'SN40920250001', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(481, 409, 'SN40920250002', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(482, 409, 'SN40920250003', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(483, 409, 'SN40920250004', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(484, 409, 'SN40920250005', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(485, 409, 'SN40920250006', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(486, 409, 'SN40920250007', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(487, 409, 'SN40920250008', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(488, 409, 'SN40920250009', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(489, 409, 'SN40920250010', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(490, 410, 'SN41020250001', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(491, 410, 'SN41020250002', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(492, 410, 'SN41020250003', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(493, 410, 'SN41020250004', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(494, 410, 'SN41020250005', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(495, 410, 'SN41020250006', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(496, 410, 'SN41020250007', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(497, 410, 'SN41020250008', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(498, 410, 'SN41020250009', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(499, 410, 'SN41020250010', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(500, 411, 'SN41120250001', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(501, 411, 'SN41120250002', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(502, 411, 'SN41120250003', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(503, 411, 'SN41120250004', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(504, 411, 'SN41120250005', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(505, 411, 'SN41120250006', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(506, 411, 'SN41120250007', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(507, 411, 'SN41120250008', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(508, 411, 'SN41120250009', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(509, 411, 'SN41120250010', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(510, 412, 'SN41220250001', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(511, 412, 'SN41220250002', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(512, 412, 'SN41220250003', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(513, 412, 'SN41220250004', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(514, 412, 'SN41220250005', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(515, 412, 'SN41220250006', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(516, 412, 'SN41220250007', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(517, 412, 'SN41220250008', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(518, 412, 'SN41220250009', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(519, 412, 'SN41220250010', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(520, 413, 'SN41320250001', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(521, 413, 'SN41320250002', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(522, 413, 'SN41320250003', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(523, 413, 'SN41320250004', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(524, 413, 'SN41320250005', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(525, 413, 'SN41320250006', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(526, 413, 'SN41320250007', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(527, 413, 'SN41320250008', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(528, 413, 'SN41320250009', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(529, 413, 'SN41320250010', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(530, 414, 'SN41420250001', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(531, 414, 'SN41420250002', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(532, 414, 'SN41420250003', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(533, 414, 'SN41420250004', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(534, 414, 'SN41420250005', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(535, 414, 'SN41420250006', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(536, 414, 'SN41420250007', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(537, 414, 'SN41420250008', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(538, 414, 'SN41420250009', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(539, 414, 'SN41420250010', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(540, 415, 'SN41520250001', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(541, 415, 'SN41520250002', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(542, 415, 'SN41520250003', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(543, 415, 'SN41520250004', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(544, 415, 'SN41520250005', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(545, 415, 'SN41520250006', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(546, 415, 'SN41520250007', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(547, 415, 'SN41520250008', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(548, 415, 'SN41520250009', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(549, 415, 'SN41520250010', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(550, 416, 'SN41620250001', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(551, 416, 'SN41620250002', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(552, 416, 'SN41620250003', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(553, 416, 'SN41620250004', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(554, 416, 'SN41620250005', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(555, 416, 'SN41620250006', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(556, 416, 'SN41620250007', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(557, 416, 'SN41620250008', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(558, 416, 'SN41620250009', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(559, 416, 'SN41620250010', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(560, 417, 'SN41720250001', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(561, 417, 'SN41720250002', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(562, 417, 'SN41720250003', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(563, 417, 'SN41720250004', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(564, 417, 'SN41720250005', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(565, 417, 'SN41720250006', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(566, 417, 'SN41720250007', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(567, 417, 'SN41720250008', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(568, 417, 'SN41720250009', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(569, 417, 'SN41720250010', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(570, 418, 'SN41820250001', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(571, 418, 'SN41820250002', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(572, 418, 'SN41820250003', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(573, 418, 'SN41820250004', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(574, 418, 'SN41820250005', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(575, 418, 'SN41820250006', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(576, 418, 'SN41820250007', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(577, 418, 'SN41820250008', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(578, 418, 'SN41820250009', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(579, 418, 'SN41820250010', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(580, 419, 'SN41920250001', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(581, 419, 'SN41920250002', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(582, 419, 'SN41920250003', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(583, 419, 'SN41920250004', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(584, 419, 'SN41920250005', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(585, 419, 'SN41920250006', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(586, 419, 'SN41920250007', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(587, 419, 'SN41920250008', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(588, 419, 'SN41920250009', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(589, 419, 'SN41920250010', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(590, 420, 'SN42020250001', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(591, 420, 'SN42020250002', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(592, 420, 'SN42020250003', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(593, 420, 'SN42020250004', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(594, 420, 'SN42020250005', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(595, 420, 'SN42020250006', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(596, 420, 'SN42020250007', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(597, 420, 'SN42020250008', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(598, 420, 'SN42020250009', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(599, 420, 'SN42020250010', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(600, 421, 'SN42120250001', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(601, 421, 'SN42120250002', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(602, 421, 'SN42120250003', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(603, 421, 'SN42120250004', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(604, 421, 'SN42120250005', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(605, 421, 'SN42120250006', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(606, 421, 'SN42120250007', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(607, 421, 'SN42120250008', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(608, 421, 'SN42120250009', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(609, 421, 'SN42120250010', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(610, 422, 'SN42220250001', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(611, 422, 'SN42220250002', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(612, 422, 'SN42220250003', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(613, 422, 'SN42220250004', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(614, 422, 'SN42220250005', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(615, 422, 'SN42220250006', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(616, 422, 'SN42220250007', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(617, 422, 'SN42220250008', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(618, 422, 'SN42220250009', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(619, 422, 'SN42220250010', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(620, 423, 'SN42320250001', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(621, 423, 'SN42320250002', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(622, 423, 'SN42320250003', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(623, 423, 'SN42320250004', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(624, 423, 'SN42320250005', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(625, 423, 'SN42320250006', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(626, 423, 'SN42320250007', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(627, 423, 'SN42320250008', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(628, 423, 'SN42320250009', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(629, 423, 'SN42320250010', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(630, 424, 'SN42420250001', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(631, 424, 'SN42420250002', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(632, 424, 'SN42420250003', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(633, 424, 'SN42420250004', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(634, 424, 'SN42420250005', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(635, 424, 'SN42420250006', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(636, 424, 'SN42420250007', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(637, 424, 'SN42420250008', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(638, 424, 'SN42420250009', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(639, 424, 'SN42420250010', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(640, 425, 'SN42520250001', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(641, 425, 'SN42520250002', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(642, 425, 'SN42520250003', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10');
INSERT INTO `variant_serials` (`serial_id`, `variant_id`, `serial_number`, `status`, `order_item_id`, `warranty_id`, `created_at`, `updated_at`) VALUES
(643, 425, 'SN42520250004', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(644, 425, 'SN42520250005', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(645, 425, 'SN42520250006', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(646, 425, 'SN42520250007', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(647, 425, 'SN42520250008', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(648, 425, 'SN42520250009', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(649, 425, 'SN42520250010', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(650, 426, 'SN42620250001', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(651, 426, 'SN42620250002', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(652, 426, 'SN42620250003', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(653, 426, 'SN42620250004', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(654, 426, 'SN42620250005', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(655, 426, 'SN42620250006', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(656, 426, 'SN42620250007', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(657, 426, 'SN42620250008', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(658, 426, 'SN42620250009', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(659, 426, 'SN42620250010', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(660, 427, 'SN42720250001', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(661, 427, 'SN42720250002', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(662, 427, 'SN42720250003', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(663, 427, 'SN42720250004', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(664, 427, 'SN42720250005', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(665, 427, 'SN42720250006', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(666, 427, 'SN42720250007', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(667, 427, 'SN42720250008', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(668, 427, 'SN42720250009', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(669, 427, 'SN42720250010', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(670, 428, 'SN42820250001', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(671, 428, 'SN42820250002', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(672, 428, 'SN42820250003', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(673, 428, 'SN42820250004', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(674, 428, 'SN42820250005', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(675, 428, 'SN42820250006', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(676, 428, 'SN42820250007', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(677, 428, 'SN42820250008', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(678, 428, 'SN42820250009', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(679, 428, 'SN42820250010', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(680, 500, 'SN50020250001', 'reserved', 153, NULL, '2025-12-30 13:49:10', '2025-12-30 15:17:34'),
(681, 500, 'SN50020250002', 'reserved', 154, NULL, '2025-12-30 13:49:10', '2025-12-30 15:51:54'),
(682, 500, 'SN50020250003', 'reserved', 155, NULL, '2025-12-30 13:49:10', '2025-12-30 15:53:58'),
(683, 500, 'SN50020250004', 'reserved', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 16:00:32'),
(684, 500, 'SN50020250005', 'reserved', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 16:03:13'),
(685, 500, 'SN50020250006', 'reserved', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 16:04:09'),
(686, 500, 'SN50020250007', 'reserved', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 16:05:16'),
(687, 500, 'SN50020250008', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(688, 500, 'SN50020250009', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(689, 500, 'SN50020250010', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(690, 501, 'SN50120250001', 'reserved', 152, NULL, '2025-12-30 13:49:10', '2025-12-30 15:13:31'),
(691, 501, 'SN50120250002', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(692, 501, 'SN50120250003', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(693, 501, 'SN50120250004', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(694, 501, 'SN50120250005', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(695, 501, 'SN50120250006', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(696, 501, 'SN50120250007', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(697, 501, 'SN50120250008', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(698, 501, 'SN50120250009', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(699, 501, 'SN50120250010', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(700, 502, 'SN50220250001', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(701, 502, 'SN50220250002', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(702, 502, 'SN50220250003', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(703, 502, 'SN50220250004', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(704, 502, 'SN50220250005', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(705, 502, 'SN50220250006', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(706, 502, 'SN50220250007', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(707, 502, 'SN50220250008', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(708, 502, 'SN50220250009', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(709, 502, 'SN50220250010', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(710, 510, 'SN51020250001', 'reserved', 148, NULL, '2025-12-30 13:49:10', '2025-12-30 14:14:56'),
(711, 510, 'SN51020250002', 'reserved', 149, NULL, '2025-12-30 13:49:10', '2025-12-30 14:19:02'),
(712, 510, 'SN51020250003', 'reserved', 150, NULL, '2025-12-30 13:49:10', '2025-12-30 15:09:35'),
(713, 510, 'SN51020250004', 'reserved', 151, NULL, '2025-12-30 13:49:10', '2025-12-30 15:10:38'),
(714, 510, 'SN51020250005', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(715, 510, 'SN51020250006', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(716, 510, 'SN51020250007', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(717, 510, 'SN51020250008', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(718, 510, 'SN51020250009', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(719, 510, 'SN51020250010', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(720, 511, 'SN51120250001', 'sold', 147, 5, '2025-12-30 13:49:10', '2025-12-30 14:00:14'),
(721, 511, 'SN51120250002', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(722, 511, 'SN51120250003', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(723, 511, 'SN51120250004', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(724, 511, 'SN51120250005', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(725, 511, 'SN51120250006', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(726, 511, 'SN51120250007', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(727, 511, 'SN51120250008', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(728, 511, 'SN51120250009', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(729, 511, 'SN51120250010', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(730, 512, 'SN51220250001', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(731, 512, 'SN51220250002', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(732, 512, 'SN51220250003', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(733, 512, 'SN51220250004', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(734, 512, 'SN51220250005', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(735, 512, 'SN51220250006', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(736, 512, 'SN51220250007', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(737, 512, 'SN51220250008', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(738, 512, 'SN51220250009', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(739, 512, 'SN51220250010', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(740, 520, 'SN52020250001', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(741, 520, 'SN52020250002', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(742, 520, 'SN52020250003', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(743, 520, 'SN52020250004', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(744, 520, 'SN52020250005', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(745, 520, 'SN52020250006', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(746, 520, 'SN52020250007', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(747, 520, 'SN52020250008', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(748, 520, 'SN52020250009', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(749, 520, 'SN52020250010', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(750, 521, 'SN52120250001', 'reserved', 161, NULL, '2025-12-30 13:49:10', '2025-12-30 16:25:54'),
(751, 521, 'SN52120250002', 'reserved', 162, NULL, '2025-12-30 13:49:10', '2025-12-30 16:35:11'),
(752, 521, 'SN52120250003', 'reserved', 164, NULL, '2025-12-30 13:49:10', '2025-12-30 16:46:34'),
(753, 521, 'SN52120250004', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(754, 521, 'SN52120250005', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(755, 521, 'SN52120250006', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(756, 521, 'SN52120250007', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(757, 521, 'SN52120250008', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(758, 521, 'SN52120250009', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(759, 521, 'SN52120250010', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(760, 522, 'SN52220250001', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(761, 522, 'SN52220250002', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(762, 522, 'SN52220250003', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(763, 522, 'SN52220250004', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(764, 522, 'SN52220250005', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(765, 522, 'SN52220250006', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(766, 522, 'SN52220250007', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(767, 522, 'SN52220250008', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(768, 522, 'SN52220250009', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(769, 522, 'SN52220250010', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(770, 530, 'SN53020250001', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(771, 530, 'SN53020250002', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(772, 530, 'SN53020250003', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(773, 530, 'SN53020250004', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(774, 530, 'SN53020250005', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(775, 530, 'SN53020250006', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(776, 530, 'SN53020250007', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(777, 530, 'SN53020250008', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(778, 530, 'SN53020250009', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(779, 530, 'SN53020250010', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(780, 531, 'SN53120250001', 'reserved', 160, NULL, '2025-12-30 13:49:10', '2025-12-30 16:25:54'),
(781, 531, 'SN53120250002', 'reserved', 163, NULL, '2025-12-30 13:49:10', '2025-12-30 16:35:11'),
(782, 531, 'SN53120250003', 'reserved', 165, NULL, '2025-12-30 13:49:10', '2025-12-30 16:46:34'),
(783, 531, 'SN53120250004', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(784, 531, 'SN53120250005', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(785, 531, 'SN53120250006', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(786, 531, 'SN53120250007', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(787, 531, 'SN53120250008', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(788, 531, 'SN53120250009', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(789, 531, 'SN53120250010', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(790, 532, 'SN53220250001', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(791, 532, 'SN53220250002', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(792, 532, 'SN53220250003', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(793, 532, 'SN53220250004', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(794, 532, 'SN53220250005', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(795, 532, 'SN53220250006', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(796, 532, 'SN53220250007', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(797, 532, 'SN53220250008', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(798, 532, 'SN53220250009', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(799, 532, 'SN53220250010', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(800, 540, 'SN54020250001', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(801, 540, 'SN54020250002', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(802, 540, 'SN54020250003', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(803, 540, 'SN54020250004', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(804, 540, 'SN54020250005', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(805, 540, 'SN54020250006', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(806, 540, 'SN54020250007', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(807, 540, 'SN54020250008', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(808, 540, 'SN54020250009', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(809, 540, 'SN54020250010', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(810, 541, 'SN54120250001', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(811, 541, 'SN54120250002', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(812, 541, 'SN54120250003', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(813, 541, 'SN54120250004', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(814, 541, 'SN54120250005', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(815, 541, 'SN54120250006', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(816, 541, 'SN54120250007', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(817, 541, 'SN54120250008', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(818, 541, 'SN54120250009', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(819, 541, 'SN54120250010', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(820, 542, 'SN54220250001', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(821, 542, 'SN54220250002', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(822, 542, 'SN54220250003', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(823, 542, 'SN54220250004', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(824, 542, 'SN54220250005', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(825, 542, 'SN54220250006', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(826, 542, 'SN54220250007', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(827, 542, 'SN54220250008', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(828, 542, 'SN54220250009', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(829, 542, 'SN54220250010', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(830, 550, 'SN55020250001', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(831, 550, 'SN55020250002', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(832, 550, 'SN55020250003', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(833, 550, 'SN55020250004', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(834, 550, 'SN55020250005', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(835, 550, 'SN55020250006', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(836, 550, 'SN55020250007', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(837, 550, 'SN55020250008', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(838, 550, 'SN55020250009', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(839, 550, 'SN55020250010', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(840, 551, 'SN55120250001', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(841, 551, 'SN55120250002', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(842, 551, 'SN55120250003', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(843, 551, 'SN55120250004', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(844, 551, 'SN55120250005', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(845, 551, 'SN55120250006', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(846, 551, 'SN55120250007', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(847, 551, 'SN55120250008', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(848, 551, 'SN55120250009', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(849, 551, 'SN55120250010', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(850, 552, 'SN55220250001', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(851, 552, 'SN55220250002', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(852, 552, 'SN55220250003', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(853, 552, 'SN55220250004', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(854, 552, 'SN55220250005', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(855, 552, 'SN55220250006', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(856, 552, 'SN55220250007', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(857, 552, 'SN55220250008', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(858, 552, 'SN55220250009', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(859, 552, 'SN55220250010', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(860, 560, 'SN56020250001', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(861, 560, 'SN56020250002', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(862, 560, 'SN56020250003', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(863, 560, 'SN56020250004', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(864, 560, 'SN56020250005', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(865, 560, 'SN56020250006', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(866, 560, 'SN56020250007', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(867, 560, 'SN56020250008', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(868, 560, 'SN56020250009', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(869, 560, 'SN56020250010', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(870, 561, 'SN56120250001', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(871, 561, 'SN56120250002', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(872, 561, 'SN56120250003', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(873, 561, 'SN56120250004', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(874, 561, 'SN56120250005', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(875, 561, 'SN56120250006', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(876, 561, 'SN56120250007', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(877, 561, 'SN56120250008', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(878, 561, 'SN56120250009', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(879, 561, 'SN56120250010', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(880, 562, 'SN56220250001', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(881, 562, 'SN56220250002', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(882, 562, 'SN56220250003', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(883, 562, 'SN56220250004', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(884, 562, 'SN56220250005', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(885, 562, 'SN56220250006', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(886, 562, 'SN56220250007', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(887, 562, 'SN56220250008', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(888, 562, 'SN56220250009', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(889, 562, 'SN56220250010', 'in_stock', NULL, NULL, '2025-12-30 13:49:10', '2025-12-30 13:49:10'),
(890, 583, 'SN58320260001', 'in_stock', NULL, NULL, '2026-01-04 04:14:15', '2026-01-04 04:14:15'),
(891, 583, 'SN58320260002', 'in_stock', NULL, NULL, '2026-01-04 04:14:15', '2026-01-04 04:14:15'),
(892, 583, 'SN58320260003', 'in_stock', NULL, NULL, '2026-01-04 04:14:15', '2026-01-04 04:14:15'),
(893, 583, 'SN58320260004', 'in_stock', NULL, NULL, '2026-01-04 04:14:15', '2026-01-04 04:14:15'),
(894, 583, 'SN58320260005', 'in_stock', NULL, NULL, '2026-01-04 04:14:15', '2026-01-04 04:14:15');

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
-- Dumping data for table `warranties`
--

INSERT INTO `warranties` (`warranty_id`, `serial_id`, `order_item_id`, `warranty_period`, `start_date`, `end_date`, `status`, `notes`, `created_at`, `updated_at`) VALUES
(5, 720, 147, 12, '2025-12-30', '2026-12-30', 'active', NULL, '2025-12-30 14:00:14', '2025-12-30 14:00:14');

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
  MODIFY `attribute_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=97;

--
-- AUTO_INCREMENT for table `attributes_categories`
--
ALTER TABLE `attributes_categories`
  MODIFY `attribute_category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=105;

--
-- AUTO_INCREMENT for table `attribute_values`
--
ALTER TABLE `attribute_values`
  MODIFY `attribute_value_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=383;

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
  MODIFY `cav_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

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
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=388;

--
-- AUTO_INCREMENT for table `product_variants`
--
ALTER TABLE `product_variants`
  MODIFY `variant_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=585;

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
  MODIFY `serial_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=895;

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
