import { content } from "@/content";

/** Canonical origin, e.g. "https://nadeersarid.com" (no trailing slash). */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || content.site.url).replace(/\/+$/, "");

export function absoluteUrl(path = "/"): string {
  return new URL(path, `${siteUrl}/`).toString();
}
