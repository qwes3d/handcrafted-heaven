"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function SuccessPage() {
  const params = useSearchParams();
  const orderId = params.get("orderId");

  return (
    <section className="max-w-3xl mx-auto text-center p-10">
      <h1 className="text-4xl font-bold text-green-600">Order Complete 🎉</h1>

      <p className="mt-4 text-lg text-gray-700">
        Thank you for your purchase! Your order has been placed successfully.
      </p>

      <p className="mt-2 text-sm text-gray-500">
        Order ID: <span className="font-semibold">{orderId}</span>
      </p>

      <Link
        href="/products"
        className="inline-block mt-6 px-6 py-3 bg-indigo-600 text-white rounded-lg"
      >
        Continue Shopping
      </Link>
    </section>
  );
}
