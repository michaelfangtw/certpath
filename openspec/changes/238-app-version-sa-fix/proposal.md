# Proposal: Add APP_VERSION to SA.md data.jsx window-exports row (issue #238)

## Problem
`js/data.jsx` exports `APP_VERSION` to `window` via `Object.assign`, but it is missing
from the window-exported symbols table in SA.md.

## Fix
Add `APP_VERSION` to the `js/data.jsx` row in the window-exports table.
