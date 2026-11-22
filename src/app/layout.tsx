import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Heebo } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { content } from "@/content";
import { siteUrl } from "@/lib/site";
import "./globals.css";

// Self-hosted at build time; only the Hebrew and Latin subsets.
const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  variable: "--font-heebo",
  display: "swap",
});

const { site } = content;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: site.title, template: `%s | ${site.name}` },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: content.person.name }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: site.locale,
    url: "/",
    siteName: site.name,
    title: site.title,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#fbf8f3",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="he" dir="rtl" className={heebo.variable} data-scroll-behavior="smooth">
      <body className="flex min-h-dvh flex-col font-sans antialiased">
        <a
          href="#main"
          className="sr-only z-[100] rounded-full bg-sage-900 px-5 py-3 font-semibold text-white focus:not-sr-only focus:fixed focus:start-4 focus:top-4"
        >
          {content.ui.skipToContent}
        </a>
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
