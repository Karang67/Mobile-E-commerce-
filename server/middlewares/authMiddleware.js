/**
 * Authentication middleware
 * SEC-002 / SEC-005 FIX: All admin routes must use requireAdmin.
 * Verifies JWT from Authorization header (Bearer <token>).
 */
import jwt from 'jsonwebtoken';

export const requireAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required. Please log in.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'changeme-use-env-var');
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Admin privileges required.' });
    }
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired session token. Please log in again.' });
  }
};
