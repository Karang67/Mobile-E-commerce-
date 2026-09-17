import { cloudinary } from '../config/cloudinary.js';

/**
 * @desc    Upload an image buffer to Cloudinary
 * @route   POST /api/upload
 */
export const uploadImage = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file uploaded' });
  }

  const uploadStream = cloudinary.uploader.upload_stream(
    {
      folder: 'shivangi_mobile',
      resource_type: 'image',
    },
    (error, result) => {
      if (error) {
        console.error('[Cloudinary Upload Error]', error);
        return res.status(500).json({ error: error.message });
      }
      return res.status(200).json({
        url: result.secure_url,
        public_id: result.public_id,
        format: result.format,
        width: result.width,
        height: result.height,
      });
    }
  );

  uploadStream.end(req.file.buffer);
};
