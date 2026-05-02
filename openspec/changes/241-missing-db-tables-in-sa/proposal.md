# Proposal: Add leaderboard_entries and user_path_progress to SA.md (issue #241)

## Problem

SA.md's Database Schema section only lists three Supabase tables
(`user_profiles`, `user_test_sessions`, `shop_items`), all accessed via the
custom REST wrapper `window.supabaseClient`. Two additional tables queried
directly via `window.supabase` (the raw Supabase JS SDK client) are missing:

| Table | Component | File |
|-------|-----------|------|
| `leaderboard_entries` | `LeaderboardMini` | `js/screens-dashboard.jsx` |
| `user_path_progress` | `LearningPathScreen` | `js/screens-path.jsx` |

## Fix

Add both tables to the Database Schema table in SA.md, noting the columns
selected and the accessing component. Because both tables are accessed via
`window.supabase` (never initialized in this repo), annotate them accordingly
so readers cross-reference the `window.supabase` subsection added in #240.
