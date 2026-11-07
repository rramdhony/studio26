# Studio26 build status

## 7 November 2026 (late): privacy reconciliation

PRs #3-#7 merged and live: CTA/hover fixes, enforced 12-month purge for `ash_questions` and `site_events`, pseudonymised wording, input notice, DPA s.28(1)(b)(vii) citation, notice covering the page-view/click log. Matcher 233/233; full browser suite 92/93 (one load-sensitive opening timing test passes alone). See HANDOFF.md for decisions and open items.

## 7 November 2026: SWOT conversion upgrades, footer WhatsApp & first-party click/visitor telemetry

- **Reframed `#founder` Senior Positioning (Item A):** Updated `public/index.html` (`#founder`), `public/websites-ai-chatbots.html` (`#work`), `public/llms.txt`, and `public/assets/catalogue.v1.json` (`team`, `chatbot-builder`) so Studio26 leads with founder Ruben Ramdhony's architectural and creative direction (`Founder & Creative Director`) and personal sign-off on every build rather than "emerging developers".
- **Global E-Commerce & Payment Options (Item B):** Updated `public/index.html`, `public/websites-ai-chatbots.html`, `public/llms.txt`, and `public/assets/catalogue.v1.json` (`ecommerce`) to highlight custom online stores, checkout flows, and online payment integration tailored to the client's market.
- **4-Point Studio Commitments / Risk-Reversal (Item C):** Added the 4-point Studio Commitments strip (`.service-commitments`) to `public/index.html` (`#services`) and `public/websites-ai-chatbots.html` (`#payments`): Fixed written quote after free 30-min discovery call; 50% upfront / 50% on delivery; 100% client ownership of code, domain, and video masters; and one-business-day reply in EN/FR.
- **Footer WhatsApp CTA (Item D):** Added `Chat on WhatsApp` (`https://wa.me/23054549763`) to the footer across `public/index.html`, `public/websites-ai-chatbots.html`, `public/ai-video.html`, and `public/privacy.html` (leaving Ash without WhatsApp as requested).
- **First-Party Edge Click & Visitor Telemetry (`migrations/0005_site_events.sql`, `GET /api/event`):** Logs `page_view`, `whatsapp_click`, `ash_open`, `contact_open`, `portfolio_click`, `linkedin_click`, and `cta_click` to D1 `site_events` with 2-letter Cloudflare country code and salted `SHA-256` `ip_hash` (12-month auto-retention in `scheduled()`), plus a built-in `window.gtag` bridge if Google Analytics 4 is loaded. Inspect anytime via `npm run site:stats` and `npm run site:clicks`.
  Every pageview and click is now logged automatically with the visitor's 2-letter Country Code (`MU`, `FR`, `GB`, `ZA`, etc.) and salted `SHA-256` visitor hash:
  - `page_view` (which page they visited, plus referrer domain or `direct`)
  - `whatsapp_click` (clicking the footer **Chat on WhatsApp** link)
  - `ash_open` (opening the **Ash** chatbot)
  - `contact_open` (opening the **Send us a message** modal)
  - `portfolio_click` (clicking any of the 6 client websites in `#work`)
  - `linkedin_click` (clicking your LinkedIn badge)
  - `cta_click` (clicking `/websites-ai-chatbots`, `/ai-video`, or header CTAs)

## Ash market-demand question telemetry (Option A) & SEO Phase 1, 7 November 2026

- Implemented Option A pseudonymised Ash question logging (`migrations/0004_ash_questions.sql`, applied to remote D1 `studio26-db`; `POST /api/ash-question` in `src/index.js`; client beacon and brief pre-fill in `public/assets/ash-widget.js`).
- Records `created_at`, 2-letter Cloudflare edge `country`, salted `SHA-256` `ip_hash` (never raw IP), `page`, `lang`, `source` (`typed` or `topic`), PII-redacted `question`, and `matched_id`.
- Updated `public/privacy.html` (Sections 2B and 2C) and `public/assets/catalogue.v1.json` (`privacy-data`, `fallback-ambiguous`) to match. Added `npm run ash:questions` and `npm run ash:enquiries` helper scripts in `package.json`, and updated `AGENTS.md`, `CLAUDE.md`, and `HANDOFF.md`.
- Completed SEO Phase 1 (`9934ff0`): disabled `.workers.dev` previews (`workers_dev = false`), deleted `studio26-site-ash-preview`, added hardened `www.studio26.me` -> `https://studio26.me` 301 redirect (`run_worker_first = true`), upgraded `@graph` JSON-LD and social metadata (`studio26-complete-v1.webp`, `1536x1024`, `en_GB`), and mounted Ash on `/websites-ai-chatbots`.

