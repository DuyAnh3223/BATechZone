# Hướng Dẫn Cài Đặt Dự Án BATechZone

## Mục Lục
- [Yêu Cầu Hệ Thống](#yêu-cầu-hệ-thống)
- [Cài Đặt Môi Trường](#cài-đặt-môi-trường)
- [Cấu Hình Database](#cấu-hình-database)
- [Cấu Hình Backend](#cấu-hình-backend)
- [Cấu Hình Frontend](#cấu-hình-frontend)
- [Cấu Hình Thanh Toán](#cấu-hình-thanh-toán)
- [Chạy Ứng Dụng](#chạy-ứng-dụng)
- [Xử Lý Sự Cố](#xử-lý-sự-cố)

---

## Yêu Cầu Hệ Thống

### Phần Mềm Cần Thiết
- **Node.js**: Phiên bản 18.x hoặc cao hơn
- **npm**: Phiên bản 9.x hoặc cao hơn (đi kèm với Node.js)
- **MySQL**: Phiên bản 8.0 hoặc cao hơn
- **Git**: Để clone repository

### Kiểm Tra Phiên Bản
```bash
node --version
npm --version
mysql --version
```

---

## Cài Đặt Môi Trường

### 1. Clone Repository
```bash
git clone <repository-url>
cd BATechZone
```

### 2. Cài Đặt Dependencies

#### Root Dependencies
```bash
npm install
```

#### Backend Dependencies
```bash
cd be
npm install
```

#### Frontend Dependencies
```bash
cd ../fe
npm install
```

---

## Cấu Hình Database

### 1. Tạo Database
Mở MySQL Workbench hoặc MySQL CLI và chạy:
```sql
CREATE DATABASE batechzone CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Import Schema
Chạy các migration files theo thứ tự:

```bash
cd be/migrations

# Import schema chính
mysql -u root -p batechzone < schema.sql

# Import các migration theo thứ tự
mysql -u root -p batechzone < "batechzone (45).sql"
mysql -u root -p batechzone < "batechzone (46).sql"
mysql -u root -p batechzone < "batechzone (47).sql"
mysql -u root -p batechzone < "batechzone (48).sql"
mysql -u root -p batechzone < "batechzone (50).sql"
mysql -u root -p batechzone < "batechzone (51).sql"
```

### 3. Cập Nhật Bảng Payments (Nếu Cần)
```bash
# Cập nhật cho VNPay
mysql -u root -p batechzone < update_payments_for_vnpay.sql

# Cập nhật cho MoMo
mysql -u root -p batechzone < update_payments_for_momo.sql

# Cập nhật paid_date
mysql -u root -p batechzone < update_paid_date_to_datetime.sql
```

---

## Cấu Hình Backend

### 1. Tạo File Environment
Tạo file `.env` trong thư mục `be/`:
```bash
cd be
touch .env  # Trên Windows: type nul > .env
```

### 2. Cấu Hình Biến Môi Trường
Thêm nội dung sau vào file `be/.env`:

```env
# Server Configuration
PORT=5001
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=batechzone
DB_PORT=3306

# Client URL
CLIENT_URL=http://localhost:5173

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_refresh_token_secret_key
JWT_REFRESH_EXPIRES_IN=30d

# GHN (Giao Hàng Nhanh) Configuration
GHN_API_URL=https://dev-online-gateway.ghn.vn/shiip/public-api
GHN_TOKEN=your_ghn_token
GHN_SHOP_ID=your_shop_id

# PayOS Configuration
PAYOS_CLIENT_ID=your_payos_client_id
PAYOS_API_KEY=your_payos_api_key
PAYOS_CHECKSUM_KEY=your_payos_checksum_key

# MoMo Configuration
MOMO_PARTNER_CODE=your_momo_partner_code
MOMO_ACCESS_KEY=your_momo_access_key
MOMO_SECRET_KEY=your_momo_secret_key
MOMO_REDIRECT_URL=http://localhost:5173/payment-result
MOMO_IPN_URL=http://localhost:5001/api/payment/momo/callback

# VNPay Configuration
VNPAY_TMN_CODE=your_vnpay_tmn_code
VNPAY_HASH_SECRET=your_vnpay_hash_secret
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_RETURN_URL=http://localhost:5173/payment-result
```

### 3. Tạo Thư Mục Uploads
```bash
# Trong thư mục be/
mkdir -p uploads/products
mkdir -p uploads/variants
mkdir -p uploads/categories
mkdir -p uploads/banners
mkdir -p uploads/articles
mkdir -p uploads/posts
mkdir -p uploads/warranty
mkdir -p uploads/temp
mkdir -p uploads/banner_header_top_left_right
```

---

## Cấu Hình Frontend

### 1. Tạo File Environment
Tạo file `.env` trong thư mục `fe/`:
```bash
cd fe
touch .env  # Trên Windows: type nul > .env
```

### 2. Cấu Hình Biến Môi Trường
Thêm nội dung sau vào file `fe/.env`:

```env
# API Configuration
VITE_API_URL=http://localhost:5001/api
VITE_BASE_URL=http://localhost:5001

# Upload Configuration
VITE_UPLOAD_URL=http://localhost:5001/uploads
```

---

## Cấu Hình Thanh Toán

### 1. VNPay (Sandbox)
1. Đăng ký tài khoản sandbox tại: https://sandbox.vnpayment.vn
2. Lấy `TMN_CODE` và `HASH_SECRET`
3. Cập nhật vào file `be/.env`

Thông tin test (từ file `vnpay_nodejs/thongtintest.txt`):
- URL: https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
- TMN Code: Lấy từ tài khoản sandbox
- Secret Key: Lấy từ tài khoản sandbox

### 2. MoMo (Sandbox)
1. Đăng ký tài khoản developer tại: https://developers.momo.vn
2. Tạo ứng dụng và lấy credentials
3. Cập nhật vào file `be/.env`

Thông tin test (từ file `momo/atm.txt`):
- Partner Code: Lấy từ MoMo Developer
- Access Key: Lấy từ MoMo Developer
- Secret Key: Lấy từ MoMo Developer

### 3. PayOS
1. Đăng ký tại: https://payos.vn
2. Lấy API credentials
3. Cập nhật vào file `be/.env`

---

## Chạy Ứng Dụng

### Chế Độ Development

#### 1. Chạy Backend
```bash
cd be
npm run dev
```
Backend sẽ chạy tại: `http://localhost:5001`

#### 2. Chạy Frontend (Terminal mới)
```bash
cd fe
npm run dev
```
Frontend sẽ chạy tại: `http://localhost:5173`

### Chế Độ Production

#### 1. Build Frontend
```bash
cd fe
npm run build
```

#### 2. Chạy Backend Production
```bash
cd be
npm start
```

---

## Cấu Trúc Thư Mục

```
BATechZone/
├── be/                          # Backend
│   ├── src/
│   │   ├── server.js           # Entry point
│   │   ├── config/             # Cấu hình
│   │   ├── controllers/        # Controllers
│   │   ├── daos/              # Data Access Objects
│   │   ├── dtos/              # Data Transfer Objects
│   │   ├── libs/              # Libraries (db, etc.)
│   │   ├── middlewares/       # Middlewares
│   │   ├── models/            # Models
│   │   ├── routes/            # Routes
│   │   ├── services/          # Business logic
│   │   └── utils/             # Utilities
│   ├── migrations/            # Database migrations
│   ├── uploads/               # File uploads
│   ├── test-data/             # Test data
│   └── package.json
│
├── fe/                          # Frontend
│   ├── src/
│   │   ├── App.jsx            # Main App component
│   │   ├── main.jsx           # Entry point
│   │   ├── components/        # React components
│   │   ├── pages/             # Pages
│   │   ├── routes/            # Routing
│   │   ├── services/          # API services
│   │   ├── stores/            # State management (Zustand)
│   │   ├── hooks/             # Custom hooks
│   │   ├── utils/             # Utilities
│   │   └── constants/         # Constants
│   ├── public/                # Static files
│   └── package.json
│
├── docs/                        # Documentation
├── momo/                        # MoMo payment integration
└── vnpay_nodejs/               # VNPay payment integration
```

---

## Kiểm Tra Cài Đặt

### 1. Kiểm Tra Backend
Mở browser và truy cập: `http://localhost:5001/api/test`

Kết quả mong đợi:
```json
{
  "message": "API is working",
  "timestamp": "2026-01-19T..."
}
```

### 2. Kiểm Tra Database Connection
Backend console sẽ hiển thị:
```
Connected to the database
Server running on http://localhost:5001
```

### 3. Kiểm Tra Frontend
Truy cập: `http://localhost:5173`
Trang chủ sẽ hiển thị giao diện BATechZone

---

## Xử Lý Sự Cố

### Lỗi Database Connection

**Lỗi**: `Error connecting to the database: ER_ACCESS_DENIED_ERROR`

**Giải pháp**:
1. Kiểm tra username/password MySQL trong `be/.env`
2. Kiểm tra MySQL service đang chạy:
   ```bash
   # Windows
   net start MySQL80
   
   # Kiểm tra status
   mysqladmin -u root -p status
   ```

### Lỗi Port Đã Được Sử Dụng

**Lỗi**: `EADDRINUSE: address already in use :::5001`

**Giải pháp**:
```bash
# Windows - Tìm và kill process
netstat -ano | findstr :5001
taskkill /PID <PID> /F

# Hoặc đổi port trong be/.env
PORT=5002
```

### Lỗi Cannot Find Module

**Lỗi**: `Cannot find module 'xyz'`

**Giải pháp**:
```bash
# Xóa node_modules và cài lại
rm -rf node_modules package-lock.json
npm install
```

### Lỗi CORS

**Lỗi**: `Access to XMLHttpRequest blocked by CORS policy`

**Giải pháp**:
- Kiểm tra `CLIENT_URL` trong `be/.env` khớp với URL frontend
- Kiểm tra CORS configuration trong `be/src/server.js`

### Lỗi File Upload

**Lỗi**: `ENOENT: no such file or directory, open 'uploads/...'`

**Giải pháp**:
```bash
# Tạo tất cả thư mục uploads cần thiết
cd be
mkdir -p uploads/{products,variants,categories,banners,articles,posts,warranty,temp,banner_header_top_left_right}
```

### Lỗi JWT

**Lỗi**: `JsonWebTokenError: jwt must be provided`

**Giải pháp**:
1. Kiểm tra `JWT_SECRET` trong `be/.env`
2. Clear cookies/localStorage trong browser
3. Login lại

### Lỗi Payment Gateway

**Lỗi**: Payment redirect không hoạt động

**Giải pháp**:
1. Kiểm tra credentials trong `be/.env`
2. Kiểm tra callback URLs đã cấu hình đúng
3. Kiểm tra môi trường test/production

---

## Tài Khoản Test

### Admin
```
Email: admin@batechzone.com
Password: admin123
```

### User
```
Email: user@test.com
Password: user123
```

*(Tạo tài khoản này sau khi setup hoàn tất)*

---

## Các Lệnh Hữu Ích

### Backend
```bash
# Development với auto-reload
npm run dev

# Production
npm start

# Test connection
node -e "require('./src/libs/db.js').testConnection()"
```

### Frontend
```bash
# Development server
npm run dev

# Build production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Database
```bash
# Backup database
mysqldump -u root -p batechzone > backup.sql

# Restore database
mysql -u root -p batechzone < backup.sql

# Connect to MySQL
mysql -u root -p batechzone
```

---

## Tài Liệu Tham Khảo

### API Documentation
- Chi tiết API có trong thư mục `be/` với các file `.md`
- Test API với Postman: xem `be/test-data/POSTMAN_TEST_GUIDE.md`

### Frontend Documentation
- Component documentation: `fe/README.md`
- JWT Implementation: `fe/JWT_FRONTEND_IMPLEMENTATION.md`
- Warranty Profile: `fe/PROFILE_WARRANTY_README.md`

### Backend Documentation
- JWT Implementation: `be/JWT_IMPLEMENTATION.md`
- Compatibility Service: `be/COMPATIBILITY_SERVICE_README.md`
- Warranty API: `be/ADMIN_WARRANTY_API.md`

### System Documentation
- Use Cases: `docs/SYSTEM_USE_CASES.md`
- Activity Diagrams: `docs/system-activity-diagram.md`
- Sequence Diagrams: `docs/system-sequence-diagram.md`

---

## Liên Hệ & Hỗ Trợ

Nếu gặp vấn đề trong quá trình cài đặt, vui lòng:
1. Kiểm tra lại các bước cấu hình
2. Xem phần "Xử Lý Sự Cố"
3. Kiểm tra logs trong console
4. Liên hệ team development

---

## Cập Nhật

### Cập Nhật Code Mới Nhất
```bash
git pull origin main
cd be && npm install
cd ../fe && npm install
```

### Cập Nhật Database
```bash
# Chạy các migration mới trong be/migrations/
mysql -u root -p batechzone < new_migration.sql
```

---

**Chúc bạn cài đặt thành công! 🚀**
