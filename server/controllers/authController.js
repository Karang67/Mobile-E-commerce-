/**
 * Admin Authentication Controller
 * SEC-003 FIX: Server-side admin login using bcrypt password hash + JWT.
 * Supports secure password change with MongoDB persistence.
 */
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Setting } from '../models/Setting.js';

export const adminLogin = async (req, res, next) => {
  try {
    const { password } = req.body;

    if (!password || typeof password !== 'string') {
      return res.status(400).json({ error: 'Password is required.' });
    }

    const jwtSecret = process.env.JWT_SECRET || 'shivangi-mobile-default-jwt-secret-key-2026';

    // Check if custom admin password hash was set in database, otherwise fallback to env
    const dbHashDoc = await Setting.findOne({ key: 'admin_password_hash' }).catch(() => null);
    const adminHash = dbHashDoc?.value || process.env.ADMIN_PASSWORD_HASH;
    const plainAdminPassword = process.env.ADMIN_PASSWORD;

    if (!adminHash && !plainAdminPassword) {
      if (process.env.NODE_ENV === 'production') {
        return res.status(503).json({ error: 'Authentication service not configured. Set ADMIN_PASSWORD_HASH or ADMIN_PASSWORD.' });
      }
      const devPassword = 'devpassword';
      if (password !== devPassword) {
        return res.status(401).json({ error: 'Invalid credentials.' });
      }
    } else {
      let isMatch = false;
      if (adminHash && typeof adminHash === 'string' && adminHash.startsWith('$2')) {
        isMatch = await bcrypt.compare(password, adminHash).catch(() => false);
      } else if (adminHash && password === adminHash) {
        isMatch = true;
      } else if (plainAdminPassword && password === plainAdminPassword) {
        isMatch = true;
      }

      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials.' });
      }
    }

    // Issue JWT
    const token = jwt.sign(
      { role: 'admin', iss: 'shivangi-mobile-api' },
      jwtSecret,
      { expiresIn: '8h', algorithm: 'HS256' }
    );

    return res.status(200).json({
      message: 'Login successful.',
      token,
      expiresIn: 8 * 3600,
    });
  } catch (err) {
    next(err);
  }
};

export const adminLogout = (req, res) => {
  res.status(200).json({ message: 'Logged out successfully.' });
};

/**
 * Change admin password (SEC-003: Authenticated and hashed with bcrypt)
 */
export const changeAdminPassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Both current password and new password are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters long.' });
    }

    const dbHashDoc = await Setting.findOne({ key: 'admin_password_hash' }).catch(() => null);
    const activeHash = dbHashDoc?.value || process.env.ADMIN_PASSWORD_HASH;

    let isMatch = false;
    if (activeHash && typeof activeHash === 'string' && activeHash.startsWith('$2')) {
      isMatch = await bcrypt.compare(currentPassword, activeHash).catch(() => false);
    } else if (activeHash && currentPassword === activeHash) {
      isMatch = true;
    } else if (process.env.ADMIN_PASSWORD && currentPassword === process.env.ADMIN_PASSWORD) {
      isMatch = true;
    } else if (!activeHash && !process.env.ADMIN_PASSWORD && currentPassword === 'devpassword') {
      isMatch = true;
    }

    if (!isMatch) {
      return res.status(401).json({ error: 'Current password is incorrect.' });
    }

    const saltRounds = 14;
    const newHash = await bcrypt.hash(newPassword, saltRounds);

    await Setting.findOneAndUpdate(
      { key: 'admin_password_hash' },
      { $set: { key: 'admin_password_hash', value: newHash } },
      { upsert: true, new: true }
    );

    console.log('[Auth] Admin password successfully changed and persisted to DB.');
    return res.status(200).json({ message: 'Admin password updated successfully.' });
  } catch (err) {
    next(err);
  }
};
