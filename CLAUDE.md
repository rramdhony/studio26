# Studio26

Website for studio26.me, a boutique design studio in Mauritius selling distinctive
websites and AI video ads. Hand-written HTML/CSS/JS; no framework, no build step.

## Deployment

- **Type:** Cloudflare Worker with static assets (`wrangler.toml`, Worker name `studio26-site`).
  The `main` branch still runs the old Pages teaser until Phase 1 launches.
- **Pipeline:** push to `main` → GitHub Actions → `npx wrangler deploy`. QA runs locally first.
- **Live URL:** https://studio26.me (moves from the Pages project to the Worker at launch).

## Layout

- `public/` everything served to the browser: `index.html`, `privacy.html`, `assets/site.css`,
  `assets/site.js`, `assets/work/*` (WebP + JPEG captures of client sites), `_headers`
  (caching + security headers + CSP).
- `src/index.js` Worker: serves `public/`, plus `POST /api/enquiry` (validation, same-origin
  check, Turnstile, per-IP rate limit, D1 insert, optional email alert).
- `migrations/` D1 schema for `studio26-db` (`enquiries` table).
- `.dev.vars` local secrets (git-ignored): Turnstile test secret, IP salt.

Headers in `public/_headers` apply to static files only; set headers on `/api` responses in
`src/index.js`.

## Media

Videos live on **Cloudflare R2** (`studio26-assets`, public base
`https://pub-accaa99b083244a1a58f40dfa9cfaa9f.r2.dev/`), never in this repo:
- `studio26-hero.mp4` 1080×1350 silent 24s loop for the hero pane (rendered from the
  `studio26-reel` Remotion project, composition `ShowreelPane`).
- `studio26-teaser.mp4` / `studio26-teaser-mobile.mp4` full 42.4s reels with piano (old teaser).
Bump the `?v=` query in `assets/site.js` whenever an R2 file is replaced.

## Design rules

- Paper `#FAFAF8`, ink `#0C0C0C`, blue `#1A4BFF`. Cormorant Garamond italic for display,
  Plus Jakarta Sans for text, DM Mono only for URLs.
- One orchestrated motion moment (the hero opening); no scroll reveals on other sections.
- Content is never hidden by default behind JavaScript.
- Follow the Studio26 QA Standard: `npm run qa` must be green before pushing.

## Before launch (still placeholders)

- Prices (`data-price` spans), founder photo, booking URL (`BOOKING_URL` in `assets/site.js`).
- Production Turnstile sitekey in `index.html` and `TURNSTILE_SECRET` / `IP_SALT` as Worker secrets.
- Email alerts need studio26.me onboarded to Cloudflare Email Service, then a `send_email`
  binding named `NOTIFY` plus `NOTIFY_TO` / `NOTIFY_FROM` vars.
- Apply the D1 migration remotely: `npx wrangler d1 migrations apply studio26-db --remote`.
