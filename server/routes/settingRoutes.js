import express from 'express';
import { Setting } from '../models/Setting.js';
import { requireAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Blacklist sensitive setting keys from public read access
const SENSITIVE_KEYS = new Set(['admin_password_hash', 'admin_hash', 'secret']);

/**
 * GET /api/settings/:key
 * Public endpoint to fetch settings like payment_settings, store_info
 */
router.get('/:key', async (req, res, next) => {
  try {
    const { key } = req.params;
    if (SENSITIVE_KEYS.has(key.toLowerCase())) {
      return res.status(403).json({ error: 'Access denied.' });
    }

    const doc = await Setting.findOne({ key });
    if (!doc) {
      return res.status(404).json({ error: 'Setting not found', key });
    }

    res.status(200).json(doc.value);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/settings/:key
 * Protected endpoint for Admin to save settings
 */
router.post('/:key', requireAdmin, async (req, res, next) => {
  try {
    const { key } = req.params;
    if (SENSITIVE_KEYS.has(key.toLowerCase())) {
      return res.status(403).json({ error: 'Access denied.' });
    }

    const { value } = req.body;
    if (value === undefined) {
      return res.status(400).json({ error: 'Setting value is required.' });
    }

    const doc = await Setting.findOneAndUpdate(
      { key },
      { $set: { key, value } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({ success: true, key: doc.key, value: doc.value });
  } catch (error) {
    next(error);
  }
});

export default router;
