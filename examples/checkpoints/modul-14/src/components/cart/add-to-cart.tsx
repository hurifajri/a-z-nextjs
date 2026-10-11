"use client";
import { useCart } from "./cart-context";

type Props = { quantity: number };

export default function AddToCart(props: Props) {
  const { addItems } = useCart();
  function add() {
    addItems(props.quantity);
  }
  return (
    <button type="button" onClick={add}>
      Tambah ke keranjang
    </button>
  );
}
