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

function persistCart(items: CartItem[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent('ith_cart_changed'));
}

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

    // Sync across tabs
    const sync = () => setItems(loadCart());
    window.addEventListener('ith_cart_changed', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('ith_cart_changed', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const addToCart = useCallback((product: Product, size: string, color: string, quantity = 1) => {
    const key = `${product.id}-${size}-${color}`;
    const price = product.sale_price && product.sale_price > 0 ? product.sale_price : product.price;

    setItems(prev => {
      const existing = prev.findIndex(i => i.id === key);
      let next: CartItem[];
      if (existing > -1) {
        next = prev.map((item, idx) =>
          idx === existing ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        next = [...prev, { id: key, product, size, color, quantity, price }];
      }
      persistCart(next);
      return next;
    });

    setIsDrawerOpen(true);
  }, []);

  const updateQuantity = useCallback((id: string, delta: number) => {
    setItems(prev => {
      const next = prev
        .map(item => item.id === id ? { ...item, quantity: item.quantity + delta } : item)
        .filter(item => item.quantity > 0);
      persistCart(next);
      return next;
    });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setItems(prev => {
      const next = prev.filter(item => item.id !== id);
      persistCart(next);
      return next;
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    persistCart([]);
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
