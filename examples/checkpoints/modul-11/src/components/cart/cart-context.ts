"use client";
import { createContext, useContext } from "react";

export type CartValue = {
  totalItems: number;
  addItems: (amount: number) => void;
  reset: () => void;
};

export const CartContext = createContext<CartValue | null>(null);

export function useCart() {
  const value = useContext(CartContext);
  if (value === null) throw new Error("CartProvider belum dipasang");
  return value;
}
