# AI video page: build plan and design spec v1

Branch ai-video-rethink (worktree site-ai-video), merged with phase-1-site at 1ff4b88.
Route /ai-video. Builds on ai-video-direction.md. Each section ships alone, passes the
REVIEW.md Opus gate and QA, then waits for Ruben's approval before the next one.

## Identity (inherited from the approved homepage)

- Body classes `studio-home ai-video`, so tokens, header, footer and focus styles match.
- Type: Syne (display, headlines), Instrument Sans (body, UI).
- Colour: paper #e8e6e2, ink #171a1c, slate #475c89, navy #273449, mid #505459.
- Gradients: peach #f6cbb0 to blush #f0d9d0 to paper (hero); periwinkle #b8c8f3 to
  lavender #d5d4ed to blush (secondary band). Film sections sit on ink #171a1c so the
  footage reads like a screening room.
- Motion: GSAP 3.15 core plus ScrollTrigger (vendored). Native scroll, short pins only.
  prefers-reduced-motion gets final states and no pins.

## Media rules

- Phone loops: 9:16, 720x1280, 8 s, muted, H.264 CRF 27, about 0.8 MB, WebP poster.
- Breakout loops: 16:9, 1280x720, 8 s, muted.
- Films with sound: 1080p masters, opened in a dialog with native controls, never autoplay.
- preload="none" with posters; play only when in view; pause control on all motion.
- Dev copies live in public/video (gitignored). Production goes to the R2 bucket after
  Ruben's go-ahead.
- Every spot labelled "Concept work, invented brand".

## Sections

| # | Section | Design | Interaction | Reduced motion / no JS |
|---|---|---|---|---|
| 1 | Hero: the feed | Peach gradient. Left: eyebrow "AI video ads", Syne headline "Ads that stop the scroll.", sub, two actions. Right: a phone playing the Maison Filaos 9:16 loop with minimal feed chrome. | Pinned about 2.5 screens. Scroll moves the phone feed; at each ad the screen breaks out to full-bleed 16:9 cinema (clip-path from the phone screen to the viewport) with a title card and "Watch with sound". Ads: Maison Filaos, Kestrel, then Pointe aux Feuilles and Ile Noire when cut. | Static hero plus a grid of spot posters with "Watch" buttons |
| 2 | See the layers | Ink band. One frame of Maison Filaos split by a draggable wipe. | Four labelled stops: Generated (raw Flow clip), Cut (edit and pacing), Typeset (brand type), Delivered (studio26 finish). Range input, keyboard operable, scroll nudges it. | Four still frames in a row with captions |
| 3 | One ad, every screen | Periwinkle band. A single frame that changes shape. | Toggle 9:16, 4:5, 16:9: the frame morphs and swaps to the matching Kestrel render. | Three frames side by side |
| 4 | Type your offer, see it as an ad | Paper. Live preview over a looping clip. | Visitor types business and offer; brand type sets it over the clip; three colour presets. "Get this made" carries the text to the enquiry form. Under 40 KB JS. | Example frame with sample text |
| 5 | The offer | Paper. What you get, four-step process, price. | Optional estimator: ads x formats x versions gives a "from" price (needs Ruben's prices). | Same, static |
| 6 | Call to action | Navy band. "Have an offer worth stopping for?" | Start a project (to /#contact) and email. | Same |

## Open decisions for Ruben

1. Headline: A "Ads that stop the scroll." (default), B "Made for the half-second.", C "Stop. Watch. Book."
2. Prices for section 5: per ad, extra format, extra version, turnaround.
3. Music: library pick or a track you supply.
4. R2 upload of the web encodes before the first preview deploy.

## Budgets

First view under 1.5 MB including the first loop. Page JS under 200 KB gzip.
Lighthouse mobile performance 90+, accessibility 100. axe: no violations.
