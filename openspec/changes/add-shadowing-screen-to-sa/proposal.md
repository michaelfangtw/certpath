# Proposal: Document screens-shadowing.jsx in SA.md

## Why
`js/screens-shadowing.jsx` was added in commit `3d79a65` alongside the daily-quest and
login-quest-gate features, but SA.md was never updated. The file exports `ShadowingHub`
and `ShadowingRunner` — both reachable via the `shadowing` and `shadowing-run` routes
linked from the Practice Center screen.

## What Changes
Add a `js/screens-shadowing.jsx` row to the Screen Components table in SA.md with
exports: `ShadowingHub`, `ShadowingRunner`.

## Capabilities
- SA.md is the single source of truth for what each JSX file exports — this closes the
  gap for the newest practice mode.

## Impact
- Modified file: `docs/SA.md` (one table row added)
- No code changes.
