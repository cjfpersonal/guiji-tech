import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";
import Link from "next/link";
import { ProductExplorer } from "@/components/product-explorer";
import { CtaBand, PageHero, SectionHeading } from "@/components/ui";
import { manufacturers } from "@/lib/content";

export const metadata: Metadata = createPageMetadata({
  path: "/line-card",
  title: "产品与品牌寻源索引",
  description: "浏览处理器、MCU、模拟、电源、射频、存储、传感器与被动器件分类，提交全球制造商型号与 BOM 寻源需求。",
});

export default function LineCardPage() {
  return (
    <main id="main-content">
      <PageHero eyebrow="产品与品牌" title="产品分类，是需求的坐标，不是库存的承诺。" description="以器件功能、应用与规格组织寻源入口。你可以检索分类，也可以直接提交不在索引中的完整型号。" />
      <section className="section section--products">
        <div className="container"><ProductExplorer /></div>
      </section>
      <section className="section section--compact" id="manufacturers">
        <div className="container">
          <SectionHeading eyebrow="制造商需求入口" title="从制造商名称，快速进入型号沟通。" description="这里仅列出常见需求入口。没有展示的品牌同样可以在需求单中填写。" />
          <div className="brand-page-grid">
            {manufacturers.map((manufacturer) => <div key={manufacturer}><strong>{manufacturer}</strong><Link href="/#rfq" aria-label={`提交型号：${manufacturer} 需求`}>提交型号 ↗</Link></div>)}
          </div>
          <p className="legal-note">制造商名称及商标归各自权利人所有。本页不使用其品牌标识，列名不代表授权代理、合作伙伴、实时库存或原厂背书。</p>
        </div>
      </section>
      <section className="section section--specification">
        <div className="container split-content">
          <div><span className="eyebrow">有效询价</span><h2>完整规格，决定有效寻源的起点。</h2></div>
          <div className="spec-list">
            <div><p><strong>完整订购型号</strong>包含后缀、封装、温度与等级，避免只用系列名询价。</p></div>
            <div><p><strong>真实项目条件</strong>数量、目标日期、交付地区，以及是否接受分批。</p></div>
            <div><p><strong>验收与替代边界</strong>批次、资料、检测要求，以及是否允许工程替代评估。</p></div>
          </div>
        </div>
      </section>
      <CtaBand title="有完整型号，就可以直接开始。" description="提交型号、数量和目标日期；若是整份 BOM，请在需求补充中说明关键行项目与优先级。" />
    </main>
  );
}
