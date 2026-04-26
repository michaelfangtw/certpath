## Context

The project has a working HTML/JSX prototype in `project/` but no build system or module graph. This change bootstraps a production-grade React + Vite SPA from scratch alongside the prototype (which remains untouched as a visual reference).

## Goals / Non-Goals

**Goals:**
- Working `pnpm dev` / `pnpm build` cycle
- All 9 screen routes registered (stubs OK)
- Google OAuth via Supabase Auth with protected-route wrapper
- Design tokens imported globally from `project/styles/tokens.css`
- Dev tweaks panel ported as dev-only overlay
- Vitest + RTL scaffold, 80% coverage gate

**Non-Goals:**
- Porting any screen content beyond stubs (that's changes #2–#14)
- Backend/Supabase database setup (just Auth for now)
- E2E tests (added once screens have content)

## Decisions

### Decision 1: pnpm as package manager

Vite projects pair naturally with pnpm for fast installs and strict hoisting. All scripts use `pnpm`.

### Decision 2: TypeScript strict mode

`tsconfig.json` uses `strict: true`. The `.jsx` prototypes are reference-only; all `src/` files are `.tsx`.

### Decision 3: Supabase Auth (not Firebase/Clerk)

Chosen because Supabase Auth handles Google OAuth on the free tier and Phase B will add Supabase Postgres for sync — single provider, no migration. Credentials stored in `.env.local` (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).

### Decision 4: react-router-dom v6 (data router)

`createBrowserRouter` with `RouterProvider` is the modern v6 pattern. Enables future data loaders when the plan engine (change #6) needs async data.

### Decision 5: Tokens via CSS @import, not Tailwind

The prototype's `tokens.css` uses CSS custom properties. Importing it globally in `src/index.css` means zero conversion cost and exact visual parity. Tailwind can be added later as a utility layer if desired.

### Decision 6: Dev tweaks panel tree-shaken in production

The panel is wrapped in `{import.meta.env.DEV && <TweaksPanel />}`. Vite replaces `import.meta.env.DEV` with `false` in production builds, so the module is dead-code-eliminated by the bundler.

## File Tree (target)

```
src/
  main.tsx              # Vite entry: ReactDOM.createRoot + RouterProvider
  index.css             # @import tokens.css + base reset
  router.tsx            # createBrowserRouter: all 9 routes + /login
  App.tsx               # AuthProvider wrapper + RouterProvider
  auth/
    AuthProvider.tsx    # Supabase session context
    ProtectedRoute.tsx  # redirects unauthenticated users to /login
    LoginScreen.tsx     # Google sign-in button
  screens/
    DashboardScreen.tsx
    LearningPathScreen.tsx
    GameHubScreen.tsx
    WordMatchScreen.tsx
    SoundPopScreen.tsx
    WordOrderScreen.tsx
    AiConversationScreen.tsx
    LeaderboardScreen.tsx
    ShopScreen.tsx
  dev/
    TweaksPanel.tsx     # dev-only persona/screen switcher
  lib/
    supabase.ts         # createClient(url, anonKey)
vite.config.ts
tsconfig.json
tsconfig.node.json
index.html
vercel.json             # rewrites: /* → /index.html
.env.example            # VITE_SUPABASE_URL=, VITE_SUPABASE_ANON_KEY=
```
