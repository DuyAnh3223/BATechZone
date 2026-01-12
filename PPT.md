Create a PowerPoint presentation for a PC Hardware E-commerce Store project called "BATechZone".  The presentation should be professional, visually appealing, and suitable for a 15-minute presentation (6-7 minutes for slides, 7-8 minutes for demo).

---

SLIDE 1: PROJECT INTRODUCTION
Title: "BATechZone - PC Hardware Store"

Content:
- Project Name: BATechZone - PC Hardware E-commerce Platform
- Objective: Build an online PC hardware store with intelligent PC Building feature
- Target Users: 
  * Customers:  Shopping, PC building, warranty management
  * Administrators: Product, order, and warranty management
- Key Innovation:  Automated compatibility checking for PC components

---

SLIDE 2: SYSTEM OVERVIEW
Title: "Core Features Overview"

Create two columns: 

LEFT COLUMN - Customer Features:
- Diverse shopping & payment options
- Intelligent PC Builder with compatibility check
- Flexible installment payment plans
- Online warranty management system

RIGHT COLUMN - Admin Features: 
- Dashboard & revenue analytics
- Product & Serial Number management
- Order & warranty processing
- Installment & coupon management

---

SLIDE 3: FEATURED FUNCTIONALITY #1 - INTELLIGENT PC BUILDER ⭐
Title: "Smart PC Builder with Auto Compatibility Check"

Content:
Process Flow:
Select Components → Compatibility Check → Real-time Pricing → Add to Cart

Automated Compatibility Checks: 
✓ CPU ↔ Mainboard (Socket:  LGA 1700, AM5, etc.)
✓ CPU/Mainboard ↔ RAM (DDR4/DDR5 type matching)
✓ Mainboard ↔ Case (Form Factor:  ATX, Micro-ATX, Mini-ITX)
✓ GPU ↔ Case (GPU length validation)

Key Benefit: Prevents customers from purchasing incompatible components

---

SLIDE 4: FEATURED FUNCTIONALITY #2 - PAYMENT SYSTEM ⭐
Title: "Multi-Payment Gateway Integration"

Create a table with 4 payment methods:

| Payment Method | Features |
|----------------|----------|
| COD | Cash on Delivery |
| Momo E-Wallet | QR Code + ATM, Webhook IPN Processing |
| VNPay | ATM + Credit Card, SHA512 Security |
| Installment | 3/6/9/12/24 months, Auto interest calculation |

Security Features:
- Signature verification (HMAC-SHA256/SHA512)
- Secure webhook handling
- Transaction status tracking

---

SLIDE 5: FEATURED FUNCTIONALITY #3 - WARRANTY MANAGEMENT ⭐
Title: "Comprehensive Warranty Management System"

Two Warranty Channels: 

🌐 ONLINE (Customer Self-Service):
Process:  Select Product → Upload Images → Track Progress
- Real-time status updates
- Image documentation
- Progress notifications

🏪 WALK-IN (Physical Store):
Process: Admin Search (Serial/Phone) → Create Request → Inspect → Accept/Reject
- Serial number lookup
- Admin inspection workflow
- Rejection reason tracking

Serial Number Management:
- Unique identifier for each product
- Lifecycle:  available → sold → rma_in → rma_out
- Linked to orders and warranty period

---

SLIDE 6: BUSINESS PROCESSES
Title: "Shopping & Installment Process"

Shopping Flow:
Browse Products → Shopping Cart → Select Address → Payment → Track Order → Receive & Activate Warranty

Installment Process: 
Select Plan → Fill Application → Down Payment → Monthly Payments
- Flexible terms (3/6/9/12/24 months)
- Automatic interest calculation
- Overdue payment tracking

Key Features:
- Guest cart (no login required)
- Auto-merge cart upon login
- Coupon/Voucher support
- Order tracking by phone number

---

SLIDE 7: TECHNOLOGY STACK
Title: "Modern Technology Stack"

BACKEND:
- Core: Node.js + Express. js (ES Modules)
- Database: MySQL 2 with Connection Pool
- Authentication: JWT (Access + Refresh tokens), bcrypt
- Payment: Momo SDK, VNPay Integration
- File Upload:  Multer with validation
- Security:  CORS, DOMPurify (XSS protection)

FRONTEND:
- Framework: React 19 + Vite
- State Management:  Zustand (lightweight)
- UI Library: Tailwind CSS + Radix UI (headless components)
- Form Handling: React Hook Form + Zod validation
- HTTP Client: Axios with JWT interceptors
- Rich Text:  CKEditor 5

---

SLIDE 8: SYSTEM ARCHITECTURE
Title: "System Architecture & Design Pattern"

Create an architecture diagram showing: 

┌─────────────────┐
│    FRONTEND     │  React + Zustand + Vite
│   (Client App)  │
└────────┬────────┘
         │ Axios API Calls
┌────────▼─────────────────┐
│   BACKEND (Express.js)   │
├──────────────────────────┤
│ • Controllers (Requests) │
│ • Services (Business)    │
│ • DAOs (Database)        │
└────────┬─────────────────┘
         │
    ┌────┴────┐
┌───▼───┐  ┌──▼──────────┐
│ MySQL │  │ Payment APIs│
│   DB  │  │ Momo/VNPay  │
└───────┘  └─────────────┘

Architecture Pattern:  MVC + Service Layer + DAO Pattern

---



SLIDE 9: DEMO & CONCLUSION
Title: "Live Demo & Project Summary"

Demo Plan (7-8 minutes):
1. Smart PC Builder (2-3 min) - Core Innovation
2. Shopping & Payment Flow (2 min)
3. Warranty Request Creation (1-2 min)
4. Admin:  Order & Warranty Management (2 min)

Project Summary: 
✓ Comprehensive, production-ready system
✓ Modern technology stack
✓ Solves real-world problems in PC hardware retail
✓ Unique features:  Compatibility checking, multi-payment, warranty tracking

Key Innovation: Automated compatibility checking prevents costly customer mistakes

Thank You + Q&A

---

DESIGN REQUIREMENTS:
- Use a modern, tech-oriented color scheme (blue, dark gray, accent colors)
- Include relevant icons for each feature
- Use diagrams/flowcharts where appropriate
- Keep text concise with bullet points
- Highlight key statistics and features with visual elements
- Use contrasting colors for important information
- Include the BATechZone branding consistently