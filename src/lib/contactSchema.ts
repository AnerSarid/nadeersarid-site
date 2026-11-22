import { z } from "zod";

/** Shared by the contact form (client) and POST /api/contact (server). */

export const MESSAGE_MAX = 1000;

/** Israeli landline/mobile, local (0…) or international (+972 / 00972). */
const ISRAELI_PHONE = /^(?:(?:\+|00)972|0)(?:[23489]\d{7}|[57]\d{8})$/;
/** Any other international number, e.g. a parent living abroad. */
const INTERNATIONAL_PHONE = /^(?:\+|00)[1-9]\d{7,14}$/;

export function normalizePhone(value: string): string {
  return value.replace(/[\s\-().‎‏]/g, "");
}

// Error messages are keys of content.contactSection.form.errors.
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "nameRequired")
    .max(80, "nameRequired")
    .refine((v) => !/[\r\n]/.test(v), "nameRequired"),
  phone: z
    .string()
    .trim()
    .transform(normalizePhone)
    .refine((v) => ISRAELI_PHONE.test(v) || INTERNATIONAL_PHONE.test(v), "phoneInvalid"),
  message: z.string().trim().max(MESSAGE_MAX, "messageTooLong").default(""),
  consent: z.literal(true, { error: "consentRequired" }),
});

export type ContactInput = z.input<typeof contactSchema>;
export type ContactData = z.output<typeof contactSchema>;
export type ContactField = keyof ContactData;
export type FieldErrorKey = "nameRequired" | "phoneInvalid" | "messageTooLong" | "consentRequired";
export type FieldErrors = Partial<Record<ContactField, FieldErrorKey>>;

/** Request body sent by the form. `website` is the honeypot; `token` is Turnstile's. */
export type ContactRequest = Omit<ContactInput, "consent"> & {
  consent: boolean;
  website?: string;
  token?: string;
};

export type ContactErrorCode = "validation" | "verification" | "rate_limited" | "server";

export type ContactResponse =
  | { ok: true }
  | { ok: false; error: ContactErrorCode; fields?: FieldErrors };

/** Turns zod issues into one error key per field. */
export function fieldErrorsFrom(error: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const field = issue.path[0] as ContactField | undefined;
    if (field && !out[field]) out[field] = issue.message as FieldErrorKey;
  }
  return out;
}
