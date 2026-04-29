# Fix: Daily Quest option order reshuffles on every click (closes #172)

## Problem
In `ReadQ` and `ListenQ`, `opts` is computed inline on every render using `Math.random()`.
Any state update (e.g. `setSel`) triggers a re-render and a new shuffle, causing visible reshuffling before submit.

## Fix
Add `useMemo` to the React destructure at the top of the file, then wrap `opts` in
`useMemo(..., [vocab.id])` in both `ReadQ` and `ListenQ`.

## Files changed
- `project/js/screens-daily-quest.jsx`
