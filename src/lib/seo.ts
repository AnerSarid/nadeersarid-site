import type { Metadata } from "next";
import { content } from "@/content";

/**
 * Open Graph fields shared by every page. A page that sets `openGraph`
 * replaces the parent's object, so each page spreads this in.
 */
export const baseOpenGraph = {
  type: "website",
  locale: content.site.locale,
  siteName: content.site.name,
} satisfies Metadata["openGraph"];

/**
 * Metadata for a secondary page (title gets the "| נדיר שריד" suffix).
 * Overriding `openGraph` drops the root's generated share image, so it is
 * referenced explicitly here.
 */
export function pageMetadata(path: string, title: string, description: string): Metadata {
  const fullTitle = `${title} | ${content.site.name}`;
  const image = { width: 1200, height: 630, alt: content.site.shareImageAlt };
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      ...baseOpenGraph,
      url: path,
      title: fullTitle,
      description,
      images: [{ url: "/opengraph-image", ...image }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [{ url: "/twitter-image", ...image }],
    },
  };
}
