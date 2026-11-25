"use client";

import Image from "next/image";
import { useRef, useState, type KeyboardEvent } from "react";

const steps = [
  { id: "define", title: "需求", status: "流程节点：需求资料", description: "先把完整型号、数量、目标日期和验收条件放在同一条路径上。", evidence: "型号 · 数量 · 日期 · 验收" },
  { id: "verify", title: "寻源核验", status: "流程节点：寻源核验", description: "围绕实际项目核对可行货源，把来源、批次和仍存在的风险分别说明。", evidence: "货源 · 批次 · 资料 · 风险" },
  { id: "deliver", title: "协同交付", status: "流程目标：协同交付", description: "确认订单、物流和到货反馈，让供应路径延续到真实项目节点。", evidence: "订单 · 物流 · 到货 · 反馈" },
] as const;

export function SupplyScene() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % steps.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index - 1 + steps.length) % steps.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = steps.length - 1;
    else return;
    event.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  }

  const current = steps[active];
  return (
    <div className={`supply-scene supply-scene--${current.id}`}>
      <div className="supply-scene__visual" aria-hidden="true">
        <Image src="/images/supply-path-ice.webp" alt="" fill sizes="(max-width: 900px) 100vw, 62vw" quality={82} />
        <div className="supply-scene__shade" />
        <div className="supply-scene__pulse" />
        <div className="supply-scene__status"><span />{current.status}</div><div className="supply-scene__disclaimer">流程示意，非实时订单或库存状态</div>
      </div>
      <div className="supply-scene__console">
        <div className="supply-scene__tabs" role="tablist" aria-label="供应路径步骤" aria-orientation="vertical">
          {steps.map((step, index) => (
            <button
              key={step.id}
              ref={(element) => { tabs.current[index] = element; }}
              id={`supply-tab-${step.id}`}
              type="button"
              role="tab"
              aria-selected={active === index}
              aria-controls={`supply-panel-${step.id}`}
              tabIndex={active === index ? 0 : -1}
              onClick={() => setActive(index)}
              onKeyDown={(event) => handleKeyDown(event, index)}
            >
              <span aria-hidden="true" />
              <strong>{step.title}</strong>
            </button>
          ))}
        </div>
        <div className="supply-scene__panel" key={current.id} id={`supply-panel-${current.id}`} role="tabpanel" aria-labelledby={`supply-tab-${current.id}`} tabIndex={0}>
          <span className="supply-scene__panel-label">当前节点</span>
          <h3>{current.title}</h3>
          <p>{current.description}</p>
          <strong>{current.evidence}</strong>
        </div>
      </div>
    </div>
  );
}
