import type { ReactNode } from "react";
import type { SectionId } from "@/content";

const tones = {
  paper: "bg-paper",
  sand: "bg-sand",
  sage: "bg-sage-50",
} as const;

export function Section({
  id,
  heading,
  tone = "paper",
  children,
}: {
  id: SectionId;
  heading: string;
  tone?: keyof typeof tones;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`${tones[tone]} py-16 md:py-24`}>
      <div className="mx-auto max-w-4xl px-5 sm:px-6">
        <h2 id={`${id}-title`} className="mb-8 text-3xl font-bold text-sage-900 sm:text-4xl">
          {heading}
        </h2>
        {children}
      </div>
    </section>
  );
}
