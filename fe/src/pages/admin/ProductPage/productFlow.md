ProductPage
 ├── ProductList
 │     └── ProductItem
 ├── ProductForm.jsx 
 │     ├── CategorySelector (inner component => tạo luôn trong page ProductForm.jsx)
 │     ├── AttributeSelector
 │     ├── AttributeValueSelector
 │     └── VariantGenerator
 ├── VariantList
 │     └── VariantItem
 └── VariantForm


1️⃣ ProductPage

Trang tổng quản lý sản phẩm

Load danh sách sản phẩm từ store / API

Hiển thị ProductList

Hiển thị ProductForm khi tạo / chỉnh sửa

Hiển thị VariantList khi quản lý biến thể của 1 sản phẩm

2️⃣ ProductList

Hiển thị danh sách sản phẩm

Sử dụng ProductItem cho từng dòng

Có nút:

Edit → mở ProductForm

Manage Variants → mở VariantList

3️⃣ ProductItem

Hiển thị thông tin 1 sản phẩm:

Tên, danh mục, giá base

Nút sửa/xóa, quản lý biến thể

4️⃣ ProductForm

Form tạo / chỉnh sửa sản phẩm, gồm các chức năng:

4.1 CategorySelector

Dropdown chọn danh mục

Khi chọn → load thuộc tính (attributes) của danh mục

4.2 AttributeSelector

Checkbox chọn attribute nào dùng để tạo biến thể

Ví dụ: Hãng, Dòng CPU, Socket

Không tất cả attribute đều dùng để sinh biến thể

4.3 AttributeValueSelector

Checkbox / multi-select các giá trị của từng attribute

Ví dụ: Intel, AMD; Core i5, Core i7…

Người dùng chọn các giá trị này để sinh biến thể

4.4 VariantGenerator

Sinh tất cả tổ hợp (Cartesian product) từ các giá trị được chọn

Tạo state tạm variants chứa:

SKU

Price

Stock

Mapped attribute_values

Người dùng có thể chỉnh giá, tồn kho, SKU

Khi submit → tạo product + variants + variant_attributes

5️⃣ VariantList

Hiển thị danh sách biến thể của 1 sản phẩm

Sử dụng VariantItem cho từng variant

Cho phép edit hoặc xóa biến thể

6️⃣ VariantItem

1 dòng biến thể:

Hiển thị tổ hợp giá trị thuộc tính (Intel / i5 / LGA1700) theo danh mục của sản phẩm

Giá, tồn kho, SKU

Nút edit / delete

7️⃣ VariantForm

Form chỉnh sửa 1 biến thể:

Giá, tồn kho, SKU, trạng thái

Không hiển thị attribute selector nữa (tổ hợp đã fix)

Có thể dùng modal hoặc drawer

📌 TÓM TẮT FLOW NGHIỆP VỤ

Chọn danh mục → load attributes

Chọn attribute cần sinh variant → AttributeSelector

Chọn giá trị → AttributeValueSelector

Generate variants → VariantGenerator → lưu tạm state variants

Submit ProductForm → tạo product + variants + variant_attributes

Quản lý biến thể → VariantList + VariantForm