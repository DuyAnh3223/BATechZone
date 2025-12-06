-- Schema MySQL (InnoDB, utf8mb4) cho posts, articles và post_images
-- Chạy trên MySQL 5.7+ hoặc MariaDB tương đương.

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- Bảng articles (danh mục)
CREATE TABLE IF NOT EXISTS articles (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  description TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_articles_slug (slug),
  KEY idx_articles_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng posts (một post thuộc một category)
CREATE TABLE IF NOT EXISTS posts (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  excerpt TEXT,
  content_html LONGTEXT NOT NULL,     -- lưu HTML đã sanitize
  content_text LONGTEXT,              -- bản plain-text để tìm kiếm/preview
  author_id BIGINT UNSIGNED,          -- tùy hệ thống auth của bạn
  article_id BIGINT UNSIGNED,        -- FK tới articles
  status ENUM('draft','published','archived') NOT NULL DEFAULT 'draft',
  featured_image_id BIGINT UNSIGNED,  -- FK tới post_images.id nếu muốn gán ảnh nổi bật
  view_count INT UNSIGNED NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_posts_slug (slug),
  KEY idx_posts_article (article_id),
  KEY idx_posts_author (author_id),
  CONSTRAINT fk_posts_article FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng post_images (quản lý ảnh liên quan tới một bài viết)
CREATE TABLE IF NOT EXISTS post_images (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  post_id BIGINT UNSIGNED,             -- FK tới posts.id. Nullable để support upload trước khi lưu post
  url VARCHAR(1024) NOT NULL,          -- URL hoặc relative path: '/uploads/posts/xxx.jpg'
  filename VARCHAR(512) NOT NULL,      -- original filename
  mime VARCHAR(100),
  size INT UNSIGNED,                   -- bytes
  is_featured TINYINT(1) NOT NULL DEFAULT 0, -- đánh dấu ảnh nổi bật nếu cần
  sort_order INT NOT NULL DEFAULT 0,   -- thứ tự hiển thị ảnh
  uploaded_by BIGINT UNSIGNED,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_post_images_post (post_id),
  CONSTRAINT fk_post_images_post FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;