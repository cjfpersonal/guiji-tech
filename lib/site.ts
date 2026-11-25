export const salesEmail = process.env.NEXT_PUBLIC_SALES_EMAIL?.trim() || "chenfeng@jyera.com";
const configuredSalesPhone = process.env.NEXT_PUBLIC_SALES_PHONE?.trim() || "+86 134 2388 2268";
const compactSalesPhone = configuredSalesPhone.replace(/[\s-]/g, "");
export const salesPhone = /^\+861\d{10}$/.test(compactSalesPhone)
  ? `+86 ${compactSalesPhone.slice(3, 6)} ${compactSalesPhone.slice(6, 10)} ${compactSalesPhone.slice(10)}`
  : configuredSalesPhone;
export const salesPhoneHref = salesPhone.replace(/[^+\d]/g, "");
export const companyAddress = process.env.NEXT_PUBLIC_COMPANY_ADDRESS?.trim() || "广东省深圳市南山区粤海街道高新工业村 T3 栋 A 座 403";

export const siteConfig = {
  legalName: "深圳市硅基深度求索科技有限公司",
  shortName: "硅基深度求索",
  brandName: "SDS TECHNOLOGY",
  description:
    "面向全球电子制造与研发团队，提供半导体元器件寻源、短缺料供应协同、嵌入式技术方案设计与端到端供应链服务。",
  navigation: [
    { label: "产品与品牌", href: "/line-card" },
    { label: "供应链能力", href: "/capabilities" },
    { label: "质量与溯源", href: "/quality" },
    { label: "行业方案", href: "/solutions" },
    { label: "关于我们", href: "/about" },
  ],
  contact: {
    email: salesEmail,
    telephone: salesPhone,
    telephoneHref: salesPhoneHref,
    address: companyAddress,
  },
} as const;

export function getSiteUrl() {
  const candidate = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const allowLocal = process.env.NEXT_PUBLIC_ALLOW_LOCAL_SITE_URL === "true";
  const isProduction = process.env.NODE_ENV === "production";

  if (!candidate) {
    if (!isProduction || allowLocal) return "http://localhost:4173";
    throw new Error("生产构建必须配置 NEXT_PUBLIC_SITE_URL 为真实 HTTPS 站点地址。");
  }

  let url: URL;
  try {
    url = new URL(candidate);
  } catch {
    throw new Error("NEXT_PUBLIC_SITE_URL 必须是完整 URL，例如 https://your-domain.cn。");
  }

  const isLocal = ["localhost", "127.0.0.1", "::1"].includes(url.hostname);
  if (isProduction && !allowLocal && (url.protocol !== "https:" || isLocal)) {
    throw new Error("生产环境 NEXT_PUBLIC_SITE_URL 必须使用真实 HTTPS 域名，不能使用 localhost。");
  }
  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error("NEXT_PUBLIC_SITE_URL 仅支持 HTTP 或 HTTPS 协议。");
  }
  return url.origin;
}
