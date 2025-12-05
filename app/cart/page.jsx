"use client";
import { useContext } from "react";
import { CartContext } from "@/rev/CartContext";
import Link from "next/link";

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity } = useContext(CartContext);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="p-10 text-center text-gray-600">
        <h2 className="text-2xl font-semibold mb-3">Your cart is empty</h2>
        <Link
          href="/products"
          className="text-indigo-600 hover:underline font-medium"
        >
          Shop products →
        </Link>
      </div>
    );
  }

  return (
    <section className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Cart</h1>

      <div className="space-y-6">
        {cartItems.map((item) => (
          <div
            key={item._id}
            className="flex flex-col sm:flex-row items-center sm:items-start justify-between bg-white p-4 rounded-lg shadow"
          >
            <div className="flex items-center gap-4">
              <img
                src={item.images?.[0] || "/images/placeholder.jpg"}
                className="w-24 h-24 object-cover rounded"
                alt={item.name}
              />
              <div>
                <h3 className="font-semibold text-gray-800">{item.name}</h3>
                <p className="text-gray-600">${item.price.toFixed(2)}</p>
              </div>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-2 mt-4 sm:mt-0">
              <button
                aria-label={`Decrease quantity of ${item.name}`}
                onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
                className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                -
              </button>

              <span
                aria-live="polite"
                className="w-12 h-12 flex items-center justify-center font-bold text-xl text-gray-900 bg-gray-100 rounded-full border"
              >
                {item.quantity}
              </span>

              <button
                aria-label={`Increase quantity of ${item.name}`}
                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                +
              </button>
            </div>

            <button
              onClick={() => removeFromCart(item._id)}
              className="text-red-600 hover:text-red-800 font-medium mt-4 sm:mt-0"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col sm:flex-row justify-between items-center bg-white p-6 rounded-lg shadow">
        <div className="text-lg font-semibold text-gray-800">
          Total ({totalItems} items): ${total.toFixed(2)}
        </div>

        <Link
          href="/checkout"
          className="mt-4 sm:mt-0 bg-indigo-600 text-white px-6 py-3 rounded-lg text-lg font-bold hover:bg-indigo-700 transition"
        >
          Proceed to Checkout
        </Link>
      </div>
    </section>
  );
}
