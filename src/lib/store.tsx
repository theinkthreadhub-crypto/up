'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product } from '@/types/database';

export interface CartItem {
  id: string; // productId-size-color
  product: Product;
  size: string;
  color: string;
  quantity: number;
  price: number;
}

interface CartContextValue {
  items: CartItem[];
  totalItemCount: number;
  subtotal: number;
  discountAmount: number;
  discountPercent: number;
  couponCode: string;
  shippingFee: number;
  taxAmount: number;
  totalAmount: number;
  freeShippingThreshold: number;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  addToCart: (product: Product, size: string, color: string, quantity?: number) => void;
  updateQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
}

const CART_KEY = 'ith_cart_v3';
const COUPON_KEY = 'ith_coupon_v3';

const CartContext = createContext<CartContextValue | null>(null);

function loadCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// Removed persistCart function as we'll use useEffect

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    setMounted(true);
    setItems(loadCart());

    const saved = localStorage.getItem(COUPON_KEY);
    if (saved === 'STREET20') { setCouponCode('STREET20'); setDiscountPercent(20); }
    else if (saved === 'INKDROP10') { setCouponCode('INKDROP10'); setDiscountPercent(10); }

    // Sync across tabs (only fires when other tabs change localStorage)
    const sync = (e: StorageEvent) => {
      if (e.key === CART_KEY) setItems(loadCart());
    };
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('storage', sync);
    };
  }, []);

  // Persist cart state to localStorage whenever it changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    }
  }, [items, mounted]);

  const addToCart = useCallback((product: Product, size: string, color: string, quantity = 1) => {
    const key = `${product.id}-${size}-${color}`;
    const price = product.sale_price && product.sale_price > 0 ? product.sale_price : product.price;

    setItems(prev => {
      const existing = prev.findIndex(i => i.id === key);
      if (existing > -1) {
        return prev.map((item, idx) =>
          idx === existing ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { id: key, product, size, color, quantity, price }];
    });

    setIsDrawerOpen(true);
  }, []);

  const updateQuantity = useCallback((id: string, delta: number) => {
    setItems(prev => 
      prev
        .map(item => item.id === id ? { ...item, quantity: item.quantity + delta } : item)
        .filter(item => item.quantity > 0)
    );
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const applyCoupon = useCallback((code: string): { success: boolean; message: string } => {
    const normalized = code.trim().toUpperCase();
    if (normalized === 'STREET20') {
      setCouponCode('STREET20'); setDiscountPercent(20);
      localStorage.setItem(COUPON_KEY, 'STREET20');
      return { success: true, message: '20% Streetwear Discount Applied!' };
    }
    if (normalized === 'INKDROP10') {
      setCouponCode('INKDROP10'); setDiscountPercent(10);
      localStorage.setItem(COUPON_KEY, 'INKDROP10');
      return { success: true, message: '10% Drop Discount Applied!' };
    }
    return { success: false, message: 'Invalid or expired coupon code' };
  }, []);

  const removeCoupon = useCallback(() => {
    setCouponCode(''); setDiscountPercent(0);
    localStorage.removeItem(COUPON_KEY);
  }, []);

  const displayItems = mounted ? items : [];
  const subtotal = displayItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const freeShippingThreshold = 999;
  const shippingFee = subtotal >= freeShippingThreshold || displayItems.length === 0 ? 0 : 99;
  const taxAmount = Math.round((subtotal - discountAmount) * 0.05);
  const totalAmount = Math.max(0, subtotal - discountAmount + shippingFee);
  const totalItemCount = displayItems.reduce((c, i) => c + i.quantity, 0);

  return (
    <CartContext.Provider value={{
      items: displayItems,
      totalItemCount,
      subtotal,
      discountAmount,
      discountPercent,
      couponCode,
      shippingFee,
      taxAmount,
      totalAmount,
      freeShippingThreshold,
      isDrawerOpen,
      setIsDrawerOpen,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      applyCoupon,
      removeCoupon,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
