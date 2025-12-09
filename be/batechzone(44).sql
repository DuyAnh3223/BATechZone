-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th12 09, 2025 lúc 02:16 PM
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
(53, 21, 'Nguyễn Văn A', '0908786561', '123 Thạch Lãm', NULL, 'hcm', 'Quận 1', NULL, NULL, 'Vietnam', 0, 'other', '2025-11-24 14:41:59', '2025-11-24 14:41:59'),
(54, 20, 'tranthib671', '0908787671', '32 Bùi Ngọ', NULL, 'hcm', 'Quận 2', NULL, NULL, 'Vietnam', 0, 'other', '2025-11-29 12:02:28', '2025-11-29 12:02:28'),
(55, 20, 'dddd', '0123456788', '123. dsa', NULL, 'hcm', 'q1', NULL, NULL, 'Vietnam', 0, 'other', '2025-12-05 03:04:16', '2025-12-05 03:04:16'),
(56, 20, 'nguyen van a', '0123456788', 'abc,123', NULL, 'hcm', 'q1', NULL, NULL, 'Vietnam', 0, 'other', '2025-12-05 03:09:03', '2025-12-05 03:09:03'),
(57, 20, 'nguyen van a', '0123456788', 'abcd', NULL, 'hcm', 'q1', NULL, NULL, 'Vietnam', 0, 'other', '2025-12-05 03:30:19', '2025-12-05 03:30:19'),
(58, 20, 'nguyen van a', '0123456788', '123, dsa', NULL, 'hcm', 'q1', NULL, NULL, 'Vietnam', 0, 'other', '2025-12-05 04:28:59', '2025-12-05 04:28:59'),
(59, 20, 'nguyen van a', '0123456788', '321,uu', NULL, 'hcm', 'q1', NULL, NULL, 'Vietnam', 0, 'other', '2025-12-05 05:58:27', '2025-12-05 05:58:27'),
(60, 20, 'nguyen van a', '0123456788', 'abc', NULL, 'hcm', 'q1', NULL, NULL, 'Vietnam', 0, 'other', '2025-12-05 07:52:57', '2025-12-05 07:52:57'),
(61, 20, 'tranthib671', '0123456788', 'abcd', NULL, 'hcm', 'Quận Bình Tân', NULL, NULL, 'Vietnam', 0, 'other', '2025-12-05 07:58:48', '2025-12-05 07:58:48'),
(62, 20, 'tranthib671', '0123456788', '123, dsa', NULL, 'hcm', 'Quận Bình Tân', NULL, NULL, 'Vietnam', 0, 'other', '2025-12-05 08:02:24', '2025-12-05 08:02:24'),
(63, 20, 'Trần Thị B', '0908787671', '32 Bùi Ngọ', NULL, 'hcm', 'Quận 8', NULL, NULL, 'Vietnam', 0, 'other', '2025-12-05 11:23:46', '2025-12-05 11:23:46'),
(64, 20, 'Trần Thị B', '0908787671', '32 Bùi Ngọ', NULL, 'hcm', 'Quận 7', NULL, NULL, 'Vietnam', 0, 'other', '2025-12-05 11:30:06', '2025-12-05 11:30:06'),
(65, 20, 'Trần Thị B', '0908787671', '32 Bùi Ngọ', NULL, 'hanoi', 'Ba Đình', NULL, NULL, 'Vietnam', 0, 'other', '2025-12-05 11:50:25', '2025-12-05 11:50:25'),
(66, 20, 'tranthib671', '0908787671', '32 Bùi Ngọ', NULL, 'hcm', 'Quận Bình Thạnh', NULL, NULL, 'Vietnam', 0, 'other', '2025-12-05 12:07:58', '2025-12-05 12:07:58'),
(67, 20, 'Trần Thị B', '0908787671', '32 Bùi Ngọ', NULL, 'hcm', 'q1', NULL, NULL, 'Vietnam', 0, 'other', '2025-12-05 12:24:41', '2025-12-05 12:24:41'),
(68, 20, 'Nguyen Van A', '0987654321', '32 To Lam', NULL, 'hcm', 'q1', NULL, NULL, 'Vietnam', 0, 'other', '2025-12-07 02:43:15', '2025-12-07 02:43:15'),
(69, 20, 'tranthib671', '0987654321', '42 Bui Ngo', NULL, 'hanoi', 'Bắc Từ Liêm', NULL, NULL, 'Vietnam', 0, 'other', '2025-12-07 02:48:00', '2025-12-07 02:48:00');

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
(41, 'Chipset', 'other', 0, 1, '2025-11-24 12:27:38'),
(42, 'Hãng', 'other', 1, 1, '2025-11-25 09:54:58'),
(43, 'Kích thước', 'size', 2, 1, '2025-11-25 09:54:58'),
(44, 'Độ phân giải', 'other', 3, 1, '2025-11-25 09:54:58'),
(45, 'Tấm nền', 'other', 4, 1, '2025-11-25 09:54:58'),
(46, 'Tần số quét', 'other', 5, 1, '2025-11-25 09:54:58'),
(47, 'Hãng', 'other', 1, 1, '2025-11-25 09:54:58'),
(48, 'Loại bàn phím', 'other', 2, 1, '2025-11-25 09:54:58'),
(49, 'Loại switch', 'other', 3, 1, '2025-11-25 09:54:58'),
(50, 'Kết nối', 'other', 4, 1, '2025-11-25 09:54:58'),
(51, 'RGB', 'other', 5, 1, '2025-11-25 09:54:58'),
(52, 'Hãng', 'other', 1, 1, '2025-11-25 09:54:58'),
(53, 'Kiểu chuột', 'other', 2, 1, '2025-11-25 09:54:58'),
(54, 'DPI', 'other', 3, 1, '2025-11-25 09:54:58'),
(55, 'Kết nối', 'other', 4, 1, '2025-11-25 09:54:58'),
(56, 'RGB', 'other', 5, 1, '2025-11-25 09:54:58'),
(57, 'Hãng', 'other', 1, 1, '2025-11-25 09:54:58'),
(58, 'Loại tai nghe', 'other', 2, 1, '2025-11-25 09:54:58'),
(59, 'Kết nối', 'other', 3, 1, '2025-11-25 09:54:58'),
(60, 'Micro', 'other', 4, 1, '2025-11-25 09:54:58'),
(61, 'RGB', 'other', 5, 1, '2025-11-25 09:54:58'),
(62, 'Hãng', 'other', 1, 1, '2025-11-25 09:54:58'),
(63, 'Loại loa', 'other', 2, 1, '2025-11-25 09:54:58'),
(64, 'Công suất', 'other', 3, 1, '2025-11-25 09:54:58'),
(65, 'Kết nối', 'other', 4, 1, '2025-11-25 09:54:58'),
(66, 'RGB', 'other', 5, 1, '2025-11-25 09:54:58'),
(67, 'Hãng', 'other', 1, 1, '2025-11-25 09:54:58'),
(68, 'Chất liệu', 'other', 2, 1, '2025-11-25 09:54:58'),
(69, 'Tính năng', 'other', 3, 1, '2025-11-25 09:54:58'),
(70, 'Màu sắc', 'color', 4, 1, '2025-11-25 09:54:58'),
(71, 'Trọng tải', 'other', 5, 1, '2025-11-25 09:54:58'),
(72, 'Hãng', 'other', 1, 1, '2025-11-25 09:54:58'),
(73, 'Kích thước', 'size', 2, 1, '2025-11-25 09:54:58'),
(74, 'Tốc độ', 'other', 3, 1, '2025-11-25 09:54:58'),
(75, 'RGB', 'other', 4, 1, '2025-11-25 09:54:58'),
(76, 'Loại bearing', 'other', 5, 1, '2025-11-25 09:54:58'),
(77, 'Hãng', 'other', 1, 1, '2025-11-25 09:54:58'),
(78, 'Loại tản', 'other', 2, 1, '2025-11-25 09:54:58'),
(79, 'Số ống nhiệt', 'other', 3, 1, '2025-11-25 09:54:58'),
(80, 'Socket hỗ trợ', 'other', 4, 1, '2025-11-25 09:54:58'),
(81, 'RGB', 'other', 5, 1, '2025-11-25 09:54:58'),
(82, 'Hãng', 'other', 1, 1, '2025-11-25 09:54:58'),
(83, 'Kích thước Radiator', 'size', 2, 1, '2025-11-25 09:54:58'),
(84, 'Số quạt', 'other', 3, 1, '2025-11-25 09:54:58'),
(85, 'Socket hỗ trợ', 'other', 4, 1, '2025-11-25 09:54:58'),
(86, 'RGB', 'other', 5, 1, '2025-11-25 09:54:58'),
(87, 'Hãng', 'other', 1, 1, '2025-11-25 09:54:58'),
(88, 'Loại linh kiện', 'other', 2, 1, '2025-11-25 09:54:58'),
(89, 'Kích thước', 'size', 3, 1, '2025-11-25 09:54:58'),
(90, 'Chất liệu', 'other', 4, 1, '2025-11-25 09:54:58'),
(91, 'RGB', 'other', 5, 1, '2025-11-25 09:54:58');

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
(42, 41, 5),
(43, 42, 40),
(44, 43, 40),
(45, 44, 40),
(46, 45, 40),
(47, 46, 40),
(48, 47, 41),
(49, 48, 41),
(50, 49, 41),
(51, 50, 41),
(52, 51, 41),
(53, 52, 42),
(54, 53, 42),
(55, 54, 42),
(56, 55, 42),
(57, 56, 42),
(58, 57, 43),
(59, 58, 43),
(60, 59, 43),
(61, 60, 43),
(62, 61, 43),
(63, 62, 44),
(64, 63, 44),
(65, 64, 44),
(66, 65, 44),
(67, 66, 44),
(68, 67, 45),
(69, 68, 45),
(70, 69, 45),
(71, 70, 45),
(72, 71, 45),
(73, 72, 46),
(74, 73, 46),
(75, 74, 46),
(76, 75, 46),
(77, 76, 46),
(78, 77, 47),
(79, 78, 47),
(80, 79, 47),
(81, 80, 47),
(82, 81, 47),
(83, 82, 48),
(84, 83, 48),
(85, 84, 48),
(86, 85, 48),
(87, 86, 48),
(88, 87, 49),
(89, 88, 49),
(90, 89, 49),
(91, 90, 49),
(92, 91, 49);

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
(135, 11, '8GB (1x8GB)', NULL, NULL, 0, 1, '2025-11-24 05:32:43'),
(136, 42, 'ASUS', NULL, NULL, 1, 1, '2025-11-25 09:54:58'),
(137, 42, 'MSI', NULL, NULL, 2, 1, '2025-11-25 09:54:58'),
(138, 42, 'LG', NULL, NULL, 3, 1, '2025-11-25 09:54:58'),
(139, 42, 'Samsung', NULL, NULL, 4, 1, '2025-11-25 09:54:58'),
(140, 42, 'Dell', NULL, NULL, 5, 1, '2025-11-25 09:54:58'),
(141, 42, 'Acer', NULL, NULL, 6, 1, '2025-11-25 09:54:58'),
(142, 42, 'ViewSonic', NULL, NULL, 7, 1, '2025-11-25 09:54:58'),
(143, 42, 'AOC', NULL, NULL, 8, 1, '2025-11-25 09:54:58'),
(144, 43, '24 inch', NULL, NULL, 1, 1, '2025-11-25 09:54:58'),
(145, 43, '27 inch', NULL, NULL, 2, 1, '2025-11-25 09:54:58'),
(146, 43, '32 inch', NULL, NULL, 3, 1, '2025-11-25 09:54:58'),
(147, 43, '34 inch', NULL, NULL, 4, 1, '2025-11-25 09:54:58'),
(148, 43, '49 inch', NULL, NULL, 5, 1, '2025-11-25 09:54:58'),
(149, 44, 'Full HD (1920x1080)', NULL, NULL, 1, 1, '2025-11-25 09:54:58'),
(150, 44, '2K (2560x1440)', NULL, NULL, 2, 1, '2025-11-25 09:54:58'),
(151, 44, '4K (3840x2160)', NULL, NULL, 3, 1, '2025-11-25 09:54:58'),
(152, 44, 'Ultrawide (3440x1440)', NULL, NULL, 4, 1, '2025-11-25 09:54:58'),
(153, 45, 'IPS', NULL, NULL, 1, 1, '2025-11-25 09:54:58'),
(154, 45, 'VA', NULL, NULL, 2, 1, '2025-11-25 09:54:58'),
(155, 45, 'TN', NULL, NULL, 3, 1, '2025-11-25 09:54:58'),
(156, 45, 'OLED', NULL, NULL, 4, 1, '2025-11-25 09:54:58'),
(157, 46, '60Hz', NULL, NULL, 1, 1, '2025-11-25 09:54:58'),
(158, 46, '75Hz', NULL, NULL, 2, 1, '2025-11-25 09:54:58'),
(159, 46, '144Hz', NULL, NULL, 3, 1, '2025-11-25 09:54:58'),
(160, 46, '165Hz', NULL, NULL, 4, 1, '2025-11-25 09:54:58'),
(161, 46, '240Hz', NULL, NULL, 5, 1, '2025-11-25 09:54:58'),
(162, 46, '360Hz', NULL, NULL, 6, 1, '2025-11-25 09:54:58'),
(163, 47, 'Corsair', NULL, NULL, 1, 1, '2025-11-25 09:54:58'),
(164, 47, 'Logitech', NULL, NULL, 2, 1, '2025-11-25 09:54:58'),
(165, 47, 'Razer', NULL, NULL, 3, 1, '2025-11-25 09:54:58'),
(166, 47, 'SteelSeries', NULL, NULL, 4, 1, '2025-11-25 09:54:58'),
(167, 47, 'HyperX', NULL, NULL, 5, 1, '2025-11-25 09:54:58'),
(168, 47, 'Keychron', NULL, NULL, 6, 1, '2025-11-25 09:54:58'),
(169, 47, 'DareU', NULL, NULL, 7, 1, '2025-11-25 09:54:58'),
(170, 47, 'Akko', NULL, NULL, 8, 1, '2025-11-25 09:54:58'),
(171, 48, 'Cơ (Mechanical)', NULL, NULL, 1, 1, '2025-11-25 09:54:58'),
(172, 48, 'Màng (Membrane)', NULL, NULL, 2, 1, '2025-11-25 09:54:58'),
(173, 48, 'Optical', NULL, NULL, 3, 1, '2025-11-25 09:54:58'),
(174, 48, 'Hybrid', NULL, NULL, 4, 1, '2025-11-25 09:54:58'),
(175, 49, 'Cherry MX Red', NULL, NULL, 1, 1, '2025-11-25 09:54:58'),
(176, 49, 'Cherry MX Blue', NULL, NULL, 2, 1, '2025-11-25 09:54:58'),
(177, 49, 'Cherry MX Brown', NULL, NULL, 3, 1, '2025-11-25 09:54:58'),
(178, 49, 'Gateron Red', NULL, NULL, 4, 1, '2025-11-25 09:54:58'),
(179, 49, 'Gateron Blue', NULL, NULL, 5, 1, '2025-11-25 09:54:58'),
(180, 49, 'Gateron Brown', NULL, NULL, 6, 1, '2025-11-25 09:54:58'),
(181, 49, 'Kailh Red', NULL, NULL, 7, 1, '2025-11-25 09:54:58'),
(182, 49, 'Kailh Blue', NULL, NULL, 8, 1, '2025-11-25 09:54:58'),
(183, 50, 'USB có dây', NULL, NULL, 1, 1, '2025-11-25 09:54:58'),
(184, 50, 'Wireless 2.4GHz', NULL, NULL, 2, 1, '2025-11-25 09:54:58'),
(185, 50, 'Bluetooth', NULL, NULL, 3, 1, '2025-11-25 09:54:58'),
(186, 50, 'Dual Mode', NULL, NULL, 4, 1, '2025-11-25 09:54:58'),
(187, 50, 'Tri Mode', NULL, NULL, 5, 1, '2025-11-25 09:54:58'),
(188, 51, 'Có RGB', NULL, NULL, 1, 1, '2025-11-25 09:54:58'),
(189, 51, 'Đơn sắc', NULL, NULL, 2, 1, '2025-11-25 09:54:58'),
(190, 51, 'Không đèn', NULL, NULL, 3, 1, '2025-11-25 09:54:58'),
(191, 52, 'Logitech', NULL, NULL, 1, 1, '2025-11-25 09:54:58'),
(192, 52, 'Razer', NULL, NULL, 2, 1, '2025-11-25 09:54:58'),
(193, 52, 'SteelSeries', NULL, NULL, 3, 1, '2025-11-25 09:54:58'),
(194, 52, 'Corsair', NULL, NULL, 4, 1, '2025-11-25 09:54:58'),
(195, 52, 'HyperX', NULL, NULL, 5, 1, '2025-11-25 09:54:58'),
(196, 52, 'Glorious', NULL, NULL, 6, 1, '2025-11-25 09:54:58'),
(197, 52, 'DareU', NULL, NULL, 7, 1, '2025-11-25 09:54:58'),
(198, 52, 'Asus ROG', NULL, NULL, 8, 1, '2025-11-25 09:54:58'),
(199, 53, 'Gaming', NULL, NULL, 1, 1, '2025-11-25 09:54:58'),
(200, 53, 'Văn phòng', NULL, NULL, 2, 1, '2025-11-25 09:54:58'),
(201, 53, 'Ergonomic', NULL, NULL, 3, 1, '2025-11-25 09:54:58'),
(202, 53, 'Ultra-light', NULL, NULL, 4, 1, '2025-11-25 09:54:58'),
(203, 54, '800-1600 DPI', NULL, NULL, 1, 1, '2025-11-25 09:54:58'),
(204, 54, '3200 DPI', NULL, NULL, 2, 1, '2025-11-25 09:54:58'),
(205, 54, '6400 DPI', NULL, NULL, 3, 1, '2025-11-25 09:54:58'),
(206, 54, '12000 DPI', NULL, NULL, 4, 1, '2025-11-25 09:54:58'),
(207, 54, '16000 DPI', NULL, NULL, 5, 1, '2025-11-25 09:54:58'),
(208, 54, '25600 DPI', NULL, NULL, 6, 1, '2025-11-25 09:54:58'),
(209, 55, 'USB có dây', NULL, NULL, 1, 1, '2025-11-25 09:54:58'),
(210, 55, 'Wireless 2.4GHz', NULL, NULL, 2, 1, '2025-11-25 09:54:58'),
(211, 55, 'Bluetooth', NULL, NULL, 3, 1, '2025-11-25 09:54:58'),
(212, 55, 'Dual Mode', NULL, NULL, 4, 1, '2025-11-25 09:54:58'),
(213, 56, 'Có RGB', NULL, NULL, 1, 1, '2025-11-25 09:54:58'),
(214, 56, 'Đơn sắc', NULL, NULL, 2, 1, '2025-11-25 09:54:58'),
(215, 56, 'Không đèn', NULL, NULL, 3, 1, '2025-11-25 09:54:58'),
(216, 57, 'Logitech', NULL, NULL, 1, 1, '2025-11-25 09:54:58'),
(217, 57, 'Razer', NULL, NULL, 2, 1, '2025-11-25 09:54:58'),
(218, 57, 'SteelSeries', NULL, NULL, 3, 1, '2025-11-25 09:54:58'),
(219, 57, 'Corsair', NULL, NULL, 4, 1, '2025-11-25 09:54:58'),
(220, 57, 'HyperX', NULL, NULL, 5, 1, '2025-11-25 09:54:58'),
(221, 57, 'Sony', NULL, NULL, 6, 1, '2025-11-25 09:54:58'),
(222, 57, 'Edifier', NULL, NULL, 7, 1, '2025-11-25 09:54:58'),
(223, 57, 'JBL', NULL, NULL, 8, 1, '2025-11-25 09:54:58'),
(224, 58, 'Gaming', NULL, NULL, 1, 1, '2025-11-25 09:54:58'),
(225, 58, 'Âm nhạc', NULL, NULL, 2, 1, '2025-11-25 09:54:58'),
(226, 58, 'Chống ồn (ANC)', NULL, NULL, 3, 1, '2025-11-25 09:54:58'),
(227, 58, 'Văn phòng', NULL, NULL, 4, 1, '2025-11-25 09:54:58'),
(228, 59, 'Jack 3.5mm', NULL, NULL, 1, 1, '2025-11-25 09:54:58'),
(229, 59, 'USB', NULL, NULL, 2, 1, '2025-11-25 09:54:58'),
(230, 59, 'Wireless 2.4GHz', NULL, NULL, 3, 1, '2025-11-25 09:54:58'),
(231, 59, 'Bluetooth', NULL, NULL, 4, 1, '2025-11-25 09:54:58'),
(232, 60, 'Có mic rời', NULL, NULL, 1, 1, '2025-11-25 09:54:58'),
(233, 60, 'Mic gắn liền', NULL, NULL, 2, 1, '2025-11-25 09:54:58'),
(234, 60, 'Không mic', NULL, NULL, 3, 1, '2025-11-25 09:54:58'),
(235, 61, 'Có RGB', NULL, NULL, 1, 1, '2025-11-25 09:54:58'),
(236, 61, 'Đơn sắc', NULL, NULL, 2, 1, '2025-11-25 09:54:58'),
(237, 61, 'Không đèn', NULL, NULL, 3, 1, '2025-11-25 09:54:58'),
(238, 62, 'Edifier', NULL, NULL, 1, 1, '2025-11-25 09:54:58'),
(239, 62, 'Logitech', NULL, NULL, 2, 1, '2025-11-25 09:54:58'),
(240, 62, 'Creative', NULL, NULL, 3, 1, '2025-11-25 09:54:58'),
(241, 62, 'JBL', NULL, NULL, 4, 1, '2025-11-25 09:54:58'),
(242, 62, 'Harman Kardon', NULL, NULL, 5, 1, '2025-11-25 09:54:58'),
(243, 62, 'Razer', NULL, NULL, 6, 1, '2025-11-25 09:54:58'),
(244, 63, '2.0', NULL, NULL, 1, 1, '2025-11-25 09:54:58'),
(245, 63, '2.1', NULL, NULL, 2, 1, '2025-11-25 09:54:58'),
(246, 63, '5.1', NULL, NULL, 3, 1, '2025-11-25 09:54:58'),
(247, 63, 'Soundbar', NULL, NULL, 4, 1, '2025-11-25 09:54:58'),
(248, 64, '10W - 20W', NULL, NULL, 1, 1, '2025-11-25 09:54:58'),
(249, 64, '20W - 50W', NULL, NULL, 2, 1, '2025-11-25 09:54:58'),
(250, 64, '50W - 100W', NULL, NULL, 3, 1, '2025-11-25 09:54:58'),
(251, 64, 'Trên 100W', NULL, NULL, 4, 1, '2025-11-25 09:54:58'),
(252, 65, 'Jack 3.5mm', NULL, NULL, 1, 1, '2025-11-25 09:54:58'),
(253, 65, 'USB', NULL, NULL, 2, 1, '2025-11-25 09:54:58'),
(254, 65, 'Bluetooth', NULL, NULL, 3, 1, '2025-11-25 09:54:58'),
(255, 65, 'Optical', NULL, NULL, 4, 1, '2025-11-25 09:54:58'),
(256, 66, 'Có RGB', NULL, NULL, 1, 1, '2025-11-25 09:54:58'),
(257, 66, 'Đơn sắc', NULL, NULL, 2, 1, '2025-11-25 09:54:58'),
(258, 66, 'Không đèn', NULL, NULL, 3, 1, '2025-11-25 09:54:58'),
(259, 67, 'DXRacer', NULL, NULL, 1, 1, '2025-11-25 09:54:58'),
(260, 67, 'Secretlab', NULL, NULL, 2, 1, '2025-11-25 09:54:58'),
(261, 67, 'E-Dra', NULL, NULL, 3, 1, '2025-11-25 09:54:58'),
(262, 67, 'AKRacing', NULL, NULL, 4, 1, '2025-11-25 09:54:58'),
(263, 67, 'Corsair', NULL, NULL, 5, 1, '2025-11-25 09:54:58'),
(264, 67, 'Noblechairs', NULL, NULL, 6, 1, '2025-11-25 09:54:58'),
(265, 68, 'Da PU', NULL, NULL, 1, 1, '2025-11-25 09:54:58'),
(266, 68, 'Da thật', NULL, NULL, 2, 1, '2025-11-25 09:54:58'),
(267, 68, 'Vải lưới', NULL, NULL, 3, 1, '2025-11-25 09:54:58'),
(268, 68, 'Vải cao cấp', NULL, NULL, 4, 1, '2025-11-25 09:54:58'),
(269, 69, 'Massage', NULL, NULL, 1, 1, '2025-11-25 09:54:58'),
(270, 69, 'Ngả 180°', NULL, NULL, 2, 1, '2025-11-25 09:54:58'),
(271, 69, 'Tựa chân', NULL, NULL, 3, 1, '2025-11-25 09:54:58'),
(272, 69, 'Điều chỉnh 4D', NULL, NULL, 4, 1, '2025-11-25 09:54:58'),
(273, 70, 'Đen', NULL, NULL, 1, 1, '2025-11-25 09:54:58'),
(274, 70, 'Đỏ đen', NULL, NULL, 2, 1, '2025-11-25 09:54:58'),
(275, 70, 'Xanh đen', NULL, NULL, 3, 1, '2025-11-25 09:54:58'),
(276, 70, 'Trắng đen', NULL, NULL, 4, 1, '2025-11-25 09:54:58'),
(277, 70, 'Hồng', NULL, NULL, 5, 1, '2025-11-25 09:54:58'),
(278, 71, 'Dưới 100kg', NULL, NULL, 1, 1, '2025-11-25 09:54:58'),
(279, 71, '100-120kg', NULL, NULL, 2, 1, '2025-11-25 09:54:58'),
(280, 71, '120-150kg', NULL, NULL, 3, 1, '2025-11-25 09:54:58'),
(281, 71, 'Trên 150kg', NULL, NULL, 4, 1, '2025-11-25 09:54:58'),
(282, 72, 'Corsair', NULL, NULL, 1, 1, '2025-11-25 09:54:58'),
(283, 72, 'NZXT', NULL, NULL, 2, 1, '2025-11-25 09:54:58'),
(284, 72, 'Cooler Master', NULL, NULL, 3, 1, '2025-11-25 09:54:58'),
(285, 72, 'Thermaltake', NULL, NULL, 4, 1, '2025-11-25 09:54:58'),
(286, 72, 'Deepcool', NULL, NULL, 5, 1, '2025-11-25 09:54:58'),
(287, 72, 'be quiet!', NULL, NULL, 6, 1, '2025-11-25 09:54:58'),
(288, 72, 'Noctua', NULL, NULL, 7, 1, '2025-11-25 09:54:58'),
(289, 72, 'Arctic', NULL, NULL, 8, 1, '2025-11-25 09:54:58'),
(290, 73, '120mm', NULL, NULL, 1, 1, '2025-11-25 09:54:58'),
(291, 73, '140mm', NULL, NULL, 2, 1, '2025-11-25 09:54:58'),
(292, 73, '200mm', NULL, NULL, 3, 1, '2025-11-25 09:54:58'),
(293, 74, '1000-1500 RPM', NULL, NULL, 1, 1, '2025-11-25 09:54:58'),
(294, 74, '1500-2000 RPM', NULL, NULL, 2, 1, '2025-11-25 09:54:58'),
(295, 74, '2000+ RPM', NULL, NULL, 3, 1, '2025-11-25 09:54:58'),
(296, 75, 'RGB ARGB', NULL, NULL, 1, 1, '2025-11-25 09:54:58'),
(297, 75, 'RGB', NULL, NULL, 2, 1, '2025-11-25 09:54:58'),
(298, 75, 'Đơn sắc', NULL, NULL, 3, 1, '2025-11-25 09:54:58'),
(299, 75, 'Không đèn', NULL, NULL, 4, 1, '2025-11-25 09:54:58'),
(300, 76, 'Rifle Bearing', NULL, NULL, 1, 1, '2025-11-25 09:54:58'),
(301, 76, 'Fluid Dynamic Bearing', NULL, NULL, 2, 1, '2025-11-25 09:54:58'),
(302, 76, 'Magnetic Levitation', NULL, NULL, 3, 1, '2025-11-25 09:54:58'),
(303, 76, 'Hydraulic Bearing', NULL, NULL, 4, 1, '2025-11-25 09:54:58'),
(304, 77, 'Noctua', NULL, NULL, 1, 1, '2025-11-25 09:54:58'),
(305, 77, 'be quiet!', NULL, NULL, 2, 1, '2025-11-25 09:54:58'),
(306, 77, 'Cooler Master', NULL, NULL, 3, 1, '2025-11-25 09:54:58'),
(307, 77, 'Deepcool', NULL, NULL, 4, 1, '2025-11-25 09:54:58'),
(308, 77, 'Thermalright', NULL, NULL, 5, 1, '2025-11-25 09:54:58'),
(309, 77, 'Arctic', NULL, NULL, 6, 1, '2025-11-25 09:54:58'),
(310, 78, 'Tower đơn', NULL, NULL, 1, 1, '2025-11-25 09:54:58'),
(311, 78, 'Tower đôi', NULL, NULL, 2, 1, '2025-11-25 09:54:58'),
(312, 78, 'Low profile', NULL, NULL, 3, 1, '2025-11-25 09:54:58'),
(313, 79, '2 ống nhiệt', NULL, NULL, 1, 1, '2025-11-25 09:54:58'),
(314, 79, '4 ống nhiệt', NULL, NULL, 2, 1, '2025-11-25 09:54:58'),
(315, 79, '5 ống nhiệt', NULL, NULL, 3, 1, '2025-11-25 09:54:58'),
(316, 79, '6 ống nhiệt', NULL, NULL, 4, 1, '2025-11-25 09:54:58'),
(317, 79, '7+ ống nhiệt', NULL, NULL, 5, 1, '2025-11-25 09:54:58'),
(318, 80, 'Intel LGA1700', NULL, NULL, 1, 1, '2025-11-25 09:54:58'),
(319, 80, 'Intel LGA1200', NULL, NULL, 2, 1, '2025-11-25 09:54:58'),
(320, 80, 'Intel LGA1151', NULL, NULL, 3, 1, '2025-11-25 09:54:58'),
(321, 80, 'AMD AM5', NULL, NULL, 4, 1, '2025-11-25 09:54:58'),
(322, 80, 'AMD AM4', NULL, NULL, 5, 1, '2025-11-25 09:54:58'),
(323, 80, 'Universal', NULL, NULL, 6, 1, '2025-11-25 09:54:58'),
(324, 81, 'RGB ARGB', NULL, NULL, 1, 1, '2025-11-25 09:54:58'),
(325, 81, 'RGB', NULL, NULL, 2, 1, '2025-11-25 09:54:58'),
(326, 81, 'Không đèn', NULL, NULL, 3, 1, '2025-11-25 09:54:58'),
(327, 82, 'Corsair', NULL, NULL, 1, 1, '2025-11-25 09:54:58'),
(328, 82, 'NZXT', NULL, NULL, 2, 1, '2025-11-25 09:54:58'),
(329, 82, 'Cooler Master', NULL, NULL, 3, 1, '2025-11-25 09:54:58'),
(330, 82, 'Deepcool', NULL, NULL, 4, 1, '2025-11-25 09:54:58'),
(331, 82, 'MSI', NULL, NULL, 5, 1, '2025-11-25 09:54:58'),
(332, 82, 'ASUS', NULL, NULL, 6, 1, '2025-11-25 09:54:58'),
(333, 82, 'Thermaltake', NULL, NULL, 7, 1, '2025-11-25 09:54:58'),
(334, 82, 'Arctic', NULL, NULL, 8, 1, '2025-11-25 09:54:58'),
(335, 83, '120mm', NULL, NULL, 1, 1, '2025-11-25 09:54:58'),
(336, 83, '240mm', NULL, NULL, 2, 1, '2025-11-25 09:54:58'),
(337, 83, '280mm', NULL, NULL, 3, 1, '2025-11-25 09:54:58'),
(338, 83, '360mm', NULL, NULL, 4, 1, '2025-11-25 09:54:58'),
(339, 83, '420mm', NULL, NULL, 5, 1, '2025-11-25 09:54:58'),
(340, 84, '1 quạt', NULL, NULL, 1, 1, '2025-11-25 09:54:58'),
(341, 84, '2 quạt', NULL, NULL, 2, 1, '2025-11-25 09:54:58'),
(342, 84, '3 quạt', NULL, NULL, 3, 1, '2025-11-25 09:54:58'),
(343, 85, 'Intel LGA1700', NULL, NULL, 1, 1, '2025-11-25 09:54:58'),
(344, 85, 'Intel LGA1200', NULL, NULL, 2, 1, '2025-11-25 09:54:58'),
(345, 85, 'Intel LGA1151', NULL, NULL, 3, 1, '2025-11-25 09:54:58'),
(346, 85, 'AMD AM5', NULL, NULL, 4, 1, '2025-11-25 09:54:58'),
(347, 85, 'AMD AM4', NULL, NULL, 5, 1, '2025-11-25 09:54:58'),
(348, 85, 'Universal', NULL, NULL, 6, 1, '2025-11-25 09:54:58'),
(349, 86, 'RGB ARGB', NULL, NULL, 1, 1, '2025-11-25 09:54:58'),
(350, 86, 'RGB', NULL, NULL, 2, 1, '2025-11-25 09:54:58'),
(351, 86, 'LCD Display', NULL, NULL, 3, 1, '2025-11-25 09:54:58'),
(352, 86, 'Không đèn', NULL, NULL, 4, 1, '2025-11-25 09:54:58'),
(353, 87, 'EK Water Blocks', NULL, NULL, 1, 1, '2025-11-25 09:54:58'),
(354, 87, 'Bitspower', NULL, NULL, 2, 1, '2025-11-25 09:54:58'),
(355, 87, 'Corsair', NULL, NULL, 3, 1, '2025-11-25 09:54:58'),
(356, 87, 'Thermaltake', NULL, NULL, 4, 1, '2025-11-25 09:54:58'),
(357, 87, 'Alphacool', NULL, NULL, 5, 1, '2025-11-25 09:54:58'),
(358, 87, 'Barrow', NULL, NULL, 6, 1, '2025-11-25 09:54:58'),
(359, 88, 'Water Block CPU', NULL, NULL, 1, 1, '2025-11-25 09:54:58'),
(360, 88, 'Water Block GPU', NULL, NULL, 2, 1, '2025-11-25 09:54:58'),
(361, 88, 'Radiator', NULL, NULL, 3, 1, '2025-11-25 09:54:58'),
(362, 88, 'Reservoir', NULL, NULL, 4, 1, '2025-11-25 09:54:58'),
(363, 88, 'Pump', NULL, NULL, 5, 1, '2025-11-25 09:54:58'),
(364, 88, 'Fitting', NULL, NULL, 6, 1, '2025-11-25 09:54:58'),
(365, 88, 'Ống', NULL, NULL, 7, 1, '2025-11-25 09:54:58'),
(366, 89, '120mm', NULL, NULL, 1, 1, '2025-11-25 09:54:58'),
(367, 89, '240mm', NULL, NULL, 2, 1, '2025-11-25 09:54:58'),
(368, 89, '280mm', NULL, NULL, 3, 1, '2025-11-25 09:54:58'),
(369, 89, '360mm', NULL, NULL, 4, 1, '2025-11-25 09:54:58'),
(370, 89, '480mm', NULL, NULL, 5, 1, '2025-11-25 09:54:58'),
(371, 90, 'Đồng (Copper)', NULL, NULL, 1, 1, '2025-11-25 09:54:58'),
(372, 90, 'Nhôm (Aluminum)', NULL, NULL, 2, 1, '2025-11-25 09:54:58'),
(373, 90, 'Acrylic', NULL, NULL, 3, 1, '2025-11-25 09:54:58'),
(374, 90, 'Thủy tinh', NULL, NULL, 4, 1, '2025-11-25 09:54:58'),
(375, 91, 'RGB ARGB', NULL, NULL, 1, 1, '2025-11-25 09:54:58'),
(376, 91, 'RGB', NULL, NULL, 2, 1, '2025-11-25 09:54:58'),
(377, 91, 'Không đèn', NULL, NULL, 3, 1, '2025-11-25 09:54:58');

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
(13, NULL, 'guest_1764904178852_7r4onzqri', '2025-12-05 03:09:38', '2025-12-05 03:09:38', '2026-01-04 03:09:38');

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
(69, 11, 501, 1, '2025-11-29 12:00:57', '2025-11-29 12:00:57'),
(112, 1, 374, 1, '2025-12-05 11:29:20', '2025-12-05 11:29:20'),
(120, 10, 501, 1, '2025-12-07 02:46:51', '2025-12-07 02:46:51');

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
(35, 'RAM', 'ram', NULL, NULL, '/uploads/categories/RAM-1763457131288-611013067.webp', NULL, 1, 0, '2025-11-16 13:14:05', '2025-11-18 09:12:11'),
(40, 'Monitor', 'monitor', 'Màn hình máy tính - Gaming monitor, màn hình văn phòng', NULL, '/uploads/categories/monitor-1764063376896-496519534.jpg', NULL, 1, 40, '2025-11-25 08:58:13', '2025-11-25 09:36:16'),
(41, 'Keyboard', 'keyboard', 'Bàn phím - Bàn phím cơ, bàn phím gaming', NULL, '/uploads/categories/keyboard-1764062589551-543344518.jpg', NULL, 1, 41, '2025-11-25 08:58:13', '2025-11-25 09:23:09'),
(42, 'Mouse', 'mouse', 'Chuột máy tính - Chuột gaming, chuột văn phòng', NULL, '/uploads/categories/mousewebp-1764063346830-923804201.jpg', NULL, 1, 42, '2025-11-25 08:58:13', '2025-11-25 09:35:46'),
(43, 'Headphone', 'headphone', 'Tai nghe - Tai nghe gaming, tai nghe văn phòng', NULL, '/uploads/categories/headphone-1764063358432-185276737.jpg', NULL, 1, 43, '2025-11-25 08:58:13', '2025-11-25 09:35:58'),
(44, 'Speaker', 'speaker', 'Loa máy tính - Loa 2.0, 2.1, 5.1', NULL, '/uploads/categories/speaker-1764063399190-71396739.jpg', NULL, 1, 44, '2025-11-25 08:58:13', '2025-11-25 09:36:39'),
(45, 'Gaming Chair', 'gaming-chair', 'Ghế gaming - Ghế công thái học, ghế gaming cao cấp', NULL, '/uploads/categories/gaming_chair-1764062273403-428459301.jpg', NULL, 1, 45, '2025-11-25 08:58:13', '2025-11-25 09:17:53'),
(46, 'Case Fan', 'case-fan', 'Quạt case - Quạt tản nhiệt RGB, quạt PWM', NULL, '/uploads/categories/case_fan-1764062438647-791625777.jpg', NULL, 1, 46, '2025-11-25 08:58:13', '2025-11-25 09:20:38'),
(47, 'Air Cooler', 'air-cooler', 'Tản nhiệt khí - Tản nhiệt CPU tower, dual tower', 8, '/uploads/categories/air_cooler-1764063453689-131504214.jpg', NULL, 1, 47, '2025-11-25 08:58:13', '2025-11-25 09:37:33'),
(48, 'AIO Cooler', 'aio-cooler', 'Tản nhiệt nước AIO - Tản nước 240mm, 360mm', 8, '/uploads/categories/aio_cooler-1764063468237-385237851.jpg', NULL, 1, 48, '2025-11-25 08:58:13', '2025-11-25 09:37:48'),
(49, 'Custom Water', 'custom-water', 'Tản nhiệt nước custom - Bộ kit tản nước custom loop', 8, '/uploads/categories/custom_water-1764063311202-157641460.jpg', NULL, 1, 49, '2025-11-25 08:58:13', '2025-11-25 10:40:27');

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
  `down_payment_status` enum('pending','paid','not_required') DEFAULT 'pending' COMMENT 'pending: chờ thanh toán, paid: đã thanh toán, not_required: không yêu cầu (trả trước 0%)',
  `down_payment_date` datetime DEFAULT NULL,
  `down_payment_note` text DEFAULT NULL,
  `num_terms` int(11) NOT NULL,
  `monthly_payment` decimal(12,2) NOT NULL,
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

