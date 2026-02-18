-- Quick SQL script to set admin user
-- Run this directly in your database

-- Update existing user to admin
UPDATE users 
SET role = 'admin' 
WHERE email = 'keneniasefa14@gmail.com';

-- Verify the update
SELECT id, email, name, role, created_at 
FROM users 
WHERE email = 'keneniasefa14@gmail.com';
