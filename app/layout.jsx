// app/layout.jsx
"use client";

import { SessionProvider } from "next-auth/react";
import AuthProvider from "@/rev/AuthContext";
import {CartProvider} from "@/rev/CartContext";
import NavBar from "@/ui/NavBar";
import FloatingContact from "@/ui/floatingcontact";
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <AuthProvider>
            <CartProvider>
              <NavBar />
              <main>{children}</main>
              <FloatingContact />
            </CartProvider>
          </AuthProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
