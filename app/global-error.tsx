"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="zh-CN"><body style={{ margin: 0, padding: "10vw", background: "#f5f5f7", color: "#1d1d1f", fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif" }}>
      <main><p>页面错误</p><h1>页面暂时无法显示。</h1><p>请重试，尚未提交的信息不会自动发送。</p><button style={{ padding: "12px 20px", border: 0, borderRadius: 999, background: "#0071e3", color: "white" }} type="button" onClick={reset}>重新加载</button></main>
    </body></html>
  );
}
