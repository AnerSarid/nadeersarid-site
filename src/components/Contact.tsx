import { content, isPlaceholder } from "@/content";
import { directions, emailHref } from "@/lib/links";
import { ContactForm } from "./ContactForm";
import { PhoneLink, WhatsAppButton } from "./Ctas";
import { Section } from "./Section";
import { Ltr, MailIcon, PinIcon, Txt } from "./ui";

const { contactSection, contact } = content;

const linkRow =
  "inline-flex min-h-11 items-center gap-3 font-semibold text-sage-900 underline-offset-4 hover:underline";

/** #contact: clinic/online line, phone, WhatsApp, directions, form, emergency line. */
export function Contact() {
  return (
    <Section id="contact" heading={contactSection.heading} tone="sand">
      <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
        <div className="space-y-6">
          <p className="text-xl font-medium">{contactSection.where}</p>

          <ul className="space-y-2">
            <li>
              <span className="sr-only">{contactSection.phoneLabel}: </span>
              <PhoneLink placement="contact" className={linkRow} />
            </li>
            <li>
              <span className="sr-only">{contactSection.emailLabel}: </span>
              <a href={emailHref} className={linkRow}>
                <MailIcon className="size-5 shrink-0" />
                <Ltr>{contact.email}</Ltr>
              </a>
            </li>
            <li className="flex items-start gap-3 pt-1">
              <PinIcon className="mt-1 size-5 shrink-0 text-sage-800" />
              <span>
                {isPlaceholder(contact.clinic.address) ? (
                  <Txt value={contact.clinic.address} />
                ) : (
                  contact.clinic.address
                )}
              </span>
            </li>
          </ul>

          {directions && (
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              <a href={directions.waze} target="_blank" rel="noopener noreferrer" className={`${linkRow} underline`}>
                {contactSection.directions.waze}
                <span className="sr-only"> {content.ui.newWindow}</span>
              </a>
              <a
                href={directions.googleMaps}
                target="_blank"
                rel="noopener noreferrer"
                className={`${linkRow} underline`}
              >
                {contactSection.directions.googleMaps}
                <span className="sr-only"> {content.ui.newWindow}</span>
              </a>
            </div>
          )}

          <WhatsAppButton label={contactSection.whatsappButton} placement="contact" className="w-full sm:w-auto" />

          <p className="rounded-2xl border border-accent/30 bg-white/70 p-4 text-base font-medium">
            {contactSection.emergency}
          </p>
        </div>

        <ContactForm />
      </div>
    </Section>
  );
}
