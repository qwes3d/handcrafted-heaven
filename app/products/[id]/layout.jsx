import { Suspense } from "react";

export default function ProductDetailLayout({ children }) {
  return <Suspense fallback={<p>Loading product…</p>}>{children}</Suspense>;
}