## Homepage compact-logo opening, 7 November 2026

Ruben approved replacing the oversized static homepage artwork with the finite particle reveal and compact settled wordmark. Branch `codex/homepage-logo-reveal` now integrates the study into the actual public homepage; earlier study-only status below is historical. Claude Sonnet CLI review approved the final fixes. Release evidence and manual QA limits: `docs/reviews/homepage-opening-code-review-2026-11-07.md`. The existing footer, enquiry flow, Ash and discovery content remain in place. Academy is still future work. Release PR: https://github.com/rramdhony/studio26/pull/2. Its description records merge and deployment verification after the final checks pass. The separate SEO update `9934ff0` was integrated without changing the reviewed opening assets.

## Academy opening study, 7 November 2026

Branch `codex/academy-hero-study` contains an isolated comparison of an original particle bloom on Academy and a finite transition into the existing Studio26 wordmark. Reference: Lewis Zhang's live particle-flower hero. Study URL `http://127.0.0.1:3001/`; run `node scripts/serve-academy-study.mjs`. Six focused tests and HTML/JS validation passed. Notes and remaining graphics/manual QA: `docs/creative/academy-hero-reference-study.md`. No public assets, production deployment or main-page motion changes are included. Academy page build follows the visual placement decision.

## 7 November 2026: release review fixes

Ruben authorized a PR, merge and production publication of the reviewed Ash A/B + SEO bundle. Branch `codex/ash-seo-release-fixes` fixes excluded-service pricing matches, mixed commitment requests and broken answer sources. The service guide now publishes approved delivery, payment and technical SEO scope. Preview-only noindex protection is restricted to the isolated Ash hostname. Matcher/source checks: 225 passed; four-page HTML validation passed. Final browser/deployment evidence is in `docs/SEO_AI_DISCOVERY_VALIDATION.md`. Academy and a model fallback remain separate future work.

## 7 November 2026: local SEO and AI discovery improvement

Added `/websites-ai-chatbots`, linked from home and sitemap, with truthful service scope and Ash distinction. Updated business/person/site schema, starting/monthly price semantics and crawl/AI-summary files. Full plan and remaining owner tasks: `docs/SEO_AI_DISCOVERY_PLAN.md`. Validation: 79/81 initial main checks, then all 18 focused regressions passed after updating two outdated link selectors; all 3 new discovery checks and changed-page HTML validation passed. Production, manual full-site QA and alternate-checkout reconciliation remain open. See `docs/SEO_AI_DISCOVERY_VALIDATION.md` for exact scope.
Current approved direction: Ruben selected softened study B. Instrument Sans500 is the main headline font and remains body/navigation/form type; Syne remains the other display type. Peach opening, soft periwinkle/lavender/peach services, muted-blue accents, warm process gradient and softened navy enquiry. Earlier section notes below describe the implementation history. Ruben explicitly chose to retain the current opening timing after seeing the 2.9s LCP result; the 2.5s target remains open. This is not a full-site QA/launch sign-off.

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

## Section 06 softened palette and rounded main headline

Ruben approved the actual b-soft study and requested replacing cobalt with this shade. Applied5b6cc21, service-link hover contrast guardb715657. UI accent#475c89, CTAhover/focus#303f5d. Servicegradient#b8c8f3/#d5d4ed/#f0d9d0, text#253047, secondary#414b60. Process#f6cbb0/#ecd8d5/#dedcec. Enquiry#273449. Mainh1 InstrumentSans500,lineheight1.06 for a rounded descender; other Syne headings retained as in approvedstudy. Approved artwork unchanged. No newassets/fonts/requests/packages,copy,JS,motion,backend,headers or AI-video changes.

Initial and verification Opus5.5 reviews:PASS. Full58checks passed2.8minutes; post-hover focused4checks passed (mobiletaptargets,axe,servicebreakpointchecks). HTML validation passed. Existing InstrumentSansvariableface400-700 covers500. Globalblue uses reviewed; contact/radio/field/footer focuspaper overrides retained, servicehovertext explicitlydeepnavy so it remains legible across gradient. Key text contrast>=5.25:1, whiteCTA6.65:1, focusring>=3.98:1. No fullmanualQAorproduction sign-off. LCP target remains open; original reveal timing retained per Ruben.

