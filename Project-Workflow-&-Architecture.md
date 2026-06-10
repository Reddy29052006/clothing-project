# 🧵 FitCraft Project Workflow & Architecture Guide

**A comprehensive guide for developers to understand the project structure, workflow, and how to contribute effectively.**

---

## 📑 Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture Overview](#architecture-overview)
3. [User Roles & Permissions](#user-roles--permissions)
4. [System Workflow](#system-workflow)
5. [Technology Stack](#technology-stack)
6. [Codebase Structure](#codebase-structure)
7. [Data Flow](#data-flow)
8. [Development Workflow](#development-workflow)
9. [How to Contribute](#how-to-contribute)
10. [Common Issues & Solutions](#common-issues--solutions)

---

## 🎯 Project Overview

**FitCraft** is a modern, premium web application that solves the fashion industry's "fixed size" problem by enabling direct customer-to-tailor garment personalization through precise body measurements.

### Key Features:
- ✅ **Custom-Tailored Fit**: Enter individual body measurements for perfect garment fit
- ✅ **Product Customization**: Select fabrics, colors, styles, and fits dynamically
- ✅ **Interactive Dashboards**: Tailored dashboards for customers, vendors, and admins
- ✅ **Order Tracking**: Track custom garment from selection to delivery
- ✅ **Feedback System**: Continuous improvement through customer feedback

### Language Composition:
- **JavaScript**: 63.9% (Frontend & Backend)
- **CSS**: 35.7% (Styling)
- **HTML**: 0.4% (Markup)

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
| Verify Vendors | ❌ |
| View Admin Stats | ❌ |

**Key Endpoints:**
- `POST /api/auth/register` - Register as customer
- `GET /api/products` - Browse products
- `POST /api/orders` - Create custom order
- `GET /api/orders/my` - View my orders
- `POST /api/feedback` - Submit feedback

---

### 2️⃣ VENDOR (Tailor/Seller Role) 🧵

**What they can do:**
| Action | Permission |
|--------|-----------|
| Register Shop | ✅ |
| Add/Edit/View Products | ✅ |
| Receive Orders | ✅ |
| Accept/Reject Orders | ✅ |
| Update Order Status | ✅ |
| Track Performance Metrics | ✅ |
| View Dashboard | ✅ (Vendor Stats) |
| Verify Other Vendors | ❌ |
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
- `POST /api/auth/register` - Register as vendor
- `GET /api/vendor/products` - View my products
- `POST /api/vendor/products` - Add new product
- `GET /api/vendor/orders` - View my orders
- `PUT /api/vendor/orders/:id/accept` - Accept/reject order
- `PUT /api/vendor/orders/:id/status` - Update order status

---

### 3️⃣ ADMIN (Administrator Role) 👨‍💼

**What they can do:**
| Action | Permission |
|--------|-----------|
| View All Orders | ✅ |
| View All Users | ✅ |
| View All Vendors | ✅ |
| Verify/Unverify Vendors | ✅ |
| View Platform Statistics | ✅ |
| Monitor Revenue | ✅ |
| Filter Orders by Status | ✅ |
| Create/Manage Products | ✅ |

**Dashboard Statistics:**
- Total Orders Count
- Total Users Count
- Total Vendors Count
- Pending Orders Count
- Delivered Orders Count
- Total Revenue

**Key Endpoints:**
- `GET /api/admin/stats` - Platform statistics
- `GET /api/admin/orders` - All orders (with filters)
- `GET /api/admin/vendors` - All vendors (sorted by rating)
- `PUT /api/admin/vendors/:vendorId/verify` - Verify vendor

---

## 🔄 System Workflow

### **Overall Platform Flow**

```
┌─────────────────────────────────────────────────────────────┐
│                    FITCRAFT PLATFORM                         │
└─────────────────────────────────────────────────────────────┘

STEP 1: USER REGISTRATION
├─ Customer registers → Creates account with "user" role
├─ Vendor registers → Creates account with "vendor" role + shop name
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
│  └─ Order Status: "pending" (waiting for vendor assignment)
│
└─ Track Order & Provide Feedback
   ├─ View order status history
   ├─ Status progression: pending → confirmed → pattern → stitching → QC → shipped → delivered
   └─ Submit feedback: tight/perfect/loose (for measurements adjustment)

STEP 3: VENDOR JOURNEY
├─ Receive Order Notification
│  └─ Order appears in vendor dashboard
│
├─ Accept/Reject Order
│  ├─ Review customer measurements & product details
│  └─ Accept: order status → "confirmed"
│     Reject: order status → "rejected"
│
├─ Update Order Status (as work progresses)
│  ├─ "confirmed" → Order confirmed by vendor
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
   └─ Admin can verify vendor based on performance

STEP 4: ADMIN OVERSIGHT
├─ Monitor Platform Health
│  ├─ View dashboard stats (orders, users, vendors, revenue)
│  ├─ Filter orders by status
│  └─ Track pending vs completed orders
│
└─ Manage Vendors
   ├─ Verify new vendors (quality assurance)
   ├─ Unverify problematic vendors
   └─ View vendor performance metrics
```

### **Order Lifecycle**

```
┌──────────┐
│  Pending │  ← Customer creates order
└────┬─────┘
     │ (Vendor sees order)
     ↓
┌──────────────┐
│  Confirmed   │  ← Vendor accepts order
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

## 🛠️ Technology Stack

### Frontend Stack
```
Technology          Version      Purpose
─────────────────────────────────────────────────
React               19.x         UI library
Vite                Latest       Build tool & dev server
Redux Toolkit       Latest       State management
React Router        Latest       Client-side routing
RTK Query           Latest       API data fetching
CSS3                Modern       Styling & animations
```

### Backend Stack
```
Technology          Version      Purpose
─────────────────────────────────────────────────
Node.js             18+          Runtime
Express.js          Latest       Web framework
MongoDB             Latest       NoSQL database
Mongoose            Latest       ODM for MongoDB
JWT                 Latest       Authentication
```

### Database Models
```
User Model
├─ _id, name, email, password (hashed)
├─ role (user/vendor/admin)
├─ phone, createdAt, updatedAt
└─ Relationships: Vendor, Orders, Measurements, Feedback

Vendor Model
├─ userId (ref to User)
├─ shopName, specializations
├─ location, phone
├─ assignedOrders (ref array)
├─ totalCompleted, totalRejected, rating
├─ isVerified (admin verification)
└─ Relationships: User, Orders, Products

Product Model
├─ name, category, description
├─ basePrice, fabrics[], colors[]
├─ featured, isActive
├─ vendorId (if vendor-specific)
└─ Relationships: Orders

Order Model
├─ userId (ref to User - customer)
├─ productId (ref to Product)
├─ vendorId (ref to User - vendor)
├─ status (pending/confirmed/pattern/stitching/qc/shipped/delivered)
├─ measurements, selectedFabric, selectedColor
├─ basePrice, fabricSurcharge, totalPrice
├─ statusHistory (array of status changes with timestamps)
├─ deliveryAddress, estimatedDelivery
└─ Relationships: User, Product, Vendor

Measurement Model
├─ userId (ref to User)
├─ height, weight, bodyType, fitPreference
├─ chest, waist, shoulder, hip, inseam, sleeve, neck
├─ isActive (current measurements)
├─ createdAt, updatedAt
└─ Relationships: User

Feedback Model
├─ orderId (ref to Order)
├─ userId (ref to User)
├─ fitRating (tight/perfect/loose)
├─ comment, specificIssues[]
├─ adjustmentDelta, adjustmentApplied
└─ Relationships: Order, User
```

---

## 📁 Codebase Structure

### Frontend Structure (`apps/frontend/src/`)

```
src/
├── components/
│   ├── common/                # Shared components (Navbar, Footer, etc.)
│   ��── layout/                # Layout components
│   ├── product/               # Product-related components
│   └── order/                 # Order-related components
│
├── pages/
│   ├── customer/
│   │   ├── Measure/           # Measurement entry & history
│   │   ├── Products/          # Product browsing
│   │   ├── OrderDetail/       # Order tracking
│   │   └── Dashboard/         # Customer dashboard
│   │
│   ├── vendor/
│   │   ├── VendorDashboard/   # Vendor overview
│   │   ├── VendorOrders/      # Orders assigned to vendor
│   │   ├── VendorCollection/  # Vendor's products
│   │   └── AddProduct/        # Add new product
│   │
│   ├── admin/
│   │   └── AdminDashboard/    # Admin overview & management
│   │
│   └── auth/
│       ├── Login/
│       └── Register/
│
├── services/
│   ├── baseApi.js             # RTK Query base configuration
│   ├── authApi.js             # Authentication endpoints
│   ├── productApi.js          # Product endpoints
│   ├── orderApi.js            # Order endpoints
│   ├── vendorApi.js           # Vendor endpoints
│   ��── adminApi.js            # Admin endpoints
│   └── measurementApi.js      # Measurement endpoints
│
├── store/
│   ├── index.js               # Redux store configuration
│   └── slices/
│       ├── authSlice.js       # User authentication state
│       ├── productSlice.js    # Product state
│       └── orderSlice.js      # Order state
│
├── routes/
│   ├── customerRoutes.jsx     # Customer page routes
│   ├── vendorRoutes.jsx       # Vendor page routes
│   ├── adminRoutes.jsx        # Admin page routes
│   └── ProtectedRoute.jsx     # Role-based route protection
│
├── styles/
│   ├── global.css             # Global styles
│   └── variables.css          # CSS variables
│
└── App.jsx                    # Main app component
```

### Backend Structure (`apps/backend/`)

```
backend/
├── models/
│   ├── User.js                # User schema (customer/vendor/admin)
│   ├── Vendor.js              # Vendor profile schema
│   ├── Product.js             # Product schema
│   ├── Order.js               # Order schema
│   ├── Measurement.js         # Measurement schema
│   └── Feedback.js            # Feedback schema
│
├── controllers/
│   ├── auth/
│   │   └── authController.js  # Register, login, profile
│   │
│   ├── user/
│   │   ├── orderController.js # Create, get, update orders
│   │   ├── measurementController.js
│   │   └── feedbackController.js
│   │
│   ├── vendor/
│   │   ├── vendorController.js
│   │   └── productController.js
│   │
│   └── admin/
│       └── adminController.js # Platform statistics & vendor verification
│
├── routes/
│   ├── auth.js                # /auth endpoints
│   ├── orders.js              # /orders endpoints
│   ├── measurements.js        # /measurements endpoints
│   ├── products.js            # /products endpoints
│   ├── vendor.js              # /vendor endpoints
│   └── admin.js               # /admin endpoints
│
├── middleware/
│   ├── auth.js                # JWT verification
│   ├── errorHandler.js        # Global error handling
│   └── validation.js          # Input validation
│
├── docs/
│   ├── API_DOCUMENTATION.md   # Complete API guide
│   ├── ADMIN_API.md           # Admin-specific API docs
│   └── VENDOR_API.md          # Vendor-specific API docs
│
├── config/
│   └── database.js            # MongoDB connection
│
├── server.js                  # Express app setup & start
└── package.json
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

### Vendor Order Status Update Flow

```
Vendor Dashboard                Backend (Express)              Database (MongoDB)
──────────────────────────────────────────────────────────────────────────────

Vendor updates status
(e.g., "confirmed" → "pattern")
        │
        ├─→ PUT /api/vendor/orders/:id/status ──→ orderController.updateOrderStatus()
        │                                          │
        │                                          ├─→ Verify vendor owns order
        │                                          │
        │                                          ├─→ Update Order.status
        │                                          │
        │                                          ├─→ Add to statusHistory array
        │                                          │
        │                                          ├─→ If delivered: increment vendor.totalCompleted
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

Admin reviews vendor
performance
        │
        ├─→ PUT /api/admin/vendors/:vendorId/verify ──→ adminController.verifyVendor()
        │                                              │
        │                                              ├─→ Update Vendor.isVerified
        │                                              │
        │                                              └─→ Save to Database ──→ Vendor updated
        │                                                                      │
        ←────────── Success Response ←───────────────────────────────────────┤
        │                          + Updated vendor
        │                          + Verification status
        │
Show verified badge
to vendor
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

**Frontend** (`.env` in `apps/frontend/`)
```
VITE_API_BASE_URL=http://localhost:5001/api
VITE_APP_NAME=FitCraft
```

**Backend** (`.env` in `apps/backend/`)
```
PORT=5001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/fitcraft
JWT_SECRET=your-secret-key-here
JWT_EXPIRE=7d
```

---

## 🤝 How to Contribute

### Finding Work

1. **Check Issues & PRs**
   - Go to GitHub Issues tab
   - Look for labels: `good first issue`, `help wanted`, `bug`, `enhancement`
   - Read issue description & discussion

2. **Types of Contributions**
   - Bug fixes
   - Feature implementations
   - Documentation improvements
   - Performance optimizations
   - UI/UX enhancements

### Development Process

#### Step 1: Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
# or for bugs:
git checkout -b fix/bug-description
```

#### Step 2: Make Changes

**For Backend Changes:**
- Modify files in `apps/backend/`
- Update corresponding API documentation in `apps/backend/docs/`
- Test using API tools (Postman, curl, etc.)

**For Frontend Changes:**
- Modify files in `apps/frontend/src/`
- Ensure responsive design
- Test across browsers

**For Documentation:**
- Update README.md or relevant docs
- Add code comments for complex logic

#### Step 3: Run Locally
```bash
npm run dev                          # Start dev servers
npm run dev:backend                  # Only backend
npm run dev:frontend                 # Only frontend
```

#### Step 4: Test Your Changes
- Manually test in browser/Postman
- Verify no console errors
- Check all related features still work

#### Step 5: Commit & Push
```bash
git add .
git commit -m "feat: Add feature description" # Use conventional commits
# or "fix: Fix bug description"
# or "docs: Update documentation"

git push origin feature/your-feature-name
```

#### Step 6: Create Pull Request
- Go to GitHub repository
- Click "Create Pull Request"
- Fill in PR template
- Link related issue (if applicable)
- Request review from maintainers

### Commit Message Convention

Follow **Conventional Commits**:
```
type(scope): subject

body (optional)

footer (optional)
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Code style (formatting)
- `refactor` - Code refactoring
- `perf` - Performance improvement
- `test` - Test addition/modification
- `chore` - Build config, deps, etc.

**Examples:**
```
feat(orders): add order filtering by status
fix(vendor): correct order assignment logic
docs(api): add vendor API documentation
refactor(auth): simplify JWT verification
```

### PR Guidelines

✅ **Do:**
- Create descriptive PR title
- Link related issues
- Add description of changes
- Test locally before submitting
- Keep PRs focused on single feature/fix
- Update documentation if needed

❌ **Don't:**
- Include unrelated changes
- Submit without testing
- Leave console errors/warnings
- Add console.log() in production code
- Merge without review

---

## 🐛 Common Issues & Solutions

### Issue: Frontend Can't Connect to Backend

**Problem:** `GET http://localhost:5001/api/... failed`

**Solution:**
```bash
# 1. Check backend is running
npm run dev:backend

# 2. Verify VITE_API_BASE_URL in apps/frontend/.env
VITE_API_BASE_URL=http://localhost:5001/api

# 3. Check backend PORT in apps/backend/.env
PORT=5001

# 4. Clear frontend cache
# In browser: DevTools → Application → Clear storage
```

### Issue: MongoDB Connection Error

**Problem:** `Error: connect ECONNREFUSED 127.0.0.1:27017`

**Solution:**
```bash
# 1. Start MongoDB service
# On Windows:
mongod

# On macOS (with Homebrew):
brew services start mongodb-community

# On Linux:
sudo systemctl start mongod

# 2. Verify connection string in apps/backend/.env
MONGODB_URI=mongodb://localhost:27017/fitcraft
```

### Issue: JWT Token Expired / 401 Unauthorized

**Problem:** `{ "success": false, "message": "Not authorized" }`

**Solution:**
```
1. Log out and log back in to get new token
2. Check JWT_EXPIRE in backend .env (default: 7d)
3. Verify Authorization header is being sent:
   Authorization: Bearer YOUR_JWT_TOKEN
```

### Issue: Port Already in Use

**Problem:** `Error: listen EADDRINUSE: address already in use :::5001`

**Solution:**
```bash
# Find process using port 5001
lsof -i :5001

# Kill process
kill -9 <PID>

# Or use different port
PORT=5002 npm run dev:backend
```

### Issue: Module Not Found Errors

**Problem:** `Cannot find module 'express'` or similar

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules apps/frontend/node_modules apps/backend/node_modules
npm install
```

### Issue: Changes Not Reflecting

**Problem:** Frontend still shows old code after changes

**Solution:**
```
1. Hard refresh browser: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. Clear browser cache (DevTools → Network → Disable cache)
3. Restart dev server: npm run dev
4. If using Vite, check HMR is enabled (auto-reload on save)
```

---

## 📚 Additional Resources

- **Main README**: `README.md`
- **Setup Guide**: `HOW_TO_RUN.md`
- **Deployment Guide**: `DEPLOYMENT.md`
- **API Documentation**: `apps/backend/docs/API_DOCUMENTATION.md`
- **Admin API Guide**: `apps/backend/docs/ADMIN_API.md`

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

### Common Development Scenarios

**Scenario 1: Adding a New API Endpoint**
```
1. Create controller function in apps/backend/controllers/
2. Add route in apps/backend/routes/
3. Create RTK Query endpoint in apps/frontend/services/
4. Use endpoint in React component
5. Update API documentation
```

**Scenario 2: Fixing a Bug in Customer Dashboard**
```
1. Create branch: git checkout -b fix/customer-dashboard-bug
2. Find component in apps/frontend/src/pages/customer/
3. Debug & fix issue
4. Test locally: npm run dev
5. Commit & push
6. Create PR with bug fix description
```

**Scenario 3: Adding Customer Feedback Feature**
```
1. Create Feedback schema in apps/backend/models/Feedback.js
2. Create feedback routes & controller in apps/backend/
3. Create RTK Query service in apps/frontend/services/feedbackApi.js
4. Create feedback component in apps/frontend/components/
5. Integrate into order detail page
6. Test complete workflow
7. Update documentation
```

---

## ✅ Checklist for PRs

Before submitting a PR, verify:

- [ ] Code follows project structure conventions
- [ ] No console errors or warnings
- [ ] Tested locally (`npm run dev`)
- [ ] Related documentation updated
- [ ] Commit messages follow conventional commits
- [ ] No unrelated changes included
- [ ] PR description is clear and detailed
- [ ] Related issues are linked
- [ ] Code is readable with proper naming

---

## 💡 Tips for Success

1. **Start Small**: Begin with `good first issue` labeled issues
2. **Ask Questions**: Comment on issues if anything is unclear
3. **Keep PRs Focused**: Don't mix multiple features/fixes
4. **Read Documentation**: Check docs/ folder before implementing
5. **Test Everything**: Always test locally before submitting PR
6. **Review Code**: Look at similar code to maintain consistency
7. **Be Patient**: Maintainers may take time to review

---

## 📞 Need Help?

- Check existing issues for similar problems
- Comment on the issue you're working on
- Review API documentation in `apps/backend/docs/`
- Check local dev setup in `HOW_TO_RUN.md`

---

**Happy Contributing! 🚀**

*Last Updated: June 2026*
