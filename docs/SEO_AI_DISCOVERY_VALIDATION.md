# SEO and AI discovery validation

## Reviewed release candidate, 7 November 2026

Ruben authorized the PR, merge and push after review. Branch: `codex/ash-seo-release-fixes`. Backup: `C:/Users/ruben/Downloads/studio26/backups/pre-pr-ash-seo-20261107-141213`.

The review reproduced three issues missed by the previous passing suites. These are now fixed:

- English `without` and French `sans` no longer turn excluded assistants into a positive match for the $4,000 package. Supported phrases about template-free builds and cancellation remain available.
- Pure cancellation/language questions remain supported while mixed guarantees, discounts and fixed-date requests retain the team handoff.
- Every catalogue source now has a tested local target anchor. The approved two-to-four-week delivery guide, 50/50 project payment terms and technical SEO scope are published on the service page. Its SEO answer distinguishes optional llms.txt summaries from ranking signals.
- The shared asset headers apply `noindex, nofollow` only to `studio26-site-ash-preview.ruben-ramdhony.workers.dev`, leaving production indexable.

Matcher/source validation: 225 tests passed. HTML validation passed for all four main pages. Final local browser and deployed verification results are recorded below as they complete. Historical observations below describe the earlier candidate, not an assertion that these fixes were already live at that time.

Final local release checks: all 81 main Playwright checks passed (3.3 minutes), all 3 SEO/discovery checks passed, and the production Wrangler dry-run passed with 97 static assets. The updated service page was visually checked at mobile width. These checks cover the three pillars within the documented automated scope; manual screen-reader and physical-device/multi-browser checks remain unverified, so this is not a complete WCAG or full-site QA sign-off.

Pre-merge deployed verification: isolated Ash preview version `4d25cf06-8082-40d2-a054-ea830d571618` serves the tested matcher, catalogue and service guide byte-for-byte after line-ending normalization. Its homepage and service guide both return `X-Robots-Tag: noindex, nofollow`. Production's homepage has no such header. Production publication follows the approved PR merge through GitHub Actions, not a direct production CLI deploy.

7 November 2026. Local implementation only; production unchanged by this task.

## Functional QA

- Existing 81-test suite: 79 passed initially. Two tests failed because the new service link invalidated their assumption that only one service link existed. Both were corrected to assert the two intended destinations and the actual preceding tab stop.
- Follow-up: all 18 relevant portfolio, service, homepage accessibility and video checks passed.
- Discovery suite: 3 passed. Covers all four sitemap URLs, canonical URLs, single H1, JSON-LD parsing, absence of noindex, service content without JavaScript, crawler exclusions, no public contact email in llms.txt, real 404, and the new enquiry dialog opening and closing with Escape.
- HTML validation passed on homepage, AI-video and new website/chatbot guide after correcting two existing landmark/native-element errors on home and video.
- Live read-only checks before changes: home, video, robots and www returned 200; an invented page returned 404.
- Full production forms, cross-browser interaction, all deployed assets and new production URLs have not been revalidated because this change set has not been released.

## Mobile responsiveness

- Existing responsive, typography, tap-target, header and image-framing checks passed in the main run.
- New guide has no horizontal overflow at 375, 390, 430, 768, 1024 and 1440 pixels.
- New guide screenshots inspected at 390 and 1440 pixels. Uses the existing editorial layout; stacked content and wrapped headings are legible.
- Real-device and Safari/Firefox checks remain open. Resized Chromium does not substitute for those checks.

## WCAG 2.1 AA

- Automated axe checks passed for the new guide and existing pages covered by the main suite.
- New guide keyboard skip link and enquiry-dialog Escape behaviour passed. Main heading, language, labels, motion fallback and existing focus regressions passed.
- Manual screen-reader, every interactive state, component contrast and full keyboard walkthrough across all pages remain open. No full WCAG conformance claim is made.
- Existing copy includes em dashes outside this bounded change; the repository-wide punctuation checklist is not cleared. New guide copy uses none.

## Reproduction

Start the existing local Worker on port 3000. Use the package's normal QA commands in a functioning npm environment, or call the installed CLIs directly:

```text
node node_modules/@playwright/test/cli.js test --config .github/qa/playwright.config.js
node node_modules/@playwright/test/cli.js test --config .github/qa/seo.config.js
node node_modules/html-validate/bin/html-validate.mjs --config .github/qa/.htmlvalidate.json public/index.html public/ai-video.html public/websites-ai-chatbots.html
```

This environment's default npx launcher pointed to a missing npm installation. Validation used installed local CLIs and the existing Wrangler installation in the other checkout. No dependencies were upgraded.

## Change isolation and release

The repository already had unpublished changes to CLAUDE.md, HANDOFF.md, home/video/privacy, Ash JS/CSS and its catalogue, plus an untracked Ash release plan. They were preserved. Backup: `C:/Users/ruben/Downloads/studio26/backups/20261107-seo-ai-discovery` (including a separate original QA file snapshot) and `C:/Users/ruben/Downloads/studio26/backups/pre-release-b-20261107-131128`.

Reconciliation status (updated 7 November 2026):
- Canonical checkout (`C:/Users/ruben/Documents/GitHub/studio26`), main mirror (`C:/Users/ruben/Downloads/studio26/site`), and the isolated preview worker checkout (`C:/Users/ruben/Downloads/studio26/site-ash-widget-preview`) are synchronized with the combined SEO/AI discovery changes (`public/websites-ai-chatbots.html`, `public/llms.txt`, `public/robots.txt`, `public/sitemap.xml`, `.github/qa/seo.config.js`, `.github/qa/seo.spec.js`) and Ash Release A + Release B in full (`B1` through `B7`).
- Deployed to the isolated preview worker (`https://studio26-site-ash-preview.ruben-ramdhony.workers.dev/`) for review before pushing to `main`.

Release checklist: review on the preview worker URL, run final release QA (`npm run test:ash`, `npm run qa:html`, Playwright main + SEO suites), publish to `main` upon Ruben's sign-off, verify the new URL and discovery files live, and request indexing in Search Console/Bing. Do not use robots.txt to hide private information and do not infer verified bot access from a spoofed user-agent fetch.

This is a bounded validated SEO/content and Ash Release A/B update, ready for preview sign-off.
