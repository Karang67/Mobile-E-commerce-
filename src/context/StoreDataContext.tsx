/**
 * StoreDataContext — Single source of truth for all storefront data.
 * Reads from localStorage first (admin edits), falls back to seed data.
 * All pages/components use this context instead of importing static data directly.
 */
import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { Product, Store } from '../types';
import { loadStore, loadHeroSlides, loadBankOffers, loadCoupons } from '../data/adminData';
import { HeroSlide, bankOffers as seedBankOffers, coupons as seedCoupons } from '../data/offers';
import { categories, brands } from '../data/products';
import { getProducts } from '../utils/apiService';

interface StoreDataContextType {
  products: Product[];
  store: Store;
  heroSlides: HeroSlide[];
  bankOffers: typeof seedBankOffers;
  coupons: typeof seedCoupons;
  categories: typeof categories;
  brands: typeof brands;
  isLoading: boolean;
  refresh: () => void;
}

const StoreDataContext = createContext<StoreDataContextType | undefined>(undefined);

export const StoreDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tick, setTick] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(() => setTick(t => t + 1), []);

  useEffect(() => {
    const handleUpdate = () => refresh();
    window.addEventListener('admin_data_changed', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('focus', handleUpdate);
    return () => {
      window.removeEventListener('admin_data_changed', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('focus', handleUpdate);
    };
  }, [refresh]);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [tick]);

  const value: StoreDataContextType = React.useMemo(() => {
    const dynamicCategories = categories.map(cat => ({
      ...cat,
      itemCount: products.filter(p => p.category === cat.id).length
    }));

    const dynamicBrands = brands.map(brand => ({
      ...brand,
      count: products.filter(p => p.brand.toLowerCase() === brand.name.toLowerCase()).length
    }));

    return {
      products,
      store: loadStore(),
      heroSlides: loadHeroSlides(),
      bankOffers: loadBankOffers(),
      coupons: loadCoupons(),
      categories: dynamicCategories,
      brands: dynamicBrands,
      isLoading,
      refresh,
    };
  }, [products, tick, refresh, isLoading]);

  return (
    <StoreDataContext.Provider value={value}>
      {children}
    </StoreDataContext.Provider>
  );
};

export const useStoreData = (): StoreDataContextType => {
  const ctx = useContext(StoreDataContext);
  if (!ctx) throw new Error('useStoreData must be used within StoreDataProvider');
  return ctx;
};
