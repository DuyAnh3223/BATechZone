-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th1 16, 2026 lúc 05:44 AM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `batechzone`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `addresses`
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
-- Đang đổ dữ liệu cho bảng `addresses`
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
(112, 25, 'phamvanc881', '0908988881', '32 Bùi Ngọ', NULL, 'hcm', 'Quận 7', NULL, NULL, 'Vietnam', 0, 'other', '2025-12-30 16:35:11', '2025-12-30 16:35:11'),
(113, 20, 'Trần Thị B', '0908787671', '32 Bùi Ngọ', NULL, 'hcm', 'Quận 1', NULL, NULL, 'Vietnam', 0, 'other', '2026-01-04 19:25:59', '2026-01-04 19:25:59'),
(115, 30, 'nguyen van a', '0123456788', 'abcd', NULL, 'hcm', 'q1', NULL, NULL, 'Vietnam', 0, 'other', '2026-01-11 05:47:57', '2026-01-11 05:47:57'),
(116, 30, 'bao bao bao', '09768564721', 'abcd', 'aaa', 'hcm', 'q1', NULL, NULL, 'Vietnam', 0, 'other', '2026-01-11 06:06:38', '2026-01-11 06:06:38'),
(117, 30, 'nguyen van a', '0123456788', 'abc,123', NULL, 'hcm', 'q1', NULL, NULL, 'Vietnam', 0, 'other', '2026-01-11 10:21:20', '2026-01-11 10:21:20'),
(118, 31, 'nguyen van a', '0123456788', '321,uu', NULL, 'hcm', 'q1', NULL, NULL, 'Vietnam', 0, 'other', '2026-01-11 13:22:02', '2026-01-11 13:22:02'),
(119, 31, 'hdpe', '09768564721', '123, dsa', NULL, 'cantho', 'Ninh Kiều', NULL, NULL, 'Vietnam', 0, 'other', '2026-01-11 13:23:49', '2026-01-11 13:23:49'),
(120, 31, 'tranthib671', '0965656565', 'abc,123', NULL, 'hcm', 'q1', NULL, NULL, 'Vietnam', 0, 'other', '2026-01-11 14:07:52', '2026-01-11 14:07:52'),
(121, 31, 'dddd', '0965656565', '123. dsa', NULL, 'hcm', 'q1', NULL, NULL, 'Vietnam', 0, 'other', '2026-01-11 14:20:25', '2026-01-11 14:20:25'),
(122, 30, 'a', '0123456788', '321,uu', NULL, 'hcm', 'q1', NULL, NULL, 'Vietnam', 0, 'other', '2026-01-16 03:17:12', '2026-01-16 03:17:12'),
(123, 30, 'Bao Le Ton', '0123456788', '123. dsa', NULL, 'hcm', 'q1', NULL, NULL, 'Vietnam', 0, 'other', '2026-01-16 03:30:59', '2026-01-16 03:30:59'),
(124, 30, 'Bao Le Ton', '0965656565', 'abc,123', NULL, 'hcm', 'q1', NULL, NULL, 'Vietnam', 0, 'other', '2026-01-16 03:51:57', '2026-01-16 03:51:57'),
(125, 30, 'Bao Le Ton', '0123456788', 'abc', NULL, 'hcm', 'q1', NULL, NULL, 'Vietnam', 0, 'other', '2026-01-16 04:28:26', '2026-01-16 04:28:26'),
(126, 30, 'bar    ', '01234567888', '123, dsa', NULL, 'hcm', 'Quận Phú Nhuận', NULL, NULL, 'Vietnam', 0, 'other', '2026-01-16 04:31:18', '2026-01-16 04:31:18');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `attributes`
--

