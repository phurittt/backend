import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };

/**
 * Delete a file from Cloudinary by its URL.
 * Silently ignores errors (file may have already been removed).
 */
export async function deleteCloudinaryFile(url: string | null | undefined): Promise<void> {
  if (!url || !url.includes('cloudinary.com')) return;
  try {
    // Extract public_id from URL (everything after /upload/(v\d+/)? without extension)
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)\.[^.]+$/);
    if (!match) return;
    await cloudinary.uploader.destroy(match[1]!);
  } catch {
    // ignore
  }
}
