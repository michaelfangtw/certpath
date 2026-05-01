# Proposal: Add SectionHeader to SA.md screens-dashboard.jsx window-exports (issue #239)

## Problem
`SectionHeader` is defined as a top-level function in `js/screens-dashboard.jsx` (line 308)
and is used as a cross-file global in at least 4 other JSX files (screens-practice,
screens-shadowing, screens-daily-quest, screens-ai-conversation). It is not listed in the
window-exported symbols for `js/screens-dashboard.jsx` in SA.md.

## Fix
Add `SectionHeader` to the `js/screens-dashboard.jsx` row in the Screen Components
window-exports table in SA.md.
