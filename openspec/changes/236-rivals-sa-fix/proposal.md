# Proposal: Remove non-existent RIVALS from SA.md data.jsx row (issue #236)

## Problem
SA.md lists `RIVALS` as a window-exported symbol of `js/data.jsx`, but `RIVALS` does not
exist anywhere in the codebase. The actual `Object.assign` in data.jsx does not include it.

## Fix
Remove `RIVALS` from the `js/data.jsx` window-exports row in SA.md.
Also corrects `findRival` attribution (see #237) and adds missing `APP_VERSION` (see #238)
since all three errors are on the same table row.
