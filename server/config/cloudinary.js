import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import path from 'path';

// Configure Cloudinary from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// SEC-009 FIX: Strict MIME type + extension allowlist.
// Rejects SVG (XSS vector), HTML, executables, and any non-image file.
const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
]);

const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  if (ALLOWED_MIME_TYPES.has(file.mimetype) && ALLOWED_EXTENSIONS.has(ext)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `File type '${file.mimetype}' is not permitted. Only JPEG, PNG, WebP, and GIF images are allowed.`
      ),
      false
    );
  }
};

// SEC-009 FIX: Reduced file size limit from 10MB to 5MB,
// and added fileFilter to block non-image uploads.
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter,
});

export { cloudinary };
