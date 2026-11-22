import { NextResponse } from "next/server";
import { contactSchema, fieldErrorsFrom, type ContactResponse } from "@/lib/contactSchema";
import { sendContactEmail } from "@/lib/email";
import { clientIp, rateLimit } from "@/lib/rateLimit";
import { verifyTurnstile } from "@/lib/turnstile";

/**
 * POST /api/contact (FR-1, FR-2)
 * Validates the form, checks the honeypot, rate limit and Turnstile, then
 * emails Nadeer through Resend. Messages are never stored.
 */

const MAX_BODY_BYTES = 10_000;
const isDev = process.env.NODE_ENV === "development";

function reply(body: ContactResponse, status = 200, headers?: HeadersInit) {
  return NextResponse.json(body, { status, headers });
}

export async function POST(request: Request) {
  const ip = clientIp(request.headers);

  const limit = rateLimit(ip);
  if (!limit.allowed) {
    return reply({ ok: false, error: "rate_limited" }, 429, {
      "Retry-After": String(limit.retryAfterSeconds),
    });
  }

  if (!request.headers.get("content-type")?.includes("application/json")) {
    return reply({ ok: false, error: "validation" }, 415);
  }

  let raw: unknown;
  try {
    const text = await request.text();
    if (text.length > MAX_BODY_BYTES) return reply({ ok: false, error: "validation" }, 413);
    raw = JSON.parse(text);
  } catch {
    return reply({ ok: false, error: "validation" }, 400);
  }
  const body = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;

  // Honeypot filled in: answer like a success so bots learn nothing, send nothing.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return reply({ ok: true });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return reply({ ok: false, error: "validation", fields: fieldErrorsFrom(parsed.error) }, 400);
  }

  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
  const resendKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  // Spam check. Outside local development a missing key fails closed.
  if (turnstileSecret) {
    const token = typeof body.token === "string" ? body.token : "";
    if (!(await verifyTurnstile(token, turnstileSecret, ip))) {
      return reply({ ok: false, error: "verification" }, 403);
    }
  } else if (!isDev) {
    console.error("[contact] TURNSTILE_SECRET_KEY is not set");
    return reply({ ok: false, error: "server" }, 500);
  }

  if (!resendKey || !to || !from) {
    if (isDev) {
      // Local development without Resend: report success, log no personal data.
      console.info("[contact] Email not sent: RESEND_API_KEY / CONTACT_TO_EMAIL / CONTACT_FROM_EMAIL not set (dev only).");
      return reply({ ok: true });
    }
    console.error("[contact] Email is not configured (RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL)");
    return reply({ ok: false, error: "server" }, 500);
  }

  try {
    const sent = await sendContactEmail(parsed.data, { apiKey: resendKey, from, to });
    return sent ? reply({ ok: true }) : reply({ ok: false, error: "server" }, 502);
  } catch {
    console.error("[contact] Unexpected error while sending email");
    return reply({ ok: false, error: "server" }, 500);
  }
}
