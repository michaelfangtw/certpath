## Why

The codebase currently consists of prototype `.jsx` files with no build system, routing, or auth wiring. Before any feature can be built and tested, the project needs a proper React + Vite SPA shell with Google OAuth (via Supabase Auth), a route structure for all 9 screens, and the design-token CSS imported as the single source of style truth.

## What Changes

- Initialize a Vite + React + TypeScript project under `src/`
- Configure `react-router-dom` with placeholder routes for all 9 screens
- Integrate Supabase Auth with Google OAuth (protected-route wrapper)
- Import `project/styles/tokens.css` as global tokens (no hardcoded values)
- Port the dev tweaks panel as a dev-only overlay
- Add Vitest + React Testing Library scaffold (80% coverage gate)
- Configure Vercel deployment (`vercel.json` SPA rewrite)

## Capabilities

### New Capabilities

- `app-shell`: Root layout, router, auth context, protected routes, and dev tweaks overlay

### Modified Capabilities

<!-- none — greenfield -->

## Impact

- Creates `src/` directory tree (new)
- Creates `vite.config.ts`, `tsconfig.json`, `index.html` (new)
- Creates `vercel.json` (new)
- Updates `package.json` with Vite, React, Supabase, react-router-dom, Vitest deps
- `project/` prototype directory remains untouched (reference only)
