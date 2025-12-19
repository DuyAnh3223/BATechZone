# Auto-Generate Serial Numbers for Product Variants

## Tổng quan

Hệ thống tự động tạo số serial (serial numbers) cho mỗi product variant khi:
1. Tạo mới variant với stock quantity > 0
2. Cập nhật variant với stock quantity tăng lên

## Format Serial Number

```
SN{VariantID}{YYYY}{SequentialNumber}
```

Trong đó:
- **SN**: Prefix cố định
- **VariantID**: ID của product variant
- **YYYY**: Năm hiện tại (4 chữ số)
- **SequentialNumber**: Số thứ tự (4 chữ số, bắt đầu từ 0001)

### Ví dụ:
- Variant ID = 123, năm 2025, serial thứ nhất: `SN123202500001`
- Variant ID = 123, năm 2025, serial thứ hai: `SN123202500002`
- Variant ID = 456, năm 2025, serial đầu tiên: `SN456202500001`

## Luồng hoạt động

### 1. Khi tạo mới variant

```javascript
POST /api/variants
{
  "productId": 10,
  "sku": "LAPTOP-001-BLACK",
  "variantName": "Laptop Dell XPS 13 - Màu Đen",
  "price": 25000000,
  "stockQuantity": 10,  // Tạo 10 serials
  "isActive": true,
  "isDefault": false
}
```

**Kết quả:**
- Tạo variant thành công
- Tự động tạo 10 serial numbers với status = `in_stock`
- Serial numbers: `SN{variantId}20250001` đến `SN{variantId}20250010`

### 2. Khi cập nhật stock tăng lên

```javascript
PUT /api/variants/{variantId}
{
  "stock": 15  // Tăng từ 10 lên 15
}
```

**Kết quả:**
- Cập nhật stock thành công
- Tự động tạo thêm 5 serial numbers (15 - 10 = 5)
- Serial numbers mới: `SN{variantId}20250011` đến `SN{variantId}20250015`

### 3. Khi giảm stock

```javascript
PUT /api/variants/{variantId}
{
  "stock": 8  // Giảm từ 15 xuống 8
}
```

**Kết quả:**
- Cập nhật stock thành công
- **KHÔNG** xóa serial tự động (cần quản lý thủ công)

## Trạng thái Serial (Status)

| Status | Mô tả | Có thể chuyển sang |
|--------|-------|---------------------|
| `in_stock` | Serial mới tạo, chưa được đặt hàng | `reserved` |
| `reserved` | Serial đã được đặt trước cho đơn hàng | `sold`, `in_stock` (nếu hủy) |
| `sold` | Serial đã được bán | `rma_in` |
| `rma_in` | Serial đang trong quá trình bảo hành | `rma_done`, `scrapped` |
| `rma_done` | Serial đã hoàn tất bảo hành | - |
| `scrapped` | Serial đã thanh lý | - |

## API Endpoints liên quan

### Quản lý Serial

```javascript
// Lấy danh sách serial của variant
GET /api/variant-serials?variant_id={variantId}&status=in_stock

// Xem chi tiết serial
GET /api/variant-serials/{serialId}

// Tìm serial theo số
GET /api/variant-serials/number/{serialNumber}

// Tạo serial thủ công (nếu cần)
POST /api/variant-serials
{
  "variant_id": 123,
  "serial_number": "CUSTOM-SERIAL-001",
  "status": "in_stock"
}

// Tạo nhiều serial thủ công
POST /api/variant-serials/bulk
{
  "variant_id": 123,
  "serial_numbers": ["SN1", "SN2", "SN3"]
}

// Lấy thống kê tồn kho theo serial
GET /api/variant-serials/inventory/{variantId}
```

### Quản lý Đặt hàng với Serial

```javascript
// Đặt trước serial cho đơn hàng
POST /api/variant-serials/reserve
{
  "variant_id": 123,
  "order_item_id": 456,
  "quantity": 2
}

// Xác nhận bán (reserved -> sold)
POST /api/variant-serials/confirm-sale/{orderItemId}

// Hủy đặt trước (reserved -> in_stock)
POST /api/variant-serials/cancel-reservation/{orderItemId}
```

### Quản lý Bảo hành (RMA)

```javascript
// Tiếp nhận bảo hành (sold -> rma_in)
POST /api/variant-serials/rma
{
  "serial_number": "SN123202500001",
  "warranty_id": 789
}

// Hoàn tất bảo hành (rma_in -> rma_done)
POST /api/variant-serials/rma/complete
{
  "serial_number": "SN123202500001"
}

// Thanh lý serial
POST /api/variant-serials/{serialId}/scrap
```

## Database Schema

### Table: variant_serials

```sql
CREATE TABLE variant_serials (
  serial_id INT PRIMARY KEY AUTO_INCREMENT,
  variant_id INT NOT NULL,
  serial_number VARCHAR(64) UNIQUE NOT NULL,
  status ENUM('in_stock', 'reserved', 'sold', 'rma_in', 'rma_done', 'scrapped') DEFAULT 'in_stock',
  order_item_id INT NULL,
  warranty_id INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (variant_id) REFERENCES product_variants(variant_id),
  FOREIGN KEY (order_item_id) REFERENCES order_items(order_item_id),
  INDEX idx_variant_status (variant_id, status),
  INDEX idx_serial_number (serial_number)
);
```

