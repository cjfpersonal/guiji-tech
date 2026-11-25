import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";
import { PageHero, SectionHeading } from "@/components/ui";
import { RfqIntentButton } from "@/components/rfq-intent-button";
import { salesEmail, salesPhone, salesPhoneHref } from "@/lib/site";
import { qualityStages } from "@/lib/content";

export const metadata: Metadata = createPageMetadata({
  path: "/quality",
  title: "质量控制与批次溯源",
  description: "以需求基线、来源资料、批次标签、约定检测和交付记录构建可复查的质量路径。",
});

export default function QualityPage() {
  return (
    <main id="main-content">
      <PageHero eyebrow="质量与溯源" title="让每一个质量结论，都有对应的资料与边界。" description="从明确验收要求开始，分别表达可获得的资料、执行的动作与未覆盖的风险。" image="/images/precision-inspection.webp" imageAlt="原创精密检测科技概念图，呈现光学检测设备和芯片表面的微观细节" />
      <section className="section section--quality"><div className="container">
        <SectionHeading light eyebrow="质量控制点" title="五个控制点，形成一条可复查路径。" description="这是可按项目裁剪的流程框架，不代表每批货物自动包含全部检测项目。" />
        <div className="quality-page-stages">{qualityStages.map((stage) => <article key={stage.number}><h2>{stage.title}</h2><p>{stage.description}</p></article>)}</div>
      </div></section>
      <section className="section"><div className="container quality-evidence-grid">
        <div><span className="eyebrow">资料与证据</span><h2>资料应当能对应到具体需求与批次。</h2><p>项目启动时，请明确提出所需资料与判定标准。可提供的资料范围取决于实际货源与双方约定。</p></div>
        <dl className="evidence-list">
          <div><dt>规格基线</dt><dd>完整订购型号、封装、温度或应用等级、数量、目标批次等。</dd></div>
          <div><dt>标签与包装资料</dt><dd>标签、Date Code、Lot、包装数量等可核对信息。</dd></div>
          <div><dt>来源与流转资料</dt><dd>按实际交易与项目要求收集，不能获得的资料应提前说明。</dd></div>
          <div><dt>检测与异常记录</dt><dd>约定检测主体、方法、抽样、判定及异常处理方式。</dd></div>
        </dl>
      </div></section>
      <section className="section section--compact"><div className="container">
        <SectionHeading eyebrow="范围与边界" title="把边界说在前面。" />
        <div className="boundary-grid">
          <article><h3>不虚构认证</h3><p>本网站不展示未经确认的体系认证、实验室资质或原厂授权。项目需要时，应核验实际服务主体的有效文件。</p></article>
          <article><h3>不混淆检测结论</h3><p>外观、丝印或包装检查不能替代电性、可靠性或真伪鉴定。需要第三方检测时，应另行约定机构与标准。</p></article>
          <article><h3>不省略异常处理</h3><p>发现资料、标签、外观或检测异常时，应暂停对应交付判断，并按约定完成复核、隔离与处置。</p></article>
        </div>
      </div></section>
      <section className="cta-band"><div className="container cta-band__inner"><span className="eyebrow">开始沟通</span><h2>把你的验收要求写进需求。</h2><p>在需求补充中说明批次、资料、检测和异常处理要求，以便在执行前确认可行范围。</p><div className="quality-cta-actions"><RfqIntentButton intent={{ requestType: "短缺料快速询价", details: "质量与验收清单：\n1. 批次：Date Code、Lot、标签与丝印资料范围（沟通时确认）。\n2. 来源流转：可提供的来源与流转资料范围（按实际货源约定）。\n3. 检测：检测主体、项目、方法、抽样、判定与费用（另行约定）。\n4. 异常处理：复核、隔离、处置与反馈路径（按双方确认流程执行）。" }} className="button button--primary">把验收要求写进需求 <span aria-hidden="true">→</span></RfqIntentButton><a className="button button--outline" href={`mailto:${salesEmail}`}>直接邮件</a><a className="button button--outline" href={`tel:${salesPhoneHref}`}>电话联系：{salesPhone}</a></div></div></section>
    </main>
  );
}
