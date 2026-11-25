import Link from "next/link";
import { EditorialImage } from "@/components/editorial-image";

export function SectionHeading({
  eyebrow,
  title,
  description,
  light = false,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  index?: string;
  light?: boolean;
  align?: "left" | "center";
}) {
  return (
    <div className={`section-heading${light ? " section-heading--light" : ""}${align === "center" ? " section-heading--center" : ""}`}>
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  );
}

export function CtaBand({
  eyebrow = "开始沟通",
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description: string;
}) {
  return (
    <section className="cta-band">
      <div className="container cta-band__inner">
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
        <p>{description}</p>
        <Link className="button button--primary" href="/#contact">联系商务 <span aria-hidden="true">›</span></Link>
      </div>
    </section>
  );
}

export function PageHero({
  eyebrow,
  title,
  description,
  image,
  imageAlt,
}: {
  index?: string;
  eyebrow: string;
  title: string;
  description: string;
  aside?: string;
  image?: string;
  imageAlt?: string;
}) {
  return (
    <section className="page-hero">
      <div className="container">
        <nav className="breadcrumbs" aria-label="面包屑"><Link href="/">首页</Link><span aria-hidden="true">/</span><span>{eyebrow}</span></nav>
        <div className="page-hero__grid">
          <span className="eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        {image && imageAlt && (
          <EditorialImage
            src={image}
            alt={imageAlt}
            className="page-hero__media"
            sizes="(max-width: 900px) calc(100vw - 40px), 1200px"
            priority
          />
        )}
      </div>
    </section>
  );
}
