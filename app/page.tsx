// File: app/page.jsx (Home)
import Link from 'next/link';
export default function Home() {
  return (
    <section className="hero">
      <h2>Discover Handcrafted Treasures</h2>
      <p>Explore our marketplace of unique handmade products by local artisans.</p>
      <Link className="btn" href="/products">Shop Now</Link>
    </section>
  );
}
