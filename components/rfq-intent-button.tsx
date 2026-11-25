"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { goToRfq, type RfqIntent } from "@/lib/rfq-navigation";

export function RfqIntentButton({ intent, children, className = "button button--primary", onNavigate, ariaLabel }: {
  intent: RfqIntent;
  children: ReactNode;
  className?: string;
  onNavigate?: () => void;
  ariaLabel?: string;
}) {
  const router = useRouter();
  return <button type="button" className={className} aria-label={ariaLabel} onClick={() => { onNavigate?.(); goToRfq(intent, (url) => router.push(url)); }}>{children}</button>;
}
