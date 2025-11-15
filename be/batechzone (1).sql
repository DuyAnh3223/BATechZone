-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th10 15, 2025 lúc 05:41 AM
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
  `user_id` int(11) NOT NULL,
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
(4, 9, 'bao1', '0987676765', '123 bao', 'dsa', 'rq', 'dsa', 'dsa', '312', 'Vietnam', 1, 'home', '2025-11-07 08:22:15', '2025-11-07 08:22:21');

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
(31, 'Hãng', 'other', 0, 1, '2025-11-08 15:54:29'),
(32, 'Dòng sản phẩm', 'other', 0, 1, '2025-11-08 16:30:36'),
(33, 'Thế hệ', 'other', 0, 1, '2025-11-08 16:31:15'),
(34, 'Socket', 'other', 0, 1, '2025-11-08 16:33:55'),
(35, 'GPU tích hợp', 'other', 0, 1, '2025-11-08 16:35:14'),
(36, 'Dung lượng', 'other', 0, 1, '2025-11-15 00:32:38'),
(43, 'van toc', 'other', 0, 1, '2025-11-15 02:42:53'),
(44, 'xanh', 'other', 0, 1, '2025-11-15 03:24:37');

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
(22, 31, 1),
(23, 31, 2),
(24, 31, 5),
(25, 31, 6),
(26, 32, 1),
(27, 33, 1),
(28, 34, 1),
(29, 35, 1),
(30, 36, 3),
(31, 37, 1),
(32, 38, 26),
(33, 39, 26),
(34, 40, 26),
(35, 41, 26),
(36, 42, 26),
(37, 43, 27),
(38, 44, 28);

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
(26, 31, 'Intel', NULL, NULL, 0, 1, '2025-11-08 15:54:35'),
(27, 31, 'AMD', NULL, NULL, 0, 1, '2025-11-08 15:54:41'),
(28, 31, 'Asus', NULL, NULL, 0, 1, '2025-11-08 15:55:02'),
(29, 31, 'Gigabyte', NULL, NULL, 0, 1, '2025-11-08 15:55:06'),
(30, 31, 'MSI', NULL, NULL, 0, 1, '2025-11-08 15:55:10'),
(32, 32, 'Core i3', NULL, NULL, 0, 1, '2025-11-08 16:30:43'),
(33, 32, 'Core i5', NULL, NULL, 0, 1, '2025-11-08 16:30:48'),
(34, 32, 'Core i7', NULL, NULL, 0, 1, '2025-11-08 16:30:52'),
(35, 32, 'Ryzen 3', NULL, NULL, 0, 1, '2025-11-08 16:30:59'),
(36, 32, 'Ryzen 5', NULL, NULL, 0, 1, '2025-11-08 16:31:02'),
(37, 32, 'Ryzen 7', NULL, NULL, 0, 1, '2025-11-08 16:31:05'),
(38, 33, '12th', NULL, NULL, 0, 1, '2025-11-08 16:31:20'),
(39, 33, '13th', NULL, NULL, 0, 1, '2025-11-08 16:31:22'),
(40, 33, '14th', NULL, NULL, 0, 1, '2025-11-08 16:31:23'),
(41, 33, 'Ryzen 5000s', NULL, NULL, 0, 1, '2025-11-08 16:31:29'),
(42, 33, 'Ryzen 7000s', NULL, NULL, 0, 1, '2025-11-08 16:31:33'),
(43, 33, 'Ryzen 3000s', NULL, NULL, 0, 1, '2025-11-08 16:31:38'),
(44, 33, '11th', NULL, NULL, 0, 1, '2025-11-08 16:31:56'),
(45, 33, '10th', NULL, NULL, 0, 1, '2025-11-08 16:32:05'),
(49, 34, 'LGA1700', NULL, NULL, 0, 1, '2025-11-08 16:34:01'),
(50, 34, 'AM4', NULL, NULL, 0, 1, '2025-11-08 16:34:04'),
(51, 34, 'AM5', NULL, NULL, 0, 1, '2025-11-08 16:34:06'),
(52, 34, 'LGA1200', NULL, NULL, 0, 1, '2025-11-08 16:34:49'),
(53, 35, 'Có', NULL, NULL, 0, 1, '2025-11-08 16:35:21'),
(60, 44, 'xanh', NULL, NULL, 0, 1, '2025-11-15 03:24:37');

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
  `user_id` int(11) NOT NULL,
  `session_id` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `expires_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
(1, 'CPU', 'cpu', 'Bộ vi xử lý trung tâm (Central Processing Unit) - Lựa chọn CPU phù hợp cho hệ thống của bạn', NULL, NULL, NULL, 1, 1, '2025-11-05 12:37:11', '2025-11-15 04:35:50'),
(2, 'VGA', 'vga', 'Card đồ họa (Video Graphics Array) - Card màn hình cao cấp cho gaming và đồ họa', NULL, NULL, NULL, 1, 2, '2025-11-05 12:37:11', '2025-11-08 04:55:26'),
(3, 'RAM', 'ram', 'Bộ nhớ truy cập ngẫu nhiên (Random Access Memory) - RAM DDR4, DDR5 cho máy tính', NULL, NULL, NULL, 1, 3, '2025-11-05 12:37:11', '2025-11-08 03:27:54'),
(4, 'SSD', 'ssd', 'Ổ cứng thể rắn (Solid State Drive) - SSD NVMe, SATA tốc độ cao', NULL, NULL, NULL, 1, 4, '2025-11-05 12:37:11', '2025-11-08 03:27:56'),
(5, 'Mainboard', 'mainboard', 'Bo mạch chủ (Motherboard) - Mainboard Intel, AMD các dòng ATX, mATX, ITX', NULL, NULL, NULL, 1, 5, '2025-11-05 12:37:11', '2025-11-05 12:37:11'),
(6, 'PSU', 'psu', 'Bộ nguồn máy tính (Power Supply Unit) - PSU 80 Plus Bronze, Gold, Platinum', NULL, NULL, NULL, 1, 6, '2025-11-05 12:37:11', '2025-11-05 12:37:11'),
(7, 'Case', 'case', 'Vỏ máy tính (Computer Case) - Case PC ATX, mATX, ITX với quạt RGB, tản nhiệt tốt', NULL, NULL, NULL, 1, 7, '2025-11-05 12:37:11', '2025-11-05 12:37:11'),
(8, 'Cooling', 'cooling', 'Tản nhiệt và làm mát - Quạt case, tản nhiệt CPU, tản nhiệt nước AIO', NULL, NULL, NULL, 1, 8, '2025-11-05 12:37:11', '2025-11-08 15:18:42'),
(13, 'HDD', 'hdd', 'Ổ đĩa cứng (Hard Disk Drive) là thiết bị lưu trữ dữ liệu chính cho máy tính', NULL, NULL, NULL, 1, 0, '2025-11-08 14:08:34', '2025-11-08 15:18:54');

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
(4, 'BIGSALE100', 'Giảm 100.000đ cho đơn hàng từ 1.000.000đ', 'fixed_amount', 100000.00, NULL, 1000000.00, 500, 0, 1, '2025-10-31 17:00:00', '2025-12-24 17:00:00', '2025-11-05 10:19:14'),
(5, 'FREESHIP15', 'Giảm 15% cho tất cả đơn hàng', 'percentage', 15.00, NULL, 0.00, NULL, 0, 1, '2025-10-31 17:00:00', '2025-12-30 17:00:00', '2025-11-05 10:19:14'),
(6, 'BLACKFRIDAY', 'Giảm 30% tối đa 150.000đ cho mọi đơn hàng', 'percentage', 30.00, 150000.00, 0.00, 200, 0, 1, '2025-11-24 17:00:00', '2025-11-30 16:59:59', '2025-11-05 10:19:14'),
(7, 'WELCOME50', 'Tặng 50.000đ cho đơn hàng đầu tiên', 'fixed_amount', 50000.00, NULL, 100000.00, 1, 0, 1, '2025-10-31 17:00:00', '2025-12-31 17:00:00', '2025-11-05 10:19:14'),
(8, 'XMAS25', 'Giảm 25% cho mùa Giáng Sinh', 'percentage', 25.00, 120000.00, 300000.00, 300, 0, 1, '2025-11-30 17:00:00', '2025-12-31 16:59:59', '2025-11-05 10:19:14'),
(9, 'HELLO', 'Giam 7% cho don hang 100000', 'percentage', 7.00, NULL, 100000.00, NULL, 0, 0, '2025-11-05 01:00:00', '2025-11-20 13:00:00', '2025-11-05 10:33:52');

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
  `user_id` int(11) NOT NULL,
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
(40, 2, 'NVIDIA GeForce RTX 4060 8GB', 'nvidia-geforce-rtx-4060-8gb', 'Card đồ họa NVIDIA RTX 4060, 8GB GDDR6, 128-bit, DLSS 3, Ray Tracing, Phù hợp gaming 1080p/1440p', 8500000.00, 1, 1, 0, 0.00, 0, '2025-11-15 03:40:54', '2025-11-15 03:40:54', '/uploads/products/vga/rtx-4060.jpg'),
(41, 2, 'NVIDIA GeForce RTX 4070 12GB', 'nvidia-geforce-rtx-4070-12gb', 'Card đồ họa NVIDIA RTX 4070, 12GB GDDR6X, 192-bit, DLSS 3, Ray Tracing, Gaming 1440p/4K', 18000000.00, 1, 1, 0, 0.00, 0, '2025-11-15 03:40:54', '2025-11-15 03:40:54', '/uploads/products/vga/rtx-4070.jpg'),
(42, 2, 'NVIDIA GeForce RTX 4080 16GB', 'nvidia-geforce-rtx-4080-16gb', 'Card đồ họa NVIDIA RTX 4080, 16GB GDDR6X, 256-bit, DLSS 3, Ray Tracing, Gaming 4K cao cấp', 28000000.00, 1, 1, 0, 0.00, 0, '2025-11-15 03:40:54', '2025-11-15 03:40:54', '/uploads/products/vga/rtx-4080.jpg'),
(43, 2, 'AMD Radeon RX 7600 8GB', 'amd-radeon-rx-7600-8gb', 'Card đồ họa AMD RX 7600, 8GB GDDR6, 128-bit, FSR 3, Gaming 1080p/1440p', 7500000.00, 1, 0, 0, 0.00, 0, '2025-11-15 03:40:54', '2025-11-15 03:40:54', '/uploads/products/vga/rx-7600.jpg'),
(44, 2, 'AMD Radeon RX 7800 XT 16GB', 'amd-radeon-rx-7800-xt-16gb', 'Card đồ họa AMD RX 7800 XT, 16GB GDDR6, 256-bit, FSR 3, Gaming 1440p/4K', 15000000.00, 1, 1, 0, 0.00, 0, '2025-11-15 03:40:54', '2025-11-15 03:40:54', '/uploads/products/vga/rx-7800-xt.jpg'),
(45, 3, 'Corsair Vengeance RGB DDR5 32GB (2x16GB) 6000MHz', 'corsair-vengeance-rgb-ddr5-32gb-6000mhz', 'Bộ nhớ RAM DDR5 Corsair Vengeance RGB, 32GB (2x16GB), 6000MHz, CL30, RGB LED, Phù hợp Intel/AMD', 3500000.00, 1, 1, 0, 0.00, 0, '2025-11-15 03:40:54', '2025-11-15 03:40:54', '/uploads/products/ram/corsair-vengeance-ddr5.jpg'),
(46, 3, 'G.Skill Trident Z5 RGB DDR5 32GB (2x16GB) 6400MHz', 'gskill-trident-z5-rgb-ddr5-32gb-6400mhz', 'Bộ nhớ RAM DDR5 G.Skill Trident Z5 RGB, 32GB (2x16GB), 6400MHz, CL32, RGB LED, Hiệu năng cao', 4200000.00, 1, 1, 0, 0.00, 0, '2025-11-15 03:40:54', '2025-11-15 03:40:54', '/uploads/products/ram/gskill-trident-z5.jpg'),
(47, 3, 'Kingston Fury Beast DDR5 16GB (2x8GB) 5600MHz', 'kingston-fury-beast-ddr5-16gb-5600mhz', 'Bộ nhớ RAM DDR5 Kingston Fury Beast, 16GB (2x8GB), 5600MHz, CL36, Không RGB, Giá tốt', 1800000.00, 1, 0, 0, 0.00, 0, '2025-11-15 03:40:54', '2025-11-15 03:40:54', '/uploads/products/ram/kingston-fury-beast.jpg'),
(48, 3, 'Corsair Vengeance LPX DDR4 32GB (2x16GB) 3600MHz', 'corsair-vengeance-lpx-ddr4-32gb-3600mhz', 'Bộ nhớ RAM DDR4 Corsair Vengeance LPX, 32GB (2x16GB), 3600MHz, CL18, Low Profile, Tương thích tốt', 2500000.00, 1, 0, 0, 0.00, 0, '2025-11-15 03:40:54', '2025-11-15 03:40:54', '/uploads/products/ram/corsair-vengeance-lpx.jpg'),
(49, 3, 'G.Skill Ripjaws V DDR4 16GB (2x8GB) 3200MHz', 'gskill-ripjaws-v-ddr4-16gb-3200mhz', 'Bộ nhớ RAM DDR4 G.Skill Ripjaws V, 16GB (2x8GB), 3200MHz, CL16, Giá rẻ, Ổn định', 1200000.00, 1, 0, 0, 0.00, 0, '2025-11-15 03:40:54', '2025-11-15 03:40:54', '/uploads/products/ram/gskill-ripjaws-v.jpg'),
(50, 4, 'Samsung 980 PRO 1TB NVMe M.2', 'samsung-980-pro-1tb-nvme-m2', 'SSD Samsung 980 PRO NVMe M.2, 1TB, PCIe 4.0, Đọc 7000MB/s, Ghi 5000MB/s, Bền bỉ', 3500000.00, 1, 1, 2, 0.00, 0, '2025-11-15 03:40:54', '2025-11-15 03:52:46', '/uploads/products/ssd/samsung-980-pro.jpg'),
(51, 4, 'Samsung 990 PRO 2TB NVMe M.2', 'samsung-990-pro-2tb-nvme-m2', 'SSD Samsung 990 PRO NVMe M.2, 2TB, PCIe 4.0, Đọc 7450MB/s, Ghi 6900MB/s, Flagship', 6500000.00, 1, 1, 0, 0.00, 0, '2025-11-15 03:40:54', '2025-11-15 03:40:54', '/uploads/products/ssd/samsung-990-pro.jpg'),
(52, 4, 'WD Black SN850X 1TB NVMe M.2', 'wd-black-sn850x-1tb-nvme-m2', 'SSD WD Black SN850X NVMe M.2, 1TB, PCIe 4.0, Đọc 7300MB/s, Ghi 6300MB/s, Gaming', 3200000.00, 1, 1, 0, 0.00, 0, '2025-11-15 03:40:54', '2025-11-15 03:40:54', '/uploads/products/ssd/wd-black-sn850x.jpg'),
(53, 4, 'Crucial P5 Plus 1TB NVMe M.2', 'crucial-p5-plus-1tb-nvme-m2', 'SSD Crucial P5 Plus NVMe M.2, 1TB, PCIe 4.0, Đọc 6600MB/s, Ghi 5000MB/s, Giá tốt', 2800000.00, 1, 0, 0, 0.00, 0, '2025-11-15 03:40:54', '2025-11-15 03:40:54', '/uploads/products/ssd/crucial-p5-plus.jpg'),
(54, 4, 'Kingston NV2 1TB NVMe M.2', 'kingston-nv2-1tb-nvme-m2', 'SSD Kingston NV2 NVMe M.2, 1TB, PCIe 4.0, Đọc 3500MB/s, Ghi 2100MB/s, Budget', 1500000.00, 1, 0, 0, 0.00, 0, '2025-11-15 03:40:54', '2025-11-15 03:40:54', '/uploads/products/ssd/kingston-nv2.jpg'),
(55, 5, 'ASUS ROG Strix B650E-F Gaming WiFi', 'asus-rog-strix-b650e-f-gaming-wifi', 'Mainboard ASUS ROG Strix B650E-F, Socket AM5, ATX, WiFi 6E, PCIe 5.0, RGB, Phù hợp AMD Ryzen 7000', 5500000.00, 1, 1, 0, 0.00, 0, '2025-11-15 03:40:54', '2025-11-15 03:40:54', '/uploads/products/mainboard/asus-rog-strix-b650e.jpg'),
(56, 5, 'MSI MAG B650 Tomahawk WiFi', 'msi-mag-b650-tomahawk-wifi', 'Mainboard MSI MAG B650 Tomahawk, Socket AM5, ATX, WiFi 6E, PCIe 4.0, Giá tốt, Ổn định', 4500000.00, 1, 1, 0, 0.00, 0, '2025-11-15 03:40:54', '2025-11-15 03:40:54', '/uploads/products/mainboard/msi-b650-tomahawk.jpg'),
(57, 5, 'Gigabyte Z790 AORUS Elite AX', 'gigabyte-z790-aorus-elite-ax', 'Mainboard Gigabyte Z790 AORUS Elite AX, Socket LGA1700, ATX, WiFi 6E, PCIe 5.0, RGB, Intel 12th/13th/14th Gen', 6500000.00, 1, 1, 0, 0.00, 0, '2025-11-15 03:40:54', '2025-11-15 03:40:54', '/uploads/products/mainboard/gigabyte-z790-aorus.jpg'),
(58, 5, 'ASUS TUF Gaming B760M-Plus WiFi', 'asus-tuf-gaming-b760m-plus-wifi', 'Mainboard ASUS TUF Gaming B760M-Plus, Socket LGA1700, mATX, WiFi 6, PCIe 4.0, Bền bỉ', 3800000.00, 1, 0, 0, 0.00, 0, '2025-11-15 03:40:54', '2025-11-15 03:40:54', '/uploads/products/mainboard/asus-tuf-b760m.jpg'),
(59, 5, 'MSI PRO B650M-A WiFi', 'msi-pro-b650m-a-wifi', 'Mainboard MSI PRO B650M-A, Socket AM5, mATX, WiFi 6, PCIe 4.0, Giá rẻ, Phù hợp build budget', 3200000.00, 1, 0, 0, 0.00, 0, '2025-11-15 03:40:54', '2025-11-15 03:40:54', '/uploads/products/mainboard/msi-pro-b650m.jpg'),
(60, 6, 'Corsair RM850e 850W 80 Plus Gold', 'corsair-rm850e-850w-80-plus-gold', 'Nguồn máy tính Corsair RM850e, 850W, 80 Plus Gold, Modular, PCIe 5.0, Bền bỉ, Yên tĩnh', 3200000.00, 1, 1, 0, 0.00, 0, '2025-11-15 03:40:54', '2025-11-15 03:40:54', '/uploads/products/psu/corsair-rm850e.jpg'),
(61, 6, 'Seasonic Focus GX-750 750W 80 Plus Gold', 'seasonic-focus-gx-750-750w-80-plus-gold', 'Nguồn máy tính Seasonic Focus GX-750, 750W, 80 Plus Gold, Modular, Chất lượng cao', 2800000.00, 1, 1, 0, 0.00, 0, '2025-11-15 03:40:54', '2025-11-15 03:40:54', '/uploads/products/psu/seasonic-focus-gx-750.jpg'),
(62, 6, 'Cooler Master MWE Gold 650W 80 Plus Gold', 'cooler-master-mwe-gold-650w-80-plus-gold', 'Nguồn máy tính Cooler Master MWE Gold 650, 650W, 80 Plus Gold, Modular, Giá tốt', 2200000.00, 1, 0, 0, 0.00, 0, '2025-11-15 03:40:54', '2025-11-15 03:40:54', '/uploads/products/psu/cooler-master-mwe-650.jpg'),
(63, 6, 'Corsair RM1000e 1000W 80 Plus Gold', 'corsair-rm1000e-1000w-80-plus-gold', 'Nguồn máy tính Corsair RM1000e, 1000W, 80 Plus Gold, Modular, PCIe 5.0, High-end build', 4500000.00, 1, 1, 0, 0.00, 0, '2025-11-15 03:40:54', '2025-11-15 03:40:54', '/uploads/products/psu/corsair-rm1000e.jpg'),
(64, 6, 'Thermaltake Smart BM2 550W 80 Plus Bronze', 'thermaltake-smart-bm2-550w-80-plus-bronze', 'Nguồn máy tính Thermaltake Smart BM2, 550W, 80 Plus Bronze, Non-modular, Budget', 1200000.00, 1, 0, 0, 0.00, 0, '2025-11-15 03:40:54', '2025-11-15 03:40:54', '/uploads/products/psu/thermaltake-smart-bm2.jpg'),
(65, 7, 'Corsair 4000D Airflow Tempered Glass', 'corsair-4000d-airflow-tempered-glass', 'Vỏ máy tính Corsair 4000D Airflow, ATX, Kính cường lực, Tản nhiệt tốt, 2 quạt 120mm, Thiết kế đẹp', 2500000.00, 1, 1, 0, 0.00, 0, '2025-11-15 03:40:54', '2025-11-15 03:40:54', '/uploads/products/case/corsair-4000d.jpg'),
(66, 7, 'Fractal Design Pop Air RGB', 'fractal-design-pop-air-rgb', 'Vỏ máy tính Fractal Design Pop Air RGB, ATX, Kính cường lực, RGB, 3 quạt RGB, Tản nhiệt tốt', 3200000.00, 1, 1, 0, 0.00, 0, '2025-11-15 03:40:54', '2025-11-15 03:40:54', '/uploads/products/case/fractal-pop-air.jpg'),
(67, 7, 'NZXT H5 Flow RGB', 'nzxt-h5-flow-rgb', 'Vỏ máy tính NZXT H5 Flow, ATX, Kính cường lực, RGB, Tản nhiệt Flow, Thiết kế hiện đại', 2800000.00, 1, 1, 0, 0.00, 0, '2025-11-15 03:40:54', '2025-11-15 03:40:54', '/uploads/products/case/nzxt-h5-flow.jpg'),
(68, 7, 'Cooler Master MasterBox TD500 Mesh', 'cooler-master-masterbox-td500-mesh', 'Vỏ máy tính Cooler Master MasterBox TD500 Mesh, ATX, Kính cường lực, RGB, Mesh front, Tản nhiệt tốt', 2400000.00, 1, 0, 0, 0.00, 0, '2025-11-15 03:40:54', '2025-11-15 03:40:54', '/uploads/products/case/cm-td500-mesh.jpg'),
(69, 7, 'Phanteks Eclipse P300A Mesh', 'phanteks-eclipse-p300a-mesh', 'Vỏ máy tính Phanteks Eclipse P300A Mesh, mATX, Kính cường lực, Mesh front, Compact, Giá tốt', 1500000.00, 1, 0, 0, 0.00, 0, '2025-11-15 03:40:54', '2025-11-15 03:40:54', '/uploads/products/case/phanteks-p300a.jpg'),
(70, 8, 'Corsair iCUE H150i Elite Capellix XT 360mm', 'corsair-icue-h150i-elite-capellix-xt-360mm', 'Tản nhiệt nước AIO Corsair H150i Elite Capellix XT, 360mm, RGB, 3 quạt RGB, Hiệu năng cao', 4500000.00, 1, 1, 0, 0.00, 0, '2025-11-15 03:40:54', '2025-11-15 03:40:54', '/uploads/products/cooling/corsair-h150i.jpg'),
(71, 8, 'Noctua NH-D15 Chromax Black', 'noctua-nh-d15-chromax-black', 'Tản nhiệt CPU Noctua NH-D15 Chromax Black, Dual Tower, 2 quạt, Yên tĩnh, Hiệu năng đỉnh', 3200000.00, 1, 1, 0, 0.00, 0, '2025-11-15 03:40:54', '2025-11-15 03:40:54', '/uploads/products/cooling/noctua-nh-d15.jpg'),
(72, 8, 'Deepcool AK620 Zero Dark', 'deepcool-ak620-zero-dark', 'Tản nhiệt CPU Deepcool AK620 Zero Dark, Dual Tower, 2 quạt, Giá tốt, Hiệu năng cao', 1800000.00, 1, 1, 0, 0.00, 0, '2025-11-15 03:40:54', '2025-11-15 03:40:54', '/uploads/products/cooling/deepcool-ak620.jpg'),
(73, 8, 'Arctic Liquid Freezer II 240mm', 'arctic-liquid-freezer-ii-240mm', 'Tản nhiệt nước AIO Arctic Liquid Freezer II, 240mm, Không RGB, Giá tốt, Hiệu năng cao', 2500000.00, 1, 0, 0, 0.00, 0, '2025-11-15 03:40:54', '2025-11-15 03:40:54', '/uploads/products/cooling/arctic-liquid-freezer-240.jpg'),
(74, 8, 'Cooler Master Hyper 212 RGB Black Edition', 'cooler-master-hyper-212-rgb-black-edition', 'Tản nhiệt CPU Cooler Master Hyper 212 RGB, Single Tower, RGB, Giá rẻ, Phù hợp CPU tầm trung', 800000.00, 1, 0, 0, 0.00, 0, '2025-11-15 03:40:54', '2025-11-15 03:40:54', '/uploads/products/cooling/cm-hyper-212.jpg'),
(75, 13, 'Seagate BarraCuda 2TB 7200RPM', 'seagate-barracuda-2tb-7200rpm', 'Ổ cứng HDD Seagate BarraCuda, 2TB, 7200RPM, SATA 6Gb/s, 256MB Cache, Lưu trữ dữ liệu', 1200000.00, 1, 1, 0, 0.00, 0, '2025-11-15 03:40:54', '2025-11-15 03:40:54', '/uploads/products/hdd/seagate-barracuda-2tb.jpg'),
(76, 13, 'Western Digital Blue 4TB 5400RPM', 'western-digital-blue-4tb-5400rpm', 'Ổ cứng HDD WD Blue, 4TB, 5400RPM, SATA 6Gb/s, 256MB Cache, Lưu trữ dung lượng lớn', 2200000.00, 1, 1, 2, 0.00, 0, '2025-11-15 03:40:54', '2025-11-15 03:44:19', '/uploads/products/hdd/wd-blue-4tb.jpg'),
(77, 13, 'Seagate IronWolf 8TB 7200RPM NAS', 'seagate-ironwolf-8tb-7200rpm-nas', 'Ổ cứng HDD Seagate IronWolf, 8TB, 7200RPM, SATA 6Gb/s, 256MB Cache, Dành cho NAS, Bền bỉ', 5500000.00, 1, 1, 0, 0.00, 0, '2025-11-15 03:40:54', '2025-11-15 03:40:54', '/uploads/products/hdd/seagate-ironwolf-8tb.jpg'),
(78, 13, 'Western Digital Black 1TB 7200RPM', 'western-digital-black-1tb-7200rpm', 'Ổ cứng HDD WD Black, 1TB, 7200RPM, SATA 6Gb/s, 64MB Cache, Hiệu năng cao, Gaming', 1500000.00, 1, 0, 0, 0.00, 0, '2025-11-15 03:40:54', '2025-11-15 03:40:54', '/uploads/products/hdd/wd-black-1tb.jpg'),
(79, 13, 'Toshiba P300 3TB 7200RPM', 'toshiba-p300-3tb-7200rpm', 'Ổ cứng HDD Toshiba P300, 3TB, 7200RPM, SATA 6Gb/s, 128MB Cache, Giá tốt', 1800000.00, 1, 0, 0, 0.00, 0, '2025-11-15 03:40:54', '2025-11-15 03:40:54', '/uploads/products/hdd/toshiba-p300-3tb.jpg'),
(181, 1, 'Intel Core i7-14700K', 'intel-core-i7-14700k', 'CPU Intel Core i7 thế hệ 14, 20 nhân (8P + 12E), 28 luồng, Base 3.4GHz, Boost 5.6GHz, Socket LGA1700, Có GPU tích hợp Intel UHD Graphics 770', 8500000.00, 1, 1, 2, 0.00, 0, '2025-11-15 03:55:48', '2025-11-15 04:06:47', '/uploads/products/cpu/intel-i7-14700k.jpg'),
(182, 1, 'AMD Ryzen 5 7600X', 'amd-ryzen-5-7600x', 'CPU AMD Ryzen 5 thế hệ 7000, 6 nhân 12 luồng, Base 4.7GHz, Boost 5.3GHz, Socket AM5, Không có GPU tích hợp', 5500000.00, 1, 1, 2, 0.00, 0, '2025-11-15 03:55:48', '2025-11-15 04:18:46', '/uploads/products/cpu/amd-ryzen-5-7600x.jpg'),
(183, 1, 'AMD Ryzen 7 7800X3D', 'amd-ryzen-7-7800x3d', 'CPU AMD Ryzen 7 thế hệ 7000 với công nghệ 3D V-Cache, 8 nhân 16 luồng, Base 4.2GHz, Boost 5.0GHz, Socket AM5, Hiệu năng gaming vượt trội', 12000000.00, 1, 1, 0, 0.00, 0, '2025-11-15 03:55:48', '2025-11-15 03:55:48', '/uploads/products/cpu/amd-ryzen-7-7800x3d.jpg'),
(184, 1, 'Intel Core i9-14900K', 'intel-core-i9-14900k', 'CPU Intel Core i9 thế hệ 14 flagship, 24 nhân (8P + 16E), 32 luồng, Base 3.2GHz, Boost 6.0GHz, Socket LGA1700, Hiệu năng đỉnh cao', 15000000.00, 1, 1, 2, 0.00, 0, '2025-11-15 03:55:48', '2025-11-15 04:08:42', '/uploads/products/cpu/intel-i9-14900k.jpg'),
(230, 1, 'Intel Core i5-14600KF', 'intel-core-i5-14600kf', 'CPU Intel Core i5 thế hệ 14, 14 nhân (6P + 8E), 20 luồng, Base 3.5GHz, Boost 5.3GHz, Socket LGA1700, Không có GPU tích hợp', 4500000.00, 1, 1, 2, 0.00, 0, '2025-11-15 04:08:05', '2025-11-15 04:13:56', '/uploads/products/cpu/intel-i5-14600kf.jpg');

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
(1, 'user1', 'user1@gmail.com', '$2b$10$EF5wE/PMLkT5GMjYAe4yi.DcP3MQed7.P4JxubFIdJvuqKtJB4Uea', NULL, NULL, 0, 1, '2025-10-31 15:52:20', '2025-10-31 16:40:04', NULL, '8c9cf13206ac361dacca424631371acd6ca2c42909812d91c0f141f2e9861bbd'),
(2, 'user2', 'user2@gmail.com', '$2b$10$sgscek75SEoXGWwZHmFfMuXSHZW0JLHE3pgLAEqCPe7pGimDqo3gS', NULL, NULL, 0, 1, '2025-11-01 01:07:16', '2025-11-01 01:07:16', NULL, NULL),
(3, 'abcdef', 'abc@gmail.com', '$2b$10$M8uNkONltbbKsY8y9DdqUeF3IFn1CeH9B0S6SBQzNB5QyVinKZ37.', NULL, NULL, 0, 1, '2025-11-01 10:27:03', '2025-11-01 10:27:03', NULL, NULL),
(4, 'bao', 'bao@gmail.com', '$2b$10$zPJUT/20Y4wiZUXjELb0QuDSWVxSkubIKLIpNIfYkVQuJY7E92J.e', 'bao', '0965656565', 0, 1, '2025-11-03 15:09:28', '2025-11-07 03:26:14', NULL, NULL),
(5, 'admin1', 'admin1@gmail.com', '$2b$10$b9lCzWVznD4ZMQ1Y6/bOc.Jn6efXZS1Us.ZjYVv2PFgHkqKr1PD1.', 'aaa', '0123456789', 2, 0, '2025-11-05 09:18:39', '2025-11-05 10:08:50', NULL, '39c81725075b25e0e973c080d442c787a6e9fdc55a1f613fab08e3fc7facbb7c'),
(6, 'admin', 'admin@gmail.com', '$2b$10$84e9xqnTc50CPaf5pOldT.Ob9zW9/RVK.G3Whr.TdAncfRdE.UivG', 'admin', '0123456788', 2, 1, '2025-11-05 09:33:52', '2025-11-15 02:51:00', NULL, '812b650bc602f1826592a50b9bffb4bd350613ffbadd3dae6be7d2f89987929a'),
(7, 'bao1', 'bao1@gmail.com', '$2b$10$sVY/zhJ2cKlwydAjQ090e.bMn1eFJKudObM.yOZiR06XPanyUgaFW', 'bao1', '0975846352', 0, 0, '2025-11-05 10:09:19', '2025-11-05 10:09:38', NULL, NULL),
(8, 'bb', 'bb@gmail.com', '$2b$10$i/dzC6SfHsM.5cHiYaS89ed4rg4SAoLtZz1/O2mA6eagocIogJoL6', NULL, NULL, 0, 1, '2025-11-07 03:26:38', '2025-11-07 08:05:59', NULL, NULL),
(9, 'ccc', 'cc@gmail.com', '$2b$10$zdMHGgXEqVXcvRmaoymJceZdwLmNnViMKR.Gss2KmhtlJzm9k8pp.', 'bao', '0987676765', 0, 1, '2025-11-07 08:06:49', '2025-11-07 08:23:41', NULL, '25df20a38db4f2d83703655c8fa0289a37154f1beeceb3ab72ad43f1bb4f13e3'),
(10, 'ddd', 'dd@gmail.com', '$2b$10$VOQn9zNNzcmwyWhyaGBHt.XROz23EkcPmj2Gzo8GEr3I07ARid5gq', 'dd', '0123456788', 0, 1, '2025-11-07 08:24:07', '2025-11-15 02:48:39', NULL, '2041e878c1697c14febd725e10871247db282ea00254f06e8209e0d16fec742f');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `variant_attributes`
--

CREATE TABLE `variant_attributes` (
  `variant_id` int(11) NOT NULL,
  `attribute_value_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
  ADD UNIQUE KEY `attribute_name` (`attribute_name`),
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
  MODIFY `address_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `articles`
--
ALTER TABLE `articles`
  MODIFY `article_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `attributes`
--
ALTER TABLE `attributes`
  MODIFY `attribute_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT cho bảng `attribute_categories`
--
ALTER TABLE `attribute_categories`
  MODIFY `attribute_category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT cho bảng `attribute_values`
--
ALTER TABLE `attribute_values`
  MODIFY `attribute_value_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

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
  MODIFY `cart_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `cart_items`
--
ALTER TABLE `cart_items`
  MODIFY `cart_item_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `categories`
--
ALTER TABLE `categories`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT cho bảng `coupons`
--
ALTER TABLE `coupons`
  MODIFY `coupon_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT cho bảng `notifications`
--
ALTER TABLE `notifications`
  MODIFY `notification_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `order_items`
--
ALTER TABLE `order_items`
  MODIFY `order_item_id` int(11) NOT NULL AUTO_INCREMENT;

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
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=231;

--
-- AUTO_INCREMENT cho bảng `product_variants`
--
ALTER TABLE `product_variants`
  MODIFY `variant_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=262;

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
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT cho bảng `variant_images`
--
ALTER TABLE `variant_images`
  MODIFY `image_id` int(11) NOT NULL AUTO_INCREMENT;

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
