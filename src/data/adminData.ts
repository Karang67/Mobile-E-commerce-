// Admin data hook — reads/writes products, offers, and store from localStorage
// Falls back to seed data when localStorage is empty or cleared.

import { Store } from '../types';
import { demoStores } from './stores';
import { heroSlides, bankOffers, coupons, HeroSlide } from './offers';

const KEYS = {
  store: 'admin_store',
  heroSlides: 'admin_hero_slides',
  bankOffers: 'admin_bank_offers',
  coupons: 'admin_coupons',
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
    if (raw) return JSON.parse(raw) as Store;
  } catch { /* ignore */ }
  return { ...demoStores[0] };
}

export function saveStore(store: Store): void {
  localStorage.setItem(KEYS.store, JSON.stringify(store));
  notifyDataChanged();
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

// ─── Auth ─────────────────────────────────────────────────────────────────────
export function getAdminPassword(): string {
  return localStorage.getItem(KEYS.adminPassword) || 'vinod67@';
}

export function setAdminPassword(pwd: string): void {
  localStorage.setItem(KEYS.adminPassword, pwd);
}

export function isAdminLoggedIn(): boolean {
  return localStorage.getItem(KEYS.adminSession) === '1';
}

export function adminLogin(pwd: string): boolean {
  if (pwd === getAdminPassword()) {
    localStorage.setItem(KEYS.adminSession, '1');
    return true;
  }
  return false;
}

export function adminLogout(): void {
  localStorage.removeItem(KEYS.adminSession);
}

// ─── Reset ────────────────────────────────────────────────────────────────────
export function resetAllData(): void {
  Object.values(KEYS).forEach(k => {
    if (k !== KEYS.adminPassword) localStorage.removeItem(k);
  });
}
