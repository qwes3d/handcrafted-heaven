"use client";
import { useContext } from "react";
import { CartContext } from "@/rev/CartContext";
import Link from "next/link";

export default function CartPage() {
  const { cartItems, removeFromCart } = useContext(CartContext);

  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  // Empty cart UI
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
    <section className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      <div className="space-y-4">
        {cartItems.map((item) => (
          <div
            key={item._id}
            className="flex items-center justify-between bg-white p-4 rounded-lg shadow"
          >
            <div className="flex items-center gap-4">
              <img
                src={item.images?.[0] || "/images/placeholder.jpg"}
                className="w-20 h-20 object-cover rounded"
                alt={item.name}
              />
              <div>
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-gray-600">${item.price}</p>
              </div>
            </div>

            <button
              onClick={() => removeFromCart(item._id)}
              className="text-red-600 hover:text-red-800 font-medium"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Total: ${total.toFixed(2)}</h2>

        <Link
          href="/checkout"
          className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700"
        >
          Proceed to Checkout
        </Link>
      </div>
    </section>
  );
}
