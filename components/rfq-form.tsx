"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { useRfq } from "@/components/rfq-context";
import {
  buildMailto,
  buildRfqText,
  isBomRequest,
  isProjectRequest,
  parseBomItems,
  projectStages,
  requestTypes,
  stepFields,
  validateRfq,
  validateRfqStep,
  type RfqErrors,
  type RfqFormData,
  type RfqStep,
} from "@/lib/rfq";
import { salesEmail, salesPhone, salesPhoneHref } from "@/lib/site";
import { RFQ_INTENT_EVENT } from "@/lib/rfq-navigation";

const stepNames = ["整理需求", "核对并联系"] as const;
const fieldLabels: Record<keyof RfqFormData, string> = {
  requestType: "需求类型", partNumber: "完整型号", manufacturer: "品牌", quantity: "需求数量", targetDate: "目标日期",
  bomText: "BOM 条目", application: "应用 / 产品场景", projectStage: "项目阶段", objective: "项目目标", details: "需求补充",
  deliveryRegion: "交付地区", packageRequirement: "关键参数 / 封装", temperatureRange: "温度范围",
  interfaces: "关键接口", lifecycle: "生命周期要求", substitutionBoundary: "替代边界",
};

type GeneratedRfq = { text: string; mailto: string };

export function RfqForm() {
  const { data, updateField, intentNotice } = useRfq();
  const [step, setStep] = useState<RfqStep>(1);
  const [maxVisited, setMaxVisited] = useState<RfqStep>(1);
  const [errors, setErrors] = useState<RfqErrors>({});
  const [generated, setGenerated] = useState<GeneratedRfq | null>(null);
  const [actionStatus, setActionStatus] = useState("");
  const titleRef = useRef<HTMLHeadingElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const previousStep = useRef<RfqStep>(1);
  const fullText = buildRfqText(data);
  const prospectiveMailto = buildMailto(salesEmail, data);
  const longRfq = prospectiveMailto.length > 1800;

  useEffect(() => {
    const reset = () => {
      setStep(1);
      setMaxVisited(1);
      setErrors({});
      setGenerated(null);
      setActionStatus("");
    };
    window.addEventListener(RFQ_INTENT_EVENT, reset);
    return () => window.removeEventListener(RFQ_INTENT_EVENT, reset);
  }, []);

  useEffect(() => {
    if (previousStep.current === step) return;
    previousStep.current = step;
    const frame = window.requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ block: "start", behavior: "instant" });
      titleRef.current?.focus({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [step]);

  function changeField(field: keyof RfqFormData, value: string) {
    updateField(field, value);
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
    if (field === "requestType") {
      setErrors({});
      setMaxVisited(1);
    }
    setGenerated(null);
    setActionStatus("");
  }

  function goToStep(next: RfqStep) {
    setErrors({});
    setActionStatus("");
    setGenerated(null);
    setMaxVisited((current) => Math.max(current, next) as RfqStep);
    setStep(next);
  }

  function focusFirstError(nextErrors: RfqErrors) {
    const first = Object.keys(nextErrors)[0] as keyof RfqFormData | undefined;
    if (first) window.setTimeout(() => document.getElementById(`rfq-${first}`)?.focus(), 60);
  }

  function continueStep() {
    const nextErrors = validateRfqStep(data, step);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      focusFirstError(nextErrors);
      return;
    }
    if (step === 1) goToStep(2);
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    setActionStatus("");
    if (step === 1) {
      continueStep();
      return;
    }
    const nextErrors = validateRfq(data);
    if (Object.keys(nextErrors).length) {
      const firstStepInvalid = stepFields(data, 1).some((field) => nextErrors[field]);
      const targetStep: RfqStep = firstStepInvalid ? 1 : 2;
      setStep(targetStep);
      setErrors(nextErrors);
      setGenerated(null);
      focusFirstError(nextErrors);
      return;
    }
    setGenerated({ text: fullText, mailto: prospectiveMailto });
    window.requestAnimationFrame(() => resultRef.current?.focus());
  }

  async function copyRfq() {
    if (!generated) return;
    try {
      if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(generated.text);
      else {
        const textArea = document.createElement("textarea");
        textArea.value = generated.text;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.select();
        const copied = document.execCommand("copy");
        textArea.remove();
        if (!copied) throw new Error("Copy command unavailable");
      }
      setActionStatus("完整需求单已复制；仍需你主动联系商务。");
    } catch {
      setActionStatus("浏览器未允许复制，请下载完整需求单。");
    }
  }

  function downloadText() {
    if (!generated) return;
    const url = URL.createObjectURL(new Blob([generated.text], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `硅基深度求索-业务需求单-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setActionStatus("需求单已下载；文件尚未发送。");
  }

  function downloadBomTemplate() {
    const csv = "完整型号,品牌,需求数量,目标日期\n";
    const url = URL.createObjectURL(new Blob(["\ufeff", csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "BOM需求模板.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setActionStatus("BOM 模板已下载；填写后可在邮件客户端手动添加附件。");
  }

  const errorProps = (field: keyof RfqFormData, hasHint = false) => ({
    "aria-invalid": Boolean(errors[field]),
    "aria-describedby": [hasHint ? `rfq-${field}-hint` : "", errors[field] ? `rfq-${field}-error` : ""].filter(Boolean).join(" ") || undefined,
  });

  return (
    <form className="rfq-v3" ref={formRef} onSubmit={submit} noValidate>
      <noscript><div className="no-script">当前浏览器未启用 JavaScript，无法整理需求单。请直接邮件联系 <a href={`mailto:${salesEmail}`}>{salesEmail}</a>，或致电 <a href={`tel:${salesPhoneHref}`}>{salesPhone}</a>。</div></noscript>
      <div className="rfq-v3__topline"><span>SourceDesk</span><span>可选辅助 · 本地整理 · 主动联系</span></div>
      {intentNotice && <p className="rfq-intent-notice" role="status">{intentNotice}</p>}
      <ol className="rfq-progress" aria-label="需求单步骤">
        {stepNames.map((name, index) => {
          const number = (index + 1) as RfqStep;
          return <li key={name}><button type="button" aria-current={step === number ? "step" : undefined} disabled={number > maxVisited} onClick={() => goToStep(number)}><span aria-hidden="true" />{name}</button></li>;
        })}
      </ol>
      <p className="sr-only" aria-live="polite">第 {step} 步，共 2 步：{stepNames[step - 1]}</p>

      <div className="rfq-step-panel" key={step}>
        <div className="rfq-step-heading"><span>第 {step} 步 / 共 2 步</span><h3 id="rfq-step-title" ref={titleRef} tabIndex={-1}>{stepNames[step - 1]}</h3><p>{step === 1 ? "选择项目类型，只整理当前需要的业务资料。" : "补充交付条件并核对内容。无需填写你的联系方式，生成后请直接联系商务。"}</p></div>

        {Object.keys(errors).length > 0 && <div className="form-error-summary" role="alert"><strong>请检查当前步骤</strong>{Object.entries(errors).map(([field, message]) => <span key={field}>{fieldLabels[field as keyof RfqFormData]}：{message}</span>)}</div>}

        {step === 1 && <div className="rfq-fields">
          <SelectField id="requestType" label="需求类型" value={data.requestType} error={errors.requestType} onChange={changeField} options={[...requestTypes]} />
          {!isBomRequest(data) && !isProjectRequest(data) && data.requestType !== "其他业务需求" && <>
            <Field id="partNumber" label="完整型号" required value={data.partNumber} error={errors.partNumber} onChange={changeField} hint="包含后缀、封装或温度等级，避免只填写系列名。" placeholder="制造商完整料号" />
            <Field id="manufacturer" label="品牌（选填）" value={data.manufacturer} error={errors.manufacturer} onChange={changeField} placeholder="制造商名称" />
            <Field id="quantity" label="需求数量" required value={data.quantity} error={errors.quantity} onChange={changeField} inputMode="numeric" placeholder="1–999999999 的整数" />
          </>}
          {isBomRequest(data) && <div className="rfq-field rfq-field--full"><div className="rfq-field__label-row"><label htmlFor="rfq-bomText">BOM 条目 *</label><button type="button" onClick={downloadBomTemplate}>下载 CSV 模板</button></div><p className="field-hint" id="rfq-bomText-hint">每行一条：型号 | 品牌（可空） | 数量 | 日期（可选）。生成后请在邮件客户端手动添加原 BOM 附件，本站不会上传文件。</p><textarea id="rfq-bomText" rows={8} value={data.bomText} onChange={(event) => changeField("bomText", event.target.value)} placeholder={"完整型号 | 品牌 | 数量 | YYYY-MM-DD\n另一型号 | 品牌 | 数量"} {...errorProps("bomText", true)} /><div className="field-meta"><FieldError id="rfq-bomText-error" message={errors.bomText} /><span>{parseBomItems(data.bomText).length} 行有效输入</span></div></div>}
          {(isProjectRequest(data) || data.requestType === "其他业务需求") && <>
            {isProjectRequest(data) && <><Field id="application" label="应用 / 产品场景" required value={data.application} error={errors.application} onChange={changeField} placeholder="例如工业控制器、机器人或通信终端" /><SelectField id="projectStage" label="项目阶段" required value={data.projectStage} error={errors.projectStage} onChange={changeField} options={["", ...projectStages]} placeholder="请选择当前阶段" /></>}
            <TextArea id="objective" label={isProjectRequest(data) ? "项目目标 / 待解决问题" : "需求目标"} required value={data.objective} error={errors.objective} onChange={changeField} rows={5} placeholder={isProjectRequest(data) ? "当前约束、希望解决的问题与预期交付物" : "希望与商务讨论的事项"} />
          </>}
        </div>}

        {step === 2 && <>
          <div className="rfq-fields">
            <Field id="targetDate" label="目标交付日期（选填）" type="date" value={data.targetDate} error={errors.targetDate} onChange={changeField} />
            <Field id="deliveryRegion" label="交付地区（选填）" value={data.deliveryRegion} error={errors.deliveryRegion} onChange={changeField} placeholder="国家 / 省市 / 地区" />
            {isProjectRequest(data) && <>
              <Field id="packageRequirement" label="关键参数 / 封装（选填）" value={data.packageRequirement} error={errors.packageRequirement} onChange={changeField} placeholder="性能、封装与尺寸约束" />
              <Field id="temperatureRange" label="温度范围（选填）" value={data.temperatureRange} error={errors.temperatureRange} onChange={changeField} placeholder="例如 -40°C 至 85°C" />
              <Field id="interfaces" label="关键接口（选填）" value={data.interfaces} error={errors.interfaces} onChange={changeField} placeholder="例如 CAN、Ethernet、MIPI" />
              <Field id="lifecycle" label="生命周期要求（选填）" value={data.lifecycle} error={errors.lifecycle} onChange={changeField} placeholder="量产周期、停产风险与供货年限" />
              <TextArea id="substitutionBoundary" label="替代边界（选填）" value={data.substitutionBoundary} error={errors.substitutionBoundary} onChange={changeField} rows={3} hint="只整理边界，不会自动推荐未经验证的替代型号。" placeholder="允许评估的条件、禁止变更项与验证责任" />
            </>}
            <TextArea id="details" label="需求补充（选填）" value={data.details} error={errors.details} onChange={changeField} rows={5} hint="可补充批次、质量资料或验证边界；不要填写不必要的敏感信息。" placeholder="例如分批交付、包装或追溯资料要求" />
          </div>
          <Review data={data} onEdit={goToStep} />
          {longRfq && <p className="rfq-length-warning">完整需求单会作为邮件正文。当前邮件链接约 {prospectiveMailto.length} 个字符，部分邮件客户端可能截断；建议同时复制或下载需求单，并在邮件客户端中核对正文、手动添加附件。</p>}
        </>}

        <div className="rfq-actions">
          {step === 2 && <button className="button button--outline" type="button" onClick={() => goToStep(1)}>上一步</button>}
          <button className="button button--primary" type="submit">{step === 1 ? "继续" : "生成需求单"} <span aria-hidden="true">›</span></button>
        </div>
        <p className="rfq-privacy">此工具不要求或保存联系人、公司、邮箱、电话等访客联系方式，也没有在线提交后端。修改字段会使旧结果失效。详见 <Link href="/privacy">隐私政策</Link>。</p>
        <p className="action-status" aria-live="polite">{actionStatus}</p>
        {generated && <div className="rfq-result" ref={resultRef} tabIndex={-1} aria-live="polite"><span className="status-mark" aria-hidden="true">✓</span><div><h4>需求单已在本地整理完成</h4><p>尚未发送。可打开邮件客户端核对完整正文并主动发送，也可复制或下载后通过邮件、电话联系商务。</p><div className="rfq-result__actions">{generated.mailto && <a className="button button--primary" href={generated.mailto}>打开邮件客户端 <span aria-hidden="true">›</span></a>}<button className="button button--outline" type="button" onClick={copyRfq}>复制需求单</button><button className="button button--text" type="button" onClick={downloadText}>下载 .txt</button></div><details className="rfq-preview"><summary>预览完整需求单</summary><pre>{generated.text}</pre></details></div></div>}
      </div>
    </form>
  );
}

function Review({ data, onEdit }: { data: RfqFormData; onEdit: (step: RfqStep) => void }) {
  const rows: [string, string][] = isBomRequest(data)
    ? [["需求类型", data.requestType], ["BOM", `${parseBomItems(data.bomText).length} 行条目`], ["目标日期", data.targetDate || "未填写"]]
    : isProjectRequest(data)
      ? [["需求类型", data.requestType], ["应用场景", data.application], ["项目阶段", data.projectStage], ["项目目标", data.objective], ["关键参数 / 封装", data.packageRequirement || "未填写"], ["温度范围", data.temperatureRange || "未填写"], ["关键接口", data.interfaces || "未填写"], ["生命周期", data.lifecycle || "未填写"], ["替代边界", data.substitutionBoundary || "未填写"], ["目标日期", data.targetDate || "未填写"]]
      : data.requestType === "其他业务需求"
        ? [["需求类型", data.requestType], ["需求目标", data.objective], ["目标日期", data.targetDate || "未填写"]]
        : [["需求类型", data.requestType], ["完整型号", data.partNumber], ["品牌", data.manufacturer || "未填写"], ["需求数量", data.quantity], ["目标日期", data.targetDate || "未填写"]];
  return <div className="review-card"><div className="review-card__head"><h4>需求摘要</h4><div><button type="button" onClick={() => onEdit(1)}>编辑需求</button></div></div><dl>{rows.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}<div><dt>交付地区</dt><dd>{data.deliveryRegion || "未填写"}</dd></div>{data.details.trim() && <div><dt>需求补充</dt><dd>{data.details}</dd></div>}</dl></div>;
}

type BaseFieldProps = { id: keyof RfqFormData; label: string; value: string; error?: string; required?: boolean; hint?: string; onChange: (field: keyof RfqFormData, value: string) => void };
type FieldProps = BaseFieldProps & { type?: string; placeholder?: string; autoComplete?: string; inputMode?: "numeric" };

function Field({ id, label, value, error, required, hint, type = "text", placeholder, autoComplete, inputMode, onChange }: FieldProps) {
  return <div className="rfq-field"><label htmlFor={`rfq-${id}`}>{label}{required && " *"}</label>{hint && <p className="field-hint" id={`rfq-${id}-hint`}>{hint}</p>}<input id={`rfq-${id}`} type={type} required={required} aria-required={required || undefined} value={value} placeholder={placeholder} autoComplete={autoComplete} inputMode={inputMode} onChange={(event) => onChange(id, event.target.value)} aria-invalid={Boolean(error)} aria-describedby={[hint ? `rfq-${id}-hint` : "", error ? `rfq-${id}-error` : ""].filter(Boolean).join(" ") || undefined} /><FieldError id={`rfq-${id}-error`} message={error} /></div>;
}

function TextArea({ id, label, value, error, required, hint, rows, placeholder, onChange }: BaseFieldProps & { rows: number; placeholder?: string }) {
  return <div className="rfq-field rfq-field--full"><label htmlFor={`rfq-${id}`}>{label}{required && " *"}</label>{hint && <p className="field-hint" id={`rfq-${id}-hint`}>{hint}</p>}<textarea id={`rfq-${id}`} rows={rows} required={required} aria-required={required || undefined} value={value} placeholder={placeholder} onChange={(event) => onChange(id, event.target.value)} aria-invalid={Boolean(error)} aria-describedby={[hint ? `rfq-${id}-hint` : "", error ? `rfq-${id}-error` : ""].filter(Boolean).join(" ") || undefined} /><FieldError id={`rfq-${id}-error`} message={error} /></div>;
}

function SelectField({ id, label, value, error, required = true, options, placeholder, onChange }: BaseFieldProps & { options: readonly string[]; placeholder?: string }) {
  return <div className="rfq-field rfq-field--full"><label htmlFor={`rfq-${id}`}>{label}{required && " *"}</label><select id={`rfq-${id}`} required={required} aria-required={required} value={value} onChange={(event) => onChange(id, event.target.value)} aria-invalid={Boolean(error)} aria-describedby={error ? `rfq-${id}-error` : undefined}>{placeholder && <option value="" disabled>{placeholder}</option>}{options.filter(Boolean).map((option) => <option key={option}>{option}</option>)}</select><FieldError id={`rfq-${id}-error`} message={error} /></div>;
}

function FieldError({ id, message }: { id: string; message?: ReactNode }) {
  return message ? <span className="field-error" id={id}>{message}</span> : null;
}
