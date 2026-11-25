import Link from "next/link";
import { DirectContactCard } from "@/components/direct-contact-card";
import { RfqIntentButton } from "@/components/rfq-intent-button";
import { RfqProvider } from "@/components/rfq-context";
import { LazyRfq } from "@/components/lazy-rfq";
import { SourceDeskHero } from "@/components/sourcedesk-hero";
import { industries, manufacturers, productCategories } from "@/lib/content";

const tasks = [
  { number: "01", title: "采购 · 短缺与齐套", description: "从完整型号或 BOM 开始，明确数量、日期、交付地区与关键行优先级。", href: "#products", action: "进入产品发现" },
  { number: "02", title: "研发 · 选型与方案", description: "把参数、封装、接口、生命周期和替代验证边界写进同一份工程需求。", href: "#engineering", action: "进入工程协同" },
  { number: "03", title: "质量 · 证据与尽调", description: "先确认资料范围、检测约定和异常处理，再判断具体货源是否满足项目。", href: "#quality-matrix", action: "查看证据矩阵" },
];

const evidence = [
  ["规格基线", "完整订购型号、封装、温度与等级", "以双方确认的需求版本为准"],
  ["标签批次", "Date Code、Lot、丝印与标签资料范围", "按实际货源可提供资料约定"],
  ["包装", "包装形式、数量、标签与外观检查项", "按货源和验收要求逐项确认"],
  ["来源流转", "可提供的来源及流转资料范围", "无法提供的资料提前说明"],
  ["检测约定", "检测主体、项目、方法、抽样与判定", "需要时另行约定检测与费用"],
  ["异常处理", "复核、隔离、处置与反馈路径", "按双方确认的流程执行"],
];

function SectionTitle({ index, eyebrow, title, description }: { index: string; eyebrow: string; title: string; description?: string }) {
  return <div className="sd-section-title"><span>{index} / {eyebrow}</span><h2>{title}</h2>{description && <p>{description}</p>}</div>;
}

