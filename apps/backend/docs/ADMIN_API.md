# Admin API Documentation

## Overview
The Admin API provides administrative endpoints for managing orders, vendors, and viewing dashboard statistics. All Admin endpoints are protected and require authentication with admin privileges.

**Base URL:** `/api/admin`

**Authentication:** All endpoints require valid JWT token with `admin` role  
**Content-Type:** `application/json`

---

## Authentication & Authorization

All Admin API endpoints are protected by two middleware layers:

1. **`protect`** - Verifies JWT token and authenticates the user
2. **`authorize('admin')`** - Validates that the authenticated user has admin role

### Example Request Header
```
Authorization: Bearer <JWT_TOKEN>
```

---

## API Endpoints

### 1. Get Dashboard Statistics

Retrieve comprehensive dashboard statistics including order counts, user counts, vendor counts, pending orders, delivered orders, and total revenue.

**Endpoint:** `GET /api/admin/stats`

**Access:** Private/Admin

**Request:**
```bash
curl -X GET http://localhost:PORT/api/admin/stats \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

**Response (Success - 200):**
```json
{
  "success": true,
  "stats": {
    "totalOrders": 45,
    "totalUsers": 120,
    "totalVendors": 15,
    "pendingOrders": 12,
    "deliveredOrders": 28,
    "totalRevenue": 45320.50
  }
}
```

**Statistics Breakdown:**
- **totalOrders**: Total count of all orders in the system
- **totalUsers**: Count of users with 'user' role
- **totalVendors**: Count of users with 'vendor' role
- **pendingOrders**: Orders in progress (status: confirmed, pattern, stitching, qc)
- **deliveredOrders**: Completed orders (status: delivered)
- **totalRevenue**: Total revenue from delivered orders

**Error Response (401):**
```json
{
  "success": false,
  "message": "Not authorized to access this resource"
}
```

---

### 2. Get All Orders

Retrieve all orders with optional filtering by status and pagination support.

**Endpoint:** `GET /api/admin/orders`

**Access:** Private/Admin

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| status | string | No | Filter by order status (confirmed, pattern, stitching, qc, shipped, delivered) |
| page | integer | No | Page number (default: 1) |
| limit | integer | No | Orders per page (default: 20) |

**Request:**
```bash
# Get all orders (page 1, 20 per page)
curl -X GET http://localhost:PORT/api/admin/orders \
  -H "Authorization: Bearer <JWT_TOKEN>"

# Get delivered orders on page 2
curl -X GET "http://localhost:PORT/api/admin/orders?status=delivered&page=2&limit=20" \
  -H "Authorization: Bearer <JWT_TOKEN>"

# Get pending orders (confirmed, pattern, stitching, qc)
curl -X GET "http://localhost:PORT/api/admin/orders?status=confirmed" \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

**Response (Success - 200):**
```json
{
  "success": true,
  "orders": [
    {
      "_id": "6731a7b8c0a1d2e3f4g5h6i7",
      "orderId": "FC-TIMESTAMP-RANDOM",
      "userId": {
        "_id": "user_id_123",
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "9876543210"
      },
      "vendorId": {
        "_id": "vendor_id_123",
        "name": "Premium Tailors",
        "email": "vendor@example.com"
      },
      "productId": {
        "_id": "product_id_123",
        "name": "Custom Shirt",
        "category": "shirt",
        "primaryImage": "image_url"
      },
      "measurements": {
        "chest": 38,
        "waist": 32,
        "shoulder": 18,
        "hip": 35,
        "inseam": 30,
        "sleeve": 33,
        "neck": 15
      },
      "selectedFabric": "Cotton Premium",
      "selectedColor": "Blue",
      "fitPreference": "regular",
      "basePrice": 1200,
      "fabricSurcharge": 150,
      "totalPrice": 1350,
      "status": "stitching",
      "statusHistory": [
        {
          "status": "confirmed",
          "timestamp": "2024-06-01T10:00:00Z",
          "note": "Order confirmed"
        }
      ],
      "vendorAccepted": true,
      "estimatedDelivery": "2024-06-15T00:00:00Z",
      "deliveryAddress": {
        "street": "123 Main St",
        "city": "Bangalore",
        "state": "Karnataka",
        "pincode": "560001"
      },
      "createdAt": "2024-06-01T10:00:00Z",
      "updatedAt": "2024-06-05T14:30:00Z"
    }
  ],
  "pagination": {
    "total": 45,
    "page": 1,
    "pages": 3
  }
}
```