Publish only existing workers.dev preview from a committed snapshot excluding untrackedstudies. Main/studio26.me remain untouched. Published and verified on workers.dev: source823b61f, WorkerVersion f5275c43-26fc-4562-bdd7-2b859edf3d6a. Remote CSS exactly matches the committed snapshot; computed gradient/accent and Instrument Sans headline confirmed in browser. Studies remain404. Production teaser canonical HTML still matches unchanged main ca57ee4. Evidence ../tooling/reports/section-06-deploy-verified.json. Prior preview version a1bd84e9-088d-49bb-ace9-49021b58972a retained as rollback reference. No DNS, secrets, routes, remote DB writes or production changes.


## Section 07 — approved Approach B, 1 November 2026

Ruben selected the layered study. Integrated locally on phase-1-site: implementation0b9a90d, technical review fixesad5fb47. Existing approach paragraph moved below process; repeated existing sentence becomesh2. Studio nav#studio lands on the layered section; original founder photo placeholder and complete founder copy remain immediately below as#founder. Same three public project screens as approved study, existing local fonts and softened palette. All six work panels/copy unchanged. Shared CSS/JS, opening timing, AI-video worktree, Worker, production and main untouched. No new scripts/assets/fonts/dependencies.

Native radio controls select the foreground screen through CSS:has; selected state underlined, 44px explicitlabels, visible focus, reduced-motion static. Works without JavaScript. @supports fallback leaves a full static list with selectors hidden when selection CSS is unsupported; no late script layout shift. Existing800/1400screenshots use lazy loading, dimensions and measured responsive sizes.

Functional: full61regressions passed2.8min before smallreviewfixes. After hover/sizes/test fixes,5focused checks passed18.2s (4sectiontests plus fullpageaxe); after final forced-colours padding correction a focused rerun is recorded in turn results. Mobile:13widths320/375/390/430/640/641/768/1024/1050/1051/1440/1920/2560, allthree selectedstates bounded againststack/controls/founder; foregroundcaptions hit-tested. CUA1440/390 visuallychecked; unsupportedCSS staticfallback tested390/1440. Accessibility: nativekeyboardArrowRight/Tab/focus, noJS selection, reducedmotion0s, axeWCAG2.1AA, labels/44pxtargets pass; HTMLvalidation/diffcheck passed. Fullmanual cross-browser/assistive-tech and launchchecklist remainopen.

Opus5.5 initial PASS WITH FIXES, final verification PASS. Actual technical findings resolved, including final mobileforced-colours padding refinement with a stability test. The initial client/concept-labelling finding assumed statuses and existing labels without evidence; no labels/claims invented. Ruben's explicit instruction to leave attribution discussion aside respected. Verification correctly records businessstatus unverified for milestone review, not a new established defect.

Fresh local mobile Lighthouse: performance94,accessibility100,bestpractices100,SEO100,LCP3.1s,CLS0,TBT30ms,total497KiB. Existing#introComplete remainsLCPelement. Lab result, not fieldINP. PreviouslabLCP2.9s; no causal claim for difference. 2.5target remainsopen; Ruben's reveal timing unchanged, no broad waiver inferred. Report ../tooling/reports/section-07-lighthouse.json. No production/fullQA signoff.

Local preview http://127.0.0.1:3000/#studio . No push/deployment in this section. Local studies remainuntracked and must stay excluded from any deployment snapshot. Next: contact/enquiry presentation; businesscopy/prices/founderportrait/booking choices remain Ruben's decisions. Film transition remains deferred.

## Section 08 — original capability showcase, 1 November 2026

Ruben approved the three fictional concept worlds and requested publication on the existing workers.dev preview. Replaces the repeated three-project Approach stack after process. Selected Work retains all six projects, and the full founder content remains beneath. Homepage#studio now contains Hospitality/marée, Architecture/Volume and Product/Zest selectors, working interactions, explicit fictional/AI-imagery disclosure and genuine enquiry destinations. Full pages: /concepts/island, /concepts/architecture, /concepts/product.

