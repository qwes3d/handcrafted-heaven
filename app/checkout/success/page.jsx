// app/checkout/success/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "@/lib/axiosInstance";

export default function CheckoutSuccessPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Protect page
  useEffect(() => {
    if (!session) {
      router.push("/login");
      return;
    }

    async function fetchLastOrder() {
      try {
        const res = await axios.get(`/orders?userId=${session.user.id}`);
        if (res.data.length > 0) {
          // get the latest order
          setOrder(res.data[res.data.length - 1]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchLastOrder();
  }, [session, router]);

  if (loading) return <p className="text-center py-10">Loading your order...</p>;
  if (!order)
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold mb-4">No recent orders found</h2>
      </div>
    );

  return (
    <section className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-green-600">Order Confirmed!</h1>
      <p className="mb-6">Thank you, {order.userId}. Your order has been successfully placed.</p>

      <div className="bg-white shadow rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-bold mb-2">Order Summary</h2>
        {order.items.map((item) => (
          <div key={item.productId} className="flex justify-between">
            <div>
              {item.title} x {item.quantity}
            </div>
            <div>${(item.price * item.quantity).toFixed(2)}</div>
          </div>
        ))}

        <div className="flex justify-between font-bold text-lg pt-4 border-t">
          <span>Total</span>
          <span>${order.total.toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={() => router.push("/")}
          className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition"
        >
          Continue Shopping
        </button>
      </div>
    </section>
  );
}
