# Proposal: Dashboard shows real logged-in user data from Supabase

## Problem
`DashboardScreen` always receives `DEMO_TIERS[demoTier]` as the `demo` prop —
hardcoded mock data for "Angela", "Eric", or "Mei-Lin". Real user profile,
points, streak, and scores from Supabase `user_profiles` are never loaded.

## Fix
1. **Add `project/js/supabase-client.jsx`** — a lightweight REST wrapper that
   reads `window.SUPABASE_URL` / `window.SUPABASE_ANON_KEY`. Every method
   returns `null` silently if those globals are absent, so the app degrades
   gracefully in local / E2E environments.
2. **Modify `LoginScreen.begin()`** — fire a concurrent `loadSessionProfile()`
   fetch alongside the existing 2.4 s animation. After 2.4 s, merge the
   resolved profile (or fall back to demo defaults) and navigate to dashboard.
3. **Add session-restore `useEffect` in `App`** — on first mount, call
   `loadSessionProfile()` and merge any stored Supabase session into `demo`
   state so refreshing the page keeps the real user visible.

## Supabase `user_profiles` columns used
| column | demo field |
|---|---|
| `display_name` / `first_name` | `name` / `firstName` / `avatar` |
| `points` | `points` |
| `streak` | `streak` |
| `accuracy` | `accuracy` |
| `predicted_score` | `predicted` |
| `listening_score` | `listening` |
| `reading_score` | `reading` |
| `radar` | `radar` |
| `tier` | `tier` |
| `completed` | `completed` |

## Backward compatibility
- No Supabase credentials → all fetch calls return `null` → demo data used as before.
- E2E tests unaffected (no Supabase configured, `loadSessionProfile` resolves to
  `null` synchronously, 2.4 s navigation timing preserved).