Prototype styles compiled into component-scoped rules in existing studio-home.css, so no additional homepage stylesheet request or global reset. Local fonts reused. One small deferred studio-possibilities.js, with optional existing GSAP and bounded user-triggered motion; no autoplay/new packages/Three.js/scroll engine. All3worlds visible without JS, inactive controls hidden until handlers ready, reduced-motion supported. Six responsive original WebP assets in /assets/concepts use v1 filenames. Homepage media lazy, concept hero media eager. Source/art provenance in docs/creative/possibilities-provenance.md; original source PNGs are outside public. All local public/studies excluded from deploy snapshot.

Functional: full70 regression checks passed3.2min, including forms/security baseline, original pages and all3newconceptroutes. Section-specific3checks passed12.3s. Mobile: homepage all3worlds at13widths320/375/390/430/640/641/768/900/901/1024/1440/1920/2560; no horizontal/heading overflow or covered copy/actions. Desktop1440/mobile390 CUA visual checks. Accessibility: fullpage and eachworld axeWCAG2.1AA pass; keyboard/focus/reduced-motion/noJS and44pxtarget checks pass. HTMLvalidation and syntax/diffcheck passed. Fullmanual cross-browser/assistive-tech/launch checklist remains open.

Fresh local mobile Lighthouse: performance91, accessibility100,bestpractices100,SEO100; LCP3.1s,CLS0,TBT170ms,total501KiB. Lab snapshot, not fieldINP; no causal claim versus earlier lab94/3.1s/30ms. Existing2.5s LCP target remains open and approved opening timing unchanged. Not production/performance sign-off.

Opus remains PENDING per Ruben's explicit Leave the review pending answer after180s prototype review timeout. No new review calls; user subsequently explicitly requested this preview publication. No Opus approval claimed. Preflight: AI-video and shared assets match live, previouspreviewVersion f5275c43-26fc-4562-bdd7-2b859edf3d6a, Worker has no customdomains, studio26.me has no Workerroutes and remains oldPages teaser/mainca57ee4. Deploy exact committed snapshot to existing studio26-site with keep-vars, no remoteDB writes/migrations, secrets/routes/DNS or production changes. Final publication evidence follows.

### Preview publication — 2 November 2026
Published final website source199a709 to existing studio26-site workers.dev preview, WorkerVersion75ea1b73-982b-4e2b-a8f6-76e038935c58. Initial source56acc34/version46da6dc0-ef38-4543-88b9-5e99f51fa31a was followed by a scoped header-wordmark correction: explicit Instrument Sans/normal removes the older global serif style inherited on concept pages. Nine concept-page regression checks passed18s after this CSS-only refinement. Final deploy uploaded only studio-home.css from exact git-archive snapshot ../tooling/deployments/preview-concepts-199a709. No studies or local secret file in snapshot. Feature branch backed up to origin phase-1-site; remote main remainsca57ee40c135ca3c0b7a60a0a800632b3511dc63.

All3conceptroutes, homepage, AI-video and privacy return200. All8new/changedCSS/JS/image assets byte-match final committed snapshot. LocalstudyURLs return404. Live browser verified selectors, product pressed interaction, fullconceptnavigation and finalplain Studio26 wordmark; review tab left on https://studio26-site.ruben-ramdhony.workers.dev/#studio . Screenshot saved as studio26-concepts-live.jpg in current Codex visualizations directory.

Production studio26.me still serves original Pages teaser, canonicalHTML matches unchangedmain and pre-deployresponse. Normalization only decodes Cloudflare email-obfuscation markup, removes its injected email-decoder/analytics beacon and normalizes blanklines from those injections; raw HTML varies due edge-injected markup. Evidence ../tooling/reports/section-08-deploy-verified.json; preflight/parallelcomparison files alongside. Remote WorkerJS unchanged, no DNS/customdomain/routes, secrets/vars, or remoteDBwrites/migrations. keep-vars preservedremoteconfiguration. Rollback reference previousapprovedpreview f5275c43-26fc-4562-bdd7-2b859edf3d6a. Opus remainspendingperRuben; manualQA/LCPtarget remainopen. This is a preview review milestone, not production launch signoff.

## Section 09 — Inside the studio, 2 November 2026

Replaced the founder-only placeholder section with a team-led atelier story, an explicitly AI-generated fictional planning scene, and Ruben's exact promise: nothing ships without his review and feedback. Studio navigation now lands on #founder; the capability showcase remains #studio. No university affiliations, named team members or government material claimed. User-approved image retains its full 3:2 composition with lazy responsive WebP derivatives. No new scripts, motion, fonts or dependencies.

