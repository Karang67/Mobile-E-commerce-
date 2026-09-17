/**
 * Centralized error handler middleware for Express
 * SEC-011 FIX: Generic messages for 500 errors in production to prevent
 * internal stack traces, Mongoose paths, and DB details from leaking.
 */
export const errorHandler = (err, req, res, next) => {
  // Always log the full error internally
  console.error(`[API Error] ${req.method} ${req.originalUrl}:`, {
    message: err.message,
    stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined,
    timestamp: new Date().toISOString(),
  });

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  const isProduction = process.env.NODE_ENV === 'production';

  // In production, hide internal error details for 5xx responses
  const clientMessage =
    statusCode >= 500 && isProduction
      ? 'An internal server error occurred. Please try again later.'
      : err.message || 'Internal Server Error';

  res.status(statusCode).json({ error: clientMessage });
};

/**
 * 404 Not Found handler
 */
export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};
