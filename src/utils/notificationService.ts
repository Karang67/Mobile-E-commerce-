import { Order, OrderStatus } from '../types';

export interface AdminInquiryNotification {
  id: string;
  inquiryId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  city: string;
  streetAddress?: string;
  pincode?: string;
  fulfillmentType?: 'delivery' | 'pickup';
  notes?: string;
  itemsSummary: string;
  itemsCount: number;
  total: number;
  paymentMethod: string;
  paymentStatus: 'Pending' | 'Verified' | 'Success' | 'COD';
  status: OrderStatus;
  createdAt: string;
  read: boolean;
}

const NOTIFICATIONS_STORAGE_KEY = 'shivangi_admin_notifications';
const ORDERS_STORAGE_KEY = 'shivangi_customer_orders';

export const getAdminNotifications = (): AdminInquiryNotification[] => {
  try {
    const saved = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export const addAdminNotification = (notif: Omit<AdminInquiryNotification, 'id' | 'createdAt' | 'read'>): AdminInquiryNotification => {
  const newNotif: AdminInquiryNotification = {
    ...notif,
    id: `notif-${Date.now()}`,
    createdAt: new Date().toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }),
    read: false,
  };

  try {
    const existing = getAdminNotifications();
    const updated = [newNotif, ...existing];
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updated));
    // Dispatch storage event so admin layout updates in real-time
    window.dispatchEvent(new Event('shivangi_notifications_updated'));
  } catch (e) {
    console.error('Error saving notification', e);
  }

  return newNotif;
};

export const markNotificationAsRead = (id: string): void => {
  try {
    const list = getAdminNotifications().map(n => n.id === id ? { ...n, read: true } : n);
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event('shivangi_notifications_updated'));
  } catch {
    // ignore
  }
};

export const markAllNotificationsAsRead = (): void => {
  try {
    const list = getAdminNotifications().map(n => ({ ...n, read: true }));
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event('shivangi_notifications_updated'));
  } catch {
    // ignore
  }
};

export const clearAdminNotifications = (): void => {
  try {
    localStorage.removeItem(NOTIFICATIONS_STORAGE_KEY);
    window.dispatchEvent(new Event('shivangi_notifications_updated'));
  } catch {
    // ignore
  }
};

export const getStatusMessage = (status: OrderStatus): string => {
  switch (status) {
    case 'Order Placed':
      return 'Your order has been placed and received by our team.';
    case 'Preparing':
      return 'Your order is being prepared by our store specialists.';
    case 'Packed':
      return 'Your order has been securely packed, seal-verified, and ready for dispatch.';
    case 'Out for Delivery':
      return 'Your order is out for delivery! Our courier partner is on the way to your address.';
    case 'Delivered':
      return 'Your order has been delivered successfully. Thank you for shopping with Shivangi Mobile!';
    case 'Ready for Pickup':
      return 'Your order is ready for collection at our Adoni store counter.';
    case 'Completed':
      return 'Order fulfilled successfully.';
    default:
      return 'Order is being processed.';
  }
};

export const updateCustomerOrderStatus = (
  orderId: string, 
  newStatus: OrderStatus, 
  paymentStatus?: 'Pending' | 'Verified' | 'Success' | 'COD',
  customMessage?: string
): void => {
  const message = customMessage || getStatusMessage(newStatus);

  // 1. Update customer orders in localStorage
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (raw) {
      const list: Order[] = JSON.parse(raw);
      const updated = list.map(o => {
        if (o.id === orderId) {
          return {
            ...o,
            status: newStatus,
            paymentStatus: paymentStatus ?? o.paymentStatus,
            statusMessage: message,
          };
        }
        return o;
      });
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
    }
  } catch (e) {
    console.error('Failed to update customer order', e);
  }

  // 2. Update notification in admin notifications
  try {
    const notifs = getAdminNotifications().map(n => {
      if (n.inquiryId === orderId) {
        return {
          ...n,
          status: newStatus,
          paymentStatus: paymentStatus ?? n.paymentStatus,
        };
      }
      return n;
    });
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifs));
  } catch (e) {
    console.error('Failed to update admin notification', e);
  }

  // 3. Dispatch events for real-time reactivity in both admin and user storefront
  window.dispatchEvent(new Event('shivangi_orders_updated'));
  window.dispatchEvent(new Event('shivangi_notifications_updated'));
};
