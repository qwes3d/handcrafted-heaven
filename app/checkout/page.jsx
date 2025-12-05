// app/checkout/page.jsx
"use client";

import { useContext, useState, useEffect } from "react";
import { CartContext } from "@/rev/CartContext";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
// import axios from "@/lib/axiosInstance"; // checkout logic commented out

export default function CheckoutPage() {
  const { cartItems, total, clearCart } = useContext(CartContext);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [comingSoon, setComingSoon] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  if (status === "loading") return <p className="text-center py-10">Loading...</p>;

  if (!cartItems || cartItems.length === 0)
    return (
      <div className="max-w-3xl mx-auto py-10 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <p>Add some products before checking out.</p>
      </div>
    );

  const handleCheckout = async () => {
    // Show Coming Soon
    setComingSoon(true);

    /*
    // Original checkout logic commented out
    setLoading(true);
    try { ... } catch(err) { ... } finally { setLoading(false); }
    */
  };

  if (comingSoon) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 text-center">
        <div className="animate-bounce mb-6 text-indigo-600 text-8xl">🚀</div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Coming Soon!</h1>
        <p className="text-gray-600 text-lg max-w-md">
          Checkout functionality is temporarily disabled. Stay tuned, exciting updates are on the way!
        </p>
        <button
          onClick={() => setComingSoon(false)}
          className="mt-8 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-indigo-700 transition"
        >
          Go Back to Cart
        </button>
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 text-center">Checkout</h1>

      <div className="lg:flex lg:gap-8">
        {/* Left: Products List */}
        <div className="flex-1 space-y-6">
          {cartItems.map((item) => (
            <div
              key={item._id}
              className="flex items-center gap-4 p-4bg-white shadow rounded-lg"
            >
              <img
                src={item.image || "/placeholder.webp"}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-md border"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-800">{item.name}</p>
                <p className="text-gray-500">Quantity: {item.quantity}</p>
              </div>
              <div className="font-semibold text-gray-900">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        {/* Right: Sticky Summary */}
        <div className="mt-6 lg:mt-0 lg:w-80 lg:sticky lg:top-24">
          <div className="bg-white shadow-lg rounded-xl p-6 space-y-6">
            <h2 className="text-xl font-semibold">Order Summary</h2>

            <div className="space-y-3">
              {cartItems.map((item) => (
                <div key={item._id} className="fle x justify-between text-gray-700">
                  <span>{item.name} x {item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between font-bold text-lg text-gray-900 pt-4 border-t">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            {/* Payment Method */}
            <div className="mt-4">
              <label className="block mb-2 font-medium">Payment Method:</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="border rounded-lg px-4 py-2 text-gray-900 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="card">Card (Stripe)</option>
                <option value="mobile">Mobile Money</option>
              </select>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading}
              className={`w-full bg-indigo-600 text-white py-3 rounded-lg text-lg font-bold shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Processing..." : "Confirm Order"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
