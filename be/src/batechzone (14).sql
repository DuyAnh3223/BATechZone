-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th10 22, 2025 lúc 02:57 PM
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
(1, 4, 'bao1', '0987676765', '123 bao', 'dsa', 'dsa', 'dsa', 'dsa', 'dsa', 'Vietnam', 0, 'home', '2025-11-06 06:56:49', '2025-11-06 06:57:32'),
(2, 4, 'fsaf', '0987676765', '123 bao', 'rqw', 'rq', 'rqw', 'rqw', 'rq', 'Vietnam', 1, 'office', '2025-11-06 06:57:27', '2025-11-06 06:57:32'),
(4, 9, 'bao1', '0987676765', '123 bao', 'dsa', 'rq', 'dsa', 'dsa', '312', 'Vietnam', 1, 'home', '2025-11-07 08:22:15', '2025-11-07 08:22:21'),
(15, NULL, 'Mai Trần Duy Anh', '0947657637', '25A Do Duc Duc, Phu Tho Hoa, Tan Phu, HCM', NULL, 'hcm', 'q1', NULL, NULL, 'Vietnam', 0, 'other', '2025-11-16 03:33:04', '2025-11-16 03:33:04'),
(17, NULL, 'Lê Tôn Bảo ', '0908231611', '25A Do Duc Duc, Phu Tho Hoa, Tan Phu, HCM', NULL, 'hcm', 'q1', NULL, NULL, 'Vietnam', 0, 'other', '2025-11-16 03:43:36', '2025-11-16 03:43:36'),
(18, NULL, 'Lê Tôn Bảo ', '0908231611', '25A Do Duc Duc, Phu Tho Hoa, Tan Phu, HCM', NULL, 'hn', 'q1', NULL, NULL, 'Vietnam', 0, 'other', '2025-11-16 05:17:55', '2025-11-16 05:17:55'),
(19, 10, 'nguyen van a', '0123456788', 'abc,123', 'gừger', 'hcm', 'q1', NULL, NULL, 'Vietnam', 0, 'other', '2025-11-16 06:38:02', '2025-11-16 06:38:02'),
(20, 10, 'nguyen van a', '0987676765', '123, dsa', 'fsafsa', 'hcm', 'q1', NULL, NULL, 'Vietnam', 0, 'other', '2025-11-16 07:19:38', '2025-11-16 07:19:38'),
(21, 10, 'nguyen van a', '0987676765', '123, dsa', 'brtetrbtrbrt', 'hcm', 'q1', NULL, NULL, 'Vietnam', 0, 'other', '2025-11-16 07:48:51', '2025-11-16 07:48:51'),
(22, 10, 'nguyen van a', '0123456788', '123, dsa', 'đasa', 'hcm', 'q1', '', '', 'Vietnam', 1, 'other', '2025-11-16 08:22:55', '2025-11-16 08:34:07'),
(23, 6, 'Mai Trần Duy Anh', '0947657637', '25A Do Duc Duc, Phu Tho Hoa, Tan Phu, HCM', NULL, 'hcm', 'q1', NULL, NULL, 'Vietnam', 0, 'other', '2025-11-16 13:00:12', '2025-11-16 13:00:12'),
(24, NULL, 'A', '0947657637', '25A Do Duc Duc, Phu Tho Hoa, Tan Phu, HCM', NULL, 'hcm', 'q1', NULL, NULL, 'Vietnam', 0, 'other', '2025-11-16 13:09:01', '2025-11-16 13:09:01'),
(25, NULL, 'Lê Tôn Bảo ', '0987654321', '25A Do Duc Duc, Phu Tho Hoa, Tan Phu, HCM', NULL, 'hcm', 'q1', NULL, NULL, 'Vietnam', 0, 'other', '2025-11-16 13:10:31', '2025-11-16 13:10:31'),
(26, 1, 'Nguyễn Linh', '0987654321', '25A Do Duc Duc, Phu Tho Hoa, Tan Phu, HCM', NULL, 'hcm', 'q1', NULL, NULL, 'Vietnam', 0, 'other', '2025-11-16 13:18:01', '2025-11-16 13:18:01'),
(27, 10, 'nguyen van a', '0123456788', '123, dsa', NULL, 'hcm', 'q2', NULL, NULL, 'Vietnam', 0, 'other', '2025-11-22 10:13:10', '2025-11-22 10:13:10'),
(28, NULL, 'nguyen van a', '0123456788', '123, dsa', NULL, 'hcm', 'Quận 1', NULL, NULL, 'Vietnam', 0, 'other', '2025-11-22 11:04:40', '2025-11-22 11:04:40'),
(29, NULL, 'nguyen van a', '0123456788', '321,uu', NULL, 'hcm', 'Quận Phú Nhuận', NULL, NULL, 'Vietnam', 0, 'other', '2025-11-22 11:12:29', '2025-11-22 11:12:29'),
(30, 10, 'dddd', '0123456788', 'abc', NULL, 'danang', 'Cẩm Lệ', NULL, NULL, 'Vietnam', 0, 'other', '2025-11-22 11:16:35', '2025-11-22 11:16:35'),
(31, 10, 'nguyen van a', '0123456788', '123, dsa', NULL, 'hcm', 'q1', NULL, NULL, 'Vietnam', 0, 'other', '2025-11-22 11:26:51', '2025-11-22 11:26:51'),
(32, 10, 'dddd', '0123456788', '321,uu', 'a', 'hcm', 'q1', NULL, NULL, 'Vietnam', 0, 'other', '2025-11-22 11:31:52', '2025-11-22 11:31:52'),
(33, 10, 'dddd', '0123456788', 'abcd', NULL, 'danang', 'Ngũ Hành Sơn', NULL, NULL, 'Vietnam', 0, 'other', '2025-11-22 11:32:39', '2025-11-22 11:32:39'),
(34, 10, 'nguyen van a', '0123456788', '123, dsa', NULL, 'hn', 'q1', NULL, NULL, 'Vietnam', 0, 'other', '2025-11-22 13:56:20', '2025-11-22 13:56:20');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `articles`
--

