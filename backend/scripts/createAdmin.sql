-- SQL script to create admin user directly in database
-- This assumes you've already signed up with Clerk

-- Option 1: Update existing user by email
UPDATE users 
SET role = 'admin' 
WHERE email = 'merkatoadmin@gmail.com';

-- Option 2: Update existing user by Clerk ID (replace with actual Clerk user ID)
-- UPDATE users 
-- SET role = 'admin' 
-- WHERE id = 'user_xxxxxxxxxxxxx';

-- Option 3: Insert new admin user (if user doesn't exist yet)
-- You'll need to get the Clerk user ID first by signing up
-- INSERT INTO users (id, email, name, role, image_url)
-- VALUES (
--   'user_xxxxxxxxxxxxx',  -- Replace with actual Clerk user ID
--   'merkatoadmin@gmail.com',
--   'Merkato Admin',
--   'admin',
--   NULL
-- );

-- Verify the update
SELECT id, email, name, role, created_at 
FROM users 
WHERE email = 'merkatoadmin@gmail.com';