## Code Implementation

### Service Layer

File: `be/src/services/variantSerial.service.js`

```javascript
/**
 * Auto-generate serials for a variant based on quantity
 */
async autoGenerateSerials(variantId, quantity) {
  // Get existing serials count to determine starting sequence
  const existingSerials = await VariantSerialDAO.findByVariantId(variantId);
  const startingSequence = existingSerials.length + 1;

  // Generate serial numbers
  const serialNumbers = [];
  for (let i = 0; i < quantity; i++) {
    const serialNumber = this.generateSerialNumber(variantId, 'SN', startingSequence + i);
    serialNumbers.push(serialNumber);
  }

  // Bulk create serials
  const serials = serialNumbers.map(sn => ({
    variant_id: variantId,
    serial_number: sn,
    status: 'in_stock'
  }));

  await VariantSerialDAO.bulkInsert(serials);

  return {
    success: true,
    message: `Đã tạo ${quantity} serial tự động`,
    data: {
      variant_id: variantId,
      quantity: quantity,
      serial_numbers: serialNumbers
    }
  };
}
```

### Controller Layer

File: `be/src/controllers/variantController.js`

```javascript
// Trong createVariant
if (req.body.stockQuantity && req.body.stockQuantity > 0) {
  await VariantSerialService.autoGenerateSerials(variantId, req.body.stockQuantity);
}

// Trong updateVariant
const oldStock = currentVariant.stock_quantity || 0;
const newStock = updateData.stockQuantity;
const stockIncrease = newStock - oldStock;

if (stockIncrease > 0) {
  await VariantSerialService.autoGenerateSerials(variantId, stockIncrease);
}
```

## Lưu ý quan trọng

### 1. Quản lý tồn kho
- Stock quantity trong `product_variants` table là số lượng vật lý
- Số serial trong `variant_serials` với status `in_stock` phải khớp với stock quantity
- Khi bán hàng, serial chuyển từ `in_stock` -> `reserved` -> `sold`

### 2. Sequential Number
- Sequential number được tính dựa trên tổng số serial **đã tạo** của variant đó
- Không reset khi năm mới, số thứ tự tiếp tục tăng dần
- Ví dụ: Năm 2025 tạo đến serial 0100, năm 2026 serial mới là 0101 (không reset về 0001)

### 3. Error Handling
- Nếu tạo serial thất bại, variant vẫn được tạo/cập nhật thành công
- Log error để admin xử lý thủ công sau
- Có thể tạo serial thủ công qua API nếu cần

### 4. Performance
- Sử dụng bulk insert để tối ưu khi tạo nhiều serial
- Index trên `variant_id` và `status` để query nhanh
- Index trên `serial_number` để tìm kiếm nhanh

### 5. Tích hợp với Order
- Khi tạo đơn hàng, cần reserve serial (chuyển status từ `in_stock` -> `reserved`)
- Khi thanh toán thành công, confirm sale (chuyển `reserved` -> `sold`)
- Khi hủy đơn, release serial (chuyển `reserved` -> `in_stock`)

## Testing

### Test Case 1: Tạo variant mới với stock
```bash
POST /api/variants
{
  "productId": 1,
  "stockQuantity": 5
}

# Expected: Tạo 5 serial với format SN{variantId}2025XXXX
```

### Test Case 2: Tăng stock
```bash
PUT /api/variants/123
{
  "stock": 10  # Tăng từ 5 lên 10
}

# Expected: Tạo thêm 5 serial mới
```

### Test Case 3: Query serials
```bash
GET /api/variant-serials?variant_id=123&status=in_stock

# Expected: Trả về danh sách serial với status in_stock
```

### Test Case 4: Reserve serial
```bash
POST /api/variant-serials/reserve
{
  "variant_id": 123,
  "order_item_id": 456,
  "quantity": 2
}

# Expected: 2 serial oldest chuyển sang reserved
```

## Migration (nếu cần)

Nếu đã có variant với stock nhưng chưa có serial, chạy migration:

```javascript
// migration script
import Variant from './models/Variant.js';
import VariantSerialService from './services/variantSerial.service.js';

async function migrateExistingVariants() {
  const variants = await Variant.list({ limit: 1000 });
  
  for (const variant of variants.data) {
    if (variant.stock_quantity > 0) {
      try {
        await VariantSerialService.autoGenerateSerials(
          variant.variant_id, 
          variant.stock_quantity
        );
        console.log(`Generated serials for variant ${variant.variant_id}`);
      } catch (error) {
        console.error(`Failed for variant ${variant.variant_id}:`, error);
      }
    }
  }
}
```

## Roadmap

### Phase 1: ✅ Completed
- Auto-generate serial khi tạo/cập nhật variant
- CRUD operations cho serial
- Reserve/Confirm/Cancel serial cho order

### Phase 2: Đang phát triển
- Tích hợp với order flow (auto-reserve khi tạo order)
- RMA (Return Merchandise Authorization) workflow
- Warranty tracking

### Phase 3: Tương lai
- Barcode/QR code generation cho serial
- Serial history tracking
- Analytics và reporting