CREATE TABLE `articles` (
  `article_id` int(11) NOT NULL,
  `post_id` int(11) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `tags` varchar(255) DEFAULT NULL,
  `meta_title` varchar(255) DEFAULT NULL,
  `meta_description` varchar(500) DEFAULT NULL,
  `reading_time` int(11) DEFAULT NULL COMMENT 'Thời gian đọc (phút)',
  `seo_keywords` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `attributes`
--

CREATE TABLE `attributes` (
  `attribute_id` int(11) NOT NULL,
  `attribute_name` varchar(100) NOT NULL,
  `attribute_type` enum('color','size','storage','ram','other') DEFAULT 'other',
  `display_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `attributes`
--

INSERT INTO `attributes` (`attribute_id`, `attribute_name`, `attribute_type`, `display_order`, `is_active`, `created_at`) VALUES
(1, 'Hãng', 'other', 1, 1, '2025-11-15 05:46:33'),
(2, 'Socket', 'other', 2, 1, '2025-11-15 05:46:33'),
(3, 'Dòng sản phẩm', 'other', 3, 1, '2025-11-15 05:46:33'),
(4, 'Loại sản phẩm', 'other', 4, 1, '2025-11-15 05:46:33'),
(5, 'Hãng', 'other', 1, 1, '2025-11-15 05:46:33'),
(6, 'Dòng card', 'other', 2, 1, '2025-11-15 05:46:33'),
(7, 'Bộ nhớ', 'storage', 3, 1, '2025-11-15 05:46:33'),
(8, 'Nhà sản xuất', 'other', 4, 1, '2025-11-15 05:46:33'),
(9, 'Hãng', 'other', 1, 1, '2025-11-15 05:46:33'),
(10, 'Loại RAM', 'ram', 2, 1, '2025-11-15 05:46:33'),
(11, 'Dung lượng', 'ram', 3, 1, '2025-11-15 05:46:33'),
(12, 'Tốc độ', 'other', 4, 1, '2025-11-15 05:46:33'),
(13, 'Màu sắc', 'color', 5, 1, '2025-11-15 05:46:33'),
(14, 'Hãng', 'other', 1, 1, '2025-11-15 05:46:33'),
(15, 'Loại SSD', 'storage', 2, 1, '2025-11-15 05:46:33'),
(16, 'Dung lượng', 'storage', 3, 1, '2025-11-15 05:46:33'),
(17, 'Hãng', 'other', 1, 1, '2025-11-15 05:46:33'),
(18, 'Socket', 'other', 2, 1, '2025-11-15 05:46:33'),
(19, 'Form Factor', 'size', 3, 1, '2025-11-15 05:46:33'),
(20, 'WiFi', 'other', 4, 1, '2025-11-15 05:46:33'),
(21, 'Hãng', 'other', 1, 1, '2025-11-15 05:46:33'),
(22, 'Công suất', 'other', 2, 1, '2025-11-15 05:46:33'),
(23, 'Chứng nhận 80 Plus', 'other', 3, 1, '2025-11-15 05:46:33'),
(24, 'Hãng', 'other', 1, 1, '2025-11-15 05:46:33'),
(25, 'Form Factor', 'size', 2, 1, '2025-11-15 05:46:33'),
(26, 'Màu sắc', 'color', 3, 1, '2025-11-15 05:46:33'),
(27, 'RGB', 'other', 4, 1, '2025-11-15 05:46:33'),
(28, 'Hãng', 'other', 1, 1, '2025-11-15 05:46:33'),
(29, 'Loại tản nhiệt', 'other', 2, 1, '2025-11-15 05:46:33'),
(30, 'Kích thước', 'size', 3, 1, '2025-11-15 05:46:33'),
(31, 'RGB', 'other', 4, 1, '2025-11-15 05:46:33'),
(32, 'Hãng', 'other', 1, 1, '2025-11-15 05:46:33'),
(33, 'Dung lượng', 'storage', 2, 1, '2025-11-15 05:46:33'),
(34, 'Tốc độ quay', 'other', 3, 1, '2025-11-15 05:46:33'),
(35, 'Buss', 'other', 0, 1, '2025-11-16 13:14:29');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `attribute_categories`
--

CREATE TABLE `attribute_categories` (
  `attribute_category_id` int(11) NOT NULL,
  `attribute_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `attribute_categories`
--

INSERT INTO `attribute_categories` (`attribute_category_id`, `attribute_id`, `category_id`) VALUES
(1, 1, 1),
(2, 2, 1),
(3, 3, 1),
(4, 4, 1),
(5, 5, 2),
(6, 6, 2),
(7, 7, 2),
(8, 8, 2),
(9, 9, 3),
(10, 10, 3),
(11, 11, 3),
(12, 12, 3),
(13, 13, 3),
(14, 14, 4),
(15, 15, 4),
(16, 16, 4),
(17, 17, 5),
(18, 18, 5),
(19, 19, 5),
(20, 20, 5),
(21, 21, 6),
(22, 22, 6),
(23, 23, 6),
(24, 24, 7),
(25, 25, 7),
(26, 26, 7),
(27, 27, 7),
(28, 28, 8),
(29, 29, 8),
(30, 30, 8),
(31, 31, 8),
(32, 32, 13),
(33, 33, 13),
(34, 34, 13),
(35, 1, 35),
(36, 35, 35);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `attribute_values`
--

CREATE TABLE `attribute_values` (
  `attribute_value_id` int(11) NOT NULL,
  `attribute_id` int(11) NOT NULL,
  `value_name` varchar(100) NOT NULL,
  `color_code` varchar(7) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `display_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `attribute_values`
--

INSERT INTO `attribute_values` (`attribute_value_id`, `attribute_id`, `value_name`, `color_code`, `image_url`, `display_order`, `is_active`, `created_at`) VALUES
(1, 1, 'Intel', NULL, NULL, 1, 1, '2025-11-15 05:46:33'),
(2, 1, 'AMD', NULL, NULL, 2, 1, '2025-11-15 05:46:33'),
(3, 2, 'LGA1700', NULL, NULL, 1, 1, '2025-11-15 05:46:33'),
(4, 2, 'AM5', NULL, NULL, 2, 1, '2025-11-15 05:46:33'),
(5, 2, 'AM4', NULL, NULL, 3, 1, '2025-11-15 05:46:33'),
(6, 3, 'Core i5', NULL, NULL, 1, 1, '2025-11-15 05:46:33'),
(7, 3, 'Core i7', NULL, NULL, 2, 1, '2025-11-15 05:46:33'),
(8, 3, 'Core i9', NULL, NULL, 3, 1, '2025-11-15 05:46:33'),
(9, 3, 'Ryzen 5', NULL, NULL, 4, 1, '2025-11-15 05:46:33'),
(10, 3, 'Ryzen 7', NULL, NULL, 5, 1, '2025-11-15 05:46:33'),
(11, 3, 'Ryzen 9', NULL, NULL, 6, 1, '2025-11-15 05:46:33'),
(12, 4, 'Boxed (Có tản nhiệt)', NULL, NULL, 1, 1, '2025-11-15 05:46:33'),
(13, 4, 'Tray (Không tản nhiệt)', NULL, NULL, 2, 1, '2025-11-15 05:46:33'),
(14, 5, 'NVIDIA', NULL, NULL, 1, 1, '2025-11-15 05:46:33'),
(15, 5, 'AMD', NULL, NULL, 2, 1, '2025-11-15 05:46:33'),
(16, 6, 'RTX 4060', NULL, NULL, 1, 1, '2025-11-15 05:46:33'),
(17, 6, 'RTX 4070', NULL, NULL, 2, 1, '2025-11-15 05:46:33'),
(18, 6, 'RTX 4080', NULL, NULL, 3, 1, '2025-11-15 05:46:33'),
(19, 6, 'RX 7600', NULL, NULL, 4, 1, '2025-11-15 05:46:33'),
(20, 6, 'RX 7800 XT', NULL, NULL, 5, 1, '2025-11-15 05:46:33'),
(21, 7, '8GB', NULL, NULL, 1, 1, '2025-11-15 05:46:33'),
(22, 7, '12GB', NULL, NULL, 2, 1, '2025-11-15 05:46:33'),
(23, 7, '16GB', NULL, NULL, 3, 1, '2025-11-15 05:46:33'),
(24, 8, 'ASUS', NULL, NULL, 1, 1, '2025-11-15 05:46:33'),
(25, 8, 'MSI', NULL, NULL, 2, 1, '2025-11-15 05:46:33'),
(26, 8, 'Gigabyte', NULL, NULL, 3, 1, '2025-11-15 05:46:33'),
(27, 8, 'Sapphire', NULL, NULL, 4, 1, '2025-11-15 05:46:33'),
(28, 8, 'XFX', NULL, NULL, 5, 1, '2025-11-15 05:46:33'),
(29, 8, 'ASRock', NULL, NULL, 6, 1, '2025-11-15 05:46:33'),
(30, 8, 'PowerColor', NULL, NULL, 7, 1, '2025-11-15 05:46:33'),
(31, 9, 'Corsair', NULL, NULL, 1, 1, '2025-11-15 05:46:33'),
(32, 9, 'G.Skill', NULL, NULL, 2, 1, '2025-11-15 05:46:33'),
(33, 9, 'Kingston', NULL, NULL, 3, 1, '2025-11-15 05:46:33'),
(34, 9, 'Team Group', NULL, NULL, 4, 1, '2025-11-15 05:46:33'),
(35, 9, 'ADATA', NULL, NULL, 5, 1, '2025-11-15 05:46:33'),
(36, 10, 'DDR4', NULL, NULL, 1, 1, '2025-11-15 05:46:33'),
(37, 10, 'DDR5', NULL, NULL, 2, 1, '2025-11-15 05:46:33'),
(38, 11, '16GB (2x8GB)', NULL, NULL, 1, 1, '2025-11-15 05:46:33'),
(39, 11, '32GB (2x16GB)', NULL, NULL, 2, 1, '2025-11-15 05:46:33'),
(40, 11, '64GB (2x32GB)', NULL, NULL, 3, 1, '2025-11-15 05:46:33'),
(41, 12, '3200MHz', NULL, NULL, 1, 1, '2025-11-15 05:46:33'),
(42, 12, '3600MHz', NULL, NULL, 2, 1, '2025-11-15 05:46:33'),
(43, 12, '5600MHz', NULL, NULL, 3, 1, '2025-11-15 05:46:33'),
(44, 12, '6000MHz', NULL, NULL, 4, 1, '2025-11-15 05:46:33'),
(45, 12, '6400MHz', NULL, NULL, 5, 1, '2025-11-15 05:46:33'),
(46, 13, 'Đen', '#000000', NULL, 1, 1, '2025-11-15 05:46:33'),
(47, 13, 'Trắng', '#FFFFFF', NULL, 2, 1, '2025-11-15 05:46:33'),
(48, 13, 'Bạc', '#C0C0C0', NULL, 3, 1, '2025-11-15 05:46:33'),
(49, 14, 'Samsung', NULL, NULL, 1, 1, '2025-11-15 05:46:33'),
(50, 14, 'WD', NULL, NULL, 2, 1, '2025-11-15 05:46:33'),
(51, 14, 'Crucial', NULL, NULL, 3, 1, '2025-11-15 05:46:33'),
(52, 14, 'Kingston', NULL, NULL, 4, 1, '2025-11-15 05:46:33'),
(53, 14, 'Seagate', NULL, NULL, 5, 1, '2025-11-15 05:46:33'),
(54, 15, 'NVMe M.2', NULL, NULL, 1, 1, '2025-11-15 05:46:33'),
(55, 15, 'SATA M.2', NULL, NULL, 2, 1, '2025-11-15 05:46:33'),
(56, 15, 'SATA 2.5\"', NULL, NULL, 3, 1, '2025-11-15 05:46:33'),
(57, 16, '256GB', NULL, NULL, 1, 1, '2025-11-15 05:46:33'),
(58, 16, '512GB', NULL, NULL, 2, 1, '2025-11-15 05:46:33'),
(59, 16, '1TB', NULL, NULL, 3, 1, '2025-11-15 05:46:33'),
(60, 16, '2TB', NULL, NULL, 4, 1, '2025-11-15 05:46:33'),
(61, 16, '4TB', NULL, NULL, 5, 1, '2025-11-15 05:46:33'),
(62, 17, 'ASUS', NULL, NULL, 1, 1, '2025-11-15 05:46:33'),
(63, 17, 'MSI', NULL, NULL, 2, 1, '2025-11-15 05:46:33'),
(64, 17, 'Gigabyte', NULL, NULL, 3, 1, '2025-11-15 05:46:33'),
(65, 17, 'ASRock', NULL, NULL, 4, 1, '2025-11-15 05:46:33'),
(66, 18, 'LGA1700', NULL, NULL, 1, 1, '2025-11-15 05:46:33'),
(67, 18, 'AM5', NULL, NULL, 2, 1, '2025-11-15 05:46:33'),
(68, 18, 'AM4', NULL, NULL, 3, 1, '2025-11-15 05:46:33'),
(69, 19, 'ATX', NULL, NULL, 1, 1, '2025-11-15 05:46:33'),
(70, 19, 'mATX', NULL, NULL, 2, 1, '2025-11-15 05:46:33'),
(71, 19, 'ITX', NULL, NULL, 3, 1, '2025-11-15 05:46:33'),
(72, 20, 'WiFi 6', NULL, NULL, 1, 1, '2025-11-15 05:46:33'),
(73, 20, 'WiFi 6E', NULL, NULL, 2, 1, '2025-11-15 05:46:33'),
(74, 20, 'Không có WiFi', NULL, NULL, 3, 1, '2025-11-15 05:46:33'),
(75, 21, 'Corsair', NULL, NULL, 1, 1, '2025-11-15 05:46:33'),
(76, 21, 'Seasonic', NULL, NULL, 2, 1, '2025-11-15 05:46:33'),
(77, 21, 'Cooler Master', NULL, NULL, 3, 1, '2025-11-15 05:46:33'),
(78, 21, 'Thermaltake', NULL, NULL, 4, 1, '2025-11-15 05:46:33'),
(79, 21, 'EVGA', NULL, NULL, 5, 1, '2025-11-15 05:46:33'),
(80, 22, '550W', NULL, NULL, 1, 1, '2025-11-15 05:46:33'),
(81, 22, '650W', NULL, NULL, 2, 1, '2025-11-15 05:46:33'),
(82, 22, '750W', NULL, NULL, 3, 1, '2025-11-15 05:46:33'),
(83, 22, '850W', NULL, NULL, 4, 1, '2025-11-15 05:46:33'),
(84, 22, '1000W', NULL, NULL, 5, 1, '2025-11-15 05:46:33'),
(85, 23, '80 Plus Bronze', NULL, NULL, 1, 1, '2025-11-15 05:46:33'),
(86, 23, '80 Plus Gold', NULL, NULL, 2, 1, '2025-11-15 05:46:33'),
(87, 23, '80 Plus Platinum', NULL, NULL, 3, 1, '2025-11-15 05:46:33'),
(88, 23, '80 Plus Titanium', NULL, NULL, 4, 1, '2025-11-15 05:46:33'),
(89, 24, 'Corsair', NULL, NULL, 1, 1, '2025-11-15 05:46:33'),
(90, 24, 'Fractal Design', NULL, NULL, 2, 1, '2025-11-15 05:46:33'),
(91, 24, 'NZXT', NULL, NULL, 3, 1, '2025-11-15 05:46:33'),
(92, 24, 'Cooler Master', NULL, NULL, 4, 1, '2025-11-15 05:46:33'),
(93, 24, 'Phanteks', NULL, NULL, 5, 1, '2025-11-15 05:46:33'),
(94, 25, 'ATX', NULL, NULL, 1, 1, '2025-11-15 05:46:33'),
(95, 25, 'mATX', NULL, NULL, 2, 1, '2025-11-15 05:46:33'),
(96, 25, 'ITX', NULL, NULL, 3, 1, '2025-11-15 05:46:33'),
(97, 26, 'Đen', '#000000', NULL, 1, 1, '2025-11-15 05:46:33'),
(98, 26, 'Trắng', '#FFFFFF', NULL, 2, 1, '2025-11-15 05:46:33'),
(99, 27, 'Có RGB', NULL, NULL, 1, 1, '2025-11-15 05:46:33'),
(100, 27, 'Không có RGB', NULL, NULL, 2, 1, '2025-11-15 05:46:33'),
(101, 28, 'Corsair', NULL, NULL, 1, 1, '2025-11-15 05:46:33'),
(102, 28, 'Noctua', NULL, NULL, 2, 1, '2025-11-15 05:46:33'),
(103, 28, 'Deepcool', NULL, NULL, 3, 1, '2025-11-15 05:46:33'),
(104, 28, 'Arctic', NULL, NULL, 4, 1, '2025-11-15 05:46:33'),
(105, 28, 'Cooler Master', NULL, NULL, 5, 1, '2025-11-15 05:46:33'),
(106, 29, 'AIO (Tản nhiệt nước)', NULL, NULL, 1, 1, '2025-11-15 05:46:33'),
(107, 29, 'Air (Tản nhiệt khí)', NULL, NULL, 2, 1, '2025-11-15 05:46:33'),
(108, 30, '120mm', NULL, NULL, 1, 1, '2025-11-15 05:46:33'),
(109, 30, '240mm', NULL, NULL, 2, 1, '2025-11-15 05:46:33'),
(110, 30, '360mm', NULL, NULL, 3, 1, '2025-11-15 05:46:33'),
(111, 30, 'Single Tower', NULL, NULL, 4, 1, '2025-11-15 05:46:33'),
(112, 30, 'Dual Tower', NULL, NULL, 5, 1, '2025-11-15 05:46:33'),
(113, 31, 'Có RGB', NULL, NULL, 1, 1, '2025-11-15 05:46:33'),
(114, 31, 'Không có RGB', NULL, NULL, 2, 1, '2025-11-15 05:46:33'),
(115, 32, 'Seagate', NULL, NULL, 1, 1, '2025-11-15 05:46:33'),
(116, 32, 'Western Digital', NULL, NULL, 2, 1, '2025-11-15 05:46:33'),
(117, 32, 'Toshiba', NULL, NULL, 3, 1, '2025-11-15 05:46:33'),
(118, 33, '1TB', NULL, NULL, 1, 1, '2025-11-15 05:46:33'),
(119, 33, '2TB', NULL, NULL, 2, 1, '2025-11-15 05:46:33'),
(120, 33, '3TB', NULL, NULL, 3, 1, '2025-11-15 05:46:33'),
(121, 33, '4TB', NULL, NULL, 4, 1, '2025-11-15 05:46:33'),
(122, 33, '8TB', NULL, NULL, 5, 1, '2025-11-15 05:46:33'),
(123, 34, '5400RPM', NULL, NULL, 1, 1, '2025-11-15 05:46:33'),
(124, 34, '7200RPM', NULL, NULL, 2, 1, '2025-11-15 05:46:33'),
(125, 1, 'Gskill', NULL, NULL, 0, 1, '2025-11-16 13:14:20'),
(126, 35, '3600', NULL, NULL, 0, 1, '2025-11-16 13:14:29');

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
(4, 10, NULL, '2025-11-16 05:36:21', '2025-11-16 05:36:21', '2025-12-16 05:36:21'),
(5, NULL, 'guest_1763273048440_dxnpt7o32', '2025-11-16 06:04:08', '2025-11-16 06:04:08', '2025-12-16 06:04:08'),
(6, NULL, 'guest_1763273048440_dxnpt7o32', '2025-11-16 06:04:08', '2025-11-16 06:04:08', '2025-12-16 06:04:08'),
(7, 1, NULL, '2025-11-16 13:11:37', '2025-11-16 13:11:37', '2025-12-16 13:11:37');

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
(25, 2, 337, 1, '2025-11-20 13:19:38', '2025-11-20 13:19:38'),
(27, 2, 336, 1, '2025-11-21 15:53:34', '2025-11-21 15:53:34'),
(45, 4, 372, 1, '2025-11-22 13:56:51', '2025-11-22 13:56:51'),
(46, 4, 368, 1, '2025-11-22 13:56:52', '2025-11-22 13:56:52');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `categories`
--

CREATE TABLE `categories` (
  `category_id` int(11) NOT NULL,
  `category_name` varchar(100) NOT NULL,
  `slug` varchar(100) NOT NULL,
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

INSERT INTO `categories` (`category_id`, `category_name`, `slug`, `description`, `parent_category_id`, `image_url`, `icon`, `is_active`, `display_order`, `created_at`, `updated_at`) VALUES
(1, 'CPU', 'cpu', 'Bộ vi xử lý trung tâm (Central Processing Unit) - Lựa chọn CPU phù hợp cho hệ thống của bạn', NULL, '/uploads/categories/CPU-1763457142421-41099656.webp', NULL, 1, 1, '2025-11-05 12:37:11', '2025-11-18 09:12:22'),
(2, 'VGA', 'vga', 'Card đồ họa (Video Graphics Array) - Card màn hình cao cấp cho gaming và đồ họa', NULL, '/uploads/categories/VGA-1763457150324-84510626.webp', NULL, 1, 2, '2025-11-05 12:37:11', '2025-11-18 09:12:30'),
(4, 'SSD', 'ssd', 'Ổ cứng thể rắn (Solid State Drive) - SSD NVMe, SATA tốc độ cao', NULL, '/uploads/categories/SSD-1763457167579-214129801.webp', NULL, 1, 4, '2025-11-05 12:37:11', '2025-11-18 09:12:47'),
(5, 'Mainboard', 'mainboard', 'Bo mạch chủ (Motherboard) - Mainboard Intel, AMD các dòng ATX, mATX, ITX', NULL, '/uploads/categories/MAINBOARD-1763457180313-19278038.webp', NULL, 1, 5, '2025-11-05 12:37:11', '2025-11-18 09:13:00'),
(6, 'PSU', 'psu', 'Bộ nguồn máy tính (Power Supply Unit) - PSU 80 Plus Bronze, Gold, Platinum', NULL, '/uploads/categories/PSU-1763457190031-894247274.webp', NULL, 1, 6, '2025-11-05 12:37:11', '2025-11-18 09:13:10'),
(7, 'Case', 'case', 'Vỏ máy tính (Computer Case) - Case PC ATX, mATX, ITX với quạt RGB, tản nhiệt tốt', NULL, '/uploads/categories/CASE-1763457197140-926410204.webp', NULL, 1, 7, '2025-11-05 12:37:11', '2025-11-18 09:13:17'),
(8, 'Cooling', 'cooling', 'Tản nhiệt và làm mát - Quạt case, tản nhiệt CPU, tản nhiệt nước AIO', NULL, '/uploads/categories/cooling-1763787556488-628471150.jpg', NULL, 1, 8, '2025-11-05 12:37:11', '2025-11-22 04:59:16'),
(13, 'HDD', 'hdd', 'Ổ đĩa cứng (Hard Disk Drive) là thiết bị lưu trữ dữ liệu chính cho máy tính', NULL, '/uploads/categories/hdd-1763456945816-496007346.jpg', NULL, 1, 0, '2025-11-08 14:08:34', '2025-11-18 09:09:05'),
(35, 'RAM', 'ram', NULL, NULL, '/uploads/categories/RAM-1763457131288-611013067.webp', NULL, 1, 0, '2025-11-16 13:14:05', '2025-11-18 09:12:11');

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
(5, 'FREESHIP15', 'Giảm 15% cho tất cả đơn hàng', 'percentage', 15.00, 100000.00, 0.00, NULL, 2, 1, '2025-10-31 17:00:00', '2025-12-30 17:00:00', '2025-11-05 10:19:14'),
(6, 'BLACKFRIDAY', 'Giảm 30% tối đa 150.000đ cho mọi đơn hàng', 'percentage', 30.00, 150000.00, 0.00, 200, 0, 1, '2025-11-24 17:00:00', '2025-11-30 16:59:59', '2025-11-05 10:19:14'),
(7, 'WELCOME50', 'Tặng 50.000đ cho đơn hàng đầu tiên', 'fixed_amount', 50000.00, NULL, 100000.00, 1, 1, 1, '2025-10-31 17:00:00', '2025-12-31 17:00:00', '2025-11-05 10:19:14'),
(8, 'XMAS25', 'Giảm 25% cho mùa Giáng Sinh', 'percentage', 25.00, 120000.00, 300000.00, 300, 0, 1, '2025-11-30 17:00:00', '2025-12-31 16:59:59', '2025-11-05 10:19:14'),
(9, 'HELLO', 'Giam 7% cho don hang 100000', 'percentage', 7.00, NULL, 100000.00, NULL, 0, 0, '2025-11-05 01:00:00', '2025-11-20 13:00:00', '2025-11-05 10:33:52');

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
  `num_terms` int(11) NOT NULL,
  `monthly_payment` decimal(12,2) NOT NULL,
  `interest_rate` decimal(5,2) DEFAULT 0.00,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `status` enum('active','completed','overdue','cancelled') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `installments`
--

INSERT INTO `installments` (`installment_id`, `order_id`, `user_id`, `total_amount`, `down_payment`, `num_terms`, `monthly_payment`, `interest_rate`, `start_date`, `end_date`, `status`, `created_at`) VALUES
(1, 1, 11, 5200000.00, 2000000.00, 6, 533333.33, 1.50, '2025-11-20', '2026-05-20', 'active', '2025-11-20 06:17:00'),
(2, 2, 12, 7700000.00, 3000000.00, 12, 391666.67, 0.00, '2025-11-20', '2026-11-20', 'active', '2025-11-20 06:17:00'),
(3, 22, 10, 200000.00, 40000.00, 9, 17918.82, 1.50, '2025-11-22', '2026-08-22', 'active', '2025-11-22 11:16:35'),
(4, 25, 10, 450000.00, 90000.00, 6, 60385.59, 1.50, '2025-11-22', '2026-05-22', 'active', '2025-11-22 11:32:39');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `installment_payments`
--

CREATE TABLE `installment_payments` (
  `payment_id` int(11) NOT NULL,
  `installment_id` int(11) NOT NULL,
  `payment_no` int(11) NOT NULL,
  `due_date` date NOT NULL,
  `paid_date` date DEFAULT NULL,
  `amount` decimal(12,2) NOT NULL,
  `status` enum('pending','paid','late','failed') DEFAULT 'pending',
  `note` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `installment_payments`
--

INSERT INTO `installment_payments` (`payment_id`, `installment_id`, `payment_no`, `due_date`, `paid_date`, `amount`, `status`, `note`) VALUES
(1, 1, 1, '2025-12-20', NULL, 533333.33, 'pending', NULL),
(2, 1, 2, '2026-01-20', NULL, 533333.33, 'pending', NULL),
(3, 1, 3, '2026-02-20', NULL, 533333.33, 'pending', NULL),
(4, 1, 4, '2026-03-20', NULL, 533333.33, 'pending', NULL),
(5, 1, 5, '2026-04-20', NULL, 533333.33, 'pending', NULL),
(6, 1, 6, '2026-05-20', NULL, 533333.33, 'pending', NULL),
(7, 2, 1, '2025-12-20', '2025-12-22', 391666.67, 'paid', 'Thanh toán trước hạn'),
(8, 2, 2, '2026-01-20', NULL, 391666.67, 'pending', NULL),
(9, 2, 3, '2026-02-20', NULL, 391666.67, 'pending', NULL),
(10, 2, 4, '2026-03-20', NULL, 391666.67, 'pending', NULL),
(11, 2, 5, '2026-04-20', NULL, 391666.67, 'pending', NULL),
(12, 2, 6, '2026-05-20', NULL, 391666.67, 'pending', NULL),
(13, 2, 7, '2026-06-20', NULL, 391666.67, 'pending', NULL),
(14, 2, 8, '2026-07-20', NULL, 391666.67, 'pending', NULL),
(15, 2, 9, '2026-08-20', NULL, 391666.67, 'pending', NULL),
(16, 2, 10, '2026-09-20', NULL, 391666.67, 'pending', NULL),
(17, 2, 11, '2026-10-20', NULL, 391666.67, 'pending', NULL),
(18, 2, 12, '2026-11-20', NULL, 391666.67, 'pending', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `notifications`
--

CREATE TABLE `notifications` (
  `notification_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `notification_type` enum('order','promotion','system','review','message') NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text DEFAULT NULL,
  `link_url` varchar(255) DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `read_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
(1, 11, 'ORD001', NULL, NULL, 'pending', 'unpaid', 5000000.00, 0.00, 0.00, 0.00, 5200000.00, NULL, NULL, '2025-11-19 02:30:00', '2025-11-20 06:17:00', NULL, NULL, NULL, NULL),
(2, 12, 'ORD002', NULL, NULL, 'pending', 'unpaid', 7500000.00, 0.00, 0.00, 0.00, 7700000.00, NULL, NULL, '2025-11-19 08:10:00', '2025-11-20 06:17:00', NULL, NULL, NULL, NULL),
(11, 10, 'ORD75082611921', 19, 5, 'pending', 'unpaid', 5900000.00, 100000.00, 50000.00, 0.00, 5850000.00, 'gừger', NULL, '2025-11-16 06:38:02', '2025-11-16 06:38:02', NULL, NULL, NULL, NULL),
(12, 10, 'ORD77578948294', 20, NULL, 'pending', 'unpaid', 900000.00, 0.00, 50000.00, 0.00, 950000.00, 'fsafsa', NULL, '2025-11-16 07:19:38', '2025-11-16 07:19:38', NULL, NULL, NULL, NULL),
(13, 10, 'ORD79331079801', 21, 5, 'shipping', 'unpaid', 1350000.00, 100000.00, 50000.00, 0.00, 1300000.00, 'brtetrbtrbrt', NULL, '2025-11-16 07:48:51', '2025-11-16 09:28:00', NULL, NULL, NULL, NULL),
(14, 10, 'ORD81375687283', 22, NULL, 'shipping', 'unpaid', 450000.00, 0.00, 50000.00, 0.00, 500000.00, 'đasa', NULL, '2025-11-16 08:22:55', '2025-11-16 11:51:10', NULL, NULL, NULL, NULL),
(15, 6, 'ORD98012082332', 23, NULL, 'pending', 'unpaid', 5450000.00, 0.00, 50000.00, 0.00, 5500000.00, NULL, NULL, '2025-11-16 13:00:12', '2025-11-16 13:00:12', NULL, NULL, NULL, NULL),
(16, NULL, 'ORD98541802163', 24, NULL, 'pending', 'unpaid', 450000.00, 0.00, 50000.00, 0.00, 500000.00, NULL, NULL, '2025-11-16 13:09:01', '2025-11-16 13:09:01', NULL, NULL, NULL, NULL),
(17, NULL, 'ORD98631027172', 25, 7, 'pending', 'unpaid', 450000.00, 50000.00, 50000.00, 0.00, 450000.00, NULL, NULL, '2025-11-16 13:10:31', '2025-11-16 13:10:31', NULL, NULL, NULL, NULL),
(18, 1, 'ORD99081462641', 26, 4, 'confirmed', 'unpaid', 1350000.00, 100000.00, 50000.00, 0.00, 1300000.00, NULL, NULL, '2025-11-16 13:18:01', '2025-11-16 13:21:48', NULL, NULL, NULL, NULL),
(19, 10, 'ORD06390176808', 27, NULL, 'pending', 'unpaid', 650000.00, 0.00, 50000.00, 0.00, 700000.00, NULL, NULL, '2025-11-22 10:13:10', '2025-11-22 10:13:10', NULL, NULL, NULL, NULL),
(20, NULL, 'ORD09480910274', 28, NULL, 'pending', 'unpaid', 800000.00, 0.00, 0.00, 0.00, 800000.00, NULL, NULL, '2025-11-22 11:04:40', '2025-11-22 11:04:40', NULL, NULL, NULL, NULL),
(21, NULL, 'ORD09949187111', 29, NULL, 'pending', 'unpaid', 20000.00, 0.00, 0.00, 0.00, 20000.00, NULL, NULL, '2025-11-22 11:12:29', '2025-11-22 11:12:29', NULL, NULL, NULL, NULL),
(22, 10, 'ORD10195813111', 30, NULL, 'pending', 'unpaid', 200000.00, 0.00, 0.00, 0.00, 200000.00, NULL, NULL, '2025-11-22 11:16:35', '2025-11-22 11:16:35', NULL, NULL, NULL, NULL),
(23, 10, 'ORD10811392350', 31, NULL, 'pending', 'unpaid', 200000.00, 0.00, 50000.00, 0.00, 250000.00, NULL, NULL, '2025-11-22 11:26:51', '2025-11-22 11:26:51', NULL, NULL, NULL, NULL),
(24, 10, 'ORD11112641065', 32, NULL, 'pending', 'unpaid', 650000.00, 0.00, 50000.00, 0.00, 700000.00, 'a', NULL, '2025-11-22 11:31:52', '2025-11-22 11:31:52', NULL, NULL, NULL, NULL),
(25, 10, 'ORD11159100387', 33, NULL, 'pending', 'unpaid', 450000.00, 0.00, 0.00, 0.00, 450000.00, NULL, NULL, '2025-11-22 11:32:39', '2025-11-22 11:32:39', NULL, NULL, NULL, NULL),
(26, 10, 'ORD19780640620', 34, NULL, 'pending', 'unpaid', 1650000.00, 0.00, 50000.00, 0.00, 1700000.00, NULL, NULL, '2025-11-22 13:56:20', '2025-11-22 13:56:20', NULL, NULL, NULL, NULL);

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
(13, 11, 338, 'Asus B760M-E Tuf', 'Asus B760M-E Tuf', 'asus-b760m-e-tuf-default', 1, 5000000.00, 0.00, 5000000.00, '2025-11-16 06:38:02'),
(14, 11, 336, 'Intel Core i5 14600kf', 'Intel Core i5 14600kf', 'intel-core-i5-14600kf-default', 2, 450000.00, 0.00, 900000.00, '2025-11-16 06:38:02'),
(15, 12, 336, 'Intel Core i5 14600kf', 'Intel Core i5 14600kf', 'intel-core-i5-14600kf-default', 2, 450000.00, 0.00, 900000.00, '2025-11-16 07:19:38'),
(16, 13, 336, 'Intel Core i5 14600kf', 'Intel Core i5 14600kf', 'intel-core-i5-14600kf-default', 3, 450000.00, 0.00, 1350000.00, '2025-11-16 07:48:51'),
(17, 14, 336, 'Intel Core i5 14600kf', 'Intel Core i5 14600kf', 'intel-core-i5-14600kf-default', 1, 450000.00, 0.00, 450000.00, '2025-11-16 08:22:55'),
(18, 15, 338, 'Asus B760M-E Tuf', 'Asus B760M-E Tuf', 'asus-b760m-e-tuf-default', 1, 5000000.00, 0.00, 5000000.00, '2025-11-16 13:00:12'),
(19, 15, 336, 'Intel Core i5 14600kf', 'Intel Core i5 14600kf', 'intel-core-i5-14600kf-default', 1, 450000.00, 0.00, 450000.00, '2025-11-16 13:00:12'),
(20, 16, 336, 'Intel Core i5 14600kf', 'Intel Core i5 14600kf', 'intel-core-i5-14600kf-default', 1, 450000.00, 0.00, 450000.00, '2025-11-16 13:09:01'),
(21, 17, 336, 'Intel Core i5 14600kf', 'Intel Core i5 14600kf', 'intel-core-i5-14600kf-default', 1, 450000.00, 0.00, 450000.00, '2025-11-16 13:10:31'),
(22, 18, 336, 'Intel Core i5 14600kf', 'Intel Core i5 14600kf', 'intel-core-i5-14600kf-default', 3, 450000.00, 0.00, 1350000.00, '2025-11-16 13:18:01'),
(23, 19, 336, 'Intel Core i5 14600kf', 'Intel Core i5 14600kf', 'intel-core-i5-14600kf-default', 1, 450000.00, 0.00, 450000.00, '2025-11-22 10:13:10'),
(24, 19, 372, 'DD', 'AMD-RTX 4070-12GB-Gigabyte', 'AMD-RTX 4070-12GB-Gigabyte', 1, 200000.00, 0.00, 200000.00, '2025-11-22 10:13:10'),
(25, 20, 372, 'DD', 'AMD-RTX 4070-12GB-Gigabyte', 'AMD-RTX 4070-12GB-Gigabyte', 4, 200000.00, 0.00, 800000.00, '2025-11-22 11:04:40'),
(26, 21, 368, 'ABD', 'Seagate-1TB-5400RPM', 'Seagate-1TB-5400RPM', 1, 20000.00, 0.00, 20000.00, '2025-11-22 11:12:29'),
(27, 22, 372, 'DD', 'AMD-RTX 4070-12GB-Gigabyte', 'AMD-RTX 4070-12GB-Gigabyte', 1, 200000.00, 0.00, 200000.00, '2025-11-22 11:16:35'),
(28, 23, 372, 'DD', 'AMD-RTX 4070-12GB-Gigabyte', 'AMD-RTX 4070-12GB-Gigabyte', 1, 200000.00, 0.00, 200000.00, '2025-11-22 11:26:51'),
(29, 24, 336, 'Intel Core i5 14600kf', 'Intel Core i5 14600kf', 'intel-core-i5-14600kf-default', 1, 450000.00, 0.00, 450000.00, '2025-11-22 11:31:52'),
(30, 24, 372, 'DD', 'AMD-RTX 4070-12GB-Gigabyte', 'AMD-RTX 4070-12GB-Gigabyte', 1, 200000.00, 0.00, 200000.00, '2025-11-22 11:31:52'),
(31, 25, 336, 'Intel Core i5 14600kf', 'Intel Core i5 14600kf', 'intel-core-i5-14600kf-default', 1, 450000.00, 0.00, 450000.00, '2025-11-22 11:32:39'),
(32, 26, 372, 'DD', 'AMD-RTX 4070-12GB-Gigabyte', 'AMD-RTX 4070-12GB-Gigabyte', 6, 200000.00, 0.00, 1200000.00, '2025-11-22 13:56:20'),
(33, 26, 336, 'Intel Core i5 14600kf', 'Intel Core i5 14600kf', 'intel-core-i5-14600kf-default', 1, 450000.00, 0.00, 450000.00, '2025-11-22 13:56:20');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `payments`
--

CREATE TABLE `payments` (
  `payment_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `payment_method` enum('cod','bank_transfer','credit_card','e_wallet','installment') NOT NULL,
  `payment_status` enum('pending','completed','failed','refunded') DEFAULT 'pending',
  `amount` decimal(12,2) NOT NULL,
  `transaction_id` varchar(100) DEFAULT NULL,
  `payment_gateway` varchar(50) DEFAULT NULL,
  `payment_details` text DEFAULT NULL,
  `paid_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `posts`
--

CREATE TABLE `posts` (
  `post_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `excerpt` text DEFAULT NULL,
  `featured_image` varchar(255) DEFAULT NULL,
  `post_type` enum('blog','news','guide','review') DEFAULT 'blog',
  `status` enum('draft','published','archived') DEFAULT 'draft',
  `view_count` int(11) DEFAULT 0,
  `like_count` int(11) DEFAULT 0,
  `comment_count` int(11) DEFAULT 0,
  `published_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
  `img_path` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `products`
--

INSERT INTO `products` (`product_id`, `category_id`, `product_name`, `slug`, `description`, `base_price`, `is_active`, `is_featured`, `view_count`, `rating_average`, `review_count`, `created_at`, `updated_at`, `img_path`) VALUES
(239, 1, 'Intel Core i5 14600kf', 'intel-core-i5-14600kf', NULL, 450000.00, 1, 1, 40, 0.00, 0, '2025-11-15 15:03:12', '2025-11-22 08:18:25', ''),
(240, 2, 'Asus RTX 5060Ti', 'asus-rtx-5060ti', NULL, 8000000.00, 1, 1, 30, 0.00, 0, '2025-11-15 15:10:15', '2025-11-22 08:18:29', ''),
(241, 5, 'Asus B760M-E Tuf', 'asus-b760m-e-tuf', NULL, 5000000.00, 1, 0, 14, 0.00, 0, '2025-11-16 02:14:13', '2025-11-22 08:55:52', ''),
(242, 35, 'Gskill Trident Z', 'gskill-trident-z', NULL, 0.00, 1, 0, 8, 0.00, 0, '2025-11-16 13:14:54', '2025-11-16 13:37:29', ''),
(243, 2, 'Asus RTX 5070', 'asus-rtx-5070', NULL, 0.00, 1, 0, 2, 0.00, 0, '2025-11-18 12:53:53', '2025-11-18 13:08:05', ''),
(249, 35, 'Mặc định', 'mac-inh', NULL, 50100.00, 1, 0, 2, 0.00, 0, '2025-11-21 12:52:03', '2025-11-22 08:55:45', ''),
(250, 13, 'Thuộc tính', 'thuoc-tinh', NULL, 600.00, 1, 0, 6, 0.00, 0, '2025-11-21 13:02:29', '2025-11-22 08:55:41', ''),
(253, 13, 'Demo Img', 'demo-img', NULL, 600.00, 1, 0, 14, 0.00, 0, '2025-11-21 13:59:12', '2025-11-22 08:55:48', ''),
(257, 13, 'ABD', 'abd', 'aa', 20000.00, 1, 0, 38, 0.00, 0, '2025-11-22 05:42:02', '2025-11-22 08:42:09', ''),
(263, 2, 'DD', 'dd', 'aaaa', 200000.00, 1, 0, 176, 0.00, 0, '2025-11-22 07:21:36', '2025-11-22 11:36:44', '');

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
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `product_variants`
--

INSERT INTO `product_variants` (`variant_id`, `product_id`, `sku`, `variant_name`, `price`, `stock_quantity`, `is_active`, `is_default`, `created_at`, `updated_at`) VALUES
(336, 239, 'intel-core-i5-14600kf-default', 'Intel Core i5 14600kf', 450000.00, 55, 1, 1, '2025-11-15 15:03:12', '2025-11-22 13:56:20'),
(337, 240, 'asus-rtx-5060ti-default', 'Asus RTX 5060Ti', 8000000.00, 596, 1, 1, '2025-11-15 15:10:15', '2025-11-16 05:17:55'),
(338, 241, 'asus-b760m-e-tuf-default', 'Asus B760M-E Tuf', 6999000.00, 998, 1, 1, '2025-11-16 02:14:13', '2025-11-16 13:31:06'),
(347, 242, 'gskill-trident-z-default', 'Gskill Trident Z', 800000.00, 20, 1, 1, '2025-11-16 13:14:54', '2025-11-16 13:37:22'),
(349, 243, 'asus-rtx-5070-default', 'Asus RTX 5070', 600000.00, 5, 1, 1, '2025-11-18 12:53:53', '2025-11-18 12:53:53'),
(351, 243, 'NVIDIA-RTX 4060-8GB-ASUS', NULL, 7.00, 7, 1, 0, '2025-11-18 13:16:26', '2025-11-18 13:16:26'),
(358, 249, 'mac-inh-default', 'Mặc định', 50100.00, 5, 1, 1, '2025-11-21 12:52:03', '2025-11-21 12:52:03'),
(361, 250, 'Seagate', 'Seagate', 600.00, 0, 1, 1, '2025-11-21 13:02:29', '2025-11-21 13:02:29'),
(363, 253, 'Seagate-1TB', 'Seagate-1TB', 600.00, 0, 1, 1, '2025-11-21 13:59:12', '2025-11-21 13:59:12'),
(368, 257, 'Seagate-1TB-5400RPM', 'Seagate-1TB-5400RPM', 20000.00, 19, 1, 1, '2025-11-22 05:42:02', '2025-11-22 11:12:29'),
(372, 263, 'AMD-RTX 4070-12GB-Gigabyte', 'AMD-RTX 4070-12GB-Gigabyte', 200000.00, 6, 1, 1, '2025-11-22 07:21:36', '2025-11-22 13:56:20');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `recent_views`
--

CREATE TABLE `recent_views` (
  `view_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `variant_id` int(11) NOT NULL,
  `viewed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `reports`
--

CREATE TABLE `reports` (
  `report_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `variant_id` int(11) NOT NULL,
  `report_type` enum('fake_product','inappropriate_content','misleading_info','other') NOT NULL,
  `description` text NOT NULL,
  `status` enum('pending','reviewing','resolved','rejected') DEFAULT 'pending',
  `admin_notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `resolved_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `reviews`
--

CREATE TABLE `reviews` (
  `review_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `variant_id` int(11) NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `rating` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `comment` text DEFAULT NULL,
  `is_verified_purchase` tinyint(1) DEFAULT 0,
  `is_approved` tinyint(1) DEFAULT 0,
  `helpful_count` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `service_requests`
--

CREATE TABLE `service_requests` (
  `service_request_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `request_type` enum('warranty','repair','return','exchange','consultation') NOT NULL,
  `status` enum('pending','processing','completed','rejected','cancelled') DEFAULT 'pending',
  `subject` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `priority` enum('low','medium','high','urgent') DEFAULT 'medium',
  `assigned_to` int(11) DEFAULT NULL,
  `resolution` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `resolved_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
  `session_token` varchar(128) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`user_id`, `username`, `email`, `password_hash`, `full_name`, `phone`, `role`, `is_active`, `created_at`, `updated_at`, `last_login`, `session_token`) VALUES
(1, 'user1', 'user1@gmail.com', '$2b$10$EF5wE/PMLkT5GMjYAe4yi.DcP3MQed7.P4JxubFIdJvuqKtJB4Uea', NULL, NULL, 0, 1, '2025-10-31 15:52:20', '2025-11-16 13:11:35', NULL, 'cd0fc002f5ef57fe5e99783d81f5dd6b94600673995e50db2ccad0c0ea2a6d38'),
(2, 'user2', 'user2@gmail.com', '$2b$10$sgscek75SEoXGWwZHmFfMuXSHZW0JLHE3pgLAEqCPe7pGimDqo3gS', NULL, NULL, 0, 1, '2025-11-01 01:07:16', '2025-11-01 01:07:16', NULL, NULL),
(3, 'abcdef', 'abc@gmail.com', '$2b$10$M8uNkONltbbKsY8y9DdqUeF3IFn1CeH9B0S6SBQzNB5QyVinKZ37.', NULL, NULL, 0, 1, '2025-11-01 10:27:03', '2025-11-01 10:27:03', NULL, NULL),
(4, 'bao', 'bao@gmail.com', '$2b$10$zPJUT/20Y4wiZUXjELb0QuDSWVxSkubIKLIpNIfYkVQuJY7E92J.e', 'bao', '0965656565', 0, 1, '2025-11-03 15:09:28', '2025-11-07 03:26:14', NULL, NULL),
(5, 'admin1', 'admin1@gmail.com', '$2b$10$b9lCzWVznD4ZMQ1Y6/bOc.Jn6efXZS1Us.ZjYVv2PFgHkqKr1PD1.', 'aaa', '0123456789', 2, 0, '2025-11-05 09:18:39', '2025-11-05 10:08:50', NULL, '39c81725075b25e0e973c080d442c787a6e9fdc55a1f613fab08e3fc7facbb7c'),
(6, 'admin', 'admin@gmail.com', '$2b$10$84e9xqnTc50CPaf5pOldT.Ob9zW9/RVK.G3Whr.TdAncfRdE.UivG', 'admin', '0123456788', 2, 1, '2025-11-05 09:33:52', '2025-11-22 00:48:42', NULL, '33958bd807fffa899417dcc06eea071199b7c9163c78d410f31a67198245a9e2'),
(7, 'bao1', 'bao1@gmail.com', '$2b$10$sVY/zhJ2cKlwydAjQ090e.bMn1eFJKudObM.yOZiR06XPanyUgaFW', 'bao1', '0975846352', 0, 0, '2025-11-05 10:09:19', '2025-11-05 10:09:38', NULL, NULL),
(8, 'bb', 'bb@gmail.com', '$2b$10$i/dzC6SfHsM.5cHiYaS89ed4rg4SAoLtZz1/O2mA6eagocIogJoL6', NULL, NULL, 0, 1, '2025-11-07 03:26:38', '2025-11-07 08:05:59', NULL, NULL),
(9, 'ccc', 'cc@gmail.com', '$2b$10$zdMHGgXEqVXcvRmaoymJceZdwLmNnViMKR.Gss2KmhtlJzm9k8pp.', 'bao', '0987676765', 0, 1, '2025-11-07 08:06:49', '2025-11-07 08:23:41', NULL, '25df20a38db4f2d83703655c8fa0289a37154f1beeceb3ab72ad43f1bb4f13e3'),
(10, 'dddd', 'dd@gmail.com', '$2b$10$VOQn9zNNzcmwyWhyaGBHt.XROz23EkcPmj2Gzo8GEr3I07ARid5gq', 'dd', '0123456788', 0, 1, '2025-11-07 08:24:07', '2025-11-22 13:39:35', NULL, '17efa1b171560b5584ce628c78af2237cc5c5996c026b07259ebdf5e981adcbd'),
(11, 'nguyenvana', 'nguyenvana@example.com', 'hashedpassword1', 'Nguyễn Văn A', '0912345678', 0, 1, '2025-11-20 06:17:00', '2025-11-20 06:17:00', NULL, NULL),
(12, 'lethib', 'lethib@example.com', 'hashedpassword2', 'Lê Thị B', '0987654321', 0, 1, '2025-11-20 06:17:00', '2025-11-20 06:17:00', NULL, NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `variant_attributes`
--

CREATE TABLE `variant_attributes` (
  `variant_id` int(11) NOT NULL,
  `attribute_value_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `variant_attributes`
--

INSERT INTO `variant_attributes` (`variant_id`, `attribute_value_id`) VALUES
(351, 14),
(351, 16),
(351, 21),
(351, 24),
(361, 115),
(363, 115),
(363, 118),
(368, 115),
(368, 118),
(368, 123),
(372, 15),
(372, 17),
(372, 22),
(372, 26);

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
(55, 368, '/uploads/variants/368/1_De_Student-1763790123002-349823583.png', 'Image 1', 1, 0, '2025-11-22 07:06:29'),
(56, 368, '/uploads/variants/368/2_De_Outlook-1763790123008-42161979.png', 'Image 2', 0, 1, '2025-11-22 07:06:29'),
(57, 368, '/uploads/variants/368/3_De_Time-1763790123009-292304051.png', 'Image 3', 0, 2, '2025-11-22 07:06:29'),
(58, 368, '/uploads/variants/368/4_De_Bus-1763790123011-744248151.png', 'Image 4', 0, 3, '2025-11-22 07:06:29'),
(59, 368, '/uploads/variants/368/5_De_Where-1763790123012-381444524.png', 'Image 5', 0, 4, '2025-11-22 07:06:29'),
(60, 372, '/uploads/variants/372/Screenshot2025-04-26092223-1763796096478-56263565.png', NULL, 1, 0, '2025-11-22 07:21:36'),
(61, 372, '/uploads/variants/372/Screenshot2025-04-26092235-1763796096484-743370840.png', NULL, 0, 1, '2025-11-22 07:21:36'),
(62, 372, '/uploads/variants/372/Screenshot2025-04-26092251-1763796096489-283203241.png', NULL, 0, 2, '2025-11-22 07:21:36');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `warranty`
--

CREATE TABLE `warranty` (
  `warranty_id` int(11) NOT NULL,
  `order_item_id` int(11) NOT NULL,
  `service_request_id` int(11) DEFAULT NULL,
  `warranty_period` int(11) NOT NULL COMMENT 'Thời gian bảo hành (tháng)',
  `warranty_type` enum('manufacturer','store','extended') DEFAULT 'manufacturer',
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `status` enum('active','expired','claimed','void') DEFAULT 'active',
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `wishlists`
--

CREATE TABLE `wishlists` (
  `wishlist_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `wishlist_name` varchar(100) DEFAULT 'My Wishlist',
  `is_default` tinyint(1) DEFAULT 1,
  `is_public` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `wishlist_items`
--

CREATE TABLE `wishlist_items` (
  `wishlist_id` int(11) NOT NULL,
  `variant_id` int(11) NOT NULL,
  `added_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
-- Chỉ mục cho bảng `articles`
--
ALTER TABLE `articles`
  ADD PRIMARY KEY (`article_id`),
  ADD UNIQUE KEY `post_id` (`post_id`),
  ADD KEY `idx_post_id` (`post_id`),
  ADD KEY `idx_category_id` (`category_id`);

--
-- Chỉ mục cho bảng `attributes`
--
ALTER TABLE `attributes`
  ADD PRIMARY KEY (`attribute_id`),
  ADD KEY `idx_attribute_type` (`attribute_type`);

--
-- Chỉ mục cho bảng `attribute_categories`
--
ALTER TABLE `attribute_categories`
  ADD PRIMARY KEY (`attribute_category_id`);

--
-- Chỉ mục cho bảng `attribute_values`
--
ALTER TABLE `attribute_values`
  ADD PRIMARY KEY (`attribute_value_id`),
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
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `idx_parent_category` (`parent_category_id`),
  ADD KEY `idx_slug` (`slug`),
  ADD KEY `idx_is_active` (`is_active`);

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
  ADD KEY `fk_installment_order` (`order_id`);

--
-- Chỉ mục cho bảng `installment_payments`
--
ALTER TABLE `installment_payments`
  ADD PRIMARY KEY (`payment_id`),
  ADD KEY `fk_payment_installment` (`installment_id`);

--
-- Chỉ mục cho bảng `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`notification_id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_is_read` (`is_read`),
  ADD KEY `idx_created_at` (`created_at`);

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
-- Chỉ mục cho bảng `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`post_id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_slug` (`slug`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_post_type` (`post_type`);
ALTER TABLE `posts` ADD FULLTEXT KEY `idx_search` (`title`,`content`);

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
-- Chỉ mục cho bảng `product_variants`
--
ALTER TABLE `product_variants`
  ADD PRIMARY KEY (`variant_id`),
  ADD UNIQUE KEY `sku` (`sku`),
  ADD KEY `idx_product_id` (`product_id`),
  ADD KEY `idx_sku` (`sku`),
  ADD KEY `idx_is_active` (`is_active`);

--
-- Chỉ mục cho bảng `recent_views`
--
ALTER TABLE `recent_views`
  ADD PRIMARY KEY (`view_id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_variant_id` (`variant_id`),
  ADD KEY `idx_viewed_at` (`viewed_at`);

--
-- Chỉ mục cho bảng `reports`
--
ALTER TABLE `reports`
  ADD PRIMARY KEY (`report_id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_variant_id` (`variant_id`),
  ADD KEY `idx_status` (`status`);

--
-- Chỉ mục cho bảng `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`review_id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_variant_id` (`variant_id`),
  ADD KEY `idx_rating` (`rating`),
  ADD KEY `idx_is_approved` (`is_approved`);

--
-- Chỉ mục cho bảng `service_requests`
--
ALTER TABLE `service_requests`
  ADD PRIMARY KEY (`service_request_id`),
  ADD KEY `assigned_to` (`assigned_to`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_request_type` (`request_type`),
  ADD KEY `idx_priority` (`priority`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_username` (`username`),
  ADD KEY `idx_role` (`role`);

--
-- Chỉ mục cho bảng `variant_attributes`
--
ALTER TABLE `variant_attributes`
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
-- Chỉ mục cho bảng `warranty`
--
ALTER TABLE `warranty`
  ADD PRIMARY KEY (`warranty_id`),
  ADD KEY `idx_order_item_id` (`order_item_id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_end_date` (`end_date`),
  ADD KEY `fk_warranty_service_request` (`service_request_id`);

--
-- Chỉ mục cho bảng `wishlists`
--
ALTER TABLE `wishlists`
  ADD PRIMARY KEY (`wishlist_id`),
  ADD KEY `idx_user_id` (`user_id`);

--
-- Chỉ mục cho bảng `wishlist_items`
--
ALTER TABLE `wishlist_items`
  ADD PRIMARY KEY (`wishlist_id`,`variant_id`),
  ADD KEY `idx_wishlist_id` (`wishlist_id`),
  ADD KEY `idx_variant_id` (`variant_id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `addresses`
--
ALTER TABLE `addresses`
  MODIFY `address_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT cho bảng `articles`
--
ALTER TABLE `articles`
  MODIFY `article_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `attributes`
--
ALTER TABLE `attributes`
  MODIFY `attribute_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT cho bảng `attribute_categories`
--
ALTER TABLE `attribute_categories`
  MODIFY `attribute_category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT cho bảng `attribute_values`
--
ALTER TABLE `attribute_values`
  MODIFY `attribute_value_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=127;

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
  MODIFY `cart_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT cho bảng `cart_items`
--
ALTER TABLE `cart_items`
  MODIFY `cart_item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT cho bảng `categories`
--
ALTER TABLE `categories`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT cho bảng `coupons`
--
ALTER TABLE `coupons`
  MODIFY `coupon_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT cho bảng `installments`
--
ALTER TABLE `installments`
  MODIFY `installment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `installment_payments`
--
ALTER TABLE `installment_payments`
  MODIFY `payment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT cho bảng `notifications`
--
ALTER TABLE `notifications`
  MODIFY `notification_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT cho bảng `order_items`
--
ALTER TABLE `order_items`
  MODIFY `order_item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT cho bảng `payments`
--
ALTER TABLE `payments`
  MODIFY `payment_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `posts`
--
ALTER TABLE `posts`
  MODIFY `post_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `products`
--
ALTER TABLE `products`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=264;

--
-- AUTO_INCREMENT cho bảng `product_variants`
--
ALTER TABLE `product_variants`
  MODIFY `variant_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=373;

--
-- AUTO_INCREMENT cho bảng `recent_views`
--
ALTER TABLE `recent_views`
  MODIFY `view_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `reports`
--
ALTER TABLE `reports`
  MODIFY `report_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `reviews`
--
ALTER TABLE `reviews`
  MODIFY `review_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `service_requests`
--
ALTER TABLE `service_requests`
  MODIFY `service_request_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT cho bảng `variant_images`
--
ALTER TABLE `variant_images`
  MODIFY `image_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=63;

--
-- AUTO_INCREMENT cho bảng `warranty`
--
ALTER TABLE `warranty`
  MODIFY `warranty_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `wishlists`
--
ALTER TABLE `wishlists`
  MODIFY `wishlist_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `addresses`
--
ALTER TABLE `addresses`
  ADD CONSTRAINT `addresses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `articles`
--
ALTER TABLE `articles`
  ADD CONSTRAINT `articles_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `articles_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE SET NULL;

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
-- Các ràng buộc cho bảng `installments`
--
ALTER TABLE `installments`
  ADD CONSTRAINT `fk_installment_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`);

--
-- Các ràng buộc cho bảng `installment_payments`
--
ALTER TABLE `installment_payments`
  ADD CONSTRAINT `fk_payment_installment` FOREIGN KEY (`installment_id`) REFERENCES `installments` (`installment_id`);

--
-- Các ràng buộc cho bảng `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

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
-- Các ràng buộc cho bảng `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Các ràng buộc cho bảng `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`);

--
-- Các ràng buộc cho bảng `product_variants`
--
ALTER TABLE `product_variants`
  ADD CONSTRAINT `product_variants_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `recent_views`
--
ALTER TABLE `recent_views`
  ADD CONSTRAINT `recent_views_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `recent_views_ibfk_2` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`variant_id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `reports`
--
ALTER TABLE `reports`
  ADD CONSTRAINT `reports_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reports_ibfk_2` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`variant_id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`variant_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_3` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE SET NULL;

--
-- Các ràng buộc cho bảng `service_requests`
--
ALTER TABLE `service_requests`
  ADD CONSTRAINT `service_requests_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `service_requests_ibfk_2` FOREIGN KEY (`assigned_to`) REFERENCES `users` (`user_id`) ON DELETE SET NULL;

--
-- Các ràng buộc cho bảng `variant_attributes`
--
ALTER TABLE `variant_attributes`
  ADD CONSTRAINT `variant_attributes_ibfk_1` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`variant_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `variant_attributes_ibfk_2` FOREIGN KEY (`attribute_value_id`) REFERENCES `attribute_values` (`attribute_value_id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `variant_images`
--
ALTER TABLE `variant_images`
  ADD CONSTRAINT `variant_images_ibfk_1` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`variant_id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `warranty`
--
ALTER TABLE `warranty`
  ADD CONSTRAINT `fk_warranty_service_request` FOREIGN KEY (`service_request_id`) REFERENCES `service_requests` (`service_request_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `warranty_ibfk_1` FOREIGN KEY (`order_item_id`) REFERENCES `order_items` (`order_item_id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `wishlists`
--
ALTER TABLE `wishlists`
  ADD CONSTRAINT `wishlists_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `wishlist_items`
--
ALTER TABLE `wishlist_items`
  ADD CONSTRAINT `wishlist_items_ibfk_1` FOREIGN KEY (`wishlist_id`) REFERENCES `wishlists` (`wishlist_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `wishlist_items_ibfk_2` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`variant_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
