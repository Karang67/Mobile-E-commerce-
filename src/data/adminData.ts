// Admin data hook — reads/writes products, offers, and store from localStorage
// Falls back to seed data when localStorage is empty or cleared.

import { Store, PaymentSettings, CategoryItem } from '../types';
import { demoStores } from './stores';
import { heroSlides, bankOffers, coupons, HeroSlide } from './offers';

const KEYS = {
  store: 'admin_store',
  heroSlides: 'admin_hero_slides',
  bankOffers: 'admin_bank_offers',
  coupons: 'admin_coupons',
  paymentSettings: 'admin_payment_settings',
  customCategories: 'admin_custom_categories',
  adminPassword: 'admin_password',
  adminSession: 'admin_session',
};

export function notifyDataChanged(): void {
  try {
    window.dispatchEvent(new CustomEvent('admin_data_changed'));
  } catch { /* ignore */ }
}


// ─── Store ───────────────────────────────────────────────────────────────────
export function loadStore(): Store {
  try {
    const raw = localStorage.getItem(KEYS.store);
    if (raw) {
      const parsed = JSON.parse(raw) as Store;
      if (parsed && parsed.city && parsed.city.toLowerCase() !== 'Sumerpur') return parsed;
    }
  } catch { /* ignore */ }
  return { ...demoStores[0] };
}

export function saveStore(store: Store): void {
  localStorage.setItem(KEYS.store, JSON.stringify(store));
  notifyDataChanged();

  const token = getAdminToken();
  if (token) {
    fetch(`${API_BASE}/settings/store_info`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ value: store }),
    }).catch(() => {/* ignore offline */});
  }
}

// ─── Hero Slides ─────────────────────────────────────────────────────────────
export function loadHeroSlides(): HeroSlide[] {
  try {
    const raw = localStorage.getItem(KEYS.heroSlides);
    if (raw) return JSON.parse(raw) as HeroSlide[];
  } catch { /* ignore */ }
  return [...heroSlides];
}

export function saveHeroSlides(slides: HeroSlide[]): void {
  localStorage.setItem(KEYS.heroSlides, JSON.stringify(slides));
  notifyDataChanged();
}

// ─── Bank Offers ─────────────────────────────────────────────────────────────
export type BankOffer = typeof bankOffers[number];

export function loadBankOffers(): BankOffer[] {
  try {
    const raw = localStorage.getItem(KEYS.bankOffers);
    if (raw) return JSON.parse(raw) as BankOffer[];
  } catch { /* ignore */ }
  return [...bankOffers];
}

export function saveBankOffers(offers: BankOffer[]): void {
  localStorage.setItem(KEYS.bankOffers, JSON.stringify(offers));
  notifyDataChanged();
}

// ─── Coupons ──────────────────────────────────────────────────────────────────
export type Coupon = typeof coupons[number];

export function loadCoupons(): Coupon[] {
  try {
    const raw = localStorage.getItem(KEYS.coupons);
    if (raw) return JSON.parse(raw) as Coupon[];
  } catch { /* ignore */ }
  return [...coupons];
}

export function saveCoupons(c: Coupon[]): void {
  localStorage.setItem(KEYS.coupons, JSON.stringify(c));
  notifyDataChanged();
}

// ─── Payment Settings ────────────────────────────────────────────────────────
export const defaultPaymentSettings: PaymentSettings = {
  enableQrScanner: true,
  enableCod: true,
  upiId: '7841976969@upi',
  payeeName: 'Shivangi Mobile Sumerpur',
  qrCodeImage: 'https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=upi://pay?pa=7841976969@upi&pn=Shivangi%20Mobile%20Sumerpur&cu=INR',
  instructions: 'Scan this QR code using any UPI app (GPay, PhonePe, Paytm, BHIM). After paying, upload the screenshot or enter UTR below.',
};

export function loadPaymentSettings(): PaymentSettings {
  try {
    const raw = localStorage.getItem(KEYS.paymentSettings);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.upiId !== 'shivangimobile@upi') {
        return { ...defaultPaymentSettings, ...parsed };
      }
    }
  } catch { /* ignore */ }
  return { ...defaultPaymentSettings };
}

