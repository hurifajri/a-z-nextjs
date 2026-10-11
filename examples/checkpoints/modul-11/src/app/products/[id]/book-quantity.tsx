"use client";
import { useState } from "react";
import BookControls from "./book-controls";
import AddToCart from "@/components/cart/add-to-cart";
import BookSummary from "./book-summary";

export default function BookQuantity() {
  const [quantity, setQuantity] = useState(1);
  function add() {
    setQuantity((q) => q + 1);
  }
  return (
    <section className="space-y-3">
      <BookControls quantity={quantity} onAdd={add} />
      <BookSummary quantity={quantity} />
      <AddToCart quantity={quantity} />
    </section>
  );
}