**Response Fields:**
- **orders**: Array of order objects with populated user, vendor, and product details
- **pagination.total**: Total number of orders matching the filter
- **pagination.page**: Current page number
- **pagination.pages**: Total number of pages

**Available Order Statuses:**
- `confirmed` - Order confirmed by user
- `pattern` - Pattern being created
- `stitching` - Garment being stitched
- `qc` - Quality check in progress
- `shipped` - Order shipped
- `delivered` - Order delivered

---

### 3. Get All Vendors

Retrieve all vendors sorted by rating in descending order with user details.

**Endpoint:** `GET /api/admin/vendors`

**Access:** Private/Admin

**Query Parameters:** None

**Request:**
```bash
curl -X GET http://localhost:PORT/api/admin/vendors \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

**Response (Success - 200):**
```json
{
  "success": true,
  "vendors": [
    {
      "_id": "vendor_obj_id_123",
      "userId": {
        "_id": "user_id_456",
        "name": "Rajesh Kumar",
        "email": "rajesh@tailors.com",
        "phone": "9876543210"
      },
      "shopName": "Premium Tailors",
      "specializations": ["shirt", "trousers", "suit"],
      "location": "Bangalore",
      "phone": "080-98765432",
      "assignedOrders": ["order_id_1", "order_id_2"],
      "totalCompleted": 45,
      "totalRejected": 2,
      "rating": 4.8,
      "isVerified": true,
      "isActive": true,
      "createdAt": "2024-01-15T08:00:00Z",
      "updatedAt": "2024-06-05T12:30:00Z"
    }
  ]
}
```

**Response Fields:**
- **vendors**: Array of vendor objects sorted by rating (highest first)
- **shopName**: Business name of the vendor
- **specializations**: Array of clothing types the vendor specializes in
- **totalCompleted**: Number of successfully completed orders
- **totalRejected**: Number of rejected/cancelled orders
- **rating**: Vendor rating (0-5)
- **isVerified**: Admin verification status
- **isActive**: Current active status

---

### 4. Verify/Unverify Vendor

Update the verification status of a vendor.

**Endpoint:** `PUT /api/admin/vendors/:vendorId/verify`

**Access:** Private/Admin

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| vendorId | string | Yes | MongoDB ObjectId of the vendor |

**Request Body:**
```json
{
  "isVerified": true
}
```

**Request:**
```bash
curl -X PUT http://localhost:PORT/api/admin/vendors/6731a7b8c0a1d2e3f4g5h6i7/verify \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"isVerified": true}'
```

**Response (Success - 200):**
```json
{
  "success": true,
  "vendor": {
    "_id": "6731a7b8c0a1d2e3f4g5h6i7",
    "userId": {
      "_id": "user_id_456",
      "name": "Rajesh Kumar",
      "email": "rajesh@tailors.com",
      "phone": "9876543210"
    },
    "shopName": "Premium Tailors",
    "specializations": ["shirt", "trousers", "suit"],
    "location": "Bangalore",
    "phone": "080-98765432",
    "totalCompleted": 45,
    "totalRejected": 2,
    "rating": 4.8,
    "isVerified": true,
    "isActive": true,
    "createdAt": "2024-01-15T08:00:00Z",
    "updatedAt": "2024-06-05T14:35:00Z"
  }
}
```

**Error Responses:**

**Not Found (404):**
```json
{
  "success": false,
  "message": "Vendor not found"
}
```

**Invalid Request (400):**
```json
{
  "success": false,
  "message": "Invalid vendor ID format"
}
```

---

## Error Handling

All Admin API errors follow a consistent format:

**Common Error Responses:**

**Unauthorized (401):**
```json
{
  "success": false,
  "message": "Not authorized to access this resource"
}
```

**Forbidden (403):**
```json
{
  "success": false,
  "message": "Access denied. Admin privileges required."
}
```

**Not Found (404):**
```json
{
  "success": false,
  "message": "Resource not found"
}
```

**Server Error (500):**
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Code Structure

### Controller File
**Location:** `apps/backend/controllers/admin/adminController.js`

The controller contains four main functions:

1. **`getAllOrders()`** - Handles GET /orders with pagination and filtering
2. **`getAllVendors()`** - Handles GET /vendors with sorting
3. **`getStats()`** - Handles GET /stats with aggregated data
4. **`verifyVendor()`** - Handles PUT /vendors/:vendorId/verify

### Route File
**Location:** `apps/backend/routes/admin/admin.js`

Defines all Admin API routes with authentication middleware applied globally.

### Database Models Used

1. **Order Model** (`apps/backend/models/Order.js`)
   - Stores order information with status tracking
   - Includes user, vendor, and product references
   - Tracks measurements and customization details

2. **Vendor Model** (`apps/backend/models/Vendor.js`)
   - Stores vendor/seller information
   - Tracks ratings, verification status, and statistics

3. **User Model** (referenced in controllers)
   - Stores user information
   - Associates with vendor and order data

---

## Usage Examples

### Example 1: Dashboard Setup
```javascript
// Fetch dashboard statistics
async function loadDashboard() {
  try {
    const response = await fetch('http://localhost:5000/api/admin/stats', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    console.log('Dashboard Stats:', data.stats);
  } catch (error) {
    console.error('Failed to load dashboard:', error);
  }
}
```

### Example 2: Vendor Verification Workflow
```javascript
// Verify a vendor
async function verifyVendor(vendorId) {
  try {
    const response = await fetch(
      `http://localhost:5000/api/admin/vendors/${vendorId}/verify`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isVerified: true })
      }
    );
    const data = await response.json();
    if (data.success) {
      console.log('Vendor verified:', data.vendor);
    }
  } catch (error) {
    console.error('Verification failed:', error);
  }
}
```

### Example 3: Order Management with Filters
```javascript
// Get pending orders
async function getPendingOrders() {
  try {
    const response = await fetch(
      'http://localhost:5000/api/admin/orders?status=stitching&page=1&limit=10',
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    const data = await response.json();
    console.log('Pending Orders:', data.orders);
    console.log('Total Orders:', data.pagination.total);
  } catch (error) {
    console.error('Failed to fetch orders:', error);
  }
}
```

---

## Best Practices

1. **Authentication**: Always include valid JWT token in Authorization header
2. **Pagination**: Use page and limit parameters for large datasets
3. **Filtering**: Use status filter to narrow down order results
4. **Error Handling**: Check `success` field in response before processing data
5. **Rate Limiting**: Implement rate limiting on the client side to prevent API overload
6. **Caching**: Cache vendor and statistics data when appropriate to reduce API calls
7. **Validation**: Validate vendor IDs are valid MongoDB ObjectIds before making requests

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| 401 Unauthorized | Verify JWT token is valid and not expired |
| 403 Forbidden | Ensure user has 'admin' role assigned |
| 404 Not Found | Check if vendor ID or resource exists |
| Pagination not working | Verify page and limit are positive integers |
| Filter not applying | Ensure status value matches allowed statuses |

---

## Version History

- **v1.0.0** (2024-06-10) - Initial Admin API documentation created
  - GET /stats - Dashboard statistics
  - GET /orders - List all orders with pagination
  - GET /vendors - List all vendors
  - PUT /vendors/:vendorId/verify - Verify vendors

---

## Related Documentation

- [Authentication Middleware](../middleware/auth.md)
- [Order Model Reference](../models/Order.js)
- [Vendor Model Reference](../models/Vendor.js)
- [Error Handling Guide](../docs/ERROR_HANDLING.md)
