# Studio26 build status

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
