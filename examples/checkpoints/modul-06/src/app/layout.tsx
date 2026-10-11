import type { ReactNode } from "react";
import "./globals.css";
import Navbar from "@/components/nav-bar";
import CartProvider from "@/components/cart/cart-provider";
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <body>
        <CartProvider>
          <header className="p-4 border-b">
            <Navbar />
          </header>
          {children}
          <footer className="p-4 border-t">
            Toko Belajar · Aplikasi latihan
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
