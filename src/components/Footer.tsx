import { cacheLife } from "next/cache";
import Link from "next/link";
import { content } from "@/content";

async function copyrightYear(): Promise<number> {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

export async function Footer() {
  const { footer } = content;
  const year = await copyrightYear();

  return (
    // Bottom padding keeps the last line clear of the floating contact bar.
    <footer className="bg-sage-900 pb-28 pt-12 text-sage-50">
      <div className="mx-auto max-w-4xl space-y-6 px-5 text-base sm:px-6">
        <p className="max-w-2xl">{footer.disclaimer}</p>

        <nav aria-label={footer.navLabel}>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {footer.links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="font-semibold underline underline-offset-4 hover:text-white focus-visible:outline-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {footer.social.length > 0 && (
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {footer.social.map((s) => (
              <li key={s.href}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer me"
                  className="font-semibold underline underline-offset-4 hover:text-white focus-visible:outline-white"
                >
                  {s.label}
                  <span className="sr-only"> {content.ui.newWindow}</span>
                </a>
              </li>
            ))}
          </ul>
        )}

        <p className="text-sage-200">
          © {year} {footer.copyright}
        </p>
      </div>
    </footer>
  );
}
