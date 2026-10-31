**Verification: Section 01 fixes against the previous review**

**Result: no remaining blockers.** Every fix from the previous review is in place. I found no regressions in the two files I was given.

| Item | Status | Evidence |
|---|---|---|
| **H1** | Fixed | The observer watches `section` with `threshold: 0` and reads the last entry (`studio-intro.js:94–99`). A click sets `inView = true` (`:87`). The button sits inside the observed section, so it can no longer be on screen while the section counts as out of view. |
| **H2** | Fixed (JS side) | Autoplay only starts if `performance.now() < 1500`, the user hasn't scrolled, and the tab is visible. Otherwise it calls `settle()`, which shows Replay because `frameReady` is true (`:79–80`, `:40`). Scrolling is tracked at `:20–21`. |
| **M1** | Fixed | The 3-value margin shorthand centres the stage at every width, and the old media query is gone (`studio-home.css:54`). The ≤700 px rule only overrides the top and bottom margins, so the centring holds (`:92`). |
| **M2** | Fixed | `gsap.set` explicitly sets `y: 0, yPercent: -50` (`studio-intro.js:55`), so it overrides the parsed pixel matrix. `complete` is only given `autoAlpha` and `clipPath`, so GSAP never writes a transform to it. |
| **L1** | Fixed | Focus moves to `.opening-project` before the button is hidden (`:39–40`). |
| **L2** | Fixed | `preferenceChanged` calls `settle()`, then `prepare(false)`, which ends in `settle()` and offers Replay (`:101–104`, `:80`). |
| **L3** | Fixed | It uses `addEventListener` and falls back to `addListener` (`:105–106`). |
| **L4** | Waived | Your reasoning holds: the CSP already allows `img-src data:`, and HTML validation requires a `src` on the hidden image. |
| **L5** | Fixed | Replay calls `setState(..., true)` after `play()`, which announces "Opening playing." (`:88`). |

**Optional hardening (not blockers)**

1. **The Pause/Resume toggle still depends on `userPaused` (`studio-intro.js:89`).** This path is now very hard to reach. If the timeline is ever auto-paused while `userPaused` is false, the first click still pauses it. A sturdier version would be `userPaused = section.dataset.introState === 'running';` in place of `userPaused = !userPaused;`.
2. **`settle()` assumes `.opening-project` exists (`:39`).** If it is ever missing from the markup, `.focus` throws. A guard would prevent that: `var target = section.querySelector('.opening-project'); if (target) target.focus(...)`.
3. **A restored scroll position can count as "scrolled" (`:21`).** If the browser fires a scroll event while restoring position before `decode` resolves, autoplay is skipped. That fails safe (the static mark plus Replay), so it is acceptable.

**Not verified (outside the files I was given)**
- **Second-frame preload:** I couldn't confirm that it only happens when motion is allowed (for example, a `<link rel="preload" media="(prefers-reduced-motion: no-preference)">`). That would be in the markup, which wasn't supplied.
- **Reduced-motion CSS classes:** I couldn't confirm that `.opening-mark` and `.opening-sculpture` (`studio-home.css:101–102`) match the image classes in the markup.
- **Native image size:** I took 1536×1024 from your note and didn't check it.