import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { Order } from './models/Order.js';
import { Product } from './models/Product.js';

dotenv.config();
dotenv.config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/shivangi_mobile';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Configure Multer for memory upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// MongoDB Connection
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log(`[MongoDB] Connected successfully to: ${MONGODB_URI}`);
  })
  .catch((err) => {
    console.warn(`[MongoDB] Notice: Could not connect to MongoDB at ${MONGODB_URI} (${err.message}). The client will use localStorage fallback safely until MongoDB is active.`);
  });

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    mongoConnected: mongoose.connection.readyState === 1,
    time: new Date().toISOString()
  });
});

// --- CLOUDINARY UPLOAD ENDPOINT ---
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file uploaded' });
  }

  const uploadStream = cloudinary.uploader.upload_stream(
    {
      folder: 'shivangi_mobile',
      resource_type: 'image',
    },
    (error, result) => {
      if (error) {
        console.error('[Cloudinary Upload Error]', error);
        return res.status(500).json({ error: error.message });
      }
      return res.json({
        url: result.secure_url,
        public_id: result.public_id,
        format: result.format,
        width: result.width,
        height: result.height,
      });
    }
  );

  uploadStream.end(req.file.buffer);
});

// --- ORDERS API ---

// 1. Get all orders
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Create or sync order
app.post('/api/orders', async (req, res) => {
  try {
    const orderData = req.body;
    if (!orderData || !orderData.id) {
      return res.status(400).json({ error: 'Valid order data with id is required' });
    }

    const order = await Order.findOneAndUpdate(
      { id: orderData.id },
      { $set: orderData },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    console.log(`[Order API] Synced order: ${order.id}`);
    res.status(201).json(order);
  } catch (error) {
    console.error('[Order API Error]', error);
    res.status(500).json({ error: error.message });
  }
});

// 3. Update order status and payment
app.patch('/api/orders/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus, statusMessage } = req.body;

    const updateFields = {};
    if (status) updateFields.status = status;
    if (paymentStatus) updateFields.paymentStatus = paymentStatus;
    if (statusMessage) updateFields.statusMessage = statusMessage;

    const updatedOrder = await Order.findOneAndUpdate(
      { id },
      { $set: updateFields },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    console.log(`[Order API] Updated order ${id} status: ${status} | payment: ${paymentStatus}`);
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- PRODUCTS API ---

// 1. Get all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Create / Upsert Product
app.post('/api/products', async (req, res) => {
  try {
    const productData = req.body;
    if (!productData || !productData.id) {
      return res.status(400).json({ error: 'Product id is required' });
    }

    const product = await Product.findOneAndUpdate(
      { id: productData.id },
      { $set: productData },
      { new: true, upsert: true }
    );

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Delete Product
app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findOneAndDelete({ id });
    res.json({ message: 'Product deleted successfully', id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`[Shivangi Mobile Server] Running on http://localhost:${PORT}`);
});
