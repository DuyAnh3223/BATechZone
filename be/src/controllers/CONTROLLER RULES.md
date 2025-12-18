Nhiệm vụ:
Nhận request
Gọi DTO
Gọi Service
Trả response
req → DTO → Service → res

❌ Không được
Query DB
Business logic
Loop phức tạp


Controller – 4 luật
Không có SQL
Không có vòng lặp phức tạp
Không try-catch lồng nhau
Trả DTO response