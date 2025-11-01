-- =====================================================
-- E-COMMERCE DATABASE SCHEMA
-- Chuẩn hóa: 1NF, 2NF, 3NF
-- =====================================================

-- Drop tables if exists (theo thứ tự ngược lại để tránh lỗi foreign key)
DROP TABLE IF EXISTS variant_images;
DROP TABLE IF EXISTS cart_items;
DROP TABLE IF EXISTS build_items;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS warranty;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS service_requests;
DROP TABLE IF EXISTS carts;
DROP TABLE IF EXISTS reports;
DROP TABLE IF EXISTS recent_views;
DROP TABLE IF EXISTS wishlist_items;
DROP TABLE IF EXISTS wishlists;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS attribute_values;
DROP TABLE IF EXISTS attributes;
DROP TABLE IF EXISTS product_variants;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS articles;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS builds;
DROP TABLE IF EXISTS addresses;
DROP TABLE IF EXISTS coupons;
DROP TABLE IF EXISTS users;

-- =====================================================
-- BẢNG USERS - Người dùng
-- =====================================================
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    phone VARCHAR(20),
    role ENUM('customer', 'admin', 'shipper') DEFAULT 'customer' COMMENT 'customer=Khách hàng, admin=Quản trị viên, shipper=Người giao hàng',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    INDEX idx_email (email),
    INDEX idx_username (username),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- BẢNG ADDRESSES - Địa chỉ giao hàng
-- =====================================================
CREATE TABLE addresses (
    address_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    recipient_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    district VARCHAR(100),
    ward VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(50) DEFAULT 'Vietnam',
    is_default BOOLEAN DEFAULT FALSE,
    address_type ENUM('home', 'office', 'other') DEFAULT 'home' COMMENT 'home=Nhà riêng, office=Văn phòng, other=Khác',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_is_default (is_default)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- BẢNG CATEGORIES - Danh mục sản phẩm
-- =====================================================
CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    parent_category_id INT NULL,
    image_url VARCHAR(255),
    icon VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_category_id) REFERENCES categories(category_id) ON DELETE SET NULL,
    INDEX idx_parent_category (parent_category_id),
    INDEX idx_slug (slug),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- BẢNG PRODUCTS - Sản phẩm
