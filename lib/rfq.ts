export type RfqFormData = {
  requestType: string;
  partNumber: string;
  manufacturer: string;
  quantity: string;
  targetDate: string;
  deliveryRegion: string;
  bomText: string;
  application: string;
  projectStage: string;
  objective: string;
  packageRequirement: string;
  temperatureRange: string;
  interfaces: string;
  lifecycle: string;
  substitutionBoundary: string;
  details: string;
};

export type RfqErrors = Partial<Record<keyof RfqFormData, string>>;
export type RfqStep = 1 | 2;

export const requestTypes = [
  "短缺料快速询价",
  "BOM 供应与成本评估",
  "嵌入式技术方案沟通",
  "端到端供应链协同",
  "其他业务需求",
] as const;

export const projectStages = ["概念评估", "原型开发", "试产验证", "量产与迁移"] as const;

export const emptyRfq: RfqFormData = {
  requestType: "短缺料快速询价",
  partNumber: "",
  manufacturer: "",
  quantity: "",
  targetDate: "",
  deliveryRegion: "",
  bomText: "",
  application: "",
  projectStage: "",
  objective: "",
  packageRequirement: "",
  temperatureRange: "",
  interfaces: "",
  lifecycle: "",
  substitutionBoundary: "",
  details: "",
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const quantityPattern = /^[1-9]\d{0,8}$/;

export function isBomRequest(data: Pick<RfqFormData, "requestType">) {
  return data.requestType === "BOM 供应与成本评估";
}

export function isProjectRequest(data: Pick<RfqFormData, "requestType">) {
  return data.requestType === "嵌入式技术方案沟通" || data.requestType === "端到端供应链协同";
}

// Only validates the configured business recipient, never a visitor's contact details.
export function isValidEmail(value: string) {
  const email = value.trim();
  return email.length > 0 && email.length <= 254 && !/[\r\n]/.test(email) && emailPattern.test(email);
}

export type BomItem = { partNumber: string; manufacturer: string; quantity: string; targetDate: string };

export function parseBomItems(value: string): BomItem[] {
  return value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean).map((line) => {
    const parts = line.split(line.includes("|") ? "|" : ",").map((part) => part.trim());
    return { partNumber: parts[0] ?? "", manufacturer: parts[1] ?? "", quantity: parts[2] ?? "", targetDate: parts[3] ?? "" };
  });
}

