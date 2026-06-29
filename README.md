# BATechZone 🛒

A full-stack e-commerce platform for tech products, built with Node.js, React, and MySQL. Features a complete order lifecycle — from product browsing and cart management to multi-gateway payment processing, real-time shipping integration, and warranty tracking.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, Zustand |
| Backend | Node.js, Express.js |
| Database | MySQL |
| Auth | JWT (access token + refresh flow) |
| Payments | MoMo, VNPay, PayOS |
| Shipping | GHN API |
| File Upload | Multer |
| Dev Tools | Git, Postman |

## Features

### Customer
- Product catalog with **EAV-based flexible attributes** (SKU, variant, serial number)
- Cart management with real-time stock validation
- Multi-step checkout for both registered users and **guests** (no phantom account created)
- Payment via **MoMo**, **VNPay**, and **PayOS** with idempotency and atomicity guarantees
- Real-time delivery tracking via **GHN Shipping API**
- Order tracking by phone number — no login required
- Warranty lifecycle management by serial number

### Admin
- Order management with full customer info via address JOIN
- Product and inventory management
- Shipper role assignment and delivery status updates

### Security & Data Integrity
- **RBAC** across 3 roles: Customer, Shipper, Admin — enforced via Express middleware
- **HMAC SHA256 webhook signature verification** for MoMo and PayOS callbacks
- SQL injection prevention with **prepared statements**
- Concurrency and overselling prevention with **pessimistic locking + database transactions**
- **Idempotency keys** to prevent duplicate payment processing

---

## Project Structure

```
BATechZone/
├── be/                  # Backend (Node.js + Express)
│   ├── src/
│   │   ├── controllers/ # Request handlers
│   │   ├── models/      # Database models
│   │   ├── routes/      # API route definitions
│   │   ├── middlewares/ # Auth, RBAC, upload
│   │   └── services/    # Payment, shipping integrations
│   └── .env.example
├── fe/                  # Frontend (React + Vite)
│   └── src/
│       ├── components/
│       ├── pages/
│       │   ├── user/    # Customer-facing pages
│       │   └── admin/   # Admin dashboard
│       ├── services/    # API calls
│       └── stores/      # Zustand state management
└── docs/                # Database schema & diagrams
```

---

## Getting Started

### Prerequisites

- Node.js >= 18
- MySQL >= 8.0
- A MoMo / VNPay / PayOS sandbox account (for payment testing)
- A GHN sandbox account (for shipping)

### 1. Clone the repo

```bash
git clone https://github.com/DuyAnh3223/BATechZone.git
cd BATechZone
```

### 2. Setup the database

Import the schema from `docs/`:

```bash
mysql -u root -p your_database_name < docs/schema.sql
```

### 3. Configure the backend

```bash
cd be
cp .env.example .env
```

Fill in your `.env`:

```env
# Server
PORT=5001
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=batechzone

# JWT
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret

# MoMo
MOMO_PARTNER_CODE=MOMO
MOMO_ACCESS_KEY=your_access_key
MOMO_SECRET_KEY=your_secret_key
MOMO_ENDPOINT=https://test-payment.momo.vn/v2/gateway/api/create
MOMO_REDIRECT_URL=http://localhost:5173/payment/success
MOMO_IPN_URL=http://your-ngrok-url/api/payments/momo/webhook

# VNPay
VNPAY_TMN_CODE=your_tmn_code
VNPAY_HASH_SECRET=your_hash_secret
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_RETURN_URL=http://localhost:5173/payment/success

# PayOS
PAYOS_CLIENT_ID=your_client_id
PAYOS_API_KEY=your_api_key
PAYOS_CHECKSUM_KEY=your_checksum_key

# GHN
GHN_API_KEY=your_ghn_api_key
GHN_SHOP_ID=your_shop_id
```

### 4. Install dependencies & start

```bash
# Backend
cd be
npm install
npm run dev     # runs on http://localhost:5001

# Frontend (new terminal)
cd fe
npm install
npm run dev     # runs on http://localhost:5173
```

---

## API Overview

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new account |
| POST | `/api/auth/login` | Login, returns JWT |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/logout` | Invalidate token |

### Products
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/products` | List products with filters |
| GET | `/api/products/:id` | Product detail with variants |
| POST | `/api/products` | Create product (Admin) |
| PUT | `/api/products/:id` | Update product (Admin) |

### Orders
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/orders` | Create order |
| GET | `/api/orders/my` | Get current user's orders |
| GET | `/api/orders/track/:phone` | Track orders by phone (public) |
| PUT | `/api/orders/:id/status` | Update order status (Admin/Shipper) |

### Payments
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/payments/create-payment-link` | Create MoMo/VNPay/PayOS link |
| POST | `/api/payments/momo/webhook` | MoMo IPN callback |
| POST | `/api/payments/webhook` | PayOS webhook |
| GET | `/api/payments/status/:orderId` | Check payment status |

---

## Key Technical Decisions

**EAV schema for product variants** — Products can have arbitrary attributes (RAM, storage, color) without schema changes, paired with SKU and serial number tracking for warranty management.

**Guest checkout without phantom accounts** — Guest orders store shipping info in the `addresses` table with `user_id = NULL`. Admin views customer info via `orders.address_id → addresses` JOIN. No throwaway user records pollute the users table.

**Pessimistic locking for stock** — `SELECT ... FOR UPDATE` inside a transaction prevents overselling under concurrent checkout requests.

**Idempotency keys on payments** — Each payment request carries a unique key so retried requests don't trigger duplicate charges, even if the client re-submits.

**HMAC SHA256 on webhooks** — Incoming callbacks from MoMo and PayOS are verified against a signature computed from the secret key before any order state is mutated.

---

## Payment Flow (MoMo)

```
User selects MoMo at checkout
        │
        ▼
POST /api/payments/create-payment-link
  └─ Generate orderId + HMAC signature
  └─ Call MoMo API → receive checkoutUrl
        │
        ▼
User redirected to MoMo gateway
        │
   [Payment done]
        │
        ├──► MoMo calls POST /api/payments/momo/webhook
        │         └─ Verify HMAC signature
        │         └─ Update payment_status in DB
        │         └─ Trigger order creation (atomic)
        │
        └──► User redirected to /payment/success
                  └─ Reads pending_order from localStorage
                  └─ Creates order record if webhook hasn't yet
                  └─ Clears cart
```

---

## Naming Conventions

| Case | Usage |
|---|---|
| `PascalCase` | React components, pages, component folders |
| `camelCase` | Functions, variables, state, props |
| `UPPER_SNAKE_CASE` | Constants, fixed config values |
| `kebab-case` | General folders (utils, services, controllers) |

---

## Authors

| Name | Role |
|---|---|
| Mai Trần Duy Anh | Backend, Database, Payment & Shipping Integration |
| Lê Tôn Bảo | Frontend, UI/UX |

---

## License

This project is for educational purposes.