CREATE TABLE `attributes` (
  `attribute_id` int(11) NOT NULL,
  `attribute_name` varchar(100) NOT NULL,
  `display_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `attributes`
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
(26, 'Kích Thước', 26, 1, '2026-01-04 12:31:19'),
(27, 'HDET', 0, 1, '2026-01-11 07:23:51'),
(28, 'TY', 0, 1, '2026-01-11 07:24:36'),
(29, 'HDETT', 0, 1, '2026-01-11 07:28:19');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `attributes_categories`
--

CREATE TABLE `attributes_categories` (
  `attribute_category_id` int(11) NOT NULL,
  `attribute_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `is_variant_attribute` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `attributes_categories`
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
(36, 26, 40, 0),
(37, 27, 58, 1),
(39, 29, 58, 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `attribute_values`
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
-- Đang đổ dữ liệu cho bảng `attribute_values`
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
(168, 26, '32 inch', 6, 1, '2026-01-04 12:31:19'),
(169, 27, 'H', 0, 1, '2026-01-11 07:24:04'),
(170, 27, 'E', 0, 1, '2026-01-11 07:24:10'),
(171, 28, 'TY1', 0, 1, '2026-01-11 07:24:45'),
(172, 29, 'H', 0, 1, '2026-01-11 07:28:27');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `builds`
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
-- Cấu trúc bảng cho bảng `build_items`
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
-- Cấu trúc bảng cho bảng `carts`
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
-- Đang đổ dữ liệu cho bảng `carts`
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
(17, 25, NULL, '2025-12-30 16:26:21', '2025-12-30 16:26:21', '2026-01-29 16:26:21'),
(18, 26, NULL, '2026-01-11 03:27:30', '2026-01-11 03:27:30', '2026-02-10 03:27:30'),
(20, 30, NULL, '2026-01-11 05:06:35', '2026-01-11 05:06:35', '2026-02-10 05:06:35'),
(21, 31, NULL, '2026-01-11 13:17:15', '2026-01-11 13:17:15', '2026-02-10 13:17:15');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `cart_items`
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
-- Đang đổ dữ liệu cho bảng `cart_items`
--

INSERT INTO `cart_items` (`cart_item_id`, `cart_id`, `variant_id`, `quantity`, `added_at`, `updated_at`) VALUES
(159, 1, 606, 1, '2026-01-04 19:25:32', '2026-01-04 19:25:32'),
(160, 1, 619, 2, '2026-01-10 14:46:21', '2026-01-10 15:37:57'),
(161, 1, 620, 1, '2026-01-10 15:37:57', '2026-01-10 15:37:57'),
(162, 1, 618, 1, '2026-01-10 15:37:57', '2026-01-10 15:37:57');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `categories`
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
-- Đang đổ dữ liệu cho bảng `categories`
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
(58, 'HDPE', 'a', NULL, '/uploads/categories/5_De_Where-1768115982577-990941447.png', NULL, 1, 0, '2026-01-11 07:19:42', '2026-01-11 07:19:42');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `categories_attributes_values`
--

CREATE TABLE `categories_attributes_values` (
  `cav_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `attribute_id` int(11) NOT NULL,
  `attribute_value_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `categories_attributes_values`
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
(283, 40, 26, 168),
(285, 58, 27, 169),
(286, 58, 27, 170),
(287, 58, 28, 171),
(288, 58, 29, 172);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `coupons`
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
-- Đang đổ dữ liệu cho bảng `coupons`
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
(9, 'HELLO', 'Giam 7% cho don hang 100000', 'percentage', 7.00, NULL, 100000.00, NULL, 0, 0, '2025-11-05 01:00:00', '2025-11-20 13:00:00', '2025-11-05 10:33:52'),
(11, 'GEARMAX', 'Giam 10% gia tien', 'percentage', 10.00, NULL, 0.00, 50, 1, 1, '2026-01-11 05:50:00', NULL, '2026-01-11 05:50:28');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `installments`
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
-- Đang đổ dữ liệu cho bảng `installments`
--

INSERT INTO `installments` (`installment_id`, `order_id`, `user_id`, `total_amount`, `down_payment`, `down_payment_status`, `down_payment_date`, `down_payment_note`, `num_terms`, `monthly_payment`, `overdue_fee_percent_per_day`, `total_overdue_fee`, `interest_rate`, `start_date`, `end_date`, `status`, `created_at`, `policy_id`) VALUES
(40, 82, 20, 10298355.41, 0.00, 'not_required', NULL, NULL, 12, 858196.28, 1.00, 583573.47, 2.00, '2025-12-11', '2026-12-11', 'active', '2025-12-11 09:18:53', 8),
(41, 83, 20, 10061.73, 8000.00, 'paid', '2025-12-11 09:42:54', 'Thanh toán trả trước qua Chuyển khoản', 12, 171.81, 1.00, 49.82, 2.00, '2025-12-11', '2026-12-11', 'active', '2025-12-11 09:42:11', 8),
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
(53, 134, 25, 6980000.00, 698000.00, 'paid', '2025-12-30 23:47:01', 'Thanh toán trả trước qua Chuyển khoản', 6, 1053107.50, 1.00, 0.00, 2.00, '2025-12-30', '2026-06-30', 'active', '2025-12-30 16:46:34', NULL),
(54, 135, 20, 3400000.00, 0.00, 'not_required', NULL, NULL, 6, 569972.22, 0.00, 0.00, 2.00, '2026-01-05', '2026-07-05', 'active', '2026-01-04 19:26:00', NULL),
(55, 140, 31, 2100000.00, 420000.00, 'pending', NULL, NULL, 18, 105233.33, 0.00, 0.00, 6.00, '2026-01-11', '2027-07-11', 'approved', '2026-01-11 13:23:49', NULL),
(56, 157, 30, 4700000.00, 0.00, 'not_required', NULL, NULL, 6, 787902.78, 0.00, 0.00, 2.00, '2026-01-16', '2026-07-16', 'active', '2026-01-16 04:31:18', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `installment_payments`
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
-- Đang đổ dữ liệu cho bảng `installment_payments`
--

INSERT INTO `installment_payments` (`payment_id`, `installment_id`, `payment_no`, `due_date`, `paid_date`, `amount`, `status`, `overdue_days`, `overdue_fee`, `note`) VALUES
(82, 40, 1, '2025-12-01', '2025-12-11 00:00:00', 858196.28, 'paid', 10, 0.00, 'Thanh toán qua Chuyển khoản'),
(83, 40, 2, '2025-12-02', '2025-12-11 00:00:00', 858196.28, 'paid', 9, 77237.67, 'Thanh toán qua Chuyển khoản'),
(84, 40, 3, '2025-12-03', '2025-12-11 00:00:00', 858196.28, 'paid', 8, 68655.70, 'Thanh toán qua Chuyển khoản'),
(85, 40, 4, '2025-12-04', '2025-12-11 00:00:00', 858196.28, 'paid', 7, 60073.74, 'Thanh toán qua Chuyển khoản'),
(86, 40, 5, '2025-12-05', NULL, 858196.28, 'overdue', 37, 317532.62, NULL),
(87, 40, 6, '2026-06-11', '2025-12-11 00:00:00', 858196.28, 'paid', 0, 0.00, 'Thanh toán qua Momo'),
(88, 40, 7, '2026-07-11', '2025-12-11 00:00:00', 858196.28, 'paid', 0, 0.00, 'Thanh toán qua Momo'),
(89, 40, 8, '2026-08-11', '2025-12-11 00:00:00', 858196.28, 'paid', 0, 0.00, 'Thanh toán qua Momo'),
(90, 40, 9, '2026-09-11', '2025-12-11 13:22:44', 858196.28, 'paid', 0, 0.00, 'Thanh toán qua Momo'),
(91, 40, 10, '2026-10-11', '2025-12-11 20:25:31', 858196.28, 'paid', 0, 0.00, 'Thanh toán qua Momo'),
(92, 40, 11, '2026-11-11', NULL, 858196.28, 'pending', 0, 0.00, NULL),
(93, 40, 12, '2025-12-09', '2025-12-14 20:02:09', 1201474.79, 'paid', 5, 60073.74, 'Thanh toán qua Chuyển khoản'),
(94, 41, 1, '2025-12-13', NULL, 171.81, 'overdue', 29, 49.82, NULL),
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
(171, 53, 6, '2026-06-30', NULL, 1048745.00, 'pending', 0, 0.00, NULL),
(172, 54, 1, '2026-02-05', NULL, 572333.33, 'pending', 0, 0.00, NULL),
(173, 54, 2, '2026-03-05', NULL, 571388.89, 'pending', 0, 0.00, NULL),
(174, 54, 3, '2026-04-05', NULL, 570444.44, 'pending', 0, 0.00, NULL),
(175, 54, 4, '2026-05-05', NULL, 569500.00, 'pending', 0, 0.00, NULL),
(176, 54, 5, '2026-06-05', NULL, 568555.56, 'pending', 0, 0.00, NULL),
(177, 54, 6, '2026-07-05', NULL, 567611.11, 'pending', 0, 0.00, NULL),
(178, 56, 1, '2026-02-16', '2026-01-16 11:31:59', 791166.67, 'paid', 0, 0.00, 'Thanh toán qua Tiền mặt'),
(179, 56, 2, '2026-03-16', '2026-01-16 11:32:26', 789861.11, 'paid', 0, 0.00, 'Thanh toán qua VNPay'),
(180, 56, 3, '2026-04-16', NULL, 788555.56, 'pending', 0, 0.00, NULL),
(181, 56, 4, '2026-05-16', NULL, 787250.00, 'pending', 0, 0.00, NULL),
(182, 56, 5, '2026-06-16', NULL, 785944.44, 'pending', 0, 0.00, NULL),
(183, 56, 6, '2026-07-16', NULL, 784638.89, 'pending', 0, 0.00, NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `installment_policies`
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
-- Đang đổ dữ liệu cho bảng `installment_policies`
--

INSERT INTO `installment_policies` (`policy_id`, `name`, `terms`, `interest_rate`, `min_down_payment`, `description`, `is_active`, `created_at`, `updated_at`, `installment_fee_percent`, `overdue_fee_percent`) VALUES
(1, 'Trả góp 6 tháng', 6, 50.00, 20.00, NULL, 0, '2025-11-29 11:47:36', '2025-12-30 13:35:39', 2.00, 0.00),
(2, 'Trả góp 6 tháng 0%', 6, 2.00, 0.00, 'Trả trong 6 tháng, không phát sinh lãi và phí.', 1, '2025-11-29 12:10:17', '2025-12-05 12:41:00', 0.00, 0.00),
(3, 'Trả góp 12 tháng lãi 3%', 12, 3.00, 20.00, 'Gói trả góp 12 tháng, lãi suất 3%/năm, phí hợp đồng 5%.', 1, '2025-11-29 12:10:17', '2025-11-29 12:10:17', 5.00, 0.00),
(4, 'Trả góp 18 tháng lãi 6%', 18, 6.00, 15.00, 'Trả góp 18 tháng, lãi suất 6%/năm, phí trả góp 8%.', 1, '2025-11-29 12:10:17', '2025-11-29 12:10:17', 8.00, 0.00),
(5, 'Trả góp 24 tháng', 24, 7.50, 10.00, 'Kỳ hạn dài nhất, lãi suất 7.5%/năm, phí hợp đồng 10%.', 1, '2025-11-29 12:10:17', '2025-11-29 12:10:17', 10.00, 0.00),
(6, 'Gói ưu đãi cho sản phẩm cao cấp', 9, 2.50, 40.00, 'Dành cho sản phẩm trị giá cao, yêu cầu trả trước 40%.', 1, '2025-11-29 12:10:17', '2025-11-29 12:10:17', 0.00, 0.00),
(8, 'Trả góp 12 tháng - Lãi suất thấp - Có Phí Overdue', 12, 2.00, 0.00, NULL, 1, '2025-12-11 07:16:53', '2025-12-11 07:16:53', 2.00, 1.00),
(9, 'Trả góp 6 tháng ưu đãi không phí, lãi suất thấp', 6, 2.00, 0.00, 'Phù hợp khách hàng trả nhanh, ưu đãi lớn, lãi suất thấp', 1, '2025-12-30 13:37:15', '2025-12-30 13:37:15', 0.00, 1.00),
(10, 'TEST 6 thang', 6, 2.00, 10.00, 'test', 0, '2026-01-11 10:25:47', '2026-01-11 10:26:12', 2.00, 2.00),
(11, 'TEST 6 thang', 1, 1.00, 1.00, 'a', 0, '2026-01-11 10:26:04', '2026-01-11 10:26:26', 1.00, 1.00),
(12, 'tetsfs', 6, 3.00, 3.00, 'tuuuabcccccc', 1, '2026-01-11 11:31:51', '2026-01-11 13:37:21', 5.00, 1.00),
(13, 'test demo', 2, 2.00, 2.00, 'a', 0, '2026-01-11 13:34:40', '2026-01-11 13:34:44', 2.00, 2.00);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `orders`
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
-- Đang đổ dữ liệu cho bảng `orders`
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
(127, NULL, 'ORD10038762410', 109, NULL, 'delivered', 'unpaid', 8490000.00, 0.00, 0.00, 0.00, 8490000.00, NULL, NULL, '2025-12-30 15:53:58', '2026-01-04 19:28:00', '2026-01-04 19:27:53', '2026-01-04 19:27:58', '2026-01-04 19:28:00', NULL),
(132, 25, 'ORD11954950955', 111, NULL, 'shipping', 'unpaid', 6980000.00, 0.00, 0.00, 0.00, 6980000.00, NULL, NULL, '2025-12-30 16:25:54', '2025-12-30 16:26:42', NULL, '2025-12-30 16:26:42', NULL, NULL),
(133, 25, 'ORD12511041306', 112, NULL, 'shipping', 'unpaid', 6980000.00, 0.00, 0.00, 0.00, 6980000.00, NULL, NULL, '2025-12-30 16:35:11', '2025-12-30 16:37:19', NULL, '2025-12-30 16:37:19', NULL, NULL),
(134, 25, 'ORD13194143618', 111, NULL, 'shipping', 'unpaid', 6980000.00, 0.00, 0.00, 0.00, 6980000.00, NULL, NULL, '2025-12-30 16:46:34', '2025-12-30 16:47:01', NULL, '2025-12-30 16:47:01', NULL, NULL),
(135, 20, 'ORD54759999626', 113, NULL, 'delivered', 'unpaid', 3400000.00, 0.00, 0.00, 0.00, 3400000.00, NULL, NULL, '2026-01-04 19:26:00', '2026-01-04 19:27:31', '2026-01-04 19:27:24', '2026-01-04 19:27:29', '2026-01-04 19:27:31', NULL),
(136, 30, 'ORD10477173948', 115, NULL, 'pending', '', 4650000.00, 0.00, 50000.00, 0.00, 4700000.00, NULL, NULL, '2026-01-11 05:47:57', '2026-01-11 06:15:06', NULL, NULL, NULL, NULL),
(137, 30, 'ORD11598722678', 116, 11, 'delivered', 'paid', 800000.00, 80000.00, 50000.00, 0.00, 770000.00, 'aaa', NULL, '2026-01-11 06:06:38', '2026-01-11 06:08:52', NULL, '2026-01-11 06:08:20', '2026-01-11 06:08:52', NULL),
(138, 30, 'ORD26880900026', 117, NULL, 'shipping', 'paid', 4700000.00, 0.00, 50000.00, 0.00, 4750000.00, NULL, NULL, '2026-01-11 10:21:20', '2026-01-11 10:21:20', NULL, NULL, NULL, NULL),
(139, 31, 'ORD37722069873', 118, NULL, 'delivered', 'paid', 4700000.00, 0.00, 50000.00, 0.00, 4750000.00, NULL, NULL, '2026-01-11 13:22:02', '2026-01-11 14:03:18', NULL, '2026-01-11 14:03:16', '2026-01-11 14:03:18', NULL),
(140, 31, 'ORD37829061537', 119, NULL, 'confirmed', '', 2100000.00, 0.00, 0.00, 0.00, 2100000.00, NULL, NULL, '2026-01-11 13:23:49', '2026-01-16 03:31:38', '2026-01-16 03:31:38', NULL, NULL, NULL),
(141, 31, 'ORD40472978376', 120, NULL, 'delivered', 'paid', 4650000.00, 0.00, 50000.00, 0.00, 4700000.00, NULL, NULL, '2026-01-11 14:07:52', '2026-01-11 14:08:03', NULL, '2026-01-11 14:08:01', '2026-01-11 14:08:03', NULL),
(142, 31, 'ORD41225194889', 121, NULL, 'delivered', 'paid', 9100000.00, 0.00, 50000.00, 0.00, 9150000.00, NULL, NULL, '2026-01-11 14:20:25', '2026-01-11 14:20:53', NULL, '2026-01-11 14:20:51', '2026-01-11 14:20:53', NULL),
(143, 30, 'ORD33432633536', 122, NULL, 'shipping', 'paid', 2100000.00, 0.00, 50000.00, 0.00, 2150000.00, NULL, NULL, '2026-01-16 03:17:12', '2026-01-16 03:17:12', NULL, NULL, NULL, NULL),
(144, 30, 'ORD33780327393', 122, NULL, 'shipping', 'paid', 800000.00, 0.00, 50000.00, 0.00, 850000.00, NULL, NULL, '2026-01-16 03:23:00', '2026-01-16 03:23:00', NULL, NULL, NULL, NULL),
(145, 30, 'ORD33864979050', 122, NULL, 'shipping', 'paid', 5100000.00, 0.00, 50000.00, 0.00, 5150000.00, NULL, NULL, '2026-01-16 03:24:24', '2026-01-16 03:24:24', NULL, NULL, NULL, NULL),
(146, 30, 'ORD34259189251', 123, NULL, 'shipping', 'paid', 2100000.00, 0.00, 50000.00, 0.00, 2150000.00, NULL, NULL, '2026-01-16 03:30:59', '2026-01-16 03:31:46', '2026-01-16 03:30:59', '2026-01-16 03:31:46', NULL, NULL),
(147, 30, 'ORD34413311007', 117, NULL, 'shipping', 'paid', 4700000.00, 0.00, 50000.00, 0.00, 4750000.00, NULL, NULL, '2026-01-16 03:33:33', '2026-01-16 03:43:11', '2026-01-16 03:33:33', '2026-01-16 03:43:11', NULL, NULL),
(148, 30, 'ORD35517656536', 124, NULL, 'confirmed', 'paid', 5100000.00, 0.00, 50000.00, 0.00, 5150000.00, NULL, NULL, '2026-01-16 03:51:57', '2026-01-16 03:51:57', '2026-01-16 03:51:57', NULL, NULL, NULL),
(149, 30, 'ORD35777382593', 117, NULL, 'confirmed', '', 5100000.00, 0.00, 50000.00, 0.00, 5150000.00, NULL, NULL, '2026-01-16 03:56:17', '2026-01-16 03:56:17', NULL, NULL, NULL, NULL),
(150, 30, 'ORD36337191175', 115, NULL, 'delivered', 'paid', 2000000.00, 0.00, 50000.00, 0.00, 2050000.00, NULL, NULL, '2026-01-16 04:05:37', '2026-01-16 04:06:53', '2026-01-16 04:06:32', '2026-01-16 04:06:45', '2026-01-16 04:06:53', NULL),
(151, 30, 'ORD36477688207', 123, NULL, 'delivered', 'paid', 4650000.00, 0.00, 50000.00, 0.00, 4700000.00, NULL, NULL, '2026-01-16 04:07:57', '2026-01-16 04:09:20', '2026-01-16 04:08:50', '2026-01-16 04:09:11', '2026-01-16 04:09:20', NULL),
(152, 30, 'ORD36815526061', 123, NULL, 'delivered', 'paid', 10000.00, 0.00, 50000.00, 0.00, 60000.00, NULL, NULL, '2026-01-16 04:13:35', '2026-01-16 04:14:49', '2026-01-16 04:14:09', '2026-01-16 04:14:23', '2026-01-16 04:14:49', NULL),
(153, 30, 'ORD36978305044', 123, NULL, 'delivered', 'paid', 9100000.00, 0.00, 50000.00, 0.00, 9150000.00, NULL, NULL, '2026-01-16 04:16:18', '2026-01-16 04:17:39', '2026-01-16 04:16:50', '2026-01-16 04:17:25', '2026-01-16 04:17:39', NULL),
(154, 30, 'ORD37143463862', 122, NULL, 'delivered', 'paid', 4700000.00, 0.00, 50000.00, 0.00, 4750000.00, NULL, NULL, '2026-01-16 04:19:03', '2026-01-16 04:21:08', '2026-01-16 04:19:03', '2026-01-16 04:20:57', '2026-01-16 04:21:08', NULL),
(155, 30, 'ORD37506090110', 117, NULL, 'pending', '', 9100000.00, 0.00, 50000.00, 0.00, 9150000.00, NULL, NULL, '2026-01-16 04:25:06', '2026-01-16 04:25:06', NULL, NULL, NULL, NULL),
(156, 30, 'ORD37706036350', 125, NULL, 'delivered', 'paid', 4700000.00, 0.00, 50000.00, 0.00, 4750000.00, NULL, NULL, '2026-01-16 04:28:26', '2026-01-16 04:29:04', '2026-01-16 04:28:26', '2026-01-16 04:29:01', '2026-01-16 04:29:04', NULL),
(157, 30, 'ORD37878139416', 126, NULL, 'pending', '', 4700000.00, 0.00, 0.00, 0.00, 4700000.00, NULL, NULL, '2026-01-16 04:31:18', '2026-01-16 04:31:18', NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `order_items`
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
-- Đang đổ dữ liệu cho bảng `order_items`
--

INSERT INTO `order_items` (`order_item_id`, `order_id`, `variant_id`, `product_name`, `variant_name`, `sku`, `quantity`, `unit_price`, `discount_amount`, `subtotal`, `created_at`) VALUES
(166, 135, 606, 'Ổ Cứng HDD Toshiba P300 4TB 3.5 inch, 5400RPM, SATA III, 128MB Cache', 'Mặc định', 'ỔCH-402-069368', 1, 3400000.00, 0.00, 3400000.00, '2026-01-04 19:26:00'),
(167, 136, 610, 'Card màn hình Asus DUAL-RTX 3050-6G', 'Mặc định', 'CMH-406-345662', 1, 4650000.00, 0.00, 4650000.00, '2026-01-11 05:47:57'),
(168, 137, 620, 'Corsair DDR4 Buss 3200MHZ', '16GB (1 X 16GB)', 'PRD-16-1', 1, 800000.00, 0.00, 800000.00, '2026-01-11 06:06:38'),
(169, 138, 600, 'AMD Ryzen 5 5700X3D', 'Mặc định', 'AR5-396-030666', 1, 4700000.00, 0.00, 4700000.00, '2026-01-11 10:21:20'),
(170, 139, 600, 'AMD Ryzen 5 5700X3D', 'Mặc định', 'AR5-396-030666', 1, 4700000.00, 0.00, 4700000.00, '2026-01-11 13:22:02'),
(171, 140, 619, 'Intel Core I3 13100F ', 'Mặc định', 'ICI-416-114599', 1, 2100000.00, 0.00, 2100000.00, '2026-01-11 13:23:49'),
(172, 141, 610, 'Card màn hình Asus DUAL-RTX 3050-6G', 'Mặc định', 'CMH-406-345662', 1, 4650000.00, 0.00, 4650000.00, '2026-01-11 14:07:52'),
(173, 142, 612, 'Card màn hình MSI RTX 5060 8G VENTUS 2X OC GDDR7', 'Mặc định', 'CMH-408-923104', 1, 9100000.00, 0.00, 9100000.00, '2026-01-11 14:20:25'),
(174, 143, 619, 'Intel Core I3 13100F ', 'Mặc định', 'ICI-416-114599', 1, 2100000.00, 0.00, 2100000.00, '2026-01-16 03:17:12'),
(175, 144, 620, 'Corsair DDR4 Buss 3200MHZ', '16GB (1 X 16GB)', 'PRD-16-1', 1, 800000.00, 0.00, 800000.00, '2026-01-16 03:23:00'),
(176, 145, 603, 'CPU Intel Core i5-13400 (up to 4.6Ghz, 10 nhân 16 luồng, 20MB Cache, 65W) - Socket Intel LGA 1700/Raptor Lake) ', 'Mặc định', 'CIC-399-098537', 1, 5100000.00, 0.00, 5100000.00, '2026-01-16 03:24:24'),
(177, 146, 619, 'Intel Core I3 13100F ', 'Mặc định', 'ICI-416-114599', 1, 2100000.00, 0.00, 2100000.00, '2026-01-16 03:30:59'),
(178, 147, 600, 'AMD Ryzen 5 5700X3D', 'Mặc định', 'AR5-396-030666', 1, 4700000.00, 0.00, 4700000.00, '2026-01-16 03:33:33'),
(179, 148, 603, 'CPU Intel Core i5-13400 (up to 4.6Ghz, 10 nhân 16 luồng, 20MB Cache, 65W) - Socket Intel LGA 1700/Raptor Lake) ', 'Mặc định', 'CIC-399-098537', 1, 5100000.00, 0.00, 5100000.00, '2026-01-16 03:51:57'),
(180, 149, 603, 'CPU Intel Core i5-13400 (up to 4.6Ghz, 10 nhân 16 luồng, 20MB Cache, 65W) - Socket Intel LGA 1700/Raptor Lake) ', 'Mặc định', 'CIC-399-098537', 1, 5100000.00, 0.00, 5100000.00, '2026-01-16 03:56:17'),
(181, 150, 622, 'aaadd', 'Mặc định', 'A-418-210418', 1, 2000000.00, 0.00, 2000000.00, '2026-01-16 04:05:37'),
(182, 151, 610, 'Card màn hình Asus DUAL-RTX 3050-6G', 'Mặc định', 'CMH-406-345662', 1, 4650000.00, 0.00, 4650000.00, '2026-01-16 04:07:57'),
(183, 152, 625, 'bcaab', '10TB', 'PRD-10-1', 1, 10000.00, 0.00, 10000.00, '2026-01-16 04:13:35'),
(184, 153, 612, 'Card màn hình MSI RTX 5060 8G VENTUS 2X OC GDDR7', 'Mặc định', 'CMH-408-923104', 1, 9100000.00, 0.00, 9100000.00, '2026-01-16 04:16:18'),
(185, 154, 611, 'Card màn hình Gigabyte RTX 3050 WINFORCE OC V2-6G', 'Mặc định', 'CMH-407-589830', 1, 4700000.00, 0.00, 4700000.00, '2026-01-16 04:19:03'),
(186, 155, 612, 'Card màn hình MSI RTX 5060 8G VENTUS 2X OC GDDR7', 'Mặc định', 'CMH-408-923104', 1, 9100000.00, 0.00, 9100000.00, '2026-01-16 04:25:06'),
(187, 156, 611, 'Card màn hình Gigabyte RTX 3050 WINFORCE OC V2-6G', 'Mặc định', 'CMH-407-589830', 1, 4700000.00, 0.00, 4700000.00, '2026-01-16 04:28:26'),
(188, 157, 611, 'Card màn hình Gigabyte RTX 3050 WINFORCE OC V2-6G', 'Mặc định', 'CMH-407-589830', 1, 4700000.00, 0.00, 4700000.00, '2026-01-16 04:31:18');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `payments`
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
-- Đang đổ dữ liệu cho bảng `payments`
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
(91, 134, 'installment', 'pending', 6980000.00, 'TXN1767113194149313', NULL, NULL, NULL, '2025-12-30 16:46:34', '2025-12-30 16:46:34'),
(92, 135, 'installment', 'pending', 3400000.00, 'TXN1767554760007914', NULL, NULL, NULL, '2026-01-04 19:26:00', '2026-01-04 19:26:00'),
(93, 136, 'cod', 'paid', 4700000.00, 'TXN1768110477181120', NULL, NULL, '2026-01-11 05:47:57', '2026-01-11 05:47:57', '2026-01-11 05:47:57'),
(94, 137, 'cod', 'paid', 770000.00, 'TXN1768111598725358', NULL, NULL, '2026-01-11 06:06:38', '2026-01-11 06:06:38', '2026-01-11 06:06:38'),
(98, 138, '', 'paid', 4750000.00, 'VNPAY_1768126791723', 'vnpay', NULL, '2026-01-11 10:21:20', '2026-01-11 10:21:20', '2026-01-11 10:21:20'),
(99, 139, 'cod', 'paid', 4750000.00, 'TXN1768137722079487', NULL, NULL, '2026-01-11 13:22:02', '2026-01-11 13:22:02', '2026-01-11 13:22:02'),
(100, 140, 'installment', 'pending', 2100000.00, 'TXN1768137829065642', NULL, NULL, NULL, '2026-01-11 13:23:49', '2026-01-11 13:23:49'),
(101, 141, 'cod', 'paid', 4700000.00, 'TXN1768140472985758', NULL, NULL, '2026-01-11 14:07:52', '2026-01-11 14:07:52', '2026-01-11 14:07:52'),
(102, 142, 'cod', 'paid', 9150000.00, 'TXN176814122519771', NULL, NULL, '2026-01-11 14:20:25', '2026-01-11 14:20:25', '2026-01-11 14:20:25'),
(104, 143, '', 'paid', 2150000.00, 'VNPAY_1768533376231', 'vnpay', NULL, '2026-01-16 03:17:12', '2026-01-16 03:17:12', '2026-01-16 03:17:12'),
(106, 144, '', 'paid', 850000.00, 'VNPAY_1768533757658', 'vnpay', NULL, '2026-01-16 03:23:00', '2026-01-16 03:23:00', '2026-01-16 03:23:00'),
(108, 145, '', 'paid', 5150000.00, 'VNPAY_1768533845667', 'vnpay', NULL, '2026-01-16 03:24:24', '2026-01-16 03:24:24', '2026-01-16 03:24:24'),
(110, 146, '', 'paid', 2150000.00, 'VNPAY_1768534236524', 'vnpay', NULL, '2026-01-16 03:30:59', '2026-01-16 03:30:59', '2026-01-16 03:30:59'),
(112, 147, '', 'paid', 4750000.00, 'VNPAY_1768534395001', 'vnpay', NULL, '2026-01-16 03:33:33', '2026-01-16 03:33:33', '2026-01-16 03:33:33'),
(114, 148, '', 'paid', 5150000.00, 'VNPAY_1768535494236', 'vnpay', NULL, '2026-01-16 03:51:57', '2026-01-16 03:51:57', '2026-01-16 03:51:57'),
(115, 149, 'cod', 'paid', 5150000.00, 'TXN1768535777387642', NULL, NULL, '2026-01-16 03:56:17', '2026-01-16 03:56:17', '2026-01-16 03:56:17'),
(116, 150, 'cod', 'pending', 2050000.00, 'TXN1768536337197980', NULL, NULL, NULL, '2026-01-16 04:05:37', '2026-01-16 04:05:37'),
(117, 151, 'cod', 'pending', 4700000.00, 'TXN1768536477693213', NULL, NULL, NULL, '2026-01-16 04:07:57', '2026-01-16 04:07:57'),
(118, 152, 'cod', 'paid', 60000.00, 'TXN1768536815530858', NULL, NULL, '2026-01-16 04:14:49', '2026-01-16 04:13:35', '2026-01-16 04:14:49'),
(119, 153, 'cod', 'paid', 9150000.00, 'TXN1768536978313308', NULL, NULL, '2026-01-16 04:17:39', '2026-01-16 04:16:18', '2026-01-16 04:17:39'),
(121, 154, '', 'paid', 4750000.00, 'VNPAY_1768537123097', 'vnpay', NULL, '2026-01-16 04:19:03', '2026-01-16 04:19:03', '2026-01-16 04:19:03'),
(122, 155, 'cod', 'pending', 9150000.00, 'TXN1768537506099299', NULL, NULL, NULL, '2026-01-16 04:25:06', '2026-01-16 04:25:06'),
(124, 156, '', 'paid', 4750000.00, 'VNPAY_1768537683288', 'vnpay', NULL, '2026-01-16 04:28:26', '2026-01-16 04:28:26', '2026-01-16 04:28:26'),
(125, 157, 'installment', 'pending', 4700000.00, 'TXN1768537878142196', NULL, NULL, NULL, '2026-01-16 04:31:18', '2026-01-16 04:31:18');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `products`
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
-- Đang đổ dữ liệu cho bảng `products`
--

INSERT INTO `products` (`product_id`, `category_id`, `product_name`, `slug`, `description`, `base_price`, `is_active`, `is_featured`, `view_count`, `rating_average`, `review_count`, `created_at`, `updated_at`, `img_path`) VALUES
(395, 13, 'Seagate 500GB', 'seagate-500gb', 'Mô tả Seagate 500GB', 0.00, 0, 1, 0, 0.00, 0, '2026-01-04 16:36:19', '2026-01-04 19:12:01', NULL),
(396, 1, 'AMD Ryzen 5 5700X3D', 'amd-ryzen-5-5700x3d', 'Mắc quá đi', 4700000.00, 1, 1, 6, 0.00, 0, '2026-01-04 16:43:50', '2026-01-11 06:44:08', NULL),
(397, 1, 'CPU Intel Core i5-12400F (Up to 4.4Ghz, 6 Nhân 12 Luồng, 18MB Cache, Socket Intel LGA 1700)', 'cpu-intel-core-i5-12400f-up-to-44ghz-6-nhan-12-luong-18mb-cache-socket-intel-lga-1700', 'CPU Intel Core i5-12400F - CPU thuộc thế hệ thứ 12 (Alder Lake) thiết kế tối ưu cho các game thủ và những người sáng tạo nội dung bán chuyên.', 2900000.00, 1, 1, 0, 0.00, 0, '2026-01-04 17:15:45', '2026-01-04 17:15:45', NULL),
(398, 1, 'CPU Intel Core i5-12400 (Upto 4.4Ghz, 6 nhân 12 luồng, 18MB Cache, 65W) - Socket Intel LGA 1700)', 'cpu-intel-core-i5-12400-upto-44ghz-6-nhan-12-luong-18mb-cache-65w-socket-intel-lga-1700', 'CPU Intel Core i5-12400 là bước nhảy vọt của Intel ở thế hệ thứ 12, mang trong mình sức mạnh bền bỉ, sẵn sàng cùng bạn chinh chiến mọi tựa game AAA hay xử lý chồng chất những deadline đồ họa phức tạp', 4400000.00, 1, 0, 0, 0.00, 0, '2026-01-04 17:25:43', '2026-01-04 17:25:43', NULL),
(399, 1, 'CPU Intel Core i5-13400 (up to 4.6Ghz, 10 nhân 16 luồng, 20MB Cache, 65W) - Socket Intel LGA 1700/Raptor Lake) ', 'cpu-intel-core-i5-13400-up-to-46ghz-10-nhan-16-luong-20mb-cache-65w-socket-intel-lga-1700raptor-lake', 'CPU Intel Core i5-13400 - Bộ vi xử lý không quá cao cấp để gây lãng phí, nhưng cũng không hề yếu để phải đắn đo khi làm việc nặng hay chơi game.', 5100000.00, 1, 0, 0, 0.00, 0, '2026-01-04 17:34:58', '2026-01-04 17:34:58', NULL),
(400, 13, 'Ổ Cứng HDD SEAGATE Barracuda 4TB 3.5 inch 5400RPM, SATA III, 256MB Cache', 'o-cung-hdd-seagate-barracuda-4tb-35-inch-5400rpm-sata-iii-256mb-cache-st4000dm004', 'Ổ cứng truyền thống HDD với ưu thế là độ bền và dung lượng cao vẫn là một phần không thể thiếu được trong một chiếc máy tính. Đặc biệt là trong thời đại công nghệ hiện nay.', 3600000.00, 1, 1, 6, 0.00, 0, '2026-01-04 17:41:50', '2026-01-10 15:05:19', NULL),
(401, 13, 'Ổ Cứng HDD SEAGATE IronWolf 10TB 3.5 inch, 7200RPM ,SATA III3, 256MB Cache', 'o-cung-hdd-seagate-ironwolf-10tb-35-inch-7200rpm-sata-iii3-256mb-cache', 'Ổ cứng Seagate IronWolf 10TB — lưu trữ dữ liệu lớn, chạy ổn định, phù hợp cho PC, NAS, server nhỏ. Tốc độ quay cao và bộ nhớ đệm lớn giúp truy xuất dữ liệu nhanh, đáng tin cậy cho công việc và giải trí.', 10300000.00, 1, 0, 2, 0.00, 0, '2026-01-04 17:48:16', '2026-01-04 19:17:04', NULL),
(402, 13, 'Ổ Cứng HDD Toshiba P300 4TB 3.5 inch, 5400RPM, SATA III, 128MB Cache', 'o-cung-hdd-toshiba-p300-4tb-35-inch-5400rpm-sata-iii-128mb-cache', 'Thiết kế này giúp cho tốc độ đọc và ghi chính xác hơn, nhanh hơn và truy cập nhanh vào dữ liệu của bạn.', 3400000.00, 1, 0, 2, 0.00, 0, '2026-01-04 17:51:09', '2026-01-04 19:17:10', NULL),
(403, 35, 'RAM Desktop Kingston Fury Beast 16GB (1x16GB) DDR4 3200MHz', 'ram-desktop-kingston-fury-beast-16gb-1x16gb-ddr4-3200mhz', 'Ram Desktop Kingston Fury là dòng Ram phổ thông nhắm đến hiệu năng/ giá bán được nhiều khách hàng tin dùng. Phiên bản Kingston Fury mới được thay đổi nhẹ về thiết kế để bắt mắt hơn.', 3100000.00, 1, 1, 0, 0.00, 0, '2026-01-04 17:56:56', '2026-01-04 17:56:56', NULL),
(404, 35, 'RAM Desktop Kingston Fury Beast 16GB (1x16GB) DDR5 5600MHz', 'ram-desktop-kingston-fury-beast-16gb-1x16gb-ddr5-5600mhz', 'Ram Desktop Kingston Fury Beast là dòng RAM hiệu năng cao của Kingston trên nền tảng DDR5 mới nhất cho tốc độ cực nhanh. ', 5300000.00, 1, 0, 0, 0.00, 0, '2026-01-04 18:01:00', '2026-01-04 18:01:00', NULL),
(405, 35, 'RAM Desktop Kingston Fury Beast RGB EXPO 32GB (1x32GB) DDR5 6000MHz', 'ram-desktop-kingston-fury-beast-rgb-expo-32gb-1x32gb-ddr5-6000mhz', 'RAM và kit RAM DDR5 của Kingston FURY có tích hợp AMD EXPO (Công nghệ Extended Profiles của AMD để ép xung) được tự xác nhận trên bo mạch chủ AM5', 11000000.00, 1, 0, 0, 0.00, 0, '2026-01-04 18:06:06', '2026-01-04 18:06:06', NULL),
(406, 2, 'Card màn hình Asus DUAL-RTX 3050-6G', 'card-man-hinh-asus-dual-rtx-3050-6g', 'ASUS Dual RTX 3050 6GB GDDR6 là một sản phẩm đáng chú ý trong phân khúc card đồ họa tầm trung, có khả năng xử lý đồ họa 3D mượt mà, hỗ trợ công nghệ ray tracing và DLSS.', 4650000.00, 1, 0, 0, 0.00, 0, '2026-01-04 18:12:25', '2026-01-04 18:12:25', NULL),
(407, 2, 'Card màn hình Gigabyte RTX 3050 WINFORCE OC V2-6G', 'card-man-hinh-gigabyte-rtx-3050-winforce-oc-v2-6g', 'Card màn hình Gigabyte GeForce RTX 3050 WINDFORCE OC 6G được thiết kế với phong cách tối giản, phù hợp với mọi cấu hình máy tính.', 4700000.00, 1, 0, 6, 0.00, 0, '2026-01-04 18:16:29', '2026-01-10 15:23:04', NULL),
(408, 2, 'Card màn hình MSI RTX 5060 8G VENTUS 2X OC GDDR7', 'card-man-hinh-msi-rtx-5060-8g-ventus-2x-oc-gddr7', 'MSI RTX 5060 8G VENTUS 2X OC là card đồ họa tầm trung mới nhất từ NVIDIA RTX 50-series, trang bị 8GB VRAM GDDR7 cho hiệu năng mạnh mẽ, đặc biệt trong chơi game, đồ họa và làm việc sáng tạo.', 9100000.00, 1, 0, 4, 0.00, 0, '2026-01-04 18:22:03', '2026-01-10 15:36:42', NULL),
(409, 4, 'Ổ Cứng SSD Samsung 980 500GB – M.2 2280 PCIe Gen3 x4 (Đọc 3100MB/s - Ghi 2600MB/s)', 'o-cung-ssd-samsung-980-500gb-m2-2280-pcie-gen3-x4-doc-3100mbs-ghi-2600mbs', 'Ổ cứng SSD Samsung 980 là dòng sản phẩm SSD M.2 NVME PCIe Gen 3 mới nhất của Samsung. Đây là dòng ổ cứng hàng đầu thích hợp cho nhu cầu lưu trữ tốc độ cao: edit ảnh, video, chơi games,..', 3000000.00, 1, 0, 0, 0.00, 0, '2026-01-04 18:29:18', '2026-01-04 18:29:18', NULL),
(410, 4, 'Ổ Cứng SSD CORSAIR MP600 CORE XT 1TB – M.2 2280 PCIe Gen4 x4 (Đọc 5900MB/s - Ghi 5000MB/s)', 'o-cung-ssd-corsair-mp600-core-xt-1tb-m2-2280-pcie-gen4-x4-doc-5900mbs-ghi-5000mbs', 'Ổ cứng SSD Corsair MP600 CORE XT là một sản phẩm cao cấp của thương hiệu nổi tiếng CORSAIR. Với dung lượng lưu trữ 1TB, giao diện NVMe PCIe Gen4 x4 và kích thước M.2 2280, ổ cứng này hứa hẹn mang đến hiệu năng và tốc độ đáng chú ý cho người dùng.', 3800000.00, 1, 0, 0, 0.00, 0, '2026-01-04 18:32:28', '2026-01-04 18:32:28', NULL),
(411, 4, 'Ổ Cứng SSD Gigabyte 4000E 1TB – M.2 2280 PCIe Gen4 x4 (Đọc 4000MB/s - Ghi 3900MB/s)', 'o-cung-ssd-gigabyte-4000e-1tb-m2-2280-pcie-gen4-x4-doc-4000mbs-ghi-3900mbs', 'Ổ cứng SSD Gigabyte 4000E là một bước đột phá trong công nghệ lưu trữ, mang đến hiệu năng vượt trội với giao diện PCIe 4.0 x4 và chuẩn NVMe 1.4. Với thiết kế M.2 2280 nhỏ gọn.', 3500000.00, 1, 0, 0, 0.00, 0, '2026-01-04 18:46:00', '2026-01-04 18:46:00', NULL),
(412, 5, 'Mainboard ASUS TUF GAMING Z790 PLUS WIFI DDR5', 'mainboard-asus-tuf-gaming-z790-plus-wifi-ddr5', 'Mainboard Asus TUF Gaming Z790 PLUS Wifi DDR5 là một bo mạch chủ có tất cả các yếu tố thiết yếu của bộ xử lý Intel® mới nhất và kết hợp chúng với các tính năng sẵn sàng cho nhu cầu gaming.', 7000000.00, 1, 0, 0, 0.00, 0, '2026-01-04 18:49:52', '2026-01-04 18:49:52', NULL),
(413, 5, 'Mainboard MSI PRO B760M-E DDR4', 'mainboard-msi-pro-b760m-e-ddr4', 'Tốc độ truyền tải dữ liệu nhanh hơn: Rút ngắn thời gian truyền tải giữa RAM, CPU và các thành phần khác, giúp thiết bị của bạn hoạt động nhanh nhạy hơn.', 2300000.00, 1, 0, 0, 0.00, 0, '2026-01-04 18:55:07', '2026-01-04 18:55:07', NULL),
(414, 5, 'Mainboard Gigabyte Z890M AORUS ELITE WIFI7', 'mainboard-gigabyte-z890m-aorus-elite-wifi7', 'Mainboard Gigabyte Z890M AORUS ELITE WIFI7 là bo mạch chủ Micro-ATX DDR5 cao cấp dành cho CPU Intel Core Ultra (Socket LGA1851), phù hợp cho PC gaming & làm việc hiệu năng cao.', 6100000.00, 1, 0, 0, 0.00, 0, '2026-01-04 19:01:46', '2026-01-04 19:01:46', NULL),
(416, 1, 'Intel Core I3 13100F ', 'intel-core-i3-13100f', NULL, 2100000.00, 1, 1, 20, 0.00, 0, '2026-01-10 14:25:14', '2026-01-16 02:58:31', NULL),
(417, 35, 'Corsair DDR4 Buss 3200MHZ', 'corsair-ddr4-buss-3200mhz', NULL, 0.00, 1, 1, 22, 0.00, 0, '2026-01-10 14:29:16', '2026-01-11 05:08:59', NULL),
(418, 13, 'aaadd', 'aaadd', 'fewsfge', 3000000.00, 1, 0, 0, 0.00, 0, '2026-01-11 06:50:10', '2026-01-11 06:52:54', NULL),
(419, 13, 'aaabb', 'aaabb', NULL, 100000.00, 0, 0, 0, 0.00, 0, '2026-01-11 06:59:32', '2026-01-16 03:09:47', NULL),
(422, 13, 'asaa', 'asaa', 'a', 1.00, 1, 0, 0, 0.00, 0, '2026-01-11 07:04:40', '2026-01-11 07:14:09', NULL),
(423, 13, 'bcaab', 'bcaab', 'bcaa', 0.00, 1, 0, 0, 0.00, 0, '2026-01-11 07:13:14', '2026-01-11 13:31:43', NULL),
(431, 58, 'eeaa', 'eeaa', NULL, 100000.00, 0, 0, 0, 0.00, 0, '2026-01-16 03:15:05', '2026-01-16 03:15:14', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `products_attribute_values`
--

CREATE TABLE `products_attribute_values` (
  `product_id` int(11) NOT NULL,
  `attribute_value_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `products_attribute_values`
--

INSERT INTO `products_attribute_values` (`product_id`, `attribute_value_id`) VALUES
(395, 18),
(395, 137),
(396, 2),
(396, 39),
(396, 46),
(396, 54),
(397, 1),
(397, 36),
(397, 44),
(397, 49),
(398, 1),
(398, 36),
(398, 44),
(398, 49),
(399, 1),
(399, 36),
(399, 44),
(399, 50),
(400, 18),
(400, 75),
(400, 137),
(401, 18),
(401, 78),
(401, 138),
(402, 19),
(402, 75),
(402, 137),
(403, 15),
(403, 80),
(403, 139),
(403, 141),
(404, 15),
(404, 80),
(404, 140),
(404, 144),
(405, 15),
(405, 82),
(405, 140),
(405, 143),
(406, 3),
(406, 57),
(406, 61),
(406, 66),
(407, 5),
(407, 57),
(407, 61),
(407, 66),
(408, 6),
(408, 57),
(408, 63),
(408, 67),
(409, 13),
(409, 72),
(409, 86),
(409, 87),
(410, 11),
(410, 73),
(410, 86),
(410, 88),
(411, 5),
(411, 73),
(411, 86),
(411, 88),
(412, 1),
(412, 91),
(412, 100),
(412, 110),
(412, 113),
(413, 6),
(413, 91),
(413, 99),
(413, 109),
(413, 112),
(414, 5),
(414, 92),
(414, 102),
(414, 109),
(414, 113),
(416, 1),
(416, 35),
(416, 44),
(416, 50),
(417, 11),
(417, 139),
(417, 141),
(418, 18),
(418, 78),
(418, 137),
(419, 18),
(419, 73),
(419, 137),
(422, 18),
(422, 73),
(422, 137),
(423, 18),
(423, 137),
(431, 169),
(431, 172);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `product_variants`
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
  `warranty_period` int(11) DEFAULT NULL,
  `discount_percent` decimal(12,2) DEFAULT 0.00,
  `discount_start_date` datetime DEFAULT NULL,
  `discount_end_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `product_variants`
--

INSERT INTO `product_variants` (`variant_id`, `product_id`, `sku`, `variant_name`, `price`, `stock_quantity`, `is_active`, `is_default`, `created_at`, `updated_at`, `warranty_period`, `discount_percent`, `discount_start_date`, `discount_end_date`) VALUES
(597, 395, 'PRD-1T-1', '1TB', 700000.00, 3, 1, 1, '2026-01-04 16:36:19', '2026-01-04 16:36:19', 12, 0.00, NULL, NULL),
(598, 395, 'PRD-2T-2', '2TB', 700000.00, 3, 1, 0, '2026-01-04 16:36:19', '2026-01-04 16:36:19', 12, 0.00, NULL, NULL),
(599, 395, 'PRD-4T-3', '4TB', 700000.00, 3, 1, 0, '2026-01-04 16:36:19', '2026-01-04 16:36:19', 121, 0.00, NULL, NULL),
(600, 396, 'AR5-396-030666', 'Mặc định', 4700000.00, 0, 1, 1, '2026-01-04 16:43:50', '2026-01-16 03:33:33', 36, 0.00, NULL, NULL),
(601, 397, 'CIC-397-945039', 'Mặc định', 2900000.00, 3, 1, 1, '2026-01-04 17:15:45', '2026-01-04 17:15:45', 36, 0.00, NULL, NULL),
(602, 398, 'CIC-398-543739', 'Mặc định', 4400000.00, 3, 1, 1, '2026-01-04 17:25:43', '2026-01-04 17:25:43', 36, 0.00, NULL, NULL),
(603, 399, 'CIC-399-098537', 'Mặc định', 5100000.00, 0, 1, 1, '2026-01-04 17:34:58', '2026-01-16 03:56:17', 36, 0.00, NULL, NULL),
(604, 400, 'ỔCH-400-510127', 'Mặc định', 3600000.00, 3, 1, 1, '2026-01-04 17:41:50', '2026-01-04 17:41:50', 24, 0.00, NULL, NULL),
(605, 401, 'ỔCH-401-896349', 'Mặc định', 10300000.00, 3, 1, 1, '2026-01-04 17:48:16', '2026-01-04 17:48:16', 36, 0.00, NULL, NULL),
(606, 402, 'ỔCH-402-069368', 'Mặc định', 3400000.00, 2, 1, 1, '2026-01-04 17:51:09', '2026-01-04 19:26:00', 24, 0.00, NULL, NULL),
(607, 403, 'RDK-403-416369', 'Mặc định', 3100000.00, 3, 1, 1, '2026-01-04 17:56:56', '2026-01-04 17:56:56', 36, 0.00, NULL, NULL),
(608, 404, 'RDK-404-660059', 'Mặc định', 5300000.00, 3, 1, 1, '2026-01-04 18:01:00', '2026-01-04 18:01:00', 36, 0.00, NULL, NULL),
(609, 405, 'RDK-405-966067', 'Mặc định', 11000000.00, 3, 1, 1, '2026-01-04 18:06:06', '2026-01-04 18:06:06', 36, 0.00, NULL, NULL),
(610, 406, 'CMH-406-345662', 'Mặc định', 4650000.00, 0, 1, 1, '2026-01-04 18:12:25', '2026-01-16 04:07:57', 36, 0.00, NULL, NULL),
(611, 407, 'CMH-407-589830', 'Mặc định', 4700000.00, 0, 1, 1, '2026-01-04 18:16:29', '2026-01-16 04:31:18', 36, 0.00, NULL, NULL),
(612, 408, 'CMH-408-923104', 'Mặc định', 9100000.00, 0, 1, 1, '2026-01-04 18:22:03', '2026-01-16 04:25:06', 36, 0.00, NULL, NULL),
(613, 409, 'ỔCS-409-358366', 'Mặc định', 3000000.00, 3, 1, 1, '2026-01-04 18:29:18', '2026-01-04 18:29:18', 60, 0.00, NULL, NULL),
(614, 410, 'ỔCS-410-548425', 'Mặc định', 3800000.00, 3, 1, 1, '2026-01-04 18:32:28', '2026-01-04 18:32:28', 60, 0.00, NULL, NULL),
(615, 411, 'ỔCS-411-360417', 'Mặc định', 3500000.00, 3, 1, 1, '2026-01-04 18:46:00', '2026-01-04 18:46:00', 36, 0.00, NULL, NULL),
(616, 412, 'MAT-412-592586', 'Mặc định', 7000000.00, 3, 1, 1, '2026-01-04 18:49:52', '2026-01-04 18:49:52', 36, 0.00, NULL, NULL),
(617, 413, 'MMP-413-907513', 'Mặc định', 2300000.00, 3, 1, 1, '2026-01-04 18:55:07', '2026-01-04 18:55:07', 36, 0.00, NULL, NULL),
(618, 414, 'MGZ-414-306460', 'Mặc định', 6100000.00, 3, 1, 1, '2026-01-04 19:01:46', '2026-01-04 19:01:46', 36, 0.00, NULL, NULL),
(619, 416, 'ICI-416-114599', 'Mặc định', 2100000.00, 0, 1, 1, '2026-01-10 14:25:14', '2026-01-16 03:30:59', 36, 20.00, '2026-01-10 00:00:00', '2026-01-20 00:00:00'),
(620, 417, 'PRD-16-1', '16GB (1 X 16GB)', 800000.00, 0, 1, 1, '2026-01-10 14:29:16', '2026-01-16 03:23:00', 36, 10.00, '2026-01-10 00:00:00', '2026-01-20 00:00:00'),
(621, 417, 'PRD-16-2', '16GB (2 X 8GB)', 1000000.00, 2, 1, 0, '2026-01-10 14:29:16', '2026-01-10 14:29:16', 36, 20.00, '2026-01-10 00:00:00', '2026-01-30 00:00:00'),
(622, 418, 'A-418-210418', 'Mặc định', 2000000.00, 2, 1, 1, '2026-01-11 06:50:10', '2026-01-16 04:05:37', 36, 10.00, '2026-01-11 00:00:00', '2026-01-22 00:00:00'),
(623, 419, 'A-419-772342', 'Mặc định', 100000.00, 1, 1, 1, '2026-01-11 06:59:32', '2026-01-11 06:59:32', 24, 20.00, '2026-01-04 00:00:00', '2026-01-27 00:00:00'),
(624, 422, 'A-422-080361', 'Mặc định', 1.00, 1, 1, 1, '2026-01-11 07:04:40', '2026-01-11 07:04:40', 1, 9.99, '2026-01-11 00:00:00', '2026-01-27 00:00:00'),
(625, 423, 'PRD-10-1', '10TB', 10000.00, 0, 1, 1, '2026-01-11 07:13:14', '2026-01-16 04:13:35', 12, 10.00, '2026-01-11 00:00:00', '2026-01-13 00:00:00'),
(626, 423, 'PRD-1T-2', '1TB', 20000.00, 1, 1, 0, '2026-01-11 07:13:14', '2026-01-11 07:13:14', 24, 20.00, '2026-01-11 00:00:00', '2026-01-13 00:00:00'),
(627, 431, 'E-431-305882', 'Mặc định', 100000.00, 1, 1, 1, '2026-01-16 03:15:05', '2026-01-16 03:15:05', 1, 1.00, '2026-01-16 00:00:00', '2026-01-20 00:00:00');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `service_requests`
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

--
-- Đang đổ dữ liệu cho bảng `service_requests`
--

INSERT INTO `service_requests` (`service_request_id`, `user_id`, `warranty_id`, `serial_id`, `customer_name`, `customer_phone`, `request_type`, `status`, `subject`, `description`, `images`, `priority`, `rejection_reason`, `resolution`, `progress_notes`, `created_at`, `updated_at`, `resolved_at`) VALUES
(10, 31, 8, 1245, NULL, NULL, 'warranty', 'cancelled', 'Test loi', 'loi', '[\"/uploads/warranty/Screenshot2025-06-10094630-1768140244072-559199734.png\",\"/uploads/warranty/Screenshot2025-06-10094746-1768140244072-95507613.png\"]', 'medium', 'Khách hàng hủy', NULL, NULL, '2026-01-11 14:04:04', '2026-01-11 14:04:54', NULL),
(11, 31, 8, 1245, NULL, NULL, 'warranty', 'cancelled', 'LOI1', 'loi1', '[\"/uploads/warranty/pendrive-1768140365555-734316847.jpg\"]', 'medium', 'do nguoi dung', NULL, '[{\"timestamp\": \"2026-01-11 21:19:05\", \"note\": \"Kiểm tra: Lỗi thực tế: do bi roi. do bi roi\", \"type\": \"inspection\"}]', '2026-01-11 14:06:05', '2026-01-11 14:19:25', NULL),
(12, 31, 9, 1275, NULL, NULL, 'warranty', 'completed', 'test', 'tesy', '[\"/uploads/warranty/combo_2-1768140507940-113903850.jpg\"]', 'medium', NULL, 'aaa', '[{\"timestamp\":\"2026-01-11 21:12:51\",\"note\":\"Kiểm tra: Lỗi thực tế: Loi that. bi hong\",\"type\":\"inspection\"},{\"timestamp\":\"2026-01-11T14:15:10.832Z\",\"note\":\"Cập nhật trạng thái: completed - aaa\",\"type\":\"status_update\"}]', '2026-01-11 14:08:27', '2026-01-11 14:15:10', '2026-01-11 14:15:10'),
(13, 31, 9, 1275, NULL, NULL, 'warranty', 'warranty_rejected', 'aaa', 'aaaa', '[]', 'medium', 'aaaa', NULL, '[{\"timestamp\": \"2026-01-11 21:21:32\", \"note\": \"Kiểm tra: Lỗi thực tế: aaa. aaa\", \"type\": \"inspection\"}]', '2026-01-11 14:21:07', '2026-01-11 14:21:32', NULL),
(14, 31, 10, 1280, NULL, NULL, 'warranty', 'cancelled', 'bbb', 'bbbb', '[]', 'medium', NULL, NULL, '[{\"timestamp\":\"2026-01-11 21:23:40\",\"note\":\"Kiểm tra: Lỗi thực tế: bbbb. bbbbb\",\"type\":\"inspection\"},{\"timestamp\":\"2026-01-11T14:24:19.154Z\",\"note\":\"Cập nhật trạng thái: cancelled - do nguoi dung\",\"type\":\"status_update\"}]', '2026-01-11 14:23:23', '2026-01-11 14:24:19', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
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
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`user_id`, `username`, `email`, `password_hash`, `full_name`, `phone`, `role`, `is_active`, `created_at`, `updated_at`, `last_login`, `session_token`, `admin_session_token`, `user_session_token`, `admin_refresh_token`, `user_refresh_token`) VALUES
(6, 'admin', 'admin@gmail.com', '$2b$10$84e9xqnTc50CPaf5pOldT.Ob9zW9/RVK.G3Whr.TdAncfRdE.UivG', 'admin', '0123456788', 2, 1, '2025-11-05 09:33:52', '2026-01-16 04:13:55', NULL, NULL, NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYsInVzZXJuYW1lIjoiYWRtaW4iLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsInJvbGUiOjIsInNlc3Npb25UeXBlIjoiYWRtaW4iLCJpYXQiOjE3Njg1MzY4MzUsImV4cCI6MTc2OTE0MTYzNX0.y-tS3R-QkBcDvrJDxH9ES2sBwcT_eYstFLYF0jqwWf4', NULL),
(20, 'tranthib671', 'thib@gmail.com', '$2b$10$KQc2staSc5WX/9OIkHi3reX8XJO8L51YDjK.N5YP5XpPaghoLS.rK', 'Trần Thị B', '0908787671', 0, 1, '2025-11-24 12:44:44', '2026-01-11 11:34:37', NULL, NULL, NULL, NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIwLCJ1c2VybmFtZSI6InRyYW50aGliNjcxIiwiZW1haWwiOiJ0aGliQGdtYWlsLmNvbSIsInJvbGUiOjAsInNlc3Npb25UeXBlIjoidXNlciIsImlhdCI6MTc2ODEzMTI3NywiZXhwIjoxNzY4NzM2MDc3fQ.UUdj14AFsv4VCWP6r9tMi6keXrDdmFvwLTJI2hS2ZT4'),
(21, 'nguyenvana561', 'vana@gmail.com', '$2b$10$AUdU1V0dW6n0Eh1tJ1Nw6.vvvjGnlWOCVmHPXSMuuDCFolwPwXrLO', 'Nguyễn Văn A', '0908786561', 0, 1, '2025-11-24 14:41:59', '2025-12-17 12:58:48', NULL, NULL, NULL, NULL, NULL, NULL),
(23, 'demo776', 'duyanh0756@gmail.com', '$2b$10$zktOnaEqf4xAlpzcuLwnVuJoxqlh9L.NmN9QELfvohaYMDp6E3Vq2', 'Demo', '0908887776', 0, 1, '2025-12-18 05:08:23', '2025-12-30 13:54:53', NULL, NULL, NULL, NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIzLCJ1c2VybmFtZSI6ImRlbW83NzYiLCJlbWFpbCI6ImR1eWFuaDA3NTZAZ21haWwuY29tIiwicm9sZSI6MCwic2Vzc2lvblR5cGUiOiJ1c2VyIiwiaWF0IjoxNzY3MTAyODkzLCJleHAiOjE3Njc3MDc2OTN9.8IfB73hjTROn0Nb8dyHUEMipwjSOXj8rkpqGBpD43vM'),
(25, 'phamvanc881', 'vanc@gmail.com', '$2b$10$vvoggUuo3wInNzqPETBxNeoHvMOmnp6b3mMx/EBxAYhDs/d4PDqQK', 'Phạm Văn C', '0908988881', 0, 1, '2025-12-30 16:25:54', '2025-12-30 16:26:21', NULL, NULL, NULL, NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjI1LCJ1c2VybmFtZSI6InBoYW12YW5jODgxIiwiZW1haWwiOiJ2YW5jQGdtYWlsLmNvbSIsInJvbGUiOjAsInNlc3Npb25UeXBlIjoidXNlciIsImlhdCI6MTc2NzExMTk4MSwiZXhwIjoxNzY3NzE2NzgxfQ.-NWpuO47fwrariWU3BpAIVHbXnRMaqst-u7NGxdAZPI'),
(26, 'ton bao', 'tonbao@gmail.com', '$2b$10$clUElLIwABLIXz5WOC3LUuC2i5leJx18nWwZQr.X0Ndk9g5d0kKZu', NULL, NULL, 0, 1, '2026-01-11 03:26:59', '2026-01-11 03:27:30', NULL, NULL, NULL, NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjI2LCJ1c2VybmFtZSI6InRvbiBiYW8iLCJlbWFpbCI6InRvbmJhb0BnbWFpbC5jb20iLCJyb2xlIjowLCJzZXNzaW9uVHlwZSI6InVzZXIiLCJpYXQiOjE3NjgxMDIwNTAsImV4cCI6MTc2ODcwNjg1MH0._LiFgy0ZoVP_4oPSuJSN_y24ux-IMgG7Q1ArNo7qUug'),
(27, 'bao', 'tonbao1@gmail.com', '$2b$10$u/4n2MdNQQqm53IXfMbSlejGvN4Djr.oFeCiXjMH.IPIrdF/t7cNq', NULL, NULL, 0, 1, '2026-01-11 03:29:47', '2026-01-11 03:29:47', NULL, NULL, NULL, NULL, NULL, NULL),
(29, 'baone', 'baone@gmail.com', '$2b$10$474V8VqKenuPdaChAydWqOE0m1xWIs0n6uUNzF3MZertWb.LBgsfy', NULL, NULL, 0, 1, '2026-01-11 05:03:05', '2026-01-11 05:03:05', NULL, NULL, NULL, NULL, NULL, NULL),
(30, 'bar    ', 'bar@gmail.com', '$2b$10$5iYM40CaOoZ3ZIlELgOP6..CczyhFCzYvSkF6tjz8tK5bZ7ChAUEm', 'Nguyen Van A1', '0987654321a', 0, 1, '2026-01-11 05:04:28', '2026-01-16 03:30:13', NULL, NULL, NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMwLCJ1c2VybmFtZSI6ImJhciAgICAiLCJlbWFpbCI6ImJhckBnbWFpbC5jb20iLCJyb2xlIjoyLCJzZXNzaW9uVHlwZSI6ImFkbWluIiwiaWF0IjoxNzY4MTEyMzg3LCJleHAiOjE3Njg3MTcxODd9.mrF2g4EBMG_ydIBZ_YW3tJhYhDAVjMlkQ0n1PK1OP3s', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMwLCJ1c2VybmFtZSI6ImJhciAgICAiLCJlbWFpbCI6ImJhckBnbWFpbC5jb20iLCJyb2xlIjowLCJzZXNzaW9uVHlwZSI6InVzZXIiLCJpYXQiOjE3Njg1MzQyMTMsImV4cCI6MTc2OTEzOTAxM30.ol0wXErZF7UbDurySU_71Dc0tUMhBpWeO33jIeg1baA'),
(31, 'hdpe', 'hdpe@g.com', '$2b$10$bMSfFbu5ZWx4Fj.JvGrI7eybDUJkAxtD1hH/vb81glVDbB.X3L1ie', 'hdpe', '0976543232', 0, 1, '2026-01-11 13:16:59', '2026-01-11 14:29:34', NULL, NULL, NULL, NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMxLCJ1c2VybmFtZSI6ImhkcGUiLCJlbWFpbCI6ImhkcGVAZ21haWwuY29tIiwicm9sZSI6MCwic2Vzc2lvblR5cGUiOiJ1c2VyIiwiaWF0IjoxNzY4MTM3NDM1LCJleHAiOjE3Njg3NDIyMzV9.v9cdBfo2oSCBnTZAtfJITgdqXuBAiBoEAsCk8fxVKjE');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `variants_attribute_values`
--

CREATE TABLE `variants_attribute_values` (
  `variant_id` int(11) NOT NULL,
  `attribute_value_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `variants_attribute_values`
--

INSERT INTO `variants_attribute_values` (`variant_id`, `attribute_value_id`) VALUES
(597, 73),
(598, 74),
(599, 75),
(620, 80),
(621, 81),
(625, 78),
(626, 73);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `variant_images`
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
-- Đang đổ dữ liệu cho bảng `variant_images`
--

INSERT INTO `variant_images` (`image_id`, `variant_id`, `image_url`, `alt_text`, `is_primary`, `display_order`, `created_at`) VALUES
(208, 597, '/uploads/variants/597/404_NotFound-1767544579329-562454116.png', '404_NotFound.png', 1, 0, '2026-01-04 16:36:19'),
(209, 597, '/uploads/variants/597/sodo-3drawio-1767544579338-863246510.png', 'sodo-3.drawio.png', 0, 1, '2026-01-04 16:36:19'),
(210, 598, '/uploads/variants/598/539908954_1296739258525728_4856016180642058926_n-1767544579342-186848341.jpg', '539908954_1296739258525728_4856016180642058926_n.jpg', 1, 0, '2026-01-04 16:36:19'),
(211, 598, '/uploads/variants/598/538823422_1883415685541295_3107196389744307830_n-1767544579347-112302773.jpg', '538823422_1883415685541295_3107196389744307830_n.jpg', 0, 1, '2026-01-04 16:36:19'),
(212, 598, '/uploads/variants/598/540504350_3055364641308659_8758862866385136862_n-1767544579351-978647445.jpg', '540504350_3055364641308659_8758862866385136862_n.jpg', 0, 2, '2026-01-04 16:36:19'),
(213, 599, '/uploads/variants/599/538823422_1883415685541295_3107196389744307830_n-1767544579354-95020055.jpg', '538823422_1883415685541295_3107196389744307830_n.jpg', 1, 0, '2026-01-04 16:36:19'),
(214, 599, '/uploads/variants/599/540504350_3055364641308659_8758862866385136862_n-1767544579357-546754171.jpg', '540504350_3055364641308659_8758862866385136862_n.jpg', 0, 1, '2026-01-04 16:36:19'),
(215, 599, '/uploads/variants/599/download-1767544579361-171498981.jpg', 'download.jpg', 0, 2, '2026-01-04 16:36:19'),
(216, 600, '/uploads/variants/600/2-removebg-preview-1767545030674-147587756.png', '2-removebg-preview.png', 0, 0, '2026-01-04 16:43:50'),
(217, 600, '/uploads/variants/600/1-removebg-preview-1767545030678-83916012.png', '1-removebg-preview.png', 1, 1, '2026-01-04 16:43:50'),
(218, 600, '/uploads/variants/600/logo-icon-social-media-icon-youtube-icon-3zv4NcPn-1767545030684-862190476.jpg', 'logo-icon-social-media-icon-youtube-icon-3zv4NcPn.jpg', 0, 2, '2026-01-04 16:43:50'),
(219, 600, '/uploads/variants/600/Creeperping-1767545030687-260431831.png', 'Creeperping.png', 0, 3, '2026-01-04 16:43:50'),
(220, 601, '/uploads/variants/601/cpu_i5_12_1-1767546945058-801002314.jpg', 'cpu_i5_12_1.jpg', 1, 0, '2026-01-04 17:15:45'),
(221, 601, '/uploads/variants/601/cpu_i5_12_2-1767546945071-263861198.jpg', 'cpu_i5_12_2.jpg', 0, 1, '2026-01-04 17:15:45'),
(222, 602, '/uploads/variants/602/cpu_intel_core_i5_12400_a1-1767547543753-787995835.jpg', 'cpu_intel_core_i5_12400_a1.jpg', 1, 0, '2026-01-04 17:25:43'),
(223, 602, '/uploads/variants/602/cpu_intel_core_i5_12400_a2-1767547543762-867354182.jpg', 'cpu_intel_core_i5_12400_a2.jpg', 0, 1, '2026-01-04 17:25:43'),
(224, 603, '/uploads/variants/603/cpu_i5_13th_1-1767548098544-865561277.jpg', 'cpu_i5_13th_1.jpg', 1, 0, '2026-01-04 17:34:58'),
(225, 604, '/uploads/variants/604/25631_hdd_seagate_4tb_3_5_inch_5400rpm_1-1767548510135-692646192.jpg', '25631_hdd_seagate_4tb_3_5_inch_5400rpm_1.jpg', 1, 0, '2026-01-04 17:41:50'),
(226, 604, '/uploads/variants/604/25631_hdd_seagate_4tb_3_5_inch_5400rpm_2-1767548510139-401260058.jpg', '25631_hdd_seagate_4tb_3_5_inch_5400rpm_2.jpg', 0, 1, '2026-01-04 17:41:50'),
(227, 605, '/uploads/variants/605/65339_o_cung_hdd_seagate_ironwolf_10tb_3_5_inch_st10000vn000__1_-1767548896360-327066578.jpg', '65339_o_cung_hdd_seagate_ironwolf_10tb_3_5_inch_st10000vn000__1_.jpg', 1, 0, '2026-01-04 17:48:16'),
(228, 605, '/uploads/variants/605/65339_o_cung_hdd_seagate_ironwolf_10tb_3_5_inch_st10000vn000__2_-1767548896364-482842964.jpg', '65339_o_cung_hdd_seagate_ironwolf_10tb_3_5_inch_st10000vn000__2_.jpg', 0, 1, '2026-01-04 17:48:16'),
(229, 606, '/uploads/variants/606/hdd-toshiba-p300-4tb-35-inch-5400rpm-sata-iii-128mb-cache-hdto0162_1-1767549069376-801484721.jpg', 'hdd-toshiba-p300-4tb-35-inch-5400rpm-sata-iii-128mb-cache-hdto0162_1.jpg', 1, 0, '2026-01-04 17:51:09'),
(230, 607, '/uploads/variants/607/60334_ram_desktop_kingston_fury_kf432c16bb1_16_16gb_1x16gb_ddr4_3200mhz_1-1767549416375-365665346.jpg', '60334_ram_desktop_kingston_fury_kf432c16bb1_16_16gb_1x16gb_ddr4_3200mhz_1.jpg', 1, 0, '2026-01-04 17:56:56'),
(231, 607, '/uploads/variants/607/60334_ram_desktop_kingston_fury_kf432c16bb1_16_16gb_1x16gb_ddr4_3200mhz_2-1767549416379-684251169.jpg', '60334_ram_desktop_kingston_fury_kf432c16bb1_16_16gb_1x16gb_ddr4_3200mhz_2.jpg', 0, 1, '2026-01-04 17:56:56'),
(232, 608, '/uploads/variants/608/84295_ram_desktop_kingston_fury_beast_kf556c40bb_16_16gb_1x16gb_ddr5_5600mhz__1_-1767549660067-156149556.jpg', '84295_ram_desktop_kingston_fury_beast_kf556c40bb_16_16gb_1x16gb_ddr5_5600mhz__1_.jpg', 1, 0, '2026-01-04 18:01:00'),
(233, 608, '/uploads/variants/608/84295_ram_desktop_kingston_fury_beast_kf556c40bb_16_16gb_1x16gb_ddr5_5600mhz__2_-1767549660072-812650577.jpg', '84295_ram_desktop_kingston_fury_beast_kf556c40bb_16_16gb_1x16gb_ddr5_5600mhz__2_.jpg', 0, 1, '2026-01-04 18:01:00'),
(234, 609, '/uploads/variants/609/90735_ram_desktop_kingston_fury_beast_rgb_expo__1_-1767549966077-702041426.jpg', '90735_ram_desktop_kingston_fury_beast_rgb_expo__1_.jpg', 1, 0, '2026-01-04 18:06:06'),
(235, 609, '/uploads/variants/609/90735_ram_desktop_kingston_fury_beast_rgb_expo__2_-1767549966081-215098618.jpg', '90735_ram_desktop_kingston_fury_beast_rgb_expo__2_.jpg', 0, 1, '2026-01-04 18:06:06'),
(236, 610, '/uploads/variants/610/81690_card_man_hinh_asus_dual_rtx_3050_6g__1_-1767550345670-209281137.jpg', '81690_card_man_hinh_asus_dual_rtx_3050_6g__1_.jpg', 1, 0, '2026-01-04 18:12:25'),
(237, 610, '/uploads/variants/610/81690_card_man_hinh_asus_dual_rtx_3050_6g__2_-1767550345674-400199017.jpg', '81690_card_man_hinh_asus_dual_rtx_3050_6g__2_.jpg', 0, 1, '2026-01-04 18:12:25'),
(238, 611, '/uploads/variants/611/89678_card_man_hinh_gigabyte_rtx_3050_winforce_oc_v2_6g__1_-1767550589840-635656917.jpg', '89678_card_man_hinh_gigabyte_rtx_3050_winforce_oc_v2_6g__1_.jpg', 1, 0, '2026-01-04 18:16:29'),
(239, 611, '/uploads/variants/611/89678_card_man_hinh_gigabyte_rtx_3050_winforce_oc_v2_6g__2_-1767550589845-984107661.jpg', '89678_card_man_hinh_gigabyte_rtx_3050_winforce_oc_v2_6g__2_.jpg', 0, 1, '2026-01-04 18:16:29'),
(240, 612, '/uploads/variants/612/91286_card_man_hinh_msi_rtx_5060_8g_ventus_2x_oc_gddr7__1_-1767550923111-817361209.jpg', '91286_card_man_hinh_msi_rtx_5060_8g_ventus_2x_oc_gddr7__1_.jpg', 1, 0, '2026-01-04 18:22:03'),
(241, 612, '/uploads/variants/612/91286_card_man_hinh_msi_rtx_5060_8g_ventus_2x_oc_gddr7__2_-1767550923119-296507972.jpg', '91286_card_man_hinh_msi_rtx_5060_8g_ventus_2x_oc_gddr7__2_.jpg', 0, 1, '2026-01-04 18:22:03'),
(242, 613, '/uploads/variants/613/58888_o_cung_ssd_samsung_980_500gb_pcie_mz_v8v500bw_1-1767551358376-918226733.jpg', '58888_o_cung_ssd_samsung_980_500gb_pcie_mz_v8v500bw_1.jpg', 1, 0, '2026-01-04 18:29:18'),
(243, 613, '/uploads/variants/613/58888_o_cung_ssd_samsung_980_500gb_pcie_mz_v8v500bw_2-1767551358380-578496551.jpg', '58888_o_cung_ssd_samsung_980_500gb_pcie_mz_v8v500bw_2.jpg', 0, 1, '2026-01-04 18:29:18'),
(244, 614, '/uploads/variants/614/58888_o_cung_ssd_samsung_980_500gb_pcie_mz_v8v500bw_1-1767551548434-454817257.jpg', '58888_o_cung_ssd_samsung_980_500gb_pcie_mz_v8v500bw_1.jpg', 1, 0, '2026-01-04 18:32:28'),
(245, 614, '/uploads/variants/614/90727_o_cung_ssd_corsair_mp600_core_xt_1tb_nvme_m2_2280_pcie_gen_4__1_-1767551548439-660216579.webp', '90727_o_cung_ssd_corsair_mp600_core_xt_1tb_nvme_m2_2280_pcie_gen_4__1_.webp', 0, 1, '2026-01-04 18:32:28'),
(246, 615, '/uploads/variants/615/89931_o_cung_ssd_gigabyte_4000e_1tb_nvme_m__1-1767552360434-177807065.jpg', '89931_o_cung_ssd_gigabyte_4000e_1tb_nvme_m__1.jpg', 1, 0, '2026-01-04 18:46:00'),
(247, 615, '/uploads/variants/615/89931_o_cung_ssd_gigabyte_4000e_1tb_nvme_m__2-1767552360440-536376065.jpg', '89931_o_cung_ssd_gigabyte_4000e_1tb_nvme_m__2.jpg', 0, 1, '2026-01-04 18:46:00'),
(248, 616, '/uploads/variants/616/72955_mainboard_asus_tuf_gaming_z790_plus_wifi_ddr5__1_-1767552592594-43204714.jpg', '72955_mainboard_asus_tuf_gaming_z790_plus_wifi_ddr5__1_.jpg', 1, 0, '2026-01-04 18:49:52'),
(249, 616, '/uploads/variants/616/72955_mainboard_asus_tuf_gaming_z790_plus_wifi_ddr5__2_-1767552592599-685401830.jpg', '72955_mainboard_asus_tuf_gaming_z790_plus_wifi_ddr5__2_.jpg', 0, 1, '2026-01-04 18:49:52'),
(250, 617, '/uploads/variants/617/69777_mainboard_msi_pro_b760m_e_ddr4__1_-1767552907522-757953577.jpg', '69777_mainboard_msi_pro_b760m_e_ddr4__1_.jpg', 1, 0, '2026-01-04 18:55:07'),
(251, 617, '/uploads/variants/617/69777_mainboard_msi_pro_b760m_e_ddr4__2_-1767552907528-822228700.jpg', '69777_mainboard_msi_pro_b760m_e_ddr4__2_.jpg', 0, 1, '2026-01-04 18:55:07'),
(252, 618, '/uploads/variants/618/86832_mainboard_gigabyte_z890m_aorus_elite_wifi7___1-1767553306470-248206727.jpg', '86832_mainboard_gigabyte_z890m_aorus_elite_wifi7___1.jpg', 1, 0, '2026-01-04 19:01:46'),
(253, 618, '/uploads/variants/618/86832_mainboard_gigabyte_z890m_aorus_elite_wifi7___2-1767553306477-550629811.jpg', '86832_mainboard_gigabyte_z890m_aorus_elite_wifi7___2.jpg', 0, 1, '2026-01-04 19:01:46'),
(254, 619, '/uploads/variants/619/i3-1768055114632-761059257.webp', 'i3.webp', 1, 0, '2026-01-10 14:25:14'),
(255, 622, '/uploads/variants/622/Screenshot2025-05-09133306-1768114210433-958349634.png', 'Screenshot 2025-05-09 133306.png', 1, 0, '2026-01-11 06:50:10'),
(256, 622, '/uploads/variants/622/Screenshot2025-05-09133536-1768114210440-593890922.png', 'Screenshot 2025-05-09 133536.png', 0, 1, '2026-01-11 06:50:10'),
(257, 623, '/uploads/variants/623/pendrive-1768114772348-189221441.jpg', 'pendrive.jpg', 1, 0, '2026-01-11 06:59:32'),
(258, 624, '/uploads/variants/624/combo_1-1768115080368-323960422.jpg', 'combo_1.jpg', 0, 0, '2026-01-11 07:04:40'),
(259, 624, '/uploads/variants/624/pendrive-1768115277016-485292738.jpg', NULL, 0, 0, '2026-01-11 07:07:57'),
(260, 624, '/uploads/variants/624/pixel-1768115295476-344182785.jpg', NULL, 1, 0, '2026-01-11 07:08:15'),
(261, 625, '/uploads/variants/625/Screenshot2025-02-03095628-1768115594791-220129643.png', 'Screenshot 2025-02-03 095628.png', 1, 0, '2026-01-11 07:13:14'),
(262, 625, '/uploads/variants/625/Screenshot2025-02-14132701-1768115594797-585435810.png', 'Screenshot 2025-02-14 132701.png', 0, 1, '2026-01-11 07:13:14'),
(263, 626, '/uploads/variants/626/Screenshot2025-03-08195711-1768115594803-733410726.png', 'Screenshot 2025-03-08 195711.png', 1, 0, '2026-01-11 07:13:14'),
(264, 626, '/uploads/variants/626/Screenshot2025-03-09113055-1768115594806-150819663.png', 'Screenshot 2025-03-09 113055.png', 0, 1, '2026-01-11 07:13:14'),
(265, 627, '/uploads/variants/627/mysql-1768533305892-950673275.png', 'mysql.png', 1, 0, '2026-01-16 03:15:05');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `variant_serials`
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
-- Đang đổ dữ liệu cho bảng `variant_serials`
--

INSERT INTO `variant_serials` (`serial_id`, `variant_id`, `serial_number`, `status`, `order_item_id`, `warranty_id`, `created_at`, `updated_at`) VALUES
(1235, 597, 'SN59720260001', 'in_stock', NULL, NULL, '2026-01-04 16:36:19', '2026-01-04 16:36:19'),
(1236, 597, 'SN59720260002', 'in_stock', NULL, NULL, '2026-01-04 16:36:19', '2026-01-04 16:36:19'),
(1237, 597, 'SN59720260003', 'in_stock', NULL, NULL, '2026-01-04 16:36:19', '2026-01-04 16:36:19'),
(1238, 598, 'SN59820260001', 'in_stock', NULL, NULL, '2026-01-04 16:36:19', '2026-01-04 16:36:19'),
(1239, 598, 'SN59820260002', 'in_stock', NULL, NULL, '2026-01-04 16:36:19', '2026-01-04 16:36:19'),
(1240, 598, 'SN59820260003', 'in_stock', NULL, NULL, '2026-01-04 16:36:19', '2026-01-04 16:36:19'),
(1241, 599, 'SN59920260001', 'in_stock', NULL, NULL, '2026-01-04 16:36:19', '2026-01-04 16:36:19'),
(1242, 599, 'SN59920260002', 'in_stock', NULL, NULL, '2026-01-04 16:36:19', '2026-01-04 16:36:19'),
(1243, 599, 'SN59920260003', 'in_stock', NULL, NULL, '2026-01-04 16:36:19', '2026-01-04 16:36:19'),
(1244, 600, 'SN60020260001', 'reserved', 169, NULL, '2026-01-04 16:43:50', '2026-01-11 10:21:20'),
(1245, 600, 'SN60020260002', 'sold', 170, 8, '2026-01-04 16:43:50', '2026-01-11 14:03:18'),
(1246, 600, 'SN60020260003', 'reserved', 178, NULL, '2026-01-04 16:43:50', '2026-01-16 03:33:33'),
(1247, 601, 'SN60120260001', 'in_stock', NULL, NULL, '2026-01-04 17:15:45', '2026-01-04 17:15:45'),
(1248, 601, 'SN60120260002', 'in_stock', NULL, NULL, '2026-01-04 17:15:45', '2026-01-04 17:15:45'),
(1249, 601, 'SN60120260003', 'in_stock', NULL, NULL, '2026-01-04 17:15:45', '2026-01-04 17:15:45'),
(1250, 602, 'SN60220260001', 'in_stock', NULL, NULL, '2026-01-04 17:25:43', '2026-01-04 17:25:43'),
(1251, 602, 'SN60220260002', 'in_stock', NULL, NULL, '2026-01-04 17:25:43', '2026-01-04 17:25:43'),
(1252, 602, 'SN60220260003', 'in_stock', NULL, NULL, '2026-01-04 17:25:43', '2026-01-04 17:25:43'),
(1253, 603, 'SN60320260001', 'reserved', 176, NULL, '2026-01-04 17:34:58', '2026-01-16 03:24:24'),
(1254, 603, 'SN60320260002', 'reserved', 179, NULL, '2026-01-04 17:34:58', '2026-01-16 03:51:57'),
(1255, 603, 'SN60320260003', 'reserved', 180, NULL, '2026-01-04 17:34:58', '2026-01-16 03:56:17'),
(1256, 604, 'SN60420260001', 'in_stock', NULL, NULL, '2026-01-04 17:41:50', '2026-01-04 17:41:50'),
(1257, 604, 'SN60420260002', 'in_stock', NULL, NULL, '2026-01-04 17:41:50', '2026-01-04 17:41:50'),
(1258, 604, 'SN60420260003', 'in_stock', NULL, NULL, '2026-01-04 17:41:50', '2026-01-04 17:41:50'),
(1259, 605, 'SN60520260001', 'in_stock', NULL, NULL, '2026-01-04 17:48:16', '2026-01-04 17:48:16'),
(1260, 605, 'SN60520260002', 'in_stock', NULL, NULL, '2026-01-04 17:48:16', '2026-01-04 17:48:16'),
(1261, 605, 'SN60520260003', 'in_stock', NULL, NULL, '2026-01-04 17:48:16', '2026-01-04 17:48:16'),
(1262, 606, 'SN60620260001', 'sold', 166, 6, '2026-01-04 17:51:09', '2026-01-04 19:27:31'),
(1263, 606, 'SN60620260002', 'in_stock', NULL, NULL, '2026-01-04 17:51:09', '2026-01-04 17:51:09'),
(1264, 606, 'SN60620260003', 'in_stock', NULL, NULL, '2026-01-04 17:51:09', '2026-01-04 17:51:09'),
(1265, 607, 'SN60720260001', 'in_stock', NULL, NULL, '2026-01-04 17:56:56', '2026-01-04 17:56:56'),
(1266, 607, 'SN60720260002', 'in_stock', NULL, NULL, '2026-01-04 17:56:56', '2026-01-04 17:56:56'),
(1267, 607, 'SN60720260003', 'in_stock', NULL, NULL, '2026-01-04 17:56:56', '2026-01-04 17:56:56'),
(1268, 608, 'SN60820260001', 'in_stock', NULL, NULL, '2026-01-04 18:01:00', '2026-01-04 18:01:00'),
(1269, 608, 'SN60820260002', 'in_stock', NULL, NULL, '2026-01-04 18:01:00', '2026-01-04 18:01:00'),
(1270, 608, 'SN60820260003', 'in_stock', NULL, NULL, '2026-01-04 18:01:00', '2026-01-04 18:01:00'),
(1271, 609, 'SN60920260001', 'in_stock', NULL, NULL, '2026-01-04 18:06:06', '2026-01-04 18:06:06'),
(1272, 609, 'SN60920260002', 'in_stock', NULL, NULL, '2026-01-04 18:06:06', '2026-01-04 18:06:06'),
(1273, 609, 'SN60920260003', 'in_stock', NULL, NULL, '2026-01-04 18:06:06', '2026-01-04 18:06:06'),
(1274, 610, 'SN61020260001', 'reserved', 167, NULL, '2026-01-04 18:12:25', '2026-01-11 05:47:57'),
(1275, 610, 'SN61020260002', 'sold', 172, 9, '2026-01-04 18:12:25', '2026-01-11 14:08:03'),
(1276, 610, 'SN61020260003', 'sold', 182, 12, '2026-01-04 18:12:25', '2026-01-16 04:09:20'),
(1277, 611, 'SN61120260001', 'sold', 185, 15, '2026-01-04 18:16:29', '2026-01-16 04:21:08'),
(1278, 611, 'SN61120260002', 'sold', 187, 16, '2026-01-04 18:16:29', '2026-01-16 04:29:04'),
(1279, 611, 'SN61120260003', 'reserved', 188, NULL, '2026-01-04 18:16:29', '2026-01-16 04:31:18'),
(1280, 612, 'SN61220260001', 'sold', 173, 10, '2026-01-04 18:22:03', '2026-01-11 14:20:53'),
(1281, 612, 'SN61220260002', 'sold', 184, 14, '2026-01-04 18:22:03', '2026-01-16 04:17:39'),
(1282, 612, 'SN61220260003', 'reserved', 186, NULL, '2026-01-04 18:22:03', '2026-01-16 04:25:06'),
(1283, 613, 'SN61320260001', 'in_stock', NULL, NULL, '2026-01-04 18:29:18', '2026-01-04 18:29:18'),
(1284, 613, 'SN61320260002', 'in_stock', NULL, NULL, '2026-01-04 18:29:18', '2026-01-04 18:29:18'),
(1285, 613, 'SN61320260003', 'in_stock', NULL, NULL, '2026-01-04 18:29:18', '2026-01-04 18:29:18'),
(1286, 614, 'SN61420260001', 'in_stock', NULL, NULL, '2026-01-04 18:32:28', '2026-01-04 18:32:28'),
(1287, 614, 'SN61420260002', 'in_stock', NULL, NULL, '2026-01-04 18:32:28', '2026-01-04 18:32:28'),
(1288, 614, 'SN61420260003', 'in_stock', NULL, NULL, '2026-01-04 18:32:28', '2026-01-04 18:32:28'),
(1289, 615, 'SN61520260001', 'in_stock', NULL, NULL, '2026-01-04 18:46:00', '2026-01-04 18:46:00'),
(1290, 615, 'SN61520260002', 'in_stock', NULL, NULL, '2026-01-04 18:46:00', '2026-01-04 18:46:00'),
(1291, 615, 'SN61520260003', 'in_stock', NULL, NULL, '2026-01-04 18:46:00', '2026-01-04 18:46:00'),
(1292, 616, 'SN61620260001', 'in_stock', NULL, NULL, '2026-01-04 18:49:52', '2026-01-04 18:49:52'),
(1293, 616, 'SN61620260002', 'in_stock', NULL, NULL, '2026-01-04 18:49:52', '2026-01-04 18:49:52'),
(1294, 616, 'SN61620260003', 'in_stock', NULL, NULL, '2026-01-04 18:49:52', '2026-01-04 18:49:52'),
(1295, 617, 'SN61720260001', 'in_stock', NULL, NULL, '2026-01-04 18:55:07', '2026-01-04 18:55:07'),
(1296, 617, 'SN61720260002', 'in_stock', NULL, NULL, '2026-01-04 18:55:07', '2026-01-04 18:55:07'),
(1297, 617, 'SN61720260003', 'in_stock', NULL, NULL, '2026-01-04 18:55:07', '2026-01-04 18:55:07'),
(1298, 618, 'SN61820260001', 'in_stock', NULL, NULL, '2026-01-04 19:01:46', '2026-01-04 19:01:46'),
(1299, 618, 'SN61820260002', 'in_stock', NULL, NULL, '2026-01-04 19:01:46', '2026-01-04 19:01:46'),
(1300, 618, 'SN61820260003', 'in_stock', NULL, NULL, '2026-01-04 19:01:46', '2026-01-04 19:01:46'),
(1301, 619, 'SN61920260001', 'reserved', 171, NULL, '2026-01-10 14:25:14', '2026-01-11 13:23:49'),
(1302, 619, 'SN61920260002', 'reserved', 174, NULL, '2026-01-10 14:25:14', '2026-01-16 03:17:12'),
(1303, 619, 'SN61920260003', 'reserved', 177, NULL, '2026-01-10 14:25:14', '2026-01-16 03:30:59'),
(1304, 620, 'SN62020260001', 'sold', 168, 7, '2026-01-10 14:29:16', '2026-01-11 06:08:52'),
(1305, 620, 'SN62020260002', 'reserved', 175, NULL, '2026-01-10 14:29:16', '2026-01-16 03:23:00'),
(1306, 621, 'SN62120260001', 'in_stock', NULL, NULL, '2026-01-10 14:29:16', '2026-01-10 14:29:16'),
(1307, 621, 'SN62120260002', 'in_stock', NULL, NULL, '2026-01-10 14:29:16', '2026-01-10 14:29:16'),
(1308, 622, 'SN62220260001', 'sold', 181, 11, '2026-01-11 06:50:10', '2026-01-16 04:06:53'),
(1309, 622, 'SN62220260002', 'in_stock', NULL, NULL, '2026-01-11 06:50:10', '2026-01-11 06:50:10'),
(1310, 622, 'SN62220260003', 'in_stock', NULL, NULL, '2026-01-11 06:50:10', '2026-01-11 06:50:10'),
(1311, 623, 'SN62320260001', 'in_stock', NULL, NULL, '2026-01-11 06:59:32', '2026-01-11 06:59:32'),
(1312, 624, 'SN62420260001', 'in_stock', NULL, NULL, '2026-01-11 07:04:40', '2026-01-11 07:04:40'),
(1313, 625, 'SN62520260001', 'sold', 183, 13, '2026-01-11 07:13:14', '2026-01-16 04:14:49'),
(1314, 626, 'SN62620260001', 'in_stock', NULL, NULL, '2026-01-11 07:13:14', '2026-01-11 07:13:14'),
(1315, 627, 'SN62720260001', 'in_stock', NULL, NULL, '2026-01-16 03:15:05', '2026-01-16 03:15:05');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `warranties`
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
-- Đang đổ dữ liệu cho bảng `warranties`
--

INSERT INTO `warranties` (`warranty_id`, `serial_id`, `order_item_id`, `warranty_period`, `start_date`, `end_date`, `status`, `notes`, `created_at`, `updated_at`) VALUES
(6, 1262, 166, 24, '2026-01-05', '2028-01-05', 'active', NULL, '2026-01-04 19:27:31', '2026-01-04 19:27:31'),
(7, 1304, 168, 36, '2026-01-11', '2029-01-11', 'active', NULL, '2026-01-11 06:08:52', '2026-01-11 06:08:52'),
(8, 1245, 170, 36, '2026-01-11', '2029-01-11', 'active', NULL, '2026-01-11 14:03:18', '2026-01-11 14:03:18'),
(9, 1275, 172, 36, '2026-01-11', '2029-01-11', 'active', NULL, '2026-01-11 14:08:03', '2026-01-11 14:08:03'),
(10, 1280, 173, 36, '2026-01-11', '2029-01-11', 'active', NULL, '2026-01-11 14:20:53', '2026-01-11 14:20:53'),
(11, 1308, 181, 36, '2026-01-16', '2029-01-16', 'active', NULL, '2026-01-16 04:06:53', '2026-01-16 04:06:53'),
(12, 1276, 182, 36, '2026-01-16', '2029-01-16', 'active', NULL, '2026-01-16 04:09:20', '2026-01-16 04:09:20'),
(13, 1313, 183, 12, '2026-01-16', '2027-01-16', 'active', NULL, '2026-01-16 04:14:49', '2026-01-16 04:14:49'),
(14, 1281, 184, 36, '2026-01-16', '2029-01-16', 'active', NULL, '2026-01-16 04:17:39', '2026-01-16 04:17:39'),
(15, 1277, 185, 36, '2026-01-16', '2029-01-16', 'active', NULL, '2026-01-16 04:21:08', '2026-01-16 04:21:08'),
(16, 1278, 187, 36, '2026-01-16', '2029-01-16', 'active', NULL, '2026-01-16 04:29:04', '2026-01-16 04:29:04');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `addresses`
--
ALTER TABLE `addresses`
  ADD PRIMARY KEY (`address_id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_is_default` (`is_default`);

--
-- Chỉ mục cho bảng `attributes`
--
ALTER TABLE `attributes`
  ADD PRIMARY KEY (`attribute_id`);

--
-- Chỉ mục cho bảng `attributes_categories`
--
ALTER TABLE `attributes_categories`
  ADD PRIMARY KEY (`attribute_category_id`),
  ADD KEY `attribute_categories_ibfk_1` (`attribute_id`),
  ADD KEY `attribute_categories_ibfk_2` (`category_id`);

--
-- Chỉ mục cho bảng `attribute_values`
--
ALTER TABLE `attribute_values`
  ADD PRIMARY KEY (`attribute_value_id`),
  ADD UNIQUE KEY `unique_attribute_value` (`attribute_id`,`value_name`),
  ADD UNIQUE KEY `uk_attribute_value` (`attribute_id`,`value_name`),
  ADD KEY `idx_attribute_id` (`attribute_id`);

--
-- Chỉ mục cho bảng `builds`
--
ALTER TABLE `builds`
  ADD PRIMARY KEY (`build_id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_is_public` (`is_public`),
  ADD KEY `idx_created_at` (`created_at`);

--
-- Chỉ mục cho bảng `build_items`
--
ALTER TABLE `build_items`
  ADD PRIMARY KEY (`build_item_id`),
  ADD KEY `idx_build_id` (`build_id`),
  ADD KEY `idx_variant_id` (`variant_id`);

--
-- Chỉ mục cho bảng `carts`
--
ALTER TABLE `carts`
  ADD PRIMARY KEY (`cart_id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_session_id` (`session_id`);

--
-- Chỉ mục cho bảng `cart_items`
--
ALTER TABLE `cart_items`
  ADD PRIMARY KEY (`cart_item_id`),
  ADD UNIQUE KEY `uk_cart_variant` (`cart_id`,`variant_id`),
  ADD KEY `idx_cart_id` (`cart_id`),
  ADD KEY `idx_variant_id` (`variant_id`);

--
-- Chỉ mục cho bảng `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`category_id`),
  ADD KEY `idx_parent_category` (`parent_category_id`),
  ADD KEY `idx_is_active` (`is_active`);

--
-- Chỉ mục cho bảng `categories_attributes_values`
--
ALTER TABLE `categories_attributes_values`
  ADD PRIMARY KEY (`cav_id`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `attribute_id` (`attribute_id`),
  ADD KEY `attribute_value_id` (`attribute_value_id`);

--
-- Chỉ mục cho bảng `coupons`
--
ALTER TABLE `coupons`
  ADD PRIMARY KEY (`coupon_id`),
  ADD UNIQUE KEY `coupon_code` (`coupon_code`),
  ADD KEY `idx_coupon_code` (`coupon_code`),
  ADD KEY `idx_is_active` (`is_active`),
  ADD KEY `idx_valid_dates` (`valid_from`,`valid_until`);

--
-- Chỉ mục cho bảng `installments`
--
ALTER TABLE `installments`
  ADD PRIMARY KEY (`installment_id`),
  ADD KEY `fk_installment_order` (`order_id`),
  ADD KEY `idx_down_payment_status` (`down_payment_status`),
  ADD KEY `fk_installments_policy` (`policy_id`);

--
-- Chỉ mục cho bảng `installment_payments`
--
ALTER TABLE `installment_payments`
  ADD PRIMARY KEY (`payment_id`),
  ADD KEY `fk_payment_installment` (`installment_id`);

--
-- Chỉ mục cho bảng `installment_policies`
--
ALTER TABLE `installment_policies`
  ADD PRIMARY KEY (`policy_id`);

--
-- Chỉ mục cho bảng `orders`
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
-- Chỉ mục cho bảng `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`order_item_id`),
  ADD KEY `idx_order_id` (`order_id`),
  ADD KEY `idx_variant_id` (`variant_id`);

--
-- Chỉ mục cho bảng `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`payment_id`),
  ADD KEY `idx_order_id` (`order_id`),
  ADD KEY `idx_payment_status` (`payment_status`),
  ADD KEY `idx_transaction_id` (`transaction_id`);

--
-- Chỉ mục cho bảng `products`
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
-- Chỉ mục cho bảng `products_attribute_values`
--
ALTER TABLE `products_attribute_values`
  ADD PRIMARY KEY (`product_id`,`attribute_value_id`),
  ADD KEY `products_attribute_values_ibfk_2` (`attribute_value_id`);

--
-- Chỉ mục cho bảng `product_variants`
--
ALTER TABLE `product_variants`
  ADD PRIMARY KEY (`variant_id`),
  ADD UNIQUE KEY `sku` (`sku`),
  ADD KEY `idx_product_id` (`product_id`),
  ADD KEY `idx_sku` (`sku`),
  ADD KEY `idx_is_active` (`is_active`);

--
-- Chỉ mục cho bảng `service_requests`
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
-- Chỉ mục cho bảng `users`
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
-- Chỉ mục cho bảng `variants_attribute_values`
--
ALTER TABLE `variants_attribute_values`
  ADD PRIMARY KEY (`variant_id`,`attribute_value_id`),
  ADD KEY `idx_variant_id` (`variant_id`),
  ADD KEY `idx_attribute_value_id` (`attribute_value_id`);

--
-- Chỉ mục cho bảng `variant_images`
--
ALTER TABLE `variant_images`
  ADD PRIMARY KEY (`image_id`),
  ADD KEY `idx_variant_id` (`variant_id`),
  ADD KEY `idx_is_primary` (`is_primary`);

--
-- Chỉ mục cho bảng `variant_serials`
--
ALTER TABLE `variant_serials`
  ADD PRIMARY KEY (`serial_id`),
  ADD UNIQUE KEY `uk_variant_serial` (`variant_id`,`serial_number`),
  ADD KEY `idx_serial` (`serial_number`),
  ADD KEY `idx_variant_status` (`variant_id`,`status`),
  ADD KEY `idx_order_item` (`order_item_id`),
  ADD KEY `idx_warranty` (`warranty_id`);

--
-- Chỉ mục cho bảng `warranties`
--
ALTER TABLE `warranties`
  ADD PRIMARY KEY (`warranty_id`),
  ADD KEY `idx_order_item_id` (`order_item_id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_end_date` (`end_date`),
  ADD KEY `idx_serial_id` (`serial_id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `addresses`
--
ALTER TABLE `addresses`
  MODIFY `address_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=127;

--
-- AUTO_INCREMENT cho bảng `attributes`
--
ALTER TABLE `attributes`
  MODIFY `attribute_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT cho bảng `attributes_categories`
--
ALTER TABLE `attributes_categories`
  MODIFY `attribute_category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT cho bảng `attribute_values`
--
ALTER TABLE `attribute_values`
  MODIFY `attribute_value_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=173;

--
-- AUTO_INCREMENT cho bảng `builds`
--
ALTER TABLE `builds`
  MODIFY `build_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `build_items`
--
ALTER TABLE `build_items`
  MODIFY `build_item_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `carts`
--
ALTER TABLE `carts`
  MODIFY `cart_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT cho bảng `cart_items`
--
ALTER TABLE `cart_items`
  MODIFY `cart_item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=193;

--
-- AUTO_INCREMENT cho bảng `categories`
--
ALTER TABLE `categories`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=59;

--
-- AUTO_INCREMENT cho bảng `categories_attributes_values`
--
ALTER TABLE `categories_attributes_values`
  MODIFY `cav_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=289;

--
-- AUTO_INCREMENT cho bảng `coupons`
--
ALTER TABLE `coupons`
  MODIFY `coupon_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT cho bảng `installments`
--
ALTER TABLE `installments`
  MODIFY `installment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- AUTO_INCREMENT cho bảng `installment_payments`
--
ALTER TABLE `installment_payments`
  MODIFY `payment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=184;

--
-- AUTO_INCREMENT cho bảng `installment_policies`
--
ALTER TABLE `installment_policies`
  MODIFY `policy_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT cho bảng `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=158;

--
-- AUTO_INCREMENT cho bảng `order_items`
--
ALTER TABLE `order_items`
  MODIFY `order_item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=189;

--
-- AUTO_INCREMENT cho bảng `payments`
--
ALTER TABLE `payments`
  MODIFY `payment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=127;

--
-- AUTO_INCREMENT cho bảng `products`
--
ALTER TABLE `products`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=432;

--
-- AUTO_INCREMENT cho bảng `product_variants`
--
ALTER TABLE `product_variants`
  MODIFY `variant_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=628;

--
-- AUTO_INCREMENT cho bảng `service_requests`
--
ALTER TABLE `service_requests`
  MODIFY `service_request_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT cho bảng `variant_images`
--
ALTER TABLE `variant_images`
  MODIFY `image_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=266;

--
-- AUTO_INCREMENT cho bảng `variant_serials`
--
ALTER TABLE `variant_serials`
  MODIFY `serial_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1316;

--
-- AUTO_INCREMENT cho bảng `warranties`
--
ALTER TABLE `warranties`
  MODIFY `warranty_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `addresses`
--
ALTER TABLE `addresses`
  ADD CONSTRAINT `addresses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `attributes_categories`
--
ALTER TABLE `attributes_categories`
  ADD CONSTRAINT `attributes_categories_ibfk_1` FOREIGN KEY (`attribute_id`) REFERENCES `attributes` (`attribute_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `attributes_categories_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `attribute_values`
--
ALTER TABLE `attribute_values`
  ADD CONSTRAINT `attribute_values_ibfk_1` FOREIGN KEY (`attribute_id`) REFERENCES `attributes` (`attribute_id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `builds`
--
ALTER TABLE `builds`
  ADD CONSTRAINT `builds_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `build_items`
--
ALTER TABLE `build_items`
  ADD CONSTRAINT `build_items_ibfk_1` FOREIGN KEY (`build_id`) REFERENCES `builds` (`build_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `build_items_ibfk_2` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`variant_id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `carts`
--
ALTER TABLE `carts`
  ADD CONSTRAINT `carts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `cart_items`
--
ALTER TABLE `cart_items`
  ADD CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`cart_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `cart_items_ibfk_2` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`variant_id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `categories`
--
ALTER TABLE `categories`
  ADD CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`parent_category_id`) REFERENCES `categories` (`category_id`) ON DELETE SET NULL;

--
-- Các ràng buộc cho bảng `categories_attributes_values`
--
ALTER TABLE `categories_attributes_values`
  ADD CONSTRAINT `categories_attributes_values_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `categories_attributes_values_ibfk_2` FOREIGN KEY (`attribute_id`) REFERENCES `attributes` (`attribute_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `categories_attributes_values_ibfk_3` FOREIGN KEY (`attribute_value_id`) REFERENCES `attribute_values` (`attribute_value_id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `installments`
--
ALTER TABLE `installments`
  ADD CONSTRAINT `fk_installment_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`),
  ADD CONSTRAINT `fk_installments_policy` FOREIGN KEY (`policy_id`) REFERENCES `installment_policies` (`policy_id`);

--
-- Các ràng buộc cho bảng `installment_payments`
--
ALTER TABLE `installment_payments`
  ADD CONSTRAINT `fk_payment_installment` FOREIGN KEY (`installment_id`) REFERENCES `installments` (`installment_id`);

--
-- Các ràng buộc cho bảng `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`address_id`) REFERENCES `addresses` (`address_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `orders_ibfk_3` FOREIGN KEY (`coupon_id`) REFERENCES `coupons` (`coupon_id`) ON DELETE SET NULL;

--
-- Các ràng buộc cho bảng `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`variant_id`);

--
-- Các ràng buộc cho bảng `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`);

--
-- Các ràng buộc cho bảng `products_attribute_values`
--
ALTER TABLE `products_attribute_values`
  ADD CONSTRAINT `products_attribute_values_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `products_attribute_values_ibfk_2` FOREIGN KEY (`attribute_value_id`) REFERENCES `attribute_values` (`attribute_value_id`);

--
-- Các ràng buộc cho bảng `product_variants`
--
ALTER TABLE `product_variants`
  ADD CONSTRAINT `product_variants_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `service_requests`
--
ALTER TABLE `service_requests`
  ADD CONSTRAINT `fk_sr_serial` FOREIGN KEY (`serial_id`) REFERENCES `variant_serials` (`serial_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_sr_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_sr_warranty` FOREIGN KEY (`warranty_id`) REFERENCES `warranties` (`warranty_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `variants_attribute_values`
--
ALTER TABLE `variants_attribute_values`
  ADD CONSTRAINT `variants_attribute_values_ibfk_1` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`variant_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `variants_attribute_values_ibfk_2` FOREIGN KEY (`attribute_value_id`) REFERENCES `attribute_values` (`attribute_value_id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `variant_images`
--
ALTER TABLE `variant_images`
  ADD CONSTRAINT `variant_images_ibfk_1` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`variant_id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `variant_serials`
--
ALTER TABLE `variant_serials`
  ADD CONSTRAINT `vs_fk_order_item` FOREIGN KEY (`order_item_id`) REFERENCES `order_items` (`order_item_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `vs_fk_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`variant_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `vs_fk_warranty` FOREIGN KEY (`warranty_id`) REFERENCES `warranties` (`warranty_id`) ON DELETE SET NULL;

--
-- Các ràng buộc cho bảng `warranties`
--
ALTER TABLE `warranties`
  ADD CONSTRAINT `fk_warranties_serial` FOREIGN KEY (`serial_id`) REFERENCES `variant_serials` (`serial_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `warranties_ibfk_1` FOREIGN KEY (`order_item_id`) REFERENCES `order_items` (`order_item_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
