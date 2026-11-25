"use client";

import Link from "next/link";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main id="main-content" className="status-page">
      <div className="container">
        <span className="eyebrow">页面错误</span>
        <h1>页面暂时无法显示。</h1>
        <p>你的需求尚未因此提交。请重试；若问题持续，可返回首页继续浏览。</p>
        <div><button className="button button--primary" type="button" onClick={reset}>重新加载</button><Link className="button button--outline" href="/">返回首页</Link></div>
      </div>
    </main>
  );
}
