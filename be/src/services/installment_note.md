        Phân quyền quản lý trả góp
Admin:
Quản lý và cấu hình các gói trả góp: kỳ hạn, lãi suất, điều kiện trả trước,...
Xem toàn bộ các hợp đồng trả góp, trạng thái thanh toán từng kỳ.
Quản lý phê duyệt hoặc từ chối các đơn trả góp của user (có thể thêm cột approval_status cho bảng installment).
Quản lý/cảnh báo các trường hợp trả chậm, quá hạn, hoặc xử lý nợ xấu.
Xem, xuất báo cáo danh sách các đơn trả góp, các giao dịch liên quan.

User:
Xem chi tiết hợp đồng trả góp, lịch sử thanh toán, kỳ hạn, số tiền còn lại, lãi suất.
Thực hiện thanh toán từng kỳ (có thể kết nối với cổng thanh toán hoặc quản lý trạng thái thanh toán).
Nhận thông báo về các kỳ thanh toán sắp tới, trả chậm, hoặc các cảnh báo khác.
Hủy/đề nghị thay đổi hợp đồng trả góp nếu hợp lệ.

        Quy trình nghiệp vụ trả góp (mô tả tổng quan)
User chọn trả góp khi đặt hàng → Tạo đơn hàng, cấp phát hợp đồng trả góp (installments).
Admin phê duyệt hợp đồng trả góp → Nếu OK thì khởi tạo các kỳ thanh toán (installment_payments).
User thanh toán theo kỳ hạn → Mỗi lần trả tiền sẽ cập nhật trạng thái từng dòng thanh toán.
Admin theo dõi trạng thái hợp đồng/trả góp, xử lý khi quá hạn.

         Tích hợp với CSDL hiện tại
Liên kết installment với orders để biết đơn hàng nào trả góp.
Cập nhật trạng thái thanh toán (status, số tiền đã trả, số tiền còn lại) vào bảng trả góp mới.
Kết hợp bảng payments nếu cần để quản lý các hình thức thanh toán (có thể thêm payment_method='installment' vào đó).


         Gợi ý thêm trong giao diện quản trị/Admin/User

Admin Panel:
Danh sách các hợp đồng trả góp & filter theo trạng thái, user, đơn hàng.
Báo cáo tổng nợ, số tiền đã nhận, quá hạn.
Quản lý chính sách/gói trả góp.

User Panel:
Xem chi tiết hợp đồng trả góp của mình, lịch sử thanh toán, nhắc nhở.
Thực hiện thanh toán, in biên lai cho từng kỳ.

1. createInstallment(installmentData)
Tạo khoản trả góp mới
Tự động tính toán: monthly_payment, end_date
Hỗ trợ tính lãi suất hoặc không lãi
Tự động tạo các kỳ thanh toán (installment_payments)
2. getInstallmentById(installmentId)
Lấy chi tiết 1 khoản trả góp
Kèm theo danh sách các kỳ thanh toán
3. getInstallmentsByUserId(userId)
Lấy tất cả khoản trả góp của user
Mỗi installment có kèm payments
4. makePayment(paymentId, paymentData)
Thanh toán 1 kỳ
Tự động cập nhật trạng thái installment (pending → active → completed)
5. checkOverduePayments(installmentId)
Kiểm tra và đánh dấu các kỳ quá hạn
Tự động cập nhật status thành 'overdue'
6. cancelInstallment(installmentId)
Hủy khoản trả góp (không thể hủy nếu đã hoàn thành)
7. getPaymentSummary(installmentId)
Tính toán tổng hợp: đã trả, còn lại, % hoàn thành
Thống kê số kỳ: đã trả/chưa trả/quá hạn
Trả về kỳ thanh toán tiếp theo
8. updateInstallment(installmentId, updateData)
Cập nhật thông tin installment
9. deleteInstallment(installmentId)
Xóa installment (chỉ nếu chưa có payment nào được thanh toán)
Tự động xóa tất cả payments liên quan
10. Sửa lỗi InstallmentPayment.js
Xóa dòng duplicate: this.due_date = data.num_terms;
Xóa field không cần thiết: this.start_date
Tính năng đặc biệt:
✅ Tự động tính lãi suất: Hỗ trợ cả có lãi và không lãi
✅ Tự động tạo schedule: Tạo đầy đủ các kỳ thanh toán
✅ Quản lý trạng thái: pending → active → completed / cancelled
✅ Phát hiện quá hạn: Tự động đánh dấu overdue
✅ Tổng hợp thống kê: Tính toán chi tiết về tiến độ thanh toán