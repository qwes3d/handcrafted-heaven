// app/checkout/page.jsx
"use client";

import { useContext, useState, useEffect } from "react";
import { CartContext } from "@/rev/CartContext";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "@/lib/axiosInstance";

export default function CheckoutPage() {
  const { cartItems, total, clearCart } = useContext(CartContext);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card"); // "card" | "mobile"

  // Protect page
  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  // Show message while loading session
  if (status === "loading") {
    return <p className="text-center py-10">Loading...</p>;
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="max-w-3xl mx-auto py-10 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <p>Add some products before checking out.</p>
      </div>
    );
  }

  const handleCheckout = async () => {
    setLoading(true);
    try {
      if (paymentMethod === "card") {
        // Stripe checkout
        const res = await axios.post("/stripe/checkout_sessions", {
          items: cartItems.map((i) => ({
            _id: i._id,
            title: i.name,
            price: i.price,
            quantity: i.quantity,
            image: i.image || "",
          })),
          userId: session.user.id,
        });

        if (res.data.url) {
          window.location.href = res.data.url; // redirect to Stripe
        } else {
          alert("Stripe session creation failed.");
        }
      } else {
        // Mobile Money checkout (mock example)
        const res = await axios.post("/orders", {
          userId: session.user.id,
          items: cartItems.map((i) => ({
            productId: i._id,
            title: i.name,
            price: i.price,
            quantity: i.quantity,
          })),
          total,
          paymentMethod: "mobile",
        });

        if (res.status === 201) {
          clearCart();
          router.push("/checkout/success");
        } else {
          alert("Mobile Money checkout failed.");
        }
      }
    } catch (err) {
      console.error(err);
      alert("Checkout failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <div className="bg-white shadow rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold mb-2">Order Summary</h2>
        {cartItems.map((item) => (
          <div key={item._id} className="flex justify-between">
            <div>
              {item.name} x {item.quantity}
            </div>
            <div>${(item.price * item.quantity).toFixed(2)}</div>
          </div>
        ))}

        <div className="flex justify-between font-bold text-lg pt-4 border-t">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>

        {/* Payment Method Selector */}
        <div className="mt-4">
          <label className="mr-4 font-medium">Payment Method:</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="border rounded px-3 py-2 text-base font-semibold text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="card">Card (Stripe)</option>
            <option value="mobile">Mobile Money</option>
          </select>
        </div>

        <button
          className={`w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition mt-4 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handleCheckout}
          disabled={loading}
        >
          {loading ? "Processing..." : "Confirm Order"}
        </button>
      </div>
    </section>
  );
}
