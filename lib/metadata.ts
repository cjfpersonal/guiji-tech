import type { Metadata } from "next";
import { assetPath } from "@/lib/base-path";

export function createPageMetadata({
  path,
  title,
  description,
}: {
  path: string;
  title: string;
  description: string;
}): Metadata {
  const canonicalPath = assetPath(path === "/" ? path : `${path}/`);
  return {
    title,
    description,
    alternates: { canonical: canonicalPath },
    openGraph: {
      type: "website",
      url: canonicalPath,
      title,
      description,
      locale: "zh_CN",
      siteName: "硅基深度求索",
      images: [{ url: assetPath("/opengraph-image.png"), width: 1200, height: 630, alt: "硅基深度求索科技 — 为关键器件，找到清晰路径" }],
    },
    twitter: { card: "summary_large_image", title, description, images: [assetPath("/opengraph-image.png")] },
  };
}
