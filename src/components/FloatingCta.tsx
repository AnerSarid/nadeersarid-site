"use client";

import { useEffect, useState } from "react";
import { content } from "@/content";
import { EmojiText, buttonStyles } from "./ui";

/**
 * FR-7: bottom bar that appears once the hero has scrolled away, hides while
 * the contact section is on screen, and clears the iPhone home indicator.
 */
export function FloatingCta() {
  const [heroVisible, setHeroVisible] = useState(true);
  const [contactVisible, setContactVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("top");
    const contact = document.getElementById("contact");
    if (!hero || !contact) return;
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === hero) setHeroVisible(entry.isIntersecting);
        if (entry.target === contact) setContactVisible(entry.isIntersecting);
      }
    });
    observer.observe(hero);
    observer.observe(contact);
    return () => observer.disconnect();
  }, []);

  const visible = !heroVisible && !contactVisible;

  return (
    <div
      inert={!visible}
      className={`fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] transition duration-300 motion-reduce:transition-none ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0"
      }`}
    >
      <a href="#contact" className={`${buttonStyles.primary} w-full shadow-lg shadow-ink/20 sm:w-auto sm:px-10`}>
        <EmojiText text={content.ui.floatingCta} />
      </a>
    </div>
  );
}
