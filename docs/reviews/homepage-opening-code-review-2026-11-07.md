# Homepage particle opening release review, 7 November 2026

Ruben authorized an independent CLI review and, after approval and resolution of bugs, merge and production publication. Branch: `codex/homepage-logo-reveal`, based on released `40bf0b8`. Backup: `backup/pre-production-opening-20261107-dc885e6`.

## Scope and independent review

The earlier branch held an isolated study only. This release integrates the chosen finite particle-to-wordmark opening into `public/index.html`, using scoped CSS and a dependency-free WebGL script. The compact settled mark sits beside the headline on desktop and above it on mobile. The footer retains its larger closing wordmark. The Academy study stays outside the deployed public directory; Academy registration is not part of this release.

Claude Sonnet reviewed exact allowlisted production JS, CSS, opening markup context and focused browser tests through the subscription-authenticated `ask-claude.ps1` CLI wrapper. Workers were read-only and did not run browser tests. Codex inspected the answers and verified the findings independently.

- `claude-20261107-150722-7c595b82`: REQUEST_CHANGES. Resolved inconsistent media breakpoints, fixed-height mobile collisions under enlarged text, focus order on context loss, autoplay live-region noise and weak/racy tests.
- `claude-20261107-151616-aa33be1e`: APPROVE, with two low findings. Fixed hidden-canvas resize when reduced motion changes, and made test pause state transitions atomic.
- `claude-20261107-151909-277e66f4`: APPROVE. No unresolved actionable bugs in those changes. Strengthened the suggested test assertion to require a positive, finite aspect ratio.

A local prompt preparation failed before a model job started; UTF-8 file handling was corrected once. No billing-route fallback or model switch was used.

## Release behavior and safeguards

- Headline, offer and enquiry links stay usable throughout one 4.4-second sequence.
- Pause, resume and explicit replay; no late autoplay after slow image loading or restoring motion preferences.
- Default settled composition for no JavaScript, reduced motion and unavailable/failed graphics.
- Context loss settles permanently for the visit and moves focus before hiding its control.
- Hidden tabs and offscreen opening suspend animation. DPR is capped at1.5; mobile starts with fewer particles.
- No extra production dependency, backend, enquiry API, Ash configuration or search-discovery change.

## Validation

Initial full regression:81/81 passed. Repeat after review fixes:80/81 passed; one unchanged AI-video scroll sampling check missed a phase while competing browser jobs ran. Its isolated rerun passed without a source or test change. Final opening and SEO checks:13/13 passed (9 opening, 3 SEO, 1 video-scroll regression). After integrating the separately released SEO commit `9934ff0`, the complete combined browser suite passed93/93 in3.4minutes with one worker, and Ash matcher/source checks passed228/228. The reviewed production JS/CSS hashes remained unchanged. Four-page HTML validation, JavaScript syntax and diff-whitespace checks passed. Desktop1440px, tablet768px and mobile390px settled screenshots were visually inspected; responsive checks include320px and the750-768px breakpoint band.

Functional, mobile and automated WCAG AA coverage includes motion controls, missing scripts/graphics, shader failure, context loss, focus, responsive layouts, enlarged/spaced text, enquiry dialog and unchanged service/Ash behavior. `npm run qa` now includes the new opening and existing SEO browser tests.

This is a bounded release review, not full manual QA completion. Physical devices, Safari/Firefox rendering, manual screen-reader testing and real GPU profiling remain unverified. Context recovery intentionally stays static for the visit. Particle count is chosen once at initial graphics creation. No claim of guaranteed absence of bugs or improved Google/LLM recommendations.

## Reviewed production file hashes (SHA-256)
- `public/assets/studio-opening.js`: `3922329fa77e9f3b7216de8808dec7a5b7fabf9607b0f4458752dacac19248d8`
- `public/assets/studio-opening.css`: `46f5f8b1ee953f719c0f152cd2e744116da3f597a0b9994c2f1dbd08b1ec9e52`

## Release tracking

PR: https://github.com/rramdhony/studio26/pull/2. Merge and live deployment evidence are recorded in its description after publication. Homepage integration and new assets are synchronized surgically into the three existing local mirrors after backup; unrelated pending edits are preserved.
