import { companyAddress, salesEmail, salesPhone, salesPhoneHref } from "@/lib/site";

export function DirectContactCard() {
  return (
    <div className="direct-contact-card" aria-label="商务联系方式">
      <div className="direct-contact-card__topline"><span>Direct Contact</span><strong>无需提交访客资料</strong></div>
      <div className="direct-contact-card__grid">
        <a className="direct-contact-card__item" href={`mailto:${salesEmail}`}>
          <span>商务邮箱</span>
          <strong>{salesEmail}</strong>
          <small>打开邮件客户端，由你核对并发送</small>
        </a>
        <a className="direct-contact-card__item" href={`tel:${salesPhoneHref}`}>
          <span>联系电话</span>
          <strong>{salesPhone}</strong>
          <small>点击即可拨打商务电话</small>
        </a>
        <div className="direct-contact-card__item direct-contact-card__item--address">
          <span>公司地址</span>
          <address>{companyAddress}</address>
          <small>到访前请先通过邮件或电话预约</small>
        </div>
      </div>
      <p className="direct-contact-card__note">网站不设置在线提交。邮件或电话均由你主动发起，需求整理只是可选辅助。</p>
    </div>
  );
}
