//@re/CartContext file
"use client"
import { createContext, useState, useEffect } from "react"

export const CartContext = createContext()

export default function CartProvider({ children }) {
  const [cart, setCart] = useState([])

  // load saved cart on first load
  useEffect(() => {
    const saved = localStorage.getItem("cart")
    if (saved) setCart(JSON.parse(saved))
  }, [])

  // save cart anytime it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart])

  function addToCart(product) {
    const exist = cart.find(i => i._id === product._id)
    if (exist) {
      updateQuantity(product._id, exist.qty + 1)
    } else {
      setCart([...cart, { ...product, qty: 1 }])
    }
  }

  function removeFromCart(id) {
    setCart(cart.filter(item => item._id !== id))
  }

  function updateQuantity(id, qty) {
    if (qty <= 0) return removeFromCart(id)
    setCart(cart.map(i => i._id === id ? { ...i, qty } : i))
  }

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0)

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, total }}>
      {children}
    </CartContext.Provider>
  )
}
