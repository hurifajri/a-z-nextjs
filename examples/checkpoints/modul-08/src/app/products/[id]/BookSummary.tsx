type Props = { quantity: number };

export default function BookSummary(props: Props) {
  const unitPrice = 50000;
  const total = props.quantity * unitPrice;

  return <p>Total latihan: {total} rupiah</p>;
}
