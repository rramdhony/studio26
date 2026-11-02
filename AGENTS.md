# Studio26 — Agent & Project Guide (`AGENTS.md`)

> **Read `HANDOFF.md`, `CLAUDE.md`, and `docs/BUILD_STATUS.md` first.**
>
> All agents (Codex, Claude Code, Antigravity / Gemini 4 Argon) share the canonical Studio26 standards in `C:\Users\ruben\.claude\`:
> - `C:\Users\ruben\.claude\Studio26_QA_Standard.md`
> - `C:\Users\ruben\.claude\Studio26_Build_Deploy_Playbook.md`
> - `C:\Users\ruben\.claude\Studio26_Agent_Orchestration.md`

## Quick Reference (2 November 2026)

1. **Live Preview Worker:** https://studio26-site.ruben-ramdhony.workers.dev/ (`studio26-site`, Version `c88b15f7-8922-4796-aa6b-77dd9df6e97a`).
2. **Primary Deploy Worktree:** `C:\Users\ruben\Downloads\studio26\site-ai-video` (contains the unified site + gitignored `public/video/` assets). Sync changes across `site-ai-video`, `site`, and `C:\Users\ruben\Documents\GitHub\studio26`.
3. **Mandatory Backup Rule:** Create a git backup branch/tag or file snapshot in `C:\Users\ruben\Downloads\studio26\backups\<timestamp>` before editing any files.
4. **Current Status:**
   - Homepage (`/`), AI Video Ads & Films (`/ai-video`), Concept Worlds (`/concepts/*`), Privacy/DPA 2017/WCAG 2.1 AA (`/privacy`), USD pricing (`data-price` / `data-term`), brushed-chrome & deep-cobalt gradient buttons, Ruben's LinkedIn badge (`#founder`), and SEO/GEO files (`JSON-LD`, `/llms.txt`, `/robots.txt`, `/sitemap.xml`) are **complete, QA-verified, and live on the preview URL**.
5. **Next Milestone:** Build **Ash** (Studio26's bilingual EN/FR AI assistant) using the approved oxblood portrait (`C:\Users\ruben\Downloads\studio26\brand-kit\ash\v1\brand-guide-v1.md`), architecture plan (`docs/creative/ash-architecture-plan-v01.md`), and knowledge base (`docs/content/assistant-knowledge-base.md`).
