# Studio26 build status
Current approved direction: Ruben selected colour study B (cobalt + warm light). Main homepage uses Syne display type and Instrument Sans body/navigation/forms, peach opening, deep cobalt services, peach/periwinkle process and midnight enquiry. Earlier section notes below describe the implementation history. Ruben explicitly chose to retain the current opening timing after seeing the 2.9s LCP result; the 2.5s target remains open. This is not a full-site QA/launch sign-off.

## Section 01 cinematic opening

Implemented locally on phase-1-site. Exact Claude Opus 5.5 reviewed the opening and verified fixes; no remaining blockers in its bounded re-review. Reports are in docs/reviews. The complete site has not been released or declared QA-complete.

Design: gallery scene, integrated title and full-width approved chrome/cobalt artwork. Paper #e8e6e2, Ink #171a1c, Cobalt #173fc5, secondary text #505459. Instrument Sans variable, local WOFF2. The finite reveal animates two approved stills; it is not continuous 3D. Content stays available throughout, with static fallbacks and reduced-motion support.

Validation, 31 October 2026:
- Functional: full automated suite 53 passed, including slow image loading, missing artwork, missing GSAP, no JavaScript, replay and pause/resume.
- Mobile: visual check at 390px, automated responsive checks, opening framing checked at 1024, 1440, 1800, 1920 and 2560px. Manual cross-device QA remains a launch task.
- Accessibility: automated axe WCAG 2.1 AA checks passed; motion preference and focus regression passed. This does not replace the complete manual checklist or assistive technology checks.
- HTML validation and JavaScript syntax checks passed.
- Local mobile Lighthouse: performance 96, accessibility 100, best practices 100, SEO 100. LCP 2.8s, CLS 0.003. Lab result, not production field data. Report: ../tooling/reports/section-01-lighthouse.json (relative to site).

Opus fixes: observer includes visible controls, late image loading offers Replay instead of starting unexpectedly, wide-screen centring, resize-safe transform, focus when motion preference changes, explicit replay on preference restoration, older media-query API fallback and playback announcements. Existing CSP already allowed the data image placeholder.

Self-critique: removed the previous equal-column hero, coloured headline word and repetitive numbering. The full-width artwork remains the signature. Later homepage sections retain the earlier site and still need rebuilding.

Next: selected work and project transition, then the web-to-film experience, service journeys and assistant. Continue one implemented section, browser checks and bounded Opus review at a time. Rights, final assets and launch-only configuration remain gated as recorded in the plan. No production deployment or push was performed.

Preview: http://127.0.0.1:3000/ (local development server).

## Section 02 selected work

User approved: keep all six existing projects and copy; build large staggered panels. Implemented on phase-1-site, commits 94b0222 and 7c7daf9. Only homepage-scoped CSS and local browser checks changed. All project names, descriptions, destinations, source images and order remain unchanged. No shared CSS, AI-video assets or AI-video worktree files changed.

Design: alternating 7/5 and 5/7 desktop columns with a vertical offset; equal tablet columns; single column <=640px. Local Instrument Sans titles, existing project-colour picture frames, complete 8:5 screenshots, restrained underlined destinations. No new scripts, assets, dependencies, motion or network requests.

Checks: full baseline-plus-section suite 56 passed (3.1 minutes). After wrapping and focus-test hardening, four focused responsive, no-JS, keyboard and axe checks passed (10.8 seconds). HTML validation passed. Visual desktop/mobile review completed. Required responsive widths: 375/390/430/768/1024/1440. Full manual multi-browser/assistive-technology launch checklist remains open.

Opus 5.5 initial review: PASS, bounded to section 02. Final verification: PASS. Both reports saved in docs/reviews. Fixes applied: description max-width60ch, name word wrapping, Tab from preceding section through all six projects, exact focus width/colour and clipping-ancestor assertions. Image sizes hint remains a Should fix backlog item for the next markup pass: update old 30vw/100vw hint to measured panel widths, aligned with the 900px breakpoint. Existing candidates are sufficient today; tablet may overfetch.

The earlier homepage LCP2.8s is still above the 2.5s target; no new performance measurement is claimed for this section. No production QA sign-off, push, merge or deployment.

Local preview: http://127.0.0.1:3000/#work. The independent AI-video worktree needs a separate preview port while this server runs.

## Section 03 services

User asked to leave video generation/film transition aside and continue other homepage areas. Service layout updated with existing two services, all text, sample-ad destination and [price] placeholders preserved. Homepage-scoped CSS only; AI-video page/worktree untouched.

Open rows replace the old serif service styling: Instrument Sans titles, left service name and right scope on desktop, compact semantic feature lists, stacked mobile content. No new animation, assets, JavaScript, dependencies or network requests. Implementation commit4d23f98.

Seven focused checks passed: services at375/390/430/768/1024/1440, section02 regressions including focus and no-JS, page axe WCAG2.1AA and mobile tap targets. HTML and JSsyntax/diff checks passed. Screenshots visually checked at390 and1440. Opus5.5 review: PASS. Intermediate-width641/700, heading bounds and whole-page overflow checks added after review; no service implementation changes. Full manual launch checklist remains open; existing price placeholders and homepageLCP2.8s are not resolved by this layout work.

## Section 04 process

