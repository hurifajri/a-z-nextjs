"use client";
import Link from "next/link";
import { useCart } from "./cart-context";

export default function CartLink() {
  const { totalItems } = useCart();
  return <Link href="/cart">Keranjang ({totalItems})</Link>;
}
