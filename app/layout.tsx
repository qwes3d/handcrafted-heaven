import AuthProvider from '../context/AuthContext'; // should be client if it uses hooks
import CartProvider from '@/context/CartContext';
import NavBar from '@/components/NavBar';
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