Existing four-step process aligned with the homepage typography, with original steps and copy unchanged. Implementation c30e62d. Static four-column desktop, two-column tablet and single-column mobile; local Instrument Sans numerals/headings, body16px with max34ch, existing semantic ordered list. No motion, JavaScript, assets, requests, backend or other-page changes.

Opus5.5: PASS, bounded to the committed section diff, report docs/reviews/section-04-opus-review.md. Optional test nits: direct heading overflow assertion and tolerance for comparing subpixel row positions; existing full-page responsive tests cover actual page overflow. Desktop/mobile live visual checks completed. Final full regression:58 passed in2.6minutes, including enhanced services widths641/700 and process reading-order checks. HTML validation passed. No claim of manual multi-browser/assistive-technology sign-off.

Film transition intentionally deferred while Ruben generates footage in Flow. AI-video worktree and user Flow tab untouched. Next homepage areas are the approach/studio/contact presentation; copy, founder assets, commercial choices and broader layout decisions remain subject to Ruben's direction. Known launch follow-ups remain: price placeholders, final portrait, booking/production settings, responsive work image hint and homepageLCP2.8s.

## Section 05 selected warm-light identity

Approved choice: study B. Implementation f74b13b, performance/layout consolidation a8ea45c. All changes homepage-only: stylesheet/font references in head, canonical studio-home.css, licensed local Syne WOFF2 and dependency register. No new JS, changed claims/copy, Worker/backend, AI-video page/worktree or deployment.

Local Syne500/600 display; Instrument Sans reading text. Gradient endpoints: opening#f6cbb0/#f0d9d0/#e8e6e2, services#101632/#173fc5/#3158d6, process#f6cbb0/#e8d2de/#b8c8f3, enquiry#101632. Key contrast calculations: servicewhite>=6.00:1, secondary>=5.29:1, hero secondary>=5.12:1, processbody>=7.02:1, processnumbers>=4.93:1. Services computed colours/focus rules confirmed in browser.

First Opus review requested new performance evidence. Reserved replay-control space prevents the summary shifting when the button appears. Warm styles consolidated into existing sheet, removing an extra blocking request; complete artwork preload first, optional second frame fetched through existing enhancement code. Reveal timing/JS unchanged. Prototype studies retain noindex/nofollow and the previous base stylesheet snapshot, so the comparison remains available locally.

Validation: full58checks passed3.3minutes; after consolidation/control-space fix,18focused regressions passed50.7seconds (motion/fallback/reducedmotion, project framing/order/focus, services at641/700 and required widths, process, axe, tap targets, empty/successful enquiries). HTML validation passed. Desktop services and mobile opening visually checked. Manual Safari/Firefox/assistive-technology checklist remains open.

Final local Lighthouse: performance95, accessibility100, bestpractices100, SEO100; FCP0.9s, LCP2.9s, CLS0, TBT0ms, transfer471KiB. Report: ../tooling/reports/section-05-lighthouse.json. Lab snapshots, not field INP/production data. Original identity baseline had LCP2.8s, CLS0.003. The 2.5s LCP target remains open. Ruben answered 'Keep the current timing' when offered a shorter reveal; no broad performance/QA waiver is inferred.

Opus verification: PASS for bounded colour/type implementation. LCP target remains open, explicitly not launch/performance sign-off. Initial review: docs/reviews/section-05-opus-review.md. No push/deploy. Preview http://127.0.0.1:3000/.

Review follow-ups: prototype studies must be excluded or archived before any filesystem-based deployment; no deployment is authorised now. The complete-wordmark img uses the exact single URL in the preload and has no srcset, so duplicate srcset fetching does not apply. Reduced-motion control is hidden by JS and CSS and tested; the desktop reserved empty row is an optional spacing refinement.

## Preview publication — 31 October 2026

Ruben requested replacing the workers.dev preview while leaving production alone. Published website commit2bd5bde from phase-1-site directly to existing Worker studio26-site. Cloudflare VersionID a1bd84e9-088d-49bb-ace9-49021b58972a. Preview: https://studio26-site.ruben-ramdhony.workers.dev/.

Main was not merged or changed (remote main remains ca57ee40c135ca3c0b7a60a0a800632b3511dc63). Production studio26.me remains on Pages project studio26 and still serves the teaser. API preflight confirmed no studio26-site custom domains and no Worker routes on studio26.me. No DNS/domain/route migration, remote database writes/migrations, secrets changes or production deployment.

Pre-push npm run qa:58passed2.7minutes. Wrangler dry-run passed. Published an exact git-archive snapshot under ../tooling/deployments/preview-2bd5bde, so untracked public/studies/colour was excluded. Remote study URL returns404. Remote homepage, canonical CSS, Syne font, AWI-map thumbnail, motion script, /ai-video and /privacy return200. Remote CSS byte-matches the committed snapshot (working-copy CRLF differs only by line endings).

Production HTML matches unchanged main after decoding Cloudflare's per-request email-obfuscation markup; raw response hashes naturally vary because encoded email keys change on each request. Evidence: ../tooling/reports/preview-deploy-preflight.json, preview-deploy-previous-version.json and preview-deploy-verified.json. Prior preview version for rollback: aa136d5b-b5a4-41b3-9357-e0d62c31408a.

The new AI-video rethink branch remains separate and was not merged. Existing launch follow-ups/LCP2.9s remain open; this publication is a preview milestone, not production sign-off.
