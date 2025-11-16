import AuthProvider from '@/rev/AuthContext'; // should be client if it uses hooks
import CartProvider from '@/rev/CartContext';
import NavBar from '@/ui/NavBar';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <CartProvider>
            <NavBar />
            <main>{children}</main>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
