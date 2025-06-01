/*
  # Add foreign key constraint for blog posts author

  1. Changes
    - Add foreign key constraint between blog_posts.author_id and auth.users.id
    - Force schema cache reload

  2. Notes
    - ON DELETE SET NULL ensures posts are preserved if an author is deleted
    - Schema cache reload ensures immediate visibility of the new constraint
*/

-- Add foreign key constraint
ALTER TABLE blog_posts 
DROP CONSTRAINT IF EXISTS fk_author;

ALTER TABLE blog_posts
ADD CONSTRAINT fk_author 
FOREIGN KEY (author_id) 
REFERENCES auth.users(id) 
ON DELETE SET NULL;

-- Force schema cache reload
NOTIFY pgrst, 'reload schema';