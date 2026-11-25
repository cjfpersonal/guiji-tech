"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { RFQ_INTENT_EVENT } from "@/lib/rfq-navigation";
import { salesEmail, salesPhone, salesPhoneHref } from "@/lib/site";

const RfqForm = dynamic(() => import("@/components/rfq-form").then((module) => module.RfqForm), {
  ssr: false,
  loading: () => <div className="rfq-loading" role="status">正在加载需求整理工具…</div>,
});

export function LazyRfq() {
  const [active, setActive] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setActive(true);
        observer.disconnect();
      }
    }, { rootMargin: "300px 0px" });
    observer.observe(root);
    const activate = () => setActive(true);
    window.addEventListener(RFQ_INTENT_EVENT, activate);
    return () => {
      observer.disconnect();
      window.removeEventListener(RFQ_INTENT_EVENT, activate);
    };
  }, []);

  return <div ref={rootRef} className="lazy-rfq">
    {active ? <RfqForm /> : <div className="rfq-loading"><h3>需求整理工具</h3><p>滚动到此处时加载；也可以直接邮件或电话联系商务。</p></div>}
    <noscript><div className="no-script">需求整理需要 JavaScript。请直接邮件联系 <a href={`mailto:${salesEmail}`}>{salesEmail}</a>，或致电 <a href={`tel:${salesPhoneHref}`}>{salesPhone}</a>。</div></noscript>
  </div>;
}
