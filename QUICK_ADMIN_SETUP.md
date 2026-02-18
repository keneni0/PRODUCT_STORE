# Quick Admin Setup Commands

## Fastest Method:

1. **Sign up via frontend:**
   - Start frontend: `cd frontend && npm run dev`
   - Go to http://localhost:5174
   - Sign up with: merkatoadmin@gmail.com / Merke@21

2. **Set admin role:**
   ```bash
   cd backend
   npm run setup-admin
   ```

## Direct SQL Method:

If you prefer SQL directly:

```sql
-- Update existing user to admin
UPDATE users SET role = 'admin' WHERE email = 'merkatoadmin@gmail.com';

-- Verify
SELECT id, email, name, role FROM users WHERE email = 'merkatoadmin@gmail.com';
```

## Using psql:

```bash
# Replace DATABASE_URL with your actual connection string
psql $DATABASE_URL -c "UPDATE users SET role = 'admin' WHERE email = 'merkatoadmin@gmail.com';"
```

That's it! Sign in and visit /admin/dashboard to verify.
