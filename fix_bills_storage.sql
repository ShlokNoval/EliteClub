-- 1. Create the 'bills' storage bucket and make it public
INSERT INTO storage.buckets (id, name, public) 
VALUES ('bills', 'bills', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Allow anyone to view the bill images (they still need the random URL)
CREATE POLICY "bills_public_read"
ON storage.objects FOR SELECT
USING ( bucket_id = 'bills' );

-- 3. Allow authenticated users (hotels) to upload new bill images
CREATE POLICY "bills_hotel_upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'bills' 
  AND auth.role() = 'authenticated'
);
