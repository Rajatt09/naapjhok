# Naapjhok Backend

## 📚 Documentation

- **[API Documentation](./API_DOCUMENTATION.md)** - Complete API endpoint reference with request/response examples

## Project Structure

```
backend/
├── config/           # Configuration files (Cloudinary, etc.)
├── constants/         # Application constants (status codes, order status)
├── controllers/       # HTTP request handlers (thin layer)
├── middlewares/      # Express middlewares (auth, admin, upload)
├── models/          # Mongoose models
├── routes/          # API route definitions
├── services/        # Business logic layer
├── utils/           # Utility functions (error handling, response helpers, etc.)
├── scripts/         # Utility scripts (createAdmin, etc.)
└── server.js        # Application entry point
```

## Architecture

### Layers

1. **Routes** (`routes/`) - Define API endpoints and apply middlewares
2. **Controllers** (`controllers/`) - Handle HTTP requests/responses, call services
3. **Services** (`services/`) - Contain business logic, interact with models
4. **Models** (`models/`) - Mongoose schemas and models
5. **Utils** (`utils/`) - Reusable utilities (error handling, response formatting, etc.)

### Key Features

- **Modular Structure**: Clear separation of concerns
- **Service Layer**: Business logic separated from HTTP handling
- **Centralized Error Handling**: Global error handler middleware
- **Consistent Responses**: Standardized response format
- **Async Error Handling**: Wrapper for async route handlers

## API Response Format

### Success Response
```json
{
  "status": "success",
  "message": "Optional message",
  "data": { ... },
  "results": 10
}
```

### Error Response
```json
{
  "status": "fail",
  "message": "Error message",
  "errors": ["Optional array of errors"]
}
```

## Environment Variables

```env
MONGO_URI=mongodb://...
JWT_SECRET=your-secret-key
PORT=5000
NODE_ENV=development|production
FRONTEND_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

## Running the Application

```bash
# Development
npm run dev

# Production
npm start
```

## Services

- `authService` - Authentication and authorization
- `productService` - Product management
- `cartService` - Shopping cart operations
- `orderService` - Order processing
- `userService` - User profile management
- `adminService` - Admin operations
