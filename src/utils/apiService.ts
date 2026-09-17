import { Order, Product } from '../types';
import { seedProducts } from '../data/seedProducts';
import { getAdminToken } from '../data/adminData';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
const LOCAL_PRODUCTS_KEY = 'admin_products';

/**
 * Returns common headers including Authorization Bearer token when admin is logged in
 */
const getAuthHeaders = (): Record<string, string> => {
  const token = getAdminToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

/**
 * Get products stored in localStorage
 */
export const getLocalProducts = (): Product[] => {
  try {
    const raw = localStorage.getItem(LOCAL_PRODUCTS_KEY);
    if (raw) return JSON.parse(raw) as Product[];
  } catch {
    // ignore
  }
  return [];
};

/**
 * Save/Update product in localStorage
 */
export const saveLocalProduct = (product: Product): void => {
  try {
    const existing = getLocalProducts();
    const idx = existing.findIndex(p => p.id === product.id);
    let updated: Product[];
    if (idx >= 0) {
      updated = [...existing];
      updated[idx] = product;
    } else {
      updated = [product, ...existing];
    }
    localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('admin_data_changed'));
  } catch {
    // ignore
  }
};

/**
 * Delete product from localStorage
 */
export const deleteLocalProduct = (productId: string): void => {
  try {
    const existing = getLocalProducts();
    const updated = existing.filter(p => p.id !== productId);
    localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('admin_data_changed'));
  } catch {
    // ignore
  }
};

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
 * Update order status in MongoDB backend (Admin protected)
 */
export const syncOrderStatusToMongo = async (orderId: string, status: string, paymentStatus?: string): Promise<boolean> => {
  try {
    const res = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
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
 * Sync a product to MongoDB backend AND localStorage (Admin protected)
 */
export const syncProductToMongo = async (product: Product): Promise<boolean> => {
  // Always save locally first so client state updates immediately
  saveLocalProduct(product);

  try {
    const res = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: getAuthHeaders(),
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
 * Delete a product from MongoDB backend AND localStorage (Admin protected)
 */
export const deleteProductFromMongo = async (productId: string): Promise<boolean> => {
  deleteLocalProduct(productId);
  try {
    const token = getAdminToken();
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/products/${productId}`, {
      method: 'DELETE',
      headers,
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
 * Fetch all products (from MongoDB or fallback to seed + local)
 */
export const getProducts = async (): Promise<Product[]> => {
  const local = getLocalProducts();
  let apiProducts: Product[] = [];

  try {
    const res = await fetch(`${API_BASE_URL}/products`);
    if (res.ok) {
      const data = await res.json();
      apiProducts = Array.isArray(data) ? data : (data.products || []);
    }
  } catch (error) {
    console.error('[API] Error fetching products:', error);
  }

  // Combine products logic:
  // Base with seedProducts, then overlay MongoDB apiProducts and localStorage products
  const mergedMap = new Map<string, Product>();
  seedProducts.forEach(p => mergedMap.set(p.id, p));
  apiProducts.forEach(p => mergedMap.set(p.id, p));
  local.forEach(p => mergedMap.set(p.id, p));

  return Array.from(mergedMap.values());
};

/**
 * Fetch all orders from MongoDB backend (Admin protected)
 */
export const getOrders = async (): Promise<Order[]> => {
  try {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      headers: getAuthHeaders(),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (error) {
    console.error('[API] Error fetching orders:', error);
  }
  return [];
};

/**
 * Delete a single order from MongoDB backend (Admin protected)
 */
export const deleteOrderFromMongo = async (orderId: string): Promise<boolean> => {
  try {
    const res = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return res.ok;
  } catch {
    return false;
  }
};

/**
 * Clear all orders from MongoDB backend (Admin protected)
 */
export const clearAllOrdersFromMongo = async (): Promise<boolean> => {
  try {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return res.ok;
  } catch {
    return false;
  }
};

