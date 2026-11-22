"use client";

import type { AnchorHTMLAttributes } from "react";
import { trackEvent, type AnalyticsEvent } from "@/lib/analytics";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  event: AnalyticsEvent;
  /** Where on the page the link is, sent as an event property. */
  placement: string;
};

/** An <a> that records a cookie-less analytics event when clicked (FR-13). */
export function TrackedLink({ event, placement, onClick, ...props }: Props) {
  return (
    <a
      {...props}
      onClick={(e) => {
        trackEvent(event, { placement });
        onClick?.(e);
      }}
    />
  );
}
