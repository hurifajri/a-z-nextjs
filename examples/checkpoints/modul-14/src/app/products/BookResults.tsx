import BookHits from "./BookHits";
import type { BookHit } from "@/lib/book-search";
type Props = {
  books?: BookHit[];
  fetching: boolean;
  failed: boolean;
  onRefresh: () => void;
};
export default function BookResults(props: Props) {
  return (
    <div>
      <button onClick={props.onRefresh} disabled={props.fetching}>
        {props.fetching ? "Memperbarui…" : "Muat ulang"}
      </button>
      {props.failed && (
        <p role="alert">Gagal mengambil data. Coba muat ulang.</p>
      )}
      {props.books && <BookHits books={props.books} />}
    </div>
  );
}
