"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { content, type SectionId } from "@/content";
import { ShareButton } from "./ShareButton";
import { CloseIcon, MenuIcon } from "./ui";

const { nav } = content;

/** FR-9: highlights the nav item of the section in the middle of the screen. */
function useActiveSection(enabled: boolean): SectionId | null {
  const [active, setActive] = useState<SectionId | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const sections = nav.items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id as SectionId);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [enabled]);

  return enabled ? active : null;
}

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const active = useActiveSection(isHome);
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);

  // Close the mobile menu with Esc (focus back on the toggle) or a click outside it.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
    }
    function onPointer(e: PointerEvent) {
      const target = e.target as Node;
      if (!menu.current?.contains(target) && !menuButton.current?.contains(target)) setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  const hrefFor = (id: SectionId) => (isHome ? `#${id}` : `/#${id}`);

  const links = (onNavigate?: () => void) =>
    nav.items.map((item) => {
      const current = active === item.id;
      return (
        <li key={item.id}>
          <a
            href={hrefFor(item.id)}
            onClick={onNavigate}
            aria-current={current ? "true" : undefined}
            className={`block rounded-full px-3 py-2 text-base font-medium transition-colors hover:bg-sage-50 hover:text-sage-900 ${
              current ? "bg-sage-100 text-sage-900" : "text-ink-soft"
            }`}
          >
            {item.label}
          </a>
        </li>
      );
    });

  return (
    <header className="sticky top-0 z-50 border-b border-sage-100 bg-paper/95 backdrop-blur supports-[backdrop-filter]:bg-paper/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-6">
        <a href={isHome ? "#top" : "/"} className="me-auto text-2xl font-bold tracking-tight text-sage-900">
          {content.person.name}
        </a>

        <nav aria-label={nav.ariaLabel} className="hidden lg:block">
          <ul className="flex items-center gap-1">{links()}</ul>
        </nav>

        <ShareButton />

        <button
          ref={menuButton}
          type="button"
          className="inline-flex size-11 items-center justify-center rounded-full text-sage-900 hover:bg-sage-50 lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? nav.closeMenu : nav.openMenu}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      <div
        id="mobile-menu"
        ref={menu}
        hidden={!open}
        className="border-t border-sage-100 bg-paper px-4 pb-4 pt-2 shadow-md lg:hidden"
      >
        <nav aria-label={nav.ariaLabel}>
          <ul className="flex flex-col gap-1">{links(() => setOpen(false))}</ul>
        </nav>
      </div>
    </header>
  );
}
