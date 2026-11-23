# TODO before launch

`npm run check:content` lists the open placeholders and drafts, with line numbers. This file explains each one.

## Blocks launch

- [x] **Inbox for form submissions.** `CONTACT_TO_EMAIL` is set in Vercel to the PRD default (Nadeer's Gmail). Change it if she prefers another address.
- [x] **Connect GitHub to the Vercel project.** Connected Nov 23, 2026: a push to `main` deploys to production, and pull requests get preview URLs.
- [x] **DNS at Cloudflare.** Both Vercel CNAME records were added (DNS only) on Nov 23, 2026. HTTPS is live on `nadeersarid.com`, and `www` redirects to it.
- [ ] **Resend and Turnstile keys** in Vercel, with the sending domain verified (README → Deploying, steps 2–4).
- [ ] **Email forwarding** for `contact@nadeersarid.com`, the public address shown on the site. The Email Routing records are in place and her Gmail is added as a destination. Waiting for Nadeer to click the verification email from Cloudflare, then create the `contact@` rule (README → Deploying, step 1). Or change `publicEmail` in `src/content.ts` to whichever public address she prefers.
- [ ] **Legal review** of `/privacy` and `/accessibility`. Then set `draft: false` for each in `src/content.ts`.
- [ ] All placeholders below filled in, or removed with her approval.

## Placeholders in `src/content.ts` (`[להשלמה: …]`)

| # | Where | Needed |
| --- | --- | --- |
| 1 | `clinicAddress` (used by details, contact, directions, structured data) | Clinic street address, or at least the neighborhood. Waze and Google Maps links appear once it's filled in. |
| 2 | `about.credentials[0].detail` | Institution for her M.A. in special education |
| 3 | `about.credentials[1].detail` | Institution for her CBT certificate, and whether the program is ITA (איט״ה) recognized |
| 4 | `faq.items[0].answer` | What happens at the first meeting, and who comes to it |
| 5 | `faq.items[1].answer` | Session length and frequency |
| 6 | `faq.items[2].answer` | Parent involvement |
| 7 | `faq.items[3].answer` | Price: show it, show a "from" price, or say it's given by phone |
| 8 | `faq.items[4].answer` | Health-fund and insurance refunds (כללית מושלם, מכבי שלי, …) and receipts |
| 9 | `footer.social` (comment) | Instagram, Facebook and LinkedIn URLs, if any. These also feed `sameAs` in structured data. |
| 10 | `privacy`, section "כמה זמן המידע נשמר" | How long form emails are kept in her inbox, and when they're deleted |
| 11 | `privacy.updated` | Date the policy was last updated (after review) |
| 12 | `accessibility`, section "מגבלות ידועות" | Physical accessibility of the clinic: parking, stairs, elevator, restroom |
| 13 | `accessibility.updated` | Date of the last accessibility check |

FAQ items with placeholder answers are left out of the FAQPage structured data until they're answered.

## Drafts awaiting Nadeer's approval (real text, not placeholders)

- [ ] **WhatsApp greeting** (`contact.whatsapp.greeting`), reworded from the directory's: "היי נדיר, הגעתי דרך האתר שלך - בנוגע לטיפול רגשי 🙂"
- [ ] **Footer disclaimer** (`footer.disclaimer`)
- [ ] **Emergency line** (`contactSection.emergency`), wording from the PRD: "במצב חירום יש לפנות ל-101 או לער״ן 1201"
- [ ] **Meta description** (`site.description`)
- [ ] **FAQ questions** (`faq.items`) and the two answers drafted from her profile (online sessions, ages)
- [ ] **CTA band text** (`ctaBand.text`) and the form's consent, success and error messages
- [ ] **Accessibility coordinator.** The statement names Nadeer, with the site's phone and email. Confirm.
- [ ] **Testimonials.** Keep the section (hidden while empty)? How to collect them? Check her association's ethics rules first.

## Nice to have

- [ ] Original high-resolution photo. The current one is the directory's 1024×1024 copy in `public/images/`.
- [ ] Extra photos (clinic room, workspace). The lightbox shows next and previous only once there's more than one photo.
- [ ] Google Business Profile, created or claimed under her real name and linked to the site.

## Decisions and caveats to know about

- **Bio text is verbatim from her directory profile** (as instructed), typos included ("דימיון", "איזור"). The PRD's off-page SEO section says that if the directory listing stays up, her site's bio should be reworded or extended so Google treats her site as the original. That's worth doing with her.
- **Vercel Hobby plan:** fine for building, but it is for non-commercial use only. Move to Pro before or soon after launch. Analytics custom events (`whatsapp_click`, `phone_click`, `form_submit`) are in the code but are recorded only on Pro.
- **Rate limiting:** a Vercel Firewall rule denies more than 10 requests per IP per 10 minutes to `/api/contact` (added Nov 23, 2026). The in-memory limit in the route itself is only per serverless instance.
- **Turnstile:** confirm in the legal review how the privacy policy should describe Cloudflare Turnstile's processing. It is the only third-party component on the page.
- **FAQ rich results:** since 2023, Google shows FAQ rich results only for well-known government and health sites. The FAQPage markup is valid and harmless, but don't expect FAQ snippets in search results.
