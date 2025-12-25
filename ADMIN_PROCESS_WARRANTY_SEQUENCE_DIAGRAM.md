# Sơ đồ tuần tự: Xử lý yêu cầu bảo hành (Admin)

Sơ đồ này mô tả quy trình Admin xử lý một yêu cầu bảo hành, bao gồm hai hành động chính:
1.  **Kiểm tra & Ra quyết định (Inspection)**: Admin kiểm tra sản phẩm và quyết định Chấp nhận hoặc Từ chối bảo hành.
2.  **Cập nhật trạng thái (Update Status)**: Admin cập nhật tiến độ xử lý (VD: Đang sửa, Hoàn thành).

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'loopBorder': '#000000'}}}%%
sequenceDiagram
    title: Xử lý yêu cầu bảo hành (Admin)
    actor Admin as Quản trị viên
    participant UI as Giao diện Quản lý bảo hành
    participant Controller as ServiceRequestController
    participant Service as ServiceRequestService
    participant DTO as ServiceRequestDTO
    participant DAO as ServiceRequestDAO
    participant DB as Database

    note over Admin, UI: Admin đang xem chi tiết yêu cầu bảo hành

    alt Hành động 1: Kiểm tra & Ra quyết định (Inspection)
        Admin->>UI: 1. Nhập kết quả kiểm tra & Quyết định (Chấp nhận/Từ chối)
        Admin->>UI: 2. Nhấn "Hoàn tất kiểm tra"
        
        activate UI
        UI->>Controller: 3. POST /api/admin/warranty/requests/:id/inspect
        activate Controller
        
        Controller->>Service: 4. inspectRequest(requestId, inspectionData)
        activate Service
        
        Service->>DAO: 5. findById(requestId)
        activate DAO
        DAO->>DB: SELECT * FROM service_requests ...
        activate DB
        DB-->>DAO: Thông tin Request
        deactivate DB
        DAO-->>Service: Thông tin Request
        deactivate DAO
        
        alt Request không tồn tại
            Service-->>Controller: Lỗi "Yêu cầu không tồn tại"
            Controller-->>UI: Trả về lỗi 404
            UI-->>Admin: Hiển thị lỗi
        else Request tồn tại
            note right of Service: Xác định trạng thái mới:<br/>- Accept -> warranty_accepted<br/>- Reject -> warranty_rejected
            
            Service->>DAO: 6. addInspection(requestId, data)
            activate DAO
            note right of DAO: Cập nhật status, rejection_reason<br/>và thêm vào progress_notes
            DAO->>DB: UPDATE service_requests SET ...
            activate DB
            DB-->>DAO: Kết quả update
            deactivate DB
            DAO-->>Service: Thành công
            deactivate DAO
            
            Service-->>Controller: Thông báo thành công
            
            Controller-->>UI: Trả về thành công (200 OK)
            deactivate Controller
            
            UI-->>Admin: Hiển thị thông báo & Cập nhật trạng thái trên UI
        end
        deactivate Service
        deactivate UI

    else Hành động 2: Cập nhật trạng thái thủ công (Update Status)
        Admin->>UI: 1. Chọn trạng thái mới (VD: Đang sửa, Hoàn thành) & Nhập ghi chú
        Admin->>UI: 2. Nhấn "Cập nhật"
        
        activate UI
        UI->>Controller: 3. PATCH /api/admin/warranty/requests/:id/status
        activate Controller
        
        Controller->>Service: 4. updateStatus(requestId, statusData)
        activate Service
        
        Service->>DAO: 5. findById(requestId)
        activate DAO
        DAO->>DB: SELECT * FROM service_requests ...
        activate DB
        DB-->>DAO: Thông tin Request
        deactivate DB
        DAO-->>Service: Thông tin Request
        deactivate DAO
        
        Service->>Service: 6. Validate chuyển đổi trạng thái
        note right of Service: Kiểm tra logic chuyển trạng thái<br/>(VD: Không thể chuyển từ 'Pending' -> 'Completed')
        
        alt Chuyển đổi không hợp lệ
            Service-->>Controller: Lỗi "Trạng thái không hợp lệ"
            Controller-->>UI: Trả về lỗi 400
            UI-->>Admin: Hiển thị lỗi logic
        else Chuyển đổi hợp lệ
            Service->>DAO: 7. update(requestId, updates)
            activate DAO
            note right of DAO: Cập nhật status, resolved_at (nếu xong),<br/>thêm progress_notes
            DAO->>DB: UPDATE service_requests SET ...
            activate DB
            DB-->>DAO: Kết quả update
            deactivate DB
            DAO-->>Service: Thành công
            deactivate DAO
            
            Service->>DAO: 8. findById(requestId)
            activate DAO
            DAO->>DB: SELECT * FROM service_requests ...
            activate DB
            DB-->>DAO: Thông tin Request (Mới)
            deactivate DB
            DAO-->>Service: Thông tin Request (Mới)
            deactivate DAO
            
            Service->>DTO: 9. toServiceRequestDTO(request)
            activate DTO
            DTO-->>Service: Request DTO
            deactivate DTO
            
            Service-->>Controller: Dữ liệu Request đã cập nhật (DTO)
            deactivate Service
            
            Controller-->>UI: Trả về dữ liệu mới (200 OK)
            deactivate Controller
            
            UI-->>Admin: Hiển thị thông báo & Cập nhật UI
        end
        deactivate UI
    end
```
