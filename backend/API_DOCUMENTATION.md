# Naapjhok Backend API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

The API uses **JWT (JSON Web Tokens)** for authentication with a refresh token mechanism.

### Authentication Flow
1. User logs in → Receives `accessToken` (15 min expiry) and `refreshToken` (7 days, stored in HTTP-only cookie)
2. Access token is sent in `Authorization` header: `Bearer <accessToken>`
3. When access token expires, use `/auth/refresh-token` to get a new access token
4. Refresh token is automatically sent via HTTP-only cookie

### Headers
```javascript
{
  "Authorization": "Bearer <accessToken>",
  "Content-Type": "application/json"
}
```

---

## Response Format

### Success Response
```json
{
  "status": "success",
  "message": "Optional message",
  "data": { ... },
  "results": 10,
  "accessToken": "jwt_token_here" // Only for auth endpoints
}
```

### Error Response
```json
{
  "status": "fail",
  "message": "Error message",
  "errors": ["Optional array of validation errors"]
}
```

---

## API Endpoints

## 🔐 Authentication (`/api/auth`)

### 1. Sign Up
**POST** `/api/auth/signup`

Create a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "1234567890",
  "gender": "Male" // "Male" | "Female" | "Other"
}
```

**Response:** `201 Created`
```json
{
  "status": "success",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "1234567890",
      "gender": "Male",
      "role": "user",
      "profiles": [],
      "createdAt": "2026-01-25T10:00:00.000Z"
    }
  }
}
```

---

### 2. Login
**POST** `/api/auth/login`

Authenticate user and receive tokens.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`
```json
{
  "status": "success",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "user": { ... }
  }
}
```

**Sets HTTP-only cookie:** `refreshToken`

---

### 3. Refresh Token
**POST** `/api/auth/refresh-token`

Get a new access token using refresh token.

**Request:** No body required (refresh token sent via cookie)

**Response:** `200 OK`
```json
{
  "status": "success",
  "accessToken": "new_access_token",
  "data": {
    "user": { ... }
  }
}
```

---

### 4. Logout
**POST** `/api/auth/logout`

Logout user and revoke refresh token.

**Request:** No body required

**Response:** `200 OK`
```json
{
  "status": "success",
  "message": "Logged out successfully"
}
```

**Clears HTTP-only cookie:** `refreshToken`

---

### 5. Get Current User
**GET** `/api/auth/me`

**Authentication:** Required

Get currently authenticated user details.

**Response:** `200 OK`
```json
{
  "status": "success",
  "data": {
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "1234567890",
      "role": "user",
      "profiles": [ ... ]
    }
  }
}
```

---

## 👤 User Profiles (`/api/user`)

**Authentication:** Required for all endpoints

### 1. Get All Profiles
**GET** `/api/user/profiles`

Get all profiles (main user + sub-profiles) for the authenticated user.

**Response:** `200 OK`
```json
{
  "status": "success",
  "data": {
    "profiles": [
      {
        "_id": "profile_id",
        "name": "John Doe",
        "phone": "1234567890",
        "email": "john@example.com",
        "location": "Mumbai",
        "measurements": "..."
      }
    ],
    "user": {
      "name": "John Doe",
      "phone": "1234567890",
      "email": "john@example.com",
      "location": "Mumbai"
    }
  }
}
```

---

### 2. Add Profile
**POST** `/api/user/profiles`

Create a new sub-profile for the authenticated user.

**Request Body:**
```json
{
  "name": "Jane Doe",
  "phone": "9876543210",
  "email": "jane@example.com",
  "location": "Delhi",
  "measurements": "Chest: 38, Waist: 32"
}
```

**Response:** `201 Created`
```json
{
  "status": "success",
  "data": {
    "profile": {
      "_id": "new_profile_id",
      "name": "Jane Doe",
      "phone": "9876543210",
      ...
    },
    "profiles": [ ... ]
  }
}
```

---

### 3. Update Profile
**PUT** `/api/user/profiles/:id`

Update a profile. Use `"me"` as `:id` to update main user profile.

**URL Parameters:**
- `id`: Profile ID or `"me"` for main user

