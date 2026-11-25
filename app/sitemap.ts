import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/line-card", "/capabilities", "/quality", "/solutions", "/about", "/privacy", "/terms"];
  return routes.map((route, index) => ({
    url: `${getSiteUrl()}${route === "" ? "/" : `${route}/`}`,
    lastModified: new Date(),
    changeFrequency: index === 0 ? "weekly" : "monthly",
    priority: index === 0 ? 1 : index > 5 ? 0.3 : 0.8,
  }));
}
