# Database Migration Guide

## Schema Changes for RBAC

The database schema has been updated to support Role-Based Access Control (RBAC). You need to run a migration to update your database.

### Changes Made:

1. **Users table**: Added `role` column (enum: customer, seller, admin)
2. **Products table**: Added fields:
   - `priceETB` (integer)
   - `stock` (integer)
   - `section` (text) - e.g., "Buna Tera"
   - `teraId` (text) - e.g., "buna"
   - `popular` (text) - boolean as text
   - `rating` (text) - rating as text

### Migration Steps:

1. **Push schema changes to database:**
   ```bash
   cd backend
   npm run db:push
   ```

2. **If you encounter enum errors**, you may need to manually create the enum type:
   ```sql
   CREATE TYPE user_role AS ENUM ('customer', 'seller', 'admin');
   ```

3. **Then add the role column:**
   ```sql
   ALTER TABLE users ADD COLUMN IF NOT EXISTS role user_role DEFAULT 'customer' NOT NULL;
   ```

4. **Add product columns:**
   ```sql
   ALTER TABLE products ADD COLUMN IF NOT EXISTS price_etb INTEGER NOT NULL DEFAULT 0;
   ALTER TABLE products ADD COLUMN IF NOT EXISTS stock INTEGER NOT NULL DEFAULT 0;
   ALTER TABLE products ADD COLUMN IF NOT EXISTS section TEXT NOT NULL DEFAULT '';
   ALTER TABLE products ADD COLUMN IF NOT EXISTS tera_id TEXT NOT NULL DEFAULT '';
   ALTER TABLE products ADD COLUMN IF NOT EXISTS popular TEXT DEFAULT 'false';
   ALTER TABLE products ADD COLUMN IF NOT EXISTS rating TEXT;
   ```

### Setting First Admin User

To set a user as admin, you can use the admin API endpoint or directly in the database:

```sql
UPDATE users SET role = 'admin' WHERE email = 'your-admin-email@example.com';
```

Or use the API:
```bash
curl -X PUT http://localhost:5000/api/admin/users/{userId}/role \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"role": "admin"}'
```
