export function normalizeBasePath(value?: string) {
  const raw = value?.trim() ?? "";
  if (!raw || raw === "/") return "";
  if (/^https?:\/\//i.test(raw) || /[?#]/.test(raw) || raw.includes("..")) {
    throw new Error("NEXT_PUBLIC_BASE_PATH 必须是仓库子路径，例如 /guiji-tech，不能是完整 URL。");
  }
  return `/${raw.replace(/^\/+|\/+$/g, "")}`;
}

export const basePath = normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH);

export function assetPath(path: string) {
  if (!path.startsWith("/") || path.startsWith("//") || !basePath || path === basePath || path.startsWith(`${basePath}/`)) return path;
  return `${basePath}${path}`;
}
