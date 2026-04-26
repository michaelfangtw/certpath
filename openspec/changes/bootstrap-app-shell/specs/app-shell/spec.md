## ADDED Requirements

### Requirement: Vite Build

The project must build with `vite build` producing a static SPA bundle deployable to Vercel.

#### Scenario: Production build succeeds

- **WHEN** `pnpm build` is run
- **THEN** a `dist/` directory is produced with `index.html` and hashed JS/CSS assets
- **AND** no TypeScript errors are emitted

#### Scenario: Dev server starts

- **WHEN** `pnpm dev` is run
- **THEN** the dev server starts at `localhost:5173` with HMR enabled

---

### Requirement: Design Token Import

All UI values must derive from `project/styles/tokens.css` via a single global import.

#### Scenario: CSS custom properties available

- **WHEN** any component renders
- **THEN** CSS custom properties from `tokens.css` (e.g., `--color-primary`, `--space-4`) are resolvable
- **AND** no hardcoded hex colors or pixel values appear in `src/` component files

---

### Requirement: Route Structure

All 9 screens must have registered routes; unmatched paths redirect to `/`.

#### Scenario: All screen routes resolve

- **WHEN** the user navigates to any of the 9 screen paths
- **THEN** the corresponding screen placeholder component renders without a crash
- **AND** the active route is reflected in the URL bar

Routes (kebab-case paths):
- `/` — Dashboard
- `/path` — Learning Path
- `/games` — Game Hub
- `/games/word-match` — Word Match
- `/games/sound-pop` — Sound Pop
- `/games/word-order` — Word Order
- `/ai` — AI Conversation
- `/leaderboard` — Leaderboard
- `/shop` — Reward Shop

#### Scenario: Unmatched path redirects

- **WHEN** the user navigates to an unknown path
- **THEN** they are redirected to `/`

---

### Requirement: Auth Context

A React context exposes the current Supabase session and a `signInWithGoogle` / `signOut` function.

#### Scenario: Unauthenticated user sees sign-in

- **WHEN** an unauthenticated user visits any protected route
- **THEN** they are redirected to `/login`
- **AND** a "Sign in with Google" button is visible

#### Scenario: Authenticated user bypasses login

- **WHEN** an authenticated user visits `/login`
- **THEN** they are redirected to `/`

#### Scenario: Sign-out clears session

- **WHEN** `signOut()` is called
- **THEN** the Supabase session is null
- **AND** the user is redirected to `/login`

---

### Requirement: Dev Tweaks Panel

A dev-only overlay for fast persona switching and screen navigation.

#### Scenario: Panel visible in development

- **WHEN** `import.meta.env.DEV` is true
- **THEN** the tweaks panel renders as a floating overlay
- **AND** persona switching (beginner / intermediate / advanced) works without a full page reload

#### Scenario: Panel hidden in production

- **WHEN** `import.meta.env.DEV` is false (production build)
- **THEN** the tweaks panel component is not rendered (tree-shaken)

---

### Requirement: Test Scaffold

Vitest + React Testing Library must be configured with an 80% coverage gate.

#### Scenario: Tests pass on scaffold

- **WHEN** `pnpm test` is run on the bootstrapped shell
- **THEN** all tests pass
- **AND** coverage ≥ 80% on `src/` files

#### Scenario: Coverage gate enforced

- **WHEN** `pnpm test:coverage` is run
- **THEN** the command exits non-zero if statement/branch/function coverage drops below 80%
