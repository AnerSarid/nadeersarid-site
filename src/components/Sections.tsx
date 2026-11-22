import { content } from "@/content";
import { emailHref } from "@/lib/links";
import { PhoneLink, WhatsAppButton } from "./Ctas";
import { Section } from "./Section";
import { CheckIcon, Ltr, Txt, buttonStyles } from "./ui";

/** #details: facts card. */
export function Details() {
  const { details } = content;
  return (
    <Section id="details" heading={details.heading}>
      <dl className="grid gap-x-10 gap-y-5 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-sage-100 sm:grid-cols-2 sm:p-8">
        {details.facts.map((fact) => (
          <div key={fact.label} className="border-b border-sage-100 pb-4 last:border-0 sm:[&:nth-last-child(2)]:border-0">
            <dt className="text-base font-medium text-ink-soft">{fact.label}</dt>
            <dd className="mt-1 font-semibold text-ink">
              {fact.kind === "phone" ? (
                <PhoneLink placement="details" className="inline-flex items-center gap-2 underline-offset-4 hover:underline" />
              ) : fact.kind === "email" ? (
                <a href={emailHref} className="underline-offset-4 hover:underline">
                  <Ltr>{fact.value}</Ltr>
                </a>
              ) : (
                <Txt value={fact.value} />
              )}
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}

/** #approach */
export function Approach() {
  const { approach } = content;
  return (
    <Section id="approach" heading={approach.heading} tone="sand">
      <div className="space-y-4 border-s-4 border-sage-600 ps-6 text-xl leading-relaxed">
        {approach.paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </Section>
  );
}

/** #areas: the 12 treatment areas as a two-column checklist. */
export function Areas() {
  const { areas } = content;
  return (
    <Section id="areas" heading={areas.heading}>
      <ul className="grid gap-3 sm:grid-cols-2">
        {areas.items.map((item) => (
          <li key={item} className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 ring-1 ring-sage-100">
            <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-sage-100 text-sage-800">
              <CheckIcon />
            </span>
            <span className="font-medium">{item}</span>
          </li>
        ))}
      </ul>
    </Section>
  );
}

/** #about: bio, then credentials and experience. */
export function About() {
  const { about } = content;
  return (
    <Section id="about" heading={about.heading} tone="sage">
      <div className="space-y-4">
        {about.paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      <h3 className="mb-4 mt-10 text-2xl font-bold text-sage-900">{about.credentialsHeading}</h3>
      <ul className="grid gap-3 sm:grid-cols-2">
        {about.credentials.map((c) => (
          <li key={c.title} className="rounded-2xl bg-white p-4 ring-1 ring-sage-100">
            <p className="font-semibold">{c.title}</p>
            {c.detail && (
              <p className="mt-1 text-base text-ink-soft">
                <Txt value={c.detail} />
              </p>
            )}
          </li>
        ))}
      </ul>
    </Section>
  );
}

/** Repeated call to action after About and after the FAQ. */
export function CtaBand({ placement }: { placement: string }) {
  const { ctaBand } = content;
  return (
    <div className="px-5 py-10 sm:px-6">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-5 rounded-3xl bg-sage-100 px-6 py-8 text-center lg:flex-row lg:justify-between lg:text-start">
        <p className="text-xl font-semibold text-sage-900">{ctaBand.text}</p>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <WhatsAppButton label={ctaBand.whatsappButton} placement={placement} />
          <a href="#contact" className={buttonStyles.secondary}>
            {ctaBand.contactButton}
          </a>
        </div>
      </div>
    </div>
  );
}

/** #reviews: hidden until there are approved testimonials. */
export function Reviews() {
  const { reviews } = content;
  if (reviews.items.length === 0) return null;
  return (
    <Section id="reviews" heading={reviews.heading} tone="sand">
      <ul className="grid gap-4 md:grid-cols-2">
        {reviews.items.map((r, i) => (
          <li key={i}>
            <figure className="h-full rounded-3xl bg-white p-6 ring-1 ring-sage-100">
              <blockquote>
                <p>{r.text}</p>
              </blockquote>
              {r.author && <figcaption className="mt-3 text-base font-medium text-ink-soft">{r.author}</figcaption>}
            </figure>
          </li>
        ))}
      </ul>
    </Section>
  );
}
