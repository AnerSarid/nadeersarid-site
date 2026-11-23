# nadeersarid.com

The website of Nadeer Sarid (נדיר שריד), a CBT psychotherapist for children and teens aged 6–18 in Beer Sheva and online. It is a one-page Hebrew (RTL) site with a contact form, a privacy policy, an accessibility statement, and a 404 page.

- **Stack:** Next.js 16 (App Router, TypeScript), Tailwind CSS 4, hosted on Vercel.
- **No database:** contact messages are emailed to Nadeer through Resend and never stored.
- **Open items:** everything still missing or awaiting approval is listed in [TODO.md](TODO.md).

## Editing content

All text, links and image paths are in **[`src/content.ts`](src/content.ts)**. Components never need to change for a content edit.

- In GitHub, open `src/content.ts`, click the pencil icon, edit the text between the quotes, and commit to a new branch. That opens a pull request with its own preview URL. Merging the pull request publishes it.
- Text marked `[להשלמה: …]` is a placeholder that still needs real content. It shows on the site highlighted in yellow so it can't go live unnoticed.
- Testimonials: add items to `reviews.items`, for example `{ text: "…", author: "אורית, באר שבע" }`. The section appears automatically once the list isn't empty. Only publish testimonials if her professional association's ethics rules allow them.
- **Never** use the word "פסיכולוג" in titles, headings, meta text or alt text. Section 5 of the Psychologists Law forbids it for anyone who isn't a registered psychologist.

Before launch, run:

```bash
npm run check:content
```

It lists every remaining placeholder, fails if "פסיכולוג" appears in a restricted field, and flags legal pages still marked `draft: true`. It is deliberately not part of `npm run build`, so preview deploys keep working while content is being filled in.

## Local setup

Requires Node.js 20.9 or later (developed on Node 24).

```bash
npm install
cp .env.example .env.local   # then fill in values, see below
npm run dev                  # http://localhost:3000
```

Without Resend keys, `npm run dev` still lets you submit the form: the API reports success and logs that no email was sent. For Turnstile in development, use Cloudflare's public test keys (listed in `.env.example`), which always pass.

| Script | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build / serve it locally |
| `npm run lint` | ESLint |
| `npm run typecheck` | Generates route types, then `tsc --noEmit` |
| `npm run check:content` | Pre-launch content check (see above) |

## Environment variables

Set these in Vercel under **Project → Settings → Environment Variables**, for both **Production** and **Preview**. Never commit real values: this repository is public.

| Name | Example | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://nadeersarid.com` | Canonical URL for metadata, sitemap and structured data |
| `RESEND_API_KEY` | `re_…` | Resend API key ("Sending access" is enough) |
| `CONTACT_TO_EMAIL` | Nadeer's inbox | Where form submissions are delivered |
| `CONTACT_FROM_EMAIL` | `אתר נדיר שריד <form@nadeersarid.com>` | Sender; must be on the domain verified in Resend |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | `0x4AAA…` | Cloudflare Turnstile site key (public) |
| `TURNSTILE_SECRET_KEY` | `0x4AAA…` | Cloudflare Turnstile secret key |

In Preview and Production, the contact route **fails closed** when Resend or Turnstile isn't configured. The form then shows an error with WhatsApp and phone fallbacks instead of silently losing messages.

## Project structure

```
src/
  content.ts               ← all site text (edit this)
  app/
    layout.tsx             ← <html lang="he" dir="rtl">, font, metadata, header/footer
    page.tsx               ← one-page home + JSON-LD
    privacy/ accessibility/ ← legal pages (text in content.ts)
    not-found.tsx          ← Hebrew 404
    api/contact/route.ts   ← POST: zod, honeypot, rate limit, Turnstile, Resend
    opengraph-image.tsx    ← 1200×630 share image (next/og)
    icon.tsx, apple-icon.tsx, sitemap.ts, robots.ts
  components/              ← sections and UI
  lib/                     ← links, analytics, JSON-LD, SEO, email, rate limit, Turnstile
  assets/fonts/            ← Heebo TTFs for the share image (SIL OFL, see OFL.txt)
scripts/check-content.mjs  ← pre-launch content check
public/images/             ← headshot
```

## Deploying to Vercel

Production is the Vercel project **`nadeersarid-site`** in Nadeer's Vercel account. A push to `main` deploys to production and every pull request gets a preview URL. The domain's DNS is hosted at **Cloudflare**.

**Already set up (Nov 22, 2026, via the Vercel CLI):** the project (Next.js preset), `NEXT_PUBLIC_SITE_URL`, `CONTACT_TO_EMAIL` and `CONTACT_FROM_EMAIL` for Production and Preview, and both domains. GitHub (`AnerSarid/nadeersarid-site`, production branch `main`) was connected on Nov 23, 2026. `www.nadeersarid.com` is a **301** domain redirect to `nadeersarid.com`. `next.config.ts` has the same redirect as a fallback.

**Still to do:**

