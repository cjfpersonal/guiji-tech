import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";
import { CtaBand, PageHero, SectionHeading } from "@/components/ui";
import { industries } from "@/lib/content";

export const metadata: Metadata = createPageMetadata({
  path: "/solutions",
  title: "行业应用与嵌入式方案",
  description: "面向工业、汽车电子、能源、医疗电子、通信、机器人等场景，协同关键器件供应与嵌入式方案约束。",
});

export default function SolutionsPage() {
  return (
    <main id="main-content">
      <PageHero eyebrow="行业方案" title="理解应用，才能理解一颗器件真正的重要之处。" description="从工作环境、生命周期、验证要求与量产节奏出发，组织供应和设计协同。以下为服务场景，不是客户案例。" image="/images/wafer-studio.webp" imageAlt="原创晶圆与芯片封装概念图，呈现晶粒阵列和精密封装结构" />
      <section className="section"><div className="container solution-page-list">
        {industries.map((industry) => <article key={industry.slug} id={industry.slug}>
          <div><h2>{industry.title}</h2></div>
          <div><p>{industry.description}</p><ul>{industry.needs.map((need) => <li key={need}>{need}</li>)}</ul></div>
        </article>)}
      </div></section>
      <section className="section section--capabilities" id="embedded"><div className="container">
        <SectionHeading eyebrow="嵌入式方案协同" title="让器件供应约束，更早进入工程设计。" description="嵌入式方案按实际项目范围定义。以下展示可协同的工作模块，而非固定套餐或未经验证的性能承诺。" />
        <div className="engineering-grid">
          <article><h3>需求与架构梳理</h3><p>功能、接口、环境、成本、生命周期与量产目标共同构成方案输入。</p></article>
          <article><h3>核心器件选型</h3><p>综合处理能力、外设、功耗、封装、生态与供应条件评估关键器件。</p></article>
          <article><h3>控制、连接与电源协同</h3><p>围绕约定范围开展原理、模块或参考方案设计，明确交付物与评审节点。</p></article>
          <article><h3>验证与迁移支持</h3><p>由项目责任方制定验证计划，协同处理替代、迁移与供应变化的影响。</p></article>
        </div>
      </div></section>
      <section className="section section--specification"><div className="container split-content"><div><span className="eyebrow">合规说明</span><h2>行业场景，不等于行业资质声明。</h2></div><div className="prose"><p>汽车、医疗等应用对器件等级、设计验证、体系与法规有特定要求。本页场景描述不构成相关认证、功能安全等级或法规符合性声明。</p><p>项目执行时，请提供适用标准、目标市场、验证责任与验收条件，再由相关责任方确认具体方案。</p></div></div></section>
      <CtaBand title="描述你的产品，而不只是描述一颗料。" description="提供应用、关键接口、目标节点与供应约束，让我们从更完整的上下文开始讨论。" />
    </main>
  );
}
