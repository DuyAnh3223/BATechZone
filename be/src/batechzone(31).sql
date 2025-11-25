-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th10 25, 2025 lúc 09:13 AM
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
(52, 20, 'Trần Thị B', '0908787671', '32 Bùi Ngọ', NULL, 'hcm', 'Quận 1', NULL, NULL, 'Vietnam', 0, 'other', '2025-11-24 12:44:44', '2025-11-24 12:44:44'),
(53, 21, 'Nguyễn Văn A', '0908786561', '123 Thạch Lãm', NULL, 'hcm', 'Quận 1', NULL, NULL, 'Vietnam', 0, 'other', '2025-11-24 14:41:59', '2025-11-24 14:41:59');

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
(35, 'Buss', 'other', 0, 1, '2025-11-16 13:14:29'),
(36, 'DDR4', 'other', 0, 1, '2025-11-24 12:24:59'),
(37, 'DDR5', 'other', 0, 1, '2025-11-24 12:25:05'),
(38, 'Thế hệ', 'other', 0, 1, '2025-11-24 12:25:33'),
(41, 'Chipset', 'other', 0, 1, '2025-11-24 12:27:38');

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
(36, 35, 35),
(37, 36, 35),
(38, 37, 35),
(39, 38, 1),
(40, 39, 4),
(41, 40, 4),
(42, 41, 5);

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
(126, 35, '3600', NULL, NULL, 0, 1, '2025-11-16 13:14:29'),
(127, 3, 'Core i3', NULL, NULL, 0, 1, '2025-11-24 05:32:43'),
(128, 6, 'RTX 4050', NULL, NULL, 0, 1, '2025-11-24 05:32:43'),
(129, 15, 'M.2 NVMe PCIe 4.0', NULL, NULL, 0, 1, '2025-11-24 05:32:43'),
(130, 18, 'B550', NULL, NULL, 0, 1, '2025-11-24 05:32:43'),
(131, 22, '550W Gold', NULL, NULL, 0, 1, '2025-11-24 05:32:43'),
(132, 25, 'Mid Tower', NULL, NULL, 0, 1, '2025-11-24 05:32:43'),
(133, 29, 'AIO 240mm', NULL, NULL, 0, 1, '2025-11-24 05:32:43'),
(134, 33, '6TB', NULL, NULL, 0, 1, '2025-11-24 05:32:43'),
(135, 11, '8GB (1x8GB)', NULL, NULL, 0, 1, '2025-11-24 05:32:43');

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
(10, 20, NULL, '2025-11-24 13:26:23', '2025-11-24 13:26:23', '2025-12-24 13:26:23');

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
(63, 1, 400, 1, '2025-11-24 12:42:21', '2025-11-24 14:40:52'),
(64, 1, 379, 1, '2025-11-24 12:42:26', '2025-11-24 14:37:31'),
(67, 10, 400, 1, '2025-11-24 14:32:43', '2025-11-24 14:32:43'),
(68, 10, 379, 1, '2025-11-24 14:32:44', '2025-11-24 14:32:44');

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
  `down_payment_status` enum('pending','paid','cancelled') DEFAULT 'pending',
  `down_payment_date` datetime DEFAULT NULL,
  `down_payment_note` text DEFAULT NULL,
  `num_terms` int(11) NOT NULL,
  `monthly_payment` decimal(12,2) NOT NULL,
  `interest_rate` decimal(5,2) DEFAULT 0.00,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `status` enum('pending','approved','active','completed','overdue','cancelled') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `installments`
--

