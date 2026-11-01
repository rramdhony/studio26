# Studio26 build status
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