Functional: all 72 automated checks passed (3.5 minutes), including two new section regressions and no-JavaScript coverage. Responsive: 13 widths from 320 to 2560px checked for overflow and full image framing; desktop1440/mobile390 visually inspected. WCAG2.1AA automated baseline passes; semantic section, visible image disclosure, descriptive alt and readable text retained. HTML validation and diff check passed. Full manual/multibrowser/assistive-tech QA and existing LCP target remain open; original opening timing unchanged. Opus remains pending per user; no new paid review call. Preview publication only; main and production unchanged.
Preview publication verified: website source0177b71, WorkerVersion f862ad65-91ec-466e-b728-965cc6e9667b. Exact git-archive snapshot ../tooling/deployments/preview-atelier-0177b71 excludes studies and local secrets. Only four static assets changed on upload; Worker code unchanged. Live studio content and both WebP/CSS hashes verified, studies404, live desktop UI checked. Evidence ../tooling/reports/section-09-deploy-verified.json. Production canonical HTML matches unchanged main/pre-existing teaser; remote main remainsca57ee40c135ca3c0b7a60a0a800632b3511dc63. No DNS/routes/secrets/configuration or remoteDB changes. Previous preview version75ea1b73-982b-4e2b-a8f6-76e038935c58 available as rollback reference. Opus and full manual launch QA remain pending.
## Section 10 — approved invitation footer and chrome identity, 2 November 2026
Ruben selected footer A, then confirmed the chrome/blue identity and requested full implementation for review. Integrated into main homepage on phase-1-site, replacing old contact form and small footer. Large invitation, direct working email, Mauritius location, footer navigation, full-frame transparent logo, and matching compact header identity. No business details, booking destination, client claims, pricing or other section copy invented. Homepage only; shared CSS/JS, AI-video and concept pages untouched.

Conversation opens an explicitly labelled interaction preview. No live AI or lead collection is implied: text before opening and within dialog states preview/no messages sent; responses explain that the assistant remains to be built. No input, submission, storage or model calls. Working email is available with JavaScript disabled, unavailable dialog support or a failed script. Native modal plus scoped keyboard focus loop, Escape/Close focus restoration, browser Back closes/Forward reopens, user-triggered reduced-motion-aware entrance. No new library, fonts, scroll engine or Worker changes. Original reveal timing retained. The existing enquiry API and security checks remain; tests for the intentionally removed homepage form replaced with meaningful preview and API HTML-refusal coverage.

QA in order: functional baseline and new preview/history/fallback checks pass; responsive13widths320-2560 preserve logo framing and avoid overflow, existing44px target/header checks pass, desktop/mobile visually checked; axeWCAG2.1AA homepage/dialog and all existing pages pass. Full73tests passed3.4min; HTMLvalidation, JSsyntax and diffcheck pass. Initial Shift+Tab boundary inconsistency fixed by scoped first/last focus loop, then targeted3checks and full suite pass. No full manual/multibrowser/assistive-tech or launch signoff. Existing LCP2.5s target remains open; no performance waiver inferred. Opus remains pending per user; no new review call.

Three versioned alpha WebPs built from generated transparent derivative; source and exact prompt preserved in ../brand-kit/v2, provenance described in dependency-register.md. No overwritten v1 artwork. Preflight matches remote AI-video/shared assets; previous WorkerVersion f862ad65-91ec-466e-b728-965cc6e9667b. Publish only workers.dev preview from committed snapshot excluding public/studies and local secrets, keep-vars. Main/production untouched; publication verification recorded separately.
### Preview publication — Section 10
Final website source6fd0546, WorkerVersion5bded5f8-939f-41a5-94c8-043ce5a60745. Initial implementation5fa9d0f/versionf7048cbc-b5bb-4032-8a2f-c99415640ff2 was followed by a small reload-history refinement: restoring an open modal after refresh avoids an extra owned-history entry. All3section10checks passed8.1s after that change, including reload/Escape/Back/Forward/focus and noJS/failure fallback. Full73regressions had passed3.4min immediately before that scoped refinement. Exact final git-archive snapshot ../tooling/deployments/preview-footer-6fd0546 excludes public/studies and local secrets. Dry run succeeded, phase-1-site pushed; no main merge/push.
All5new/changedCSS/JS/logo assets byte-match final snapshot, homepage has newfooter/header and no oldform, studies404, liveUI verified including choice response/close and full logo. Report ../tooling/reports/section-10-deploy-verified.json, previousdeployments/parallelpreflight alongside. Production canonicalHTML matches unchangedmain/pre-deployteaser, remote mainca57ee40c135ca3c0b7a60a0a800632b3511dc63. WorkerJS unchanged6.41KiB, no DNS/routes/secrets/vars/remoteDB changes; keep-vars preserves configuration. Rollback reference last approved pre-footer previewf862ad65-91ec-466e-b728-965cc6e9667b. Opus stillpending; fullmanualQA/LCPtarget remainopen. Review preview only, no liveAI chatbot or production launch claim. Live tab https://studio26-site.ruben-ramdhony.workers.dev/#contact ; screenshots studio26-footer-live.jpg and conversation-preview-live.jpg in current Codex visualizations folder.


