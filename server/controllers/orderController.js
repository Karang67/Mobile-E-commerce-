import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';

/**
 * @desc    Get all orders
 * @route   GET /api/orders
 */
export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create or sync an order with server-side price validation (SEC-004)
 * @route   POST /api/orders
 */
export const syncOrder = async (req, res, next) => {
  try {
    const orderData = req.body;
    if (!orderData || !Array.isArray(orderData.items) || orderData.items.length === 0) {
      return res.status(400).json({ error: 'Valid order items are required.' });
    }

    if (!orderData.address || !orderData.address.fullName || !orderData.address.phone) {
      return res.status(400).json({ error: 'Customer name and phone number are required.' });
    }

    // 1. Generate or validate order ID
    const orderId = (typeof orderData.id === 'string' && orderData.id.startsWith('SHIV-'))
      ? orderData.id
      : `SHIV-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    // 2. Fetch products from DB if available to cross-validate unit prices (SEC-004)
    const productIds = orderData.items.map(it => it.product?.id).filter(Boolean);
    const dbProducts = await Product.find({ id: { $in: productIds } });
    const productMap = new Map(dbProducts.map(p => [p.id, p]));

    // 3. Compute verified subtotal
    let verifiedSubtotal = 0;
    const validatedItems = orderData.items.map(item => {
      const dbProd = item.product?.id ? productMap.get(item.product.id) : null;
      // Use verified DB price if product is in catalog, otherwise fallback to item price with non-negative guarantee
      const unitPrice = dbProd && typeof dbProd.price === 'number'
        ? dbProd.price
        : Math.max(0, Number(item.product?.price) || 0);

      const qty = Math.max(1, parseInt(item.quantity, 10) || 1);
      verifiedSubtotal += unitPrice * qty;

      return {
        ...item,
        quantity: qty,
        product: {
          ...item.product,
          price: unitPrice,
        },
      };
    });

    // 4. Validate discount & delivery fee
    const rawDiscount = Math.max(0, Number(orderData.discount) || 0);
    const verifiedDiscount = Math.min(rawDiscount, verifiedSubtotal);
    const verifiedDeliveryFee = Math.max(0, Number(orderData.deliveryFee) || 0);
    const verifiedTotal = Math.max(0, verifiedSubtotal - verifiedDiscount + verifiedDeliveryFee);

    // 5. Enforce legitimate initial statuses (prevent client-side status spoofing)
    const rawMethod = String(orderData.paymentMethod || '').toLowerCase();
    const isCod = rawMethod.includes('cod') || rawMethod.includes('cash');
    const paymentStatus = isCod ? 'COD' : 'Pending';
    const status = 'Order Placed';

    const safeOrder = {
      ...orderData,
      id: orderId,
      date: orderData.date || new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      items: validatedItems,
      subtotal: verifiedSubtotal,
      discount: verifiedDiscount,
      deliveryFee: verifiedDeliveryFee,
      total: verifiedTotal,
      status,
      paymentStatus,
    };

    const order = await Order.findOneAndUpdate(
      { id: orderId },
      { $set: safeOrder },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    console.log(`[Order Controller] Verified & synced order: ${order.id} | Total: ₹${verifiedTotal}`);
    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update order status and payment status (Admin protected)
 * @route   PATCH /api/orders/:id/status
 */
export const updateOrderStatus = async (req, res, next) => {
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

    console.log(`[Order Controller] Updated order ${id} status: ${status} | payment: ${paymentStatus}`);
    res.status(200).json(updatedOrder);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a single order by ID (Admin protected)
 * @route   DELETE /api/orders/:id
 */
export const deleteOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Order.findOneAndDelete({ id });
    if (!deleted) {
      return res.status(404).json({ error: 'Order not found' });
    }
    console.log(`[Order Controller] Deleted order: ${id}`);
    res.status(200).json({ success: true, message: `Order ${id} deleted successfully.` });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Clear all orders from database (Admin protected)
 * @route   DELETE /api/orders
 */
export const clearAllOrders = async (req, res, next) => {
  try {
    const result = await Order.deleteMany({});
    console.log(`[Order Controller] Cleared all orders from DB. Deleted count: ${result.deletedCount}`);
    res.status(200).json({ success: true, deletedCount: result.deletedCount });
  } catch (error) {
    next(error);
  }
};
