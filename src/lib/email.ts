import { Resend } from "resend";
import { content } from "@/content";
import type { ContactData } from "./contactSchema";

const labels = content.contactSection.email;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function sentAt(): string {
  return new Intl.DateTimeFormat("he-IL", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "Asia/Jerusalem",
  }).format(new Date());
}

/** Builds the notification email Nadeer receives for each form submission. */
export function buildContactEmail(data: ContactData) {
  const when = sentAt();
  const message = data.message || labels.noMessage;

  const text = [
    labels.heading,
    "",
    `${labels.nameLabel}: ${data.name}`,
    `${labels.phoneLabel}: ${data.phone}`,
    `${labels.messageLabel}:`,
    message,
    "",
    `${labels.sentAtLabel}: ${when}`,
  ].join("\n");

  const row = (label: string, value: string) =>
    `<p style="margin:0 0 12px"><strong>${escapeHtml(label)}:</strong> ${value}</p>`;

  const html = `<!doctype html><html lang="he" dir="rtl"><body style="font-family:Arial,sans-serif;font-size:16px;line-height:1.6;direction:rtl;text-align:right">
<h1 style="font-size:20px;margin:0 0 16px">${escapeHtml(labels.heading)}</h1>
${row(labels.nameLabel, escapeHtml(data.name))}
${row(labels.phoneLabel, `<a href="tel:${escapeHtml(data.phone)}" dir="ltr">${escapeHtml(data.phone)}</a>`)}
<p style="margin:0 0 4px"><strong>${escapeHtml(labels.messageLabel)}</strong></p>
<p style="margin:0 0 16px;white-space:pre-wrap">${escapeHtml(message)}</p>
<p style="margin:0;color:#666;font-size:14px">${escapeHtml(labels.sentAtLabel)}: ${escapeHtml(when)}</p>
</body></html>`;

  // Strip line breaks so the name can't spill into other headers.
  const subject = `${labels.subject}: ${data.name.replace(/[\r\n]+/g, " ")}`;
  return { subject, text, html };
}

/** Sends the email through Resend. Nothing is stored on the site. */
export async function sendContactEmail(
  data: ContactData,
  config: { apiKey: string; from: string; to: string },
): Promise<boolean> {
  const resend = new Resend(config.apiKey);
  const { subject, text, html } = buildContactEmail(data);
  const { error } = await resend.emails.send({
    from: config.from,
    to: config.to,
    subject,
    text,
    html,
  });
  if (error) {
    // Log the failure type only, never the visitor's details.
    console.error("[contact] Resend error:", error.name);
    return false;
  }
  return true;
}
