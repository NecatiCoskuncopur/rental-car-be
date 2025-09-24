import { BadRequestException } from '@nestjs/common';
import { v2 as Cloudinary } from 'cloudinary';

interface CloudinaryDestroyResult {
  result: 'ok' | 'not found' | 'error';
}

/**
 * Deletes an image from Cloudinary storage based on its URL.
 *
 * This function extracts the `public_id` from the given Cloudinary image URL
 * and calls the Cloudinary API to remove the file from storage.
 *
 * - If the `imageUrl` is empty or null, the function exits silently.
 * - If the URL does not contain a valid `public_id`, a `BadRequestException` is thrown.
 * - If Cloudinary responds with `"ok"` or `"not found"`, the deletion is considered successful.
 * - Any other response or unexpected error will throw a `BadRequestException`.
 *
 * @param {string} imageUrl - The full Cloudinary image URL (must contain `/upload/`).
 * @returns {Promise<void>} Resolves when deletion is successful or the file does not exist.
 * @throws {BadRequestException} If the URL is invalid or Cloudinary deletion fails.
 */

export const deleteImageFromStorage = async (
  imageUrl: string,
): Promise<void> => {
  try {
    if (!imageUrl) return;

    if (!imageUrl.includes('res.cloudinary.com')) {
      return;
    }

    const urlParts = imageUrl.split('/upload/')[1];
    if (!urlParts) throw new Error('Invalid Cloudinary URL');

    const parts = urlParts.split('/');
    if (parts[0].startsWith('v') && !isNaN(Number(parts[0].substring(1)))) {
      parts.shift();
    }

    const publicIdWithExt = parts.join('/').split('.')[0];
    const publicId = publicIdWithExt;

    const result = (await Cloudinary.uploader.destroy(
      publicId,
    )) as CloudinaryDestroyResult;

    if (result.result !== 'ok' && result.result !== 'not found') {
      throw new Error('Cloudinary deletion failed');
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new BadRequestException(error.message);
    }
    throw new BadRequestException('Cloudinary file deletion failed');
  }
};
