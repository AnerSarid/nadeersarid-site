import { Contact } from "@/components/Contact";
import { Faq } from "@/components/Faq";
import { FloatingCta } from "@/components/FloatingCta";
import { Hero } from "@/components/Hero";
import { About, Approach, Areas, CtaBand, Details, Reviews } from "@/components/Sections";
import { buildJsonLd, jsonLdScript } from "@/lib/jsonld";

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(buildJsonLd()) }} />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <Details />
        <Approach />
        <Areas />
        <About />
        <CtaBand placement="after-about" />
        <Faq />
        <CtaBand placement="after-faq" />
        <Reviews />
        <Contact />
      </main>
      <FloatingCta />
    </>
  );
}
