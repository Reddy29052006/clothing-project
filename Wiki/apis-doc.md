# 🧵 FitCraft API Documentation

Welcome to the **FitCraft API Documentation**! This guide explains all the APIs available in the FitCraft platform in a beginner-friendly way.

---

## 📚 Table of Contents

1. [Getting Started](#getting-started)
2. [Authentication APIs](#-authentication-apis)
3. [Measurements APIs](#-measurements-apis)
4. [Products APIs](#-products-apis)
5. [Orders APIs](#-orders-apis)
6. [Feedback APIs](#-feedback-apis)
7. [Admin APIs](#-admin-apis)
8. [Tailors APIs](#-tailors-apis)
9. [Error Handling](#-error-handling)

---

## Getting Started

### Base URL
```
http://localhost:5001/api
```

### API Response Format
All API responses follow this format:
```json
{
  "success": true/false,
  "message": "Response message",
  "data": { /* your data */ }
}
```

### Authentication
Most APIs require a **JWT Token** (JSON Web Token). Include it in the request header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 🔐 Authentication APIs

These APIs handle user registration, login, and profile retrieval.

### 1. Register a New User

**Endpoint:** `POST /auth/register`

**What it does:** Creates a new user account (customer or tailors)

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "user",           // "user" for customer, "tailors" for tailor
  "phone": "9876543210",    // optional
  "shopName": "John's Tailor Shop"  // required only if role is "tailors"
}
```

**Response (Success):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user_id_123",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Email already registered"
}
```

---

### 2. Login User

**Endpoint:** `POST /auth/login`

**What it does:** Logs in a user and returns a JWT token

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user_id_123",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

---

### 3. Get Current User Profile

**Endpoint:** `GET /auth/me`

**What it does:** Retrieves the profile of the logged-in user

**Authentication:** ✅ Required (use JWT token)

**Response (Success):**
```json
{
  "success": true,
  "user": {
    "_id": "user_id_123",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

---

## 📏 Measurements APIs

These APIs manage body measurements for custom-fit clothing.

### 1. Calculate Measurements Preview

**Endpoint:** `POST /measurements/calculate`

**What it does:** Calculates estimated measurements based on height, weight, body type, and fit preference. **No account required!**

**Request Body:**
```json
{
  "height": 180,              // in cm
  "weight": 75,               // in kg
  "bodyType": "athletic",     // "slim", "regular", "athletic", "plus"
  "fitPreference": "regular"  // "slim", "regular", "relaxed"
}
```

**Response (Success):**
```json
{
  "success": true,
  "measurements": {
    "chest": 95,      // in cm
    "waist": 82,
    "shoulder": 42,
    "hip": 92,
    "inseam": 82,
    "sleeve": 60,
    "neck": 38
  }
}
```

---

### 2. Save User Measurements

**Endpoint:** `POST /measurements`

**What it does:** Saves the user's body measurements. Previous measurements are marked as inactive.

**Authentication:** ✅ Required

**Request Body:**
```json
{
  "height": 180,
  "weight": 75,
  "bodyType": "athletic",
  "fitPreference": "regular"
}
```

**Response (Success):**
```json
{
  "success": true,
  "measurement": {
    "_id": "measurement_id_456",
    "userId": "user_id_123",
    "height": 180,
    "weight": 75,
    "chest": 95,
    "waist": 82,
    "shoulder": 42,
    "hip": 92,
    "inseam": 82,
    "sleeve": 60,
    "neck": 38,
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

---

### 3. Get Your Current Measurements

**Endpoint:** `GET /measurements/me`

**What it does:** Retrieves the user's active (current) measurements

**Authentication:** ✅ Required

**Response (Success):**
```json
{
  "success": true,
  "measurement": {
    "_id": "measurement_id_456",
    "userId": "user_id_123",
    "height": 180,
    "weight": 75,
    "chest": 95,
    "waist": 82,
    "isActive": true
  }
}
```

---
---

### 4. Get Measurement History

**Endpoint:** `GET /measurements/history`

**What it does:** Retrieves all past measurements for the user (useful to track changes)

**Authentication:** ✅ Required

**Response (Success):**
```json
{
  "success": true,
  "measurements": [
    {
      "_id": "measurement_id_456",
      "height": 180,
      "chest": 95,
      "createdAt": "2024-01-15T10:30:00Z"
    },
    {
      "_id": "measurement_id_789",
      "height": 179,
      "chest": 94,
      "createdAt": "2024-01-10T08:15:00Z"
    }
  ]
}
```

---

## 🛍️ Products APIs

These APIs manage clothing products available in the store.

### 1. Get All Products

**Endpoint:** `GET /products`

**What it does:** Retrieves a list of all available clothing products with pagination and filtering

**Query Parameters:**
- `category` (optional): Filter by category (e.g., "shirts", "trousers", "jackets")
- `featured` (optional): Set to `"true"` to show only featured products
- `search` (optional): Search by product name or tags
- `page` (optional, default: 1): Page number for pagination
- `limit` (optional, default: 12): Number of products per page

**Example Request:**
```
GET /products?category=shirts&featured=true&page=1&limit=10
```

**Response (Success):**
```json
{
  "success": true,
  "products": [
    {
      "_id": "product_id_123",
      "name": "Premium Cotton Shirt",
      "category": "shirts",
      "basePrice": 3500,
      "featured": true,
      "rating": 4.5,
      "primaryImage": "shirt-image-url",
      "description": "High-quality customizable cotton shirt"
    }
  ],
  "pagination": {
    "total": 45,
    "page": 1,
    "pages": 5,
    "limit": 10
  }
}
```

---

### 2. Get Single Product Details

**Endpoint:** `GET /products/:id`

**What it does:** Retrieves detailed information about a specific product

**URL Parameters:**
- `id` (required): The product ID

**Example Request:**
```
GET /products/product_id_123
```

**Response (Success):**
```json
{
  "success": true,
  "product": {
    "_id": "product_id_123",
    "name": "Premium Cotton Shirt",
    "category": "shirts",
    "basePrice": 3500,
    "description": "High-quality customizable cotton shirt",
    "fabrics": [
      {
        "name": "Cotton",
        "surcharge": 0
      },
      {
        "name": "Silk Blend",
        "surcharge": 500
      }
    ],
    "colors": ["White", "Blue", "Black", "Red"],
    "rating": 4.5,
    "featured": true,
    "isActive": true
  }
}
```

---

### 3. Create Product (Admin Only)

**Endpoint:** `POST /products`

**What it does:** Creates a new product (admin only)

**Authentication:** ✅ Required (Admin role)

**Request Body:**
```json
{
  "name": "Premium Cotton Shirt",
  "category": "shirts",
  "description": "High-quality customizable cotton shirt",
  "basePrice": 3500,
  "fabrics": [
    {"name": "Cotton", "surcharge": 0},
    {"name": "Silk Blend", "surcharge": 500}
  ],
  "colors": ["White", "Blue", "Black"],
  "featured": true
}
```

**Response (Success):** Returns the created product object

---

### 4. Update Product (Admin Only)

**Endpoint:** `PUT /products/:id`

**What it does:** Updates an existing product (admin only)

**Authentication:** ✅ Required (Admin role)

**URL Parameters:**
- `id` (required): The product ID

**Request Body:** Any fields you want to update

---

## 🛒 Orders APIs

These APIs manage custom orders for tailored clothing.

### 1. Create Order

**Endpoint:** `POST /orders`

**What it does:** Creates a new order for custom-tailored clothing

**Authentication:** ✅ Required (Customer role)

**Request Body:**
```json
{
  "productId": "product_id_123",
  "selectedFabric": "Cotton",
  "selectedColor": "Blue",
  "fitPreference": "regular",
  "deliveryAddress": "123 Main Street, New York, NY 10001"
}
```

**Important Notes:**
- User must have saved measurements before creating an order
- Price is calculated as: `basePrice + fabric surcharge`
- Estimated delivery is 10 days from order creation

**Response (Success):**
```json
{
  "success": true,
  "order": {
    "_id": "order_id_789",
    "userId": "user_id_123",
    "productId": {
      "_id": "product_id_123",
      "name": "Premium Cotton Shirt",
      "primaryImage": "image-url"
    },
    "status": "pending",
    "basePrice": 3500,
    "fabricSurcharge": 0,
    "totalPrice": 3500,
    "selectedFabric": "Cotton",
    "selectedColor": "Blue",
    "measurements": {
      "chest": 95,
      "waist": 82,
      "shoulder": 42,
      "inseam": 82,
      "sleeve": 60
    },
    "estimatedDelivery": "2024-01-25T10:30:00Z",
    "deliveryAddress": "123 Main Street, New York, NY 10001",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

---

### 2. Get My Orders

**Endpoint:** `GET /orders/my`

**What it does:** Retrieves all orders created by the logged-in customer

**Authentication:** ✅ Required (Customer role)

**Response (Success):**
```json
{
  "success": true,
  "orders": [
    {
      "_id": "order_id_789",
      "status": "confirmed",
      "totalPrice": 3500,
      "estimatedDelivery": "2024-01-25T10:30:00Z",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

### 3. Get Single Order Details

**Endpoint:** `GET /orders/:id`

**What it does:** Retrieves detailed information about a specific order with tracking info

**Authentication:** ✅ Required

**URL Parameters:**
- `id` (required): The order ID

**Response (Success):**
```json
{
  "success": true,
  "order": {
    "_id": "order_id_789",
    "status": "stitching",
    "totalPrice": 3500,
    "measurements": {
      "chest": 95,
      "waist": 82
    },
    "statusHistory": [
      {
        "status": "confirmed",
        "timestamp": "2024-01-15T10:35:00Z",
        "note": "Order confirmed by tailors"
      },
      {
        "status": "pattern",
        "timestamp": "2024-01-16T09:00:00Z",
        "note": "Pattern prepared"
      },
      {
        "status": "stitching",
        "timestamp": "2024-01-17T08:00:00Z",
        "note": "Stitching in progress"
      }
    ],
    "estimatedDelivery": "2024-01-25T10:30:00Z"
  }
}
```

---

### 4. Update Order Status (Tailors/Admin Only)

**Endpoint:** `PUT /orders/:id/status`

**What it does:** Updates the status of an order (Tailors tracks progress)

**Authentication:** ✅ Required (Tailors or Admin role)

**URL Parameters:**
- `id` (required): The order ID

**Request Body:**
```json
{
  "status": "stitching",
  "note": "Currently stitching the garment"
}
```

**Valid Statuses:**
- `"confirmed"` - Order confirmed by tailors
- `"pattern"` - Pattern is being prepared
- `"stitching"` - Garment is being stitched
- `"qc"` - Quality check in progress
- `"shipped"` - Order shipped
- `"delivered"` - Order delivered

---

### 5. Accept/Reject Order (Tailors Only)

**Endpoint:** `PUT /orders/:id/accept`

**What it does:** Tailors accepts or rejects an order

**Authentication:** ✅ Required (Tailors role)

**Request Body:**
```json
{
  "accepted": true  // true to accept, false to reject
}
```

---

### 6. Get Tailors's Orders

**Endpoint:** `GET /orders/tailors`

**What it does:** Retrieves all orders assigned to the logged-in tailors

**Authentication:** ✅ Required (Tailors role)

**Response (Success):**
```json
{
  "success": true,
  "orders": [
    {
      "_id": "order_id_789",
      "userId": {
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "9876543210"
      },
      "productId": {
        "name": "Premium Cotton Shirt"
      },
      "status": "confirmed",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

## 💬 Feedback APIs

These APIs allow customers to provide fit feedback for continuous improvement.

### 1. Submit Feedback

**Endpoint:** `POST /feedback`

**What it does:** Submits fit feedback for a completed order. This helps improve future measurements.

**Authentication:** ✅ Required (Customer role)

**Request Body:**
```json
{
  "orderId": "order_id_789",
  "fitRating": "tight",  // "tight", "perfect", "loose"
  "comment": "The shirt was a bit tight around the shoulders",
  "specificIssues": ["shoulders", "chest"]  // optional
}
```

**How Feedback Works:**
- **tight**: Measurements will be increased for next order
- **perfect**: Measurements remain the same
- **loose**: Measurements will be decreased for next order

**Response (Success):**
```json
{
  "success": true,
  "feedback": {
    "_id": "feedback_id_456",
    "orderId": "order_id_789",
    "userId": "user_id_123",
    "fitRating": "tight",
    "comment": "The shirt was a bit tight around the shoulders",
    "adjustmentDelta": 1.5,
    "adjustmentApplied": true,
    "createdAt": "2024-01-26T14:30:00Z"
  }
}
```

---

### 2. Get My Feedback History

**Endpoint:** `GET /feedback/my`

**What it does:** Retrieves all feedback submitted by the logged-in user

**Authentication:** ✅ Required (Customer role)

**Response (Success):**
```json
{
  "success": true,
  "feedbacks": [
    {
      "_id": "feedback_id_456",
      "orderId": {
        "status": "delivered"
      },
      "fitRating": "tight",
      "comment": "The shirt was a bit tight",
      "createdAt": "2024-01-26T14:30:00Z"
    }
  ]
}
```

---

## 👨‍💼 Admin APIs

These APIs provide admin dashboard and platform management features.

### 1. Get Platform Statistics

**Endpoint:** `GET /admin/stats`

**What it does:** Retrieves overall platform statistics

**Authentication:** ✅ Required (Admin role)

**Response (Success):**
```json
{
  "success": true,
  "stats": {
    "totalUsers": 150,
    "totalOrders": 325,
    "totalTailors": 12,
    "revenueThisMonth": 125000,
    "averageOrderValue": 3500
  }
}
```

---

### 2. Get All Orders

**Endpoint:** `GET /admin/orders`

**What it does:** Retrieves all orders on the platform (for monitoring)

**Authentication:** ✅ Required (Admin role)

**Response (Success):**
```json
{
  "success": true,
  "orders": [
    {
      "_id": "order_id_789",
      "userId": "user_id_123",
      "totalPrice": 3500,
      "status": "delivered",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

### 3. Get All Tailors

**Endpoint:** `GET /admin/tailors`

**What it does:** Retrieves a list of all tailors on the platform

**Authentication:** ✅ Required (Admin role)

**Response (Success):**
```json
{
  "success": true,
  "tailors": [
    {
      "_id": "tailors_id_123",
      "shopName": "John's Tailor Shop",
      "userId": "user_id_456",
      "isVerified": true,
      "totalCompleted": 42,
      "totalRejected": 2,
      "createdAt": "2024-01-01T08:00:00Z"
    }
  ]
}
```

---

### 4. Verify Tailors

**Endpoint:** `PUT /admin/tailors/:tailorsId/verify`

**What it does:** Verifies or blocks a tailors account

**Authentication:** ✅ Required (Admin role)

**URL Parameters:**
- `tailorsId` (required): The tailors ID

**Request Body:**
```json
{
  "isVerified": true
}
```

---

---

## ⚠️ Error Handling

All errors follow this format:

```json
{
  "success": false,
  "message": "Error description"
}
```

### Common HTTP Status Codes

| Status Code | Meaning |
|------------|---------|
| 200 | Success |
| 201 | Successfully created |
| 400 | Bad request (invalid data) |
| 401 | Unauthorized (missing/invalid token) |
| 403 | Forbidden (don't have permission) |
| 404 | Not found (resource doesn't exist) |
| 500 | Server error |

### Example Error Responses

**Missing Required Field:**
```json
{
  "success": false,
  "message": "Name, email, and password are required"
}
```

**Unauthorized Access:**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

**Permission Denied:**
```json
{
  "success": false,
  "message": "Not authorized"
}
```

---

## 🚀 Quick Start Examples

### Example 1: Register and Create an Order

```bash
# 1. Register a new user
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice",
    "email": "alice@example.com",
    "password": "pass123",
    "role": "user"
  }'

# Save the token from response

# 2. Calculate measurement preview (optional)
curl -X POST http://localhost:5001/api/measurements/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "height": 170,
    "weight": 65,
    "bodyType": "regular",
    "fitPreference": "regular"
  }'

# 3. Save measurements
curl -X POST http://localhost:5001/api/measurements \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "height": 170,
    "weight": 65,
    "bodyType": "regular",
    "fitPreference": "regular"
  }'

# 4. Get products
curl -X GET "http://localhost:5001/api/products?category=shirts"

# 5. Create an order
curl -X POST http://localhost:5001/api/orders \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "PRODUCT_ID",
    "selectedFabric": "Cotton",
    "selectedColor": "Blue",
    "fitPreference": "regular",
    "deliveryAddress": "123 Main St"
  }'
```

---

## 📞 Need Help?

If you have questions about the APIs:
1. Check the error message in the response
2. Ensure you're using the correct HTTP method (GET, POST, PUT, etc.)
3. Verify your JWT token is included in the Authorization header
4. Make sure all required fields are provided in the request body

Happy coding! 🎉