INSERT INTO `installments` (`installment_id`, `order_id`, `user_id`, `total_amount`, `down_payment`, `down_payment_status`, `down_payment_date`, `down_payment_note`, `num_terms`, `monthly_payment`, `interest_rate`, `start_date`, `end_date`, `status`, `created_at`, `policy_id`) VALUES
(25, 46, 20, 12099086.57, 2400000.00, 'paid', '2025-11-24 12:49:52', 'Thanh toán trả trước qua Chuyển khoản', 12, 808257.21, 2.20, '2025-11-24', '2026-11-24', 'active', '2025-11-24 12:44:44', NULL),
(26, 47, 21, 12076160.32, 2400000.00, 'paid', '2025-11-24 14:44:46', 'Thanh toán trả trước qua Chuyển khoản', 9, 1075128.92, 2.20, '2025-11-24', '2026-08-24', 'active', '2025-11-24 14:41:59', NULL),
(27, 48, 20, 9036801.00, 2700000.00, 'pending', NULL, NULL, 6, 1056133.50, 2.20, '2025-11-29', '2026-05-29', 'pending', '2025-11-29 12:02:28', NULL),
(28, 68, 20, 13607659.34, 2656000.00, 'paid', '2025-12-05 08:03:35', 'Thanh toán trả trước qua Ví điện tử', 6, 1781009.89, 2.20, '2025-12-05', '2026-06-05', 'active', '2025-12-05 07:58:48', NULL),
(29, 69, 20, 23813594.23, 11640000.00, 'pending', NULL, NULL, 6, 1951332.37, 2.20, '2025-12-05', '2026-06-05', 'pending', '2025-12-05 08:02:24', NULL),
(30, 71, 20, 1014426.41, 198000.00, 'pending', NULL, NULL, 6, 132771.07, 2.20, '2025-12-05', '2026-06-05', 'pending', '2025-12-05 11:23:46', NULL),
(31, 72, 20, 2561682.86, 500000.00, 'pending', NULL, NULL, 6, 335280.48, 2.20, '2025-12-05', '2026-06-05', 'pending', '2025-12-05 11:30:06', NULL),
(32, 73, 20, 2561682.86, 500000.00, 'paid', '2025-12-05 12:00:06', 'Thanh toán trả trước qua Chuyển khoản', 6, 335280.48, 2.20, '2025-12-05', '2026-06-05', 'active', '2025-12-05 11:50:25', NULL),
(33, 74, 20, 10236484.70, 1998000.00, 'paid', '2025-12-05 12:09:03', 'Thanh toán trả trước qua Ví điện tử', 6, 1339780.78, 2.20, '2025-12-05', '2026-06-05', 'active', '2025-12-05 12:07:58', NULL),
(34, 75, 20, 20472969.39, 3996000.00, 'paid', '2025-12-05 12:20:17', 'Thanh toán trả trước qua Ví điện tử', 6, 2679561.57, 2.20, '2025-12-05', '2026-06-05', 'active', '2025-12-05 12:19:10', NULL),
(35, 77, 20, 20096711.74, 0.00, 'not_required', NULL, NULL, 6, 3349451.96, 2.20, '2025-12-05', '2026-06-05', 'active', '2025-12-05 12:41:42', NULL),
(36, 78, 20, 30127560.85, 2997000.00, 'pending', NULL, NULL, 6, 4521760.14, 2.20, '2025-12-05', '2026-06-05', 'approved', '2025-12-05 12:43:07', NULL),
(37, 79, 20, 45419790.71, 7992000.00, 'pending', NULL, NULL, 6, 6131405.12, 2.20, '2025-12-05', '2026-06-05', 'approved', '2025-12-05 13:02:20', NULL),
(38, 80, 20, 3739517.30, 658000.00, 'pending', NULL, NULL, 6, 504812.88, 3.00, '2025-12-05', '2026-06-05', 'approved', '2025-12-05 13:04:15', NULL),
(39, 81, 20, 7141896.63, 3290000.00, 'paid', '2025-12-05 13:32:26', 'Thanh toán trả trước qua Chuyển khoản', 6, 641982.77, 50.00, '2025-12-05', '2026-06-05', 'active', '2025-12-05 13:18:29', 1),
(40, 83, 20, 11354947.68, 1998000.00, 'paid', '2025-12-07 02:49:26', 'Thanh toán trả trước qua Chuyển khoản', 6, 1559491.28, 50.00, '2025-12-07', '2026-06-07', 'active', '2025-12-07 02:48:00', 1);

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
(45, 26, 9, '2026-08-24', NULL, 1075128.92, 'pending', NULL),
(46, 28, 1, '2026-01-05', NULL, 1781009.89, 'pending', NULL),
(47, 28, 2, '2026-02-05', NULL, 1781009.89, 'pending', NULL),
(48, 28, 3, '2026-03-05', NULL, 1781009.89, 'pending', NULL),
(49, 28, 4, '2026-04-05', NULL, 1781009.89, 'pending', NULL),
(50, 28, 5, '2026-05-05', NULL, 1781009.89, 'pending', NULL),
(51, 28, 6, '2026-06-05', NULL, 1781009.89, 'pending', NULL),
(52, 32, 1, '2026-01-05', NULL, 335280.48, 'pending', NULL),
(53, 32, 2, '2026-02-05', NULL, 335280.48, 'pending', NULL),
(54, 32, 3, '2026-03-05', NULL, 335280.48, 'pending', NULL),
(55, 32, 4, '2026-04-05', NULL, 335280.48, 'pending', NULL),
(56, 32, 5, '2026-05-05', NULL, 335280.48, 'pending', NULL),
(57, 32, 6, '2026-06-05', NULL, 335280.48, 'pending', NULL),
(58, 33, 1, '2026-01-05', NULL, 1339780.78, 'pending', NULL),
(59, 33, 2, '2026-02-05', NULL, 1339780.78, 'pending', NULL),
(60, 33, 3, '2026-03-05', NULL, 1339780.78, 'pending', NULL),
(61, 33, 4, '2026-04-05', NULL, 1339780.78, 'pending', NULL),
(62, 33, 5, '2026-05-05', NULL, 1339780.78, 'pending', NULL),
(63, 33, 6, '2026-06-05', NULL, 1339780.78, 'pending', NULL),
(64, 34, 1, '2026-01-05', '2025-12-05', 2679561.57, 'paid', 'Thanh toán qua Ví điện tử'),
(65, 34, 2, '2026-02-05', NULL, 2679561.57, 'pending', NULL),
(66, 34, 3, '2026-03-05', NULL, 2679561.57, 'pending', NULL),
(67, 34, 4, '2026-04-05', NULL, 2679561.57, 'pending', NULL),
(68, 34, 5, '2026-05-05', NULL, 2679561.57, 'pending', NULL),
(69, 34, 6, '2026-06-05', NULL, 2679561.57, 'pending', NULL),
(70, 35, 1, '2026-01-05', '2025-12-05', 3349451.96, 'paid', 'Thanh toán qua Chuyển khoản'),
(71, 35, 2, '2026-02-05', NULL, 3349451.96, 'pending', NULL),
(72, 35, 3, '2026-03-05', NULL, 3349451.96, 'pending', NULL),
(73, 35, 4, '2026-04-05', NULL, 3349451.96, 'pending', NULL),
(74, 35, 5, '2026-05-05', NULL, 3349451.96, 'pending', NULL),
(75, 35, 6, '2026-06-05', NULL, 3349451.96, 'pending', NULL),
(76, 39, 1, '2026-01-05', '2025-12-07', 641982.77, 'paid', 'Thanh toán qua Chuyển khoản'),
(77, 39, 2, '2026-02-05', '2025-12-07', 641982.77, 'paid', 'Thanh toán qua Tiền mặt'),
(78, 39, 3, '2026-03-05', '2025-12-07', 641982.77, 'paid', 'Thanh toán qua Momo'),
(79, 39, 4, '2026-04-05', NULL, 641982.77, 'pending', NULL),
(80, 39, 5, '2026-05-05', NULL, 641982.77, 'pending', NULL),
(81, 39, 6, '2026-06-05', NULL, 641982.77, 'pending', NULL),
(82, 40, 1, '2026-01-07', '2025-12-07', 1559491.28, 'paid', 'Thanh toán qua Chuyển khoản'),
(83, 40, 2, '2026-02-07', '2025-12-07', 1559491.28, 'paid', 'Thanh toán qua Chuyển khoản'),
(84, 40, 3, '2026-03-07', '2025-12-07', 1559491.28, 'paid', 'Thanh toán qua Momo'),
(85, 40, 4, '2026-04-07', NULL, 1559491.28, 'pending', NULL),
(86, 40, 5, '2026-05-07', NULL, 1559491.28, 'pending', NULL),
(87, 40, 6, '2026-06-07', NULL, 1559491.28, 'pending', NULL);

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
  `installment_fee_percent` decimal(5,2) NOT NULL DEFAULT 0.00 COMMENT 'Phí trả góp theo phần trăm tổng tiền, chia đều mỗi tháng'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `installment_policies`
