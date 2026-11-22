"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { content } from "@/content";
import { trackEvent } from "@/lib/analytics";
import {
  MESSAGE_MAX,
  contactSchema,
  fieldErrorsFrom,
  type ContactErrorCode,
  type ContactField,
  type ContactRequest,
  type ContactResponse,
  type FieldErrors,
} from "@/lib/contactSchema";
import { PhoneLink, WhatsAppButton } from "./Ctas";
import { EmojiText, buttonStyles } from "./ui";

const { form } = content.contactSection;
const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

type Status = "idle" | "sending" | "success" | "error";
type FormError = ContactErrorCode | "verifying";

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, options: Record<string, unknown>) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
  }
}

const inputClass =
  "mt-2 block w-full rounded-xl border border-sage-200 bg-white px-4 py-3 text-lg text-ink shadow-sm transition-colors focus:border-sage-600 aria-[invalid=true]:border-accent";

function errorText(code: FormError): string {
  switch (code) {
    case "verifying":
      return form.errors.verifying;
    case "verification":
      return form.errors.verificationFailed;
    case "rate_limited":
      return form.errors.rateLimited;
    default:
      return `${form.errors.generic} ${form.errors.fallbackIntro}`;
  }
}

/** FR-1 to FR-3: contact form with honeypot, Turnstile and Hebrew feedback. */
export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [formError, setFormError] = useState<FormError | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [token, setToken] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const widgetEl = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);

  const renderTurnstile = useCallback(() => {
    if (!siteKey || !window.turnstile || !widgetEl.current || widgetId.current) return;
    widgetId.current = window.turnstile.render(widgetEl.current, {
      sitekey: siteKey,
      language: "he",
      appearance: "interaction-only",
      "refresh-expired": "auto",
      callback: (t: string) => setToken(t),
      "expired-callback": () => setToken(""),
      "error-callback": () => setToken(""),
    });
  }, []);

  useEffect(() => {
    // Script already loaded (e.g. after client-side navigation).
    renderTurnstile();
    return () => {
      if (widgetId.current) window.turnstile?.remove(widgetId.current);
      widgetId.current = null;
    };
  }, [renderTurnstile]);

  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  function clearFieldError(field: ContactField) {
    if (fieldErrors[field]) setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function focusFirstInvalid(errors: FieldErrors) {
    const order: ContactField[] = ["name", "phone", "message", "consent"];
    const first = order.find((f) => errors[f]);
    if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    const fd = new FormData(e.currentTarget);
    const body: ContactRequest = {
      name: String(fd.get("name") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      message: String(fd.get("message") ?? ""),
      consent: fd.get("consent") === "on",
      website: String(fd.get("website") ?? ""),
      token,
    };

    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      const errors = fieldErrorsFrom(parsed.error);
      setFieldErrors(errors);
      setFormError(null);
      focusFirstInvalid(errors);
      return;
    }
    setFieldErrors({});

    if (siteKey && !token) {
      setFormError("verifying");
      return;
    }

    setStatus("sending");
    setFormError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = (await res.json().catch(() => null)) as ContactResponse | null;
      if (result?.ok) {
        trackEvent("form_submit");
        setStatus("success");
        return;
      }
      if (result && !result.ok && result.error === "validation" && result.fields) {
        setFieldErrors(result.fields);
        setStatus("idle");
        focusFirstInvalid(result.fields);
        return;
      }
      setFormError(result && !result.ok ? result.error : "server");
      setStatus("error");
    } catch {
      setFormError("server");
      setStatus("error");
    } finally {
      // Each Turnstile token is single-use.
      setToken("");
      if (widgetId.current) window.turnstile?.reset(widgetId.current);
    }
  }

  if (status === "success") {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        className="rounded-3xl bg-white p-6 text-center shadow-sm ring-1 ring-sage-100 sm:p-8"
      >
        <p className="text-2xl font-bold text-sage-900">{form.success.title}</p>
        <p className="mt-2">{form.success.text}</p>
      </div>
    );
  }

  const describedBy = (field: ContactField) => (fieldErrors[field] ? `${field}-error` : undefined);
  const fieldError = (field: ContactField) =>
    fieldErrors[field] ? (
      <p id={`${field}-error`} className="mt-2 text-base font-medium text-accent-dark">
        {form.errors[fieldErrors[field]!]}
      </p>
    ) : null;
  const required = (
    <span aria-hidden="true" className="ms-1 text-accent-dark">
      {form.requiredMark}
    </span>
  );

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-sage-100 sm:p-8">
      <h3 className="text-2xl font-bold text-sage-900">{form.title}</h3>
      <p className="mt-1 text-ink-soft">{form.subtitle}</p>

      <form ref={formRef} onSubmit={onSubmit} noValidate className="mt-6 space-y-5">
        <div>
          <label htmlFor="contact-name" className="font-semibold">
            {form.name.label}
            {required}
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete={form.name.autoComplete}
            required
            maxLength={80}
            aria-invalid={fieldErrors.name ? true : undefined}
            aria-describedby={describedBy("name")}
            onInput={() => clearFieldError("name")}
            className={inputClass}
          />
          {fieldError("name")}
        </div>

        <div>
          <label htmlFor="contact-phone" className="font-semibold">
            {form.phone.label}
            {required}
          </label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            dir="ltr"
            autoComplete={form.phone.autoComplete}
            required
            maxLength={20}
            aria-invalid={fieldErrors.phone ? true : undefined}
            aria-describedby={describedBy("phone")}
            onInput={() => clearFieldError("phone")}
            className={`${inputClass} text-right`}
          />
          {fieldError("phone")}
        </div>

        <div>
          <label htmlFor="contact-message" className="font-semibold">
            {form.message.label}
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={4}
            maxLength={MESSAGE_MAX}
            aria-invalid={fieldErrors.message ? true : undefined}
            aria-describedby={describedBy("message")}
            onInput={() => clearFieldError("message")}
            className={inputClass}
          />
          {fieldError("message")}
        </div>

        {/* Honeypot (FR-2): invisible to people, tempting to bots. */}
        <div aria-hidden="true" className="sr-only">
          <label htmlFor="contact-website">website</label>
          <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <div>
          <div className="flex items-start gap-3">
            <input
              id="contact-consent"
              name="consent"
              type="checkbox"
              required
              aria-invalid={fieldErrors.consent ? true : undefined}
              aria-describedby={describedBy("consent")}
              onChange={() => clearFieldError("consent")}
              className="mt-1.5 size-5 shrink-0 accent-sage-800"
            />
            <label htmlFor="contact-consent" className="text-base">
              {form.consent.before}
              <a
                href="/privacy"
                target="_blank"
                rel="noopener"
                className="font-semibold text-sage-800 underline underline-offset-4"
              >
                {form.consent.linkText}
                <span className="sr-only"> {content.ui.newWindow}</span>
              </a>
              {form.consent.after}
              {required}
            </label>
          </div>
          {fieldError("consent")}
        </div>

        {siteKey && (
          <>
            <Script
              src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
              strategy="lazyOnload"
              onReady={renderTurnstile}
            />
            <div ref={widgetEl} />
          </>
        )}

        {formError && (
          <div role="alert" className="rounded-2xl bg-sand p-4">
            <p className="font-medium">{errorText(formError)}</p>
            {formError !== "verifying" && (
              <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
                <WhatsAppButton label={content.contactSection.whatsappButton} placement="form-error" />
                <PhoneLink
                  placement="form-error"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-4 font-semibold text-sage-900 underline underline-offset-4"
                />
              </div>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={status === "sending"}
          className={`${buttonStyles.primary} w-full disabled:cursor-wait disabled:opacity-80`}
        >
          {status === "sending" ? form.sending : <EmojiText text={form.submit} />}
        </button>
      </form>
    </div>
  );
}
