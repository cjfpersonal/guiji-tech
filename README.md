# 硅基深度求索科技官网

深圳市硅基深度求索科技有限公司的生产导向官网。采用 **Next.js App Router + TypeScript + React + 原生 CSS**，无重型 UI 库、外部字体、第三方统计脚本或在线表单后端。

视觉语言采用原创的极简企业产品风格：浅灰与白色为主、黑色质量章节形成节奏，系统字体、大标题、大留白、克制蓝色交互和柔和圆角。首页采用原创 **SourceDesk 客户寻源工作台**：专业分销信息架构、三层页头、全局器件搜索、四条手动业务路径、三客户任务入口、产品/制造商发现、质量证据矩阵、真实资源下载、直接商务联系与可选需求整理。芯片素材为原创概念摄影并经过中性棚拍级调色；不使用虚构客户、库存、认证、合作 Logo 或案例数字。

## 公开联系信息

- 商务邮箱：`chenfeng@jyera.com`
- 联系电话：`+86 134 2388 2268`（链接为 `tel:+8613423882268`）
- 公司地址：广东省深圳市南山区粤海街道高新工业村 T3 栋 A 座 403

网站以公司介绍和直接联系为主，不要求访客先填写联系方式。地址仅以文字展示，不包含虚构地图坐标。

## 功能与路由

| 路由 | 内容 |
| --- | --- |
| `/` | Supply Signal 首页、供应路径、产品索引、能力、质量、直接联系与可选 RFQ |
| `/line-card` | 产品分类检索、筛选与常见制造商文字索引 |
| `/capabilities` | 短缺料、高端芯片、BOM、嵌入式与交付协同 |
| `/quality` | 质量控制点、追溯资料与执行边界 |
| `/solutions` | 六类行业场景与嵌入式工程协同 |
| `/about` | 公司定位、原则与真实联系方式 |
| `/privacy` | 不收集访客联系方式、本地需求单、主动邮件/电话与日志说明 |
| `/terms` | 网站信息、品牌、质量和具体交易边界 |
| `/sitemap.xml` / `/robots.txt` / `/manifest.webmanifest` | 搜索引擎与 Web App 元数据 |

首屏与全部业务内容均在构建时预渲染为完整 HTML。JavaScript 用于全局搜索建议、移动导航、手动 Hero tab、RFQ 校验、复制与下载；非首屏 RFQ 按可见性动态加载。未启用 JavaScript 时仍可阅读内容，并可直接使用邮件和电话链接。Organization JSON-LD 包含真实 `PostalAddress`、`email` 和 `telephone`。

## 环境要求

- Node.js `>= 20.9.0`（推荐使用当前 Active LTS）
- npm 10 或兼容版本

```bash
npm ci
cp .env.example .env.local
npm run dev
```

开发地址：`http://localhost:4173`。

### 本机直接构建与预览

当前工作区使用已被 `.gitignore` 忽略的 `.env.local` 保存本机开发/预览配置，因此可以直接运行，无需在命令前重复设置环境变量：

```bash
npm run build
npm run start
```

本机配置为：

```dotenv
NEXT_PUBLIC_SITE_URL=http://127.0.0.1:4173
NEXT_PUBLIC_ALLOW_LOCAL_SITE_URL=true
NEXT_PUBLIC_SALES_EMAIL=chenfeng@jyera.com
NEXT_PUBLIC_SALES_PHONE=+8613423882268
```

`.env.local` 仅用于当前工作区，不应提交或复制为公网部署配置。Next.js production 构建的环境优先级为：**进程环境变量 > `.env.production.local` > `.env.local` > `.env.production` > `.env`**；如果构建结果不符合预期，应先检查高优先级配置是否覆盖了本机值。

## 环境变量

所有变量都以 `NEXT_PUBLIC_` 开头，意味着其值会被嵌入客户端构建产物；**只能放公开信息，绝不能放密钥**。`.env.example` 和代码默认值均为上述已公开的真实联系信息，如后续变更，只应替换为再次核验的公开信息。

| 变量 | 必填 | 说明 |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | 生产必填 | 已核验的真实 HTTPS 规范站点地址，不带路径或末尾斜杠 |
| `NEXT_PUBLIC_ALLOW_LOCAL_SITE_URL` | 否 | 仅本地构建/测试设为 `true`；真实生产必须为 `false` 或不设置 |
| `NEXT_PUBLIC_SALES_EMAIL` | 有真实默认值 | 公开商务邮箱：`chenfeng@jyera.com` |
| `NEXT_PUBLIC_SALES_PHONE` | 有真实默认值 | 公开商务电话：`+86 134 2388 2268` |
| `NEXT_PUBLIC_COMPANY_ADDRESS` | 有真实默认值 | 公开公司地址，仅用于文字与结构化数据 |