--

INSERT INTO `installment_policies` (`policy_id`, `name`, `terms`, `interest_rate`, `min_down_payment`, `description`, `is_active`, `created_at`, `updated_at`, `installment_fee_percent`) VALUES
(1, 'Trả góp 6 tháng', 6, 50.00, 20.00, NULL, 1, '2025-11-29 11:47:36', '2025-12-05 12:49:26', 2.00),
(2, 'Trả góp 6 tháng 0%', 6, 2.00, 0.00, 'Trả trong 6 tháng, không phát sinh lãi và phí.', 1, '2025-11-29 12:10:17', '2025-12-05 12:41:00', 0.00),
(3, 'Trả góp 12 tháng lãi 3%', 12, 3.00, 20.00, 'Gói trả góp 12 tháng, lãi suất 3%/năm, phí hợp đồng 5%.', 1, '2025-11-29 12:10:17', '2025-11-29 12:10:17', 5.00),
(4, 'Trả góp 18 tháng lãi 6%', 18, 6.00, 15.00, 'Trả góp 18 tháng, lãi suất 6%/năm, phí trả góp 8%.', 1, '2025-11-29 12:10:17', '2025-11-29 12:10:17', 8.00),
(5, 'Trả góp 24 tháng', 24, 7.50, 10.00, 'Kỳ hạn dài nhất, lãi suất 7.5%/năm, phí hợp đồng 10%.', 1, '2025-11-29 12:10:17', '2025-11-29 12:10:17', 10.00),
(6, 'Gói ưu đãi cho sản phẩm cao cấp', 9, 2.50, 40.00, 'Dành cho sản phẩm trị giá cao, yêu cầu trả trước 40%.', 1, '2025-11-29 12:10:17', '2025-11-29 12:10:17', 0.00),
(7, 'Gói trả góp tạm ngưng thử nghiệm', 6, 0.00, 30.00, 'Đang tạm ngưng áp dụng.', 0, '2025-11-29 12:10:17', '2025-11-29 12:10:17', 0.00);

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
(47, 21, 'ORD95319130334', 53, NULL, 'shipping', 'unpaid', 12000000.00, 0.00, 0.00, 0.00, 12000000.00, NULL, NULL, '2025-11-24 14:41:59', '2025-11-24 14:44:46', '2025-11-24 14:43:33', NULL, NULL, NULL),
(48, 20, 'ORD17748211898', 54, NULL, 'pending', 'unpaid', 9000000.00, 0.00, 0.00, 0.00, 9000000.00, NULL, NULL, '2025-11-29 12:02:28', '2025-11-29 12:02:28', NULL, NULL, NULL, NULL),
(49, 20, 'ORD03856953127', 55, NULL, 'pending', 'unpaid', 3290000.00, 0.00, 50000.00, 0.00, 3340000.00, NULL, NULL, '2025-12-05 03:04:16', '2025-12-05 03:04:16', NULL, NULL, NULL, NULL),
(50, 20, 'ORD04143586718', 56, NULL, 'pending', 'unpaid', 9990000.00, 0.00, 50000.00, 0.00, 10040000.00, NULL, NULL, '2025-12-05 03:09:03', '2025-12-05 03:09:03', NULL, NULL, NULL, NULL),
(51, 20, 'ORD05419530689', 57, NULL, 'pending', 'unpaid', 22660000.00, 0.00, 50000.00, 0.00, 22710000.00, NULL, NULL, '2025-12-05 03:30:19', '2025-12-05 03:30:19', NULL, NULL, NULL, NULL),
(52, 20, 'ORD08939750540', 58, NULL, 'pending', 'unpaid', 2390000.00, 0.00, 50000.00, 0.00, 2440000.00, NULL, NULL, '2025-12-05 04:28:59', '2025-12-05 04:28:59', NULL, NULL, NULL, NULL),
(53, 20, 'ORD13429806332', 55, NULL, 'pending', 'unpaid', 30000.00, 0.00, 50000.00, 0.00, 80000.00, NULL, NULL, '2025-12-05 05:43:49', '2025-12-05 05:43:49', NULL, NULL, NULL, NULL),
(54, 20, 'ORD13429810266', 55, NULL, 'pending', 'unpaid', 30000.00, 0.00, 50000.00, 0.00, 80000.00, NULL, NULL, '2025-12-05 05:43:49', '2025-12-05 05:43:49', NULL, NULL, NULL, NULL),
(55, 20, 'ORD13475694198', 55, NULL, 'pending', 'unpaid', 30000.00, 0.00, 50000.00, 0.00, 80000.00, NULL, NULL, '2025-12-05 05:44:35', '2025-12-05 05:44:35', NULL, NULL, NULL, NULL),
(56, 20, 'ORD13689538444', 56, NULL, 'pending', 'unpaid', 3990000.00, 0.00, 50000.00, 0.00, 4040000.00, NULL, NULL, '2025-12-05 05:48:09', '2025-12-05 05:48:09', NULL, NULL, NULL, NULL),
(57, 20, 'ORD13689544225', 56, NULL, 'pending', 'unpaid', 3990000.00, 0.00, 50000.00, 0.00, 4040000.00, NULL, NULL, '2025-12-05 05:48:09', '2025-12-05 05:48:09', NULL, NULL, NULL, NULL),
(58, 20, 'ORD13827679073', 57, NULL, 'pending', 'unpaid', 990000.00, 0.00, 50000.00, 0.00, 1040000.00, NULL, NULL, '2025-12-05 05:50:27', '2025-12-05 05:50:27', NULL, NULL, NULL, NULL),
(59, 20, 'ORD13827683230', 57, NULL, 'pending', 'unpaid', 990000.00, 0.00, 50000.00, 0.00, 1040000.00, NULL, NULL, '2025-12-05 05:50:27', '2025-12-05 05:50:27', NULL, NULL, NULL, NULL),
(60, 20, 'ORD14307217077', 59, NULL, 'pending', 'unpaid', 3290000.00, 0.00, 50000.00, 0.00, 3340000.00, NULL, NULL, '2025-12-05 05:58:27', '2025-12-05 05:58:27', NULL, NULL, NULL, NULL),
(61, 20, 'ORD14850252370', 55, NULL, 'pending', 'unpaid', 10000.00, 0.00, 50000.00, 0.00, 60000.00, NULL, NULL, '2025-12-05 06:07:30', '2025-12-05 06:07:30', NULL, NULL, NULL, NULL),
(62, 20, 'ORD15247269621', 56, NULL, 'pending', 'unpaid', 20000.00, 0.00, 50000.00, 0.00, 70000.00, NULL, NULL, '2025-12-05 06:14:07', '2025-12-05 06:14:07', NULL, NULL, NULL, NULL),
(63, 20, 'ORD15653022528', 59, NULL, 'pending', 'paid', 50000.00, 0.00, 50000.00, 0.00, 100000.00, NULL, NULL, '2025-12-05 06:20:53', '2025-12-05 06:20:53', NULL, NULL, NULL, NULL),
(64, 20, 'ORD16642084760', 55, NULL, 'shipping', 'paid', 20000.00, 0.00, 50000.00, 0.00, 70000.00, NULL, NULL, '2025-12-05 06:37:22', '2025-12-05 06:37:22', NULL, NULL, NULL, NULL),
(65, 20, 'ORD17351702937', 57, NULL, 'shipping', 'paid', 3290000.00, 0.00, 50000.00, 0.00, 3340000.00, NULL, NULL, '2025-12-05 06:49:11', '2025-12-05 06:49:11', NULL, NULL, NULL, NULL),
(66, 20, 'ORD19667478628', 57, NULL, 'shipping', 'paid', 8490000.00, 0.00, 50000.00, 0.00, 8540000.00, NULL, NULL, '2025-12-05 07:27:47', '2025-12-05 07:27:47', NULL, NULL, NULL, NULL),
(67, 20, 'ORD21177096571', 60, NULL, 'shipping', 'paid', 3990000.00, 0.00, 50000.00, 0.00, 4040000.00, NULL, NULL, '2025-12-05 07:52:57', '2025-12-05 07:52:57', NULL, NULL, NULL, NULL),
(68, 20, 'ORD21528536675', 61, NULL, 'shipping', 'unpaid', 13280000.00, 0.00, 0.00, 0.00, 13280000.00, NULL, NULL, '2025-12-05 07:58:48', '2025-12-05 08:03:35', '2025-12-05 08:00:30', NULL, NULL, NULL),
(69, 20, 'ORD21744010559', 62, NULL, 'pending', 'unpaid', 23280000.00, 0.00, 0.00, 0.00, 23280000.00, NULL, NULL, '2025-12-05 08:02:24', '2025-12-05 08:02:24', NULL, NULL, NULL, NULL),
(70, 20, 'ORD22032091503', 59, NULL, 'shipping', 'paid', 70000.00, 0.00, 50000.00, 0.00, 120000.00, NULL, NULL, '2025-12-05 08:07:12', '2025-12-05 08:07:12', NULL, NULL, NULL, NULL),
(71, 20, 'ORD33826605110', 63, NULL, 'pending', 'unpaid', 990000.00, 0.00, 0.00, 0.00, 990000.00, NULL, NULL, '2025-12-05 11:23:46', '2025-12-05 11:23:46', NULL, NULL, NULL, NULL),
(72, 20, 'ORD34206694276', 64, NULL, 'pending', 'unpaid', 2500000.00, 0.00, 0.00, 0.00, 2500000.00, NULL, NULL, '2025-12-05 11:30:06', '2025-12-05 11:30:06', NULL, NULL, NULL, NULL),
(73, 20, 'ORD35425067017', 65, NULL, 'shipping', 'unpaid', 2500000.00, 0.00, 0.00, 0.00, 2500000.00, NULL, NULL, '2025-12-05 11:50:25', '2025-12-05 12:00:06', NULL, NULL, NULL, NULL),
(74, 20, 'ORD36478055670', 66, NULL, 'shipping', 'unpaid', 9990000.00, 0.00, 0.00, 0.00, 9990000.00, NULL, NULL, '2025-12-05 12:07:58', '2025-12-05 12:09:03', NULL, NULL, NULL, NULL),
(75, 20, 'ORD37150962125', 52, NULL, 'shipping', 'unpaid', 19980000.00, 0.00, 0.00, 0.00, 19980000.00, NULL, NULL, '2025-12-05 12:19:10', '2025-12-05 12:20:17', NULL, NULL, NULL, NULL),
(76, 20, 'ORD37481094803', 67, NULL, 'shipping', 'paid', 9990000.00, 0.00, 50000.00, 0.00, 10040000.00, NULL, NULL, '2025-12-05 12:24:41', '2025-12-05 12:24:41', NULL, NULL, NULL, NULL),
(77, 20, 'ORD38502917646', 52, NULL, 'pending', 'unpaid', 19980000.00, 0.00, 0.00, 0.00, 19980000.00, NULL, NULL, '2025-12-05 12:41:42', '2025-12-05 12:41:42', NULL, NULL, NULL, NULL),
(78, 20, 'ORD38587363879', 52, NULL, 'pending', 'unpaid', 29970000.00, 0.00, 0.00, 0.00, 29970000.00, NULL, NULL, '2025-12-05 12:43:07', '2025-12-05 12:43:07', NULL, NULL, NULL, NULL),
(79, 20, 'ORD39740387554', 52, NULL, 'pending', 'unpaid', 39960000.00, 0.00, 0.00, 0.00, 39960000.00, NULL, NULL, '2025-12-05 13:02:20', '2025-12-05 13:02:20', NULL, NULL, NULL, NULL),
(80, 20, 'ORD39855467379', 52, NULL, 'pending', 'unpaid', 3290000.00, 0.00, 0.00, 0.00, 3290000.00, NULL, NULL, '2025-12-05 13:04:15', '2025-12-05 13:04:15', NULL, NULL, NULL, NULL),
(81, 20, 'ORD40709129049', 52, NULL, 'shipping', 'unpaid', 6580000.00, 0.00, 0.00, 0.00, 6580000.00, NULL, NULL, '2025-12-05 13:18:29', '2025-12-05 13:32:26', NULL, NULL, NULL, NULL),
(82, 20, 'ORD75395961400', 68, NULL, 'shipping', 'paid', 3310000.00, 0.00, 50000.00, 0.00, 3360000.00, NULL, NULL, '2025-12-07 02:43:15', '2025-12-07 02:43:15', NULL, NULL, NULL, NULL),
(83, 20, 'ORD75680661085', 69, NULL, 'shipping', 'unpaid', 9990000.00, 0.00, 0.00, 0.00, 9990000.00, NULL, NULL, '2025-12-07 02:48:00', '2025-12-07 02:49:26', NULL, NULL, NULL, NULL);

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
(110, 82, 511, 'Corsair K70 RGB MK.2 Cherry MX Red', 'Cherry MX Red', 'CORS-K70-RED', 2, 10000.00, 0.00, 20000.00, '2025-12-07 02:43:15'),
(111, 82, 510, 'Logitech G Pro X Mechanical Gaming Keyboard', 'GX Blue Switch', 'LOGI-GPROX-STD', 1, 3290000.00, 0.00, 3290000.00, '2025-12-07 02:43:15'),
(112, 83, 501, 'ASUS TUF VG27AQ 27\" WQHD 165Hz', 'Standard', 'ASUS-VG27AQ-STD', 1, 9990000.00, 0.00, 9990000.00, '2025-12-07 02:48:00');

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
(17, 65, 'momo', 'paid', 3340000.00, NULL, 'momo', NULL, '2025-12-05 06:49:11', '2025-12-05 06:49:11', '2025-12-05 06:49:11'),
(20, 66, 'momo', 'paid', 8540000.00, 'BATECH_1764919624272', 'momo', NULL, '2025-12-05 07:27:47', '2025-12-05 07:27:47', '2025-12-05 07:27:47'),
(22, 67, 'momo', 'paid', 4040000.00, 'BATECH_1764921138073', 'momo', NULL, '2025-12-05 07:52:57', '2025-12-05 07:52:57', '2025-12-05 07:52:57'),
(23, 68, 'installment', 'pending', 13280000.00, 'TXN1764921528538897', NULL, NULL, NULL, '2025-12-05 07:58:48', '2025-12-05 07:58:48'),
(24, 69, 'installment', 'pending', 23280000.00, 'TXN1764921744013568', NULL, NULL, NULL, '2025-12-05 08:02:24', '2025-12-05 08:02:24'),
(26, 70, 'momo', 'paid', 120000.00, 'BATECH_1764921889136', 'momo', NULL, '2025-12-05 08:07:12', '2025-12-05 08:07:12', '2025-12-05 08:07:12'),
(28, 71, 'installment', 'pending', 990000.00, 'TXN1764933826608618', NULL, NULL, NULL, '2025-12-05 11:23:46', '2025-12-05 11:23:46'),
(29, 72, 'installment', 'pending', 2500000.00, 'TXN1764934206695947', NULL, NULL, NULL, '2025-12-05 11:30:06', '2025-12-05 11:30:06'),
(30, 73, 'installment', 'pending', 2500000.00, 'TXN1764935425069817', NULL, NULL, NULL, '2025-12-05 11:50:25', '2025-12-05 11:50:25'),
(32, 74, 'installment', 'pending', 9990000.00, 'TXN176493647805661', NULL, NULL, NULL, '2025-12-05 12:07:58', '2025-12-05 12:07:58'),
(33, 75, 'installment', 'pending', 19980000.00, 'TXN1764937150965119', NULL, NULL, NULL, '2025-12-05 12:19:10', '2025-12-05 12:19:10'),
(35, 76, 'momo', 'paid', 10040000.00, 'BATECH_1764937406052', 'momo', NULL, '2025-12-05 12:24:41', '2025-12-05 12:24:41', '2025-12-05 12:24:41'),
(36, 77, 'installment', 'pending', 19980000.00, 'TXN1764938502920835', NULL, NULL, NULL, '2025-12-05 12:41:42', '2025-12-05 12:41:42'),
(37, 78, 'installment', 'pending', 29970000.00, 'TXN1764938587364484', NULL, NULL, NULL, '2025-12-05 12:43:07', '2025-12-05 12:43:07'),
(38, 79, 'installment', 'pending', 39960000.00, 'TXN176493974038886', NULL, NULL, NULL, '2025-12-05 13:02:20', '2025-12-05 13:02:20'),
(39, 80, 'installment', 'pending', 3290000.00, 'TXN176493985546828', NULL, NULL, NULL, '2025-12-05 13:04:15', '2025-12-05 13:04:15'),
(40, 81, 'installment', 'pending', 6580000.00, 'TXN1764940709135361', NULL, NULL, NULL, '2025-12-05 13:18:29', '2025-12-05 13:18:29'),
(45, 82, 'momo', 'paid', 3360000.00, 'BATECH_1765075342938', 'momo', NULL, '2025-12-07 02:43:15', '2025-12-07 02:43:15', '2025-12-07 02:43:15'),
(46, 83, 'installment', 'pending', 9990000.00, 'TXN1765075680664651', NULL, NULL, NULL, '2025-12-07 02:48:00', '2025-12-07 02:48:00');

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
(264, 13, 'Ổ Cứng HDD SEAGATE Barracuda 2TB 3.5 inch 7200RPM, SATA III, 256MB Cache (ST2000DM008)', 'o-cung-hdd-seagate-barracuda-2tb-3-5-inch-7200rpm-sata-iii-256mb-cache-st2000dm008', NULL, 2500000.00, 1, 0, 8, 0.00, 0, '2025-11-24 12:30:39', '2025-11-25 09:00:41', ''),
(265, 1, 'Intel Core i5-13600K', 'intel-core-i5-13600k', NULL, 6000000.00, 1, 1, 10, 0.00, 0, '2025-11-24 05:32:43', '2025-11-29 12:41:46', ''),
(266, 1, 'AMD Ryzen 5 7600X', 'amd-ryzen-5-7600x', NULL, 5200000.00, 1, 1, 2, 0.00, 0, '2025-11-24 05:32:43', '2025-11-29 12:42:01', ''),
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
(300, 40, 'LG UltraGear 27GN800-B 27\" QHD 144Hz', 'lg-27gn800-qhd-144hz', 'Màn hình gaming IPS 27 inch QHD 144Hz G-Sync Compatible', 8490000.00, 1, 1, 40, 0.00, 0, '2025-11-25 08:58:13', '2025-12-03 04:28:48', ''),
(301, 40, 'ASUS TUF VG27AQ 27\" WQHD 165Hz', 'asus-tuf-vg27aq-wqhd-165hz', 'Màn hình gaming IPS 27 inch WQHD 165Hz G-Sync', 9990000.00, 1, 1, 53, 0.00, 0, '2025-11-25 08:58:13', '2025-12-03 05:07:11', ''),
(302, 40, 'Samsung Odyssey G5 32\" QHD 144Hz', 'samsung-odyssey-g5-32-qhd-144hz', 'Màn hình gaming cong VA 32 inch QHD 144Hz', 7990000.00, 1, 0, 20, 0.00, 0, '2025-11-25 08:58:13', '2025-12-07 00:58:47', ''),
(310, 41, 'Logitech G Pro X Mechanical Gaming Keyboard', 'logitech-g-pro-x-mechanical', 'Bàn phím cơ gaming với switch GX Blue', 3290000.00, 1, 1, 28, 0.00, 0, '2025-11-25 08:58:13', '2025-12-03 04:27:16', ''),
(311, 41, 'Corsair K70 RGB MK.2 Cherry MX Red', 'corsair-k70-rgb-mk2-red', 'Bàn phím cơ full-size RGB Cherry MX Red', 3000.00, 1, 1, 22, 0.00, 0, '2025-11-25 08:58:13', '2025-12-05 06:13:08', ''),
(312, 41, 'Keychron K2 V2 Wireless Mechanical', 'keychron-k2-v2-wireless', 'Bàn phím cơ 75% không dây Gateron Brown', 2190000.00, 1, 0, 4, 0.00, 0, '2025-11-25 08:58:13', '2025-12-03 04:05:26', ''),
(320, 42, 'Logitech G304 Lightspeed Wireless', 'logitech-g304-lightspeed', 'Chuột gaming không dây HERO 12K DPI', 990000.00, 1, 1, 18, 0.00, 0, '2025-11-25 08:58:13', '2025-12-03 04:20:22', ''),
(321, 42, 'Razer Viper Ultimate Wireless', 'razer-viper-ultimate-wireless', 'Chuột gaming không dây Focus+ 20K DPI', 2990000.00, 1, 1, 32, 0.00, 0, '2025-11-25 08:58:13', '2025-12-05 04:55:38', ''),
(322, 42, 'SteelSeries Rival 3 Wireless', 'steelseries-rival-3-wireless', 'Chuột gaming không dây TrueMove Air 18K DPI', 1490000.00, 1, 0, 2, 0.00, 0, '2025-11-25 08:58:13', '2025-12-03 04:29:34', ''),
(330, 43, 'HyperX Cloud II Gaming Headset', 'hyperx-cloud-ii-gaming', 'Tai nghe gaming 7.1 surround sound', 2390000.00, 1, 1, 35, 0.00, 0, '2025-11-25 08:58:13', '2025-12-05 04:55:35', ''),
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
(362, 46, 'Noctua NF-A12x25 PWM', 'noctua-nf-a12x25-pwm', 'Quạt 120mm PWM cao cấp', 790000.00, 1, 0, 0, 0.00, 0, '2025-11-25 08:58:13', '2025-11-25 08:58:13', '');

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
(374, 264, 'Seagate-2TB-7200RPM', 'Seagate-2TB-7200RPM', 2500000.00, 28, 1, 1, '2025-11-24 12:30:39', '2025-12-05 11:50:25'),
(375, 265, 'INTEL-13600K-BOX', 'Box', 6000000.00, 15, 1, 1, '2025-11-24 05:32:43', '2025-11-24 05:32:43'),
(376, 265, 'INTEL-13600K-DELUXE', 'Deluxe', 6500000.00, 10, 1, 0, '2025-11-24 05:32:43', '2025-11-24 05:32:43'),
(377, 266, 'AMD-7600X-BOX', 'Box', 5200000.00, 20, 1, 1, '2025-11-24 05:32:43', '2025-11-24 05:32:43'),
(378, 266, 'AMD-7600X-OC', 'OC', 5600000.00, 8, 1, 0, '2025-11-24 05:32:43', '2025-11-24 05:32:43'),
(379, 267, 'INTEL-13700K-BOX', 'Box', 9000000.00, 4, 1, 1, '2025-11-24 05:32:43', '2025-11-29 12:02:28'),
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
(500, 300, 'LG-27GN800-STD', 'Standard', 8490000.00, 22, 1, 1, '2025-11-25 08:58:13', '2025-12-05 07:27:47'),
(501, 301, 'ASUS-VG27AQ-STD', 'Standard', 9990000.00, 0, 1, 1, '2025-11-25 08:58:13', '2025-12-07 02:48:00'),
(502, 302, 'SAM-G5-32-STD', 'Standard', 7990000.00, 30, 1, 1, '2025-11-25 08:58:13', '2025-11-25 08:58:13'),
(510, 310, 'LOGI-GPROX-STD', 'GX Blue Switch', 3290000.00, 30, 1, 1, '2025-11-25 08:58:13', '2025-12-07 02:43:15'),
(511, 311, 'CORS-K70-RED', 'Cherry MX Red', 10000.00, 226, 1, 1, '2025-11-25 08:58:13', '2025-12-07 02:43:15'),
(512, 312, 'KEY-K2-BROWN', 'Gateron Brown', 2190000.00, 50, 1, 1, '2025-11-25 08:58:13', '2025-11-25 08:58:13'),
(520, 320, 'LOGI-G304-BLK', 'Black', 990000.00, 57, 1, 1, '2025-11-25 08:58:13', '2025-12-05 11:23:46'),
(521, 321, 'RAZER-VIPER-ULT', 'Ultimate', 2990000.00, 30, 1, 1, '2025-11-25 08:58:13', '2025-11-25 08:58:13'),
(522, 322, 'SS-RIVAL3-WL', 'Wireless', 1490000.00, 45, 1, 1, '2025-11-25 08:58:13', '2025-11-25 08:58:13'),
(530, 330, 'HX-CLOUD2-RED', 'Red', 2390000.00, 33, 1, 1, '2025-11-25 08:58:13', '2025-12-05 04:28:59'),
(531, 331, 'RAZER-BS-V2-PRO', 'Pro', 3990000.00, 17, 1, 1, '2025-11-25 08:58:13', '2025-12-05 07:52:57'),
(532, 332, 'SS-ARCTIS7-BLK', 'Black', 3290000.00, 28, 1, 1, '2025-11-25 08:58:13', '2025-11-25 08:58:13'),
(540, 340, 'LOGI-Z906-51', '5.1 System', 6590000.00, 15, 1, 1, '2025-11-25 08:58:13', '2025-11-25 08:58:13'),
(541, 341, 'CREA-PEB-V3', 'RGB', 690000.00, 80, 1, 1, '2025-11-25 08:58:13', '2025-11-25 08:58:13'),
(542, 342, 'EDI-R1280T-BLK', 'Black', 1990000.00, 50, 1, 1, '2025-11-25 08:58:13', '2025-11-25 08:58:13'),
(550, 350, 'SEC-TITAN-2022-M', 'Medium', 13490000.00, 10, 1, 1, '2025-11-25 08:58:13', '2025-11-25 08:58:13'),
(551, 351, 'HM-EMBODY-GM', 'Gaming Edition', 37990000.00, 5, 1, 1, '2025-11-25 08:58:13', '2025-11-25 08:58:13'),
(552, 352, 'RAZER-ISKUR-BLK', 'Black', 8990000.00, 15, 1, 1, '2025-11-25 08:58:13', '2025-11-25 08:58:13'),
(560, 360, 'LL-UNIFAN-SL120-3P', '3-Pack', 2290000.00, 40, 1, 1, '2025-11-25 08:58:13', '2025-11-25 08:58:13'),
(561, 361, 'CORS-SP120-ELITE-3P', '3-Pack', 1690000.00, 50, 1, 1, '2025-11-25 08:58:13', '2025-11-25 08:58:13'),
(562, 362, 'NOCT-NF-A12-SGL', 'Single', 790000.00, 100, 1, 1, '2025-11-25 08:58:13', '2025-11-25 08:58:13');

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
(6, 'admin', 'admin@gmail.com', '$2b$10$84e9xqnTc50CPaf5pOldT.Ob9zW9/RVK.G3Whr.TdAncfRdE.UivG', 'admin', '0123456788', 2, 1, '2025-11-05 09:33:52', '2025-12-07 02:16:42', NULL, 'b69bfdf666d4c6d6db8a38aa39ce0aaf32bc8b812d7545f03399bdc9593ffa76', '1133299699f8ff030527c9605e02e76bed3e3c99c429c8228cbea1d4cc323081', NULL),
(17, 'ad1', 'ad1@gmail.com', '$2b$10$zE.RfZEcYf/th.S7Krdkmu/l0jDW7Nq3Ge9eP4lU78KVlVJzXCUwG', 'ad1', '0987676765', 2, 1, '2025-11-23 11:15:30', '2025-11-25 09:05:36', NULL, NULL, 'e5770a861273d29663ef4c6d20902fa4f370fc43a57b97c96014fd00bf9e8fc5', NULL),
(20, 'tranthib671', 'thib@gmail.com', '$2b$10$KQc2staSc5WX/9OIkHi3reX8XJO8L51YDjK.N5YP5XpPaghoLS.rK', 'Trần Thị B', '0908787671', 0, 1, '2025-11-24 12:44:44', '2025-12-07 02:23:28', NULL, NULL, NULL, '19d0d945a79ba70c0377f5244d54a53f54b29dc09682429b65357095c95630a7'),
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
(500, 138),
(500, 145),
(500, 150),
(500, 153),
(500, 159),
(501, 136),
(501, 145),
(501, 150),
(501, 153),
(501, 160),
(502, 139),
(502, 146),
(502, 150),
(502, 154),
(502, 159),
(510, 164),
(510, 171),
(510, 176),
(510, 183),
(510, 188),
(511, 163),
(511, 171),
(511, 175),
(511, 183),
(511, 188),
(512, 168),
(512, 171),
(512, 180),
(512, 186),
(512, 188),
(520, 191),
(520, 199),
(520, 206),
(520, 210),
(520, 215),
(521, 192),
(521, 199),
(521, 207),
(521, 210),
(521, 213),
(522, 193),
(522, 199),
(522, 206),
(522, 210),
(522, 213),
(530, 220),
(530, 224),
(530, 229),
(530, 232),
(530, 237),
(531, 217),
(531, 224),
(531, 230),
(531, 232),
(531, 235),
(532, 218),
(532, 224),
(532, 230),
(532, 232),
(532, 236),
(540, 239),
(540, 246),
(540, 251),
(540, 255),
(540, 258),
(541, 240),
(541, 244),
(541, 248),
(541, 253),
(541, 256),
(542, 238),
(542, 244),
(542, 249),
(542, 252),
(542, 258),
(550, 260),
(550, 265),
(550, 270),
(550, 273),
(550, 280),
(551, 263),
(551, 268),
(551, 272),
(551, 273),
(551, 280),
(552, 259),
(552, 265),
(552, 270),
(552, 273),
(552, 279),
(560, 283),
(560, 290),
(560, 294),
(560, 296),
(560, 301),
(561, 282),
(561, 290),
(561, 294),
(561, 297),
(561, 302),
(562, 288),
(562, 290),
(562, 295),
(562, 299),
(562, 301);

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
  MODIFY `address_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=70;

--
-- AUTO_INCREMENT cho bảng `articles`
--
ALTER TABLE `articles`
  MODIFY `article_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `attributes`
