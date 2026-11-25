import type { Metadata } from "next";
import { PageHero } from "@/components/ui";
import { createPageMetadata } from "@/lib/metadata";
import { companyAddress, salesEmail, salesPhone, salesPhoneHref } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  path: "/privacy",
  title: "隐私政策",
  description: "了解本网站不收集访客联系方式的需求整理方式，以及主动邮件、电话沟通与日志边界。",
});

export default function PrivacyPage() {
  return (
    <main id="main-content">
      <PageHero eyebrow="隐私政策" title="无需留下联系方式，也能整理需求并直接联系。" description="本网站的需求整理工具不设置访客联系方式字段，不提供在线表单后端。邮件和电话均由你主动发起，本政策说明当前实现及数据处理边界。" />
      <section className="section"><div className="container legal-layout">
        <nav className="legal-toc" aria-label="隐私政策目录"><strong>目录</strong><a href="#local">本地需求单</a><a href="#email">主动邮件与电话</a><a href="#logs">托管日志</a><a href="#rights">你的选择</a></nav>
        <article className="legal-content">
          <p className="legal-updated">更新日期：2026-11-24 · 当前版本：1.1</p>
          <section id="local"><h2>1. 本地需求整理：不收集访客联系方式</h2><p>需求整理工具只整理器件型号、品牌、数量、目标日期、应用与项目需求等业务资料，<strong>不设置也不要求联系人、公司、访客邮箱、访客电话等联系方式字段</strong>。输入内容仅在当前浏览器内存中用于校验和生成文本，不写入本网站数据库，也不通过在线表单 API 或第三方提交服务发送。</p><p>点击“生成需求单”不会自动发送信息。复制和下载由你主动触发；下载文件保存在你选择的设备位置，由你自行管理。修改字段会清除旧生成结果，刷新或关闭页面可清除尚未导出的输入。</p></section>
          <section id="email"><h2>2. 邮件与电话由你主动发起</h2><p>点击邮件链接会调用你设备上的邮件应用，完整需求单可作为邮件正文。你仍需核对收件人、正文及附件并手动发送；网站不会显示虚假的“在线提交成功”。<strong>邮件由你主动发送后，相关内容和通信元数据将由你的邮件服务商、收件方邮件服务商及相关网络设施处理。</strong></p><p>当前公开商务邮箱为 <a href={`mailto:${salesEmail}`}>{salesEmail}</a>，联系电话为 <a href={`tel:${salesPhoneHref}`}>{salesPhone}</a>。点击电话链接会调用设备的拨号功能，通话及相关通信记录由你所使用的电信运营商按其行为处理。</p><p>公司地址为 {companyAddress}。BOM 等文件无法通过本网页自动附加到邮件，请在邮件客户端中自行添加，并在发送前确认接收方与文件范围。</p></section>
          <section id="logs"><h2>3. 托管、系统日志与 Cookie</h2><p>本网站自身不设置分析、广告或跟踪 Cookie，也不加载第三方统计脚本。托管平台、CDN、反向代理或安全设施可能为提供服务和防范滥用而处理 IP 地址、请求时间、User-Agent、访问路径等网络日志；实际保存期限和访问权限由部署方所用服务决定。</p><p>生产部署方应在选定托管服务后补充对应供应商、日志期限及跨境处理情况，不得将本说明理解为对托管方数据实践的承诺。</p></section>
          <section id="rights"><h2>4. 敏感信息、保留与你的选择</h2><p>请勿在需求单或邮件中提供密码、密钥、身份证件、金融账户或不必要的敏感商业机密。仅提供完成业务沟通所需的最少信息。</p><ul><li>未发送的需求内容：仅由当前页面内存持有，刷新或关闭页面即可清除。</li><li>本地下载文件：由你自行保留或删除，网站无法远程访问。</li><li>已发送邮件：由邮件服务商及业务接收方按实际业务与法律要求处理和保留；如需查询、更正或删除，请通过上述商务邮箱提出。</li></ul><p>如未来接入在线提交、分析工具或 Cookie 同意管理，部署方应先更新本政策并配置必要的告知与选择机制。</p></section>
        </article>
      </div></section>
    </main>
  );
}
