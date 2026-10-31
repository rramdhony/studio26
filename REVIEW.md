# Studio26 review gate

Every implementation section passes this gate before the next section starts.
The reviewer is Claude Opus 5.5, run headless and read-only. The reviewer reads
this file first and grades only against it.

## Scope of a review

- Review one section at a time, as a committed diff: `git diff <base>..<head>`.
- Supply the full section diff, not selected files. Include markup, CSS, JS,
  Worker code, headers, assets list and test changes.
- State the section name, base and head commits, and the preview URL.
- Out of scope unless the section touches it: the studio26-reel project.

## Standards, in priority order

1. Studio26 QA Standard: `C:\Users\ruben\.claude\Studio26_QA_Standard.md`
   (functional QA, mobile at 375/390/430/768/1024/1440, WCAG 2.1 AA). Mandatory.
2. WCAG 2.2 AA additions (focus not obscured, 24px minimum target size,
   dragging alternatives, consistent help, accessible authentication,
   redundant entry). Graded "Should fix" until Ruben confirms 2.2 as the gate.
3. Brand and launch plan: `..\Studio26_Brand_Design_and_Launch_Plan.docx`,
   including Addendum A (pages 18 to 25).
   - Performance budgets: first view under 1.5 MB excluding user-played video;
     initial JS under 200 KB gzip; LCP 2.5 s or better, INP 200 ms or better,
     CLS 0.1 or better (lab until field data exists).
   - Motion: native scroll, no scroll hijacking, reduced-motion respected,
     content visible without JavaScript, pause for continuous motion.
   - Claims: no invented clients, results, awards or endorsements. Commissioned
     work and independent concepts are labelled. No implied government
     endorsement.
4. Engineering: security (CSP and headers, Worker input validation,
   parameterised D1 queries, no secrets in the repo, spam protection on forms),
   correctness, maintainability, dependency register kept current
   (`docs/dependency-register.md`).

## Severity scale

- **Blocker**: broken function, security issue, data loss, accessibility
  failure that prevents use, or a false public claim. Section cannot pass.
- **Must fix**: standard violated, fix before the next section starts.
- **Should fix**: real issue with low impact, fix within the next two sections.
- **Nit**: style or preference, optional.

## Verdict format

Start with one line: `VERDICT: PASS`, `VERDICT: PASS WITH FIXES` or
`VERDICT: FAIL`.

- PASS: no Blocker or Must fix.
- PASS WITH FIXES: no Blocker; Must fix items listed and small.
- FAIL: any Blocker, or Must fix items too large to patch in place.

Then a table: severity, file:line, finding, suggested fix. Then a short
"Not verified" list naming anything outside the supplied material.
Do not edit files. Do not approve your own suggested code.

## How Codex calls the gate

From `C:\Users\ruben\Downloads\studio26\site`:

```powershell
git diff <base>..<head> > ..\tooling\review-input\section-NN.diff
& "$env:USERPROFILE\gemini-work\ask-claude.ps1" `
  -Model claude-opus-5-5 -Effort medium `
  -PromptFile ..\tooling\review-input\section-NN-prompt.md `
  -Files REVIEW.md, ..\tooling\review-input\section-NN.diff
```

- Use `-Effort high` only for security-sensitive sections (Worker, D1,
  enquiry form, assistant backend).
- Save the reviewer output to `docs/reviews/section-NN-opus-review.md`.
- After fixes, re-run as a verification pass against the new diff and save it
  as `docs/reviews/section-NN-opus-verification.md`.
- On any tool failure: one obvious fix attempt, then stop and report to Ruben.

## Milestone gates (with Ruben, in the Claude app)

Homepage complete, assistant complete, and pre-launch. These add business,
copy and claims review on top of this file.