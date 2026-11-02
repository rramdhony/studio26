# Chrome interaction prototype and Claude branch check

2 November 2026. Isolated design study, not a published homepage change.

## Verified branch state
Codex remains on phase-1-site at9dbeea2. Claude's ai-video-rethink at94ffc89 contains merge6d78ba6, which brought the latest homepage into the video branch. The video rebuild has not merged back into phase-1-site. The AI-video worktree was clean when inspected. Eight committed files differ, including the replacement hero/page, scoped ai-video.css/js, ScrollTrigger, tests and direction/handoff documents. No Worker or shared site.js changes in that branch diff.

The new handoff records the hero approval, removal of See the layers, and Egypt as the third spot. The source confirms a phone feed breaking out into cinema, muted in-view loops, pause/reduced-motion setup and user-opened film dialog. This is a source/context review, not a full AI-video QA verdict. Its reported71/73environment results were not adopted as independent Codex verification. Header identity/footer alignment and live reduced-motion preference changes should be checked during that page's eventual integration. Possible family-studio founder wording remains a suggestion, not approved homepage copy.

Earlier handoff sections about founder placeholder, homepage form, source colours and other launch details are historical and must be checked against Ruben's later decisions. No pricing/model/provider or client attribution assumptions adopted. Opus remains pending per Ruben; no review call was made.

## Study
Local URL: http://127.0.0.1:3002/studies/chrome/
Source: public/studies/chrome/index.html, chrome.css, chrome.js. Entire folder remains local/untracked and excluded from committed preview deployment snapshots.

Uses the approved transparent chrome/blue raster and existing Instrument Sans/palette. A small native WebGL shader simulates a soft moving light. No3Dmesh, normal-map asset, new library, image generation or font. It preserves the silhouette and blue material; no geometric parallax or true environment reflection claimed. The control panel and explicit simulated-light disclosure are review UI. The study omits the two-frame autoplay opening locally so the experiment can be evaluated alone. Canonical opening script, timing and homepage remain unchanged.

Pointer movement is bounded to the artwork; keyboard/touch range changes light direction; Compare original restores the unmodified image. No scroll interception or orientation permission. Static artwork survives noJS, noWebGL, context loss and reduced motion. Draw-on-demand interpolation stops when settled/offscreen/hidden; rendering is capped at1.8M pixels and1.5DPR. Responsive image source changes update the texture. No per-frame layout reads.

Functional checks: rendering differs between left/right light, keyboard range, compare original and renderer-loss fallback pass. Responsive:13widths320/375/390/430/640/641/768/900/901/1024/1440/1920/2560 bounded;44px controls. Automated WCAG2.1AA checks clear desktop/mobile; noJS/noGL/reduced-motion and dynamic preference switching checked. Idle draw calls stop. HTMLvalidation and JSsyntax pass. Native review-browser keyboard interaction verified; desktop/mobile screenshots inspected. No full manual/cross-browser/performance or production signoff. Existing LCPtarget remains open. Original-artwork comparison is important: this only adds restrained lighting, not a wholly different identity.

The Worker dev session became unresponsive, including the unchanged root route. It was stopped; the isolated static preview runs on3002 with clean HTML routes. No API/database is served by that static harness. Claude's ports/worktree were not changed. Studies links into the old AI-video page show phase-1-site, not Claude's unmerged rebuild.

Evidence: current Codex visualizations folder check-chrome-study.cjs, chrome-study-qa.json, chrome-study-desktop.png, chrome-study-mobile.png and chrome-stage-left/right.png. Backups: ../tooling/backups/chrome-study-v1.

## Scope retained
Egypt lives as the third video on /ai-video. The earlier standalone homepage/case-study proposal is explicitly superseded. No family mention added to the founder section. No source edits in site-ai-video, no branch merge, no push/deployment and no changes to studio26.me or the existing workers.dev preview.

Next: Ruben reviews the simulated lighting. If approved, determine whether this restrained effect suffices or a correctly modelled3Didentity is worth building, then agree production interaction/UI and rerun performance before integration.