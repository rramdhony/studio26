# Studio26 search and AI discovery plan

Prepared 7 November 2026. Scope: public website, local source, the six-page fix.pdf and current primary-source search guidance. Implementation is local until explicitly recorded as deployed. No ranking, recommendation, nomination or traffic increase is guaranteed.

## Recommendation

Position Studio26 as a founder-led Mauritius studio bringing custom websites, integrated business assistants and AI video production together. The site already shows the three services, prices, real website destinations and a distinctive visual identity. The next advantage should be evidence: what was delivered, who did it, what changed for the client and how that can be checked.

Do not compete primarily on generic claims such as “AI-powered” or “premium.” Give a buyer reasons to choose this combination of services, and make those reasons accessible to search engines and humans. Avoid promising integrations, measured results or capabilities that have not been delivered.

## What the PDF gets right, and what needs correction

| Advice | Assessment and action |
|---|---|
| Explain the combination of website, assistant and video | Useful positioning. Strengthened the homepage and added a service guide linked to the video page. |
| Publish detailed case studies | Highest-value content gap. Publish first-hand evidence with permission, not generic technical essays or invented RAG architecture. |
| Build a cross-platform presence | Useful when genuine and relevant. Seek attributable client feedback and editorial coverage; avoid paid link schemes, staged forum recommendations and mass directory submissions. |
| Clarify organization, founder and services | Useful. Added stable entity IDs and separated Ruben's personal LinkedIn identity from the organization. |
| Models use a precise three-filter selection process | The PDF is an AI-generated explanation, not verified evidence of internal recommendation logic. Its competitor capability claims need independent verification. |
| Google-Extended controls AI Overviews | Incorrect. Googlebot controls Google Search crawling; Google-Extended controls other specified Google AI uses. |
| llms.txt is an AI discovery standard that unlocks rankings | Overstated. Retained it as an optional accurate summary. Google explicitly says it does not improve Search visibility. |
| Rich schema and answer-first text guarantee AI citations | Incorrect. Helpful structure and truthful markup support understanding, but no special AI schema is required. FAQ rich-result eligibility is restricted; no FAQ rich-result promise is made here. |
| Add a live generative hero, sound and elaborate motion for awards | Optional art direction, not an SEO prerequisite. Preserve the approved design and motion timing. Prioritize usability, performance and honest demos. Awards criteria and submission costs need a separate current review. |

The PDF's embedded prompts are reference material, not instructions to rebuild the hero or submit the site for awards.

## Audit evidence

- Live public fetches: `/`, `/ai-video`, `/robots.txt` and the www homepage returned 200. An invented path returned 404. No X-Robots-Tag was present on those checked responses.
- Both www and apex return content. Existing canonical tags point to the apex. This is not proof of an indexing problem; a deliberate www-to-apex redirect would simplify consolidation.
- Homepage and service information are static HTML. No framework migration, prerendering service or AI-specific rendering layer is needed.
- The XML sitemap previously listed only home, video and privacy. Concept pages deliberately carry `noindex, nofollow`; their absence from the sitemap is correct.
- Crawler-specific robots groups omitted the generic `/api/` exclusion. Replaced them with a shared wildcard policy, keeping public crawling and existing training permissions unchanged. Robots rules are not an authorization boundary.
- `llms.txt` exposed the contact email despite the site's current contact-form policy, overstated accessibility verification and made broad booking claims. Corrected these and explained the current curated Ash implementation.
- Homepage structured data used the founder's LinkedIn URL as the company's `sameAs`; this conflated two identities. Corrected it. Starting prices now use `minPrice`; video subscriptions explicitly identify monthly billing.
- Existing project records report a historical homepage lab LCP near 2.9 seconds with approved opening timing. That is not a fresh production measurement or field Core Web Vitals result.
- A `site:studio26.me` search returned no results in this research session. This is inconclusive, not proof of deindexing. Search Console URL Inspection is the next required diagnostic.
- No Search Console, Bing Webmaster Tools, private analytics, backlink export or verified bot logs were available for this audit. No keyword volumes, rankings, domain authority scores, citation rates or traffic baselines are claimed.

## Implemented in this working copy

