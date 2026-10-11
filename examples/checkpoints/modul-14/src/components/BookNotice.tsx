"use client";
export default function BookNotice({ id }: { id: string }) {
  function showId() {
    window.alert("ID buku: " + id);
  }
  return (
    <button type="button" onClick={showId}>
      Lihat ID buku
    </button>
  );
}