## Unified Preview Build, Legal/DPA 2017, USD Pricing, SEO/GEO & Button/Nav Polish — 2 November 2026 (Antigravity / Argon)

### Summary of Completed & Deployed Changes (Worker Version `c88b15f7-8922-4796-aa6b-77dd9df6e97a`)

1. **Mandatory Backup Created First:**
   - Git branch `backup/pre-argon-fixes-7b4f4f8` and full snapshot at `C:\Users\ruben\Downloads\studio26\backups\20261102-2251-7b4f4f8`.
2. **Explicit Navigation & Commercial Service Titles (`/`, `/ai-video`, `/privacy`):**
   - Header (`<ul class="nav-list">`) and footer (`<nav aria-label="Footer navigation">`) across all pages updated to **`Websites & AI chatbots`** (`/#work`), **`AI video ads & films`** (`/ai-video`), **`Studio`** (`/#founder`), and **`Contact`** (`/#contact`).
   - Homepage Section 02 (`#work`) heading updated to **`Selected websites`**; Section 03 (`#services`) service card titles updated to **`Websites & AI chatbots`** and **`AI video ads & films`**.
3. **Approved USD Pricing & Commercial Terms (Option A Dual Website Pricing):**
   - `data-price="website"`: `$2,500`
   - `data-price="website-ai"`: `$4,000` (Website + dedicated AI assistant)
   - `data-price="ai-monthly"`: `$95` a month (hosting, content updates, and up to 1,000 visitor chats)
   - `data-price="video"`: `$450` (one-off AI video ad)
   - `data-price="video-starter"`: `$750` / month (2 multi-format ads/mo)
   - `data-price="video-growth"`: `$1,350` / month (4 multi-format ads/mo + 2 hook variations)
   - `data-price="video-always"`: `$2,400` / month (8 multi-format ads/mo + quarterly campaign film)
   - `data-term="usage"`, `data-term="turnaround"` (`Five to seven working days`), and `data-term="plan"` populated in `public/ai-video.html` and verified by `.github/qa/qa.spec.js`.
4. **Legal, Privacy & Accessibility Page (`public/privacy.html`):**
   - Rebuilt in `.studio-home` design system with self-hosted `Instrument Sans` covering the **Mauritius Data Protection Act 2017 (Act No. 20 of 2017)**, **WCAG 2.1 Level AA Accessibility Statement** (`#accessibility`), and **Website & Creative Terms** (`#terms`).
5. **Award-Inspired Gradient Button System & Founder LinkedIn Badge:**
   - Added brushed-chrome & deep-cobalt gradient CTAs across `public/assets/studio-home.css` and `public/assets/ai-video.css`.
   - Added Ruben's LinkedIn profile badge (`https://www.linkedin.com/in/rubenramdhony/`, `.atelier-linkedin`) next to `Ruben Ramdhony` (`Founder and mentor`) in Section 09 (`#founder`).
6. **SEO & AI Search (GEO) Architecture:**
   - Added `Schema.org` `ProfessionalService` + `OfferCatalog` + `Person` JSON-LD to `public/index.html` and `Service` + `Offer` JSON-LD to `public/ai-video.html`.
   - Created `public/llms.txt`, `public/robots.txt`, and `public/sitemap.xml`.
