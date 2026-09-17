import express from 'express';
import {
  getAllProducts,
  upsertProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { requireAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// SEC-005 FIX:
//   GET  /api/products         — public (storefront product listing)
//   POST /api/products         — admin only (requireAdmin guard)
//   DELETE /api/products/:id   — admin only (requireAdmin guard)

router.route('/')
  .get(getAllProducts)               // ← Public product listing
  .post(requireAdmin, upsertProduct); // ← Admin auth required

router.route('/:id')
  .delete(requireAdmin, deleteProduct); // ← Admin auth required

export default router;
