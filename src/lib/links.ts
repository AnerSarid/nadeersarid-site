import { content, isPlaceholder } from "@/content";

const { phone, whatsapp, email, clinic } = content.contact;

/** wa.me link with the pre-filled Hebrew greeting (FR-4). */
export const whatsappHref = `https://wa.me/${whatsapp.number}?text=${encodeURIComponent(whatsapp.greeting)}`;

/** tel: link (FR-5). */
export const phoneHref = `tel:${phone.tel}`;

/** mailto: link (FR-5). */
export const emailHref = `mailto:${email}`;

/** Full clinic address for navigation apps, or null while it's a placeholder. */
function navigationQuery(address: string): string | null {
  if (!address || isPlaceholder(address)) return null;
  return address.includes(clinic.city) ? address : `${address}, ${clinic.city}`;
}

const query = navigationQuery(clinic.address);

/** Waze and Google Maps links to the clinic (FR-10); null until the address is filled in. */
export const directions = query
  ? {
      waze: `https://waze.com/ul?q=${encodeURIComponent(query)}&navigate=yes`,
      googleMaps: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`,
    }
  : null;