**Request Body:**
```json
{
  "name": "Updated Name",
  "phone": "9999999999",
  "email": "updated@example.com",
  "location": "Updated Location"
}
```

**Response:** `200 OK`
```json
{
  "status": "success",
  "data": {
    "profile": { ... },
    "profiles": [ ... ]
  }
}
```

---

### 4. Delete Profile
**DELETE** `/api/user/profiles/:id`

Delete a profile and all associated orders.

**URL Parameters:**
- `id`: Profile ID (cannot be `"me"`)

**Response:** `200 OK`
```json
{
  "status": "success",
  "message": "Profile and all associated orders deleted.",
  "data": {
    "profiles": [ ... ]
  }
}
```

**Note:** This endpoint also deletes all orders associated with the profile.

---

## 🛍️ Products (`/api/products`)

### 1. Get All Products
**GET** `/api/products`

Get all products (public endpoint).

**Query Parameters:**
- `category`: Filter by category (e.g., `?category=Shirt`)
- `gender`: Filter by gender (e.g., `?gender=Male`)

**Response:** `200 OK`
```json
{
  "status": "success",
  "results": 10,
  "data": {
    "products": [
      {
        "_id": "product_id",
        "name": "Men's Formal Shirt",
        "description": "Premium cotton shirt",
        "category": "Shirt",
        "gender": "Male",
        "basePrice": 1000,
        "fabricPrice": 500,
        "image": "uploads/reference-images/image.jpg",
        "referenceImage": "http://localhost:5000/uploads/reference-images/image.jpg",
        "createdAt": "2026-01-25T10:00:00.000Z"
      }
    ]
  }
}
```

---

### 2. Get Single Product
**GET** `/api/products/:id`

Get a single product by ID (public endpoint).

**URL Parameters:**
- `id`: Product ID

**Response:** `200 OK`
```json
{
  "status": "success",
  "data": {
    "product": { ... }
  }
}
```

---

### 3. Create Product
**POST** `/api/products`

**Authentication:** Required (Admin only)

Create a new product.

**Request:** `multipart/form-data`
```
name: "Men's Formal Shirt"
description: "Premium cotton shirt"
category: "Shirt" // "Shirt" | "Pant" | "Trouser" | "Blazer" | "Suit" | "Kurta" | "Sherwani" | "Other"
gender: "Male" // "Male" | "Female" | "Unisex"
basePrice: 1000
fabricPrice: 500
referenceImage: <file> // Optional image file
```

**Response:** `201 Created`
```json
{
  "status": "success",
  "data": {
    "product": { ... }
  }
}
```

---

### 4. Update Product
**PUT** `/api/products/:id`

**Authentication:** Required (Admin only)

Update a product.

**URL Parameters:**
- `id`: Product ID

**Request:** `multipart/form-data` (same as create, all fields optional)

**Response:** `200 OK`
```json
{
  "status": "success",
  "data": {
    "product": { ... }
  }
}
```

---

### 5. Delete Product
**DELETE** `/api/products/:id`

**Authentication:** Required (Admin only)

Delete a product.

**URL Parameters:**
- `id`: Product ID

**Response:** `204 No Content`
```json
{
  "status": "success",
  "data": null
}
```

---

## 🛒 Cart (`/api/cart`)

**Authentication:** Required for all endpoints

### 1. Get Cart
**GET** `/api/cart`

Get the current user's cart.

**Response:** `200 OK`
```json
{
  "status": "success",
  "data": {
    "cart": {
      "_id": "cart_id",
      "user": "user_id",
      "items": [
        {
          "_id": "item_id",
          "product": {
            "id": "product_id",
            "name": "Men's Formal Shirt",
            "image": "image.jpg",
            "category": "Shirt",
            "basePrice": 1000,
            "fabricPrice": 500
          },
          "withFabric": true,
          "profileId": "profile_id",
          "quantity": 1,
          "customization": {
            "fabricType": "Cotton",
            "color": "Blue",
            "description": "Custom description",
            "referenceImage": "url_to_image"
          }
        }
      ],
      "updatedAt": "2026-01-25T10:00:00.000Z"
    }
  }
}
```

