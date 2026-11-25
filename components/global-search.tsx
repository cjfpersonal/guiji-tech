"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { manufacturers, productCategories } from "@/lib/content";
import { goToRfq } from "@/lib/rfq-navigation";

export function GlobalSearch() {
  const router = useRouter();
  const navigate = (url: string) => router.push(url);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const normalized = query.trim().toLocaleLowerCase();
  const categories = useMemo(() => normalized ? productCategories.filter((item) => [item.title, item.english, item.description, item.applications, ...item.examples].join(" ").toLocaleLowerCase().includes(normalized)).slice(0, 4) : [], [normalized]);
  const brands = useMemo(() => normalized ? manufacturers.filter((item) => item.toLocaleLowerCase().includes(normalized)).slice(0, 3) : [], [normalized]);

  useEffect(() => {
    const close = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, []);

  function submit(event: FormEvent) {
    event.preventDefault();
    const value = query.trim();
    if (!value) return;
    setOpen(false);
    goToRfq({ kind: "partNumber", requestType: "短缺料快速询价", partNumber: value, details: "由 SourceDesk 全局搜索带入；尚未核对制造商完整订购型号。" }, navigate);
  }

  function inputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") setOpen(false);
    if (event.key === "ArrowDown" && open) {
      event.preventDefault();
      rootRef.current?.querySelector<HTMLElement>("[data-search-item]")?.focus();
    }
  }

  const hasResults = categories.length > 0 || brands.length > 0;

  return <div className="sd-search" ref={rootRef}>
    <form onSubmit={submit} role="search" className="sd-search__form">
      <label className="sr-only" htmlFor="global-part-search">搜索完整料号、产品分类或制造商</label>
      <span className="sd-search__scope" aria-hidden="true">器件</span>
      <input id="global-part-search" type="search" value={query} placeholder="完整料号 / 分类 / 制造商" autoComplete="off"
        role="combobox" aria-autocomplete="list" aria-expanded={open && Boolean(normalized)} aria-controls="global-search-results"
        onFocus={() => setOpen(true)} onChange={(event) => { setQuery(event.target.value); setOpen(true); }} onKeyDown={inputKeyDown} />
      <button type="submit" aria-label="搜索，按输入型号整理需求">搜索</button>
    </form>
    {open && normalized && <div className="sd-search__results" id="global-search-results">
      <div className="sd-search__note">本地分类与制造商索引 · 非实时库存查询</div>
      {categories.length > 0 && <section><h2>产品分类</h2>{categories.map((item) => <div className="sd-search__result" key={item.slug}>
        <Link data-search-item href={`/line-card/#${item.slug}`} onClick={() => setOpen(false)}><strong>{item.title}</strong><small>{item.examples.slice(0, 2).join(" · ")}</small></Link>
        <button type="button" onClick={() => { setOpen(false); goToRfq({ kind: "category", requestType: "短缺料快速询价", partNumber: "", manufacturer: "", details: `检索分类：${item.title}\n检索词：${query.trim()}\n请按完整订购型号进一步核对。` }, navigate); }}>带入 RFQ</button>
      </div>)}</section>}
      {brands.length > 0 && <section><h2>制造商文字索引</h2>{brands.map((item) => <div className="sd-search__result" key={item}>
        <Link data-search-item href="/line-card/#manufacturers" onClick={() => setOpen(false)}><strong>{item}</strong><small>名称索引不代表授权或库存</small></Link>
        <button type="button" onClick={() => { setOpen(false); goToRfq({ kind: "manufacturer", requestType: "短缺料快速询价", manufacturer: item, details: `由制造商索引 ${item} 带入，请补充完整型号。` }, navigate); }}>带入 RFQ</button>
      </div>)}</section>}
      {!hasResults && <div className="sd-search__empty" role="status"><strong>本地索引未匹配</strong><p>这不代表无法寻源。可按“{query.trim()}”整理完整型号需求。</p></div>}
      <button type="button" className="sd-search__all" data-search-item onClick={() => { setOpen(false); goToRfq({ kind: "partNumber", requestType: "短缺料快速询价", partNumber: query.trim(), details: "由 SourceDesk 搜索带入，待核对完整规格。" }, navigate); }}>按“{query.trim()}”整理型号需求 <span aria-hidden="true">→</span></button>
    </div>}
  </div>;
}
