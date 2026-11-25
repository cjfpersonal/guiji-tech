import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main-content" className="status-page">
      <div className="container"><span className="eyebrow">页面未找到</span><h1>这条路径不存在。</h1><p>返回首页，或从产品与品牌索引继续查找所需信息。</p><div><Link className="button button--primary" href="/">返回首页</Link><Link className="button button--outline" href="/line-card">查看产品索引</Link></div></div>
    </main>
  );
}
