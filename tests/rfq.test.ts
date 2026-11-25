import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildMailto,
  buildRfqText,
  emptyRfq,
  parseBomItems,
  validateRfq,
  validateRfqStep,
  type RfqFormData,
} from "../lib/rfq";
import { resolveRfqIntent } from "../lib/rfq-navigation";

const businessEmail = "chenfeng@jyera.com";
const validShortage: RfqFormData = {
  ...emptyRfq,
  partNumber: "MCU-TEST-001",
  manufacturer: "Example Manufacturer",
  quantity: "1200",
  targetDate: "2027-12-31",
  deliveryRegion: "广东省深圳市",
  details: "封装与批次以项目确认为准，需要分批交付。",
};

describe("conditional RFQ validation without visitor contact fields", () => {
  it("contains only business requirement fields and requires no visitor identity or contact data", () => {
    assert.deepEqual(Object.keys(emptyRfq).sort(), [
      "application", "bomText", "deliveryRegion", "details", "interfaces", "lifecycle", "manufacturer", "objective", "packageRequirement", "partNumber", "projectStage", "quantity", "requestType", "substitutionBoundary", "targetDate", "temperatureRange",
    ]);
    assert.deepEqual(Object.keys(validateRfq(emptyRfq)).sort(), ["partNumber", "quantity"]);
    assert.deepEqual(Object.keys(validateRfqStep(emptyRfq, 1)).sort(), ["partNumber", "quantity"]);
    assert.deepEqual(validateRfqStep(validShortage, 2), {});
  });

  it("accepts a valid shortage and rejects malformed quantities, dates and oversized details", () => {
    assert.deepEqual(validateRfq(validShortage), {});
    for (const quantity of ["0", "-1", "1.5", "1e3", "1000000000", "abc"]) assert.ok(validateRfq({ ...validShortage, quantity }).quantity, quantity);
    assert.ok(validateRfq({ ...validShortage, targetDate: "2027-02-30" }).targetDate);
    assert.ok(validateRfq({ ...validShortage, details: "x".repeat(1201) }).details);
  });

  it("validates BOM rows without requiring a single part number or quantity", () => {
    const bom = { ...validShortage, requestType: "BOM 供应与成本评估", partNumber: "", quantity: "", bomText: "BOM-A | Brand | 100 | 2027-12-31\nBOM-B,Other Brand,50," };
    assert.deepEqual(validateRfq(bom), {});
    assert.equal(parseBomItems(bom.bomText).length, 2);
    assert.ok(validateRfq({ ...bom, bomText: "" }).bomText);
    assert.ok(validateRfq({ ...bom, bomText: "BOM-A | Brand | 0" }).bomText);
    assert.ok(validateRfq({ ...bom, bomText: "BOM-A | Brand | 10 | 2027-02-30" }).bomText);
    assert.equal(validateRfq(bom).partNumber, undefined);
    assert.equal(validateRfq(bom).quantity, undefined);
  });

  it("uses application, stage and objective for project requests instead of part fields", () => {
    for (const requestType of ["嵌入式技术方案沟通", "端到端供应链协同"]) {
      const project = { ...validShortage, requestType, partNumber: "", quantity: "", application: "工业机器人控制器", projectStage: "原型开发", objective: "明确控制架构、关键接口与供应约束。" };
      assert.deepEqual(validateRfq(project), {}, requestType);
      const missing = validateRfq({ ...project, application: "", projectStage: "", objective: "" });
      assert.ok(missing.application && missing.projectStage && missing.objective);
      assert.equal(missing.partNumber, undefined);
      assert.equal(missing.quantity, undefined);
    }
  });

  it("validates other requests by objective", () => {
    const other = { ...validShortage, requestType: "其他业务需求", partNumber: "", quantity: "", objective: "讨论真实项目合作边界。" };
    assert.deepEqual(validateRfq(other), {});
    assert.ok(validateRfq({ ...other, objective: "" }).objective);
  });
});