### 生产 URL 防误用

生产构建默认拒绝以下情况：

- 未配置 `NEXT_PUBLIC_SITE_URL`；
- 使用 `localhost`、`127.0.0.1`、`::1`；
- 使用非 HTTPS 地址或无效 URL。

因此，真实部署必须配置公司实际域名并完成 DNS/HTTPS；本地验证必须显式设置 `NEXT_PUBLIC_ALLOW_LOCAL_SITE_URL=true`。修改任何公开环境变量后必须重新 build。

**正式公网部署不要依赖本机 `.env.local`。** 应在托管平台设置真实的 `NEXT_PUBLIC_SITE_URL=https://...` 和 `NEXT_PUBLIC_ALLOW_LOCAL_SITE_URL=false`，确认平台变量没有引用本地地址后再执行 `npm run build`。原有 HTTPS 与 localhost 拒绝逻辑保持不变。

## SourceDesk 客户架构

- **专业页头**：企业/联系工具条、Logo + 全局搜索 + BOM + 联系商务，以及产品、制造商、供应链服务、工程与设计、行业、质量与资源、关于导航。桌面 dropdown 支持键盘，移动为黑色抽屉并保留搜索。
- **四条手动 Hero 路径**：短缺料寻源、BOM 齐套、工程方案、供应链质量；不自动轮播，使用本站原创图片。
- **真实本地搜索**：只检索 `lib/content.ts` 的产品分类与制造商文字索引，不查询实时库存。空状态可携带搜索词进入 RFQ。
- **三类客户任务**：采购短缺/BOM、研发选型/方案、供应链/质量尽调。
- **SourceDesk RFQ**：支持料号、数量、日期、交付地区、BOM，以及封装、温度、接口、生命周期和替代边界；不自动推荐未经验证的型号。连续意图规则明确：新制造商清空旧料号，分类清空冲突料号/品牌，具体料号只在明确时更新品牌，数量、目标日期和交付地区等非冲突字段保留，并显示轻提示。
- **质量验收预填**：质量页主 CTA 将批次、来源流转、检测约定和异常处理清单带入 RFQ，同时保留直接邮件和电话。
- **质量证据矩阵**：规格、标签批次、包装、来源流转、检测约定和异常处理，只描述沟通与货源约定，不虚构资质。
- **静态资源**：`public/resources/` 提供真实 BOM CSV、质量清单和选型清单下载。
- **按需 hydration**：首屏仅加载必要搜索/导航/Hero；RFQ 在进入视口或被搜索意图激活时加载，无 JS 时仍保留完整内容、资源与直接联系。

## 直接联系与 RFQ 的真实行为

当前版本**没有后端，也不会自动提交表单**：

1. 页头、首页、关于页、页脚及通用 CTA 均提供真实商务联系入口；
2. 可选 RFQ 简化为“整理需求 → 核对并联系”两步；
3. RFQ 不设置联系人、公司、访客邮箱、访客电话等字段，也不保存这些资料；
4. 浏览器只校验业务资料的必填项、数量、日期与长度；
5. 完整需求单可复制、下载 `.txt`，或作为 `mailto:` 邮件正文；
6. 用户打开邮件客户端后需核对正文与附件并主动发送，也可直接拨打电话；
7. 字段修改后旧生成结果立即失效，不生成虚假需求编号，不显示“在线提交成功”。

BOM 附件不能由 `mailto:` 自动可靠附加，应在邮件客户端中自行添加。完整需求单会作为邮件正文；若编码后的链接过长，页面会提示改用复制/下载并核对正文，避免邮件客户端截断。若未来接入真实 API，必须同步更新隐私政策、提交反馈、错误处理、反滥用、数据保留与测试。

## 本地验证

```bash
npm run lint
npm run typecheck
npm run test:unit
```

### 静态构建与预览

`next.config.ts` 已启用 `output: "export"`、`trailingSlash: true` 和 `images.unoptimized: true`。普通构建会直接生成可独立部署的 `out/`，不再需要 Next.js 生产服务器：

```bash
npm run build
npm run start
```

`npm run start` 使用 `serve` 在 **127.0.0.1:4173** 预览 `out/`，不会切换到其他端口。修改源码或公开环境变量后必须先重新 build，再重启静态预览。`npm run dev` 仍使用 Next.js 开发服务器和 4173 端口。

其他本机工作区可手动创建同样的 `.env.local`，或使用以下显式构建命令（仅本地测试，使用真实公开联系配置）：

