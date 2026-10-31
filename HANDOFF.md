# Studio26 site: handoff and next steps

Written 2026-10-25 when Codex took over from Claude Code. Branch: `phase-1-site`.
Preview: https://studio26-site.ruben-ramdhony.workers.dev (Worker `studio26-site`).
studio26.me still serves the old teaser from `main`.

## Ground rules (decided by Ruben)

- Nothing goes to `main` until Phases 1, 3 and 2 are all built and tested on `phase-1-site`.
  Pushing `main` deploys to studio26.me via GitHub Actions (`npx wrangler deploy`).
- Phase order: 1 (site) → 3 (AI video ads) → 2 (portfolio case studies) → launch → chatbot.
- `npm run qa` must be green before every push. The suite covers `/`, `/ai-video` and `/privacy`
  (45 checks at the time of writing).
- Studio26 is a boutique, high-end studio: premium craft over speed or file size, no templated
  "dark SaaS" look, one orchestrated motion moment per page, nothing hidden behind JavaScript.

## Where things stand

| Phase | State |
|---|---|
| 1. Site (home, enquiry form, privacy) | Built, on the preview. Codex's Phase 1 review addressed in commit `f63ae2e`. |
| 3. AI video ads (`/ai-video`) | Built. Codex's Phase 3 review fixes done locally but **not committed** (see below). |
| 2. Portfolio case studies | Not started. Decisions below. |
| Chatbot | Spec agreed; build after launch. |

## Uncommitted work to finish now

In this repo, on `phase-1-site`:

- `public/ai-video.html`, `public/assets/site.js` (demo URL `ad-demo.js?v=6`),
  `public/assets/site.css`, `public/assets/ad-demo.js` (rebuilt), `.github/qa/qa.spec.js`,
  `CLAUDE.md`.
- What they contain:
  - "Try it with your business": the live demo builds its ad only from the visitor's name, what
    they do and their offer, in one of three styles. Concept-brand copy and motifs can't leak.
  - The demo updates live; the "Update preview" button is gone.
  - Sample ads start on posters, play one at a time, and pause when scrolled away.
  - Reduced-motion play/pause state fixed; the player starts explicitly muted.
  - New QA tests for the samples, the demo (no concept-brand copy in any style), seeking,
    format switching and reduced motion.

To finish: `npm run qa` (expect 45 passed), commit, `npx wrangler deploy` for the preview, then
`git push origin phase-1-site`. Do not merge to `main`.

The reel and ads source is already committed and pushed: private repo
`rramdhony/studio26-reel`, commit `84a4c3e` (style/script split, demo rewrite, relative build
paths, pinned Remotion 4.0.538).

## Phase 2: portfolio case studies (next phase)

What we decided:

- One case-study page per site, linked from the home page's work grid:
  Arizen Africa, Mauritius Global Diaspora, mauRadio, AI Unit, NexTalent Africa, AWI Partners.
- Each page: the brief, the design idea, key screens on desktop and mobile, and the outcome.
- Same design system as the rest of the site; each case study can wear its client's colours,
  as the work cards and the reel already do.
- Screens come from the existing 2× captures in `studio26-reel/public/screens/` (re-capture with
  `npm run capture` there if a site has changed; new image files need new `?v=` values).
- Add the new pages to the QA suite's "other pages" loop.

Needed from Ruben before writing:

- For each project, two or three lines: what the client wanted, what changed, and a quote if the
  client will give one.
- A yes or no on naming AI Unit (a government client) on the site.

## Inputs still needed before launch

- "From" prices for websites and AI video ads, and the currency (MUR, USD or EUR).
- Founder photo (portrait, shown at 4:5) and approval of the drafted founder note.
- Google Calendar booking link (Create → Appointment schedule, "Discovery call, 30 min"),
  set as `BOOKING_URL` in `public/assets/site.js`.
- AI video turnaround time (the `[turnaround]` placeholder in the FAQ).
- Review of the draft privacy page, including the suggested 12-month retention.
- Veo clips for the hotel and street-food concept ads, generated in Google Flow and saved as
  `hotel-1..3.mp4` and `street-1..3.mp4` in `studio26-reel/public/footage/`.
- Confirmation that Studio26 is within Remotion's free licence (for-profit, up to 3 employees),
  and a check of Google's terms for using Veo output in commercial ads, before publishing footage.

## Launch steps (after Phase 2)

1. Fill every placeholder above; re-run QA.
2. Create a production Turnstile widget for studio26.me; put its sitekey in `public/index.html`
   and set `TURNSTILE_SECRET` with `wrangler secret put`.
3. Onboard studio26.me to Cloudflare Email Service, add a `send_email` binding named `NOTIFY` and
   `NOTIFY_TO` / `NOTIFY_FROM` vars, so new enquiries email Ruben.
4. Delete the "QA Test (preview, safe to delete)" row from the remote `studio26-db`.
5. Move studio26.me from the old Pages project to the `studio26-site` Worker.
6. Merge `phase-1-site` to `main`, then verify the live site.

## Chatbot (after launch)

Agreed spec, kept in Claude's project memory: a DIVA-style sales assistant on Claude Haiku 5.5
behind a Cloudflare Worker at `/api/chat`, with D1 for leads, English and French, free
discovery-call booking via the Google booking page, a "Continue on WhatsApp" link, email alerts,
"projects start at…" pricing, and a little illustrated avatar of a Mauritian girl (Ruben to source).

## Gotchas

- Set Worker secrets from Bash with `printf '%s' value | npx wrangler secret put NAME`.
  PowerShell piping adds a newline that silently breaks the secret.
- Local `wrangler dev` only supports compatibility dates up to 2026-05-25 (set in `wrangler.toml`).
- `public/assets/ad-demo.js` is a build output of `studio26-reel`; rebuild it there with
  `npm run build:demo` and bump `ad-demo.js?v=` in `site.js`. Never edit it by hand.
- Images are cached for a year as immutable: never replace one in place, bump its `?v=`.
- With JavaScript disabled, Playwright's click stability check never resolves; submit by
  focusing the button and pressing Enter (as the no-JS test does).