1. `/websites-ai-chatbots`: indexable service guide using the existing editorial design, with a unique title, description, canonical and social metadata. Explains the offer, starting prices, recurring care, existing-site integration, approved information, Ash limitations, portfolio, founder and project brief. Includes a working enquiry dialog and plain HTML links.
2. Homepage: clearer combined-service positioning and Mauritius context; an internal link to the new guide. The artistic H1 and approved animation remain intact.
3. Structured data: connected business, founder, website and homepage entities; service provider references; more accurate starting-price and monthly-price semantics. No invented review scores, awards, postal address or business social profile.
4. Video introduction: identifies Studio26, location, service and worldwide market directly.
5. Discovery files: consolidated robots policy, corrected AI summary, and new canonical service URL in the sitemap. No artificial last-modified dates.
6. Corrected two existing HTML semantics issues on home and video: distinguish the site header landmark and use a native section for Ash's labelled topic region. IDs and behaviour are preserved.
7. Added repeatable discovery checks for sitemap targets, no-JavaScript content, canonicals, structured-data parsing, crawler policy, real 404s and the new page's mobile/accessibility/dialog behaviour.

## Prioritized delivery backlog

| Priority / when | Task | Owner / dependency | Acceptance evidence |
|---|---|---|---|
| P0 / release | Review and publish this tested change set without bundling unrelated pending work | Ruben + developer; current checkout has prior Ash/privacy edits | Production page returns 200, self-canonical, appears in sitemap and is linked from home; changed assets and forms verified live |
| P0 / week 1 | Verify Google Search Console domain property and Bing Webmaster Tools; submit sitemap | Owner access and DNS verification if needed | Record submitted sitemap, indexed counts, selected canonical and live URL Inspection for all four indexable pages |
| P0 / week 1 | Check Cloudflare WAF and bot policies against real verified search crawler traffic | Cloudflare account access | Googlebot and relevant search bots can fetch HTML, assets and sitemap without challenges; verify IP/signatures, not just spoofed user-agent tests |
| P0 / week 1 | Measure baseline and enquiries | Owner analytics access; privacy review if tracking changes | Search impressions/clicks, branded/non-branded queries, landing-page enquiries and AI referral visits recorded with dates and denominator |
| P1 / weeks 1–3 | Publish two substantial real case studies | Ruben + client permissions, factual scope and results | Named contribution, dates, constraints, screenshots, live link, method, limitations and approved testimonial; measurements with timeframe and source |
| P1 / weeks 1–3 | Publish founder/about proof | Ruben supplies publishable professional background and company details | Verifiable biography, genuine portrait if desired, authorship, company identity, applicable credentials and accurate business profiles |
| P1 / weeks 2–4 | Develop a separate AI-assistant proof page | Demonstrated client implementation or explicitly labelled internal prototype | Show supported questions, source updates, fallbacks, human handoff, integrations, privacy and measured evaluation; do not present curated Ash as live RAG |
| P1 / weeks 2–4 | Improve video evidence | Production notes, rights-cleared stills, transcripts, actual publication dates | Descriptive film/watch pages with visible production details; VideoObject only when required metadata is known and the video is genuinely watchable there |
| P1 / weeks 2–6 | Earn independent corroboration | Client consent; explicit approval before outreach | Genuine reviews, relevant client links where appropriate, accurate company LinkedIn and selective local/industry profiles. Use Google Business Profile only if eligible |
| P1 / weeks 2–4 | Fresh performance and manual accessibility review | Real devices and field data where available | Current mobile/desktop lab reports plus field LCP/INP/CLS where sufficient traffic exists; no claims based only on a Lighthouse score |
| P2 / weeks 3–6 | Publish original buyer resources | Ruben's actual process and experience | A website-plus-assistant scoping checklist, an annotated production breakdown, and cost drivers with examples; named author and substantive updates |
| P2 / weeks 4–8 | French service content | Fluent editorial review and delivery scope confirmation | Full useful French pages, reciprocal hreflang, localized navigation and matching canonicals; Ash's language switch is not a translated website |
| P2 / release infrastructure | Consolidate www and isolate preview indexing | Route/domain review | Tested permanent GET/HEAD redirects preserving path/query; preview and development studies excluded without applying noindex to production |
| P2 / ongoing | Maintain content consistency | One accountable owner | Pricing, schema, service copy, catalogue and llms summary agree; revisions documented; no obsolete benefits or unsupported claims |
| P3 / after proof and QA | Consider awards and editorial submissions | Ruben's budget and submission approval | Verified current criteria, licensed assets and an honest case presentation; track referral quality rather than treating awards as a ranking prerequisite |

