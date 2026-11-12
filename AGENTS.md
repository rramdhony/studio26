# Studio26 - Agent & Project Guide (`AGENTS.md`)

> **Read `HANDOFF.md`, `CLAUDE.md`, and `docs/BUILD_STATUS.md` first.**
>
> All agents (Codex, Claude Code, Antigravity / Gemini 4 Argon) share the canonical Studio26 standards in `C:\Users\ruben\.claude\`:
> - `C:\Users\ruben\.claude\Studio26_QA_Standard.md`
> - `C:\Users\ruben\.claude\Studio26_Build_Deploy_Playbook.md`
> - `C:\Users\ruben\.claude\Studio26_Agent_Orchestration.md`

## Quick Reference (updated 12 November 2026)

- **Shared checkout:** never use `git add -A` or `git add .`; stage only the files you changed, and check `git status` for other agents' uncommitted work first (7 Nov 2026: a PR swept another agent's unreviewed edits into production).
- **Availability rules (12 Nov 2026, PR #8; details in `HANDOFF.md`):**
  - Keep `run_worker_first = ["/api/*", "/video/*"]`. Never set it to `true`: on the Workers free plan an exhausted daily quota then returns 429 for the whole site.
  - On public endpoints, check a rate-limit binding before any D1 query.
  - Never `COUNT(*)` over a time window per request: the D1 free tier fails every query, including enquiries, once the daily row quota is used.
  - Give each rate-limit binding a unique `namespace_id`.
1. **Production Live URL:** `https://studio26.me` (canonical apex). `https://www.studio26.me/*` 301-redirects to `https://studio26.me/*` via the Cloudflare Redirect Rule "Redirect www.studio26.me to studio26.me (301)" (studio26.me > Rules > Redirect Rules); `src/index.js` keeps a fallback for `/api/*`, `/video/*` and unmatched paths. `.workers.dev` preview subdomains are disabled (`workers_dev = false`).
2. **Synchronized Checkouts:** `C:\Users\ruben\Documents\GitHub\studio26` (canonical GitHub repo, deploys to production on every push to `main` once the CI `test` job passes: unit tests, HTML validation, wrangler dry-run; PRs run the same checks) and `C:\Users\ruben\Downloads\studio26\site`.
3. **Mandatory Backup Rule:** Create a git backup branch/tag or file snapshot in `C:\Users\ruben\Downloads\studio26\backups\<timestamp>` before editing any files.
4. **Live Pages & Surfaces:**
   - `/` (`public/index.html`) - Homepage with finite particle reveal into compact wordmark, Selected websites, Services, Process, Concept worlds, Inside the studio + Founder LinkedIn, Invitation footer, Contact dialog, and Ash assistant.
   - `/websites-ai-chatbots` (`public/websites-ai-chatbots.html`) - Dedicated commercial service guide covering custom websites, e-commerce/Shopify, logo & brand identity, custom web & iOS/Android mobile apps, 2-to-4-week website turnaround guide, 50% upfront / 50% on delivery payment terms, technical SEO scope, Ash architecture disclosure, Contact dialog, and Ash assistant.
   - `/ai-video` (`public/ai-video.html`) - AI Video Ads & Films page with vertical feed, showcase films, interactive aspect-ratio template, USD monthly retainers, 4-step process, FAQ, Contact dialog, and Ash assistant.
   - `/privacy` (`public/privacy.html`) - Mauritius Data Protection Act 2017 privacy notice, WCAG 2.1 Level AA accessibility statement, and website & creative terms.
   - `/llms.txt`, `/robots.txt`, `/sitemap.xml` - Search and AI discovery files with `@graph` JSON-LD (`Organization`, `WebSite`, `Service`, `WebPage`, `BreadcrumbList`, `Person`) and Open Graph / Twitter Card metadata (`studio26-complete-v1.webp`, `1536x1024`, `en_GB`).
5. **Ash Studio Assistant & Market Telemetry (Option A):**
   - `public/assets/ash-widget.js`, `public/assets/ash-widget.css`, `public/assets/catalogue.v1.json` - Bilingual (EN/FR) deterministic studio assistant (Tier-1 exact alias + Tier-2 natural-language intent classifier, prompt-injection & commitment safeguards, click-to-reveal email, and in-dialog project brief submission to `POST /api/enquiry`).
   - **Pseudonymised Question Logger (`POST /api/ash-question` -> D1 `ash_questions`):** Logs visitor questions with automatic email/phone redaction (`redactPii`), matched topic ID (`matched_id`), language (`en`/`fr`), source (`typed`/`topic`), page path, 2-letter Cloudflare edge country code (`country`), and salted `SHA-256` IP hash (`ip_hash`). Never stores raw IP addresses.
   - **Inspect live visitor questions:** `npm run ash:questions`
   - **Inspect live project enquiries:** `npm run ash:enquiries`
- `npm run site:stats` - Aggregated breakdown of pageviews and CTA clicks (`page_view`, `whatsapp_click`, `ash_open`, `contact_open`, `portfolio_click`, `linkedin_click`, `cta_click`) by country and unique visitor hash from D1 `site_events`.
- `npm run site:clicks` - Latest 50 visitor click and pageview events in real time.
- **First-Party Edge Click & Visitor Telemetry (`GET /api/event` -> D1 `site_events`):** gated by `EVENT_GATE` (20/min per visitor) and a 300/hour global cap; `/api/ash-question` by `ASH_GATE` (12/min) and 120/hour. Over-limit beacons are dropped quietly. `/websites-ai-chatbots` is tracked only from 12 Nov 2026.
  Every pageview and click is now logged automatically with the visitor's 2-letter Country Code (`MU`, `FR`, `GB`, `ZA`, etc.) and salted `SHA-256` visitor hash:
  - `page_view` (which page they visited, plus referrer domain or `direct`)
  - `whatsapp_click` (clicking the footer **Chat on WhatsApp** link)
  - `ash_open` (opening the **Ash** chatbot)
  - `contact_open` (opening the **Send us a message** modal)
  - `portfolio_click` (clicking any of the 6 client websites in `#work`)
  - `linkedin_click` (clicking your LinkedIn badge)
  - `cta_click` (clicking `/websites-ai-chatbots`, `/ai-video`, or header CTAs)
