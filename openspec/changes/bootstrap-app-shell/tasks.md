## 1. Project scaffold

- [ ] 1.1 Run `pnpm create vite@latest . -- --template react-ts` in project root (merge into existing `package.json`)
- [ ] 1.2 Install deps: `react-router-dom`, `@supabase/supabase-js`
- [ ] 1.3 Install dev deps: `vitest`, `@vitest/coverage-v8`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`
- [ ] 1.4 Write `vite.config.ts` with test config (jsdom, coverage thresholds 80%)
- [ ] 1.5 Write `tsconfig.json` (strict: true) and `tsconfig.node.json`
- [ ] 1.6 Write `index.html` (Vite entry, `<div id="root">`)
- [ ] 1.7 Write `vercel.json` (SPA rewrite rule)
- [ ] 1.8 Write `.env.example` with placeholder keys

## 2. Design tokens

- [ ] 2.1 Write `src/index.css` importing `../project/styles/tokens.css` + CSS reset

## 3. Supabase auth

- [ ] 3.1 Write `src/lib/supabase.ts` (`createClient` from env vars)
- [ ] 3.2 Write `src/auth/AuthProvider.tsx` (session context, `signInWithGoogle`, `signOut`)
- [ ] 3.3 Write `src/auth/ProtectedRoute.tsx` (redirect to `/login` if no session)
- [ ] 3.4 Write `src/auth/LoginScreen.tsx` (Google sign-in button)

## 4. Router and screen stubs

- [ ] 4.1 Write `src/router.tsx` with all 9 screen routes + `/login` + catch-all redirect
- [ ] 4.2 Write stub component for each screen (9 files in `src/screens/`)
- [ ] 4.3 Write `src/App.tsx` (AuthProvider + RouterProvider)
- [ ] 4.4 Write `src/main.tsx` (ReactDOM.createRoot)

## 5. Dev tweaks panel

- [ ] 5.1 Write `src/dev/TweaksPanel.tsx` with persona switcher (beginner/intermediate/advanced) and screen nav links
- [ ] 5.2 Mount in `App.tsx` behind `import.meta.env.DEV` guard

## 6. Tests

- [ ] 6.1 Write `src/auth/AuthProvider.test.tsx` (session context, signOut clears session)
- [ ] 6.2 Write `src/auth/ProtectedRoute.test.tsx` (redirects unauthenticated, bypasses for authenticated)
- [ ] 6.3 Write `src/router.test.tsx` (all routes resolve, unknown path redirects)
- [ ] 6.4 Run `pnpm test:coverage` and confirm ≥ 80%

## 7. Verify

- [ ] 7.1 `pnpm build` produces `dist/` with no TS errors
- [ ] 7.2 `pnpm dev` starts without errors
- [ ] 7.3 All screen routes render their stub without crashing (manual smoke test)
