import { track } from "@vercel/analytics";

/**
 * Cookie-less Vercel Web Analytics events (FR-13).
 * Note: Vercel records custom events only on Pro/Enterprise plans;
 * on Hobby these calls are harmless no-ops.
 */
export type AnalyticsEvent = "whatsapp_click" | "phone_click" | "form_submit";

export function trackEvent(name: AnalyticsEvent, properties?: Record<string, string>): void {
  try {
    track(name, properties);
  } catch {
    // Analytics must never break the contact path.
  }
}