function validDate(value: string) {
  if (!value) return true;
  const parsed = new Date(`${value}T00:00:00Z`);
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

export function stepFields(data: RfqFormData, step: RfqStep): (keyof RfqFormData)[] {
  if (step === 2) return ["targetDate", "deliveryRegion", "packageRequirement", "temperatureRange", "interfaces", "lifecycle", "substitutionBoundary", "details"];
  if (isBomRequest(data)) return ["requestType", "bomText"];
  if (isProjectRequest(data)) return ["requestType", "application", "projectStage", "objective"];
  if (data.requestType === "其他业务需求") return ["requestType", "objective"];
  return ["requestType", "partNumber", "manufacturer", "quantity"];
}

export function validateRfqStep(data: RfqFormData, step: RfqStep): RfqErrors {
  const errors: RfqErrors = {};
  const requiredText = (field: keyof RfqFormData, label: string, max: number) => {
    const value = data[field].trim();
    if (!value) errors[field] = `请填写${label}`;
    else if (value.length > max) errors[field] = `${label}不能超过 ${max} 个字符`;
  };
  const fields = stepFields(data, step);
  const active = (field: keyof RfqFormData) => fields.includes(field);

  if (active("requestType") && !requestTypes.includes(data.requestType as (typeof requestTypes)[number])) {
    errors.requestType = "请选择有效的需求类型";
  }
  if (active("partNumber")) requiredText("partNumber", "完整型号或需求器件", 120);
  if (active("quantity")) requiredText("quantity", "需求数量", 12);
  if (active("application")) requiredText("application", "应用或产品场景", 200);
  if (active("projectStage")) requiredText("projectStage", "项目阶段", 80);
  if (active("objective")) requiredText("objective", "项目目标或待解决问题", 1200);

  if (active("manufacturer") && data.manufacturer.trim().length > 100) errors.manufacturer = "品牌不能超过 100 个字符";
  for (const [field, label, max] of [["deliveryRegion", "交付地区", 160], ["packageRequirement", "封装要求", 160], ["temperatureRange", "温度范围", 120], ["interfaces", "关键接口", 300], ["lifecycle", "生命周期", 300], ["substitutionBoundary", "替代边界", 600]] as const) {
    if (active(field) && data[field].trim().length > max) errors[field] = `${label}不能超过 ${max} 个字符`;
  }
  if (active("details") && data.details.trim().length > 1200) errors.details = "需求补充不能超过 1200 个字符";
  if (active("quantity") && data.quantity.trim() && !quantityPattern.test(data.quantity.trim())) errors.quantity = "请输入 1 至 999999999 之间的整数";
  if (active("targetDate") && !validDate(data.targetDate)) errors.targetDate = "请选择有效的目标日期";

  if (active("bomText")) {
    if (!data.bomText.trim()) errors.bomText = "请至少填写一行 BOM 条目";
    else if (data.bomText.length > 20000) errors.bomText = "BOM 内容不能超过 20000 个字符";
    else {
      const items = parseBomItems(data.bomText);
      if (items.length > 100) errors.bomText = "单次最多整理 100 行 BOM，请分批整理";
      else {
        const invalidIndex = items.findIndex((item) => !item.partNumber || !quantityPattern.test(item.quantity) || !validDate(item.targetDate));
        if (invalidIndex >= 0) errors.bomText = `第 ${invalidIndex + 1} 行需包含完整型号和有效数量，日期格式应为 YYYY-MM-DD`;
      }
    }
  }
  return errors;
}

export function validateRfq(data: RfqFormData): RfqErrors {
  return { ...validateRfqStep(data, 1), ...validateRfqStep(data, 2) };
}

export function buildRfqText(data: RfqFormData) {
  const value = (field: keyof RfqFormData) => data[field].trim() || "未填写";
  const lines = ["硅基深度求索科技｜业务需求单", "================================", `需求类型：${value("requestType")}`];

  if (isBomRequest(data)) {
    lines.push("", "BOM 条目（型号 | 品牌 | 数量 | 目标日期）：", data.bomText.trim());
  } else if (isProjectRequest(data)) {
    lines.push(`应用 / 产品场景：${value("application")}`, `项目阶段：${value("projectStage")}`, `项目目标：${value("objective")}`, `关键参数 / 封装：${value("packageRequirement")}`, `温度范围：${value("temperatureRange")}`, `关键接口：${value("interfaces")}`, `生命周期要求：${value("lifecycle")}`, `替代边界：${value("substitutionBoundary")}`);
  } else if (data.requestType === "其他业务需求") {
    lines.push(`需求目标：${value("objective")}`);
  } else {
    lines.push(`完整型号 / 需求器件：${value("partNumber")}`, `品牌：${value("manufacturer")}`, `需求数量：${value("quantity")}`);
  }

  lines.push("", `目标交付日期：${value("targetDate")}`, `交付地区：${value("deliveryRegion")}`, "", "需求补充：", value("details"), "", "说明：此需求单由浏览器本地生成，不代表已经发送、受理或形成报价。请主动通过邮件或电话联系商务；BOM 或其他附件需在邮件客户端中手动添加。");
  return lines.join("\n");
}

export function buildMailto(recipient: string, data: RfqFormData) {
  const email = recipient.trim();
  if (!isValidEmail(email)) return "";
  const subject = `官网需求｜${data.requestType}｜${isBomRequest(data) ? `${parseBomItems(data.bomText).length} 行 BOM` : isProjectRequest(data) ? data.application.trim() : data.partNumber.trim() || data.objective.trim()}`;
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(buildRfqText(data))}`;
}
