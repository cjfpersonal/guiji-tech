import type { Metadata, Viewport } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { RouteTransition } from "@/components/route-transition";
import { getSiteUrl, salesEmail, salesPhone, siteConfig } from "@/lib/site";
import "./globals.css";
import "./home-v3.css";
import "./sourcedesk.css";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "硅基深度求索科技｜关键器件寻源与供应链服务",
    template: "%s｜硅基深度求索科技",
  },
  description: siteConfig.description,
  keywords: [
    "电子元器件分销",
    "短缺料寻源",
    "高端芯片",
    "BOM 供应链",
    "嵌入式方案设计",
    "元器件质量溯源",
    "深圳供应链服务",
  ],
  applicationName: siteConfig.shortName,
  authors: [{ name: siteConfig.legalName }],
  creator: siteConfig.legalName,
  publisher: siteConfig.legalName,
  category: "Electronic components and supply chain services",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "/",
    siteName: siteConfig.shortName,
    title: "为关键器件，找到可验证的供应路径。",
    description: siteConfig.description,
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: "硅基深度求索科技 — 为关键器件，找到清晰路径" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "硅基深度求索科技｜关键器件寻源与供应链服务",
    description: siteConfig.description,
    images: ["/opengraph-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f5f5f7",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${getSiteUrl()}/#organization`,
        name: siteConfig.legalName,
        alternateName: siteConfig.brandName,
        url: getSiteUrl(),
        description: siteConfig.description,
        email: salesEmail,
        telephone: salesPhone,
        address: {
          "@type": "PostalAddress",
          addressCountry: "CN",
          addressRegion: "广东省",
          addressLocality: "深圳市",
          streetAddress: "南山区粤海街道高新工业村 T3 栋 A 座 403",
        },
        areaServed: "Worldwide",
        knowsAbout: ["电子元器件寻源", "供应链管理", "嵌入式系统设计", "短缺料供应协同"],
      },
      {
        "@type": "WebSite",
        "@id": `${getSiteUrl()}/#website`,
        url: getSiteUrl(),
        name: siteConfig.shortName,
        inLanguage: "zh-CN",
        publisher: { "@id": `${getSiteUrl()}/#organization` },
      },
    ],
  };

  return (
    <html lang="zh-CN">
      <body id="top">
        <SiteHeader />
        <RouteTransition>{children}</RouteTransition>
        <SiteFooter />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
        />
      </body>
    </html>
  );
}
