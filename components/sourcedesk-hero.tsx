"use client";

import Link from "next/link";
import { useState, type FormEvent, type KeyboardEvent } from "react";
import { RfqIntentButton } from "@/components/rfq-intent-button";
import { useRfq } from "@/components/rfq-context";
import { salesEmail, salesPhone, salesPhoneHref } from "@/lib/site";

const paths = [
  { id: "shortage", tab: "短缺料寻源", kicker: "01 / SOURCING", title: "让关键器件需求，进入可执行的寻源路径。", description: "从完整型号、数量、日期和交付地区开始，先定义真实约束，再沟通可行供应。", image: "/images/chip-hero-ice.webp", alt: "原创芯片封装与冰蓝技术光影概念摄影" },
  { id: "bom", tab: "BOM 齐套", kicker: "02 / BOM DESK", title: "把整份 BOM，拆成可核对的齐套任务。", description: "整理关键行、需求数量与目标节点，区分优先项和待确认项，不让整表需求停留在模糊沟通。", image: "/images/supply-chain-studio.webp", alt: "原创模块化硬件与供应连接概念摄影" },
  { id: "engineering", tab: "工程方案", kicker: "03 / ENGINEERING", title: "让供应约束，更早进入选型与工程设计。", description: "把关键参数、封装、温度、接口、生命周期和替代边界放在同一份需求里，不自动推荐未经验证的型号。", image: "/images/wafer-studio.webp", alt: "原创晶圆与芯片封装技术概念摄影" },
  { id: "quality", tab: "供应链质量", kicker: "04 / EVIDENCE", title: "让每一次供应判断，都有证据与边界。", description: "围绕规格、标签批次、包装、来源流转、检测约定和异常处理，按实际货源与项目要求确认。", image: "/images/precision-inspection.webp", alt: "原创精密检测与芯片质量概念摄影" },
] as const;

export function SourceDeskHero() {
  const [active, setActive] = useState(0);
  const current = paths[active];
  const { applyQuickStart } = useRfq();
  const [quick, setQuick] = useState({ partNumber: "", quantity: "", targetDate: "", deliveryRegion: "" });

  function selectWithKeyboard(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % paths.length;
    else if (event.key === "ArrowLeft") next = (index - 1 + paths.length) % paths.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = paths.length - 1;
    else return;
    event.preventDefault();
    setActive(next);
    document.getElementById(`hero-tab-${paths[next].id}`)?.focus();
  }

  function quickSubmit(event: FormEvent) {
    event.preventDefault();
    applyQuickStart(quick);
    document.querySelector("#rfq")?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }

  return <section className="sd-hero" aria-labelledby="hero-title">
    {active === 0 && <>
      <link rel="preload" as="image" href="/images/chip-hero-ice.webp" media="(min-width: 601px)" fetchPriority="high" />
      <link rel="preload" as="image" href="/images/chip-hero-ice-mobile.webp" media="(max-width: 600px)" fetchPriority="high" />
    </>}
    <div className="sd-hero__media"><picture><source media="(max-width: 600px)" srcSet={current.id === "shortage" ? "/images/chip-hero-ice-mobile.webp" : current.image} /><img key={current.image} src={current.image} alt={current.alt} width={1000} height={750} loading="eager" fetchPriority={active === 0 ? "high" : "auto"} decoding="async" /></picture></div>
    <div className="sd-hero__shade" aria-hidden="true" />
    <div className="sd-container sd-hero__content" id={`hero-panel-${current.id}`} role="tabpanel" aria-labelledby={`hero-tab-${current.id}`}>
      <div className="sd-hero__copy" key={current.id}>
        <span className="sd-hero__kicker">SourceDesk · {current.kicker}</span>
        <h1 id="hero-title">{current.title}</h1>
        <p>{current.description}</p>
        {current.id === "shortage" ? <form className="sd-quick" onSubmit={quickSubmit} aria-label="快速整理短缺料需求">
          <div className="sd-quick__fields">
            <label><span>完整料号</span><input id="quick-partNumber" required value={quick.partNumber} onChange={(event) => setQuick({ ...quick, partNumber: event.target.value })} placeholder="包含后缀 / 封装" /></label>
            <label><span>数量</span><input id="quick-quantity" required inputMode="numeric" value={quick.quantity} onChange={(event) => setQuick({ ...quick, quantity: event.target.value })} placeholder="需求数量" /></label>
            <label><span>目标日期</span><input id="quick-targetDate" type="date" value={quick.targetDate} onChange={(event) => setQuick({ ...quick, targetDate: event.target.value })} /></label>
            <label><span>交付地区</span><input id="quick-deliveryRegion" value={quick.deliveryRegion} onChange={(event) => setQuick({ ...quick, deliveryRegion: event.target.value })} placeholder="国家 / 省市" /></label>
          </div>
          <div className="sd-quick__actions"><button className="button button--primary" type="submit">整理短缺料需求 <span aria-hidden="true">→</span></button><RfqIntentButton intent={{ requestType: "BOM 供应与成本评估" }} className="button button--ghost">粘贴 BOM</RfqIntentButton></div>
          <p>本地整理，不查询实时库存，不代表价格或交付承诺。</p>
        </form> : <div className="sd-hero__path-action">
          {current.id === "quality" ? <Link className="button button--primary" href="/quality/">查看质量与溯源 <span aria-hidden="true">→</span></Link> : <RfqIntentButton intent={{ requestType: current.id === "bom" ? "BOM 供应与成本评估" : "嵌入式技术方案沟通" }} className="button button--primary">{current.id === "bom" ? "整理 BOM 需求" : "整理工程选型需求"} <span aria-hidden="true">→</span></RfqIntentButton>}
          <RfqIntentButton intent={{ requestType: "短缺料快速询价" }} className="button button--ghost">返回型号整理</RfqIntentButton>
        </div>}
        <div className="sd-hero__contacts"><span>直接联系：</span><a href={`mailto:${salesEmail}`}>{salesEmail}</a><a href={`tel:${salesPhoneHref}`}>{salesPhone}</a></div>
      </div>
    </div>
    <div className="sd-container sd-hero__tabs" role="tablist" aria-label="业务路径">{paths.map((path, index) => <button key={path.id} id={`hero-tab-${path.id}`} type="button" role="tab" aria-selected={active === index} aria-controls={`hero-panel-${path.id}`} tabIndex={active === index ? 0 : -1} onClick={() => setActive(index)} onKeyDown={(event) => selectWithKeyboard(event, index)}><span>0{index + 1}</span><strong>{path.tab}</strong></button>)}</div>
  </section>;
}
