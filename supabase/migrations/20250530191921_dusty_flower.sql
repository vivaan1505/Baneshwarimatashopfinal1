-- Add specific user as admin
INSERT INTO admin_users (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'vipin.gehlotcanada@gmail.com'
AND NOT EXISTS (
  SELECT 1 FROM admin_users WHERE user_id = auth.users.id
);