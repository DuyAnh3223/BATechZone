Nhiệm vụ:
1️⃣ Validate input
2️⃣ Normalize input
3️⃣ Filter field
4️⃣ Default & coercion
interest_rate ??= 0;
num_terms = Number(num_terms);
5️⃣ Boundary protection (chặn vượt ranh giới)
Không cho client gửi:
status
created_at
user_id (nếu lấy từ token)
6️⃣ Contract giữa FE ↔ BE
DTO chính là API contract
👉 FE chỉ được dùng field DTO cho phép
👉 Thay DB không ảnh hưởng FE


❌ DTO KHÔNG ĐƯỢC:
Query DB
Tính toán nghiệp vụ
Gọi API
Chứa logic if/else phức tạp


DTO – 5 luật
1 API → 1 DTO
Không dùng lại DTO sai mục đích
Không chứa field DB private
Fail fast
Chỉ xử lý data shape