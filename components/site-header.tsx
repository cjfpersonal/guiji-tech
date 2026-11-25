"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { GlobalSearch } from "@/components/global-search";
import { Logo } from "@/components/logo";
import { RfqIntentButton } from "@/components/rfq-intent-button";
import { manufacturers, productCategories } from "@/lib/content";
import { salesEmail, salesPhone, salesPhoneHref } from "@/lib/site";

const focusableSelector = 'a[href], button:not([disabled]), summary, input, [tabindex]:not([tabindex="-1"])';

function NavDropdown({ label, children, onNavigate }: { label: string; children: ReactNode; onNavigate?: () => void }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  function keyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      window.setTimeout(() => rootRef.current?.querySelector<HTMLAnchorElement>("a")?.focus(), 0);
    }
    if (event.key === "Escape") setOpen(false);
  }
  return <div ref={rootRef} className={`sd-dropdown${open ? " is-open" : ""}`} onKeyDown={(event) => { if (event.key === "Escape") { setOpen(false); rootRef.current?.querySelector<HTMLButtonElement>("button")?.focus(); } }} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}>
    <button type="button" aria-expanded={open} onClick={() => setOpen((value) => !value)} onKeyDown={keyDown}><span className="sd-nav-trigger__label">{label}</span><span className="sd-nav-trigger__icon" aria-hidden="true"><svg viewBox="0 0 8 8" focusable="false"><path d="M1 2.5 4 5.5 7 2.5" /></svg></span></button>
    {open && <div className="sd-dropdown__panel" onClick={(event) => { if ((event.target as HTMLElement).closest("a,button")) { setOpen(false); onNavigate?.(); } }}>{children}</div>}
  </div>;
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const background = [document.querySelector<HTMLElement>("main"), document.querySelector<HTMLElement>(".site-footer")].filter((element): element is HTMLElement => Boolean(element));
    const previous = background.map((element) => ({ element, inert: element.inert, ariaHidden: element.getAttribute("aria-hidden") }));
    document.body.style.overflow = "hidden";
    background.forEach((element) => { element.inert = true; element.setAttribute("aria-hidden", "true"); });
    const timer = window.setTimeout(() => drawerRef.current?.querySelector<HTMLElement>("summary, a, button")?.focus({ preventScroll: true }), 100);
    function onKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") { event.preventDefault(); setOpen(false); toggleRef.current?.focus(); return; }
      if (event.key !== "Tab" || !drawerRef.current) return;
      const controls = [toggleRef.current, ...Array.from(drawerRef.current.querySelectorAll<HTMLElement>(focusableSelector))].filter((element): element is HTMLElement => Boolean(element));
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = previousOverflow;
      previous.forEach(({ element, inert, ariaHidden }) => { element.inert = inert; if (ariaHidden === null) element.removeAttribute("aria-hidden"); else element.setAttribute("aria-hidden", ariaHidden); });
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return <>
    <a className="skip-link" href="#main-content">跳至主要内容</a>
    <header className="sd-header">
      <div className="sd-utility"><div className="sd-container sd-utility__inner"><span>SourceDesk · 客户寻源工作台</span><div><span>深圳 · 服务研发与制造团队</span><a href={`mailto:${salesEmail}`}>{salesEmail}</a><a href={`tel:${salesPhoneHref}`}>{salesPhone}</a></div></div></div>
      <div className="sd-container sd-header__main">
        <div className="sd-header__brand"><Logo onNavigate={close} /><span>关键器件寻源与协同</span></div>
        <GlobalSearch />
        <div className="sd-header__actions"><RfqIntentButton intent={{ requestType: "BOM 供应与成本评估" }} className="sd-header__bom">BOM 整理</RfqIntentButton><Link className="button button--primary" href="/#contact">联系商务 <span aria-hidden="true">→</span></Link></div>
        <button ref={toggleRef} className="sd-menu-toggle" type="button" aria-expanded={open} aria-controls="sd-mobile-navigation" aria-label={open ? "关闭导航菜单" : "打开导航菜单"} onClick={() => setOpen((value) => !value)}><span /><span /><span /></button>
      </div>
      <nav className="sd-nav" aria-label="主导航"><div className="sd-container sd-nav__inner">
        <NavDropdown label="产品">{productCategories.map((item) => <Link key={item.slug} href={`/line-card/#${item.slug}`}>{item.title}<small>{item.english}</small></Link>)}</NavDropdown>
        <NavDropdown label="制造商">{manufacturers.map((item) => <Link key={item} href="/line-card/#manufacturers">{item}<small>文字需求索引</small></Link>)}</NavDropdown>
        <NavDropdown label="供应链服务"><Link href="/capabilities/#sourcing">短缺料寻源<small>完整型号与交付约束</small></Link><Link href="/capabilities/#bom">BOM 供应协同<small>关键行与齐套节奏</small></Link><Link href="/capabilities/#delivery">交付协同<small>确认、物流与反馈</small></Link></NavDropdown>
        <NavDropdown label="工程与设计"><Link href="/solutions/#embedded">嵌入式方案协同<small>架构、接口与验证</small></Link><RfqIntentButton intent={{ requestType: "嵌入式技术方案沟通" }} className="sd-dropdown__action">整理选型需求<small>参数、封装与替代边界</small></RfqIntentButton></NavDropdown>
        <Link className="sd-nav__direct" href="/solutions/">行业</Link>
        <NavDropdown label="质量与资源"><Link href="/quality/">质量与溯源<small>证据与执行边界</small></Link><Link href="/#quality-matrix">证据矩阵<small>六项核对基线</small></Link><Link href="/#resources">资源与下载<small>真实静态清单模板</small></Link></NavDropdown>
        <Link className="sd-nav__direct" href="/about/">关于</Link>
      </div></nav>
      <div ref={drawerRef} id="sd-mobile-navigation" className={`sd-mobile-drawer${open ? " is-open" : ""}`} role={open ? "dialog" : undefined} aria-modal={open ? true : undefined} aria-label={open ? "网站导航" : undefined}>
        <nav aria-label="移动导航">
          <details><summary>产品</summary><div>{productCategories.map((item) => <Link onClick={close} key={item.slug} href={`/line-card/#${item.slug}`}>{item.title}</Link>)}</div></details>
          <details><summary>制造商</summary><div>{manufacturers.map((item) => <Link onClick={close} key={item} href="/line-card/#manufacturers">{item}</Link>)}</div></details>
          <details><summary>供应链服务</summary><div><Link onClick={close} href="/capabilities/#sourcing">短缺料寻源</Link><Link onClick={close} href="/capabilities/#bom">BOM 供应协同</Link><Link onClick={close} href="/capabilities/#delivery">交付协同</Link></div></details>
          <details><summary>工程与设计</summary><div><Link onClick={close} href="/solutions/#embedded">嵌入式方案协同</Link></div></details>
          <Link onClick={close} href="/solutions/">行业</Link>
          <details><summary>质量与资源</summary><div><Link onClick={close} href="/quality/">质量与溯源</Link><Link onClick={close} href="/#quality-matrix">证据矩阵</Link><Link onClick={close} href="/#resources">资源与下载</Link></div></details>
          <Link onClick={close} href="/about/">关于</Link>
        </nav>
        <div className="sd-mobile-drawer__actions"><RfqIntentButton onNavigate={close} intent={{ requestType: "BOM 供应与成本评估" }} className="button button--outline">BOM 整理</RfqIntentButton><Link onClick={close} className="button button--primary" href="/#contact">联系商务</Link><a href={`mailto:${salesEmail}`}>{salesEmail}</a><a href={`tel:${salesPhoneHref}`}>{salesPhone}</a></div>
      </div>
    </header>
  </>;
}
