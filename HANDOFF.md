# Studio26 — Handoff & Unified Status (All LLM Agents)

> **Last updated:** 2 November 2026 (late evening) by Antigravity (Gemini 4 Argon) after full review, Phase 1+3 unification, legal/privacy rebuild, USD pricing, SEO/GEO upgrade, button/navigation polish, and preview deployment.

## 0. Update, 4 November 2026 (Claude): production is now live from `main`

This section overrides anything below that says production serves the teaser or that `main` must not be deployed.

- **studio26.me and www.studio26.me now serve the new site.** `wrangler.toml` routes both to the `studio26-site` Worker, and Ruben approved the launch. A `www` DNS record (proxied) was added on 4 Nov. Pushing to `main` deploys to production through GitHub Actions, so treat every push to `main` as a live release.
- **Contact form replaces the published email address.** All `mailto:` links and the JSON-LD email were removed. Buttons with `data-contact` open a dialog form (`public/assets/contact-form.js` and `.css`) that posts to `/api/enquiry`. Do not reintroduce `hello@studio26.me` in page source; the dialog reveals it only on request.
- **Spam protection:** Cloudflare Turnstile (widget "Studio26 contact form", site key in each page's script tag, `appearance: interaction-only`), a honeypot field `hp_field`, a same-origin check, and a salted IP-hash limit of 5 per hour.
- **Alerts:** each enquiry is stored in D1 (`studio26-db`, table `enquiries`) and emailed from `enquiries@studio26.me` to Ruben's Gmail through the `NOTIFY` send_email binding, with Reply-To set to the visitor. Verified live on 4 Nov (SPF, DKIM and DMARC all pass).
- **Secrets on the Worker:** `IP_SALT`, `TURNSTILE_SECRET`, `NOTIFY_TO`. Never print or commit them. Local testing uses `.dev.vars` (gitignored) with Cloudflare's test keys.
- **DMARC** is published (`p=none`, reports to Cloudflare DMARC Management). Email Routing forwards `hello@studio26.me` to Ruben; the catch-all is off.
- **QA:** `.github/qa/qa.spec.js` has a "Contact form dialog" block; the success test stubs Turnstile. `public/privacy.html` section 2 describes the form, D1, Email Routing and Turnstile; keep it in step with any change to what the form collects.
- **Known issue:** the GitHub Actions deploy uploads the Worker but then fails on routes ("No access to the specified resource") because the `CLOUDFLARE_API_TOKEN` secret lacks Zone > Workers Routes: Edit on studio26.me. Fix: Ruben adds that permission to the token in Cloudflare. Until then the failure email is expected, and the code itself still deploys.
- **Before working:** `git pull --ff-only origin main` in this folder. Latest commit at time of writing: `4a107ac`.

---

## 1. Where Everything Lives & Current Live Preview

- **Live Preview URL:** https://studio26-site.ruben-ramdhony.workers.dev/ (Cloudflare Worker `studio26-site`, Current Version ID: `a33185de-66f0-4ae7-b31c-ffcda8ed2396`).
- **Production (`studio26.me`):** Still serves the legacy teaser from `main`. **Never merge or deploy to `main`** until Ruben explicitly signs off on launch.
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
