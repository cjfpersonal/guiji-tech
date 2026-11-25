import type { RfqFormData } from "@/lib/rfq";

export const RFQ_INTENT_EVENT = "sourcedesk:rfq-intent";

export type RfqIntentKind = "partNumber" | "manufacturer" | "category" | "generic";

export type RfqIntent = Partial<Pick<RfqFormData,
  "requestType" | "partNumber" | "manufacturer" | "quantity" | "targetDate" | "deliveryRegion" |
  "bomText" | "application" | "projectStage" | "objective" | "packageRequirement" |
  "temperatureRange" | "interfaces" | "lifecycle" | "substitutionBoundary" | "details"
>> & { kind?: RfqIntentKind };

export function resolveRfqIntent(current: RfqFormData, intent: RfqIntent): { data: RfqFormData; notice: string } {
  const { kind: explicitKind, ...fields } = intent;
  const kind = explicitKind ?? (fields.partNumber?.trim() ? "partNumber" : fields.manufacturer?.trim() ? "manufacturer" : fields.details?.match(/^(产品分类|检索分类)：/) ? "category" : "generic");
  if (kind === "manufacturer") {
    return {
      data: { ...current, ...fields, requestType: fields.requestType ?? "短缺料快速询价", partNumber: "", manufacturer: fields.manufacturer ?? "", details: fields.details ?? "" },
      notice: "已更新制造商，并清除旧完整料号；数量、目标日期和交付地区保持不变。",
    };
  }
  if (kind === "category") {
    return {
      data: { ...current, ...fields, requestType: fields.requestType ?? "短缺料快速询价", partNumber: "", manufacturer: "", details: fields.details ?? "" },
      notice: "已切换产品分类，并清除冲突的旧料号与品牌；交付条件保持不变。",
    };
  }
  if (kind === "partNumber") {
    return {
      data: { ...current, ...fields, requestType: fields.requestType ?? "短缺料快速询价", partNumber: fields.partNumber ?? "", manufacturer: fields.manufacturer ?? "" },
      notice: fields.manufacturer ? "已带入完整料号与制造商；其他非冲突交付字段保持不变。" : "已带入完整料号；未可靠识别的品牌已留空，其他交付条件保持不变。",
    };
  }
  return { data: { ...current, ...fields }, notice: "" };
}

export function readRfqIntent(search: string): RfqIntent {
  const params = new URLSearchParams(search);
  const intent: RfqIntent = {};
  const fields: (keyof RfqIntent)[] = [
    "requestType", "partNumber", "manufacturer", "quantity", "targetDate", "deliveryRegion",
    "application", "projectStage", "objective", "packageRequirement", "temperatureRange",
    "interfaces", "lifecycle", "substitutionBoundary", "details",
  ];
  for (const field of fields) {
    const value = params.get(field)?.trim();
    if (value) Object.assign(intent, { [field]: value.slice(0, field === "details" || field === "objective" ? 1200 : 240) });
  }
  const kind = params.get("kind");
  if (kind === "partNumber" || kind === "manufacturer" || kind === "category" || kind === "generic") intent.kind = kind;
  return intent;
}

export function goToRfq(intent: RfqIntent, navigate: (url: string) => void) {
  if (window.location.pathname === "/") {
    window.dispatchEvent(new CustomEvent<RfqIntent>(RFQ_INTENT_EVENT, { detail: intent }));
    return;
  }
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(intent)) {
    if (typeof value === "string" && value.trim()) params.set(key, value.trim());
  }
  navigate(`/?${params.toString()}#rfq`);
}
