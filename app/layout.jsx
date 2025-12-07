// app/layout.jsx

import { SessionProvider } from "next-auth/react";
import AuthProvider from "@/rev/AuthContext";
import {CartProvider} from "@/rev/CartContext";
import NavBar from "@/ui/NavBar";
import FloatingContact from "@/ui/floatingcontact";
import '@/app/globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Handcrafted Haven - Shop authentic handmade products" />
      </head>
      <body>
        <SessionProvider>
          <AuthProvider>
            <CartProvider>
              <NavBar />
              <main id="main-content" role="main">
                {children}
              </main>
              <FloatingContact />
              <footer role="contentinfo" className="bg-gray-900 text-white text-center py-4 mt-8">
                <p>&copy; 2025 Handcrafted Haven. All rights reserved.</p>
              </footer>
            </CartProvider>
          </AuthProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
