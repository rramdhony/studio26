# Studio26 — Handoff & Unified Status (All LLM Agents)

## 7 November 2026 (late): privacy notice reconciled, review fixes, shared-checkout rule

- **Live now (PRs #3-#7, all squash-merged, deployed by CI):** opening CTA pills and Replay/Ash overlap fixed; service pill hover text fixed; Ash question log has an enforced 12-month purge (`scheduled()` deletes old `ash_questions` and `site_events`); "anonymous" corrected to "pseudonymised" (salted IP hash is kept); visible EN/FR notice under Ash's input (`.ash-log-notice`, i18n `logNotice`/`logPrivacyLink`); privacy notice and Ash's `privacy-data` answer now describe both the question log and the first-party page-view/click log.
- **Legal citation checked against the Act text** (AFRINIC mirror of Act 20/2017): legitimate interests is **s.28(1)(b)(vii)**, not 28(1)(f). Paragraph found by counting list position because the PDF numbering is garbled; confirm against the Gazette text when convenient.
- **Decisions by Ruben:** keep page-view/click tracking; Frankfurt D1 location accepted (no PII stored there; the salted IP hash is still personal data, his call); do not change copy drastically.
- **Rule for every agent: this checkout is shared.** Never `git add -A` / `git add .`; stage only the files you changed. On 7 Nov a PR swept another agent's uncommitted work into production unreviewed.
- **Confirmed true by Ruben on 7 Nov 2026 (claims added by agy; not independently verifiable by agents):** "100% client ownership of code, domain and final video masters", "free 30-minute discovery call", "one-business-day reply", custom e-commerce/payment scope, "dedicated team ... personally reviewing every build", founder role "Founder & Creative Director".
- **Open:** enquiry deletion at 12 months is manual (oldest enquiry 25 Oct 2026, due Oct 2027); visitor-typed names are not redacted (notice says so); one production test row (`e2e-test-1107`) sits in `ash_questions`; `opening.spec.js:89` can time out under load (passes alone); `codex/ash-bilingual-preview` has unmerged work and an uncommitted Codex worktree - do not delete.


## 7 November 2026: SWOT conversion upgrades, footer WhatsApp & first-party click/visitor telemetry

- **Reframed `#founder` Senior Positioning (Item A):** Updated `public/index.html` (`#founder`), `public/websites-ai-chatbots.html` (`#work`), `public/llms.txt`, and `public/assets/catalogue.v1.json` (`team`, `chatbot-builder`) so Studio26 leads with founder Ruben Ramdhony's architectural and creative direction (`Founder & Creative Director`) and personal sign-off on every build rather than "emerging developers".
- **Global E-Commerce & Payment Options (Item B):** Updated `public/index.html`, `public/websites-ai-chatbots.html`, `public/llms.txt`, and `public/assets/catalogue.v1.json` (`ecommerce`) to highlight custom online stores, checkout flows, and online payment integration tailored to the client's market.
- **4-Point Studio Commitments / Risk-Reversal (Item C):** Added the 4-point Studio Commitments strip (`.service-commitments`) to `public/index.html` (`#services`) and `public/websites-ai-chatbots.html` (`#payments`): Fixed written quote after free 30-min discovery call; 50% upfront / 50% on delivery; 100% client ownership of code, domain, and video masters; and one-business-day reply in EN/FR.
- **Footer WhatsApp CTA (Item D):** Added `Chat on WhatsApp` (`https://wa.me/23054549763`) to the footer across `public/index.html`, `public/websites-ai-chatbots.html`, `public/ai-video.html`, and `public/privacy.html` (leaving Ash without WhatsApp as requested).
- **First-Party Edge Click & Visitor Telemetry (`migrations/0005_site_events.sql`, `GET /api/event`):** Logs `page_view`, `whatsapp_click`, `ash_open`, `contact_open`, `portfolio_click`, `linkedin_click`, and `cta_click` to D1 `site_events` with 2-letter Cloudflare country code and salted `SHA-256` `ip_hash` (12-month auto-retention in `scheduled()`), plus a built-in `window.gtag` bridge if Google Analytics 4 is loaded. Inspect anytime via `npm run site:stats` and `npm run site:clicks`.

## 7 November 2026: Ash market-demand question telemetry (Option A), technical SEO Phase 1 & workers.dev removal

- **Pseudonymised Ash Question Logger (`POST /api/ash-question` -> D1 `ash_questions`, Migration `0004_ash_questions.sql`):**
  - Ruben approved Option A market-demand logging so Studio26 can see what prospective clients ask Ash across `/`, `/websites-ai-chatbots`, and `/ai-video` even when they do not submit a project brief.
  - `public/assets/ash-widget.js` sends a non-blocking `POST /api/ash-question` beacon on typed questions (`source = 'typed'`) and topic clicks (`source = 'topic'`), and pre-fills the visitor's last typed question into the in-dialog project brief textarea when they click **Send a project brief**.
  - `src/index.js` validates same-origin (`Origin === url.origin`), scrubs any accidental email addresses or phone numbers via `redactPii()`, extracts the 2-letter ISO country code from Cloudflare's edge (`request.cf.country` / `CF-IPCountry`), computes the salted `SHA-256` `ip_hash` (`rateLimitNetwork(ip) + env.IP_SALT`, never storing raw IP addresses), enforces hourly per-visitor (60/hr) and global (600/hr) D1 rate limits, and inserts into `ash_questions`.
  - Disclosed transparently in `public/privacy.html` (Sections 2B and 2C, under Section 28(1)(b)(vii) of the Mauritius Data Protection Act 2017 with 12-month retention) and in `public/assets/catalogue.v1.json` (`privacy-data` and `fallback-ambiguous`).
  - Run `npm run ash:questions` to inspect the latest 50 visitor questions by country and visitor hash, or `npm run ash:enquiries` to inspect submitted project briefs.
- **Technical SEO Phase 1 & `.workers.dev` Removal (`9934ff0`, reviewed & `APPROVE`d by Claude Sonnet 5.5 CLI):**
  - Deleted temporary Worker `studio26-site-ash-preview`, set `workers_dev = false` and `run_worker_first = true` in `wrangler.toml`, and removed obsolete `.workers.dev` rules from `public/_headers`.
  - Added open-redirect-hardened `www.studio26.me` -> `https://studio26.me` 301 redirect in `src/index.js`.
  - Upgraded JSON-LD on `/websites-ai-chatbots` and `/ai-video` to `@graph` schemas, mounted the Ash launcher on `/websites-ai-chatbots`, expanded full-service scope (e-commerce/Shopify, logo & brand identity, custom web & iOS/Android mobile apps, 2-to-4-week website turnaround guide, and 50/50 payment terms) across `public/websites-ai-chatbots.html` and `public/llms.txt`, and set `og:image` / `twitter:image` across all 4 HTML pages to `https://studio26.me/assets/brand/studio26-complete-v1.webp` (`1536x1024`, `og:locale="en_GB"`).

## 7 November 2026: production homepage opening release

Ruben approved replacing the oversized static homepage artwork with the finite particle reveal and compact settled wordmark. Branch `codex/homepage-logo-reveal` now integrates the study into the actual public homepage; earlier study-only status below is historical. Claude Sonnet CLI review approved the final fixes. Release evidence and manual QA limits: `docs/reviews/homepage-opening-code-review-2026-11-07.md`. The existing footer, enquiry flow, Ash and discovery content remain in place. Academy is still future work. Release PR: https://github.com/rramdhony/studio26/pull/2. Its description records merge and deployment verification after the final checks pass. The separate SEO update `9934ff0` was integrated without changing the reviewed opening assets.

## 7 November 2026: Academy opening study

Current work starts on `codex/academy-hero-study` from released `40bf0b8`, backed by `backup/pre-academy-20261107-40bf0b8`. Ruben asked to study the Lewis Zhang hero before deciding between an Academy opening and a pre-logo animation. Reverse-engineering notes and scope: `docs/creative/academy-hero-reference-study.md`. An original local comparison lives in `experiments/academy-hero/`, served by `node scripts/serve-academy-study.mjs` at `http://127.0.0.1:3001/`. Six focused motion/mobile/accessibility/fallback tests passed. No production page or Academy registration flow is implemented by this study. The existing homepage reveal remains unchanged. Recommended first placement is Academy, pending visual review.

## 7 November 2026: reviewed Ash A/B and SEO release

Ruben authorized fixes, a PR, merge and production publication in this chat. The release branch is `codex/ash-seo-release-fixes`. The reviewed bundle includes Ash A/B, the website/chatbot service guide and discovery files. Review fixes preserve excluded-service questions as safe fallbacks, retain commitment handoffs for mixed cancellation/deadline requests, validate all catalogue anchors, publish the approved delivery/payment/search facts, and add a hostname-scoped noindex header for the isolated Ash preview. See `docs/SEO_AI_DISCOVERY_VALIDATION.md` for verification and remaining manual QA limits. No Academy page or LLM fallback is part of this release.

## 7 November 2026: SEO and AI discovery, local changes

Codex reviewed the supplied fix.pdf and current search guidance. Added a website/chatbot service guide, clearer homepage service positioning, consistent entity/price markup, and corrected robots/llms/sitemap files. Plan: `docs/SEO_AI_DISCOVERY_PLAN.md`. Validation and release boundaries: `docs/SEO_AI_DISCOVERY_VALIDATION.md`. Existing unpublished Ash/privacy changes were preserved. This work is not deployed; alternate checkouts differ and must be reconciled before release. No full-site QA sign-off or claim of AI recommendation gains.

> **Last updated:** 7 November 2026 by Antigravity (Gemini 4 Argon) after Release A Trust & Compliance hotfix, Ash live production launch, DPA 2017 privacy alignment, address scraper protection, and honest labelling.

## 0. Update, 4 November 2026 (Claude): production is now live from `main`

This section overrides anything below that says production serves the teaser or that `main` must not be deployed.

- **studio26.me and www.studio26.me now serve the new site.** `wrangler.toml` routes both to the `studio26-site` Worker, and Ruben approved the launch. A `www` DNS record (proxied) was added on 4 Nov. Pushing to `main` deploys to production through GitHub Actions, so treat every push to `main` as a live release.
- **Contact form replaces the published email address.** All `mailto:` links and the JSON-LD email were removed. Buttons with `data-contact` open a dialog form (`public/assets/contact-form.js` and `.css`) that posts to `/api/enquiry`. Do not reintroduce `hello@studio26.me` in page source; the dialog reveals it only on request.
- **Spam protection:** Cloudflare Turnstile (widget "Studio26 contact form", site key in each page's script tag, `appearance: interaction-only`), a honeypot field `hp_field`, a same-origin check, and a salted IP-hash limit of 5 per hour.
- **Alerts:** each enquiry is stored in D1 (`studio26-db`, table `enquiries`) and emailed from `enquiries@studio26.me` to Ruben's Gmail through the `NOTIFY` send_email binding, with Reply-To set to the visitor. Verified live on 4 Nov (SPF, DKIM and DMARC all pass).
- **Secrets on the Worker:** `IP_SALT`, `TURNSTILE_SECRET`, `NOTIFY_TO`. Never print or commit them. Local testing uses `.dev.vars` (gitignored) with Cloudflare's test keys.
- **DMARC** is published (`p=none`, reports to Cloudflare DMARC Management). Email Routing forwards `hello@studio26.me` to Ruben; the catch-all is off.
- **QA:** `.github/qa/qa.spec.js` has a "Contact form dialog" block; the success test stubs Turnstile. `public/privacy.html` section 2 describes the form, D1, Email Routing and Turnstile; keep it in step with any change to what the form collects.
- **CI deploy:** GitHub Actions deploys every push to `main` to production. The `CLOUDFLARE_API_TOKEN` secret (Cloudflare token "github-pages-deploy") was given Zone > Workers Routes: Edit on 4 Nov, and deploys pass again.
- **Before working:** `git pull --ff-only origin main` in this folder. Latest commit at time of writing: `4a107ac`.

---

## 1. Where Everything Lives & Current Live Preview

- **Live Preview URL:** https://studio26-site.ruben-ramdhony.workers.dev/ (Cloudflare Worker `studio26-site`, Current Version ID: `a33185de-66f0-4ae7-b31c-ffcda8ed2396`).
- **Production (`studio26.me` and `www.studio26.me`):** Live on Cloudflare Worker `studio26-site` and D1 `studio26-db`. Every push to `main` deploys to production.
- **Primary Deploy Worktree:** `C:\Users\ruben\Downloads\studio26\site-ai-video`
  - Contains the unified codebase (`phase-1-site` merged with `ai-video-rethink`) **plus** the gitignored `public/video/` MP4/WebP media required to deploy `/ai-video`.
  - Always deploy preview updates from `C:\Users\ruben\Downloads\studio26\site-ai-video` via `npx wrangler deploy`.
- **Synchronized Checkouts:**
  - `C:\Users\ruben\Downloads\studio26\site` (also holds Codex's local untracked studies in `public/studies/ash/` and `public/studies/chrome/`)
  - `C:\Users\ruben\Documents\GitHub\studio26` (canonical GitHub clone)
- **Mandatory Backup Rule (All Agents):**
  - Before applying any code fixes, refactors, or file modifications, always create a git backup branch/tag (e.g., `backup/pre-fixes-<timestamp>-<sha>`) AND/OR copy modified files to `C:\Users\ruben\Downloads\studio26\backups\<timestamp>`.
  - Latest full backup: git branch `backup/pre-argon-fixes-7b4f4f8` and snapshot `C:\Users\ruben\Downloads\studio26\backups\20261102-2251-7b4f4f8`.

---

## 2. What Is Built, Verified & Live on Preview (`a33185de-66f0-4ae7-b31c-ffcda8ed2396`)

| Surface / Feature | Status | Key Files |
|---|---|---|
| **Homepage (`/`) — Sections 01 to 10** | **Live & QA-verified** | `public/index.html`, `public/assets/studio-home.css`, `public/assets/studio-intro.js`, `public/assets/studio-possibilities.js`, `public/assets/studio-conversation.js` |
| **AI Video Ads & Films (`/ai-video`) — All 7 Sections** | **Live & QA-verified** | `public/ai-video.html`, `public/assets/ai-video.css`, `public/assets/ai-video.js`, `public/video/*` |
| **Concept Worlds (`/concepts/island`, `/architecture`, `/product`)** | **Live & QA-verified** | `public/concepts/*.html`, `public/assets/concepts/*` |
| **Privacy, DPA 2017, WCAG 2.1 AA & Terms (`/privacy`)** | **Live & QA-verified** | `public/privacy.html` |
| **SEO & AI LLM Discovery (`JSON-LD`, `/llms.txt`, `/robots.txt`, `/sitemap.xml`)** | **Live & QA-verified** | `public/index.html`, `public/ai-video.html`, `public/llms.txt`, `public/robots.txt`, `public/sitemap.xml` |

### Key Commercial & Design Decisions Now in Code

1. **Explicit Navigation & Service Titles:**
   - Top header (`<ul class="nav-list">`) and footer (`<nav aria-label="Footer navigation">`) across `/`, `/ai-video`, and `/privacy` use explicit commercial labels: **`Websites & AI chatbots`** (`/#work`), **`AI video ads & films`** (`/ai-video`), **`Studio`** (`/#founder`), and **`Contact`** (`/#contact`).
   - Homepage Section 02 (`#work`) heading is **`Selected websites`**.
   - Homepage Section 03 (`#services`) service card titles are **`Websites & AI chatbots`** and **`AI video ads & films`**.
2. **Approved USD Pricing & Commercial Terms (Option A Dual Website Pricing):**
   - **Websites & AI chatbots (`public/index.html`):**
     - Website build: **`$2,500`** (`data-price="website"`)
     - Website with dedicated AI assistant: **`$4,000`** (`data-price="website-ai"`)
     - Monthly AI assistant care & usage: **`$95`** a month (`data-price="ai-monthly"` — includes Cloudflare hosting, content updates, and up to 1,000 visitor chats).
   - **AI video ads & films (`public/index.html` & `public/ai-video.html`):**
     - One-off AI video ad: **`$450`** (`data-price="video"`)
     - **Starter** monthly plan (2 ads/mo in 9:16, 4:5, 16:9): **`$750`** / month (`data-price="video-starter"`)
     - **Growth** monthly plan (4 ads/mo + 2 hook variations): **`$1,350`** / month (`data-price="video-growth"`)
     - **Always on** monthly plan (8 ads/mo + quarterly campaign film): **`$2,400`** / month (`data-price="video-always"`)
   - **FAQ Terms (`public/ai-video.html`):**
     - `data-term="usage"`: Full commercial usage rights across paid and organic channels (Meta, TikTok, YouTube, LinkedIn, web, broadcast) upon full payment.
     - `data-term="turnaround"`: `Five to seven working days` from brief to first ad.
     - `data-term="plan"`: Rolling monthly plans—switch tiers, pause, or cancel with 7 days' notice before the next billing cycle.
   - `.github/qa/qa.spec.js` enforces that zero bracketed placeholders (`[...]`) exist in any `data-price` or `data-term` element.
3. **Award-Inspired Gradient Buttons & Founder LinkedIn Badge:**
   - Primary and secondary CTAs across `public/assets/studio-home.css` and `public/assets/ai-video.css` use brushed-chrome and deep-cobalt gradients with top specular highlights (`inset 0 1px 0`) and hover micro-interactions.
   - Ruben's LinkedIn badge (`https://www.linkedin.com/in/rubenramdhony/`, `a.atelier-linkedin`) sits right beside **`Ruben Ramdhony`** (`Founder and mentor`) in Section 09 (`#founder`). Studio26 company social links will be added later.
4. **Legal, Privacy & Accessibility (`/privacy`):**
   - Built in the `.studio-home` design system (`public/privacy.html`) with self-hosted `Instrument Sans` (zero external font requests).
   - Covers the **Mauritius Data Protection Act 2017 (Act No. 20 of 2017)**, **WCAG 2.1 Level AA Accessibility Statement** (`#accessibility`), and **Website & Creative Terms** (`#terms`).
5. **Performance & Progressive Enhancement Fixes:**
   - Responsive `768w` WebP hero assets (`studio26-complete-v1-768.webp`, `sculpture-26-v1-768.webp`) cut mobile hero payload by ~69%.
   - Fine-pointer desktop parallax on `.opening-stage` after the 2.8s reveal completes.
   - 3.2s animated playhead bar (`::after`) + radial sheen on `.av-ad` in `public/assets/ai-video.css`.
   - `:user-invalid` ARIA sync in `public/assets/site.js` and `<dialog class="studio-chat">` backdrop light-dismiss in `public/assets/studio-conversation.js`.

---

## 3. Next Major Project Before Launch: Ash (Studio26 AI Assistant)

Ruben confirmed that **Ash** is the next major milestone before launch:

- **Approved Identity & Master Portrait:**
  - Ruben approved the oxblood executive portrait (`C:\Users\ruben\Downloads\studio26\brand-kit\ash\v1\masters\ash-oxblood-approved-master-v1.png`).
  - Read `C:\Users\ruben\Downloads\studio26\brand-kit\ash\v1\brand-guide-v1.md` and `docs/creative/ash-brand-direction-v01.md`.
  - Local visual/widget study is in `C:\Users\ruben\Downloads\studio26\site\public\studies/ash/`.
- **Architecture & Knowledge Base:**
  - Read `docs/creative/ash-architecture-plan-v01.md` and `docs/content/assistant-knowledge-base.md` (already updated with approved USD pricing and Website + AI chatbot offerings).
- **Implementation Scope:**
  - Upgrade `<dialog class="studio-chat">` (`public/assets/studio-conversation.js` + Cloudflare Worker `/api/ash/*` or `/api/chat` in `src/index.js`) from the static conversation preview into **Ash**:
    1. Bilingual (EN/FR) studio Q&A grounded in `docs/content/assistant-knowledge-base.md`.
    2. Guided project brief capture (`Websites & AI chatbots`, `AI video ads & films`, or custom scope).
    3. Lead/enquiry persistence to D1 (`studio26-db`) + discovery call / email handoff.

---

## 4. Remaining Pre-Launch Checklist (After Ash Is Built)

1. **Optional Phase 2 Case Study Pages** (if Ruben chooses to add individual pages before or after launch for Arizen Africa, Mauritius Global Diaspora, mauRadio, AI Unit, NexTalent Africa, AWI Partners).
2. **Production Secrets & Email Binding:**
   - Production Turnstile widget sitekey & `TURNSTILE_SECRET` / `IP_SALT` via `wrangler secret put` (use Bash `printf '%s'` so PowerShell does not append a trailing newline).
   - Cloudflare Email Service binding (`NOTIFY` / `NOTIFY_TO` / `NOTIFY_FROM`) for lead alerts.
   - Optional Google Calendar appointment schedule link (`BOOKING_URL`).
3. **Cutover to `studio26.me`:**
   - Clean test rows from remote `studio26-db`.
   - Move `studio26.me` custom domain from the legacy Pages project to the `studio26-site` Worker and merge to `main`.
