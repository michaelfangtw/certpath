# Proposal: Load shop items from Supabase

## Problem
All 8 shop items in `ShopScreen` are hardcoded in a local array and cannot be
managed without a code deploy.

## Fix
1. Add `fetchShopItems()` to `supabase-client.jsx` — reads `shop_items` table
   via Supabase REST, returns `null` if not configured.
2. Extract hardcoded items to a `FALLBACK_SHOP_ITEMS` constant in `screens-extras.jsx`.
3. `ShopScreen` starts with fallback items; a `useEffect` fires on mount to
   fetch remote items and replace the state. No loading spinner — instant render
   with fallback, silent update when remote data arrives.

## Supabase `shop_items` columns expected
| column | type | description |
|---|---|---|
| `id` | int / uuid | unique item id |
| `icon` | text | emoji icon |
| `name` | text | display name |
| `desc` | text | short description |
| `cost` | int | price in PTS |
| `tag` | text | optional badge label |
| `coming_soon` | bool | disables buy button |

## Backward compatibility
When Supabase is not configured, `fetchShopItems()` returns `null` and the
fallback hardcoded items are used — no change in behaviour for local/E2E use.
