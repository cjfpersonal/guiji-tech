import type { Metadata } from "next";
import Link from "next/link";
import { DirectContactCard } from "@/components/direct-contact-card";
import { createPageMetadata } from "@/lib/metadata";
import { CtaBand, PageHero, SectionHeading } from "@/components/ui";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  path: "/about",
  title: "关于硅基深度求索",
  description: "了解深圳市硅基深度求索科技有限公司的业务定位、协同原则与项目沟通方式。",
});

export default function AboutPage() {
  return (
    <main id="main-content">
      <PageHero eyebrow="关于我们" title="深入技术深处，也深入每一个真实约束。" description={`${siteConfig.legalName}，连接全球电子元器件供应、嵌入式工程与供应链执行，服务研发与制造团队的关键项目。`} />
      <section className="section section--about"><div className="container about-grid">
        <div className="about-statement"><span className="eyebrow">我们的定位</span><h2>在不确定性中，<br />建立<span>清晰路径。</span></h2></div>
        <div className="about-copy"><p className="about-copy__lead">“硅基”指向电子技术的物理基础，“深度求索”代表我们的工作方式：不停留在表面信息，而是持续追问规格、来源、风险与下一步。</p><p>我们的业务围绕半导体元器件全球分销、短缺及高端芯片寻源、嵌入式技术方案设计与端到端供应链服务展开。每个项目的执行范围，都以双方确认的真实需求为起点。</p></div>
      </div></section>
      <section className="section"><div className="container">
        <SectionHeading eyebrow="协同原则" title="四项原则，约束每一次沟通与执行。" />
        <div className="principle-grid">
          <article><h3>需求先于报价</h3><p>完整型号、数量、日期、质量和交付条件不清时，不用模糊答案制造确定性的错觉。</p></article>
          <article><h3>证据先于形容</h3><p>把可提供的资料、已执行的动作和仍存在的风险分别说明，让判断有据可查。</p></article>
          <article><h3>工程连接供应</h3><p>把可得性、生命周期和替代约束带入设计讨论，减少后期被动。</p></article>
          <article><h3>边界先于承诺</h3><p>不虚构授权、认证、客户、库存和成果。货源、价格、交期与责任均需逐项确认。</p></article>
        </div>
      </div></section>
      <section className="section section--compact"><div className="container contact-panel">
        <div><span className="eyebrow">开始联系</span><h2>无需填写联系方式，直接联系商务。</h2><p>我们位于深圳，面向全球研发与制造场景开展业务沟通。首次沟通可准备完整型号或 BOM 概况、项目节点、数量、目标日期与质量要求。</p><Link className="button button--primary" href="/#rfq">可选：整理业务需求 ↗</Link></div>
        <DirectContactCard />
      </div></section>
      <CtaBand title="把问题带来，把边界说清，把下一步做实。" description="无论是器件、方案还是供应链问题，都可以从一份清晰需求开始。" />
    </main>
  );
}