1. **DNS in Cloudflare.** Add the two site records from the table below with the proxy set to **DNS only** (grey cloud). Vercel needs the traffic unproxied to issue the HTTPS certificate. Then run `vercel domains verify nadeersarid.com`.
2. **Email forwarding.** In Cloudflare → Email → Email Routing, forward `contact@nadeersarid.com` (shown on the site) to Nadeer's inbox. Cloudflare adds its own MX and SPF records.
3. **Resend.** Add `nadeersarid.com` as a sending domain, add the records it shows in Cloudflare (DNS only), wait for "Verified", and create an API key with "Sending access".
4. **Cloudflare Turnstile.** In Cloudflare → Turnstile → Add widget, add hostnames `nadeersarid.com` and `www.nadeersarid.com` (plus `nadeersarid-site.vercel.app` if the form should work there) and choose "Managed" mode.
5. **Secret environment variables.** Add them from a terminal in this folder. Each command prompts for the value, so keys never land in shell history or the repo:
   ```bash
   vercel env add RESEND_API_KEY --environment "production,preview" --sensitive
   vercel env add TURNSTILE_SECRET_KEY --environment "production,preview" --sensitive
   vercel env add NEXT_PUBLIC_TURNSTILE_SITE_KEY --environment "production,preview" --no-sensitive
   ```
   Then redeploy (`vercel deploy --prod`, or push to `main`).
6. **Rate-limit rule (recommended).** In Project → Firewall → Configure → New rule, add: if Request Path equals `/api/contact`, action Rate Limit with a fixed window of 10 minutes, 10 requests, keyed by IP, then Deny. The Hobby plan allows one such rule. The route also has its own in-memory limit, but that is only best effort per serverless instance.
7. **Move to Vercel Pro** before or soon after launch. Hobby is limited to non-commercial use, and analytics custom events (`whatsapp_click`, `phone_click`, `form_submit`) are recorded only on Pro.
8. **Enable 2FA** on Nadeer's Vercel account (Account Settings → Authentication).

### Launch checks

```bash
curl -sI https://www.nadeersarid.com | head -3   # expect 301 → https://nadeersarid.com/
curl -sI http://nadeersarid.com | head -3        # expect a redirect to https
npm run check:content                             # expect no placeholders and no drafts
```

Then:
- Submit the form end to end and confirm the email arrives (not in spam) within a minute.
- On a real iPhone and Android phone, check that WhatsApp opens with the greeting and that the phone link dials.
- Paste the URL into WhatsApp to check the preview card shows the photo, name and title.
- Run Lighthouse (mobile) and an accessibility scan.
- Run [Google's Rich Results Test](https://search.google.com/test/rich-results) on the home page.

## DNS records (Cloudflare)

All records are **DNS only** (grey cloud). The Vercel values come from `vercel domains verify <domain>`. For the others, copy the exact values from each service's dashboard.

| Type | Name | Value | For |
| --- | --- | --- | --- |
| CNAME | `@` | `c3d60b6b199e49c8.vercel-dns-017.com` | Site (apex; Cloudflare flattens the CNAME) |
| CNAME | `www` | `c3d60b6b199e49c8.vercel-dns-017.com` | www → 301 to apex |
| MX | `send` | `feedback-smtp.<region>.amazonses.com` (priority 10), from Resend | Resend bounce handling |
| TXT | `send` | `v=spf1 include:amazonses.com ~all`, from Resend | Resend SPF |
| TXT | `resend._domainkey` | DKIM public key, from Resend | Resend DKIM |
| TXT | `_dmarc` | `v=DMARC1; p=none; rua=mailto:<Nadeer's inbox>` | DMARC (move to `p=quarantine` once mail is flowing) |
| MX / TXT | `@` | Added automatically by Cloudflare Email Routing | `contact@nadeersarid.com` forwarding |
| TXT | `@` | `google-site-verification=…`, from Search Console | Search Console verification |

Email Routing's SPF record on `@` and Resend's SPF on `send` don't conflict.
## After launch

- **Search Console:** verify the domain with the DNS TXT record above and submit `https://nadeersarid.com/sitemap.xml`.
- **Google Business Profile:** create or claim it under her real name and link the site. Locally this matters more than anything on the page.
- **Update every link:** Instagram and Facebook bios, WhatsApp Business profile, email signature. Ask the directory to link to the new site and to correct her phone number.
- **Collaboration:** add Nadeer's GitHub account as a collaborator so she can edit `src/content.ts` in GitHub's web editor.

## Notes

- Privacy: the site has no cookies and no embedded third-party widgets except Cloudflare Turnstile on the form. Vercel Web Analytics is cookie-less.
- Accessibility: built to WCAG 2 AA (the basis of Israeli Standard 5568), with no overlay widget. The statement is at `/accessibility`.
- Fonts: Heebo (SIL Open Font License 1.1). The page font is self-hosted by `next/font`. The TTFs in `src/assets/fonts` are used only to render the share image.
