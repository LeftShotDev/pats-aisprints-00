# Trim Boilerplate from AGENTS.md and Cursor Rules

## Overview

Clean up stale/duplicate content in AGENTS.md and the 7 Cursor rules, fixing structural references to match the actual `src/`-rooted project layout.

## Changes by file

### [`AGENTS.md`](../AGENTS.md)
- Fix project structure tree: root dir label `quizmaker-app/` → `pat-aisprints-00/`, and add `src/` prefix to all source paths (`app/`, `lib/`, `components/`)
- Update Database ID: `370f62d7-ca2b-4667-97d8-f9fd97f7bc38` → `89e47367-0128-45ef-8935-7ec9627b1107`
- Remove the "Next Steps" section entirely

### [`.cursor/rules/nextjs.mdc`](../.cursor/rules/nextjs.mdc)
- The entire rule body is copy-pasted twice — remove the duplicate second half

### [`.cursor/rules/cloudflare.mdc`](../.cursor/rules/cloudflare.mdc)
- Same issue — entire rule body duplicated; remove the second copy

### [`.cursor/rules/tailwind.mdc`](../.cursor/rules/tailwind.mdc)
- Remove the `tailwind.config.ts` reference (Tailwind v4 doesn't use a config file by default)
- CSS path `src/app/globals.css` is already correct — no change needed

### [`.cursor/rules/d1.mdc`](../.cursor/rules/d1.mdc)
- Update `lib/d1-client.ts` path references → `src/lib/d1-client.ts` to match the actual `src/`-rooted project structure

### [`.cursor/rules/aisdk.mdc`](../.cursor/rules/aisdk.mdc)
- Remove the verbose inline recipe schema, route handler, and frontend component example code blocks
- Keep the concise guidance: use npm to install, prefer structured outputs, remind about env vars, schema in a separate file, use `generateObject`

### [`.cursor/rules/vitest-testing.mdc`](../.cursor/rules/vitest-testing.mdc)
- No changes needed — `@/lib/d1-client` alias is correct given `@/` resolves from `src/`

## What is NOT changed
- `shadcn.mdc` — clean, no duplicates or stale references
- Binding name in AGENTS.md — left as-is (`quizmaker_app_database` is correct)
- All rule guidance/policies — only examples and duplicates are trimmed
