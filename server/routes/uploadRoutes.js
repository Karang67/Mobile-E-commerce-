import express from 'express';
import { upload } from '../config/cloudinary.js';
import { uploadImage } from '../controllers/uploadController.js';
import { requireAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// SEC-009 FIX: Upload endpoint now:
//   1. Requires admin authentication (requireAdmin)
//   2. Multer fileFilter is enforced in cloudinary.js config
//   3. Rate limiting applied globally in server.js
router.post('/', requireAdmin, upload.single('image'), uploadImage);

export default router;