INSERT INTO `installments` (`installment_id`, `order_id`, `user_id`, `total_amount`, `down_payment`, `down_payment_status`, `down_payment_date`, `down_payment_note`, `num_terms`, `monthly_payment`, `interest_rate`, `start_date`, `end_date`, `status`, `created_at`) VALUES
(25, 46, 20, 12099086.57, 2400000.00, 'paid', '2025-11-24 12:49:52', 'Thanh toán trả trước qua Chuyển khoản', 12, 808257.21, 2.20, '2025-11-24', '2026-11-24', 'active', '2025-11-24 12:44:44'),
(26, 47, 21, 12076160.32, 2400000.00, 'paid', '2025-11-24 14:44:46', 'Thanh toán trả trước qua Chuyển khoản', 9, 1075128.92, 2.20, '2025-11-24', '2026-08-24', 'active', '2025-11-24 14:41:59');

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
(25, 25, 1, '2025-12-24', '2025-11-24', 808257.21, 'paid', 'Thanh toán qua Chuyển khoản'),
(26, 25, 2, '2026-01-24', NULL, 808257.21, 'pending', NULL),
(27, 25, 3, '2026-02-24', NULL, 808257.21, 'pending', NULL),
(28, 25, 4, '2026-03-24', NULL, 808257.21, 'pending', NULL),
(29, 25, 5, '2026-04-24', NULL, 808257.21, 'pending', NULL),
(30, 25, 6, '2026-05-24', NULL, 808257.21, 'pending', NULL),
(31, 25, 7, '2026-06-24', NULL, 808257.21, 'pending', NULL),
(32, 25, 8, '2026-07-24', NULL, 808257.21, 'pending', NULL),
(33, 25, 9, '2026-08-24', NULL, 808257.21, 'pending', NULL),
(34, 25, 10, '2026-09-24', NULL, 808257.21, 'pending', NULL),
(35, 25, 11, '2026-10-24', NULL, 808257.21, 'pending', NULL),
(36, 25, 12, '2026-11-24', NULL, 808257.21, 'pending', NULL),
(37, 26, 1, '2025-12-24', '2025-11-24', 1075128.92, 'paid', 'Thanh toán qua Chuyển khoản'),
(38, 26, 2, '2026-01-24', NULL, 1075128.92, 'pending', NULL),
(39, 26, 3, '2026-02-24', NULL, 1075128.92, 'pending', NULL),
(40, 26, 4, '2026-03-24', NULL, 1075128.92, 'pending', NULL),
(41, 26, 5, '2026-04-24', NULL, 1075128.92, 'pending', NULL),
(42, 26, 6, '2026-05-24', NULL, 1075128.92, 'pending', NULL),
(43, 26, 7, '2026-06-24', NULL, 1075128.92, 'pending', NULL),
(44, 26, 8, '2026-07-24', NULL, 1075128.92, 'pending', NULL),
(45, 26, 9, '2026-08-24', NULL, 1075128.92, 'pending', NULL);

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
(46, 20, 'ORD88284166267', 52, NULL, 'shipping', 'unpaid', 12000000.00, 0.00, 0.00, 0.00, 12000000.00, NULL, NULL, '2025-11-24 12:44:44', '2025-11-24 12:49:52', NULL, NULL, NULL, NULL),
(47, 21, 'ORD95319130334', 53, NULL, 'shipping', 'unpaid', 12000000.00, 0.00, 0.00, 0.00, 12000000.00, NULL, NULL, '2025-11-24 14:41:59', '2025-11-24 14:44:46', '2025-11-24 14:43:33', NULL, NULL, NULL);

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
(67, 46, 379, 'Intel Core i7-13700K', 'Box', 'INTEL-13700K-BOX', 1, 9000000.00, 0.00, 9000000.00, '2025-11-24 12:44:44'),
(68, 46, 400, 'Seasonic Focus GX-750', '750W Gold', 'SSN-GX750', 1, 3000000.00, 0.00, 3000000.00, '2025-11-24 12:44:44'),
(69, 47, 379, 'Intel Core i7-13700K', 'Box', 'INTEL-13700K-BOX', 1, 9000000.00, 0.00, 9000000.00, '2025-11-24 14:41:59'),
(70, 47, 400, 'Seasonic Focus GX-750', '750W Gold', 'SSN-GX750', 1, 3000000.00, 0.00, 3000000.00, '2025-11-24 14:41:59');

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
(264, 13, 'Ổ Cứng HDD SEAGATE Barracuda 2TB 3.5 inch 7200RPM, SATA III, 256MB Cache (ST2000DM008)', 'o-cung-hdd-seagate-barracuda-2tb-3-5-inch-7200rpm-sata-iii-256mb-cache-st2000dm008', NULL, 2500000.00, 1, 0, 6, 0.00, 0, '2025-11-24 12:30:39', '2025-11-25 07:52:28', ''),
(265, 1, 'Intel Core i5-13600K', 'intel-core-i5-13600k', NULL, 6000000.00, 1, 1, 8, 0.00, 0, '2025-11-24 05:32:43', '2025-11-25 07:51:39', ''),
(266, 1, 'AMD Ryzen 5 7600X', 'amd-ryzen-5-7600x', NULL, 5200000.00, 1, 1, 0, 0.00, 0, '2025-11-24 05:32:43', '2025-11-24 12:41:46', ''),
(267, 1, 'Intel Core i7-13700K', 'intel-core-i7-13700k', NULL, 9000000.00, 1, 1, 0, 0.00, 0, '2025-11-24 05:32:43', '2025-11-24 12:41:54', ''),
(268, 2, 'MSI GeForce RTX 4060', 'msi-geforce-rtx-4060', NULL, 7500000.00, 1, 0, 0, 0.00, 0, '2025-11-24 05:32:43', '2025-11-24 05:32:43', ''),
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
(286, 13, 'Seagate Barracuda 1TB 7200RPM', 'seagate-barracuda-1tb-7200', NULL, 1400000.00, 1, 0, 0, 0.00, 0, '2025-11-24 05:32:43', '2025-11-24 05:32:43', ''),
(287, 13, 'WD Blue 4TB 5400RPM', 'wd-blue-4tb-5400', NULL, 2200000.00, 1, 0, 0, 0.00, 0, '2025-11-24 05:32:43', '2025-11-24 05:32:43', ''),
(288, 13, 'Toshiba 8TB 7200RPM', 'toshiba-8tb-7200', NULL, 4800000.00, 1, 0, 0, 0.00, 0, '2025-11-24 05:32:43', '2025-11-24 05:32:43', ''),
(289, 35, 'G.Skill Trident Z DDR4 16GB (2x8GB)', 'gskill-tridentz-ddr4-16gb', NULL, 900000.00, 1, 0, 0, 0.00, 0, '2025-11-24 05:32:43', '2025-11-24 05:32:43', ''),
(290, 35, 'Corsair Vengeance DDR5 32GB (2x16GB)', 'corsair-vengeance-ddr5-32gb', NULL, 2200000.00, 1, 0, 0, 0.00, 0, '2025-11-24 05:32:43', '2025-11-24 05:32:43', ''),
(291, 35, 'Kingston Fury DDR4 64GB (2x32GB)', 'kingston-fury-ddr4-64gb', NULL, 4200000.00, 1, 0, 0, 0.00, 0, '2025-11-24 05:32:43', '2025-11-24 05:32:43', ''),
(292, 35, 'RR', 'rr', NULL, 100000.00, 1, 0, 2, 0.00, 0, '2025-11-25 06:01:36', '2025-11-25 07:52:21', '');

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
(374, 264, 'Seagate-2TB-7200RPM', 'Seagate-2TB-7200RPM', 2500000.00, 30, 1, 1, '2025-11-24 12:30:39', '2025-11-24 12:30:39'),
(375, 265, 'INTEL-13600K-BOX', 'Box', 6000000.00, 15, 1, 1, '2025-11-24 05:32:43', '2025-11-24 05:32:43'),
(376, 265, 'INTEL-13600K-DELUXE', 'Deluxe', 6500000.00, 10, 1, 0, '2025-11-24 05:32:43', '2025-11-24 05:32:43'),
(377, 266, 'AMD-7600X-BOX', 'Box', 5200000.00, 20, 1, 1, '2025-11-24 05:32:43', '2025-11-24 05:32:43'),
(378, 266, 'AMD-7600X-OC', 'OC', 5600000.00, 8, 1, 0, '2025-11-24 05:32:43', '2025-11-24 05:32:43'),
(379, 267, 'INTEL-13700K-BOX', 'Box', 9000000.00, 5, 1, 1, '2025-11-24 05:32:43', '2025-11-24 14:41:59'),
(380, 267, 'INTEL-13700K-DELUXE', 'Deluxe', 9700000.00, 4, 1, 0, '2025-11-24 05:32:43', '2025-11-24 05:32:43'),
(381, 268, 'MSI-RTX4060-1', 'Standard', 7500000.00, 12, 1, 1, '2025-11-24 05:32:43', '2025-11-24 05:32:43'),
(382, 268, 'MSI-RTX4060-OC', 'OC Edition', 7900000.00, 5, 1, 0, '2025-11-24 05:32:43', '2025-11-24 05:32:43'),
(383, 269, 'ASUS-RTX4070-1', 'Standard', 16000000.00, 6, 1, 1, '2025-11-24 05:32:43', '2025-11-24 05:32:43'),
(384, 269, 'ASUS-RTX4070-OC', 'OC Edition', 16700000.00, 3, 1, 0, '2025-11-24 05:32:43', '2025-11-24 05:32:43'),
(385, 270, 'GIG-RX7800XT-1', 'Standard', 14000000.00, 9, 1, 1, '2025-11-24 05:32:43', '2025-11-24 05:32:43'),
(386, 270, 'GIG-RX7800XT-OC', 'OC Edition', 14600000.00, 4, 1, 0, '2025-11-24 05:32:43', '2025-11-24 05:32:43'),
(387, 271, 'SAM-NVME-1TB', '1TB', 1800000.00, 30, 1, 1, '2025-11-24 05:32:43', '2025-11-24 05:32:43'),
(388, 271, 'SAM-NVME-1TB-PRO', 'Pro', 2100000.00, 10, 1, 0, '2025-11-24 05:32:43', '2025-11-24 05:32:43'),
(389, 272, 'WD-NVME-512GB', '512GB', 900000.00, 40, 1, 1, '2025-11-24 05:32:43', '2025-11-24 05:32:43'),
(390, 272, 'WD-NVME-512GB-PRO', '512GB Pro', 1050000.00, 20, 1, 0, '2025-11-24 05:32:43', '2025-11-24 05:32:43'),
(391, 273, 'CRU-SATA-1TB', '1TB', 850000.00, 25, 1, 1, '2025-11-24 05:32:43', '2025-11-24 05:32:43'),
(392, 273, 'CRU-SATA-1TB-BUDGET', 'Budget', 780000.00, 18, 1, 0, '2025-11-24 05:32:43', '2025-11-24 05:32:43'),
(393, 274, 'ASUS-Z790A-ATX', 'ATX', 4200000.00, 8, 1, 1, '2025-11-24 05:32:43', '2025-11-24 05:32:43'),
(394, 274, 'ASUS-Z790A-PRO', 'Pro', 4500000.00, 3, 1, 0, '2025-11-24 05:32:43', '2025-11-24 05:32:43'),
(395, 275, 'MSI-B650-TOMAHAWK', 'Standard', 3200000.00, 12, 1, 1, '2025-11-24 05:32:43', '2025-11-24 05:32:43'),
(396, 275, 'MSI-B650-TOMAHAWK-MINI', 'mATX', 3400000.00, 6, 1, 0, '2025-11-24 05:32:43', '2025-11-24 05:32:43'),
(397, 276, 'GIG-B660M-DS3H', 'Standard', 1500000.00, 20, 1, 1, '2025-11-24 05:32:43', '2025-11-24 05:32:43'),
(398, 276, 'GIG-B660M-DS3H-LOW', 'Low Price', 1350000.00, 10, 1, 0, '2025-11-24 05:32:43', '2025-11-24 05:32:43'),
(399, 277, 'CRS-RM650X', '650W Gold', 2400000.00, 18, 1, 1, '2025-11-24 05:32:43', '2025-11-24 05:32:43'),
(400, 278, 'SSN-GX750', '750W Gold', 3000000.00, 10, 1, 1, '2025-11-24 05:32:43', '2025-11-24 14:41:59'),
(401, 279, 'CM-MWE650', '650W', 1200000.00, 22, 1, 1, '2025-11-24 05:32:43', '2025-11-24 05:32:43'),
(402, 277, 'CRS-RM650X-LTD', 'Limited', 2600000.00, 6, 1, 0, '2025-11-24 05:32:43', '2025-11-24 05:32:43'),
(403, 278, 'SSN-GX750-PL', 'Platinum', 3400000.00, 4, 1, 0, '2025-11-24 05:32:43', '2025-11-24 05:32:43'),
(404, 279, 'CM-MWE650-BUD', 'Budget', 1050000.00, 15, 1, 0, '2025-11-24 05:32:43', '2025-11-24 05:32:43'),
(405, 280, 'CRS-4000D-BL', 'Black', 1800000.00, 14, 1, 1, '2025-11-24 05:32:43', '2025-11-24 05:32:43'),
(406, 280, 'CRS-4000D-WT', 'White', 1850000.00, 6, 1, 0, '2025-11-24 05:32:43', '2025-11-24 05:32:43'),
(407, 281, 'FRA-DEFINE7-C', 'Compact', 2500000.00, 5, 1, 1, '2025-11-24 05:32:43', '2025-11-24 05:32:43'),
(408, 282, 'NZXT-H510', 'Standard', 1200000.00, 20, 1, 1, '2025-11-24 05:32:43', '2025-11-24 05:32:43'),
(409, 281, 'FRA-DEFINE7-MIN', 'Mini', 2300000.00, 3, 1, 0, '2025-11-24 05:32:43', '2025-11-24 05:32:43'),
(410, 282, 'NZXT-H510-LTD', 'Limited', 1350000.00, 4, 1, 0, '2025-11-24 05:32:43', '2025-11-24 05:32:43'),
(411, 283, 'CRS-H100I-240', '240mm', 2200000.00, 11, 1, 1, '2025-11-24 05:32:43', '2025-11-24 05:32:43'),
(412, 283, 'CRS-H100I-240-ELITE', 'Elite', 2600000.00, 5, 1, 0, '2025-11-24 05:32:43', '2025-11-24 05:32:43'),
(413, 284, 'NOCTUA-NH-D15', 'Dual Tower', 2000000.00, 7, 1, 1, '2025-11-24 05:32:43', '2025-11-24 05:32:43'),
(414, 284, 'NOCTUA-NH-D15-LTD', 'Limited', 2300000.00, 2, 1, 0, '2025-11-24 05:32:43', '2025-11-24 05:32:43'),
(415, 285, 'DEEP-LS520-240', '240mm', 2100000.00, 9, 1, 1, '2025-11-24 05:32:43', '2025-11-24 05:32:43'),
(416, 285, 'DEEP-LS520-AIR', 'Air', 1600000.00, 13, 1, 0, '2025-11-24 05:32:43', '2025-11-24 05:32:43'),
(417, 286, 'ST-1TB-7200', '1TB 7200RPM', 1400000.00, 25, 1, 1, '2025-11-24 05:32:43', '2025-11-24 05:32:43'),
(418, 286, 'ST-1TB-7200-BUD', '1TB Budget', 1300000.00, 12, 1, 0, '2025-11-24 05:32:43', '2025-11-24 05:32:43'),
(419, 287, 'WD-4TB-5400', '4TB 5400RPM', 2200000.00, 10, 1, 1, '2025-11-24 05:32:43', '2025-11-24 05:32:43'),
(420, 287, 'WD-4TB-5400-B', '4TB Budget', 2050000.00, 6, 1, 0, '2025-11-24 05:32:43', '2025-11-24 05:32:43'),
(421, 288, 'TOSH-8TB-7200', '8TB 7200RPM', 4800000.00, 3, 1, 1, '2025-11-24 05:32:43', '2025-11-24 05:32:43'),
(422, 288, 'TOSH-8TB-7200-PRO', 'Pro', 5100000.00, 1, 1, 0, '2025-11-24 05:32:43', '2025-11-24 05:32:43'),
(423, 289, 'GSK-TRIDENTZ-DDR4-16-1', '2x8GB Kit', 900000.00, 30, 1, 1, '2025-11-24 05:32:43', '2025-11-24 05:32:43'),
(424, 289, 'GSK-TRIDENTZ-DDR4-16-2', 'RGB Kit', 980000.00, 12, 1, 0, '2025-11-24 05:32:43', '2025-11-24 05:32:43'),
(425, 290, 'CRS-VENGE-DDR5-32-1', '2x16GB', 2200000.00, 10, 1, 1, '2025-11-24 05:32:43', '2025-11-24 05:32:43'),
(426, 290, 'CRS-VENGE-DDR5-32-2', '2x16GB RGB', 2350000.00, 4, 1, 0, '2025-11-24 05:32:43', '2025-11-24 05:32:43'),
(427, 291, 'KNG-FURY-DDR4-64-1', '2x32GB', 4200000.00, 5, 1, 1, '2025-11-24 05:32:43', '2025-11-24 05:32:43'),
(428, 291, 'KNG-FURY-DDR4-64-2', '2x32GB RGB', 4400000.00, 2, 1, 0, '2025-11-24 05:32:43', '2025-11-24 05:32:43'),
(429, 292, '3600-Intel', '3600-Intel', 100000.00, 80, 1, 1, '2025-11-25 06:01:36', '2025-11-25 06:01:36');

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
  `session_token` varchar(128) DEFAULT NULL,
  `admin_session_token` varchar(128) DEFAULT NULL COMMENT 'Session token for admin login',
  `user_session_token` varchar(128) DEFAULT NULL COMMENT 'Session token for user login'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`user_id`, `username`, `email`, `password_hash`, `full_name`, `phone`, `role`, `is_active`, `created_at`, `updated_at`, `last_login`, `session_token`, `admin_session_token`, `user_session_token`) VALUES
