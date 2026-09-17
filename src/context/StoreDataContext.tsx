/**
 * StoreDataContext — Single source of truth for all storefront data.
 * Reads from localStorage first (admin edits), falls back to seed data.
 * All pages/components use this context instead of importing static data directly.
 */
import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { Product, Store, CategoryItem } from '../types';
import { loadStore, loadHeroSlides, loadBankOffers, loadCoupons, loadCustomCategories, syncSettingsFromBackend } from '../data/adminData';
import { HeroSlide, bankOffers as seedBankOffers, coupons as seedCoupons } from '../data/offers';
import { categories as baseCategories, brands } from '../data/products';
import { getProducts } from '../utils/apiService';

interface StoreDataContextType {
  products: Product[];
  store: Store;
  heroSlides: HeroSlide[];
  bankOffers: typeof seedBankOffers;
  coupons: typeof seedCoupons;
  categories: CategoryItem[];
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
        // Sync database settings (payment QR, store address) concurrently
        syncSettingsFromBackend().catch(() => {/* ignore */});
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
    // 1. Load custom categories created by admin
    const savedCustom = loadCustomCategories();

    // 2. Build merged map starting with base categories
    const categoryMap = new Map<string, CategoryItem>();
    
    baseCategories.forEach(cat => {
      categoryMap.set(cat.id.toLowerCase(), { ...cat, isCustom: false });
    });

    savedCustom.forEach(cat => {
      categoryMap.set(cat.id.toLowerCase(), { ...cat, isCustom: true });
    });

    // 3. Scan products for any custom category strings not yet in list
    products.forEach(p => {
      if (p.category) {
        const raw = p.category.trim();
        const slug = raw.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        if (slug && !categoryMap.has(slug)) {
          const capitalized = raw.charAt(0).toUpperCase() + raw.slice(1);
          categoryMap.set(slug, {
            id: slug,
            name: capitalized,
            desc: `Explore ${capitalized} products`,
            icon: 'Tag',
            isCustom: true,
          });
        }
      }
    });

    // 4. Calculate real-time product counts for each category
    const dynamicCategories: CategoryItem[] = Array.from(categoryMap.values()).map(cat => {
      const cId = cat.id.toLowerCase();
      const cName = cat.name.toLowerCase();
      const count = products.filter(p => {
        const pCat = (p.category || '').toLowerCase().trim();
        const pSlug = pCat.replace(/[^a-z0-9]+/g, '-');
        return pCat === cId || pCat === cName || pSlug === cId;
      }).length;

      return {
        ...cat,
        itemCount: count,
        count,
      };
    });

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
