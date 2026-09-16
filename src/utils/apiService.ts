import { Order, Product } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

/**
 * Sync a new order to MongoDB backend API if available
 */
export const syncOrderToMongo = async (order: Order): Promise<boolean> => {
  try {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(order),
    });

    if (res.ok) {
      console.log(`[MongoDB Sync] Order #${order.id} persisted to database.`);
      return true;
    }
  } catch {
    // Backend may not be started yet; local storage retains full functionality
  }
  return false;
};

/**
 * Update order status in MongoDB backend
 */
export const syncOrderStatusToMongo = async (orderId: string, status: string, paymentStatus?: string): Promise<boolean> => {
  try {
    const res = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status, paymentStatus }),
    });

    if (res.ok) {
      return true;
    }
  } catch {
    // ignore
  }
  return false;
};

/**
 * Sync a product to MongoDB backend
 */
export const syncProductToMongo = async (product: Product): Promise<boolean> => {
  try {
    const res = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });

    if (res.ok) {
      console.log(`[MongoDB Sync] Product ${product.id} synced to database.`);
      return true;
    }
  } catch {
    // ignore
  }
  return false;
};

/**
 * Delete a product from MongoDB backend
 */
export const deleteProductFromMongo = async (productId: string): Promise<boolean> => {
  try {
    const res = await fetch(`${API_BASE_URL}/products/${productId}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      return true;
    }
  } catch {
    // ignore
  }
  return false;
};

/**
 * Fetch all products from MongoDB backend
 */
export const getProducts = async (): Promise<Product[]> => {
  try {
    const res = await fetch(`${API_BASE_URL}/products`);
    if (res.ok) {
      return await res.json();
    }
  } catch (error) {
    console.error('[API] Error fetching products:', error);
  }
  return [];
};

/**
 * Fetch all orders from MongoDB backend
 */
export const getOrders = async (): Promise<Order[]> => {
  try {
    const res = await fetch(`${API_BASE_URL}/orders`);
    if (res.ok) {
      return await res.json();
    }
  } catch (error) {
    console.error('[API] Error fetching orders:', error);
  }
  return [];
};
