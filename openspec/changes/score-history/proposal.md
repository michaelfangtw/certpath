# Proposal: User simulation test history & TOEIC score calculation

## Changes
1. `supabase-client.jsx` — `saveTestSession()` persists to localStorage (always) and Supabase REST (when configured). `getTestHistory()` reads the local store.
2. `screens-diagnostic.jsx` — `DiagnosticResult` calls `saveTestSession()` on mount with listening/reading raw and scaled scores + total.
3. `screens-dashboard.jsx` — New `ScoreHistoryCard` component reads history, renders a sparkline SVG trend and latest L/R/Total breakdown. Hidden when no sessions exist (new users).

## Data shape stored per session
```json
{ "id": "1234567890", "completed_at": "ISO", "type": "diagnostic",
  "listening_raw": 6, "reading_raw": 7, "listening_scaled": 426, "reading_scaled": 431, "total_score": 857 }
```

## Supabase table required (when configured)
```sql
user_test_sessions (id, user_id, completed_at, type, listening_raw, reading_raw, listening_scaled, reading_scaled, total_score, answers jsonb)
```
