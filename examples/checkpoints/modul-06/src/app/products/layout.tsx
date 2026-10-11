import type { ReactNode } from "react";
export default function ProductsLayout({ children }: { children: ReactNode }) {
  return (
    <section>
      <p className="px-8 pt-4">Area Katalog</p>
      {children}
    </section>
  );
}
