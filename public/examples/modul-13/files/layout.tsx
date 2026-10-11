import type { ReactNode } from "react";
import "./globals.css";
import QueryProvider from "@/components/query-provider";
import Navbar from "@/components/nav-bar";
import CartProvider from "@/components/cart/cart-provider";
import type { Metadata } from "next";
import localFont from "next/font/local";

const geist = localFont({
  src: "./fonts/geist-sans.ttf",
  display: "swap",
  variable: "--font-geist-sans",
});
export const metadata: Metadata = {
  title: { default: "Toko Belajar", template: "%s | Toko Belajar" },
  description: "Katalog buku dan usulan bacaan untuk belajar web.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <body className={`${geist.variable} antialiased`}>
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
