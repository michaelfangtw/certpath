# Proposal: Remove StreakCalendar from dashboard exports in SA.md

## Why
SA.md lists `StreakCalendar` as a window export of `js/screens-dashboard.jsx`, but the
component is internal-only. The bottom of the file assigns only `DashboardScreen`,
`CoachChat`, and `CatchUpBanner` to `window`. `StreakCalendar` is used exclusively
inside `DashboardScreen` and is never exposed globally.

## What Changes
Remove `StreakCalendar` from the `js/screens-dashboard.jsx` row in the Screen Components
table.

## Capabilities
- SA.md no longer misleads developers into looking for `window.StreakCalendar`.

## Impact
- Modified file: `docs/SA.md` (one table row updated)
- No code changes.
