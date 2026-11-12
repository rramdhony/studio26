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

- **Runtime:** Cloudflare Worker with static assets (`wrangler.toml`, Worker name `studio26-site`, `workers_dev = false`, `run_worker_first = ["/api/*", "/video/*"]`) + D1 database (`studio26-db`) + rate-limit bindings `ENQUIRY_GATE`, `EVENT_GATE`, `ASH_GATE`. Pages and assets are served without invoking the Worker; never set `run_worker_first = true` again (on the free plan an exhausted daily Worker quota then returns 429 for the whole site; see HANDOFF.md, 12 Nov 2026).
- **Production URL:** `https://studio26.me` (canonical apex). `https://www.studio26.me/*` returns a 301 to `https://studio26.me/*` from the Cloudflare Redirect Rule "Redirect www.studio26.me to studio26.me (301)" (studio26.me > Rules > Redirect Rules); `src/index.js` keeps a fallback for `/api/*`, `/video/*` and unmatched paths. Every push to `main` deploys to production via GitHub Actions, but only after the CI `test` job passes (unit tests, HTML validation, wrangler dry-run). PRs run the same checks.
- **Synchronized Checkouts:** `C:\Users\ruben\Documents\GitHub\studio26` (canonical GitHub repo) and `C:\Users\ruben\Downloads\studio26\site`. Always create a restorable backup before editing files.

## 3. Codebase Architecture

- `public/index.html` - Homepage (Sections 01-10: Finite particle reveal into compact wordmark, Selected websites, Websites & AI chatbots / AI video ads & films services, Process, Concept worlds showcase, Inside the studio + Founder LinkedIn, Invitation footer, Contact dialog, and Ash assistant).
- `public/websites-ai-chatbots.html` - Dedicated commercial service guide for websites, AI chatbots, e-commerce, brand identity, web/mobile apps, delivery timelines, 50/50 payment terms, technical SEO scope, and Ash assistant.
- `public/ai-video.html` - AI Video Ads & Films page (Hero vertical feed, 3 showcase films, interactive live template in 9:16 / 4:5 / 16:9, USD monthly plans, 4-step process, FAQ, Contact dialog, and Ash assistant).
- `public/concepts/*.html` - Interactive concept pages (`/concepts/island`, `/concepts/architecture`, `/concepts/product`).
- `public/privacy.html` - Privacy Notice (Mauritius Data Protection Act 2017), WCAG 2.1 Level AA Accessibility Statement (`#accessibility`), and Website & Creative Terms (`#terms`).
- `public/llms.txt`, `public/robots.txt`, `public/sitemap.xml` - AI search (GEO) and crawler discovery files.
- `src/index.js` - Cloudflare Worker handling the fallback `www` -> apex 301, `POST /api/enquiry` (contact form + Ash project briefs stored in D1 `enquiries` and emailed via Cloudflare Email Routing), `POST /api/ash-question` (pseudonymised market-demand question telemetry stored in D1 `ash_questions` with `country`, salted `SHA-256` `ip_hash`, and PII redaction), `GET /api/event` (page-view and click telemetry in D1 `site_events`), and `/video/*` HTTP 206 Range streaming. Both telemetry endpoints check a per-visitor rate-limit binding before any D1 query and cap inserts per hour without `COUNT(*)`, so a flood cannot spend the D1 daily quota that `/api/enquiry` depends on. Keep it that way: no `COUNT(*)` over a time window on a public request path.
- `.github/workflows/deploy.yml` - CI: `test` job (`npm ci --ignore-scripts`, `npm run test:ash`, `npm run qa:html`, `npx wrangler deploy --dry-run`) on every PR and push to `main`; `deploy` job (`npx wrangler deploy`) runs on `main` only after `test` passes. Actions pinned to commit SHAs.
- `migrations/0001_enquiries.sql` through `migrations/0005_site_events.sql` - D1 schema migrations for `enquiries`, `ash_questions` and `site_events`.
- `public/assets/ash-widget.js`, `ash-widget.css`, `catalogue.v1.json` - Ash studio assistant (bilingual EN/FR Q&A, Tier-1 alias + Tier-2 intent classifier, pseudonymised question telemetry to `/api/ash-question`, click-to-reveal address protection, and in-dialog project brief submission to `/api/enquiry`).
- `.github/qa/ash-matcher.test.mjs`, `.github/qa/seo.spec.js`, `.github/qa/qa.spec.js` - Unit, SEO/discovery, and 3-pillar Playwright + `axe-core` QA suites.

## 4. QA & Operational Commands

- **Shared checkout:** never use `git add -A` or `git add .`; stage only the files you changed, and check `git status` for other agents' uncommitted work first (7 Nov 2026: a PR swept another agent's unreviewed edits into production).
- `npm run test:ash` - Runs the 244 Node unit tests covering Ash catalogue validation, bilingual intent matching, exclusions, prompt-injection/commitment safeguards, price synchronization (`B7`), `www` 301 redirect hardening, `/api/ash-question` and `/api/event` telemetry, and availability guards (rate limits before D1, the hourly cap against real SQLite, `run_worker_first` scope, unique rate-limit namespaces, `site.js` on every public page, deploy gated on tests). Runs in CI before every deploy.
- `npm run qa:html` - Runs `html-validate` across `public/index.html`, `public/ai-video.html`, `public/privacy.html`, and `public/websites-ai-chatbots.html`.
- `npm run qa` - Runs unit tests + full Playwright 3-pillar QA suite.
- `npm run ash:questions` - Queries the latest 50 pseudonymised visitor questions from remote D1 (`ash_questions`) with timestamp, country code, 8-char visitor hash prefix, language, page, matched topic ID, and redacted question.
- `npm run ash:enquiries` - Queries the latest 20 submitted project briefs/enquiries from remote D1 (`enquiries`).
- `npm run site:stats` - Aggregated breakdown of pageviews and CTA clicks (`page_view`, `whatsapp_click`, `ash_open`, `contact_open`, `portfolio_click`, `linkedin_click`, `cta_click`) by country and unique visitor hash from D1 `site_events`.
- `npm run site:clicks` - Latest 50 visitor click and pageview events in real time.
- **First-Party Edge Click & Visitor Telemetry (`GET /api/event` -> D1 `site_events`):**
  Every pageview and click is now logged automatically with the visitor's 2-letter Country Code (`MU`, `FR`, `GB`, `ZA`, etc.) and salted `SHA-256` visitor hash:
  - `page_view` (which page they visited, plus referrer domain or `direct`)
  - `whatsapp_click` (clicking the footer **Chat on WhatsApp** link)
  - `ash_open` (opening the **Ash** chatbot)
  - `contact_open` (opening the **Send us a message** modal)
  - `portfolio_click` (clicking any of the 6 client websites in `#work`)
  - `linkedin_click` (clicking your LinkedIn badge)
  - `cta_click` (clicking `/websites-ai-chatbots`, `/ai-video`, or header CTAs)
