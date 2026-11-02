# Studio26 live preview review before Ash

3 November 2026 | Verdict: fixes required before launch clearance

## Scope and source

Reviewed the published [homepage](https://studio26-site.ruben-ramdhony.workers.dev/), [AI video page](https://studio26-site.ruben-ramdhony.workers.dev/ai-video) and [Privacy & Legal](https://studio26-site.ruben-ramdhony.workers.dev/privacy). Ash implementation is paused. No application source changes, data submissions, database writes, merges or deployments were performed. Candidate CSS was injected only into a disposable browser session.

The deployment is newer than the committed handoff. Prices and video terms are populated. All downloaded same-origin CSS/JS assets matched the uncommitted files in `C:/Users/ruben/Downloads/studio26/site-ai-video`, whose HEAD is 7b4f4f8. These assets stayed byte-identical through final verification. The committed HEAD alone does not represent the deployed changes. The phase-1-site HEAD remains 9dbeea2. During this review another agent synchronized additional uncommitted changes and updated AGENTS.md/HANDOFF.md across the checkouts. The new handoff identifies the primary deployment worktree as site-ai-video and reports preview version c88b15f7-8922-4796-aa6b-77dd9df6e97a. That control-plane version is reported by the handoff; the browser/source evidence here is independently captured. Its QA-complete statements do not supersede the reproduced findings below. Reconcile and commit a combined release candidate before production.

Exact live HTML/CSS/JS, screenshots and JSON test evidence are saved alongside this report. The evidence folder is named 20261102 because work started before midnight; the review continued on 3 November in Asia/Dubai.

## Assessment

The design holds together. The homepage, film page and closing identity present one studio. Full cinema states were inspected, including readable Maison/Kestrel titles and correctly enabled controls. Concept work is labelled; Egypt adds a different kind of film. No broad redesign is recommended. Release issues are concentrated in video delivery/player behaviour and the legal page.

## Findings

| ID | Severity | Evidence | Finding | Recommended fix |
| --- | --- | --- | --- | --- |
| R1 | Must fix | final-resource-verification.json; chrome-media-check.json; accessibility-review.json | All three film endpoints ignore `Range: bytes=0-1023`, returning 200 with whole-file lengths and no Content-Range. Egypt plays in installed Chrome, but reports seekable 0 to 0; seeking to 15 seconds resets it to the beginning. | Use range-capable media hosting, such as the existing R2 service, or implement a correct range route. Verify 206/Content-Range and forward/backward seeking on all films. |
| R2 | Must fix | Captured privacy.html:290 and :298 | Rights are incorrectly labelled Part VI. Section 42 is incorrectly cited as the complaint provision. These undermine a page presenting precise legal governance. | Correct statutory references against the official Act. Rights are in Part VII; section 42 concerns unlawful disclosure. Section 6 covers complaint investigation. Recheck the remaining references. |
| R3 | Must fix | privacy-overflow-detail.json; privacy-candidate-fix.json | Privacy expands to 357px in a 320px viewport. Its grid tracks retain a 335px minimum content width. This affects WCAG 1.4.10 reflow. | Constrain both legal grids and allow their children to shrink; keep tables locally scrollable. A disposable CSS candidate reduced the document width to 320px. |
| R4 | Must fix | mobile-review.json; film-modal-844x390.png; captured AI-video CSS:81-96 | In 844x390 landscape, the Egypt description ends at y=423, below the viewport. Absolute positioning puts it outside the dialog while page scrolling is locked. | Include film, close control and description inside a scrollable viewport-constrained dialog layout, respecting safe areas. |
| R5 | Must fix | functional-supplement.json; captured AI-video JS dialog handling | Browser Back leaves /ai-video rather than closing the film player. Film opening has no history state. | Add history-aware modal handling, including Back/Forward, reload and focus/scroll restoration. The conversation preview already demonstrates this behaviour. |
| R6 | Must fix before Ash activation | Captured privacy.html:236-251; current conversation preview | The privacy policy describes collecting details through Ash, although the live assistant is a scripted preview that sends/stores no messages. Provider and retention decisions are not implemented. | Describe current processing accurately. Before activating Ash, reconcile the policy with the actual provider, filtered payload, consent, storage and deletion flow. |
| R7 | Should fix | Captured home.html:129-142; video.html:252-278 | Visible prices use an unqualified dollar symbol while structured data specifies USD. | State the approved currency visibly and consistently. This review does not select or change prices. |
| R8 | Must fix against Studio26 standard | Captured AI-video CSS:112; mobile-review.json | The substantive Egypt attribution paragraph is 13px on mobile, below Studio26's 14px minimum. | Increase it to at least 14px. This is an internal-standard failure, not a claim that WCAG defines a minimum font size. |
| R9 | Should fix / design review | brand-template-390.png; mobile-review.json | Miniature ads have roughly 6px to 11px text at 390px. The editor works, but much of the result cannot be judged at that scale. | Add an enlarged selected-format view or enlarge/stack formats on narrow screens. Decorative sample CTAs should remain clearly part of the artwork. |

Reference verification: [official Mauritius Data Protection Act 2017](https://dataprotection.govmu.org/Documents/DPA_2017.pdf). Rights are in Part VII; section 42 addresses unlawful disclosure; section 6 addresses complaint investigation. This checks cited references, not the studio's legal compliance as a whole.

Media implementation reference: [Cloudflare R2 ranged reads](https://developers.cloudflare.com/r2/api/workers/workers-api-reference/#ranged-reads). The range findings concern this deployment, not all Cloudflare configurations.

## Pillar 1: Functional QA

All three routes return 200. Checked same-origin destinations and hash targets resolve. Seventeen distinct image URLs returned successfully. No page errors or asset HTTP errors were observed in exercised paths. Homepage concept selectors work. Home/Privacy conversation previews support choices, Tab containment, Escape, focus return, Back/Forward and reload; no messages are submitted. Email remains available without JavaScript.

The brand editor safely displays HTML-like input as text in three formats. Visible colour labels and native keyboard radio selection work in all four colours. Six FAQs open with the keyboard. Pause motion stops the hero pictures. Inactive cinema scenes are inert; the full Maison/Kestrel scenes are correctly interactive. Direct film links remain without JavaScript.

Film dialogs open, expose correct metadata and close with Escape, restoring focus. Actual Egypt playback was confirmed in installed Chrome, with burned-in subtitles visible during natural playback. The bundled headless-shell renderer did not reliably advance media; black captures from that renderer are not treated as production playback failures. Complete caption timing/coverage was not audited.

Failures are seeking and film history. There is no enquiry form here; the local brand editor is not a submission form. Backend spam protection, email delivery and persisted-lead success were not tested by submitting requests.

## Pillar 2: Mobile responsiveness

All pages checked at 320, 375, 390, 430, 640, 768, 1024 and 1440px. Homepage and AI video had no document overflow. Privacy passes the standard 375/390/430/768 widths but fails at 320px. Film modal checked at 390x844 and 844x390, confirming the landscape cut-off.

Four measured 1px radio inputs are not touch-target failures: their associated visible labels are at least 44px and work. Underlined inline body links are exempt from standalone 44px targets. The primary authored controls passed the sampled size checks. Attribution and miniature artwork text issues are separated in R8/R9.

Real-device software keyboards and Safari/iOS safe-area behaviour remain unverified. No full responsiveness sign-off is claimed.

## Pillar 3: WCAG 2.1 AA

Axe scans covered 1440px and 390px on all three pages, plus conversation dialogs, the film dialog and coral/gold template states. Sixteen scans reported zero violations. Sampled keyboard journeys, radio focus, modal closing and conversation focus loops were checked. Each page has one H1, labelled navigation, a main-content target and a skip link as the first keyboard destination.

Automated scans do not clear the reflow/player issues. Full screen-reader behaviour, every control-state contrast combination and every dynamic film frame remain unverified. Burned-in captions were observed in an excerpt; comprehensive media accessibility remains open. Do not claim full WCAG conformance or QA completion from this pass.

## Performance and security observations

Single cold-browser, unthrottled mobile-viewport spot checks over 5.5 seconds after navigation:

| Page | LCP | CLS | Initial observed bytes | Script bytes |
| --- | --- | --- | --- | --- |
| Homepage | 0.512s | 0.00004 | 227,908 | 39,380 |
| AI video | 0.572s | 0 | 245,995 | 56,544 |
| Privacy | 0.876s | 0 | 84,979 | 3,833 |

These are fast-network samples, not Lighthouse, field CWV or an INP audit. They exclude later scrolling and user-played films. No new performance blocker was demonstrated. The opening timing was unchanged. CSP, frame protection, nosniff, referrer and permissions headers were present; this was not a penetration test or backend security certification.

## Independent review remains pending

One Argon High review was attempted against exact public AI-video snapshots. All file reads failed in the configured PreToolUse hook: its quoted Python command was not recognised. No code review was delivered, and no independent verdict/findings were used. The runner marked the job incomplete.

Job `agy-20261102-235825-0ff0e792`: reported input 11,507 tokens, output 7,153, total 18,660. These are reported usage, not measured subscription quota or an invoice. Evidence: `C:/Users/ruben/gemini-work/runs/agy-20261102-235825-0ff0e792/status.json` and `answer.md`. No retry, model switch or hook bypass was attempted. Opus remains pending under Ruben's earlier instruction.

## Release checkpoint

Fix R1-R6 and R8, decide the visible currency and small-format presentation, then recheck the affected paths. Verify actual media licences/provider-plan rights before relying on the broad commercial-usage wording. Confirm controller details, operational retention/deletion and production contact handling. Commit a traceable combined release candidate, then complete real-device and assistive-technology checks. No launch clearance until remaining checklist items are confirmed or explicitly waived. Ash architecture/branding are unchanged and its build remains paused at this review checkpoint.

## Shared QA checklist disposition

Every sign-off item is accounted for. Partial is not a pass or a waiver.

| Item | Status | Evidence or limitation |
| --- | --- | --- |
| All forms validate required fields inline | N/A | No submitting form |
| Form success state is visually confirmed | N/A | No submitting form |
| All navigation anchors resolve correctly | Pass observed | Same-origin destinations and fragments checked |
| Hash routes / modals close cleanly on back button and Escape | Fail | Film history fails, R5 |
| All image `src` paths resolve on the deployed URL | Pass observed | 17 image checks plus browser-loaded assets |
| Zero console errors on load and on all interactions | Pass observed | No errors in exercised paths |
| Zero 404s in network tab | Pass observed | No 404s in observed paths |
| If emoji are present: Twemoji loaded via jsDelivr CDN, parse called with guarded `typeof` check, and `img.emoji` sizing CSS in stylesheet | N/A | No emoji identified that require Twemoji |
| No horizontal scroll at 375px, 390px, 430px, 768px | Partial | Pass at listed widths; additional 320px Privacy failure, R3 |
| All tap targets minimum 44x44px | Pass observed | Visible labels/controls checked; inline body links exempt |
| No font below 14px on mobile (body text minimum 16px) | Fail | Attribution below 14px, R8; miniature artwork, R9 |
| Multi-column layouts stack correctly below 640px | Partial | Main layouts stack; miniature ad legibility needs review, R9 |
| Tables have overflow-x scroll wrapper or reflow | Partial | Wrapper exists; legal grid expands at 320px, R3 |
| Form inputs are full width on mobile | Pass observed | Preview inputs fill mobile container |
| Submit button is prominent and minimum 44px tall on mobile | N/A | No submit button |
| `autocomplete` attributes set on standard fields | N/A | No contact fields; preview uses autocomplete off |
| All normal text meets 4.5:1 contrast ratio | Partial | Automated checks clear; dynamic backgrounds not exhaustive |
| All large text meets 3:1 contrast ratio | Partial | Automated checks clear; every cinematic frame not measured |
| All UI components meet 3:1 contrast ratio | Partial | All control-state combinations not exhaustively measured |
| Every interactive element reachable by Tab | Partial | Main journeys checked; all native media-control permutations unverified |
| Tab order follows visual reading order | Partial | Sampled order checked; full assistive-technology walkthrough pending |
| No keyboard traps | Pass observed | Tested dialogs can be exited |
| Escape closes modals and dropdowns | Pass observed | Escape tested on both dialog types |
| Visible focus ring on all focusable elements, meeting 3:1 contrast | Partial | Focus present in tested states; exhaustive ring contrast pending |
| Exactly one `<h1>`, heading hierarchy logical and unbroken | Pass observed | One H1 per page; no automated hierarchy failures |
| `<nav>` elements have `aria-label` | Pass observed | Markup labels present |
| `<main id="main-content">` present | Pass observed | Present on all pages |
| Lists use `<ul>` / `<ol>`, not div-based bullets | Pass observed | Reviewed content lists are semantic |
| Buttons are `<button>`, links are `<a href>` | Pass observed | Controls semantic; film anchors have direct-media fallback |
| Skip link present and functional as first focusable element | Partial | First keyboard destination and target confirmed; screen-reader focus pending |
| Every input has a `<label for="...">` (not placeholder-only) | Pass observed | Preview inputs labelled |
| Required fields marked with `aria-required="true"` or `required` | N/A | No required submission fields |
| Error messages linked via `aria-describedby` | N/A | No validation-error flow |
| Form response container has `role="alert"` or `aria-live="polite"` | Pass observed | Local editor uses announced status; no enquiry UI |
| Decorative images have `alt=""` | Pass observed | No automated failures; decorative images empty-alt |
| Informative images have descriptive `alt` text | Pass observed | No image-alt violations; descriptions reviewed |
| Icon-only buttons have `aria-label` | Pass observed | Text or accessible labels present |
| Colour is never the sole indicator of state | Pass observed | Borders/pressed/checked states support colour cues |
| Animations wrapped in `prefers-reduced-motion` media query | Pass observed | Initial reduced-motion path checked; live preference changes not exhaustive |
| `<html lang="en">` present | Pass observed | All pages declare English |

## Evidence

- [Functional checks](C:/Users/ruben/.codex/visualizations/2026/10/31/01a1920d-fc39-7691-86e5-8a722e1205e3/site-review-20261102/functional-review.json)
- [Targeted functional verification](C:/Users/ruben/.codex/visualizations/2026/10/31/01a1920d-fc39-7691-86e5-8a722e1205e3/site-review-20261102/functional-supplement.json)
- [Mobile checks](C:/Users/ruben/.codex/visualizations/2026/10/31/01a1920d-fc39-7691-86e5-8a722e1205e3/site-review-20261102/mobile-review.json)
- [Accessibility scans](C:/Users/ruben/.codex/visualizations/2026/10/31/01a1920d-fc39-7691-86e5-8a722e1205e3/site-review-20261102/accessibility-review.json)
- [Range and image verification](C:/Users/ruben/.codex/visualizations/2026/10/31/01a1920d-fc39-7691-86e5-8a722e1205e3/site-review-20261102/final-resource-verification.json)
- [Landscape player screenshot](C:/Users/ruben/.codex/visualizations/2026/10/31/01a1920d-fc39-7691-86e5-8a722e1205e3/site-review-20261102/film-modal-844x390.png)
- [Egypt playback and subtitles](C:/Users/ruben/.codex/visualizations/2026/10/31/01a1920d-fc39-7691-86e5-8a722e1205e3/site-review-20261102/egypt-natural-playback.png)
- [Privacy candidate fix measurements](C:/Users/ruben/.codex/visualizations/2026/10/31/01a1920d-fc39-7691-86e5-8a722e1205e3/site-review-20261102/privacy-candidate-fix.json)
- [Mobile brand-template screenshot](C:/Users/ruben/.codex/visualizations/2026/10/31/01a1920d-fc39-7691-86e5-8a722e1205e3/site-review-20261102/brand-template-390.png)
