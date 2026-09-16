import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../types';
import { useToast } from './ToastContext';

interface CompareContextType {
  compareList: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: string) => void;
  isInCompare: (productId: string) => boolean;
  clearCompare: () => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

const COMPARE_KEY = 'shivangi_mobile_compare';

export const CompareProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { showToast } = useToast();
  const [compareList, setCompareList] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(COMPARE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(COMPARE_KEY, JSON.stringify(compareList));
    } catch {
      // Storage full
    }
  }, [compareList]);

  const isInCompare = (productId: string) => {
    return compareList.some(item => item.id === productId);
  };

  const addToCompare = (product: Product) => {
    if (isInCompare(product.id)) {
      removeFromCompare(product.id);
      return;
    }
    if (compareList.length >= 4) {
      showToast('You can compare up to 4 devices at once', 'error');
      return;
    }
    setCompareList(prev => [...prev, product]);
    showToast(`Added "${product.name}" to Compare!`, 'success');
  };

  const removeFromCompare = (productId: string) => {
    setCompareList(prev => prev.filter(item => item.id !== productId));
    showToast('Removed from Compare', 'info');
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  return (
    <CompareContext.Provider
      value={{
        compareList,
        addToCompare,
        removeFromCompare,
        isInCompare,
        clearCompare,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) throw new Error('useCompare must be used within CompareProvider');
  return context;
};
