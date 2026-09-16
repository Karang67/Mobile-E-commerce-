import { compressImageFile } from './imageCompressor';

const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '';
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '';

export const isCloudinaryConfigured = (): boolean => {
  return Boolean(
    cloudName && 
    uploadPreset && 
    !cloudName.includes('placeholder') && 
    !uploadPreset.includes('placeholder')
  );
};

export interface CloudinaryUploadResponse {
  success: boolean;
  url: string;
  publicId?: string;
  error?: string;
}

/**
 * Upload an image file directly to Cloudinary using unsigned upload preset,
 * with fallback to local compressed base64 if Cloudinary is not yet configured in .env.
 */
export const uploadToCloudinary = async (file: File): Promise<CloudinaryUploadResponse> => {
  // 1. If Cloudinary is configured, perform direct upload to Cloudinary API
  if (isCloudinaryConfigured()) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);
      formData.append('folder', 'shivangi_mobile/products');

      const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson?.error?.message || `Cloudinary upload failed (${response.status})`);
      }

      const data = await response.json();
      return {
        success: true,
        url: data.secure_url || data.url,
        publicId: data.public_id,
      };
    } catch (err: any) {
      console.warn('Cloudinary upload error, falling back to local compressed image:', err);
    }
  }

  // 2. Fallback: Compress and convert to high-performance local data URL
  try {
    const compressedDataUrl = await compressImageFile(file, {
      maxDimension: 1200,
      quality: 0.82,
    });

    return {
      success: true,
      url: compressedDataUrl,
    };
  } catch (err: any) {
    return {
      success: false,
      url: '',
      error: err?.message || 'Failed to process image',
    };
  }
};
