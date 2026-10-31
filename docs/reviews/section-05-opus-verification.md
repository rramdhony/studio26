VERDICT: PASS (only for the bounded colour and type implementation. This is not launch or performance sign-off, and full-site QA is not complete)

| Severity | file:line | Finding | Suggested fix |
|---|---|---|---|
| Open known target (not a code bug) | `public/index.html:16`, opening reveal | LCP is 2.9 s against the 2.5 s budget. Ruben chose to keep the current reveal timing. The prior Must fix asked for evidence, and that is now supplied: CLS is 0, and the image preload now comes first. | Record in the section log: "LCP target open; Ruben knowingly keeps current reveal". Re-check at the pre-launch gate. |
| Should fix | Study files under `public/studies/colour` (untracked) | These files are untracked, so a CI checkout won't deploy them. A local `wrangler deploy` uploads the filesystem, though, not git. | Add `studies/` to `.assetsignore`, or move the files outside `public/`. |
| Should fix (unverified) | `public/index.html:16` | The preload has no `imagesrcset`/`imagesizes`. If the LCP `<img>` uses `srcset`, the browser may fetch the image twice. | Confirm the `<img>` uses that exact single URL, or mirror its srcset in the preload. |
| Nit | `studio-home.css:401` | Between 701 and 1100px, the 48px row is reserved even when there is no JS or motion is reduced, which may leave an empty gap. | Optional: drop the reservation under `prefers-reduced-motion`. |
| Nit | `studio-home.css:410` | With reduced motion at ≤700px, the summary spans both columns. If the control still renders there, the two overlap in row 2. | Confirm the control is hidden in that state. |
| Nit (carried) | `studio-home.css:332, 393` | The h1 is still larger at 640px than at 641px. | Optional. |
| Nit (carried) | `studio-home.css:337` | There is a hover style but no matching `:focus-visible` style. | Optional. |

The diff confirms several fixes. The warm-light styles are merged into `studio-home.css`, so there is no third stylesheet. The sculpture preload is removed. The Syne preload comes after the stylesheets and has `crossorigin`. The OFL licence ships with the font. No JS, timeline, copy or form changes appear in the diff. I accept the Services/Process alignment, the contrast and focus outline, and the line-length points as answered by the evidence you supplied, but I haven't re-checked them from the diff.

**Not verified**
- JS still loading the sculpture frame, and reduced motion still not fetching it. No JS is in the diff.
- That `.opening-bottom` is already a grid between 701 and 1100px. The base rule wasn't supplied.
- Every Lighthouse figure, the 58-test and 18-check runs, axe results, HTML validation, and the visual passes. I have your report of these, not the output.
- The prototypes' `noindex` and archived CSS. They aren't in the diff.
- The font binary's subset and weight range, the 34.6 KB size, and `_headers` caching for fonts.
- Rendering at any width. No browser was available.
- Deployment. This was frontend only.