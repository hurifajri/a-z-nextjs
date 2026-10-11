"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import CartLink from "@/components/cart/cart-link";
export default function Navbar() {
  const pathname = usePathname();
  return (
    <nav aria-label="Navigasi utama" className="flex flex-wrap gap-4">
      <Link href="/">Beranda</Link>
      <Link
        href="/products"
        aria-current={pathname === "/products" ? "page" : undefined}
        className="aria-[current=page]:font-bold"
      >
        Katalog
      </Link>
      <CartLink />
      <Link href="/about">Tentang</Link>
    </nav>
  );
}
