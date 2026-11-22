import type { LegalPage as LegalPageContent } from "@/content";
import { content } from "@/content";
import { emailHref } from "@/lib/links";
import { PhoneLink } from "./Ctas";
import { Ltr, MailIcon, Txt } from "./ui";

/** Shared layout for /privacy and /accessibility. */
export function LegalPage({ page }: { page: LegalPageContent }) {
  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <article className="mx-auto max-w-3xl px-5 py-12 sm:px-6 md:py-16">
        <h1 className="text-4xl font-bold text-sage-900">{page.title}</h1>

        {page.draft && (
          <p className="placeholder mt-6 inline-block px-3 py-2 font-semibold">{page.draftNotice}</p>
        )}

        <div className="mt-6 space-y-4">
          {page.intro.map((p, i) => (
            <p key={i}>
              <Txt value={p} />
            </p>
          ))}
        </div>

        {page.sections.map((section) => (
          <section key={section.heading} className="mt-10">
            <h2 className="text-2xl font-bold text-sage-900">{section.heading}</h2>
            {section.paragraphs?.map((p, i) => (
              <p key={i} className="mt-3">
                <Txt value={p} />
              </p>
            ))}
            {section.list && (
              <ul className="mt-3 list-disc space-y-2 ps-6 marker:text-sage-600">
                {section.list.map((item) => (
                  <li key={item}>
                    <Txt value={item} />
                  </li>
                ))}
              </ul>
            )}
            {section.showContact && (
              <ul className="mt-4 space-y-2">
                <li>
                  <span className="sr-only">{content.contactSection.phoneLabel}: </span>
                  <PhoneLink
                    placement={page.path}
                    className="inline-flex min-h-11 items-center gap-3 font-semibold text-sage-900 underline underline-offset-4"
                  />
                </li>
                <li>
                  <span className="sr-only">{content.contactSection.emailLabel}: </span>
                  <a
                    href={emailHref}
                    className="inline-flex min-h-11 items-center gap-3 font-semibold text-sage-900 underline underline-offset-4"
                  >
                    <MailIcon className="size-5 shrink-0" />
                    <Ltr>{content.contact.email}</Ltr>
                  </a>
                </li>
              </ul>
            )}
          </section>
        ))}

        <p className="mt-12 text-base text-ink-soft">
          {page.updatedLabel} <Txt value={page.updated} />
        </p>
      </article>
    </main>
  );
}
