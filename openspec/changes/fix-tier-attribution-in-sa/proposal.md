# Proposal: Fix TIER attribution in SA.md

## Why
SA.md incorrectly lists `TIER` as an export of `js/data.jsx`. `TIER` is defined in
`js/primitives.jsx` (alongside `tierFromScore`) and is window-exported from there.
Every screen that renders cert badges depends on `window.TIER` from primitives, not data.

## What Changes
- Create `docs/SA.md` as the authoritative system architecture reference.
- In the Screen Components table: `data.jsx` row does **not** include `TIER`.
- `TIER` appears in the `primitives.jsx` row instead.

## Capabilities
- Developers reading SA.md will look for `TIER` in the correct file.
- Establishes the SA.md document structure for subsequent gap fixes.

## Impact
- New file: `docs/SA.md`
- No code changes — documentation only.
