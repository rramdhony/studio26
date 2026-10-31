# Dependency and asset register

Required by the brand plan (dependency discipline) and REVIEW.md. Update in the
same commit that adds, upgrades or removes anything. Licence column marked
"verify" must be checked against the package or source before launch.

Last updated: 31 Oct 2026 (Claude, from package.json and public/assets).

## Runtime (shipped to visitors)

| Item | Version | Where | Licence | Status / notes |
|---|---|---|---|---|
| GSAP | 3.15.0 | public/assets/vendor/gsap-3.15.0.min.js | GSAP standard licence (verify current terms) | Used by section 01 opening |
| three.js | 0.187.0 | package.json dependency | MIT | Installed, not yet shipped. Remove if unused at launch |
| Instrument Sans (variable, latin) | n/a | public/assets/fonts | SIL OFL 1.1 (InstrumentSans-OFL.txt included) | Used site-wide |
| Twemoji | 14.0.2 (per QA Standard) | CDN, if used | Graphics CC-BY 4.0, code MIT (verify) | CSP allows it; confirm whether any page still uses it |
| Cloudflare Web Analytics | n/a | CDN beacon | Cloudflare terms | CSP allows it; confirm privacy notice covers it |

## Development only (not shipped)

| Item | Version | Licence |
|---|---|---|
| @playwright/test | ^1.44.0 | Apache-2.0 |
| @axe-core/playwright | ^4.9.1 | MPL-2.0 |
| html-validate | 11.17.0 | MIT |
| lighthouse | 13.5.0 | Apache-2.0 |
| wrangler | 4.156.0 | MIT OR Apache-2.0 |
| start-server-and-test | ^2.0.3 | MIT |
| wait-on | ^7.2.0 | MIT |

## Visual assets

| Asset | Source | Rights | Notes |
|---|---|---|---|
| studio26-complete-v1.webp (1536x1024) | brand-kit v1 [TO CONFIRM origin: AI-generated or rendered] | [TO CONFIRM] | Soft on retina desktop; a 2880 px master is needed |
| sculpture-26-v1.webp (1536x1024) | brand-kit v1 [TO CONFIRM] | [TO CONFIRM] | Second frame of the opening; skipped under reduced motion |
| Work thumbnails (arizen, diaspora, mauradio, aiunit, nextalent, awi) | screenshots of the live sites | [TO CONFIRM client permission] | Add an Apricus thumbnail when it joins Selected work |

## Reference only (must not ship)

| Item | Location | Notes |
|---|---|---|
| Codrops ImageToContent | ..\references\ImageToContent | Licence inspected by Codex; reference only |

## Agent tooling (outside the site)

Codex skills frontend-design and web-design-guidelines; MCP servers 21st,
context7 (4.4.4, installed in ..\tooling), blender (MCP for Blender 2.2.6),
plus earlier Docker, fileclaw, filesystem, node_repl and notebooklm. Not part of
the website build; listed so their use stays visible.
### AWI screenshot refresh, 31 October 2026

AWI thumbnail refreshed at Ruben's request with the Africa map fully rendered. Captured from https://awipartners.africa/ at 1440x900 using the browser; excluded the right scrollbar and retained the complete map. New files: awi-map-v2-800.webp, awi-map-v2-1400.webp, awi-map-v2-1400.jpg. Native 8:5 output; previous v1 assets preserved. No other project images changed.

### Selected warm-light identity, 31 October 2026

Ruben selected colour study B. Homepage display headings now use Syne (variable, Latin, weights400-800 declared;500/600 used), self-hosted at public/assets/fonts/syne-latin.woff2. Source: Google Fonts, https://fonts.gstatic.com/s/syne/v24/8vIH7w4qzmVxm2BL9A.woff2. SIL OFL1.1 copyright/license included as Syne-OFL.txt, obtained from google/fonts/ofl/syne/OFL.txt. Instrument Sans remains body/navigation/form type. Study files remain under public/studies/colour for comparison only. No new package dependency.
