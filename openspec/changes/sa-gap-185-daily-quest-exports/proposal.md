# Proposal: Add screens-daily-quest.jsx to SA.md exports table (closes #185)

## Problem
`js/screens-daily-quest.jsx` was listed in the directory tree but had no row in the
window-exported symbols table. `DailyQuestGate` was also undocumented as an overlay.

## Fix
1. Added row to window-exported symbols table for `js/screens-daily-quest.jsx`.
2. Added overlay note for `DailyQuestGate` in the Screen Routes table.
