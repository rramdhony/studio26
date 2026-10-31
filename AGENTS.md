# Studio26

Pre-launch teaser page for studio26.me. Full-viewport autoplaying video with
minimal branding overlay. Piano audio, user-unmutable via speaker toggle.

## Deployment

- **Type:** Cloudflare Pages (project name: `studio26`)
- **Live URL:** https://studio26.me
- **Pipeline:** push to `main` → GitHub Actions → `wrangler pages deploy` → live in ~60s

## Architecture

Single `index.html` file. No build step, no frameworks, no npm.

### Video

Videos are hosted on **Cloudflare R2** — not in this repo.
- **Bucket:** `studio26-assets`
- **Public base URL:** `https://pub-accaa99b083244a1a58f40dfa9cfaa9f.r2.dev/`
- `studio26-teaser.mp4` — 16:9 landscape, served to desktop (≥ 768px)
- `studio26-teaser-mobile.mp4` — 9:16 portrait, served to mobile (< 768px)

To swap a video: upload the new file to R2 via Wrangler or the Cloudflare dashboard.
The HTML references R2 URLs directly — no code change needed if the filename stays the same.

### Video switching

Inline JS at page load checks `window.matchMedia('(max-width: 767px)')` and sets
the video `src` before buffering starts. No flicker, no framework needed.

### Key CSS rules

- `object-fit: cover` on the video — fills the viewport at any aspect ratio
- All font sizes and margins use `clamp()` — no separate breakpoints needed
- Tagline is `left: 50%; transform: translateX(-50%)` on desktop, left-aligned
  at `24px` on mobile (media query) to prevent right-edge clipping

### Fonts

- **Cormorant Garamond** (logo + tagline) — loaded from Google Fonts
- **DM Mono** (footer) — loaded from Google Fonts

### Animations

CSS only. Logo fades in at 0.8s, tagline at 1.4s, footer + sound button at 2s.

## What to avoid

- Do not add the video files to this repo — they are large and live on R2
- Do not add npm/node_modules — this is intentionally zero-dependency
- Keep `index.html` under 10KB
