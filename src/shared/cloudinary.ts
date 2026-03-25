import { v2 as cloudinary } from 'cloudinary';
import { unlink } from 'fs/promises';
import { join } from 'path';

/**
 * Delete an uploaded file from wherever it was stored.
 * - Cloudinary URLs  → deleted via Cloudinary API
 * - Local /uploads   → deleted from disk
 * Safe to call with null/undefined; errors are silently ignored.
 */
export async function deleteUploadedFile(url: string | null | undefined): Promise<void> {
  if (!url) return;

  try {
    if (url.includes('cloudinary.com')) {
      // Extract public_id from Cloudinary URL (e.g. "tmis/filename" without extension)
      const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)\.[^.]+$/);
      if (!match) return;
      await cloudinary.uploader.destroy(match[1]!);
    } else {
      // Local disk
      const match = url.match(/\/uploads\/(.+)$/);
      if (!match) return;
      await unlink(join(process.cwd(), 'uploads', match[1]!));
    }
  } catch {
    // File may not exist — ignore
  }
}
