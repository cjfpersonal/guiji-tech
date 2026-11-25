import Link from "next/link";
import { productCategories } from "@/lib/content";

export function ProductShowcase() {
  return (
    <div className="product-showcase">
      {productCategories.slice(0, 6).map((item) => (
        <Link className="product-tile" href={`/line-card#${item.slug}`} key={item.slug}>
          <span className="product-tile__top">
            <span className="product-tile__icon" aria-hidden="true">
              <svg viewBox="0 0 32 32"><rect x="8" y="8" width="16" height="16" rx="4" /><path d="M12 3v5m8-5v5M12 24v5m8-5v5M3 12h5m-5 8h5m16-8h5m-5 8h5" /></svg>
            </span>
            <span className="product-tile__arrow" aria-hidden="true">↗</span>
          </span>
          <h3>{item.title}</h3>
          <ul aria-label={`${item.title}典型器件`}>{item.examples.map((example) => <li key={example}>{example}</li>)}</ul>
        </Link>
      ))}
    </div>
  );
}
