
// File: context/CartContext.jsx
'use client';
import { createContext, useEffect, useState } from 'react';
export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const raw = localStorage.getItem('cart');
      return raw ? JSON.parse(raw) : [];
    } catch (e) { return []; }
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  function addToCart(product) {
    setCart(prev => {
      if (prev.find(i => i._id === product._id)) return prev;
      return [...prev, { ...product, quantity: 1 }];
    });
  }

  function removeFromCart(_id) {
    setCart(prev => prev.filter(i => i._id !== _id));
  }

  function updateQuantity(_id, qty) {
    setCart(prev => prev.map(i => i._id === _id ? { ...i, quantity: qty } : i));
  }

  const total = cart.reduce((s, i) => s + (i.price || 0) * (i.quantity || 1), 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, total }}>
      {children}
    </CartContext.Provider>
  );
}
