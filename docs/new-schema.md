1/ attributes
CREATE TABLE attributes (
  attribute_id INT AUTO_INCREMENT PRIMARY KEY,
  attribute_name VARCHAR(100) NOT NULL,
  display_order INT DEFAULT 0,
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

2/ attribute_values

Không cần chỉnh nhiều.

CREATE TABLE attribute_values (
  attribute_value_id INT AUTO_INCREMENT PRIMARY KEY,
  attribute_id INT NOT NULL,
  value_name VARCHAR(100) NOT NULL,
  color_code VARCHAR(7),
  image_url VARCHAR(255),
  display_order INT DEFAULT 0,
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (attribute_id, value_name),
  FOREIGN KEY (attribute_id) REFERENCES attributes(attribute_id)
    ON DELETE CASCADE
);

3/ categories
Giữ nguyên.
4/products
Giữ nguyên.

5/product_variants
CREATE TABLE product_variants (
  variant_id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  sku VARCHAR(100) UNIQUE NOT NULL,
  variant_name VARCHAR(255),
  price DECIMAL(12,2) NOT NULL,
  stock_quantity INT DEFAULT 0,
  is_active TINYINT(1) DEFAULT 1,
  is_default TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);




MAPPING:

6/ attributes_categories (Attribute → Category mapping)
Thêm: is_variant_attribute (thuộc tính này có tạo biến thể trong danh mục đó không)

CREATE TABLE attribute_categories (
  attribute_category_id INT AUTO_INCREMENT PRIMARY KEY,
  attribute_id INT NOT NULL,
  category_id INT NOT NULL,
  is_variant_attribute TINYINT(1) DEFAULT 0,
  FOREIGN KEY (attribute_id) REFERENCES attributes(attribute_id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE
);

Ví dụ:
Mainboard – Socket (variant)
Mainboard – Chipset (not variant)

7/🔥 NEW TABLE (bắt buộc): categories_attributes_values
Mapping 3 chiều: Categorires → Attributes → Attribute Values
CREATE TABLE categories_attributes_values (
  cav_id INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT NOT NULL,
  attribute_id INT NOT NULL,
  attribute_value_id INT NOT NULL,
  FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE,
  FOREIGN KEY (attribute_id) REFERENCES attributes(attribute_id) ON DELETE CASCADE,
  FOREIGN KEY (attribute_value_id) REFERENCES attribute_values(attribute_value_id)
    ON DELETE CASCADE
);

Đây chính là bảng giúp biết:
Category	Attribute	Value
RAM	Hãng	Corsair
RAM	Dung lượng	16GB
Không có bảng này → Không lọc được kiểu Hacom.


⭐ NEW: G. product_attribute_values
→ Lưu attribute-value không sinh variant của sản phẩm.
CREATE TABLE product_attribute_values (
  product_id INT NOT NULL,
  attribute_value_id INT NOT NULL,
  PRIMARY KEY (product_id, attribute_value_id),
  FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
  FOREIGN KEY (attribute_value_id) REFERENCES attribute_values(attribute_value_id)
    ON DELETE CASCADE
);


Ví dụ:
CPU i3 → 6 nhân, 12 luồng, 4.5GHz → Đây là thuộc tính mô tả, không sinh variant.

⭐ 

⭐ UPDATED: I. variant_attribute_values

→ Lưu những attribute-value sinh variant.
CREATE TABLE variant_attribute_values (
  variant_id INT NOT NULL,
  attribute_value_id INT NOT NULL,
  PRIMARY KEY (variant_id, attribute_value_id),
  FOREIGN KEY (variant_id) REFERENCES product_variants(variant_id) ON DELETE CASCADE,
  FOREIGN KEY (attribute_value_id) REFERENCES attribute_values(attribute_value_id) ON DELETE CASCADE
);






🎯 KẾT LUẬN:

Dưới đây là cấu trúc chuẩn nhất:

1. attributes
2. attribute_values
3. categories 
4. products
5. product_variants
 
 
6. attributes_categories (attribute thuộc danh mục nào?)
7. categories_attributes_values 
8. product_attribute_values (thuộc tính mô tả, không tạo biến thể)
9. variant_attribute_values (thuộc tính tạo biến thể)

BẢNG MỚI LÀ xương sống: attribute_category_values
Nếu không có bảng này → KHÔNG thể:
Lọc chính xác theo từng danh mục như Hacom
Chỉ hiển thị giá trị phù hợp khi tạo sản phẩm
Tránh rối loạn value không phù hợp danh mục