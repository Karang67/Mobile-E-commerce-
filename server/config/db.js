import mongoose from 'mongoose';
import dns from 'dns';

// In local development (especially Windows), local ISP/router DNS often refuses SRV queries.
// We enable Google Public DNS ONLY in non-production to resolve MongoDB Atlas SRV records.
// In cloud production (Render/Docker), process.env.NODE_ENV === 'production' preserves VPC/container DNS.
if (process.env.NODE_ENV !== 'production') {
  try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
  } catch {
    // ignore if restricted
  }
}

export const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/shivangi_mobile';

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 8000,
    });
    console.log(`[MongoDB] Connected to: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`[MongoDB] Connection failed: ${error.message}. Offline fallback active.`);
  }
};
