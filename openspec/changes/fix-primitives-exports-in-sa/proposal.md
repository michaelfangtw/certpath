# Proposal: Add missing primitives.jsx exports to SA.md

## Why
SA.md lists only 7 exports for `js/primitives.jsx` but the file window-exports 10 symbols.
Three are undocumented: `Logo`, `CertBadge`, and `tierFromScore`. All three are used
across multiple screens — `Logo` in Navbar and LoginScreen, `CertBadge` in Dashboard and
Landing, `tierFromScore` in the diagnostic result flow.

## What Changes
Update the `js/primitives.jsx` row in the Screen Components table to include all 10
window-exported symbols: `Icon` `Logo` `Eyebrow` `Button` `Badge` `PaperCard`
`CertBadge` `TIER` `tierFromScore` `useCountUp`.

## Capabilities
- Developers can look up `CertBadge` and `Logo` in the correct file without searching.
- `tierFromScore` is documented as a utility function alongside its sibling `TIER`.

## Impact
- Modified file: `docs/SA.md` (one table row updated)
- No code changes.
