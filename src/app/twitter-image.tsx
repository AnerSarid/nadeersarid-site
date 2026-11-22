import { content } from "@/content";
import { renderShareImage, shareImageSize } from "@/lib/shareImage";

export const alt = content.site.shareImageAlt;
export const size = shareImageSize;
export const contentType = "image/png";

export default function TwitterImage() {
  return renderShareImage();
}
