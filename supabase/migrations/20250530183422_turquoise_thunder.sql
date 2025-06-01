/*
  # Create storage bucket for resumes

  1. New Storage Bucket
    - Creates a new bucket named 'resumes' for storing job application resumes
    - Sets public access to false for security
    - Enables file size limits
    
  2. Security
    - Enables RLS policies for the bucket
    - Adds policy for authenticated users to upload resumes
    - Adds policy for admins to view all resumes
    - Adds policy for users to view their own uploaded resumes
*/

-- Create the storage bucket
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'resumes',
  'resumes',
  false,
  5242880, -- 5MB limit
  array['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
);

-- Enable RLS
create policy "Users can upload resumes"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'resumes' AND
    owner = auth.uid()
  );

create policy "Users can view their own resumes"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'resumes' AND
    owner = auth.uid()
  );

create policy "Admins can view all resumes"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'resumes' AND
    (
      auth.uid() IN (
        select user_id from public.admin_users
        where role in ('admin', 'editor')
      )
    )
  );