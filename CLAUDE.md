# Studio26 - Agent & Project Guide (`CLAUDE.md` / `AGENTS.md`)

> **First step for every session:** Read `HANDOFF.md` and `docs/BUILD_STATUS.md` for the latest unified status across Claude Code, Codex, and Antigravity (Gemini 4 Argon).
>
> **Mandatory Studio26 Standards:** Always follow `C:\Users\ruben\.claude\Studio26_QA_Standard.md`, `C:\Users\ruben\.claude\Studio26_Build_Deploy_Playbook.md`, and `C:\Users\ruben\.claude\Studio26_Agent_Orchestration.md`. Always create a backup branch or file snapshot in `C:\Users\ruben\Downloads\studio26\backups\<timestamp>` before modifying files.

## 1. Overview & Commercial Terms

Website for **Studio26** (`https://studio26.me`), a boutique design, development, and AI motion studio in Mauritius led by founder **Ruben Ramdhony** (https://www.linkedin.com/in/rubenramdhony/).
Core commercial offerings & published terms (`PUBLISHED_PRICES` in `public/assets/ash-widget.js`):
- **Websites & AI chatbots:** Custom websites from `$2,500`; websites with a dedicated AI assistant from `$4,000` (`$95/month` for Cloudflare hosting, content updates, and up to 1,000 visitor chats). Standalone AI assistant for an existing website quoted on discovery.
- **Full-service digital scope:** E-commerce & Shopify builds, logo & brand identity systems, and custom web & mobile apps (iOS and Android), scoped and quoted per project on discovery.
- **AI video ads & films:** One-off ads from `$450`; monthly plans at `$750/mo` (Starter), `$1,350/mo` (Growth), and `$2,400/mo` (Always on).
- **Turnaround & payment terms:** Standard website guide is 2 to 4 weeks from brief to launch; standard first AI video ad turnaround is 5 to 7 working days from brief; payment terms are 50% upfront deposit to start and 50% upon final delivery before launch (USD, with MUR invoicing available on request).

## 2. Deployment & Worktrees

- **Runtime:** Cloudflare Worker with static assets (`wrangler.toml`, Worker name `studio26-site`, `workers_dev = false`, `run_worker_first = true`) + D1 database (`studio26-db`).
- **Production URL:** `https://studio26.me` (canonical apex). `https://www.studio26.me/*` returns a safe 301 redirect to `https://studio26.me/*` via `src/index.js`. Every push to `main` deploys to production via GitHub Actions.
- **Synchronized Checkouts:** `C:\Users\ruben\Documents\GitHub\studio26` (canonical GitHub repo) and `C:\Users\ruben\Downloads\studio26\site`. Always create a restorable backup before editing files.

## 3. Codebase Architecture

- `public/index.html` - Homepage (Sections 01-10: Finite particle reveal into compact wordmark, Selected websites, Websites & AI chatbots / AI video ads & films services, Process, Concept worlds showcase, Inside the studio + Founder LinkedIn, Invitation footer, Contact dialog, and Ash assistant).
- `public/websites-ai-chatbots.html` - Dedicated commercial service guide for websites, AI chatbots, e-commerce, brand identity, web/mobile apps, delivery timelines, 50/50 payment terms, technical SEO scope, and Ash assistant.
- `public/ai-video.html` - AI Video Ads & Films page (Hero vertical feed, 3 showcase films, interactive live template in 9:16 / 4:5 / 16:9, USD monthly plans, 4-step process, FAQ, Contact dialog, and Ash assistant).
- `public/concepts/*.html` - Interactive concept pages (`/concepts/island`, `/concepts/architecture`, `/concepts/product`).
- `public/privacy.html` - Privacy Notice (Mauritius Data Protection Act 2017), WCAG 2.1 Level AA Accessibility Statement (`#accessibility`), and Website & Creative Terms (`#terms`).
- `public/llms.txt`, `public/robots.txt`, `public/sitemap.xml` - AI search (GEO) and crawler discovery files.
- `src/index.js` - Cloudflare Worker handling canonical `www` -> apex 301 redirects, `POST /api/enquiry` (contact form + Ash project briefs stored in D1 `enquiries` and emailed via Cloudflare Email Routing), `POST /api/ash-question` (anonymous market-demand question telemetry stored in D1 `ash_questions` with `country`, salted `SHA-256` `ip_hash`, and PII redaction), and `/video/*` HTTP 206 Range streaming.
- `migrations/0001_enquiries.sql` through `migrations/0004_ash_questions.sql` - D1 schema migrations for `enquiries` and `ash_questions`.
- `public/assets/ash-widget.js`, `ash-widget.css`, `catalogue.v1.json` - Ash studio assistant (bilingual EN/FR Q&A, Tier-1 alias + Tier-2 intent classifier, anonymous question telemetry to `/api/ash-question`, click-to-reveal address protection, and in-dialog project brief submission to `/api/enquiry`).
- `.github/qa/ash-matcher.test.mjs`, `.github/qa/seo.spec.js`, `.github/qa/qa.spec.js` - Unit, SEO/discovery, and 3-pillar Playwright + `axe-core` QA suites.

## 4. QA & Operational Commands

- `npm run test:ash` - Runs the 231+ Node unit tests covering Ash catalogue validation, bilingual intent matching, exclusions, prompt-injection/commitment safeguards, price synchronization (`B7`), `www` 301 redirect hardening, and `/api/ash-question` telemetry.
- `npm run qa:html` - Runs `html-validate` across `public/index.html`, `public/ai-video.html`, `public/privacy.html`, and `public/websites-ai-chatbots.html`.
- `npm run qa` - Runs unit tests + full Playwright 3-pillar QA suite.
- `npm run ash:questions` - Queries the latest 50 anonymous visitor questions from remote D1 (`ash_questions`) with timestamp, country code, 8-char visitor hash prefix, language, page, matched topic ID, and redacted question.
- `npm run ash:enquiries` - Queries the latest 20 submitted project briefs/enquiries from remote D1 (`enquiries`).
- `npm run site:stats` - Aggregated breakdown of pageviews and CTA clicks (`page_view`, `whatsapp_click`, `ash_open`, `contact_open`, `portfolio_click`, `linkedin_click`, `cta_click`) by country and unique visitor hash from D1 `site_events`.
- `npm run site:clicks` - Latest 50 visitor click and pageview events in real time.
