import { LegalPage } from "@/components/LegalPage";
import { content } from "@/content";
import { pageMetadata } from "@/lib/seo";

const page = content.accessibility;

export const metadata = pageMetadata(page.path, page.title, page.description);

export default function AccessibilityPage() {
  return <LegalPage page={page} />;
}
