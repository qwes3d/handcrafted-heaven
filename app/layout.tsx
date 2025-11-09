
// File: app/layout.jsx
export const metadata = { title: 'Handcrafted Haven' };

import './globals.css';
import { CartProvider } from '../context/CartContext';
import Navbar from '../components/NavBar';

/**
 * The root layout component for the application.
 * It wraps the entire app with the necessary HTML elements,
 * including the CartProvider and the Navbar.
 * @param {React.ReactNode} children - The content to render inside the layout.
 * @returns {React.ReactElement} - The root layout component.
 */
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