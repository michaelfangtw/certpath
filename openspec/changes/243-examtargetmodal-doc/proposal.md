# Proposal: Document ExamTargetModal in SA.md (issue #243)

## Problem

`project/js/shell.jsx` defines `ExamTargetModal` (lines 4-37) — a modal dialog
for setting the learner's exam target date. It is an internal component (not
exported to `window`), rendered by `Navbar` when `examModalOpen` state is true,
and opens in response to the `certpath:openExamModal` custom event.

SA.md's Screen Components table only lists the window-exported symbols for
`shell.jsx` (`Navbar`, `PointsFloater`, `DailySignInModal`, `AudioPlayer`,
`Part1Photo`). `ExamTargetModal` is entirely absent.

## Fix

Extend the `shell.jsx` row in the Screen Components table to note the internal
component `ExamTargetModal` with its props (`onClose`, `dark`) and brief purpose.
