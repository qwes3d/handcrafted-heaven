
// File: app/cart/page.jsx

"use client"
import { useContext } from 'react';
import { CartContext } from '../../context/CartContext';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, total } = useContext(CartContext);

  if (cart.length === 0) return <p>No items in cart.</p>;

  return (
    <section className="cart">
      <h3>Your Cart</h3>
      <ul>
        {cart.map(item => (
          <li key={item._id}>
            <div>{item.name}</div>
            <div>${item.price}</div>
            <input type="number" value={item.quantity} min={1} onChange={(e)=>updateQuantity(item._id, Number(e.target.value))} />
            <button onClick={()=>removeFromCart(item._id)}>Remove</button>
          </li>
        ))}
      </ul>
      <h4>Total: ${total.toFixed(2)}</h4>
    </section>
  );
}
