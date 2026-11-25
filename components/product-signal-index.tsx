import Link from "next/link";
import { productCategories } from "@/lib/content";

function TechnicalMark({ slug }: { slug: string }) {
  const paths: Record<string, string> = {
    processors: "M5 12h7v7H5zM20 5h7v7h-7zM12 16l8-5M9 5v14M23 16v14",
    mcu: "M7 7h18v18H7zM12 12h8v8h-8zM3 12h4m-4 8h4m18-8h4m-4 8h4",
    analog: "M3 20c5 0 5-12 10-12s5 12 10 12 5-12 10-12M3 25h30",
    power: "M18 3 8 18h8l-2 12 11-17h-8l1-10ZM4 27h8m14 0h7",
    rf: "M6 25a14 14 0 0 1 14-14M11 25a9 9 0 0 1 9-9M16 25a4 4 0 0 1 4-4M22 25h.1M26 6l4 4-4 4",
    memory: "M5 8h22v16H5zM9 12h14M9 16h14M9 20h8M12 4v4m8-4v4M12 24v4m8-4v4",
  };
  return <svg viewBox="0 0 32 32" aria-hidden="true"><path d={paths[slug] ?? paths.processors} /></svg>;
}

export function ProductSignalIndex() {
  return (
    <div className="signal-product-index">
      {productCategories.slice(0, 6).map((item) => (
        <Link href={`/line-card#${item.slug}`} key={item.slug}>
          <TechnicalMark slug={item.slug} />
          <span><strong>{item.title}</strong><small>{item.examples.slice(0, 2).join(" · ")}</small></span>
          <span className="signal-product-index__arrow" aria-hidden="true">↗</span>
        </Link>
      ))}
    </div>
  );
}
