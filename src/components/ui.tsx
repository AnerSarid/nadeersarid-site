import type { ReactNode } from "react";
import { isPlaceholder } from "@/content";

/** Left-to-right isolate for phone numbers and emails inside Hebrew text. */
export function Ltr({ children }: { children: ReactNode }) {
  return <bdi dir="ltr">{children}</bdi>;
}

const EMOJI = /(\p{Extended_Pictographic}(?:️|‍\p{Extended_Pictographic})*️?)/u;

/** Renders text with its emoji hidden from screen readers. */
export function EmojiText({ text }: { text: string }) {
  const parts = text.split(EMOJI).filter(Boolean);
  return (
    <>
      {parts.map((part, i) =>
        EMOJI.test(part) ? (
          <span key={i} aria-hidden="true">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

/** Text that is highlighted while it is still a "[להשלמה: …]" placeholder. */
export function Txt({ value }: { value: string }) {
  if (isPlaceholder(value)) return <span className="placeholder">{value}</span>;
  return <>{value}</>;
}

export const buttonBase =
  "inline-flex min-h-12 items-center justify-center gap-2 whitespace-nowrap rounded-full px-6 py-3 text-lg font-semibold leading-tight transition-colors";

export const buttonStyles = {
  whatsapp: `${buttonBase} bg-whatsapp text-white hover:bg-whatsapp-dark`,
  primary: `${buttonBase} bg-accent text-white hover:bg-accent-dark`,
  secondary: `${buttonBase} border-2 border-accent bg-white/70 text-accent-dark hover:bg-white`,
};

type IconProps = { className?: string };

const svgProps = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false,
};

export function ShareIcon({ className = "size-5" }: IconProps) {
  return (
    <svg {...svgProps} className={className}>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" />
    </svg>
  );
}

export function MenuIcon({ className = "size-6" }: IconProps) {
  return (
    <svg {...svgProps} className={className}>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

export function CloseIcon({ className = "size-6" }: IconProps) {
  return (
    <svg {...svgProps} className={className}>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

export function CheckIcon({ className = "size-4" }: IconProps) {
  return (
    <svg {...svgProps} strokeWidth={3} className={className}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function ChevronIcon({ className = "size-5" }: IconProps) {
  return (
    <svg {...svgProps} className={className}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function PhoneIcon({ className = "size-5" }: IconProps) {
  return (
    <svg {...svgProps} className={className}>
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
    </svg>
  );
}

export function MailIcon({ className = "size-5" }: IconProps) {
  return (
    <svg {...svgProps} className={className}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-10 6L2 7" />
    </svg>
  );
}

export function PinIcon({ className = "size-5" }: IconProps) {
  return (
    <svg {...svgProps} className={className}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export function ZoomIcon({ className = "size-5" }: IconProps) {
  return (
    <svg {...svgProps} className={className}>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3M11 8v6M8 11h6" />
    </svg>
  );
}
