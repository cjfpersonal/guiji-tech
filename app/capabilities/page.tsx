import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";
import { CtaBand, PageHero, SectionHeading } from "@/components/ui";
import { supplySteps } from "@/lib/content";

export const metadata: Metadata = createPageMetadata({
  path: "/capabilities",
  title: "端到端供应链能力",
  description: "短缺与高端芯片寻源、BOM 风险拆解、嵌入式技术方案协同、供应节奏与交付协调。",
});

const capabilities = [
  { id: "sourcing", number: "C1", english: "CRITICAL SOURCING", title: "短缺料与高端芯片寻源", description: "围绕完整规格和项目节点梳理可行路径，区分现货、排单、替代与需进一步核实的供应信息。", items: ["完整型号与目标条件核对", "渠道与供应信息协同", "批次、来源与交付条件沟通", "异常与风险前置表达"] },
  { id: "bom", number: "C2", english: "BOM INTELLIGENCE", title: "BOM 供应风险拆解", description: "把整份 BOM 从价格清单转化为优先级清单，聚焦影响项目节点的关键器件与单一来源风险。", items: ["关键行项目识别", "生命周期与交期约束梳理", "替代路径工程协同", "分批与需求节奏讨论"] },
  { id: "embedded", number: "C3", english: "EMBEDDED ENGINEERING", title: "嵌入式技术方案设计", description: "围绕产品需求，对控制、感知、连接、电源与关键器件选型开展方案协同，设计深度与交付物按项目定义。", items: ["需求与接口条件梳理", "关键器件选型协同", "供应约束前置到设计", "替代与迁移路径评估"] },
  { id: "delivery", number: "C4", english: "DELIVERY COORDINATION", title: "订单与交付协同", description: "将确认、执行、物流和到货反馈放在同一项目语境中，减少跨环节的信息断点。", items: ["订单条件逐项确认", "交付节点与异常同步", "分批及物流要求协调", "到货反馈与后续需求衔接"] },
];

export default function CapabilitiesPage() {
  return (
    <main id="main-content">
      <PageHero eyebrow="供应链能力" title="不止找到器件，更要连接项目的每一环。" description="把供应、工程和交付放在同一个项目坐标系中，按实际范围组合能力与交付物。" image="/images/supply-chain-studio.webp" imageAlt="原创供应链科技概念图，以模块化硬件和精密连接结构表达供应协同" />
      <section className="section"><div className="container capability-page-grid">
        {capabilities.map((capability) => <article key={capability.id} id={capability.id}>
          <div className="capability-page-card__head"><span className="eyebrow">协同能力</span></div>
          <h2>{capability.title}</h2><p>{capability.description}</p>
          <ul>{capability.items.map((item) => <li key={item}>{item}</li>)}</ul>
        </article>)}
      </div></section>
      <section className="section section--capabilities"><div className="container">
        <SectionHeading eyebrow="协同方式" title="一条可讨论、可确认、可复盘的执行路径。" description="以下为通用协同框架，实际动作、输出物与时点以项目约定为准。" />
        <div className="supply-steps">{supplySteps.map((step) => <article key={step.number}><h3>{step.title}</h3><p>{step.description}</p></article>)}</div>
      </div></section>
      <section className="section section--specification"><div className="container split-content">
        <div><span className="eyebrow">工程与供应协同</span><h2>在选型时看供应，在寻源时懂约束。</h2></div>
        <div className="prose"><p>器件替换并非只比较几个参数。封装、固件、外围电路、热设计、验证和认证影响都需要纳入评估。我们可配合你的工程团队梳理这些条件，但最终采用与验证结论由项目责任方确认。</p><p>同样，供应协同也不等于无条件承诺。货源、批次、检验、价格、税费、物流与交付责任，应在执行前逐项明确。</p></div>
      </div></section>
      <CtaBand title="把项目约束带来，再讨论能力如何组合。" description="无论是缺料、BOM、选型还是交付协同，请说明当前节点、关键问题与期望结果。" />
    </main>
  );
}
