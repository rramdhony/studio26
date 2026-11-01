VERDICT: PASS

This verdict covers only Section 02 (homepage selected-work layout, `db29b25..head`). It is not a full-site or launch approval.

| Severity | file:line | Finding | Suggested fix |
|---|---|---|---|
| Should fix | `public/assets/studio-home.css:98-107` (markup not in diff) | The image `sizes="(min-width:900px)30vw,100vw"` no longer matches the layout. At about 1440px a 7-span image renders around 690px wide, not about 432px. At 1024px it is around 490px, not about 307px. Between 641 and 900px it renders at about 50vw, not 100vw. Because there are only two candidates (800/1400), the browser should still never fetch one that is too small, so nothing looks wrong today. The real issues are some extra downloading on tablet and a hint that will mislead future edits. At exactly 900px, both `max-width:900px` (2 columns) and `min-width:900px` (30vw) match. | In a later markup section, set `sizes` to the real spans, roughly `(min-width:901px) 55vw, (min-width:641px) 50vw, 100vw`, and line the breakpoint up with the CSS. I'm not approving this exact value. Measure it first. |
| Should fix | `studio-home.css:135` | `.work-desc` has no limit on line length. A 7-span column at 1440 to 1600px fits about 85 to 95 characters at 16px, which is over the QA Standard's 75-character limit if a description runs to more than one line. I couldn't see the copy, so whether it actually breaks the limit is unverified. | Add `max-width: 60ch` to `.work-desc`. |
| Should fix | `.github/qa/qa.spec.js:43-59` | The focus test checks only that `outlineStyle !== 'none'`. It does not check that the outline is actually visible: it isn't clipped by an ancestor with `overflow:hidden` (for example, a leftover base `.work-card` rule from the old card styling), and its colour isn't checked. It also calls `link.focus()` directly instead of reaching link 1 with Tab. | Reach the first link by Tab from the element before it. Also assert that no ancestor of `.work-link` has `overflow` other than `visible`, or compare screenshot pixels around the focus ring. |
| Nit | `studio-home.css:114-119` | If `--bg` is the page background (#e8e6e2), the picture padding just shows as empty space and the panel has no visible edge. That is fine if it's intended. | Confirm the design intent. If a visible panel is wanted, use a tinted surface token. |
| Nit | `studio-home.css:131,159` | Names are 25px at 641 to 900px but 30px at 640px and below, so the size goes up as the screen narrows. Nothing stops a long single-word name from overflowing at 375px. | Use a clamp on mobile and add `overflow-wrap: break-word` to `.work-name`. |

**Checks that passed in the diff:**
- **Colour contrast**, worked out from the stated hex values (relative luminance):
  - Focus/hover blue #173fc5 on #e8e6e2: about 6.6:1.
  - Secondary #505459 on #e8e6e2: about 6.1:1.
  - Body #171a1c on the background: well above 4.5:1.
  - All pass AA for text and the 3:1 focus-ring requirement.
- **Layout order:**
  - The `nth-child` pattern gives 7/5, 5/7, 7/5 across three rows, with the even panels offset.
  - DOM order matches visual order, so Tab order follows reading order.
  - The test checks that each card sits lower than the one before it, at all six widths.
- **CSS cascade:** the `:nth-child(n)` resets (specificity 0,3,0) come later in the source than the 0,3,0 span and offset rules, so they win at both breakpoints.
- **Image framing:** `aspect-ratio: 8/5` with `height:auto` and `object-fit: contain` on native 8:5 images means no cropping and no letterboxing. The test checks the 1.6 ratio.
- **Layout shift:** the aspect ratio is reserved before the image loads. The images are lazy-loaded below the fold, so CLS should not change.
- **Performance:** CSS only, with no JS, assets or motion added. First-view weight and JS budget are unchanged. The 2.8s baseline LCP is not caused by this change.
- **Mobile:** one column at 640px and below, as the QA Standard requires. The smallest text is 14px (URL, underlined) and descriptions are 16px. Each link is the whole card, well over 44×44px. The test checks for no horizontal overflow.
- **No-JS:** the test covers all six links being present and named.
- **Browsers:** `aspect-ratio` and `object-fit` work in current Chrome, Firefox and Safari (Safari 15 and later). I checked this from memory, not in a browser.

**Not verified:**
- The live preview at any width. I had no browser access, so I didn't see the rendering, focus ring, hover or screenshots.
- What `--bg`, `--ink`, `--mid`, `--blue`, `--sans` and `--px` actually resolve to. I assumed they match the stated hex values and Instrument Sans.
- The base `.work-grid`, `.work-card` and `.work-link` rules, and the load order of the stylesheets. In particular, whether any base `overflow:hidden` clips the 3px-offset focus outline.
- The image markup (`width`/`height` attributes, alt text, srcset), which wasn't in the diff.
- The length of the description copy, for the 75-character limit.
- Whether a sticky header hides a focused card (WCAG 2.2 "focus not obscured").
- That `BASE_URL` is defined in `qa.spec.js`, and the results of the full regression run, which was still in progress.
- Lab LCP and CLS for this head commit.