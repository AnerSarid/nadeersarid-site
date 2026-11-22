"use client";

import { useId, useState } from "react";
import { content } from "@/content";
import { Section } from "./Section";
import { ChevronIcon, Txt } from "./ui";

/** #faq: accordion with button semantics (FR-11). */
export function Faq() {
  const { faq } = content;
  const baseId = useId();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <Section id="faq" heading={faq.heading}>
      <div className="divide-y divide-sage-100 rounded-3xl bg-white ring-1 ring-sage-100">
        {faq.items.map((item, i) => {
          const open = openIndex === i;
          const buttonId = `${baseId}-q${i}`;
          const panelId = `${baseId}-a${i}`;
          return (
            <div key={item.question}>
              <h3>
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => setOpenIndex(open ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-start text-lg font-semibold text-sage-900 hover:bg-sage-50 sm:px-6"
                >
                  <span>{item.question}</span>
                  <ChevronIcon
                    className={`size-5 shrink-0 transition-transform motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
                  />
                </button>
              </h3>
              <div id={panelId} role="region" aria-labelledby={buttonId} hidden={!open} className="px-5 pb-5 sm:px-6">
                <p>
                  <Txt value={item.answer} />
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