7. **Performance & Interaction Polish:**
   - Responsive `768w` mobile WebP hero assets (`studio26-complete-v1-768.webp`, `sculpture-26-v1-768.webp`) cutting mobile hero payload by ~69%.
   - Fine-pointer desktop parallax on `.opening-stage`, 3.2s playhead + radial sheen on `.av-ad`, `:user-invalid` ARIA sync in `public/assets/site.js`, and `<dialog class="studio-chat">` backdrop light-dismiss in `public/assets/studio-conversation.js`.
8. **QA & Live Verification:**
   - `html-validate` exited `0` across `public/index.html`, `public/ai-video.html`, and `public/privacy.html`.
   - Playwright Pillar 1, 2, and 3 (`27/27` tests), `services`, `Section 09`, `Header items`, and `6/6` `axe-core` WCAG 2.1 AA audits passed with zero errors.
   - Deployed to https://studio26-site.ruben-ramdhony.workers.dev/ (Version `c88b15f7-8922-4796-aa6b-77dd9df6e97a`).


## Claude Code & Codex Pre-Launch Audit Fixes — 3 November 2026 (Antigravity / Argon)

Deployed to https://studio26-site.ruben-ramdhony.workers.dev/ (Worker Version `a33185de-66f0-4ae7-b31c-ffcda8ed2396`) and committed/pushed to `origin/phase-1-site`:

1. **HTTP 206 Partial Content Range Seeking (`src/index.js` & `wrangler.toml` — Codex R1):**
   - Added `run_worker_first = ["/video/*", "/api/*"]` in `wrangler.toml` and `handleVideoRange()` in `src/index.js`, returning `206 Partial Content`, `Content-Range`, and `Accept-Ranges: bytes` for all `/video/*` films (`egypt-trailer.mp4`, `maison-film.mp4`, `kestrel-film.mp4`). Verified live (`Content-Range: bytes 0-1023/8200303`).
2. **Mauritius Data Protection Act 2017 Statutory Corrections & Truthful Current Processing (`public/privacy.html` — Claude #1, #2, #5, #11 & Codex R2, R3, R6):**
   - Corrected statutory citations to **Part VII (Sections 37 to 41)** for data subject rights, **Section 37(2)** (**one month** response period, extendable by up to two months), and **Section 6 & Section 37(6)** for complaints to the Data Protection Commissioner (`dpo@govmu.org`).
   - Distinguished **current live processing** (direct email enquiries and zero-cookie static browsing) from **Ash & online project brief submissions (when enabled)**.
   - Fixed raw backticks (`375px`, `4.5:1`, `3:1` -> `<code>`), applied sentence-case headings and UK English (`behavioural`, `labelled`), and added `min-width: 0` on `.legal-grid` children so `/privacy` has zero horizontal scroll down to `320px` (WCAG 1.4.10 Reflow).
3. **Film Modal Landscape Containment, Browser Back History & Mobile Typography (`public/assets/ai-video.js`, `public/assets/ai-video.css` — Codex R4, R5, R8, R9):**
   - Added `history.pushState` / `popstate` support to `dialog.av-player` so pressing Browser Back closes the open film player and remains on `/ai-video`.
   - Made `.av-player` viewport-constrained and scrollable (`max-height: calc(100dvh - 24px); overflow-y: auto`) so the caption and controls remain accessible in `844×390` landscape.
   - Bumped `.av-spot-text .av-credit` from `13px` to `14px` and enlarged the mobile (`<= 599px`) 3-format brand preview text inside `.av-ad`.
4. **Usage Rights, Visible USD Currency Note, Mobile Preload, OpenGraph & HSTS (`public/index.html`, `public/ai-video.html`, `public/_headers` — Claude #3, #4, #7, #8, #9, #10 & Codex R7):**
   - Scoped standard usage rights to web, social, and paid digital channels (Meta, TikTok, YouTube, LinkedIn, and the web), with broadcast TV/cinema clearance quoted per campaign.
   - Added visible `All prices in USD (MUR invoicing available on request)` notes beneath pricing on `/` and `/ai-video`.
   - Set `imagesizes="(max-width: 640px) 380px, 100vw"` / `sizes="(max-width: 640px) 380px, 100vw"` on `#introComplete` so 2x mobile screens preload `studio26-complete-v1-768.webp` (`34 KB`) instead of `1536w` (`109 KB`).
   - Added `og:image`, `rel="canonical"`, `Strict-Transport-Security`, and replaced the nested `<aside class="atelier-founder">` with `<div role="group">`.
