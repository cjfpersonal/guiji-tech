"use client";

import { useState, type FormEvent } from "react";
import { useRfq } from "@/components/rfq-context";

export function HeroQuickStart() {
  const { applyQuickStart, updateField } = useRfq();
  const [quick, setQuick] = useState({ partNumber: "", quantity: "", targetDate: "" });
  const complete = [Boolean(quick.partNumber.trim()), Boolean(quick.quantity.trim()), Boolean(quick.targetDate)];

  function updateQuick(field: "partNumber" | "quantity" | "targetDate", value: string) {
    setQuick((current) => ({ ...current, [field]: value }));
    updateField(field, value);
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    applyQuickStart(quick);
    document.querySelector(".rfq-v3")?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
    window.setTimeout(() => document.getElementById("rfq-step-title")?.focus({ preventScroll: true }), 500);
  }

  return (
    <form className="quick-start" onSubmit={submit} aria-label="快速整理短缺料需求">
      <div className="quick-start__heading"><strong>从一颗短缺料开始</strong><span>本地整理 · 非库存查询</span></div>
      <div className="quick-start__fields">
        <label><span>型号</span><input id="quick-partNumber" value={quick.partNumber} onChange={(event) => updateQuick("partNumber", event.target.value)} placeholder="完整料号" autoComplete="off" /></label>
        <label><span>数量</span><input id="quick-quantity" value={quick.quantity} onChange={(event) => updateQuick("quantity", event.target.value)} placeholder="需求数量" inputMode="numeric" autoComplete="off" /></label>
        <label><span>目标日期</span><input id="quick-targetDate" type="date" value={quick.targetDate} onChange={(event) => updateQuick("targetDate", event.target.value)} /></label>
      </div>
      <div className="quick-start__action">
        <div className="demand-signal" data-complete={complete.filter(Boolean).length} aria-hidden="true">
          {complete.map((done, index) => <span className={done ? "is-complete" : ""} key={index} />)}
        </div>
        <p className="sr-only" aria-live="polite">已填写 {complete.filter(Boolean).length} 项，共 3 项快速需求信息。</p>
        <button className="button button--primary" type="submit">整理需求 <span aria-hidden="true">›</span></button>
      </div>
      <noscript><p className="quick-start__noscript">启用 JavaScript 后可将此处内容预填到分步需求单；你仍可直接前往下方阅读完整表单说明。</p></noscript>
    </form>
  );
}

export function HeroSignalPath() {
  const { data } = useRfq();
  const items = [
    { label: "型号", value: data.partNumber.trim(), done: Boolean(data.partNumber.trim()) },
    { label: "数量", value: data.quantity.trim(), done: Boolean(data.quantity.trim()) },
    { label: "日期", value: data.targetDate, done: Boolean(data.targetDate) },
  ];
  const count = items.filter((item) => item.done).length;
  const nodes = [...items, { label: "摘要", value: count === 3 ? "可整理" : "待补充", done: count === 3 }];
  const xs = [92, 266, 440, 584];
  const raised = [112, 66, 112, 66];
  const points = nodes.map((node, index) => ({ x: xs[index], y: node.done ? raised[index] : 174 }));
  const path = points.map((point, index) => `${index === 0 ? "M" : "L"}${point.x} ${point.y}`).join(" ");
  let connected = 0;
  while (connected < items.length && items[connected].done) connected += 1;
  const activePath = connected === 0 ? "" : points.slice(0, connected + (count === 3 ? 1 : 0)).map((point, index) => `${index === 0 ? "M" : "L"}${point.x} ${point.y}`).join(" ");
  const signature = `${items.map((item) => item.done ? 1 : 0).join("")}-${data.partNumber}-${data.quantity}-${data.targetDate}`;
  const shorten = (value: string, fallback: string) => value ? value.length > 13 ? `${value.slice(0, 12)}…` : value : fallback;

  return (
    <div className="hero-signal-visual" data-complete={count} data-signature={signature}>
      <div className="hero-signal-visual__head"><span>Supply Signal</span><strong>当前需求摘要</strong></div>
      <svg className="hero-signal-visual__path" viewBox="0 0 640 240" role="img" aria-label={`需求路径：型号${items[0].value || "待填写"}，数量${items[1].value || "待填写"}，日期${items[2].value || "待填写"}`}>
        <path className="signal-track signal-track--base" d={path} />
        {activePath && <path className="signal-track signal-track--active" d={activePath} key={activePath} />}
        {nodes.map((node, index) => (
          <g className={`signal-node${node.done ? " is-complete" : ""}`} key={node.label} style={{ transform: `translateY(${points[index].y - 174}px)` }}>
            <circle cx={points[index].x} cy="174" r="10" />
            <text className="signal-node__label" x={points[index].x} y="140" textAnchor="middle">{node.label}</text>
            <text className="signal-node__value" x={points[index].x} y="207" textAnchor="middle">{shorten(node.value, "待填写")}</text>
          </g>
        ))}
      </svg>
      <dl className="hero-signal-summary">
        <div><dt>完整型号</dt><dd>{data.partNumber.trim() || "等待型号输入"}</dd></div>
        <div><dt>需求数量</dt><dd>{data.quantity.trim() || "等待数量输入"}</dd></div>
        <div><dt>目标日期</dt><dd>{data.targetDate || "等待日期输入"}</dd></div>
      </dl>
      <p className="hero-signal-visual__note" aria-live="polite">已填写 {count} / 3 项。仅根据输入整理，不查询现货，不代表价格或交付承诺。</p>
    </div>
  );
}