export function savePaymentSettings(settings: PaymentSettings): void {
  localStorage.setItem(KEYS.paymentSettings, JSON.stringify(settings));
  notifyDataChanged();

  const token = getAdminToken();
  if (token) {
    fetch(`${API_BASE}/settings/payment_settings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ value: settings }),
    }).catch(() => {/* ignore offline */});
  }
}

/**
 * Synchronize payment settings and store details from MongoDB backend into local storage
 */
export async function syncSettingsFromBackend(): Promise<void> {
  try {
    const [payRes, storeRes] = await Promise.all([
      fetch(`${API_BASE}/settings/payment_settings`).catch(() => null),
      fetch(`${API_BASE}/settings/store_info`).catch(() => null),
    ]);

    let changed = false;

    if (payRes && payRes.ok) {
      const payData = await payRes.json();
      if (payData && typeof payData === 'object' && payData.upiId) {
        localStorage.setItem(KEYS.paymentSettings, JSON.stringify(payData));
        changed = true;
      }
    }

    if (storeRes && storeRes.ok) {
      const storeData = await storeRes.json();
      if (storeData && typeof storeData === 'object' && storeData.city) {
        localStorage.setItem(KEYS.store, JSON.stringify(storeData));
        changed = true;
      }
    }

    if (changed) {
      notifyDataChanged();
    }
  } catch {
    // Backend offline or unreachable
  }
}

// ─── Auth (SEC-003 FIX: Server-side JWT Authentication) ──────────────────────
// The admin password is NO LONGER stored in localStorage or hardcoded in source.
// Authentication is handled by POST /api/auth/login on the Express backend.
// The returned JWT is stored in sessionStorage (cleared when tab is closed).

const ADMIN_TOKEN_KEY = 'admin_jwt_token';
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

/** Returns the stored admin JWT, or null if not logged in */
export function getAdminToken(): string | null {
  return sessionStorage.getItem(ADMIN_TOKEN_KEY);
}

/** Checks if a non-expired JWT is present (client-side heuristic check only).
 *  The actual authorization check happens on the backend for every request. */
export function isAdminLoggedIn(): boolean {
  return !!getAdminToken();
}

/** Authenticates against the backend. Returns { success, error }. */
export async function adminLogin(pwd: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pwd }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || 'Login failed. Please check your password.' };
    }

    // Store JWT in sessionStorage — cleared when browser tab closes
    sessionStorage.setItem(ADMIN_TOKEN_KEY, data.token);
    return { success: true };
  } catch {
    return { success: false, error: 'Cannot reach server. Please check your connection.' };
  }
}

/** Changes admin password securely on the backend */
export async function changeAdminPasswordOnBackend(currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
  const token = getAdminToken();
  if (!token) {
    return { success: false, error: 'You must be logged in as admin to change password.' };
  }

  try {
    const response = await fetch(`${API_BASE}/auth/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    const data = await response.json();
    if (!response.ok) {
      return { success: false, error: data.error || 'Failed to update password.' };
    }

    return { success: true };
  } catch {
    return { success: false, error: 'Cannot connect to backend server. Please try again.' };
  }
}

/** Clears the JWT session — also calls server logout endpoint */
export async function adminLogout(): Promise<void> {
  const token = getAdminToken();
  sessionStorage.removeItem(ADMIN_TOKEN_KEY);
  if (token) {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {/* ignore network errors on logout */});
    } catch { /* ignore */ }
  }
}

// Legacy shims — these no longer do anything meaningful but prevent import errors
// in files that still reference them. Remove in next refactor cycle.
export function getAdminPassword(): string { return ''; }
export function setAdminPassword(_pwd: string): void { /* no-op — password is server-side */ }


// ─── Custom Categories ────────────────────────────────────────────────────────
export function loadCustomCategories(): CategoryItem[] {
  try {
    const raw = localStorage.getItem(KEYS.customCategories);
    if (raw) return JSON.parse(raw) as CategoryItem[];
  } catch { /* ignore */ }
  return [];
}

export function saveCustomCategories(cats: CategoryItem[]): void {
  localStorage.setItem(KEYS.customCategories, JSON.stringify(cats));
  notifyDataChanged();
}

export function addCustomCategory(name: string, desc = '', icon = 'Tag'): CategoryItem {
  const trimmed = name.trim();
  const id = trimmed.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const existing = loadCustomCategories();

  const found = existing.find(c => c.id === id);
  if (found) return found;

  const newCat: CategoryItem = {
    id,
    name: trimmed,
    desc: desc || `Explore all ${trimmed} products`,
    icon: icon || 'Tag',
    isCustom: true,
  };

  saveCustomCategories([...existing, newCat]);
  return newCat;
}

export function deleteCustomCategory(id: string): void {
  const existing = loadCustomCategories();
  saveCustomCategories(existing.filter(c => c.id !== id));
}

// ─── Reset ────────────────────────────────────────────────────────────────────
export function resetAllData(): void {
  Object.values(KEYS).forEach(k => {
    if (k !== KEYS.adminPassword) localStorage.removeItem(k);
  });
}
