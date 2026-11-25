"use client";

import { useMemo, useState } from "react";
import { productCategories } from "@/lib/content";

export function ProductExplorer({ featured = false }: { featured?: boolean }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const results = useMemo(() => {
    if (featured) return productCategories.slice(0, 6);
    const keyword = query.trim().toLocaleLowerCase();
    return productCategories.filter((item) => {
      const matchesCategory = category === "all" || item.slug === category;
      const haystack = [item.title, item.english, item.description, item.applications, ...item.examples].join(" ").toLocaleLowerCase();
      return matchesCategory && (!keyword || haystack.includes(keyword));
    });
  }, [category, featured, query]);

  return (
    <div className="product-explorer">
      {!featured && <div className="product-toolbar">
        <div className="search-field"><label htmlFor="product-search">检索产品分类</label><div><span aria-hidden="true">⌕</span><input id="product-search" type="search" placeholder="输入器件、分类或应用，例如 FPGA / 电源" value={query} onChange={(event) => setQuery(event.target.value)} /></div></div>
        <p className="product-count" aria-live="polite"><strong>{results.length}</strong> 个匹配分类</p>
      </div>}
      {!featured && <div className="filter-row" aria-label="按产品分类筛选">
        <button type="button" aria-pressed={category === "all"} onClick={() => setCategory("all")}>全部</button>
        {productCategories.map((item) => <button type="button" key={item.slug} aria-pressed={category === item.slug} onClick={() => setCategory(item.slug)}>{item.title}</button>)}
      </div>}
      {results.length > 0 ? (
        <div className="product-grid">{results.map((item) => (
          <article className="product-card" key={item.slug} id={item.slug}>
            <h3>{item.title}</h3><p>{item.description}</p>
            <ul aria-label={`${item.title}典型器件`}>{item.examples.map((example) => <li key={example}>{example}</li>)}</ul>
            <div className="product-card__application"><span>典型应用</span><strong>{item.applications}</strong></div>
          </article>
        ))}</div>
      ) : (
        <div className="empty-state" role="status"><h3>当前分类索引中没有匹配项</h3><p>这不代表无法寻源。可清除筛选，或在需求单中提交完整型号。</p><button className="button button--outline" type="button" onClick={() => { setQuery(""); setCategory("all"); }}>清除筛选</button></div>
      )}
    </div>
  );
}
