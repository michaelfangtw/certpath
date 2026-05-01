# Proposal: Real Google OAuth via Supabase

## Strategy
Two-mode login:
- **Configured** (`SUPABASE_URL` + `SUPABASE_ANON_KEY` set on window): `begin()` calls
  `startGoogleOAuth()` which redirects to `${SUPABASE_URL}/auth/v1/authorize?provider=google`.
  After Google login, Supabase redirects back with `#access_token=...` in the hash.
  A mount-time `useEffect` in `App` calls `parseOAuthCallback()` to parse the session,
  stores it in localStorage, fetches the user profile, and navigates to dashboard.
- **Not configured** (local / E2E): `startGoogleOAuth()` returns `false`, the existing
  2.4 s mock animation runs unchanged → E2E tests are unaffected.

## New functions in `supabase-client.jsx`
- `startGoogleOAuth()` — builds the OAuth URL and redirects; returns `false` if not configured.
- `parseOAuthCallback()` — parses `#access_token` from the URL hash, decodes the JWT
  user payload, stores the session under the Supabase localStorage key, cleans the hash,
  and returns the session; returns `null` if no callback params present.

## Changes
1. `project/js/supabase-client.jsx` — add `startGoogleOAuth`, `parseOAuthCallback`.
2. `project/js/screens-landing.jsx` — `begin()` tries `startGoogleOAuth()` first.
3. `project/TOEIC Golden Certs.html` — add OAuth-callback `useEffect` in `App`.