describe("local RFQ generation and direct business contact", () => {
  it("builds a complete shortage record with no visitor contact fields and uses it as the full mail body", () => {
    const text = buildRfqText(validShortage);
    assert.match(text, /MCU-TEST-001/);
    assert.match(text, /需求数量：1200/);
    assert.match(text, /交付地区：广东省深圳市/);
    assert.match(text, /不代表已经发送、受理或形成报价/);
    assert.doesNotMatch(text, /联系人：|公司 \/ 团队：|联系邮箱：|联系电话：/);
    const url = new URL(buildMailto(businessEmail, validShortage));
    assert.equal(url.protocol, "mailto:");
    assert.equal(url.pathname, businessEmail);
    assert.match(url.searchParams.get("subject") ?? "", /MCU-TEST-001/);
    assert.equal(url.searchParams.get("body"), text);
  });

  it("retains complete BOM content in both the downloadable record and mail body", () => {
    const bom = { ...validShortage, requestType: "BOM 供应与成本评估", partNumber: "", quantity: "", bomText: "LONG-PART-001 | Brand | 100\nLONG-PART-002 | Brand | 200" };
    const text = buildRfqText(bom);
    assert.match(text, /LONG-PART-001/);
    assert.match(text, /LONG-PART-002/);
    const body = new URL(buildMailto(businessEmail, bom)).searchParams.get("body") ?? "";
    assert.equal(body, text);
    assert.match(body, /LONG-PART-001/);
    assert.match(body, /附件/);
  });

  it("generates project records without inventing part numbers or quantities", () => {
    const project = { ...validShortage, requestType: "嵌入式技术方案沟通", partNumber: "", quantity: "", application: "医疗设备控制器", projectStage: "概念评估", objective: "梳理精密信号链与验证边界。" };
    const text = buildRfqText(project);
    assert.match(text, /医疗设备控制器/);
    assert.match(text, /梳理精密信号链/);
    assert.doesNotMatch(text, /需求数量：/);
    assert.match(new URL(buildMailto(businessEmail, project)).searchParams.get("body") ?? "", /项目阶段：概念评估/);
  });

  it("reflects actual encoded mailto length when the complete record is long", () => {
    const longEncoded = { ...validShortage, partNumber: "型".repeat(120) };
    assert.ok(buildMailto(businessEmail, longEncoded).length > 1800);
    const bom = { ...validShortage, requestType: "BOM 供应与成本评估", partNumber: "", quantity: "", bomText: "BOM-A | Brand | 100\n".repeat(40), details: "长需求内容".repeat(240) };
    assert.ok(buildRfqText(bom).length > 1400);
    assert.ok(buildMailto(businessEmail, bom).length > 1800);
  });

  it("uses explicit optional markers and refuses unsafe configured recipients", () => {
    const text = buildRfqText({ ...validShortage, manufacturer: "", targetDate: "", details: "" });
    assert.match(text, /品牌：未填写/);
    assert.match(text, /目标交付日期：未填写/);
    assert.equal(buildMailto("", validShortage), "");
    assert.equal(buildMailto("not-an-email", validShortage), "");
    assert.equal(buildMailto("chenfeng@jyera.com?bcc=other@jyera.com", validShortage), "");
    assert.equal(buildMailto("chenfeng@jyera.com\r\nBcc:other@jyera.com", validShortage), "");
  });
});

describe("sequential RFQ intent resolution", () => {
  it("clears only conflicting identity fields while preserving delivery conditions", () => {
    const initial = { ...validShortage, partNumber: "STM32F103C8T6", manufacturer: "", quantity: "500", targetDate: "2028-01-31", deliveryRegion: "广东省深圳市" };
    const manufacturer = resolveRfqIntent(initial, { kind: "manufacturer", manufacturer: "Texas Instruments", details: "制造商入口" });
    assert.equal(manufacturer.data.partNumber, "");
    assert.equal(manufacturer.data.manufacturer, "Texas Instruments");
    assert.equal(manufacturer.data.quantity, "500");
    assert.match(manufacturer.notice, /清除旧完整料号/);

    const category = resolveRfqIntent(manufacturer.data, { kind: "category", details: "产品分类：处理器与可编程逻辑" });
    assert.equal(category.data.partNumber, "");
    assert.equal(category.data.manufacturer, "");
    assert.equal(category.data.targetDate, "2028-01-31");

    const specific = resolveRfqIntent(category.data, { kind: "partNumber", partNumber: "STM32F407VET6", details: "具体料号入口" });
    assert.equal(specific.data.partNumber, "STM32F407VET6");
    assert.equal(specific.data.manufacturer, "");
    assert.equal(specific.data.quantity, "500");
    assert.equal(specific.data.deliveryRegion, "广东省深圳市");
    const text = buildRfqText(specific.data);
    assert.match(text, /STM32F407VET6/);
    assert.doesNotMatch(text, /STM32F103C8T6|Texas Instruments/);
    assert.match(text, /品牌：未填写/);

    const explicitBrand = resolveRfqIntent(category.data, { kind: "partNumber", partNumber: "NXP-EXAMPLE-001", manufacturer: "NXP" });
    assert.equal(explicitBrand.data.manufacturer, "NXP");
    assert.equal(explicitBrand.data.deliveryRegion, "广东省深圳市");
  });
});
