/*
  # Fix blog posts author relationship

  1. Changes
    - Add foreign key constraint between blog_posts.author_id and auth.users.id
    - Ensure author_id is of type UUID
  
  2. Notes
    - This enables proper joins between blog posts and authors
    - Required for the blog posts admin interface to work correctly
*/

-- First ensure author_id is the correct type
ALTER TABLE blog_posts 
ALTER COLUMN author_id TYPE uuid USING author_id::uuid;

-- Add the foreign key constraint
ALTER TABLE blog_posts
ADD CONSTRAINT fk_author 
FOREIGN KEY (author_id) 
REFERENCES auth.users(id)
ON DELETE SET NULL;

-- Force schema cache refresh
NOTIFY pgrst, 'reload schema';