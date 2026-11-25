"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { emptyRfq, type RfqFormData } from "@/lib/rfq";
import { readRfqIntent, resolveRfqIntent, RFQ_INTENT_EVENT, type RfqIntent } from "@/lib/rfq-navigation";

type QuickStartData = { partNumber: string; quantity: string; targetDate: string; deliveryRegion?: string };
type RfqContextValue = {
  data: RfqFormData;
  intentNotice: string;
  updateField: (field: keyof RfqFormData, value: string) => void;
  applyQuickStart: (quick: QuickStartData) => void;
};

const RfqContext = createContext<RfqContextValue | null>(null);

export function RfqProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<RfqFormData>({ ...emptyRfq });
  const [intentNotice, setIntentNotice] = useState("");

  useEffect(() => {
    const applyIntent = (intent: RfqIntent) => {
      setIntentNotice(resolveRfqIntent(emptyRfq, intent).notice);
      setData((current) => resolveRfqIntent(current, intent).data);
      window.setTimeout(() => document.querySelector("#rfq")?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" }), 50);
    };
    const initial = readRfqIntent(window.location.search);
    if (Object.keys(initial).length) applyIntent(initial);
    const listener = (event: Event) => applyIntent((event as CustomEvent<RfqIntent>).detail);
    window.addEventListener(RFQ_INTENT_EVENT, listener);
    return () => window.removeEventListener(RFQ_INTENT_EVENT, listener);
  }, []);

  const value = useMemo<RfqContextValue>(() => ({
    data,
    intentNotice,
    updateField: (field, fieldValue) => { setIntentNotice(""); setData((current) => ({ ...current, [field]: fieldValue })); },
    applyQuickStart: (quick) => setData((current) => resolveRfqIntent(current, {
      kind: "partNumber",
      requestType: "短缺料快速询价",
      partNumber: quick.partNumber,
      quantity: quick.quantity,
      targetDate: quick.targetDate,
      deliveryRegion: quick.deliveryRegion ?? current.deliveryRegion,
    }).data),
  }), [data, intentNotice]);
  return <RfqContext.Provider value={value}>{children}</RfqContext.Provider>;
}

export function useRfq() {
  const context = useContext(RfqContext);
  if (!context) throw new Error("useRfq must be used within RfqProvider");
  return context;
}
