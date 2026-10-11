"use client";
import { useState } from "react";
import BookControls from "./BookControls";
import AddToCart from "@/components/cart/AddToCart";
import BookSummary from "./BookSummary";

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