```bash
NEXT_PUBLIC_SITE_URL=http://127.0.0.1:4173 \
NEXT_PUBLIC_ALLOW_LOCAL_SITE_URL=true \
NEXT_PUBLIC_SALES_EMAIL=chenfeng@jyera.com \
NEXT_PUBLIC_SALES_PHONE="+86 134 2388 2268" \
NEXT_PUBLIC_COMPANY_ADDRESS="广东省深圳市南山区粤海街道高新工业村 T3 栋 A 座 403" \
npm run build
```

构建产物包含各路由的 `index.html`、`404.html`、sitemap、robots、manifest、OG 图片、原始 WebP 图片和 Next.js 静态资源。图片不经过 `/_next/image` 服务端优化，部署时必须一并上传 `public` 导出到 `out` 的所有资源。

### Playwright 浏览器测试

默认使用 Playwright 管理的 Chromium，首次运行安装：

```bash
npx playwright install chromium
```

如本机已安装 Google Chrome，也可设置 `PLAYWRIGHT_USE_SYSTEM_CHROME=true` 跳过浏览器下载。

先执行 `npm run build` 生成最新的 `out/`，再运行：

```bash
npm run test:e2e
# 或：PLAYWRIGHT_USE_SYSTEM_CHROME=true npm run test:e2e
```

Playwright 会启动或复用 4173 的静态 `out/` 预览，使用真实公开联系配置，覆盖：

- 全部公开深链接、404、canonical、OpenGraph、Organization JSON-LD、SEO 与下载资源；
- 商务邮箱、电话 href、公司地址与直接联系卡片；
- 全局搜索建议、制造商结果、空状态与 RFQ 意图携带；
- 四路 Hero 点击/键盘切换且无自动轮播；
- BOM、研发参数、完整邮件正文、复制、下载及无访客联系方式输入；
- 桌面 dropdown 键盘、移动黑色抽屉焦点与背景 `inert`；
- 无 JS、reduced-motion、200%/400%缩放等效视口和未优化图片；
- 全部公开路由及搜索、dropdown、Hero、移动菜单等关键状态的 axe，serious/critical=0；
- 桌面/移动首屏、全页、搜索、产品、RFQ 截图及交互短视频。

自动截图、视频和性能记录固定保存在 `test-results/visual/`；HTML 报告位于 `playwright-report/`。性能测试在 4x CPU、120ms 延迟、200KB/s 下验证 **LCP≤3000ms、CLS<0.1**，同时记录 200ms 长任务目标、LCP 元素、资源时序和归因；长任务目标未达时必须单独披露，不得与 LCP/CLS 硬阈值混淆。

也可先手动启动上述静态预览，再执行 HTML 与资源检查：

```bash
curl -I http://127.0.0.1:4173/
curl -s http://127.0.0.1:4173/ | grep 'chenfeng@jyera.com'
curl -s http://127.0.0.1:4173/sitemap.xml
```

## GitHub Pages 自动部署

工作流位于 `.github/workflows/deploy.yml`：`main` 每次 push 或手动 `workflow_dispatch` 都会使用 Node 22、`npm ci` 和 `npm run build` 生成 `out`，再通过 `upload-pages-artifact` / `deploy-pages` 发布；`pages` concurrency 不会取消进行中的部署。

首次使用需执行：

1. 在 GitHub 仓库 **Settings → Actions → General** 启用 Actions，并允许工作流写入；在 **Settings → Pages → Source** 选择 **GitHub Actions**。
2. 审查并提交本工作流及静态导出配置，然后 `git push origin main`。
3. 在 Actions 查看部署结果。当前 remote 为 `cjfpersonal/guiji-tech`，默认地址为 **https://cjfpersonal.github.io/guiji-tech/**。

工作流根据仓库名自动设置 `NEXT_PUBLIC_SITE_URL` 和 `NEXT_PUBLIC_BASE_PATH`：普通仓库使用 `https://OWNER.github.io/REPO/`；仓库名为 `OWNER.github.io` 时使用 `https://OWNER.github.io/` 根站。Next.js `basePath`、Next/Image、普通图片、下载、manifest/icon、OG、canonical、sitemap 和 robots 会统一添加子路径，`public/.nojekyll` 随构建发布。

绑定自定义域名时，可在仓库 **Settings → Variables → Actions** 添加 `PAGES_CUSTOM_DOMAIN=www.example.com`，或提交 `public/CNAME`。工作流会使用根路径和 HTTPS 自定义域名，并自动写入 CNAME；DNS 需先指向 GitHub Pages。首次启用前还应确认 Pages 与 Actions 权限。

