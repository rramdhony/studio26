# Claude session log: 31 October 2026

Read this first when resuming. Written by Claude (Opus 5.5, Claude app, linked
to Ruben's laptop) while Codex was paused for its usage reset.

## Working locations (confirmed)

- Project root: C:\Users\ruben\Downloads\studio26
- Website repo: site\ (GitHub rramdhony/studio26, branch phase-1-site)
- Plan of record: ..\Studio26_Brand_Design_and_Launch_Plan.docx
  (v1.1 = Codex v1.0 plan, unchanged, plus Claude's Addendum A, pages 18 to 25:
  market research, competitors, launch and scale, web developer review).

## What Claude did

1. Checkpoint commit 74bd149 "Section 01: cinematic opening" on phase-1-site.
   Local only, not pushed. Working tree was clean after it.
2. Added REVIEW.md (repo root): the gate every section passes. Severity scale,
   verdict format, exact ask-claude.ps1 call (Opus 5.5, read-only, full diff).
   Created ..\tooling\review-input\ for diffs and prompts.
3. Added content drafts (not wired into the site):
   - docs/content/hero-copy-options.md
   - docs/content/assistant-knowledge-base.md (source for "Ask Studio26")
   - docs/dependency-register.md (licences and assets; keep it current)
4. Live check of http://127.0.0.1:3000/ at 375 (reduced motion), 390 and
   1440 px with Playwright: no horizontal scroll, zero console errors, zero
   failed requests, second opening frame correctly skipped under reduced
   motion, first-view transfer about 400 to 560 KB. Screenshots in
   ..\tooling\review-shots\ (script shot.cjs there; run with NODE_PATH set to
   site\node_modules).

## Fix before section 02 (from Claude's live check)

| Severity | Item |
|---|---|
| Must fix | H1 text content reads "A presenceworth feeling." Keep a space at the line break. |
| Should fix | Meta row wraps to 3 lines at 375 to 390 px. Hide one line or stack. |
| Should fix | Hard break after "business" in the intro paragraph strands a word at 390 px. |
| Should fix | At 375x667 the CTAs sit below the fold. Tighten hero spacing. |
| Should fix | Hero artwork is 1536 px; soft on retina desktop. Needs a 2880 px master. |
| Optional | From the Opus verification: derive userPaused from data-intro-state; guard .opening-project before focus(). |

## Needs Ruben's decision (do not change without it)

- Selected work: add Apricus Co Ltd (apricus-mu.com, carries a "Site by Studio26" credit). Approved by Ruben. Existing entries stay as they are.
- "From [price]" placeholders remain on both service cards.
- Palette: chrome/cobalt replaces the plan's vermilion. Confirm, then update
  the plan's colour tokens.
- Wordmark case: "studio26" vs "STUDIO26".
- WCAG gate level: 2.1 AA (QA Standard) or 2.2 AA (plan). REVIEW.md currently
  grades 2.2 additions as Should fix.
- Headline option (see docs/content/hero-copy-options.md).

## Process from now on

- One section per commit; review the committed diff via REVIEW.md.
- No push or deployment without Ruben's explicit go-ahead.
- Studio26 standards stay in C:\Users\ruben\.claude (not duplicated here).
## Update, 31 Oct evening: hero fixes done by Claude

The four hero items above are fixed (Ruben approved Claude doing them):

1. H1 now reads "A presence worth feeling." (space kept at the line break).
2. Mobile (700 px and below): meta row shows only "Independent design &
   motion studio"; the location line is hidden on mobile.
3. Intro paragraph: the line break is kept on desktop and hidden on mobile,
   so words wrap naturally.
4. Mobile hero tightened (heading margin 38 to 24 px, subline margin 24 to
   16 px, stage aspect ratio 1.65 to 2). "Start a project" is now above the
   fold at 375x667, 390x844 and 430x932.

QA harness: the breakpoint screenshot test was flaky (a lazy founder image
sometimes not loaded at 375 px). settle() in .github/qa/qa.spec.js now
switches lazy images to eager before scrolling. Repeated runs pass.

Results: full suite 53 passed; html-validate clean; no horizontal scroll and
zero console errors at 375, 390, 430, 768 and 1440 px.

Still open: the 2880 px hero master and the two optional hardening items.
Observation, not changed: at 1440x900 the hero CTAs sit just below the fold
(CTA bottom at about 973 px); this was already the case before these fixes.