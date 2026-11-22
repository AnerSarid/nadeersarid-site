import { content } from "@/content";
import { phoneHref, whatsappHref } from "@/lib/links";
import { TrackedLink } from "./TrackedLink";
import { EmojiText, Ltr, PhoneIcon, buttonStyles } from "./ui";

/** WhatsApp button with the pre-filled greeting (FR-4). */
export function WhatsAppButton({
  label,
  placement,
  className = "",
}: {
  label: string;
  placement: string;
  className?: string;
}) {
  return (
    <TrackedLink
      href={whatsappHref}
      event="whatsapp_click"
      placement={placement}
      target="_blank"
      rel="noopener noreferrer"
      className={`${buttonStyles.whatsapp} ${className}`}
    >
      <EmojiText text={label} />
      <span className="sr-only">{content.ui.newWindow}</span>
    </TrackedLink>
  );
}

/** Phone number as a tel: link, always rendered left-to-right (FR-5). */
export function PhoneLink({ placement, className = "" }: { placement: string; className?: string }) {
  return (
    <TrackedLink href={phoneHref} event="phone_click" placement={placement} className={className}>
      <PhoneIcon className="size-5 shrink-0" />
      <Ltr>{content.contact.phone.display}</Ltr>
    </TrackedLink>
  );
}
