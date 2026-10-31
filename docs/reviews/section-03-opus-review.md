VERDICT: PASS

| Severity | file:line | Finding | Suggested fix |
|---|---|---|---|
| Should fix | `.github/qa/qa.spec.js:18-24` | The test checks each service element against the viewport. It never checks the whole page for horizontal scroll. Overflow from the `h2` (`clamp(40px,5.4vw,80px)`, `-0.06em`) or from the section padding would not be caught. This is a gap in the evidence, not a failure that has been seen. | Add `expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)` and include `#services h2` in the element loop. |
| Should fix | `studio-home.css:133-134` | The title column is narrowest between 641px and 767px: about 4/12 of the content width at a 36px font, roughly 185px at 641px. None of the required widths fall in that range, so a long service name could overflow there unseen. This is a gap in the evidence. | Add 641 and 700 to the test widths, or let the title wrap (`overflow-wrap: anywhere` / `hyphens: auto`). |
| Nit | `studio-home.css:65-72` | `.service-grid` becomes `display:block`, and each row has only `border-top`. The last service has no closing rule, so the edge of the section depends on the next section. | Add `.service:last-child { border-bottom: 1px solid #929590 }` if the design wants a closed edge. |
| Nit | `studio-home.css:61,81` | Letter-spacing of -0.055/-0.06em is very tight. It is legible at display sizes, and WCAG 1.4.12 overrides still work. | Optional: try -0.04em. |

**Cascade and layout (checked from the diff):**
- **Grid placement:** the `h3` sits in column 1, row 1. The other children go into column 2. With sparse auto-placement they land in rows 1, 2, 3 and 4 in DOM order, so the reading order matches the visual order.
- **Mobile:** at 640px and below, `display:flex` re-enables the base `flex-direction: column`. The `grid-column` rules are then ignored, and the 24px gap with zero margins keeps spacing even.
- **Contrast:** assuming `--mid` is `#505459` (by my own calculation, not tool-checked), it is about 6.1:1 on `#e8e6e2`. The `#929590` rule is a decorative divider, so it doesn't need 3:1.
- **List bullets:** the pseudo-bullets are decorative and the `ul/li` structure is kept.
- **Sample-ad link:** `inline-flex` with `min-height:44px` meets the 44px tap height. No `overflow:hidden` clips the focus ring. The underline is kept.
- **Motion and performance:** there are no animations or transitions, and no new requests.

**Not verified**
- Base `.service`, `.service-list li`, `.section-title`, `--mid`, `--sans` and `--px` values. They aren't in the diff, so I can't confirm that every base card border, background or shadow is overridden.
- Rendering in a live browser at any width, including Safari and Firefox grid behaviour. This worker had no browser.
- Actual service-name lengths and the copy that renders.
- Results of the 7 focused checks, the screenshots, and the 2.8s LCP. All are as reported, not seen.
- Pre-existing `list-style:none` removing list semantics in Safari VoiceOver. It comes from the global stylesheet, not this diff.
- Full manual QA and launch approval are not claimed.