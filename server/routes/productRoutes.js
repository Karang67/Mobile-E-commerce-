import express from 'express';
import {
  getAllProducts,
  getProductById,
  upsertProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { requireAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// SEC-005 FIX:
//   GET  /api/products         — public (storefront product listing)
//   GET  /api/products/:id     — public (single product by ID or slug)
//   POST /api/products         — admin only (requireAdmin guard)
//   DELETE /api/products/:id   — admin only (requireAdmin guard)

router.route('/')
  .get(getAllProducts)               // ← Public product listing
  .post(requireAdmin, upsertProduct); // ← Admin auth required

router.route('/:id')
  .get(getProductById)                // ← Public single product lookup
  .delete(requireAdmin, deleteProduct); // ← Admin auth required

export default router;