## 静态部署与安全头

### Netlify / Cloudflare Pages

- 构建命令：`npm run build`；发布目录：`out`。
- 正式环境在平台设置真实 HTTPS `NEXT_PUBLIC_SITE_URL` 和 `NEXT_PUBLIC_ALLOW_LOCAL_SITE_URL=false`，不要携带本机 `.env.local`。
- `public/_headers` 会复制为 `out/_headers`，Netlify 和 Cloudflare Pages 可据此下发 CSP、HSTS、`X-Content-Type-Options`、`X-Frame-Options`、`Referrer-Policy` 和 `Permissions-Policy`。
- HSTS 只应在已确认全站 HTTPS 的正式域名启用；本地 `serve` 不读取 `_headers`，本地 HTTP 验证不代表平台已应用安全头。

### Nginx

将整个 `out/` 上传到 Web 根目录，并配置目录首页和静态 404，例如：

```nginx
root /var/www/sds-site;
index index.html;

location / {
    try_files $uri $uri/ $uri/index.html =404;
}

error_page 404 /404.html;

location /_next/static/ {
    expires 1y;
    add_header Cache-Control "public, max-age=31536000, immutable";
}
```

**Nginx 不会读取 `_headers`，必须将 `public/_headers` 中的安全策略逐项迁移为 `add_header` 或 include 配置。** CSP 的 `script-src 'unsafe-inline'` 是为兼容 Next.js 内联启动脚本和 JSON-LD 的保守方案；如改为 nonce，必须重新回归全部静态页面。HTTPS、HTTP/2 或 HTTP/3、压缩和 HSTS 也由 Nginx/Ingress 配置。

### 对象存储 + CDN

1. 上传 `out/` 全部内容并保留目录结构，开启静态网站托管，默认首页设为 `index.html`、错误页设为 `404.html`。
2. 确保 `/about/` 等目录路径能返回对应 `index.html`，不要将所有 404 都重写为首页；正确配置 `.xml`、`.webmanifest`、`.svg`、`.webp` 和 `.png` 的 MIME 类型。
3. 在 CDN 配置 HTTPS、安全头和缓存。对象存储/CDN 不一定会识别 `_headers`，需在平台单独确认。

### GitHub Pages

将 `out/` 发布到 Pages 所用分支或 Actions artifact 的根目录，保留导出时生成的 `.nojekyll`（如存在）。当前资源使用根路径 `/...`，适合用户/组织站点或自定义域名；若发布到 `https://<user>.github.io/<repo>/` 子路径，必须另行配置 Next.js `basePath`/`assetPrefix` 并重新验证所有链接。GitHub Pages 不支持自定义 `_headers`，安全头需由前置 CDN 提供。

### 缓存注意事项

- `/_next/static/` 带内容哈希，可使用长期 `immutable` 缓存。
- HTML 应使用 `Cache-Control: no-cache` 或较短缓存并支持重新验证，避免发布后仍看到旧页面。
- `/images/`、`/opengraph-image.png`、`/icon.svg` 等文件名没有内容哈希，**不要直接设置一年 immutable**；替换图片时使用短缓存、主动刷新 CDN 或更改文件名。
- 每次部署必须完整更新 HTML 与静态资源，并核验 canonical、OG、sitemap、robots、图片、404 和真实联系方式。

## 上线前必须由公司确认

- [ ] 将 `NEXT_PUBLIC_SITE_URL` 配置为真实 HTTPS 域名，完成 DNS、证书和 canonical/OG/sitemap 核验；
- [ ] 定期核验公开邮箱、电话和地址，并实测桌面/移动邮件与拨号链接；
- [ ] 由公司法务/隐私负责人审核隐私政策、条款、托管日志与主动邮件后的数据处理说明；
- [ ] 确认制造商名称的文字索引符合实际业务，不以索引暗示授权或实时库存；
- [ ] 若取得认证或授权，仅在核验有效期、主体和适用范围后添加，不放入未经证实的标识；
- [ ] 配置监控、备份、可用性与安全告警；如添加真实提交 API，补充反垃圾、速率限制和隐私同意；
- [ ] 在目标域名执行完整 lint/typecheck/unit/build/e2e 与人工内容校对。

## 主要脚本

```bash
npm run dev         # 开发服务器
npm run lint        # ESLint
npm run typecheck   # TypeScript 严格检查
npm run test:unit   # RFQ 纯逻辑单元测试
npm run build       # 生成纯静态 out/ 目录
npm run start       # 在 127.0.0.1:4173 静态预览 out/
npm run test:e2e    # Playwright 关键流程与可访问性测试
```