export default function HomePage() {
  return <RfqProvider><main id="main-content" className="source-home">
    <SourceDeskHero />

    <section className="sd-section sd-tasks" aria-labelledby="tasks-title"><div className="sd-container">
      <SectionTitle index="01" eyebrow="START WITH YOUR TASK" title="从客户任务，而不是公司叙事开始。" description="三条清晰入口，分别连接采购、研发和供应链质量工作。" />
      <div className="sd-task-grid">{tasks.map((task) => <article key={task.number}><span>{task.number}</span><h3>{task.title}</h3><p>{task.description}</p><Link href={task.href}>{task.action} <span aria-hidden="true">→</span></Link></article>)}</div>
    </div></section>

    <section className="sd-section" id="products"><div className="sd-container">
      <SectionTitle index="02" eyebrow="PRODUCT DISCOVERY" title="按器件功能与应用，找到需求坐标。" description="分类用于组织沟通，不是实时库存列表。每个分类都可直接带入需求整理。" />
      <div className="sd-product-layout"><div className="sd-product-grid">{productCategories.map((item, index) => <article key={item.slug} id={`product-${item.slug}`}>
        <div className="sd-product-card__top"><span>0{index + 1}</span><Link href={`/line-card/#${item.slug}`} aria-label={`查看${item.title}`}>↗</Link></div>
        <h3>{item.title}</h3><small>{item.english}</small><p>{item.description}</p>
        <ul>{item.examples.map((example) => <li key={example}>{example}</li>)}</ul>
        <RfqIntentButton className="sd-text-action" intent={{ kind: "category", requestType: "短缺料快速询价", partNumber: "", manufacturer: "", details: `产品分类：${item.title}\n典型应用：${item.applications}\n请补充完整订购型号与规格。` }}>整理此类需求 →</RfqIntentButton>
      </article>)}</div>
      <aside className="sd-manufacturers" id="manufacturers"><span>MANUFACTURER INDEX</span><h3>制造商文字索引</h3><p>仅用于进入型号沟通，不表示授权、合作、库存或原厂背书。</p><div>{manufacturers.map((item) => <RfqIntentButton key={item} intent={{ kind: "manufacturer", requestType: "短缺料快速询价", manufacturer: item, details: `制造商名称：${item}\n请补充完整订购型号。` }} className="sd-manufacturer-link">{item}<span aria-hidden="true">↗</span></RfqIntentButton>)}</div><Link href="/line-card/">查看完整产品与品牌索引 →</Link></aside>
      </div>
    </div></section>

    <section className="sd-section sd-services" id="supply-services"><div className="sd-container">
      <SectionTitle index="03" eyebrow="SERVICES" title="供应与工程，两条路径共同约束交付。" />
      <div className="sd-service-grid">
        <article><span>SUPPLY CHAIN</span><h3>供应链服务</h3><p>从短缺料到 BOM 齐套，把供应信息、风险与交付条件拆开核对。</p><dl><div><dt>输入</dt><dd>完整型号 / BOM、数量、节点、地区</dd></div><div><dt>核对</dt><dd>规格、可行渠道、批次资料、交付条件</dd></div><div><dt>输出</dt><dd>需求清单、待确认项与沟通记录</dd></div></dl><Link href="/capabilities/">查看供应链能力 →</Link></article>
        <article id="engineering"><span>ENGINEERING & DESIGN</span><h3>工程与设计协同</h3><p>在选型前放入供应约束，不以未经验证的替代型号制造确定性。</p><dl><div><dt>输入</dt><dd>应用、参数、封装、温度、接口</dd></div><div><dt>核对</dt><dd>生命周期、替代边界、验证责任</dd></div><div><dt>输出</dt><dd>工程需求、评审项与协同边界</dd></div></dl><RfqIntentButton intent={{ requestType: "嵌入式技术方案沟通" }} className="sd-text-action">整理工程选型需求 →</RfqIntentButton></article>
      </div>
    </div></section>

    <section className="sd-section" id="industries"><div className="sd-container">
      <SectionTitle index="04" eyebrow="APPLICATIONS" title="从应用场景，反推器件与验证约束。" description="以下是服务场景，不是客户案例或行业资质声明。" />
      <div className="sd-industry-grid">{industries.map((item, index) => <Link href={`/solutions/#${item.slug}`} key={item.slug}><span>0{index + 1}</span><h3>{item.title}</h3><p>{item.description}</p><small>{item.needs.join(" · ")}</small></Link>)}</div>
    </div></section>

    <section className="sd-section sd-quality" id="quality-matrix"><div className="sd-container">
      <SectionTitle index="05" eyebrow="QUALITY EVIDENCE" title="质量证据矩阵：先约定，再判断。" description="状态只描述沟通与约定机制，不宣称未经验证的资质、检测能力或货源结论。" />
      <div className="sd-table-wrap"><table><caption className="sr-only">质量证据项目、沟通时确认内容与按货源约定方式</caption><thead><tr><th scope="col">证据项</th><th scope="col">沟通时确认</th><th scope="col">按货源与项目约定</th></tr></thead><tbody>{evidence.map(([name, check, agreement]) => <tr key={name}><th scope="row">{name}</th><td>{check}</td><td>{agreement}</td></tr>)}</tbody></table></div>
      <div className="sd-quality__actions"><Link className="button button--outline" href="/quality/">查看质量流程与边界</Link><RfqIntentButton intent={{ requestType: "短缺料快速询价", details: "质量要求：请按证据矩阵确认规格、标签批次、包装、来源流转、检测约定与异常处理。" }} className="button button--primary">把质量要求写入需求</RfqIntentButton></div>
    </div></section>

    <section className="sd-section" id="resources"><div className="sd-container">
      <SectionTitle index="06" eyebrow="RESOURCES" title="可直接使用的真实静态资源。" description="文件由本站提供，下载不代表已提交需求；邮件附件请在邮件客户端中主动添加。" />
      <div className="sd-resource-grid">
        <article><span>CSV</span><h3>BOM 整理模板</h3><p>完整型号、品牌、需求数量、目标日期。</p><a href="/resources/bom-template.csv" download>下载 BOM 模板 ↓</a></article>
        <article><span>TXT</span><h3>质量核对清单</h3><p>规格、标签批次、包装、流转、检测与异常。</p><a href="/resources/quality-checklist.txt" download>下载质量清单 ↓</a></article>
        <article><span>TXT</span><h3>选型沟通清单</h3><p>参数、封装、温度、接口、生命周期与替代边界。</p><a href="/resources/selection-checklist.txt" download>下载选型清单 ↓</a></article>
      </div>
    </div></section>

    <section className="sd-section sd-contact" id="contact"><div className="sd-container sd-contact__layout"><div><SectionTitle index="07" eyebrow="DIRECT CONTACT" title="无需留下联系方式，直接联系商务。" description="邮件和电话由你主动发起。可选需求工具只整理业务资料，不设置在线提交。" /><div className="sd-contact__note">公司地址用于真实业务联系与到访前预约，不使用虚构地图坐标。</div></div><DirectContactCard /></div></section>

    <section className="sd-section sd-rfq" id="rfq"><div className="sd-container sd-rfq__layout"><div><SectionTitle index="08" eyebrow="SOURCEDESK RFQ" title="整理需求，核对并联系。" description="完整需求单可作为邮件正文，也可复制或下载。修改字段会使旧结果失效。" /><p>短缺料、BOM、工程与质量需求，都从真实资料开始。</p></div><LazyRfq /></div></section>
  </main></RfqProvider>;
}
