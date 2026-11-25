import Link from "next/link";
import { Logo } from "@/components/logo";
import { companyAddress, salesEmail, salesPhone, salesPhoneHref, siteConfig } from "@/lib/site";

export function SiteFooter() {
  return <footer className="site-footer sd-footer">
    <div className="sd-container sd-footer__top"><div><Logo /><p>SourceDesk 客户寻源工作台。<br />让需求、证据与直接联系形成清晰路径。</p></div><div><span>有完整型号或 BOM？</span><Link className="button button--primary" href="/#rfq">整理需求并联系商务 →</Link></div></div>
    <div className="sd-container sd-footer__links">
      <div><h2>产品发现</h2><Link href="/line-card/">产品分类</Link><Link href="/line-card/#manufacturers">制造商文字索引</Link><Link href="/solutions/">行业应用</Link><Link href="/#resources">资源与下载</Link></div>
      <div><h2>服务与质量</h2><Link href="/capabilities/">供应链服务</Link><Link href="/solutions/#embedded">工程与设计</Link><Link href="/quality/">质量与溯源</Link><Link href="/#quality-matrix">质量证据矩阵</Link></div>
      <div><h2>公司</h2><Link href="/about/">关于我们</Link><Link href="/privacy/">隐私政策</Link><Link href="/terms/">服务条款</Link><span>静态预渲染 · 无在线提交</span></div>
      <div className="sd-footer__contact"><h2>直接联系</h2><a href={`mailto:${salesEmail}`}>{salesEmail}</a><a href={`tel:${salesPhoneHref}`}>{salesPhone}</a><address>{companyAddress}</address></div>
    </div>
    <div className="sd-container sd-footer__bottom"><span>© {new Date().getFullYear()} {siteConfig.legalName}</span><p>制造商名称仅用于需求索引，不代表授权代理、合作、库存或原厂背书。具体货源、资料、检测与交付条件以双方确认为准。</p><a href="#top">回到顶部 ↑</a></div>
  </footer>;
}