(5, 'admin1', 'admin1@gmail.com', '$2b$10$b9lCzWVznD4ZMQ1Y6/bOc.Jn6efXZS1Us.ZjYVv2PFgHkqKr1PD1.', 'aaa', '0123456789', 2, 0, '2025-11-05 09:18:39', '2025-11-23 11:21:43', NULL, NULL, NULL, NULL),
(6, 'admin', 'admin@gmail.com', '$2b$10$84e9xqnTc50CPaf5pOldT.Ob9zW9/RVK.G3Whr.TdAncfRdE.UivG', 'admin', '0123456788', 2, 1, '2025-11-05 09:33:52', '2025-11-24 14:32:17', NULL, 'b69bfdf666d4c6d6db8a38aa39ce0aaf32bc8b812d7545f03399bdc9593ffa76', 'd018d2747ca149bbac36a5f5b3423a3880a671c2c758341337c0e8f92de73207', NULL),
(17, 'ad1', 'ad1@gmail.com', '$2b$10$zE.RfZEcYf/th.S7Krdkmu/l0jDW7Nq3Ge9eP4lU78KVlVJzXCUwG', 'ad1', '0987676765', 2, 1, '2025-11-23 11:15:30', '2025-11-25 04:53:37', NULL, NULL, 'a7905b30876bcf774bdc6471719e0c838a5b67accefde30476fb428b0acbeeaa', NULL),
(20, 'tranthib671', 'thib@gmail.com', '$2b$10$KQc2staSc5WX/9OIkHi3reX8XJO8L51YDjK.N5YP5XpPaghoLS.rK', 'Trần Thị B', '0908787671', 0, 1, '2025-11-24 12:44:44', '2025-11-24 14:37:07', NULL, NULL, NULL, NULL),
(21, 'nguyenvana561', 'vana@gmail.com', '$2b$10$AUdU1V0dW6n0Eh1tJ1Nw6.vvvjGnlWOCVmHPXSMuuDCFolwPwXrLO', 'Nguyễn Văn A', '0908786561', 0, 1, '2025-11-24 14:41:59', '2025-11-24 14:44:15', NULL, NULL, NULL, '1f6760867b1d28a485e386f364b7f9e4fe3498d6bace8650e6285242443d33ff'),
(22, 'a', 'a@gmail.com', '$2b$10$VjJ5iRg7oZrR1NGGUr61muIe/mSd1OQxP7ic2akApHitC3XH14cK6', NULL, NULL, 0, 1, '2025-11-25 05:07:22', '2025-11-25 05:07:28', NULL, NULL, NULL, 'beb07304249a617ff8d169d1d778d5493e72513a5a7fde987f62c9314905cdeb');

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
(374, 115),
(374, 119),
(374, 124),
(375, 1),
(375, 3),
(376, 1),
(376, 6),
(377, 2),
(377, 4),
(378, 2),
(378, 9),
(379, 1),
(379, 7),
(380, 1),
(380, 8),
(381, 14),
(381, 16),
(382, 16),
(382, 25),
(383, 14),
(383, 17),
(384, 17),
(384, 24),
(385, 15),
(385, 19),
(386, 20),
(386, 26),
(387, 49),
(387, 54),
(388, 49),
(388, 58),
(389, 50),
(389, 54),
(390, 50),
(390, 57),
(391, 51),
(391, 55),
(392, 51),
(392, 59),
(393, 62),
(393, 66),
(394, 62),
(394, 69),
(395, 63),
(395, 67),
(396, 63),
(396, 70),
(397, 64),
(397, 68),
(398, 64),
(398, 71),
(399, 75),
(399, 80),
(400, 76),
(400, 81),
(401, 77),
(401, 82),
(402, 75),
(402, 81),
(403, 76),
(403, 83),
(404, 77),
(404, 84),
(405, 89),
(405, 94),
(406, 89),
(406, 97),
(407, 90),
(407, 95),
(408, 91),
(408, 96),
(409, 92),
(409, 97),
(410, 93),
(410, 98),
(411, 101),
(411, 106),
(412, 101),
(412, 108),
(413, 102),
(413, 107),
(414, 102),
(414, 112),
(415, 103),
(415, 106),
(416, 103),
(416, 110),
(417, 115),
(417, 119),
(417, 124),
(418, 115),
(418, 118),
(419, 116),
(419, 121),
(419, 123),
(420, 116),
(420, 120),
(421, 117),
(421, 122),
(422, 117),
(422, 119),
(423, 32),
(423, 36),
(424, 32),
(424, 37),
(425, 31),
(425, 38),
(426, 31),
(426, 39),
(427, 33),
(427, 36),
(428, 33),
(428, 40),
(429, 1),
(429, 126);

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
  ADD KEY `fk_installment_order` (`order_id`),
  ADD KEY `idx_down_payment_status` (`down_payment_status`);

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
  ADD KEY `idx_role` (`role`),
  ADD KEY `idx_admin_session` (`admin_session_token`),
  ADD KEY `idx_user_session` (`user_session_token`);

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
  MODIFY `address_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- AUTO_INCREMENT cho bảng `articles`
--
ALTER TABLE `articles`
  MODIFY `article_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `attributes`
--
ALTER TABLE `attributes`
  MODIFY `attribute_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT cho bảng `attribute_categories`
--
ALTER TABLE `attribute_categories`
  MODIFY `attribute_category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT cho bảng `attribute_values`
--
ALTER TABLE `attribute_values`
  MODIFY `attribute_value_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=136;

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
  MODIFY `cart_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT cho bảng `cart_items`
--
ALTER TABLE `cart_items`
  MODIFY `cart_item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=69;

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
  MODIFY `installment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT cho bảng `installment_payments`
--
ALTER TABLE `installment_payments`
  MODIFY `payment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT cho bảng `notifications`
--
ALTER TABLE `notifications`
  MODIFY `notification_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT cho bảng `order_items`
--
ALTER TABLE `order_items`
  MODIFY `order_item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=71;

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
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=293;

--
-- AUTO_INCREMENT cho bảng `product_variants`
--
ALTER TABLE `product_variants`
  MODIFY `variant_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=430;

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
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

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