---

### 2. Add to Cart
**POST** `/api/cart`

Add an item to the cart.

**Request:** `multipart/form-data`
```
product: JSON.stringify({
  id: "product_id",
  name: "Product Name",
  image: "image.jpg",
  category: "Shirt",
  basePrice: 1000,
  fabricPrice: 500
})
withFabric: true // or false
profileId: "profile_id" // or "me"
customization: JSON.stringify({
  fabricType: "Cotton",
  color: "Blue",
  description: "Custom description"
}) // Optional
referenceImage: <file> // Optional image file
```

**Response:** `200 OK`
```json
{
  "status": "success",
  "message": "Item added to cart",
  "data": {
    "cart": { ... }
  }
}
```

---

### 3. Remove from Cart
**DELETE** `/api/cart/:itemId`

Remove an item from the cart.

**URL Parameters:**
- `itemId`: Cart item ID

**Response:** `200 OK`
```json
{
  "status": "success",
  "data": {
    "cart": { ... }
  }
}
```

---

## 📦 Orders (`/api/orders`)

**Authentication:** Required for all endpoints

### 1. Create Order
**POST** `/api/orders`

Create an order from cart items.

**Request Body:**
```json
{
  "items": [
    {
      "product": {
        "id": "product_id",
        "name": "Product Name",
        "image": "image.jpg"
      },
      "quantity": 1,
      "withFabric": true,
      "price": 1500,
      "customization": "JSON string or text"
    }
  ],
  "totalAmount": 1500,
  "profileId": "profile_id", // or "me"
  "appointment": {
    "date": "2026-02-01T10:00:00.000Z",
    "timeSlot": "10:00 AM - 12:00 PM",
    "address": {
      "street": "123 Main St",
      "city": "Mumbai",
      "state": "Maharashtra",
      "zip": "400001"
    },
    "contactName": "John Doe",
    "contactPhone": "1234567890"
  }
}
```

**Response:** `201 Created`
```json
{
  "status": "success",
  "data": {
    "order": {
      "_id": "order_id",
      "user": "user_id",
      "profileId": "profile_id",
      "items": [ ... ],
      "totalAmount": 1500,
      "status": "Pending",
      "appointment": { ... },
      "createdAt": "2026-01-25T10:00:00.000Z"
    }
  }
}
```

**Note:** This endpoint automatically removes ordered items from the cart.

---

### 2. Get My Orders
**GET** `/api/orders`

Get all orders for the authenticated user.

**Response:** `200 OK`
```json
{
  "status": "success",
  "results": 5,
  "data": {
    "orders": [
      {
        "_id": "order_id",
        "user": "user_id",
        "profileId": "profile_id",
        "items": [ ... ],
        "totalAmount": 1500,
        "status": "Pending", // "Pending" | "Confirmed" | "Master Assigned" | "Measurements Taken" | "In Stitching" | "Trial Ready" | "Delivered" | "Cancelled"
        "appointment": { ... },
        "createdAt": "2026-01-25T10:00:00.000Z"
      }
    ]
  }
}
```

---

## 👨‍💼 Admin (`/api/admin`)

**Authentication:** Required (Admin only)

### 1. Get Dashboard Stats
**GET** `/api/admin/stats`

Get dashboard statistics.

**Response:** `200 OK`
```json
{
  "status": "success",
  "data": {
    "stats": {
      "totalUsers": 150,
      "totalOrders": 500,
      "totalProducts": 25,
      "totalRevenue": 500000
    },
    "recentOrders": [
      {
        "_id": "order_id",
        "user": {
          "_id": "user_id",
          "name": "John Doe",
          "email": "john@example.com"
        },
        "totalAmount": 1500,
        "status": "Pending",
        "createdAt": "2026-01-25T10:00:00.000Z"
      }
    ]
  }
}
```

---

### 2. Get All Users
**GET** `/api/admin/users`

Get all users (excluding admins).

**Response:** `200 OK`
```json
{
  "status": "success",
  "results": 150,
  "data": {
    "users": [
      {
        "_id": "user_id",
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "1234567890",
        "role": "user",
        "gender": "Male",
        "profiles": [ ... ],
        "createdAt": "2026-01-25T10:00:00.000Z"
      }
    ]
  }
}
```

