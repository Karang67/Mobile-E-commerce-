import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Product } from '../types';
import { loadCoupons } from '../data/adminData';
import { useToast } from './ToastContext';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedRam?: string, selectedStorage?: string, selectedColor?: string) => boolean;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  appliedCoupon: { code: string; discountAmount: number } | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'shivangi_mobile_cart';
const COUPON_STORAGE_KEY = 'shivangi_mobile_coupon';

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { showToast } = useToast();
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountAmount: number } | null>(() => {
    try {
      const saved = localStorage.getItem(COUPON_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // Storage full or unavailable
    }
  }, [cart]);

  useEffect(() => {
    try {
      if (appliedCoupon) {
        localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem(COUPON_STORAGE_KEY);
      }
    } catch {
      // Ignore
    }
  }, [appliedCoupon]);

  const addToCart = (
    product: Product,
    quantity: number = 1,
    selectedRam?: string,
    selectedStorage?: string,
    selectedColor?: string
  ): boolean => {
    if (!product.inStock) {
      showToast(`${product.name} is currently out of stock.`, 'error');
      return false;
    }

    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(item => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          selectedRam: selectedRam || updated[existingIndex].selectedRam,
          selectedStorage: selectedStorage || updated[existingIndex].selectedStorage,
          selectedColor: selectedColor || updated[existingIndex].selectedColor,
        };
        return updated;
      } else {
        return [
          ...prevCart,
          {
            product,
            quantity,
            selectedRam: selectedRam || product.ram,
            selectedStorage: selectedStorage || product.storage,
            selectedColor: selectedColor || product.color,
          },
        ];
      }
    });

    showToast(`Added "${product.name}" to cart!`, 'success');
    return true;
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
    showToast('Item removed from cart', 'info');
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = (code: string): boolean => {
    const trimmed = code.trim().toUpperCase();
    const availableCoupons = loadCoupons();
    const coupon = availableCoupons.find(c => c.code === trimmed);

    if (!coupon) {
      showToast('Invalid coupon code. Try SHIVANGI500 or BIGC1000', 'error');
      return false;
    }

    const currentSubtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    if (currentSubtotal < coupon.minCartValue) {
      showToast(`Coupon requires minimum cart value of ₹${coupon.minCartValue.toLocaleString('en-IN')}`, 'error');
      return false;
    }

    setAppliedCoupon({
      code: coupon.code,
      discountAmount: coupon.discountAmount,
    });
    showToast(`Coupon "${coupon.code}" applied! You saved ₹${coupon.discountAmount.toLocaleString('en-IN')}`, 'success');
    return true;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed', 'info');
  };

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const couponDiscount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const discount = Math.min(couponDiscount, subtotal);
  const deliveryFee = 0; // 100% Free Store Pickup
  const total = Math.max(0, subtotal - discount + deliveryFee);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        subtotal,
        discount,
        deliveryFee,
        total,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
