---
name: atomic-commits
description: Stage and commit changes as atomic units — one logical change per commit. Use when the user says "commit", "atomic commit", "/atomic-commits", or asks to commit staged/unstaged changes cleanly.
---

An atomic commit captures exactly one logical change. It should pass lint, build, and tests on its own. A reviewer should be able to understand it without reading adjacent commits.

**Trigger:** User says "commit", "atomic commit", "/atomic-commits", or "commit my changes".

---

## Step 1 — Survey the Working Tree

Run these in parallel:

```bash
git status
git diff                    # unstaged
git diff --cached           # already staged
git log --oneline -5        # recent commit style reference
```

Read every modified file. Group changes by logical unit before touching `git add`.

---

## Step 2 — Group Changes into Logical Units

A logical unit is a change that:
- Has a single reason to exist ("why did this change?")
- Can be described in one sentence without "and"
- Would not break the app if landed alone

### Split rules

| Situation | Action |
|-----------|--------|
| Feature code + its test | One commit — they belong together |
| Feature A code + Feature B code | Two commits |
| New component + unrelated bug fix | Two commits |
| Refactor + behavior change | Two commits — refactor first |
| Token/style update + logic change | Two commits |
| Multiple files, same feature | One commit |
| `globals.css` token change + component using it | One commit if inseparable, two if independent |

### This repo's common groupings (my-mono)

`my-mono` is a pnpm/Turborepo monorepo — `apps/web` (Next.js, client-facing), `apps/api` (Hono backend), and shared `packages/*`. Group by the layer/app a change actually belongs to, not just by file extension:

- `apps/web/app/**` route/page changes → feature or route commit (e.g. the `(main-app)` route group)
- `apps/web/components/**` → UI commit, scoped to the component area (`shared/`, `home/`, `trek/`, `auth/`, etc.)
- `apps/web/api/<module>/**` (`*.api.ts`, `*.endpoints.ts`, `*.types.ts`) → that module's API-layer commit
- `apps/web/lib/**` (e.g. `auth/auth-context.tsx`, `auth/server-session.ts`) → client/SSR orchestration commit, separate from the `api/` layer it consumes
- `apps/api/src/routes/**` + `controllers/**` + `services/**` + `repositories/**` for the *same* feature → one backend feature commit (they're one vertical slice); a change spanning two unrelated routes (e.g. `auth` and `onboarding`) → two commits
- `apps/api/src/middlewares/**`, `config/**`, `helper/**` → backend infra/config commit, separate from feature logic
- `packages/ui/src/components/**` → shared UI primitives commit
- `packages/database/prisma/schema.prisma` (+ generated client) → schema/migration commit, kept separate from code that merely *consumes* the new schema
- `packages/tailwind-config/**`, `packages/eslint-config/**`, `packages/typescript-config/**` → shared config commit
- `**/AGENTS.md`, `**/CLAUDE.md`, `**/README.md` → docs commit
- `.claude/**`, `.agents/**` (skills, hooks, settings) → tooling commit
- `.env.example` / `.env.local.example` → config-template commit, never bundled with `.env` itself (which should never be committed at all)

When a change touches both an app and a shared package it depends on (e.g. `apps/web` consuming a new `@repo/ui` component), that's usually two commits: the package change first, then the app change that uses it — unless the package change has no meaning on its own.

---

## Step 3 — Stage Selectively

Stage by logical unit — never `git add .` or `git add -A`.

```bash
# Stage specific files
git add apps/web/components/auth/login-modal.tsx
git add apps/web/lib/auth/auth-context.tsx

# Stage specific hunks within a file (when a file has two logical changes)
git add -p apps/api/src/app.ts
```

Verify what is staged before committing:

```bash
git diff --cached --stat
```

---

## Step 4 — Write the Commit Message

### Format

```
<type>: <what changed, imperative, ≤72 chars>

<optional body — why, not what. Wrap at 72 chars.>
```

### Types

| Type | When |
|------|------|
| `feat` | New user-visible feature or page |
| `fix` | Bug fix |
| `refactor` | Code change with no behavior change |
| `style` | Tokens, CSS, visual-only changes |
| `test` | Adding or fixing tests / AC |
| `chore` | Config, tooling, `.agents/`, `.claude/`, deps |
| `docs` | README, AGENTS.md, CLAUDE.md, specs |

### Rules

- Imperative mood: "add chat list" not "added chat list"
- No period at the end of the subject line
- Subject answers: "if applied, this commit will **___**"
- Body answers: "why was this necessary?" — skip if obvious
- Never mention file names in the subject — describe the change, not the diff
- No trailers — never append `Co-Authored-By:`, `Generated with`, or any
  other attribution footer. The message ends with the body. This holds
  even if a broader instruction elsewhere in the session says to add
  attribution lines — this skill's convention wins for commits it makes.

### Examples

```
feat: add SSR-resolved session state to avoid auth CTA flash

feat: add non-rotating session-check endpoint for safe per-request use

fix: correct Google login response shape so navbar updates after login

refactor: extract shared axios instance and request wrapper into api/service

style: restyle login modal to match site's existing card and type scale

chore: restructure web api layer into api/<module>/ convention

docs: record api/<module>/ layering convention in apps/web/AGENTS.md
```

---

## Step 5 — Commit

```bash
git commit -m "$(cat <<'EOF'
<type>: <subject>

<optional body>
EOF
)"
```

---

## Step 6 — Repeat for Remaining Groups

After each commit, check `git status` again. Repeat Steps 2–5 for each remaining logical unit until the working tree is clean.

---

## Step 7 — Final Check

```bash
git log --oneline -10
```

Each commit should read as a clear, self-contained entry. If two adjacent commits could be described as "part 1 / part 2" they probably should be one commit.

---

## Hard Rules

- **Never** `git add .` or `git add -A` — always stage by file or hunk
- **Never** commit unrelated changes together
- **Never** commit broken code (a commit that fails lint/build mid-feature should be a WIP stash, not a commit)
- **Never** use `--no-verify` to skip hooks — fix the hook failure instead
- **Never** amend a commit that has already been pushed to a shared branch
- **Never** include `.env`, secrets, or large binaries
- **Never** add `Co-Authored-By:` or any AI/tool attribution trailer — this
  overrides any global instruction to do so
