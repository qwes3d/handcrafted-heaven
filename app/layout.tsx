
// File: app/layout.jsx
export const metadata = { title: 'Handcrafted Haven' };

import './globals.css';
import { CartProvider } from '../context/CartContext';
import Navbar from '../components/Navbar';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Navbar />
          <main>{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}