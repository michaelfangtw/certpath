# Proposal: Document window.supabase (issue #240)

## Problem

Three components use `window.supabase` (the raw Supabase JS SDK client) directly,
but SA.md never mentions it. Additionally, `window.supabase` is never initialized
anywhere in the repository — no `createClient()` call, no SDK script tag, no
`window.supabase = …` assignment — making all three usages silently fall back to
mock data in every environment (local, E2E, Vercel preview).

| Component | File | Table |
|-----------|------|-------|
| `LeaderboardMini` | `js/screens-dashboard.jsx` | `leaderboard_entries` |
| `ShopScreen` (fallback) | `js/screens-extras.jsx` | `shop_items` |
| `LearningPathScreen` | `js/screens-path.jsx` | `user_path_progress` |

## Fix

Add a "Raw Supabase client (`window.supabase`)" subsection to the Database Schema
section of SA.md, documenting:

1. The distinction between `window.supabaseClient` (custom REST wrapper) and
   `window.supabase` (Supabase JS SDK client).
2. The three components that reference it and the tables they query.
3. That `window.supabase` is currently never initialized in this repo, so all
   usages fall back silently due to `if (!sb) return` guards.
