# Agent instructions (FastStack)

## Git commits

When the user asks to **commit**, **commit and push**, or similar:

1. Use **[Conventional Commits](https://www.conventionalcommits.org/)** for every commit message.
2. Prefer the format: `type(scope): short imperative summary` (lowercase summary, no trailing period).
3. Use scopes that match this repo when helpful: `backend`, `frontend`, or omit scope for repo-wide changes.
4. Common types:
   - `feat` — new behavior or capability
   - `fix` — bug fix
   - `docs` — documentation only
   - `chore` — tooling, gitignore, deps, config (no user-facing feature)
   - `refactor`, `test`, `ci`, `build` — as appropriate
5. Split into **multiple commits** when changes are unrelated (e.g. gitignore vs new app scaffold), each with its own conventional message.
6. Do **not** commit unless the user explicitly asked to commit; do **not** push unless they asked to push.
7. Never commit secrets (`.env`, credentials, tokens). Respect existing `.gitignore` rules.

### Examples (match project history)

```
docs: add README
chore: add Python gitignore
feat(backend): add FastAPI app with health endpoint
feat(frontend): add Next.js app with Tailwind CSS
```

Optional body after a blank line for extra context; keep the subject line focused on **why**, not a file list.