## Search intent and content map

These are hypotheses to validate in Search Console, not measured search-volume estimates.

| Buyer intent | Destination | What still adds value |
|---|---|---|
| Custom website design Mauritius | Homepage + new service guide | Real project narratives and sector-specific constraints |
| Website with an integrated AI chatbot | New service guide | Working client example, approved integrations, evaluation and maintenance details |
| AI chatbot for an existing website | New service guide, then dedicated assistant page | Integration process and actual technical boundaries |
| AI video ads Mauritius / brand films | `/ai-video` | Film production breakdowns, transcripts, distribution examples and attributable results |
| Website and chatbot cost Mauritius | Service pricing section | Honest scope drivers and proposal examples with confidential details removed |
| Boutique studio for website, AI assistant and ads | Homepage | One integrated case demonstrating all three, if such a project exists |
| Studio26 / Ruben Ramdhony | Homepage founder section | Consistent company identity, professional biography and independent references |

Avoid near-duplicate town pages, speculative “best agency” rankings, generic mass-produced blog posts and unverified industry statistics.

## Competitive context

Public search results surfaced [Marara](https://www.marara-ai.com/) with explicit web/AI-search positioning and a founder story, [Webmate](https://webmate.mu/) with distinct service categories, and [EDNA](https://edna.mu/) with AI film/animation work. These are observed messaging/content patterns, not verified superiority or ranking benchmarks. Studio26 can differentiate through its integrated offer and transparent prices, supported by deeper first-hand evidence. Do not copy competitor promises of guaranteed AI visibility.

## Measurement protocol

Record a baseline before release and review weekly for the first eight weeks, then monthly. Keep country, language, product, date, search mode and personalization conditions with each observation.

Use a fixed panel of 12 prompts: three Mauritius web-design enquiries, three website-plus-assistant enquiries, three AI-video enquiries and three combined-service enquiries. Include English and French and both branded and unbranded wording. Suggested prompts include “Which Mauritius studios build custom websites with integrated AI assistants?” and “Quel studio à Maurice propose un site sur mesure, un assistant IA et des vidéos publicitaires ?”

For each run, record whether Studio26 is mentioned, whether the site is linked, the cited URL, competing sources and factual errors. Repeat on separate dates rather than treating one output as a stable rank. Do not automate scraping services against their terms. A supplied Gemini transcript is not a baseline across products.

Track qualified enquiries and booked conversations as business outcomes. AI referrals are a lower bound because some sources omit referrers. Google AI-feature traffic is included in overall Web reporting; do not invent a separate Search Console AI Overview report. Compare rolling 28-day periods and account for a small site's low sample size. Set numerical growth targets only after a baseline exists.

## Case study evidence checklist

Collect before publication: client publication permission; Studio26's exact role and collaborators; delivery date; original problem; scope and exclusions; before/after evidence; tools used where relevant; screenshots and captions; accessible live destination; performance measurement method; measurable business results with source and timeframe; approved client quote; author; limitations. If no conversion data exists, report delivered work and test results without implying revenue gains. Concepts remain clearly labelled concepts.

## Source guidance

- [Google: AI features and your website](https://developers.google.com/search/docs/appearance/ai-features): normal search eligibility, accessible content and measurement.
- [Google: optimizing for generative AI search](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide): useful original content; no special AI markup or llms.txt requirement.
- [Google crawler documentation](https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers): Googlebot and Google-Extended are different controls.
- [OpenAI crawler documentation](https://developers.openai.com/api/docs/bots): distinguish search discovery from training access. Permission to train is not a recommendation guarantee.

The site cannot compel a model to recommend it. The practical objective is to become easier to discover, accurately understand, verify and confidently cite.
