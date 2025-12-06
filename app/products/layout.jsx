import { Suspense } from "react";

export default function ProductsLayout({ children }) {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      {children}
    </Suspense>
  );
}
