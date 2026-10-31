VERDICT: PASS WITH FIXES

| Severity | file:line | Finding | Suggested fix |
|---|---|---|---|
| Must fix | `public/index.html:19`, `public/assets/studio-warm-light.css:7` | LCP is already 2.8 s against the 2.5 s budget. This diff adds a font preload ahead of the LCP image preload and a second render-blocking stylesheet. Syne also swaps in on the h1 with no metric-matched fallback, which can shift layout (CLS) because Syne is much wider than Instrument Sans. There is no LCP/CLS evidence for the new head. | Before the next section, re-measure LCP, CLS and first-view weight against the budgets. If they regress, try: merging this sheet into `studio-home.css`, putting the image preload first, or adding an Instrument Sans fallback `@font-face` with `size-adjust`. |
| Should fix | `studio-warm-light.css:31-36` | `max-width: none` makes Services full width. At 1440 the 7fr column is about 740px of 17px text, so lines may run past 75 characters. | Put a `max-width` (about 65ch) on `.service-list`, or constrain an inner wrapper. |
| Should fix | `studio-warm-light.css:31-36, 50` | The gradient passes through #173fc5, which is the site's link/button blue. The diff doesn't show whether any blue or `--mid`/`--ink` text, buttons or links inside `.services` still use base colours. Also, `outline-color: #fff` only has an effect if the base focus rule uses `outline`, not `box-shadow`. | Check every element inside `.services` for contrast against #101632–#3158d6, and confirm the focus mechanism. |
| Should fix | `studio-warm-light.css:53-57` | Process also becomes full width. The effect depends on base padding and container rules not supplied. | Confirm content alignment at 1440 and wider. |
| Should fix | dependency register (study files) | The study files stay under `public/studies/colour`, so they will deploy publicly. | Exclude them from the deploy, or add `noindex` and keep them out of navigation. |
| Nit | `studio-warm-light.css:60` | The step border #72788b is about 2.6:1 on #b8c8f3. That only matters if the border carries meaning. | Darken it if it's meant to be a meaningful separator. |
| Nit | `studio-warm-light.css:16, 77` | The h1 is 66px at 640px but 62px from 641 to about 873px. Bigger on the narrower screen is an odd jump. | Optional: line up the clamp endpoints. |
| Nit | `studio-warm-light.css:21` | `.opening-project` has a hover background but no matching `:focus-visible` style. | Add `:focus-visible` to the same rule. |

My own checks: blue numerals on #f6cbb0 come out at about 5.6:1, and #30384b on peach is above the 7.02 you supplied. The cascade order is right: the new sheet loads after `studio-home.css`, at equal specificity. The OFL licence ships next to the font, which satisfies condition 2. No motion, JS, copy or form changes appear in the diff.

**Not verified**
- Rendering at any width. No browser was used, and the 58-test run is unfinished (22 of 58 passed).
- Rules in the base `studio-home.css`: specificity, media-query values overridden by the new sheet (for example `.work` and `.opening-stage` margins at ≤900), and colours on children inside `.services` and `.contact`.
- Contrast of error and success text on #101632 compared with the previous contact background.
- That the font binary is the declared variable 400–800 Latin subset, and its file size.
- That the Syne URL 404s nowhere in production, and the `_headers` caching for `/assets/fonts/`.
- Long-word reflow of the h1 and service names in Syne at 375px (depends on copy not supplied).
- Letter-spacing glyph collisions at weight 600.
- LCP, INP and CLS lab figures.