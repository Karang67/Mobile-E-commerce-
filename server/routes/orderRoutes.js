import express from 'express';
import {
  getAllOrders,
  syncOrder,
  updateOrderStatus,
  deleteOrder,
  clearAllOrders,
} from '../controllers/orderController.js';
import { requireAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// SEC-002 / SEC-005 FIX:
//   GET    /api/orders          — admin only (requireAdmin guard)
//   POST   /api/orders          — public (customer order submission)
//   DELETE /api/orders          — admin only (clear all orders)
//   PATCH  /api/orders/:id/status — admin only (requireAdmin guard)
//   DELETE /api/orders/:id      — admin only (delete single order)

router.route('/')
  .get(requireAdmin, getAllOrders)
  .post(syncOrder)
  .delete(requireAdmin, clearAllOrders);

router.route('/:id/status')
  .patch(requireAdmin, updateOrderStatus);

router.route('/:id')
  .delete(requireAdmin, deleteOrder);

export default router;
