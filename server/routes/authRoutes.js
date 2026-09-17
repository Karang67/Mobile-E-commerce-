import express from 'express';
import { adminLogin, adminLogout, changeAdminPassword } from '../controllers/authController.js';
import { requireAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// POST /api/auth/login — admin password → JWT
router.post('/login', adminLogin);

// POST /api/auth/logout — stateless; client discards token
router.post('/logout', requireAdmin, adminLogout);

// POST /api/auth/change-password — update admin password
router.post('/change-password', requireAdmin, changeAdminPassword);

// GET /api/auth/verify — check if current token is valid
router.get('/verify', requireAdmin, (req, res) => {
  res.status(200).json({ valid: true, role: req.admin.role });
});

export default router;
