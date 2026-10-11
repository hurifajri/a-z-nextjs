// Lab browser saja: Response simulasi, bukan server HTTP sungguhan.
export async function searchFixture(keyword: string, signal?: AbortSignal) {
  const scenario = sessionStorage.getItem("book-search-scenario") ?? "success";
  if (scenario === "slow") {
    await new Promise<void>((resolve, reject) => {
      if (signal?.aborted) return reject(signal.reason);
      const cancel = () => {
        clearTimeout(timer);
        reject(signal?.reason);
      };
      const timer = setTimeout(() => {
        signal?.removeEventListener("abort", cancel);
        resolve();
      }, 1500);
      signal?.addEventListener("abort", cancel, { once: true });
    });
  }
  if (scenario === "error")
    return Response.json({ error: "Simulasi" }, { status: 500 });
  if (scenario === "invalid") return Response.json({ docs: "bukan array" });
  if (scenario === "empty") return Response.json({ docs: [] });
  const res = await fetch("/fixtures/search.json", { signal });
  if (!res.ok) return res;
  const data = (await res.json()) as { docs: { key: string; title: string }[] };
  return Response.json({
    docs: data.docs.filter((book) =>
      book.title.toLowerCase().includes(keyword.toLowerCase()),
    ),
  });
}
