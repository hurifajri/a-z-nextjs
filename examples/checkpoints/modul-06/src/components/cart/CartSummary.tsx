"use client";
import { useCart } from "./cart-context";

export default function CartSummary() {
  const { totalItems, reset } = useCart();
  return (
    <section className="space-y-3">
      <p>Total buku: {totalItems}</p>
      <button type="button" onClick={reset}>
        Kosongkan keranjang
      </button>
    </section>
  );
}
