# Academy opening: reference study

7 November 2026. Branch: `codex/academy-hero-study`. Backup reference: `backup/pre-academy-20261107-40bf0b8`.

## Reference findings

Source: https://www.lewiszhang.dev/ inspected in a live desktop browser and through the site's publicly served JavaScript/CSS. Observations describe the inspected build, not an upstream source repository.

- The hero is a live particle flower, not a background film. A glTF flower mesh supplies the initial vertex positions and vertex colours.
- React, Three.js/React Three Fiber, GSAP and Lenis are present in the served bundle. Custom GLSL shaders drive the effect.
- A GPU computation texture stores each particle's XYZ position and lifetime. A 4D noise field advects positions away from their starting points, then particles respawn at the base geometry.
- Pointer velocity increases flow and lifetime decay. The scene also tilts with pointer position. These are two separate interactions.
- The renderer draws round point sprites with additive blending and per-particle size/colour. Small variations in colour intensity create the ember-like quality.
- Scroll progress affects point size and scene placement. HTML text remains separate from the WebGL scene.
- There is a loading cover and a shader-based entrance. The asset loader also fetches several models and images used elsewhere in the portfolio. The initial sample was still covered after several seconds; a later capture showed the complete hero after an 18-second wait. This is an observation in this test environment, not a universal load-time benchmark.
- The served JavaScript bundle was approximately 1.70 million characters before transfer compression. The visual effect does not require importing that site's full application into Studio26.

## Proposed Studio26 adaptation

Recommendation: introduce the particle idea on Academy first. A bloom made from many individual points can represent emerging capability, mentorship and shared work. The existing homepage already has an approved identity and reveal timing; an additional prelude risks delaying the content and repeating the introduction.

Design plan: retain Instrument Sans, paper `#e8e6e2`, ink `#171a1c`, studio blue `#475c89`, chrome/cobalt highlights and restrained peach. Use one large particle sculpture against a dark navy stage, with quiet controls and a low, readable headline. Follow with a paper editorial section about the proposed Academy. No invented partnerships, course dates or outcomes.

The local comparison implements two placements:

1. Academy opening: a six-second original parametric bloom composition, then a static settled frame. Draft headline: “Learn by making. Grow by doing.”
2. Before the logo: particles disperse and the existing transparent Studio26 wordmark is revealed within four seconds. This is a compositional handoff study, not an integration with or timing change to the production homepage reveal.

The study uses original procedural geometry and original shaders. It does not redistribute the reference site's model, shaders, fonts, photography or application bundle. It approximates the visual principle using analytic shader displacement rather than the reference's stateful GPU simulation. Full curl-noise simulation remains an optional refinement if the visual direction is selected.

## Local review

Run `node scripts/serve-academy-study.mjs`, then open http://127.0.0.1:3001/.

Study source lives under `experiments/`, outside deployed `public/`. The server exposes only an explicit file allow-list, binds to localhost, and adds noindex headers. No production page, navigation, sitemap, form or Ash content is changed.

The text and static SVG remain available without JavaScript or WebGL. Reduced-motion users receive a static composition. Motion has pause/replay controls, stops after a bounded duration, and suspends while offscreen or in a hidden tab. Mobile uses fewer points and device pixel ratio is capped. These are implementation properties to verify, not a full-site QA claim.

## Verification

- Functional: render, pause/resume/replay, bounded completion, keyboard mode selection and logo handoff passed. The localhost server's asset allow-list and noindex response passed.
- Mobile: no overflow at 320, 375, 390, 430, 768, 1024 and 1440 pixels; visible buttons meet 44 by 44 pixels. Desktop, mobile and final logo frames were visually inspected.
- Accessibility: automated axe WCAG 2.1 AA checks, reduced-motion static presentation, no-JavaScript content and simulated WebGL context-loss fallback passed. HTML validation, JavaScript syntax and whitespace checks passed.
- Six focused browser tests passed in 16.7 seconds. Run with `node node_modules/@playwright/test/cli.js test --config .github/qa/academy-study.config.js` while the study server runs.
- This test environment lost its default accelerated WebGL context. The fallback worked; shader tests and screenshots used Chromium's software renderer via explicit test-only launch flags. Hardware performance, real phones, Safari/Firefox and manual screen-reader validation remain open. No frame-rate claim or full QA sign-off is made.
- The deployed site's `public/`, Worker, forms, discovery files and Ash catalogue are unchanged. The new study is not part of the production asset directory.
- Unrelated application edits appeared in the shared checkout during this study (`public/` pages/headers and `src/index.js`). Those edits are preserved and excluded from the study commit. The statements above describe this study's scope, not the state of other ongoing work.

## Academy work after the opening choice

Use the recovered brief at `C:/Users/ruben/Downloads/studio26/studio26_academy_full_context.md` for the proposed `/academy` page. Preserve its distinction between pre-launch intentions and an operating programme. Scope the interest form through the existing enquiry infrastructure and add approved bilingual Academy answers to the actual static Ash catalogue. Page placement, final copy and motion direction should follow review of this study.
