# RBAC Implementation Summary

## Overview
Full Role-Based Access Control (RBAC) has been implemented for both frontend and backend using Clerk authentication.

## Roles

1. **Customer** (default)
   - Browse products
   - Add to cart
   - Purchase items
   - View seller profiles

2. **Seller**
   - All customer permissions
   - Register as seller (via `/sell` page)
   - Post products in any category
   - Manage own products (edit/delete)
   - Access seller dashboard (`/seller/dashboard`)

3. **Admin**
   - All seller permissions
   - Manage all users (view, update roles, delete)
   - Manage all products (view, delete any product)
   - Access admin dashboard (`/admin/dashboard`)

## Backend Implementation

### New Files:
- `backend/src/middleware/roleMiddleware.ts` - Role checking middleware
- `backend/src/controllers/authController.ts` - Seller registration & role management
- `backend/src/controllers/adminController.ts` - Admin operations
- `backend/src/routes/authRoutes.ts` - Authentication routes
- `backend/src/routes/adminRoutes.ts` - Admin routes

### Updated Files:
- `backend/src/db/schema.ts` - Added role enum and product fields
- `backend/src/db/queries.ts` - Added role-based queries
- `backend/src/controllers/productController.ts` - Updated for new product fields
- `backend/src/controllers/userController.ts` - Updated to handle roles
- `backend/src/routes/productRoutes.ts` - Added seller/admin protection
- `backend/src/index.ts` - Added new routes

### API Endpoints:

**Auth:**
- `POST /api/auth/register-seller` - Register as seller (requires auth)
- `GET /api/auth/my-role` - Get current user's role (requires auth)

**Admin (requires admin role):**
- `GET /api/admin/sellers` - Get all sellers
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:userId/role` - Update user role
- `DELETE /api/admin/users/:userId` - Delete user
- `GET /api/admin/products` - Get all products with seller info
- `DELETE /api/admin/products/:id` - Delete any product

**Products (updated):**
- `GET /api/products/tera/:teraId` - Get products by category
- `POST /api/products` - Create product (requires seller/admin role)
- Products now include: priceETB, stock, section, teraId, popular, rating

## Frontend Implementation

### New Files:
- `frontend/src/hooks/useRole.js` - Hook to get user role
- `frontend/src/components/ProtectedRoute.jsx` - Route protection component
- `frontend/src/components/UserSync.jsx` - Auto-sync user on login
- `frontend/src/components/ProductForm.jsx` - Product creation/edit form
- `frontend/src/pages/SellerDashboard.jsx` - Seller product management
- `frontend/src/pages/AdminDashboard.jsx` - Admin marketplace management
- `frontend/src/utils/api.js` - API utility functions

### Updated Files:
- `frontend/src/pages/SellPage.jsx` - Seller registration flow
- `frontend/src/components/Header.jsx` - Role-based navigation links
- `frontend/src/pages/CategoryPage.jsx` - Fetches from API
- `frontend/src/pages/ProductPageShim.jsx` - Fetches from API
- `frontend/src/MerkatoApp.jsx` - Protected routes
- `frontend/src/main.jsx` - User sync on login

### Routes:

**Public:**
- `/` - Homepage
- `/categories` - All categories
- `/category/:id` - Category products
- `/product/:id` - Product details
- `/cart` - Shopping cart
- `/search` - Search results
- `/deals` - Popular products
- `/sell` - Seller registration page

**Protected (Seller/Admin):**
- `/seller/dashboard` - Seller product management

**Protected (Admin only):**
- `/admin/dashboard` - Admin marketplace management

## Setup Instructions

### Backend:

1. **Update database schema:**
   ```bash
   cd backend
   npm run db:push
   ```

2. **Set environment variables:**
   ```env
   CLERK_SECRET_KEY=your_clerk_secret_key
   DATABASE_URL=your_database_url
   FRONTEND_URL=http://localhost:5174
   PORT=5000
   ```

3. **Start backend:**
   ```bash
   npm run dev
   ```

### Frontend:

1. **Set environment variables:**
   ```env
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   VITE_API_URL=http://localhost:5000
   ```

2. **Start frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

## Workflow

### Seller Registration:
1. User signs in with Clerk
2. User visits `/sell` page
3. Clicks "Register as Seller"
4. Backend updates user role to "seller"
5. User redirected to seller dashboard

### Seller Posting Products:
1. Seller goes to `/seller/dashboard`
2. Clicks "Add New Product"
3. Fills form with product details (name, description, price, stock, category)
4. Product is saved to database
5. Product appears in marketplace

### Admin Management:
1. Admin goes to `/admin/dashboard`
2. Can view/manage sellers, users, and products
3. Can update user roles
4. Can delete any product

## Testing

1. **Create test admin:**
   - Sign up with Clerk
   - Sync user via `/api/users/sync`
   - Update role to admin in database or via API

2. **Test seller registration:**
   - Sign up with Clerk
   - Visit `/sell`
   - Register as seller
   - Verify seller dashboard access

3. **Test product creation:**
   - As seller, go to dashboard
   - Create a product
   - Verify it appears in category pages
