# Quick Guide: Set Up Admin User

## Step-by-Step Instructions

### Method 1: Via Frontend + SQL (Easiest)

1. **Sign up with Clerk:**
   - Start frontend: `cd frontend && npm run dev`
   - Go to `http://localhost:5174`
   - Click "Login" → Sign up
   - Email: `merkatoadmin@gmail.com`
   - Password: `Merke@21`

2. **User will auto-sync** to database (via UserSync component)

3. **Update role to admin** using one of these methods:

   **Option A: Using npm script (easiest)**
   ```bash
   cd backend
   npm run setup-admin
   ```

   **Option B: Direct SQL**
   ```sql
   UPDATE users SET role = 'admin' WHERE email = 'merkatoadmin@gmail.com';
   ```

   **Option C: Using psql command line**
   ```bash
   # If using PostgreSQL directly
   psql $DATABASE_URL -c "UPDATE users SET role = 'admin' WHERE email = 'merkatoadmin@gmail.com';"
   ```

### Method 2: Direct Database (If you know Clerk User ID)

If you already have the Clerk user ID from Clerk dashboard:

```sql
UPDATE users 
SET role = 'admin' 
WHERE id = 'user_xxxxxxxxxxxxx';  -- Replace with actual Clerk User ID
```

### Method 3: Create Admin Script

```bash
cd backend
node scripts/setupAdmin.js
```

## Verification

After setting admin role:

1. **Check database:**
   ```sql
   SELECT id, email, name, role FROM users WHERE email = 'merkatoadmin@gmail.com';
   ```
   Should show `role = 'admin'`

2. **Test admin access:**
   - Sign in with `merkatoadmin@gmail.com`
   - Visit `http://localhost:5174/admin/dashboard`
   - You should see the admin dashboard

## Troubleshooting

**User not found?**
- Make sure you've signed up with Clerk first
- Check if user exists: `SELECT * FROM users WHERE email = 'merkatoadmin@gmail.com';`
- If not, sign up via frontend and user will auto-sync

**Role enum error?**
- Run migration: `cd backend && npm run db:push`
- Or manually create enum:
  ```sql
  CREATE TYPE user_role AS ENUM ('customer', 'seller', 'admin');
  ```
