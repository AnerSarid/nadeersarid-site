"use client";

import { useEffect, useRef, useState } from "react";
import { content } from "@/content";
import { ShareIcon } from "./ui";

const { share } = content.ui;

/**
 * FR-6: native share sheet on touch devices; elsewhere (or if sharing
 * isn't supported) copy the link and confirm with a toast.
 */
export function ShareButton({ className = "" }: { className?: string }) {
  const [toast, setToast] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  function showToast(message: string) {
    setToast(message);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 2500);
  }

  async function onShare() {
    const url = window.location.href.split("#")[0];
    const isTouch = window.matchMedia("(pointer: coarse)").matches;

    if (isTouch && typeof navigator.share === "function") {
      try {
        await navigator.share({ title: share.title, text: share.text, url });
        return;
      } catch (err) {
        // The user closed the share sheet: nothing else to do.
        if (err instanceof DOMException && err.name === "AbortError") return;
        // Any other failure falls through to copying the link.
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      showToast(share.copied);
    } catch {
      showToast(share.copyFailed);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={onShare}
        className={`inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-base font-medium text-sage-800 hover:bg-sage-50 ${className}`}
      >
        <ShareIcon />
        <span>{share.button}</span>
      </button>
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 top-20 z-[60] flex justify-center px-4"
      >
        {toast && (
          <p className="rounded-full bg-ink px-5 py-2 text-base font-medium text-white shadow-lg">{toast}</p>
        )}
      </div>
    </>
  );
}
