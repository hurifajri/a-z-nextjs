import type { ReactNode } from "react";
import "./globals.css";
import QueryProvider from "@/components/QueryProvider";
import Navbar from "@/components/Navbar";
import CartProvider from "@/components/cart/CartProvider";
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <body>
        <CartProvider>
          <header className="p-4 border-b">
            <Navbar />
          </header>
          <QueryProvider>{children}</QueryProvider>
          <footer className="p-4 border-t">
            Toko Belajar · Aplikasi latihan
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
