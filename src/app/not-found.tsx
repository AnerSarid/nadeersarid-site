import type { Metadata } from "next";
import Link from "next/link";
import { buttonStyles } from "@/components/ui";
import { content } from "@/content";

const { notFound } = content;

export const metadata: Metadata = {
  title: notFound.title,
  robots: { index: false },
};

export default function NotFound() {
  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <div className="mx-auto flex max-w-xl flex-col items-center px-5 py-24 text-center">
        <p className="text-7xl font-bold text-sage-200" aria-hidden="true">
          404
        </p>
        <h1 className="mt-4 text-3xl font-bold text-sage-900">{notFound.title}</h1>
        <p className="mt-3 text-ink-soft">{notFound.text}</p>
        <Link href="/" className={`${buttonStyles.primary} mt-8`}>
          {notFound.homeLink}
        </Link>
      </div>
    </main>
  );
}
