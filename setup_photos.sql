-- 1. Add photo_url column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS photo_url text;

-- 2. Create the 'member_photos' storage bucket and make it public
INSERT INTO storage.buckets (id, name, public) 
VALUES ('member_photos', 'member_photos', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Allow anyone to view the member photos (public read)
CREATE POLICY "member_photos_public_read"
ON storage.objects FOR SELECT
USING ( bucket_id = 'member_photos' );

-- 4. Allow authenticated users (admins) to upload new photos
CREATE POLICY "member_photos_admin_upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'member_photos' 
  AND auth.role() = 'authenticated'
);

-- 5. Allow authenticated users (admins) to update photos
CREATE POLICY "member_photos_admin_update"
ON storage.objects FOR UPDATE
WITH CHECK (
  bucket_id = 'member_photos' 
  AND auth.role() = 'authenticated'
);

-- 6. Allow authenticated users (admins) to delete photos
CREATE POLICY "member_photos_admin_delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'member_photos' 
  AND auth.role() = 'authenticated'
);
