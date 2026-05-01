# Proposal: Fix findRival attribution and signature in SA.md (issue #237)

## Problem
SA.md has two errors about `findRival`:
1. Window-exports table incorrectly attributes it to `js/data.jsx` (it's a useCallback in main HTML, not exported to window).
2. Core Functions table shows wrong signature `findRival(myPoints, myRank)` and wrong description.

## Fix
1. Remove `findRival` from the `js/data.jsx` window-exports row.
2. Update Core Functions table: correct file to `TOEIC Golden Certs.html`, signature to `findRival(myPoints)`, and description to reflect random rival selection.
