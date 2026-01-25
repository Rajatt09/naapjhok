# Naapjhok Frontend

## Project Structure

```
frontend/src/
├── components/      # Reusable UI components
├── context/         # React Context providers (Auth, Cart)
├── pages/           # Page components
│   └── admin/       # Admin pages
├── utils/           # Utility functions
│   ├── api.js       # Axios instance with interceptors
│   ├── constants.js # Application constants
│   ├── validators.js # Validation functions
│   └── helpers.js   # Helper functions
├── assets/          # Static assets (images, videos)
├── App.jsx          # Main app component with routing
└── main.jsx         # Application entry point
```

## Key Features

- **React Router**: Client-side routing
- **Context API**: State management for auth and cart
- **Axios Interceptors**: Automatic token refresh
- **Modular Utilities**: Organized helper functions
- **Clean Code**: No console.logs, proper error handling

## Utilities

### `api.js`
- Axios instance with base URL
- Request interceptor for adding auth tokens
- Response interceptor for automatic token refresh

### `constants.js`
- API endpoint definitions
- Order status constants
- User role constants

### `validators.js`
- Email validation
- Phone validation
- Form validation helpers

### `helpers.js`
- Price formatting
- Date formatting
- String utilities

## Running the Application

```bash
# Development
npm run dev

# Build
npm run build

# Preview production build
npm run preview
```
