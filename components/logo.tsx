import Link from "next/link";
import { siteConfig } from "@/lib/site";

export function Logo({ linked = true, onNavigate }: { linked?: boolean; onNavigate?: () => void }) {
  const content = (
    <>
      <svg className="logo-mark" viewBox="0 0 32 32" aria-hidden="true">
        <path d="M5 4h15l7 7v17H12l-7-7V4Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M10 10h10l3 3-3 3h-7l-3 3 3 3h7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="logo-type"><strong>{siteConfig.shortName}</strong></span>
    </>
  );

  return linked ? <Link className="logo" href="/" title="硅基深度求索科技首页" onClick={onNavigate}>{content}</Link> : <div className="logo">{content}</div>;
}
