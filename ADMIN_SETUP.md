# Setting Up First Admin User

## Method 1: Via Frontend + Database (Recommended)

### Step 1: Sign Up with Clerk
1. Start your frontend: `cd frontend && npm run dev`
2. Go to `http://localhost:5174`
3. Click "Login" button
4. Sign up with:
   - **Email:** `merkatoadmin@gmail.com`
   - **Password:** `Merke@21`
5. Complete Clerk signup process

### Step 2: Get Clerk User ID
After signing up, the user will be automatically synced to your database via the `UserSync` component. You can:

**Option A:** Check browser console/network tab for the sync API call response
**Option B:** Check your database:
```sql
SELECT id, email, name, role FROM users WHERE email = 'merkatoadmin@gmail.com';
```

### Step 3: Update Role to Admin

**Via SQL (Direct):**
```sql
UPDATE users 
SET role = 'admin' 
WHERE email = 'merkatoadmin@gmail.com';
```

**Via API (if you have another admin):**
```bash
curl -X PUT http://localhost:5000/api/admin/users/{userId}/role \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"role": "admin"}'
```

**Via Script:**
```bash
cd backend
npx ts-node scripts/createAdmin.ts <clerk_user_id>
```

## Method 2: Direct Database Insert (If Clerk User Already Exists)

If you already have the Clerk user ID:

```sql
-- First, ensure the user exists (sync via API or insert)
INSERT INTO users (id, email, name, role, image_url)
VALUES (
  'user_xxxxxxxxxxxxx',  -- Replace with actual Clerk user ID
  'merkatoadmin@gmail.com',
  'Merkato Admin',
  'admin',
  NULL
)
ON CONFLICT (id) DO UPDATE 
SET role = 'admin';

-- Or update existing user
UPDATE users 
SET role = 'admin' 
WHERE email = 'merkatoadmin@gmail.com';
```

## Method 3: Using Clerk Dashboard

1. Go to Clerk Dashboard: https://dashboard.clerk.com
2. Find user with email `merkatoadmin@gmail.com`
3. Copy the User ID (starts with `user_`)
4. Run SQL update:
```sql
UPDATE users 
SET role = 'admin' 
WHERE id = 'user_xxxxxxxxxxxxx';  -- Replace with Clerk User ID
```

## Verification

After setting admin role, verify:

```sql
SELECT id, email, name, role FROM users WHERE email = 'merkatoadmin@gmail.com';
```

You should see `role = 'admin'`.

Then test admin access:
1. Sign in with `merkatoadmin@gmail.com`
2. Visit `http://localhost:5174/admin/dashboard`
3. You should see the admin dashboard

## Quick Setup Script

Create a file `setup-admin.sh`:

```bash
#!/bin/bash

# Get database URL from .env
source .env

# Update user to admin
psql $DATABASE_URL -c "UPDATE users SET role = 'admin' WHERE email = 'merkatoadmin@gmail.com';"

echo "Admin user updated!"
```

Make it executable:
```bash
chmod +x setup-admin.sh
./setup-admin.sh
```
