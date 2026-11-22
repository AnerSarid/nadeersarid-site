#!/usr/bin/env node
/**
 * Pre-launch content check: `npm run check:content`
 *
 * 1. Lists every "[להשלמה: …]" placeholder left in src/content.ts.
 * 2. Fails if "פסיכולוג" appears in a title, heading, meta text or alt text
 *    (Psychologists Law, section 5). Body text may use it.
 * 3. Warns while the legal pages are still marked as drafts.
 *
 * Exits with code 1 if anything blocks launch. Not part of `npm run build`,
 * so preview deployments keep working while content is being filled in.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";

const contentPath = fileURLToPath(new URL("../src/content.ts", import.meta.url));
const source = readFileSync(contentPath, "utf8");
const { content: c, PLACEHOLDER_PREFIX } = await import(pathToFileURL(contentPath).href);

let failed = false;

// 1. Placeholders in the content section (including ones left in comments).
//    The schema and helpers above the "Content" banner are skipped.
const lines = source.split(/\r?\n/);
const contentStart = lines.findIndex((line) => line.includes("/* Content "));
const placeholders = lines
  .map((line, i) => ({ line: i + 1, text: line.trim() }))
  .filter(({ line, text }) => line > contentStart && text.includes(PLACEHOLDER_PREFIX));

if (placeholders.length > 0) {
  failed = true;
  console.log(`✗ ${placeholders.length} placeholder line(s) in src/content.ts:`);
  for (const { line, text } of placeholders) {
    const match = text.match(/\[להשלמה:[^\]]*\]/);
    console.log(`  line ${line}: ${match ? match[0] : text}`);
  }
} else {
  console.log("✓ No placeholders left");
}

// 2. Forbidden title word in titles, headings, meta text and alt text.
const FORBIDDEN = "פסיכולוג";
const legal = [c.privacy, c.accessibility];
const restricted = {
  "site.title": c.site.title,
  "site.description": c.site.description,
  "site.shareImageAlt": c.site.shareImageAlt,
  "site.shareImage": Object.values(c.site.shareImage).join(" "),
  "person.credentialsLine": c.person.credentialsLine,
  "person.photo.alt": c.person.photo.alt,
  "ui.lightbox": Object.values(c.ui.lightbox).join(" "),
  "ui.share": `${c.ui.share.title} ${c.ui.share.text}`,
  "hero.h1": c.hero.h1,
  "hero.subheading": c.hero.subheading,
  "nav.items": c.nav.items.map((i) => i.label).join(" "),
  headings: [
    c.details.heading,
    c.approach.heading,
    c.areas.heading,
    c.about.heading,
    c.about.credentialsHeading,
    c.faq.heading,
    c.reviews.heading,
    c.contactSection.heading,
    c.contactSection.form.title,
    c.notFound.title,
  ].join(" "),
  "faq questions": c.faq.items.map((i) => i.question).join(" "),
  "legal pages": legal
    .flatMap((p) => [p.title, p.description, ...p.sections.map((s) => s.heading)])
    .join(" "),
};

const offenders = Object.entries(restricted).filter(([, value]) => value.includes(FORBIDDEN));
if (offenders.length > 0) {
  failed = true;
  console.log(`✗ "${FORBIDDEN}" appears in restricted fields: ${offenders.map(([k]) => k).join(", ")}`);
} else {
  console.log(`✓ "${FORBIDDEN}" is absent from titles, headings, meta and alt text`);
}

// 3. Legal drafts.
for (const page of legal) {
  if (page.draft) {
    failed = true;
    console.log(`✗ ${page.path} is still marked as a draft (set draft: false after review)`);
  }
}

process.exit(failed ? 1 : 0);
