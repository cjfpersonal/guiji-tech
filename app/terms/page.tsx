import type { Metadata } from "next";
import { PageHero } from "@/components/ui";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  path: "/terms",
  title: "网站服务条款",
  description: "网站信息、寻源需求、品牌名称、质量、工程协同与具体交易边界。",
});

export default function TermsPage() {
  return (
    <main id="main-content">
      <PageHero eyebrow="服务条款" title="先明确信息与交易的边界，再开展有效合作。" description="这些条款适用于本网站的信息浏览与需求单工具。具体产品、工程或供应链服务以双方另行确认的合同、订单和技术文件为准。" />
      <section className="section"><div className="container legal-layout">
        <nav className="legal-toc" aria-label="服务条款目录"><strong>目录</strong><a href="#information">网站信息</a><a href="#rfq">需求单</a><a href="#brands">品牌与质量</a><a href="#transactions">具体交易</a></nav>
        <article className="legal-content">
          <p className="legal-updated">更新日期：2026-11-24 · 当前版本：1.1</p>
          <section id="information"><h2>1. 网站信息的性质</h2><p>网站内容用于介绍一般业务能力与沟通方式，不构成实时库存、固定价格、确定交期、授权代理、认证资质或无条件供货承诺。产品分类和行业场景用于需求导航，不代表特定项目成果或客户案例。</p><p>我们努力保持内容清晰，但制造商产品状态、生命周期和供应条件可能变化。任何关键决策均应基于完整型号、有效资料及项目责任方核验。</p></section>
          <section id="rfq"><h2>2. 需求单工具</h2><p>“生成需求单”只执行浏览器本地的文本整理，不要求访客联系方式，不生成真实需求编号，也不代表需求已发送、受理、报价或成交。完整需求单可作为邮件正文，下载、复制、邮件客户端调用及最终发送均由你主动完成。</p><p>你应确保所整理和主动发送的信息来源合法、内容准确，并有权为业务沟通之目的分享。不得利用本网站上传或传播恶意代码、违法内容、他人凭据或无关敏感信息。</p></section>
          <section id="brands"><h2>3. 制造商名称、质量与工程边界</h2><p>第三方制造商名称及商标归各自权利人所有，列名仅表示可接收相关型号的寻源需求，不表示授权、合作、库存或原厂背书。</p><p>质量流程图和追溯字段为通用框架，不是实际检测报告或证书。具体来源资料、检测主体、方法、抽样、判定与异常处理须逐项约定。外观或标签检查不当然替代电性、可靠性或真伪鉴定。</p><p>嵌入式方案、器件替代和迁移建议需结合实际设计验证。最终采用、法规符合性、功能安全和产品验证由相应项目责任方确认。</p></section>
          <section id="transactions"><h2>4. 具体交易、知识产权与责任</h2><p>货源、规格、数量、价格、税费、交期、物流、验收、付款、售后及违约责任，以双方正式合同或订单为准。网站内容不削弱适用法律规定的权利与责任，也不用于排除故意或重大过失造成损失的责任。</p><p>本网站原创文字、视觉结构和代码由相应权利人依法享有权利。你可在内部业务沟通中使用自行生成的需求单，但不得将网站内容包装为原厂文件、虚假资质或误导性宣传。</p><p>如网站功能或政策发生变化，部署方应更新本页日期与内容。继续使用更新后的网站即表示你已阅读当时有效版本；具体交易仍以已签署文件为准。</p></section>
        </article>
      </div></section>
    </main>
  );
}
