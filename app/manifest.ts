import type { MetadataRoute } from "next";
import { assetPath } from "@/lib/base-path";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "深圳市硅基深度求索科技有限公司",
    short_name: "硅基深度求索",
    description: "关键器件寻源、嵌入式技术方案与供应链服务",
    start_url: assetPath("/"),
    display: "standalone",
    background_color: "#f5f5f7",
    theme_color: "#f5f5f7",
    lang: "zh-CN",
    icons: [{ src: assetPath("/icon.svg"), sizes: "any", type: "image/svg+xml" }],
  };
}
