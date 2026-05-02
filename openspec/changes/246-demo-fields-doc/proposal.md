# Proposal: Document missing demo fields in SA.md App State table (issue #246)

## Problem

SA.md's App State table describes `demo` as:
> Active learner profile (points, streak, accuracy, tier, etc.)

But the `App` component initialises `demo` with four undocumented fields:

- `firstName` — first name portion of the learner's display name
- `avatar` — single-character avatar initial
- `completedToday` — daily quest completions today (number); hydrated from
  localStorage key `certpath_daily_completed` (`{ date, count }`)
- `gamesCompletedToday` — mini-game completions today (number); hydrated from
  localStorage key `certpath_games_completed` (`{ date, count }`)

## Fix

Expand the `demo` row in the App State table to enumerate all these fields and
their localStorage persistence keys.
