# 🧵 FitCraft Project Workflow & Architecture Guide

**A comprehensive guide for developers to understand the project structure, workflow, and how to contribute effectively.**

---

## 📑 Table of Contents

1. [Project Overview](#-project-overview)
2. [Architecture Overview](#-architecture-overview)
3. [User Roles & Permissions](#-user-roles--permissions)
4. [System Workflow](#-system-workflow)
5. [Data Flow](#-data-flow)

---

## 🎯 Project Overview

**FitCraft** is a modern, premium web application that solves the fashion industry's "fixed size" problem by enabling direct customer-to-tailor garment personalization through precise body measurements.

### Key Features:
- ✅ **Custom-Tailored Fit**: Enter individual body measurements for perfect garment fit
- ✅ **Product Customization**: Select fabrics, colors, styles, and fits dynamically
- ✅ **Interactive Dashboards**: Tailored dashboards for customers, tailors, and admins
- ✅ **Order Tracking**: Track custom garment from selection to delivery
- ✅ **Feedback System**: Continuous improvement through customer feedback

---

## 🏗️ Architecture Overview

FitCraft uses a **Monorepo Architecture** with **NPM Workspaces**, separating frontend and backend into independent, reusable applications.

```
clothing-project/ (Root Monorepo)
│
├── apps/
│   ├── frontend/              # React + Vite Client Application
│   │   ├── src/
│   │   │   ├── components/    # Reusable UI components
│   │   │   ├── pages/         # Page layouts
│   │   │   ├── services/      # API services (Redux RTK Query)
│   │   │   ├── store/         # Redux state management
│   │   │   ├── routes/        # Route definitions
│   │   │   └── styles/        # Global & component CSS
│   │   ├── package.json
│   │   └── vite.config.js
│   │
│   └── backend/               # Express.js API Server
│       ├── models/            # Mongoose database schemas
│       ├── controllers/       # Business logic
│       ├── routes/            # API endpoints
│       ├── middleware/        # Auth, validation, error handling
│       ├── docs/              # API documentation
│       ├── package.json
│       └── server.js
│
├── scripts/
│   └── setup.js               # Interactive environment configuration
│
├── package.json               # Workspace root definitions
├── README.md                  # Main project documentation
├── HOW_TO_RUN.md              # Setup & running instructions
└── DEPLOYMENT.md              # Production deployment guide

```

### Architecture Details:
- **Monorepo Engine**: NPM Workspaces
- **Frontend**: React 19, Redux Toolkit, Vite, React Router
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JWT Authentication
- **Runtime**: Node.js v18.0.0 or higher
- **Package Manager**: NPM v10.0.0 or higher

---

## 👥 User Roles & Permissions

FitCraft has **3 main user roles** with distinct responsibilities:

### 1️⃣ CUSTOMER (User Role) 👤

**What they can do:**
| Action | Permission |
|--------|-----------|
| Register & Create Account | ✅ |
| Enter/Update Body Measurements | ✅ |
| Browse Products | ✅ |
| Create Orders | ✅ |
| Track Orders | ✅ |
| Submit Feedback | ✅ |
| View Dashboard | ✅ (My Orders) |
| Accept Orders | ❌ |
| Verify Tailors | ❌ |
| View Admin Stats | ❌ |

**Key Endpoints:**
- `POST /api/auth/register` - Register as customer
- `GET /api/products` - Browse products
- `POST /api/orders` - Create custom order
- `GET /api/orders/my` - View my orders
- `POST /api/feedback` - Submit feedback

---

### 2️⃣ TAILORS (Tailor/Seller Role) 🧵

**What they can do:**
| Action | Permission |
|--------|-----------|
| Register Shop | ✅ |
| Add/Edit/View Products | ✅ |
| Receive Orders | ✅ |
| Accept/Reject Orders | ✅ |
| Update Order Status | ✅ |
| Track Performance Metrics | ✅ |
| View Dashboard | ✅ (Tailors Stats) |
| Verify Other Tailors | ❌ |
| View Admin Stats | ❌ |

**Specializations Available:**
- Shirt
- Trousers
- Suit
- Kurta
- Blazer
- Dress

**Performance Metrics:**
- Total Completed Orders
- Total Rejected Orders
- Rating (0-5 stars)
- Verification Status

**Key Endpoints:**
- `POST /api/auth/register` - Register as tailors
- `GET /api/tailors/products` - View my products
- `POST /api/tailors/products` - Add new product
- `GET /api/tailors/orders` - View my orders
- `PUT /api/tailors/orders/:id/accept` - Accept/reject order
- `PUT /api/tailors/orders/:id/status` - Update order status

---

### 3️⃣ ADMIN (Administrator Role) 👨‍💼

**What they can do:**
| Action | Permission |
|--------|-----------|
| View All Orders | ✅ |
| View All Users | ✅ |
| View All Tailors | ✅ |
| Verify/Unverify Tailors | ✅ |
| View Platform Statistics | ✅ |
| Monitor Revenue | ✅ |
| Filter Orders by Status | ✅ |
| Create/Manage Products | ✅ |

**Dashboard Statistics:**
- Total Orders Count
- Total Users Count
- Total Tailors Count
- Pending Orders Count
- Delivered Orders Count
- Total Revenue

**Key Endpoints:**
- `GET /api/admin/stats` - Platform statistics
- `GET /api/admin/orders` - All orders (with filters)
- `GET /api/admin/tailors` - All tailors (sorted by rating)
- `PUT /api/admin/tailors/:tailorsId/verify` - Verify tailors

---

## 🔄 System Workflow

### **Overall Platform Flow**

```
┌─────────────────────────────────────────────────────────────┐
│                    FITCRAFT PLATFORM                         │
└─────────────────────────────────────────────────────────────┘

STEP 1: USER REGISTRATION
├─ Customer registers → Creates account with "user" role
├─ Tailors registers → Creates account with "tailors" role + shop name
└─ Admin → Pre-created with "admin" role

STEP 2: CUSTOMER JOURNEY
├─ Save Body Measurements
│  ├─ Input: height, weight, body type, fit preference
│  └─ Backend calculates: chest, waist, shoulder, hip, inseam, sleeve, neck
│
├─ Browse Products
│  ├─ GET /products (with category, search, pagination)
│  └─ View product details: price, fabrics, colors, description
│
├─ Create Custom Order
│  ├─ Select: product, fabric, color, fit preference
│  ├─ Backend automatically uses saved measurements
│  └─ Order Status: "pending" (waiting for tailors assignment)
│
└─ Track Order & Provide Feedback
   ├─ View order status history
   ├─ Status progression: pending → confirmed → pattern → stitching → QC → shipped → delivered
   └─ Submit feedback: tight/perfect/loose (for measurements adjustment)

STEP 3: TAILORS JOURNEY
├─ Receive Order Notification
│  └─ Order appears in tailors dashboard
│
├─ Accept/Reject Order
│  ├─ Review customer measurements & product details
│  └─ Accept: order status → "confirmed"
│     Reject: order status → "rejected"
│
├─ Update Order Status (as work progresses)
│  ├─ "confirmed" → Order confirmed by tailors
│  ├─ "pattern" → Pattern prepared
│  ├─ "stitching" → Garment being stitched
│  ├─ "qc" → Quality check in progress
│  ├─ "shipped" → Order shipped
│  └─ "delivered" → Order completed
│
└─ Build Reputation
   ├─ Each completed order increases "totalCompleted"
   ├─ Each rejected order increases "totalRejected"
   ├─ Rating automatically calculated (0-5 stars)
   └─ Admin can verify tailors based on performance

STEP 4: ADMIN OVERSIGHT
├─ Monitor Platform Health
│  ├─ View dashboard stats (orders, users, tailors, revenue)
│  ├─ Filter orders by status
│  └─ Track pending vs completed orders
│
└─ Manage Tailors
   ├─ Verify new tailors (quality assurance)
   ├─ Unverify problematic tailors
   └─ View tailors performance metrics
```

### **Order Lifecycle**

```
┌──────────┐
│  Pending │  ← Customer creates order
└────┬─────┘
     │ (Tailors sees order)
     ↓
┌──────────────┐
│  Confirmed   │  ← Tailors accepts order
└────┬─────────┘
     │
     ↓
┌──────────────┐
│   Pattern    │  ← Pattern prepared
└────┬─────────┘
     │
     ↓
┌──────────────┐
│  Stitching   │  ← Garment being stitched
└────┬─────────┘
     │
     ↓
┌──────────────┐
│     QC       │  ← Quality check
└────┬─────────┘
     │
     ↓
┌──────────────┐
│   Shipped    │  ← In transit
└────┬─────────┘
     │
     ↓
┌──────────────┐
│  Delivered   │  ← Order complete, customer can submit feedback
└──────────────┘
```

---

## 📊 Data Flow

### Customer Order Creation Flow

```
Frontend (React)                Backend (Express)              Database (MongoDB)
─────────────────────────────────────────────────────────────────────────────

Customer fills form
(product, fabric, color)
        │
        ├─→ POST /api/orders ─────→ orderController.createOrder()
        │                           │
        │                           ├─→ Verify user has measurements
        │                           │
        │                           ├─→ Calculate price (base + surcharge)
        │                           │
        │                           ├─→ Create Order document
        │                           │
        │                           └─→ Save to Database ─────→ Order inserted
        │                                                      │
        ←────────── Order Response ←────────────────────────────┤
        │                                  + Order ID
        │                                  + Status
        │                                  + Measurements
        │
Display Order Summary
to Customer
```

### Tailors Order Status Update Flow

```
Tailors Dashboard                Backend (Express)              Database (MongoDB)
──────────────────────────────────────────────────────────────────────────────

Tailors updates status
(e.g., "confirmed" → "pattern")
        │
        ├─→ PUT /api/tailors/orders/:id/status ──→ orderController.updateOrderStatus()
        │                                          │
        │                                          ├─→ Verify tailors owns order
        │                                          │
        │                                          ├─→ Update Order.status
        │                                          │
        │                                          ├─→ Add to statusHistory array
        │                                          │
        │                                          ├─→ If delivered: increment tailors.totalCompleted
        │                                          │
        │                                          └─→ Save to Database ──→ Order updated
        │                                                                   │
        ←────────── Success Response ←────────────────────────────────────┤
        │                           + Updated order
        │                           + Status history
        │
Refresh order list
```

### Admin Verification Flow

```
Admin Dashboard                 Backend (Express)              Database (MongoDB)
──────────────────────────────────────────────────────────────────────────────

Admin reviews tailors
performance
        │
        ├─→ PUT /api/admin/tailors/:tailorsId/verify ──→ adminController.verifyTailors()
        │                                              │
        │                                              ├─→ Update Tailors.isVerified
        │                                              │
        │                                              └─→ Save to Database ──→ Tailors updated
        │                                                                      │
        ←────────── Success Response ←───────────────────────────────────────┤
        │                          + Updated tailors
        │                          + Verification status
        │
Show verified badge
to tailors
```

---

## 🔧 Development Workflow

### Local Setup

```bash
# 1. Clone repository
git clone https://github.com/Reddy29052006/clothing-project.git
cd clothing-project

# 2. Install dependencies (for monorepo)
npm install

# 3. Run interactive setup (auto-configures .env files)
npm run setup

# 4. Start development servers (frontend + backend concurrently)
npm run dev

# Output:
# Frontend: http://localhost:5173
# Backend API: http://localhost:5001
```

### Project Commands

```bash
# Development
npm run dev              # Start both frontend & backend
npm run dev:frontend    # Frontend only (Vite dev server)
npm run dev:backend     # Backend only (Node.js with nodemon)

# Building
npm run build           # Build both frontend & backend
npm run build:frontend  # Frontend build only
npm run build:backend   # Backend build only

# Testing
npm run test            # Run tests (if configured)

# Workspace Commands
npm run -w apps/frontend <command>  # Run command in frontend workspace
npm run -w apps/backend <command>   # Run command in backend workspace
```

### Environment Variables

For a step-by-step guide on how to sign up and retrieve each API key/credential below, refer to the **[Step-by-Step API Credentials Guide](./GET_APIS.md)**.

**Frontend** (`.env` in `apps/frontend/`)
```env
VITE_API_URL=http://localhost:5001/api
VITE_BASE_URL=http://localhost:5001
```

**Backend** (`.env` in `apps/backend/`)
```env
PORT=5001
NODE_ENV=development
CLIENT_URL=http://localhost:5173
JWT_SECRET=fitcraft_jwt
JWT_EXPIRES_IN=7d
MONGO_URI=mongodb+srv://...

# Integrations
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
FROM_EMAIL=your_email@domain.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_gmail@gmail.com
SMTP_PASS=your_gmail_app_password
NGROK_AUTHTOKEN=your_ngrok_token
```

---

## 🎓 Understanding the Workflow

### Quick Overview for New Developers

```
1. FRONTEND (React/Vite)
   ↓
   Makes API calls to →

2. BACKEND (Express.js)
   ↓
   Processes requests & talks to →

3. DATABASE (MongoDB)
   ↓
   Stores data & returns to →

4. BACKEND
   ↓
   Sends response back to →

5. FRONTEND
   ↓
   Updates UI with data
```
---

## 📞 Need Help?

- Check existing issues for similar problems
- Comment on the issue you're working on
- Review API documentation in wiki
- Check local dev setup in `HOW_TO_RUN.md`

---

**Happy Contributing! 🚀**

*Last Updated: June 2026*