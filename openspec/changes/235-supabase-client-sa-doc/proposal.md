# Proposal: Document supabase-client.jsx in SA.md (issue #235)

## Problem
`project/js/supabase-client.jsx` is loaded as the first `<script type="text/babel">` tag
in `TOEIC Golden Certs.html` and exports `window.supabaseClient`, but is completely absent
from `docs/SA.md` — missing from the directory structure, Screen Components table, and Core
Functions table.

## Changes to docs/SA.md
1. Add `supabase-client.jsx` to the Directory Structure listing (first entry under `js/`).
2. Add a row for `js/supabase-client.jsx` to the Screen Components window-exports table.
3. Add `supabaseClient.*` methods to the Core Functions table.
4. Update the Database Schema note to mention optional Supabase REST connectivity.
