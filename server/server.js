import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { connectDB } from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import authRoutes from './routes/authRoutes.js';
import settingRoutes from './routes/settingRoutes.js';
import { notFound, errorHandler } from './middlewares/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 5001;

// Connect to MongoDB Atlas
connectDB();

// ─── SEC-010: Security Headers (helmet) ──────────────────────────────────────
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https://res.cloudinary.com', 'https://api.qrserver.com'],
        connectSrc: ["'self'"],
        frameSrc: ["'none'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null,
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  })
);
app.disable('x-powered-by');

// ─── SEC-007: Strict CORS Origin Allowlist ────────────────────────────────────
const configuredFrontend = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.replace(/\/+$/, '') : null;
const allowedOrigins = new Set(
  [
    configuredFrontend,              // Production: https://shivangi-mobile.vercel.app
    'http://localhost:5173',         // Vite dev server
    'http://localhost:5174',
    'http://localhost:3000',         // Alt dev port
    'http://127.0.0.1:5173',
  ].filter(Boolean)
);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (Postman, mobile apps, health checks, server-to-server)
      if (!origin) return callback(null, true);
      const normalizedOrigin = origin.replace(/\/+$/, '');
      if (allowedOrigins.has(normalizedOrigin)) return callback(null, true);
      // In development, allow any localhost origin
      if (process.env.NODE_ENV !== 'production' && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
        return callback(null, true);
      }
      // Block all other origins cleanly without throwing uncaught 500 error
      callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ─── Body Parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// ─── SEC-014: NoSQL Injection Prevention ─────────────────────────────────────
// Sanitizes req.body, req.params, req.query by replacing $ and . in keys
app.use(mongoSanitize());

// ─── SEC-008: Rate Limiting ───────────────────────────────────────────────────
const isDev = process.env.NODE_ENV !== 'production';

// Global limit: 1000 req/15min (generous for small admin site)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again in 15 minutes.' },
});

// Upload limit: 50 uploads per hour
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Upload limit reached. Please try again in 1 hour.' },
});

// Order limit: 50 orders per hour
const orderLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Order submission limit reached. Please contact the store for assistance.' },
});

// Auth login limit: 100 attempts per 15 minutes (admin-friendly)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Please try again in 15 minutes.' },
  skipSuccessfulRequests: true,
});

if (!isDev) {
  app.use('/api/', globalLimiter);
  app.use('/api/upload', uploadLimiter);
  app.use('/api/orders', orderLimiter);
}

// ─── Health Check (public, no auth) ──────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'Shivangi Mobile Backend',
    environment: process.env.NODE_ENV || 'development',
    time: new Date().toISOString(),
  });
});

// ─── MVC API Routes ───────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);         // Admin login/logout/verify
app.use('/api/products', productRoutes);  // GET: public | POST/DELETE: requireAdmin
app.use('/api/orders', orderRoutes);      // POST: public | GET/PATCH: requireAdmin
app.use('/api/upload', uploadRoutes);     // POST: requireAdmin
app.use('/api/settings', settingRoutes);  // GET: public | POST: requireAdmin

// ─── Error Handling ───────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`[Shivangi Mobile] Server running on port ${PORT} (${process.env.NODE_ENV || 'development'})`);
  console.log(`[Health check] http://localhost:${PORT}/api/health`);
});

export default app;
