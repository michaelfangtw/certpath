# Proposal: Remove SectionHeader from dashboard exports in SA.md

## Why
After removing `StreakCalendar` (fix #6), SA.md still lists `SectionHeader` as a window
export of `js/screens-dashboard.jsx`. In reality only 3 symbols are assigned to `window`
at the end of that file: `DashboardScreen`, `CoachChat`, `CatchUpBanner`. `SectionHeader`
is defined at line 194 but used only internally within `DashboardScreen` and `QuizResult`.

## What Changes
Remove `SectionHeader` from the `js/screens-dashboard.jsx` row, leaving exactly the 3
symbols that are actually window-exported.

## Capabilities
- SA.md Screen Components table is now fully accurate for screens-dashboard.jsx.

## Impact
- Modified file: `docs/SA.md` (one table row updated)
- No code changes.
