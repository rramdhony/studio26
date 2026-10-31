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
