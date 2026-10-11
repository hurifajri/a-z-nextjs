type Props = {
  quantity: number;
  onAdd: () => void;
};

export default function BookControls(props: Props) {
  return (
    <button type="button" onClick={props.onAdd}>
      Jumlah: {props.quantity} (+1)
    </button>
  );
}
