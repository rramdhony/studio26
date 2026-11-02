# Studio26 — Agent & Project Guide (`CLAUDE.md` / `AGENTS.md`)

> **First step for every session:** Read `HANDOFF.md` and `docs/BUILD_STATUS.md` for the latest unified status across Claude Code, Codex, and Antigravity (Gemini 4 Argon).
>
> **Mandatory Studio26 Standards:** Always follow `C:\Users\ruben\.claude\Studio26_QA_Standard.md`, `C:\Users\ruben\.claude\Studio26_Build_Deploy_Playbook.md`, and `C:\Users\ruben\.claude\Studio26_Agent_Orchestration.md`. Always create a backup branch or file snapshot in `C:\Users\ruben\Downloads\studio26\backups\<timestamp>` before modifying files.

## 1. Overview

Website for **Studio26** (`studio26.me`), a boutique design, development, and AI motion studio in Mauritius led by founder **Ruben Ramdhony** (https://www.linkedin.com/in/rubenramdhony/).
Core commercial offerings:
- **Websites & AI chatbots:** Custom websites from `$2,500`; websites with a dedicated AI assistant from `$4,000` (`$95/month` for hosting, content updates, and up to 1,000 visitor chats).
- **AI video ads & films:** One-off ads from `$450`; monthly plans at `$750/mo` (Starter), `$1,350/mo` (Growth), and `$2,400/mo` (Always on).

## 2. Deployment & Worktrees

- **Runtime:** Cloudflare Worker with static assets (`wrangler.toml`, Worker name `studio26-site`) + D1 database (`studio26-db`).
- **Live Preview URL:** https://studio26-site.ruben-ramdhony.workers.dev/ (Version `c88b15f7-8922-4796-aa6b-77dd9df6e97a`).
- **Production URL:** https://studio26.me (still serves the legacy teaser from `main` until final launch cutover—do **not** push or merge to `main` without Ruben's explicit approval).
- **Primary Deploy Worktree:** `C:\Users\ruben\Downloads\studio26\site-ai-video` (contains the gitignored `public/video/` MP4/WebP media required for `/ai-video`). Keep `C:\Users\ruben\Downloads\studio26\site` and `C:\Users\ruben\Documents\GitHub\studio26` synced.

## 3. Codebase Architecture

- `public/index.html` — Homepage (Sections 01–10: Opening, Selected websites, Websites & AI chatbots / AI video ads & films services, Process, Concept worlds showcase, Inside the studio + Founder LinkedIn, Invitation footer + `<dialog class="studio-chat">`).
- `public/ai-video.html` — AI Video Ads & Films page (Hero vertical feed, 3 showcase films including Maison Filaos, Kestrel, and Ancient Egypt Chronicles trailer, interactive "Picture your brand in it" live template in 9:16 / 4:5 / 16:9, USD monthly plans, 4-step process, FAQ).
- `public/concepts/*.html` — Full interactive concept pages (`/concepts/island`, `/concepts/architecture`, `/concepts/product`).
- `public/privacy.html` — Privacy Notice (Mauritius Data Protection Act 2017), WCAG 2.1 Level AA Accessibility Statement (`#accessibility`), and Website & Creative Terms (`#terms`).
- `public/llms.txt`, `public/robots.txt`, `public/sitemap.xml` — AI search (GEO) and crawler discovery files.
- `public/assets/studio-home.css` & `public/assets/ai-video.css` — Canonical design system styles (Instrument Sans 400–700 + Syne 500–600 self-hosted WOFF2, warm paper `#e8e6e2`, ink `#171a1c` / `#253047`, studio blue `#475c89`, brushed-chrome and deep-cobalt gradient CTAs).
- `src/index.js` — Cloudflare Worker handling static assets and `/api/enquiry` (and upcoming `/api/ash/*` endpoints for the **Ash** AI assistant).
- `.github/qa/qa.spec.js` & `.github/qa/playwright.config.js` — Playwright + `axe-core` + `html-validate` QA harness (`BASE_URL` env override supported).

## 4. QA & Technical Guardrails

- Run `npx html-validate --config .github/qa/.htmlvalidate.json public/index.html public/ai-video.html public/privacy.html` and Playwright QA (`npm run qa`) before any preview deployment.
- **No infinite CSS `@keyframes` on `/`:** Playwright's `settle()` helper waits for `document.getAnimations().every(a => a.playState !== 'running')`. Use hover/pointer transitions or bounded animations with `prefers-reduced-motion` support.
- **Header single-line rule at desktop (`1024px`, `1280px`, `1440px`):** Every `.site-head a:not(.header-brand)` must stay `<= 52px` tall with zero horizontal overflow.
- **Tap targets & font sizes:** All interactive controls must be `>= 44x44px` on mobile (`375px`) and all visible text `>= 14px`.