--
ALTER TABLE `attributes`
  MODIFY `attribute_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=92;

--
-- AUTO_INCREMENT cho bảng `attribute_categories`
--
ALTER TABLE `attribute_categories`
  MODIFY `attribute_category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=93;

--
-- AUTO_INCREMENT cho bảng `attribute_values`
--
ALTER TABLE `attribute_values`
  MODIFY `attribute_value_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=378;

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
  MODIFY `cart_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT cho bảng `cart_items`
--
ALTER TABLE `cart_items`
  MODIFY `cart_item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=121;

--
-- AUTO_INCREMENT cho bảng `categories`
--
ALTER TABLE `categories`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT cho bảng `coupons`
--
ALTER TABLE `coupons`
  MODIFY `coupon_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT cho bảng `installments`
--
ALTER TABLE `installments`
  MODIFY `installment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT cho bảng `installment_payments`
--
ALTER TABLE `installment_payments`
  MODIFY `payment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=88;

--
-- AUTO_INCREMENT cho bảng `installment_policies`
--
ALTER TABLE `installment_policies`
  MODIFY `policy_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT cho bảng `notifications`
--
ALTER TABLE `notifications`
  MODIFY `notification_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=84;

--
-- AUTO_INCREMENT cho bảng `order_items`
--
ALTER TABLE `order_items`
  MODIFY `order_item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=113;

--
-- AUTO_INCREMENT cho bảng `payments`
--
ALTER TABLE `payments`
  MODIFY `payment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT cho bảng `posts`
--
ALTER TABLE `posts`
  MODIFY `post_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `products`
--
ALTER TABLE `products`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=364;

--
-- AUTO_INCREMENT cho bảng `product_variants`
--
ALTER TABLE `product_variants`
  MODIFY `variant_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=564;

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
  MODIFY `image_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=197;

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
  ADD CONSTRAINT `fk_installment_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`),
  ADD CONSTRAINT `fk_installments_policy` FOREIGN KEY (`policy_id`) REFERENCES `installment_policies` (`policy_id`);

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