-- =====================================================
CREATE TABLE products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    specifications TEXT,
    brand VARCHAR(100),
    model VARCHAR(100),
    base_price DECIMAL(12, 2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    view_count INT DEFAULT 0,
    rating_average DECIMAL(3, 2) DEFAULT 0.00,
    review_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE RESTRICT,
    INDEX idx_category_id (category_id),
    INDEX idx_slug (slug),
    INDEX idx_is_active (is_active),
    INDEX idx_is_featured (is_featured),
    INDEX idx_brand (brand),
    FULLTEXT idx_search (product_name, description)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- BẢNG ATTRIBUTES - Thuộc tính sản phẩm
-- =====================================================
CREATE TABLE attributes (
    attribute_id INT AUTO_INCREMENT PRIMARY KEY,
    attribute_name VARCHAR(100) NOT NULL UNIQUE,
    attribute_type ENUM('color', 'size', 'storage', 'ram', 'other') DEFAULT 'other',
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_attribute_type (attribute_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- BẢNG ATTRIBUTE_VALUES - Giá trị thuộc tính
-- =====================================================
CREATE TABLE attribute_values (
    attribute_value_id INT AUTO_INCREMENT PRIMARY KEY,
    attribute_id INT NOT NULL,
    value_name VARCHAR(100) NOT NULL,
    color_code VARCHAR(7),
    image_url VARCHAR(255),
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (attribute_id) REFERENCES attributes(attribute_id) ON DELETE CASCADE,
    INDEX idx_attribute_id (attribute_id),
    UNIQUE KEY uk_attribute_value (attribute_id, value_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- BẢNG PRODUCT_VARIANTS - Biến thể sản phẩm
-- =====================================================
CREATE TABLE product_variants (
    variant_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    sku VARCHAR(100) NOT NULL UNIQUE,
    variant_name VARCHAR(255),
    price DECIMAL(12, 2) NOT NULL,
    compare_at_price DECIMAL(12, 2),
    cost_price DECIMAL(12, 2),
    stock_quantity INT DEFAULT 0,
    weight DECIMAL(8, 2),
    dimensions VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    INDEX idx_product_id (product_id),
    INDEX idx_sku (sku),
    INDEX idx_is_active (is_active),
    CHECK (price >= 0),
    CHECK (stock_quantity >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- BẢNG TRUNG GIAN: VARIANT_ATTRIBUTES (N-N)
-- =====================================================
CREATE TABLE variant_attributes (
    variant_id INT NOT NULL,
    attribute_value_id INT NOT NULL,
    PRIMARY KEY (variant_id, attribute_value_id),
    FOREIGN KEY (variant_id) REFERENCES product_variants(variant_id) ON DELETE CASCADE,
    FOREIGN KEY (attribute_value_id) REFERENCES attribute_values(attribute_value_id) ON DELETE CASCADE,
    INDEX idx_variant_id (variant_id),
    INDEX idx_attribute_value_id (attribute_value_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- BẢNG VARIANT_IMAGES - Hình ảnh biến thể
-- =====================================================
CREATE TABLE variant_images (
    image_id INT AUTO_INCREMENT PRIMARY KEY,
    variant_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    alt_text VARCHAR(255),
    is_primary BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (variant_id) REFERENCES product_variants(variant_id) ON DELETE CASCADE,
    INDEX idx_variant_id (variant_id),
    INDEX idx_is_primary (is_primary)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- BẢNG CARTS - Giỏ hàng
-- =====================================================
CREATE TABLE carts (
    cart_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    session_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_session_id (session_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- BẢNG CART_ITEMS - Chi tiết giỏ hàng
-- =====================================================
CREATE TABLE cart_items (
    cart_item_id INT AUTO_INCREMENT PRIMARY KEY,
    cart_id INT NOT NULL,
    variant_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (cart_id) REFERENCES carts(cart_id) ON DELETE CASCADE,
    FOREIGN KEY (variant_id) REFERENCES product_variants(variant_id) ON DELETE CASCADE,
    INDEX idx_cart_id (cart_id),
    INDEX idx_variant_id (variant_id),
    UNIQUE KEY uk_cart_variant (cart_id, variant_id),
    CHECK (quantity > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- BẢNG COUPONS - Mã giảm giá
-- =====================================================
CREATE TABLE coupons (
    coupon_id INT AUTO_INCREMENT PRIMARY KEY,
    coupon_code VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255),
    discount_type ENUM('percentage', 'fixed_amount') NOT NULL,
    discount_value DECIMAL(10, 2) NOT NULL,
    max_discount_amount DECIMAL(10, 2),
    min_order_amount DECIMAL(10, 2) DEFAULT 0,
    usage_limit INT,
    used_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    valid_from TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    valid_until TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_coupon_code (coupon_code),
    INDEX idx_is_active (is_active),
    INDEX idx_valid_dates (valid_from, valid_until),
    CHECK (discount_value > 0),
    CHECK (used_count <= usage_limit OR usage_limit IS NULL)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- BẢNG ORDERS - Đơn hàng
-- =====================================================
CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    address_id INT,
    coupon_id INT,
    order_status ENUM('pending', 'confirmed', 'processing', 'shipping', 'delivered', 'cancelled', 'refunded') DEFAULT 'pending' COMMENT 'pending=Chờ xử lý, confirmed=Đã xác nhận, processing=Đang xử lý, shipping=Đang giao hàng, delivered=Đã giao hàng, cancelled=Đã hủy, refunded=Đã hoàn tiền',
    payment_status ENUM('unpaid', 'paid', 'partially_paid', 'refunded') DEFAULT 'unpaid' COMMENT 'unpaid=Chưa thanh toán, paid=Đã thanh toán, partially_paid=Thanh toán một phần, refunded=Đã hoàn tiền',
    subtotal DECIMAL(12, 2) NOT NULL,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    shipping_fee DECIMAL(10, 2) DEFAULT 0,
    tax_amount DECIMAL(10, 2) DEFAULT 0,
    total_amount DECIMAL(12, 2) NOT NULL,
    notes TEXT,
    cancelled_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    confirmed_at TIMESTAMP NULL,
    shipped_at TIMESTAMP NULL,
    delivered_at TIMESTAMP NULL,
    cancelled_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE RESTRICT,
    FOREIGN KEY (address_id) REFERENCES addresses(address_id) ON DELETE SET NULL,
    FOREIGN KEY (coupon_id) REFERENCES coupons(coupon_id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_order_number (order_number),
    INDEX idx_order_status (order_status),
    INDEX idx_payment_status (payment_status),
    INDEX idx_created_at (created_at),
    CHECK (total_amount >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- BẢNG ORDER_ITEMS - Chi tiết đơn hàng
-- =====================================================
CREATE TABLE order_items (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    variant_id INT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    variant_name VARCHAR(255),
    sku VARCHAR(100),
    quantity INT NOT NULL,
    unit_price DECIMAL(12, 2) NOT NULL,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    subtotal DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (variant_id) REFERENCES product_variants(variant_id) ON DELETE RESTRICT,
    INDEX idx_order_id (order_id),
    INDEX idx_variant_id (variant_id),
    CHECK (quantity > 0),
    CHECK (unit_price >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- BẢNG PAYMENTS - Thanh toán
-- =====================================================
CREATE TABLE payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    payment_method ENUM('cod', 'bank_transfer', 'credit_card', 'e_wallet', 'installment') NOT NULL COMMENT 'cod=Thanh toán khi nhận hàng, bank_transfer=Chuyển khoản ngân hàng, credit_card=Thẻ tín dụng, e_wallet=Ví điện tử, installment=Trả góp',
    payment_status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending' COMMENT 'pending=Chờ thanh toán, completed=Hoàn thành, failed=Thất bại, refunded=Đã hoàn tiền',
    amount DECIMAL(12, 2) NOT NULL,
    transaction_id VARCHAR(100),
    payment_gateway VARCHAR(50),
    payment_details TEXT,
    paid_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    INDEX idx_order_id (order_id),
    INDEX idx_payment_status (payment_status),
    INDEX idx_transaction_id (transaction_id),
    CHECK (amount > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- BẢNG WARRANTY - Bảo hành
-- =====================================================
CREATE TABLE warranty (
    warranty_id INT AUTO_INCREMENT PRIMARY KEY,
    order_item_id INT NOT NULL,
    service_request_id INT,
    warranty_period INT NOT NULL COMMENT 'Thời gian bảo hành (tháng)',
    warranty_type ENUM('manufacturer', 'store', 'extended') DEFAULT 'manufacturer' COMMENT 'manufacturer=Bảo hành hãng, store=Bảo hành cửa hàng, extended=Bảo hành mở rộng',
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status ENUM('active', 'expired', 'claimed', 'void') DEFAULT 'active' COMMENT 'active=Đang hiệu lực, expired=Đã hết hạn, claimed=Đã yêu cầu, void=Vô hiệu',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_item_id) REFERENCES order_items(order_item_id) ON DELETE CASCADE,
    INDEX idx_order_item_id (order_item_id),
    INDEX idx_status (status),
    INDEX idx_end_date (end_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- BẢNG SERVICE_REQUESTS - Yêu cầu bảo hành/dịch vụ
-- =====================================================
CREATE TABLE service_requests (
    service_request_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    request_type ENUM('warranty', 'repair', 'return') NOT NULL COMMENT 'warranty=Bảo hành, repair=Sửa chữa, return=Đổi trả',
    status ENUM('pending', 'processing', 'completed', 'rejected', 'cancelled') DEFAULT 'pending' COMMENT 'pending=Chờ xử lý, processing=Đang xử lý, completed=Hoàn thành, rejected=Từ chối, cancelled=Đã hủy',
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium' COMMENT 'low=Thấp, medium=Trung bình, high=Cao, urgent=Khẩn cấp',
    assigned_to INT,
    resolution TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_request_type (request_type),
    INDEX idx_priority (priority)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Thêm foreign key cho warranty
ALTER TABLE warranty 
ADD CONSTRAINT fk_warranty_service_request 
FOREIGN KEY (service_request_id) REFERENCES service_requests(service_request_id) ON DELETE SET NULL;

-- =====================================================
-- BẢNG WISHLISTS - Danh sách yêu thích
-- =====================================================
CREATE TABLE wishlists (
    wishlist_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    wishlist_name VARCHAR(100) DEFAULT 'My Wishlist',
    is_default BOOLEAN DEFAULT TRUE,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- BẢNG TRUNG GIAN: WISHLIST_ITEMS (N-N)
-- =====================================================
CREATE TABLE wishlist_items (
    wishlist_id INT NOT NULL,
    variant_id INT NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (wishlist_id, variant_id),
    FOREIGN KEY (wishlist_id) REFERENCES wishlists(wishlist_id) ON DELETE CASCADE,
    FOREIGN KEY (variant_id) REFERENCES product_variants(variant_id) ON DELETE CASCADE,
    INDEX idx_wishlist_id (wishlist_id),
    INDEX idx_variant_id (variant_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- BẢNG REVIEWS - Đánh giá sản phẩm
-- =====================================================
CREATE TABLE reviews (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    variant_id INT NOT NULL,
    order_id INT,
    rating INT NOT NULL,
    title VARCHAR(255),
    comment TEXT,
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT FALSE,
    helpful_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (variant_id) REFERENCES product_variants(variant_id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_variant_id (variant_id),
    INDEX idx_rating (rating),
    INDEX idx_is_approved (is_approved),
    CHECK (rating BETWEEN 1 AND 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- BẢNG RECENT_VIEWS - Lịch sử xem sản phẩm
-- =====================================================
CREATE TABLE recent_views (
    view_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    variant_id INT NOT NULL,
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (variant_id) REFERENCES product_variants(variant_id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_variant_id (variant_id),
    INDEX idx_viewed_at (viewed_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- BẢNG NOTIFICATIONS - Thông báo
-- =====================================================
CREATE TABLE notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    notification_type ENUM('order', 'promotion', 'system', 'review', 'message') NOT NULL COMMENT 'order=Đơn hàng, promotion=Khuyến mãi, system=Hệ thống, review=Đánh giá, message=Tin nhắn',
    title VARCHAR(255) NOT NULL,
    content TEXT,
    link_url VARCHAR(255),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_is_read (is_read),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- BẢNG REPORTS - Báo cáo vi phạm
-- =====================================================
CREATE TABLE reports (
    report_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    variant_id INT NOT NULL,
    report_type ENUM('fake_product', 'inappropriate_content', 'misleading_info', 'other') NOT NULL COMMENT 'fake_product=Sản phẩm giả, inappropriate_content=Nội dung không phù hợp, misleading_info=Thông tin sai lệch, other=Khác',
    description TEXT NOT NULL,
    status ENUM('pending', 'reviewing', 'resolved', 'rejected') DEFAULT 'pending' COMMENT 'pending=Chờ xử lý, reviewing=Đang xem xét, resolved=Đã xử lý, rejected=Từ chối',
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (variant_id) REFERENCES product_variants(variant_id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_variant_id (variant_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- BẢNG BUILDS - Cấu hình PC/Build
-- =====================================================
CREATE TABLE builds (
    build_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    build_name VARCHAR(255) NOT NULL,
    description TEXT,
    total_price DECIMAL(12, 2) DEFAULT 0,
    is_public BOOLEAN DEFAULT FALSE,
    is_saved BOOLEAN DEFAULT TRUE,
    view_count INT DEFAULT 0,
    like_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_is_public (is_public),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- BẢNG BUILD_ITEMS - Chi tiết cấu hình
-- =====================================================
CREATE TABLE build_items (
    build_item_id INT AUTO_INCREMENT PRIMARY KEY,
    build_id INT NOT NULL,
    variant_id INT NOT NULL,
    component_type VARCHAR(50) COMMENT 'CPU, GPU, RAM, Motherboard, etc.',
    quantity INT DEFAULT 1,
    unit_price DECIMAL(12, 2) NOT NULL,
    notes TEXT,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (build_id) REFERENCES builds(build_id) ON DELETE CASCADE,
    FOREIGN KEY (variant_id) REFERENCES product_variants(variant_id) ON DELETE CASCADE,
    INDEX idx_build_id (build_id),
    INDEX idx_variant_id (variant_id),
    CHECK (quantity > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- BẢNG POSTS - Bài viết
-- =====================================================
CREATE TABLE posts (
    post_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    content TEXT NOT NULL,
    excerpt TEXT,
    featured_image VARCHAR(255),
    post_type ENUM('blog', 'news', 'guide', 'review') DEFAULT 'blog' COMMENT 'blog=Blog, news=Tin tức, guide=Hướng dẫn, review=Đánh giá',
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft' COMMENT 'draft=Bản nháp, published=Đã xuất bản, archived=Đã lưu trữ',
    view_count INT DEFAULT 0,
    like_count INT DEFAULT 0,
    comment_count INT DEFAULT 0,
    published_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE RESTRICT,
    INDEX idx_user_id (user_id),
    INDEX idx_slug (slug),
    INDEX idx_status (status),
    INDEX idx_post_type (post_type),
    FULLTEXT idx_search (title, content)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- BẢNG ARTICLES - Bài viết chi tiết (kế thừa Posts)
-- =====================================================
CREATE TABLE articles (
    article_id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL UNIQUE,
    category_id INT,
    tags VARCHAR(255),
    meta_title VARCHAR(255),
    meta_description VARCHAR(500),
    reading_time INT COMMENT 'Thời gian đọc (phút)',
    seo_keywords VARCHAR(255),
    FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE SET NULL,
    INDEX idx_post_id (post_id),
    INDEX idx_category_id (category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Trigger cập nhật rating trung bình cho product
DELIMITER //
CREATE TRIGGER after_review_insert
AFTER INSERT ON reviews
FOR EACH ROW
BEGIN
    DECLARE avg_rating DECIMAL(3, 2);
    DECLARE review_cnt INT;
    
    SELECT AVG(rating), COUNT(*) INTO avg_rating, review_cnt
    FROM reviews
    WHERE variant_id = NEW.variant_id AND is_approved = TRUE;
    
    UPDATE products p
    INNER JOIN product_variants pv ON p.product_id = pv.product_id
    SET p.rating_average = avg_rating,
        p.review_count = review_cnt
    WHERE pv.variant_id = NEW.variant_id;
END//

-- Trigger cập nhật tổng giá build
CREATE TRIGGER after_build_item_insert
AFTER INSERT ON build_items
FOR EACH ROW
BEGIN
    UPDATE builds
    SET total_price = (
        SELECT SUM(unit_price * quantity)
        FROM build_items
        WHERE build_id = NEW.build_id
    )
    WHERE build_id = NEW.build_id;
END//

-- Trigger cập nhật usage count cho coupon
CREATE TRIGGER after_order_insert
AFTER INSERT ON orders
FOR EACH ROW
BEGIN
    IF NEW.coupon_id IS NOT NULL THEN
        UPDATE coupons
        SET used_count = used_count + 1
        WHERE coupon_id = NEW.coupon_id;
    END IF;
END//

DELIMITER ;

-- =====================================================
-- INDEXES BỔ SUNG CHO HIỆU NĂNG
-- =====================================================

-- Composite indexes cho các truy vấn phổ biến
CREATE INDEX idx_orders_user_status ON orders(user_id, order_status, created_at);
CREATE INDEX idx_products_category_active ON products(category_id, is_active, created_at);
CREATE INDEX idx_variants_product_active ON product_variants(product_id, is_active);
CREATE INDEX idx_reviews_variant_approved ON reviews(variant_id, is_approved, created_at);

-- =====================================================
-- DỮ LIỆU MẪU (SAMPLE DATA)
-- =====================================================

-- Insert Users
INSERT INTO users (username, email, password_hash, full_name, phone, role) VALUES
('admin', 'admin@techstore.com', '$2y$10$abcdefghijklmnopqrstuvwxyz', 'Administrator', '0901234567', 'admin'),
('john_doe', 'john@example.com', '$2y$10$abcdefghijklmnopqrstuvwxyz', 'John Doe', '0912345678', 'customer'),
('jane_smith', 'jane@example.com', '$2y$10$abcdefghijklmnopqrstuvwxyz', 'Jane Smith', '0923456789', 'customer'),
('staff01', 'staff@techstore.com', '$2y$10$abcdefghijklmnopqrstuvwxyz', 'Staff Member', '0934567890', 'staff');

-- Insert Categories
INSERT INTO categories (category_name, slug, description, parent_category_id, is_active) VALUES
('Linh kiện máy tính', 'linh-kien-may-tinh', 'Các linh kiện máy tính', NULL, TRUE),
('Laptop', 'laptop', 'Laptop các loại', NULL, TRUE),
('PC Gaming', 'pc-gaming', 'PC Gaming và linh kiện', NULL, TRUE),
('Phụ kiện', 'phu-kien', 'Phụ kiện máy tính', NULL, TRUE),
('CPU', 'cpu', 'Bộ vi xử lý', 1, TRUE),
('VGA', 'vga', 'Card màn hình', 1, TRUE),
('RAM', 'ram', 'Bộ nhớ RAM', 1, TRUE),
('Mainboard', 'mainboard', 'Bo mạch chủ', 1, TRUE),
('SSD', 'ssd', 'Ổ cứng SSD', 1, TRUE),
('HDD', 'hdd', 'Ổ cứng HDD', 1, TRUE);

-- Insert Attributes
INSERT INTO attributes (attribute_name, attribute_type, display_order) VALUES
('Màu sắc', 'color', 1),
('Dung lượng', 'storage', 2),
('Tốc độ', 'other', 3),
('Socket', 'other', 4),
('Chipset', 'other', 5);

-- Insert Attribute Values
INSERT INTO attribute_values (attribute_id, value_name, color_code) VALUES
(1, 'Đen', '#000000'),
(1, 'Trắng', '#FFFFFF'),
(1, 'Xám', '#808080'),
(2, '8GB', NULL),
(2, '16GB', NULL),
(2, '32GB', NULL),
(2, '512GB', NULL),
(2, '1TB', NULL),
(3, '3200MHz', NULL),
(3, '3600MHz', NULL);

-- Insert Products
INSERT INTO products (category_id, product_name, slug, description, brand, base_price, is_active, is_featured) VALUES
(5, 'Intel Core i9-13900K', 'intel-core-i9-13900k', 'CPU Intel thế hệ 13, 24 nhân 32 luồng', 'Intel', 12990000, TRUE, TRUE),
(5, 'AMD Ryzen 9 7950X', 'amd-ryzen-9-7950x', 'CPU AMD Ryzen 9 thế hệ 7000, 16 nhân 32 luồng', 'AMD', 14990000, TRUE, TRUE),
(6, 'NVIDIA RTX 4090', 'nvidia-rtx-4090', 'Card đồ họa RTX 4090 24GB GDDR6X', 'NVIDIA', 45990000, TRUE, TRUE),
(6, 'AMD Radeon RX 7900 XTX', 'amd-radeon-rx-7900-xtx', 'Card đồ họa AMD 24GB GDDR6', 'AMD', 25990000, TRUE, TRUE),
(7, 'Corsair Vengeance DDR5', 'corsair-vengeance-ddr5', 'RAM DDR5 hiệu năng cao', 'Corsair', 3290000, TRUE, TRUE),
(7, 'G.Skill Trident Z5 RGB', 'gskill-trident-z5-rgb', 'RAM DDR5 RGB', 'G.Skill', 3590000, TRUE, TRUE),
(9, 'Samsung 980 PRO', 'samsung-980-pro', 'SSD NVMe Gen 4', 'Samsung', 2890000, TRUE, TRUE),
(9, 'WD Black SN850X', 'wd-black-sn850x', 'SSD NVMe Gaming', 'Western Digital', 3190000, TRUE, TRUE),
(2, 'ASUS ROG Strix G16', 'asus-rog-strix-g16', 'Laptop gaming cao cấp', 'ASUS', 45990000, TRUE, TRUE),
(2, 'MSI Titan GT77', 'msi-titan-gt77', 'Laptop gaming flagship', 'MSI', 89990000, TRUE, TRUE);

-- Insert Product Variants
INSERT INTO product_variants (product_id, sku, variant_name, price, stock_quantity, is_default) VALUES
(1, 'CPU-I9-13900K-001', 'Intel Core i9-13900K Box', 12990000, 50, TRUE),
(2, 'CPU-R9-7950X-001', 'AMD Ryzen 9 7950X Box', 14990000, 30, TRUE),
(3, 'VGA-RTX4090-001', 'NVIDIA RTX 4090 24GB', 45990000, 20, TRUE),
(4, 'VGA-RX7900XTX-001', 'AMD RX 7900 XTX 24GB', 25990000, 25, TRUE),
(5, 'RAM-CORS-DDR5-16GB', 'Corsair Vengeance DDR5 16GB', 3290000, 100, TRUE),
(5, 'RAM-CORS-DDR5-32GB', 'Corsair Vengeance DDR5 32GB', 6290000, 80, FALSE),
(6, 'RAM-GS-TZ5-16GB', 'G.Skill Trident Z5 16GB RGB', 3590000, 90, TRUE),
(6, 'RAM-GS-TZ5-32GB', 'G.Skill Trident Z5 32GB RGB', 6890000, 70, FALSE),
(7, 'SSD-SAM-980PRO-1TB', 'Samsung 980 PRO 1TB', 2890000, 150, TRUE),
(7, 'SSD-SAM-980PRO-2TB', 'Samsung 980 PRO 2TB', 5490000, 100, FALSE),
(8, 'SSD-WD-SN850X-1TB', 'WD Black SN850X 1TB', 3190000, 120, TRUE),
(8, 'SSD-WD-SN850X-2TB', 'WD Black SN850X 2TB', 5990000, 80, FALSE);

-- Insert Variant Images
INSERT INTO variant_images (variant_id, image_url, alt_text, is_primary, display_order) VALUES
(1, '/images/products/intel-i9-13900k-1.jpg', 'Intel Core i9-13900K', TRUE, 1),
(1, '/images/products/intel-i9-13900k-2.jpg', 'Intel Core i9-13900K Box', FALSE, 2),
(2, '/images/products/amd-r9-7950x-1.jpg', 'AMD Ryzen 9 7950X', TRUE, 1),
(3, '/images/products/rtx-4090-1.jpg', 'NVIDIA RTX 4090', TRUE, 1),
(4, '/images/products/rx-7900xtx-1.jpg', 'AMD RX 7900 XTX', TRUE, 1);

-- Insert Addresses
INSERT INTO addresses (user_id, recipient_name, phone, address_line1, city, district, ward, is_default) VALUES
(2, 'John Doe', '0912345678', '123 Nguyễn Văn Linh', 'TP. Hồ Chí Minh', 'Quận 7', 'Phường Tân Phú', TRUE),
(3, 'Jane Smith', '0923456789', '456 Lê Văn Việt', 'TP. Hồ Chí Minh', 'Quận 9', 'Phường Tăng Nhơn Phú A', TRUE);

-- Insert Coupons
INSERT INTO coupons (coupon_code, description, discount_type, discount_value, min_order_amount, usage_limit, valid_from, valid_until) VALUES
('WELCOME2024', 'Giảm giá cho khách hàng mới', 'percentage', 10.00, 1000000, 100, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY)),
('TECH500K', 'Giảm 500K cho đơn từ 10 triệu', 'fixed_amount', 500000.00, 10000000, 50, NOW(), DATE_ADD(NOW(), INTERVAL 60 DAY)),
('FREESHIP', 'Miễn phí vận chuyển', 'fixed_amount', 50000.00, 500000, 200, NOW(), DATE_ADD(NOW(), INTERVAL 90 DAY));

-- Insert Carts
INSERT INTO carts (user_id, session_id) VALUES
(2, 'sess_john_001'),
(3, 'sess_jane_001');

-- Insert Cart Items
INSERT INTO cart_items (cart_id, variant_id, quantity) VALUES
(1, 1, 1),
(1, 5, 2),
(1, 9, 1),
(2, 3, 1),
(2, 7, 2);

-- Insert Orders
INSERT INTO orders (user_id, order_number, address_id, order_status, payment_status, subtotal, shipping_fee, total_amount) VALUES
(2, 'ORD-2024-001', 1, 'delivered', 'paid', 19170000, 0, 19170000),
(3, 'ORD-2024-002', 2, 'shipping', 'paid', 45990000, 0, 45990000);

-- Insert Order Items
INSERT INTO order_items (order_id, variant_id, product_name, variant_name, sku, quantity, unit_price, subtotal) VALUES
(1, 1, 'Intel Core i9-13900K', 'Intel Core i9-13900K Box', 'CPU-I9-13900K-001', 1, 12990000, 12990000),
(1, 5, 'Corsair Vengeance DDR5', 'Corsair Vengeance DDR5 16GB', 'RAM-CORS-DDR5-16GB', 2, 3290000, 6580000),
(2, 3, 'NVIDIA RTX 4090', 'NVIDIA RTX 4090 24GB', 'VGA-RTX4090-001', 1, 45990000, 45990000);

-- Insert Payments
INSERT INTO payments (order_id, payment_method, payment_status, amount, transaction_id, paid_at) VALUES
(1, 'bank_transfer', 'completed', 19170000, 'TXN-001-2024', NOW()),
(2, 'credit_card', 'completed', 45990000, 'TXN-002-2024', NOW());

-- Insert Warranty
INSERT INTO warranty (order_item_id, warranty_period, warranty_type, start_date, end_date, status) VALUES
(1, 36, 'manufacturer', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 36 MONTH), 'active'),
(2, 36, 'manufacturer', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 36 MONTH), 'active'),
(3, 24, 'manufacturer', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 24 MONTH), 'active');

-- Insert Wishlists
INSERT INTO wishlists (user_id, wishlist_name, is_default) VALUES
(2, 'My Wishlist', TRUE),
(3, 'Dream Build', TRUE);

-- Insert Wishlist Items
INSERT INTO wishlist_items (wishlist_id, variant_id) VALUES
(1, 3),
(1, 9),
(2, 1),
(2, 4);

-- Insert Reviews
INSERT INTO reviews (user_id, variant_id, order_id, rating, title, comment, is_verified_purchase, is_approved) VALUES
(2, 1, 1, 5, 'CPU tuyệt vời!', 'Hiệu năng mạnh mẽ, chạy game và render rất mượt', TRUE, TRUE),
(2, 5, 1, 4, 'RAM ổn định', 'Chạy ổn định ở 3200MHz, chưa thử OC', TRUE, TRUE),
(3, 3, 2, 5, 'Card đồ họa hàng đầu', 'Chơi game 4K max setting vẫn 120fps', TRUE, TRUE);

-- Insert Notifications
INSERT INTO notifications (user_id, notification_type, title, content, is_read) VALUES
(2, 'order', 'Đơn hàng đã được giao', 'Đơn hàng ORD-2024-001 đã được giao thành công', TRUE),
(3, 'order', 'Đơn hàng đang vận chuyển', 'Đơn hàng ORD-2024-002 đang trên đường giao đến bạn', FALSE),
(2, 'promotion', 'Khuyến mãi đặc biệt', 'Giảm giá 20% cho CPU Intel trong tuần này', FALSE);

-- Insert Builds
INSERT INTO builds (user_id, build_name, description, total_price, is_public) VALUES
(2, 'Gaming Build 2024', 'Build gaming cao cấp cho 4K gaming', 72860000, TRUE),
(3, 'Workstation Pro', 'Build cho công việc đồ họa và render', 0, FALSE);

-- Insert Build Items
INSERT INTO build_items (build_id, variant_id, component_type, quantity, unit_price) VALUES
(1, 1, 'CPU', 1, 12990000),
(1, 3, 'VGA', 1, 45990000),
(1, 5, 'RAM', 2, 3290000),
(1, 9, 'SSD', 1, 2890000);

-- Insert Posts
INSERT INTO posts (user_id, title, slug, content, post_type, status, published_at) VALUES
(1, 'Hướng dẫn build PC gaming 2024', 'huong-dan-build-pc-gaming-2024', 'Nội dung chi tiết về cách build PC gaming...', 'guide', 'published', NOW()),
(1, 'Top 5 CPU tốt nhất năm 2024', 'top-5-cpu-tot-nhat-2024', 'Danh sách các CPU đáng mua nhất...', 'blog', 'published', NOW()),
(1, 'RTX 4090 vs RX 7900 XTX', 'rtx-4090-vs-rx-7900-xtx', 'So sánh chi tiết giữa 2 card đồ họa hàng đầu...', 'review', 'published', NOW());

-- Insert Articles
INSERT INTO articles (post_id, category_id, tags, reading_time) VALUES
(1, 1, 'build pc,gaming,hướng dẫn', 15),
(2, 5, 'cpu,intel,amd,review', 10),
(3, 6, 'vga,nvidia,amd,comparison', 12);

-- Insert Service Requests
INSERT INTO service_requests (user_id, request_type, status, subject, description, priority) VALUES
(2, 'consultation', 'completed', 'Tư vấn build PC 30 triệu', 'Cần tư vấn build PC để làm đồ họa và gaming nhẹ', 'medium'),
(3, 'warranty', 'processing', 'Kiểm tra bảo hành RAM', 'RAM có dấu hiệu không ổn định, cần kiểm tra', 'high');

-- Insert Recent Views
INSERT INTO recent_views (user_id, variant_id, viewed_at) VALUES
(2, 1, DATE_SUB(NOW(), INTERVAL 1 HOUR)),
(2, 3, DATE_SUB(NOW(), INTERVAL 2 HOUR)),
(2, 5, DATE_SUB(NOW(), INTERVAL 3 HOUR)),
(3, 4, DATE_SUB(NOW(), INTERVAL 1 HOUR)),
(3, 7, DATE_SUB(NOW(), INTERVAL 4 HOUR));

-- =====================================================
-- VIEWS - Các view hữu ích cho truy vấn
-- =====================================================

-- View: Sản phẩm với thông tin đầy đủ
CREATE OR REPLACE VIEW v_product_details AS
SELECT 
    p.product_id,
    p.product_name,
    p.slug,
    p.description,
    p.brand,
    p.base_price,
    p.rating_average,
    p.review_count,
    p.view_count,
    c.category_name,
    c.slug AS category_slug,
    COUNT(DISTINCT pv.variant_id) AS variant_count,
    MIN(pv.price) AS min_price,
    MAX(pv.price) AS max_price,
    SUM(pv.stock_quantity) AS total_stock
FROM products p
LEFT JOIN categories c ON p.category_id = c.category_id
LEFT JOIN product_variants pv ON p.product_id = pv.product_id
WHERE p.is_active = TRUE
GROUP BY p.product_id;

-- View: Đơn hàng với thông tin chi tiết
CREATE OR REPLACE VIEW v_order_summary AS
SELECT 
    o.order_id,
    o.order_number,
    o.order_status,
    o.payment_status,
    o.total_amount,
    o.created_at,
    u.username,
    u.email,
    u.full_name,
    a.city,
    a.district,
    COUNT(oi.order_item_id) AS item_count
FROM orders o
INNER JOIN users u ON o.user_id = u.user_id
LEFT JOIN addresses a ON o.address_id = a.address_id
LEFT JOIN order_items oi ON o.order_id = oi.order_id
GROUP BY o.order_id;

-- View: Thống kê người dùng
CREATE OR REPLACE VIEW v_user_statistics AS
SELECT 
    u.user_id,
    u.username,
    u.email,
    u.full_name,
    COUNT(DISTINCT o.order_id) AS total_orders,
    COALESCE(SUM(o.total_amount), 0) AS total_spent,
    COUNT(DISTINCT r.review_id) AS total_reviews,
    COUNT(DISTINCT w.wishlist_id) AS total_wishlists
FROM users u
LEFT JOIN orders o ON u.user_id = o.user_id AND o.order_status = 'delivered'
LEFT JOIN reviews r ON u.user_id = r.user_id
LEFT JOIN wishlists w ON u.user_id = w.user_id
GROUP BY u.user_id;

-- View: Top sản phẩm bán chạy
CREATE OR REPLACE VIEW v_best_selling_products AS
SELECT 
    p.product_id,
    p.product_name,
    p.brand,
    pv.variant_id,
    pv.variant_name,
    SUM(oi.quantity) AS total_sold,
    SUM(oi.subtotal) AS total_revenue,
    COUNT(DISTINCT oi.order_id) AS order_count
FROM products p
INNER JOIN product_variants pv ON p.product_id = pv.product_id
INNER JOIN order_items oi ON pv.variant_id = oi.variant_id
INNER JOIN orders o ON oi.order_id = o.order_id
WHERE o.order_status IN ('delivered', 'shipping')
GROUP BY p.product_id, pv.variant_id
ORDER BY total_sold DESC;

-- =====================================================
-- STORED PROCEDURES
-- =====================================================

-- Procedure: Tính toán tổng giá trị đơn hàng
DELIMITER //

CREATE PROCEDURE sp_calculate_order_total(
    IN p_order_id INT,
    OUT p_subtotal DECIMAL(12,2),
    OUT p_total DECIMAL(12,2)
)
BEGIN
    SELECT 
        SUM(subtotal) INTO p_subtotal
    FROM order_items
    WHERE order_id = p_order_id;
    
    SELECT 
        subtotal + shipping_fee - discount_amount + tax_amount INTO p_total
    FROM orders
    WHERE order_id = p_order_id;
END//

-- Procedure: Lấy sản phẩm được xem gần đây
CREATE PROCEDURE sp_get_recent_viewed_products(
    IN p_user_id INT,
    IN p_limit INT
)
BEGIN
    SELECT DISTINCT
        p.product_id,
        p.product_name,
        p.slug,
        pv.variant_id,
        pv.price,
        pv.sku,
        rv.viewed_at
    FROM recent_views rv
    INNER JOIN product_variants pv ON rv.variant_id = pv.variant_id
    INNER JOIN products p ON pv.product_id = p.product_id
    WHERE rv.user_id = p_user_id
    ORDER BY rv.viewed_at DESC
    LIMIT p_limit;
END//

-- Procedure: Cập nhật tồn kho sau khi đặt hàng
CREATE PROCEDURE sp_update_stock_after_order(
    IN p_order_id INT
)
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE v_variant_id INT;
    DECLARE v_quantity INT;
    DECLARE cur CURSOR FOR 
        SELECT variant_id, quantity 
        FROM order_items 
        WHERE order_id = p_order_id;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    OPEN cur;
    
    read_loop: LOOP
        FETCH cur INTO v_variant_id, v_quantity;
        IF done THEN
            LEAVE read_loop;
        END IF;
        
        UPDATE product_variants
        SET stock_quantity = stock_quantity - v_quantity
        WHERE variant_id = v_variant_id;
    END LOOP;
    
    CLOSE cur;
END//

-- Procedure: Thống kê doanh thu theo tháng
CREATE PROCEDURE sp_revenue_by_month(
    IN p_year INT
)
BEGIN
    SELECT 
        MONTH(created_at) AS month,
        COUNT(order_id) AS total_orders,
        SUM(total_amount) AS total_revenue,
        AVG(total_amount) AS avg_order_value
    FROM orders
    WHERE YEAR(created_at) = p_year
        AND order_status = 'delivered'
        AND payment_status = 'paid'
    GROUP BY MONTH(created_at)
    ORDER BY month;
END//

DELIMITER ;

-- =====================================================
-- FUNCTIONS
-- =====================================================

DELIMITER //

-- Function: Tính điểm loyalty cho khách hàng
CREATE FUNCTION fn_calculate_loyalty_points(p_user_id INT)
RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE total_points INT DEFAULT 0;
    
    SELECT COALESCE(SUM(total_amount) / 1000, 0) INTO total_points
    FROM orders
    WHERE user_id = p_user_id
        AND order_status = 'delivered'
        AND payment_status = 'paid';
    
    RETURN total_points;
END//

-- Function: Kiểm tra tồn kho
CREATE FUNCTION fn_check_stock_availability(
    p_variant_id INT,
    p_quantity INT
)
RETURNS BOOLEAN
DETERMINISTIC
BEGIN
    DECLARE current_stock INT;
    
    SELECT stock_quantity INTO current_stock
    FROM product_variants
    WHERE variant_id = p_variant_id;
    
    RETURN current_stock >= p_quantity;
END//

DELIMITER ;

-- =====================================================
-- QUERY EXAMPLES - Các truy vấn mẫu hữu ích
-- =====================================================

/*
-- 1. Lấy danh sách sản phẩm với giá và tồn kho
SELECT 
    p.product_name,
    pv.variant_name,
    pv.price,
    pv.stock_quantity,
    c.category_name
FROM products p
INNER JOIN product_variants pv ON p.product_id = pv.product_id
INNER JOIN categories c ON p.category_id = c.category_id
WHERE p.is_active = TRUE AND pv.is_active = TRUE;

-- 2. Thống kê đơn hàng theo trạng thái
SELECT 
    order_status,
    COUNT(*) AS order_count,
    SUM(total_amount) AS total_revenue
FROM orders
GROUP BY order_status;

-- 3. Top 10 khách hàng chi tiêu nhiều nhất
SELECT 
    u.username,
    u.full_name,
    COUNT(o.order_id) AS total_orders,
    SUM(o.total_amount) AS total_spent
FROM users u
INNER JOIN orders o ON u.user_id = o.user_id
WHERE o.order_status = 'delivered'
GROUP BY u.user_id
ORDER BY total_spent DESC
LIMIT 10;

-- 4. Sản phẩm có rating cao nhất
SELECT 
    p.product_name,
    p.rating_average,
    p.review_count
FROM products p
WHERE p.review_count >= 5
ORDER BY p.rating_average DESC, p.review_count DESC
LIMIT 10;

-- 5. Sản phẩm sắp hết hàng
SELECT 
    p.product_name,
    pv.variant_name,
    pv.stock_quantity
FROM products p
INNER JOIN product_variants pv ON p.product_id = pv.product_id
WHERE pv.stock_quantity < 10 AND pv.stock_quantity > 0
ORDER BY pv.stock_quantity ASC;
*/

-- =====================================================
-- KẾT THÚC SCRIPT
-- =====================================================

-- Thông báo hoàn thành
SELECT 'Database schema created successfully!' AS Status;