---

### 3. Get User Details
**GET** `/api/admin/users/:id`

Get detailed information about a specific user including their orders.

**URL Parameters:**
- `id`: User ID

**Response:** `200 OK`
```json
{
  "status": "success",
  "data": {
    "user": { ... },
    "orders": [ ... ]
  }
}
```

---

### 4. Delete User
**DELETE** `/api/admin/users/:id`

Delete a user and all their associated orders.

**URL Parameters:**
- `id`: User ID

**Response:** `204 No Content`
```json
{
  "status": "success",
  "data": null
}
```

---

### 5. Get All Orders
**GET** `/api/admin/orders`

Get all orders from all users.

**Response:** `200 OK`
```json
{
  "status": "success",
  "results": 500,
  "data": {
    "orders": [
      {
        "_id": "order_id",
        "user": {
          "_id": "user_id",
          "name": "John Doe",
          "email": "john@example.com",
          "phone": "1234567890"
        },
        "profileId": "profile_id",
        "items": [ ... ],
        "totalAmount": 1500,
        "status": "Pending",
        "appointment": { ... },
        "createdAt": "2026-01-25T10:00:00.000Z"
      }
    ]
  }
}
```

---

## 📁 Static Files

### Uploaded Images
**GET** `/uploads/reference-images/:filename`

Access uploaded reference images.

**Example:**
```
http://localhost:5000/uploads/reference-images/ref-1234567890.jpg
```

---

## HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 204 | No Content - Resource deleted successfully |
| 400 | Bad Request - Invalid input data |
| 401 | Unauthorized - Authentication required or invalid token |
| 403 | Forbidden - Access denied (e.g., admin only) |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error - Server error |

---

## Error Handling

All errors follow a consistent format:

```json
{
  "status": "fail",
  "message": "Error message here",
  "errors": ["Optional array of validation errors"]
}
```

### Common Error Messages

- `"You are not logged in!"` - Missing or invalid authentication token
- `"Access denied. Admin only."` - User doesn't have admin privileges
- `"User not found"` - Requested user doesn't exist
- `"Product not found"` - Requested product doesn't exist
- `"Profile not found."` - Requested profile doesn't exist
- `"Cart is empty. Add items before booking."` - Cannot create order with empty cart
- `"A profile with this name already exists."` - Duplicate profile name

---

## Authentication Flow Example

```javascript
// 1. Login
const loginResponse = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include', // Important for cookies
  body: JSON.stringify({ email: 'user@example.com', password: 'password' })
});
const { accessToken, data } = await loginResponse.json();

// 2. Use access token for authenticated requests
const profileResponse = await fetch('/api/user/profiles', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  },
  credentials: 'include'
});

// 3. When access token expires, refresh it
const refreshResponse = await fetch('/api/auth/refresh-token', {
  method: 'POST',
  credentials: 'include' // Sends refresh token cookie automatically
});
const { accessToken: newAccessToken } = await refreshResponse.json();
```

---

## Notes

1. **File Uploads**: Use `multipart/form-data` for endpoints that accept file uploads (product images, cart reference images).

2. **Profile ID**: Use `"me"` as profile ID to reference the main user profile.

3. **Order Status**: Orders can have the following statuses:
   - `Pending`
   - `Confirmed`
   - `Master Assigned`
   - `Measurements Taken`
   - `In Stitching`
   - `Trial Ready`
   - `Delivered`
   - `Cancelled`

4. **Product Categories**: Valid categories are:
   - `Shirt`
   - `Pant`
   - `Trouser`
   - `Blazer`
   - `Suit`
   - `Kurta`
   - `Sherwani`
   - `Other`

5. **CORS**: The API is configured to accept requests from `http://localhost:5173` (or `FRONTEND_URL` env variable) with credentials.

---

## Environment Variables

Required environment variables:

```env
MONGO_URI=mongodb://localhost:27017/naapjhok
JWT_SECRET=your-secret-key-here
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

---
