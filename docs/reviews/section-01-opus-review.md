**Section 01 review: opening markup, CSS and intro script**

There are no hard blockers. With no JS, without GSAP and with reduced motion on, the complete artwork stays visible and all content stays reachable. Two high-severity issues should still be fixed before ship, because they affect two stated requirements: pause/resume and the "finite reveal".

### High

**H1: The Resume button can appear dead (`studio-intro.js:42`, `:84–86`, `:93`)**
- **Cause:** `inView` comes from the *stage*, at a 15% threshold. The button sits *below* the stage. When the stage is under 15% visible but the button is on screen, the timeline auto-pauses and the label says "Resume opening".
- **Impact:** The first click sets `userPaused = true`, so it stays paused and announces "Opening paused." The second click clears it, but it is still paused. Keyboard and screen-reader users see a control that does nothing. Replay (`play()` → `syncPlayback`) has the same problem: it hides the complete mark and then sits paused on a blank sliver.
- **Minimal fix:** Observe `section`, not `stage`, with `threshold: 0`. An explicit Resume or Replay click should also count as presence. Also read the last entry (`entries[entries.length - 1]`) rather than `entries[0]`, because the observer can batch several entries.

**H2: Late start hides artwork the user already saw (`studio-intro.js:71–76`, `:52`)**
- **Cause:** The complete mark paints first (`fetchpriority="high"`). The sculpture is only requested after deferred scripts run and the complete mark has decoded. On a slow connection the swap can come seconds later: the finished artwork vanishes and builds again. If the user has already scrolled, it vanishes and waits paused.
- **Impact:** A visible flash and regression after the page has settled. It undercuts "completed artwork visible" for exactly the users on slow connections.
- **Minimal fix:** Give autoplay a time budget. For example, autoplay only if `performance.now()` is under about 1500 ms when `sculpture.decode()` resolves, and the user hasn't scrolled. Otherwise call `settle()` and show "Replay opening". You could also start the sculpture fetch earlier with `<link rel="preload" as="image">`.

### Medium

**M1: Stage is off-centre between 1800 and about 1975 px wide (`studio-home.css:54`, `:69–71`)**
- **Cause:** At those widths the stage is 1800 px, which is wider than the content box. Auto margins then resolve to 0, so the stage starts at `--px` (up to 88 px in). The right side is hard-clipped by `.opening { overflow: clip }`, which loses the right-hand fade from the mask.
- **Minimal fix:** Replace the margins and delete the media query:
  `margin-inline: calc((100% - min(100% + 2 * var(--px), 1800px)) / 2);`
  This gives `-var(--px)` below 1800 px and centres the stage above it.

**M2: GSAP transform and CSS `translateY(-50%)` conflict (`studio-home.css:55`, `studio-intro.js:53`)**
- **Cause:** GSAP reads the stylesheet transform from the computed matrix as a fixed pixel `y`. If the window is resized or rotated mid-animation, the sculpture drifts vertically until `clearProps`.
- **Minimal fix:** Centre the images without a transform: `inset: 0; width: 100%; height: 100%; object-fit: cover;` and remove `top`/`transform`. Alternatively, add `yPercent: -50` to the `gsap.set` call.

### Low

- **L1 (`studio-intro.js:38`):** If reduced motion turns on while the button has focus, `settle()` hides it and focus drops to `<body>`. Fix: move focus to `#opening` (with `tabindex="-1"`) or to `.opening-project` first.
- **L2 (`studio-intro.js:96–99`):** Turning reduced motion *off* mid-session starts the animation straight away. Settling and offering Replay is less surprising: call `settle()`, then `prepare()` without `play()`.
- **L3 (`studio-intro.js:96`):** Older Safari (before 14) has no `MediaQueryList.addEventListener`. The script throws before `prepare()`. This fails safe (static artwork), but `motion.addListener` as a fallback would keep the enhancement working there.
- **L4 (`section-01-markup.html:9`):** The `data:` GIF placeholder needs `img-src data:` in the CSP, or the console logs a violation. Removing `src` while the image is `hidden` avoids that.
- **L5 (`studio-intro.js:83`):** Replay is never announced, unlike pause and resume. Pass `announce=true` from the click path after `play()`.

### Checked and OK
- **Without JS:** The complete artwork shows and the sculpture is `hidden`. The `!important` reduced-motion CSS (`:103–106`) protects the end state even mid-timeline.
- **Accessible names:** The stage has `role="img"` with a label, and its child images use empty alt text. The button's name comes from the text label, with the glyph `aria-hidden`.
- **Races:** The `generation` ticket stops stale `prepare()` calls. Tab suspension uses `visibilitychange`.
- **Contrast** (my own calculation, not tool-checked): `--mid` on `--paper` is about 6.1:1, and white on `--blue` is about 8.2:1. Both pass AA.
- **Tap targets:** Actions and the control are at least 48 px high.
- **Image ratio:** At 1.5 the image is taller than the 2.8 and 1.65 stage frames, so cropping is vertical background only, as intended.

### Optional taste
- `pointer-events: none` on `.opening-heading` (`:51`) stops users selecting the headline text. You could limit it to the overlap area.
- "Ⅱ" (a Roman numeral) as the pause glyph may render unevenly across fonts. "❚❚" or an inline SVG would be more consistent.

### Not verified
- **Mobile headline width:** I estimated that "worth feeling." fits at 320 px (about 263 px of 276 px available). That's a guess from typical glyph widths, not a rendered measurement.
- **Focus ring:** I couldn't check focus-ring contrast on `.opening-project` against the ink background, because the base CSS wasn't supplied.

AGENT_TASK_COMPLETE:claude-20261031-180448-b14cd8c0
