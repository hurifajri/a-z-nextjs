"use client";
import { useState, type ReactNode } from "react";
import { CartContext } from "./cart-context";

type Props = { children: ReactNode };

export default function CartProvider({ children }: Props) {
  const [totalItems, setTotalItems] = useState(0);
  function addItems(amount: number) {
    setTotalItems((n) => n + amount);
  }
  const reset = () => setTotalItems(0);

  return (
    <CartContext value={{ totalItems, addItems, reset }}>
      {children}
    </CartContext>
  );
}
