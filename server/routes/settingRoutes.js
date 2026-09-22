import express from 'express';
import { Setting } from '../models/Setting.js';
import { requireAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Blacklist sensitive setting keys from public read access
const SENSITIVE_KEYS = new Set(['admin_password_hash', 'admin_hash', 'secret']);

const DEFAULT_SETTINGS = {
  store_info: {
    id: 'sumerpur-main',
    name: 'Shivangi Mobile — Flagship Showroom',
    city: 'Sumerpur',
    state: 'Rajasthan',
    address: 'Opp. Old Bus Stand, Main Market, Sumerpur, Dist. Pali, Rajasthan - 306902',
    phone: '+91 7841976969',
    email: 'shivangimobilesmr@gmail.com',
    hours: '10:00 AM - 9:00 PM (Mon-Sun)',
    lat: 25.1534,
    lng: 73.0827,
  },
  payment_settings: {
    enableQrScanner: true,
    enableCod: true,
    upiId: '7841976969@upi',
    payeeName: 'Shivangi Mobile Sumerpur',
    qrCodeImage: 'https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=upi://pay?pa=7841976969@upi&pn=Shivangi%20Mobile%20Sumerpur&cu=INR',
    instructions: 'Scan this QR code using any UPI app (GPay, PhonePe, Paytm, BHIM). After paying, upload the screenshot or enter UTR below.',
  },
};

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
      // Return default setting with 200 OK instead of 404 to avoid console errors
      const fallback = DEFAULT_SETTINGS[key] || null;
      return res.status(200).json(fallback);
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
