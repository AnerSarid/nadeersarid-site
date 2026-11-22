import { content, isPlaceholder } from "@/content";
import { absoluteUrl, siteUrl } from "./site";

const { person, contact, faq, footer, site } = content;

/** schema.org graph: Person, LocalBusiness and (answered questions only) FAQPage. */
export function buildJsonLd() {
  const personId = `${siteUrl}/#person`;
  const businessId = `${siteUrl}/#business`;
  const sameAs = footer.social.map((s) => s.href);
  const answered = faq.items.filter((item) => !isPlaceholder(item.answer) && !isPlaceholder(item.question));

  const address: Record<string, string> = {
    "@type": "PostalAddress",
    addressLocality: contact.clinic.city,
    addressCountry: "IL",
  };
  if (!isPlaceholder(contact.clinic.address)) address.streetAddress = contact.clinic.address;

  const graph: Record<string, unknown>[] = [
    {
      "@type": "Person",
      "@id": personId,
      name: person.name,
      jobTitle: person.credentialsLine,
      image: absoluteUrl(person.photo.src),
      url: siteUrl,
      telephone: contact.phone.international,
      email: contact.email,
      knowsLanguage: "he",
      worksFor: { "@id": businessId },
      ...(sameAs.length > 0 && { sameAs }),
    },
    {
      "@type": "LocalBusiness",
      "@id": businessId,
      name: `${person.name} – ${person.credentialsLine}`,
      description: site.description,
      url: siteUrl,
      image: absoluteUrl(person.photo.src),
      telephone: contact.phone.international,
      email: contact.email,
      address,
      areaServed: { "@type": "City", name: contact.clinic.city },
      founder: { "@id": personId },
      ...(sameAs.length > 0 && { sameAs }),
    },
  ];

  if (answered.length > 0) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${siteUrl}/#faq`,
      mainEntity: answered.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    });
  }

  return { "@context": "https://schema.org", "@graph": graph };
}

/** Serializes JSON-LD safely for a <script> tag (escapes "<"). */
export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
