# System Architecture

> CertPath — TOEIC Golden Certificate gamified learning prototype.
> This document describes the front-end prototype under `project/`.

---

## Tech Stack (Prototype)

| Layer | Choice |
|-------|--------|
| UI | React 18 (UMD via CDN) + Babel standalone transpiler |
| Styling | CSS custom properties (`project/styles/tokens.css`) |
| Data | Static in-memory mock data (`js/data.jsx`) |
| Dev overlay | `tweaks-panel.jsx` — floating Tweaks panel |

---

## Directory Structure

```
project/
├── TOEIC Golden Certs.html      ← single-page app entry point
├── tweaks-panel.jsx             ← dev Tweaks panel shell
├── styles/
│   └── tokens.css               ← CSS design tokens
├── vendor/                      ← local copies of CDN deps — used by Playwright for offline test mocking only (NOT loaded at runtime)
│   ├── babel.min.js             ← mirrors unpkg.com/@babel/standalone@7.29.0/babel.min.js
│   ├── react.development.js     ← mirrors unpkg.com/react@18.3.1/umd/react.development.js
│   └── react-dom.development.js ← mirrors unpkg.com/react-dom@18.3.1/umd/react-dom.development.js
├── export/                      ← export snapshot for sharing / offline use
│   ├── TOEIC Golden Certs.html  ← self-contained entry point
│   └── src/                     ← source files bundled with the export snapshot
│       ├── TOEIC Golden Certs.html
│       ├── tweaks-panel.jsx
│       ├── styles/
│       │   └── tokens.css
│       └── js/                  ← subset of js/ files included in export
└── js/
    ├── supabase-client.jsx      ← Supabase REST wrapper; exports window.supabaseClient
    ├── data.jsx                 ← mock data + helper functions
    ├── primitives.jsx           ← shared UI atoms
    ├── shell.jsx                ← Navbar, audio player, modals
    ├── cute-style.jsx           ← Leo mascot + cute-mode CSS
    ├── screens-landing.jsx      ← Landing + Login screens
    ├── screens-diagnostic.jsx   ← Diagnostic flow + RadarChart
    ├── screens-dashboard.jsx    ← Student dashboard
    ├── screens-practice.jsx     ← Practice center + Quiz runner
    ├── screens-extras.jsx       ← Leaderboard + Shop
    ├── screens-ai-conversation.jsx  ← AI conversation practice
    ├── screens-behind-alert.jsx ← Behind-schedule alert overlay
    ├── screens-games.jsx        ← Game hub + 3 mini-games
    ├── screens-path.jsx         ← Learning path tree
    ├── screens-shadowing.jsx    ← Shadowing practice
    └── screens-daily-quest.jsx  ← Daily vocab quest
docs/
└── SA.md                        ← this file
openspec/
├── config.yaml
└── changes/                     ← OpenSpec change proposals
```

---

## Screen Components

Each JSX file is loaded as a `<script type="text/babel">` tag and exports its
public symbols onto `window`.

| File | Window-exported symbols |
|------|------------------------|
| `js/supabase-client.jsx` | `supabaseClient` (object with methods: `getStoredSession`, `fetchUserProfile`, `mapProfileToDemo`, `loadSessionProfile`, `saveTestSession`, `getTestHistory`, `fetchShopItems`, `startGoogleOAuth`, `parseOAuthCallback`) |
| `tweaks-panel.jsx` | `useTweaks` `TweaksPanel` `TweakSection` `TweakRow` `TweakSlider` `TweakToggle` `TweakRadio` `TweakSelect` `TweakText` `TweakNumber` `TweakColor` `TweakButton` |
| `js/data.jsx` | `DIAGNOSTIC` `SAMPLE_QUIZ` `QUIZ_PARTS` `scaleListening` `scaleReading` `DEMO_TIERS` `LEADERBOARD` `COACH_GREETINGS` `APP_VERSION` |
| `js/primitives.jsx` | `Icon` `Logo` `Eyebrow` `Button` `Badge` `PaperCard` `CertBadge` `TIER` `tierFromScore` `useCountUp` |
| `js/shell.jsx` | `Navbar` `PointsFloater` `DailySignInModal` `AudioPlayer` `Part1Photo` — internal (not exported): `ExamTargetModal` (props: `onClose`, `dark`) — modal for setting exam target date, rendered by `Navbar` when `examModalOpen` is true, opened via the `certpath:openExamModal` custom event |
| `js/screens-landing.jsx` | `LandingScreen` `LoginScreen` |
| `js/screens-diagnostic.jsx` | `DiagnosticIntro` `DiagnosticScreen` `DiagnosticResult` `RadarChartAnimated` |
| `js/screens-dashboard.jsx` | `DashboardScreen` `CoachChat` `CatchUpBanner` `SectionHeader` |
| `js/screens-practice.jsx` | `PracticeCenter` `QuizScreen` `QuizResult` |
| `js/screens-extras.jsx` | `LeaderboardScreen` `ShopScreen` |
| `js/screens-ai-conversation.jsx` | `AIConversationCenter` `AIConversationRunner` |
| `js/screens-behind-alert.jsx` | `BehindScheduleAlert` |
| `js/cute-style.jsx` | `LeoMascot` `CuteBgDecor` `LeoFloater` |
| `js/screens-games.jsx` | `GameHub` `WordMatchGame` `SoundPopGame` `WordOrderGame` |
| `js/screens-path.jsx` | `LearningPathScreen` |
| `js/screens-shadowing.jsx` | `ShadowingHub` `ShadowingRunner` |
| `js/screens-daily-quest.jsx` | `DailyQuestGate` `DailyQuestHub` `DailyQuestRunner` |

---

## App State

All state lives in the root `App` component in `TOEIC Golden Certs.html`.

| Variable | Type | Purpose |
|----------|------|---------|
| `tweaks` | object | Dev panel settings via `useTweaks` — `theme`, `certTier`, `demoTier`, `showCoachBadge`, `vibe` |
| `route` | string | Current active screen key (e.g. `'dashboard'`, `'quiz'`) |
| `demo` | object | Active learner profile (points, streak, accuracy, tier, etc.) |
| `diagResult` | object\|null | Diagnostic result; seeds `demo` after first diagnostic |
| `quizResult` | object\|null | Last quiz result; passed to `QuizResult` screen |
| `showSignIn` | boolean | Whether to show the daily sign-in reward modal |
| `pointsFloater` | object\|null | `{ amount, label, key }` for the flying +PTS animation |
| `confetti` | number | Timestamp; non-zero triggers `ConfettiBurst` (component defined inline in `TOEIC Golden Certs.html`, not in any external JSX file) |
| `coachOpen` | boolean | `CoachChat` overlay open/closed |
| `aiScenario` | object\|null | Selected AI conversation scenario; passed to `AIConversationRunner` |
| `shadowingSet` | object\|null | Selected shadowing set; passed to `ShadowingRunner` |
| `showDailyGate` | boolean | Whether the `DailyQuestGate` overlay is visible |
| `behindAlertOpen` | boolean | Whether the `BehindScheduleAlert` overlay is open |
| `scheduleAdjusted` | object\|null | Tracks whether the behind-schedule adjustment has been applied (prevents re-trigger) |
| `activeGame` | string\|null | Key of the currently active mini-game (`'word-match'`, `'sound-pop'`, `'word-order'`) |

---

## Core Functions

| Function | Defined in | Purpose |
|----------|-----------|---------|
| `supabaseClient.loadSessionProfile()` | `js/supabase-client.jsx` | Resolve stored session → fetch Supabase profile → map to demo shape; returns null when unconfigured |
| `supabaseClient.saveTestSession(session)` | `js/supabase-client.jsx` | Persist test session to localStorage and optionally to Supabase `user_test_sessions` |
| `supabaseClient.getTestHistory()` | `js/supabase-client.jsx` | Return array of locally stored test sessions (last 20) |
| `supabaseClient.fetchShopItems()` | `js/supabase-client.jsx` | Fetch shop items from Supabase `shop_items` table; returns null when unconfigured |
| `supabaseClient.startGoogleOAuth()` | `js/supabase-client.jsx` | Redirect to Supabase Google OAuth; returns false when unconfigured |
| `supabaseClient.parseOAuthCallback()` | `js/supabase-client.jsx` | Parse implicit-flow OAuth hash, store session in localStorage, clean URL hash |
| `goNav(route)` | main HTML | Navigate to a screen; triggers daily-gate and sign-in side effects |
| `firePoints(amt, label)` | main HTML | Trigger the flying +PTS floater animation |
| `fireConfetti()` | main HTML | Trigger full-screen confetti burst |
| `claimSignIn()` | main HTML | Claim daily sign-in reward (+10 PTS) and close modal |
| `findRival(myPoints)` | `TOEIC Golden Certs.html` | Pick a random leaderboard entry as rival and return it with a `gap` field (rival.score − myPoints) |
| `scaleListening(correct, total)` | `js/data.jsx` | Scale correct listening answers to TOEIC 0–495 range |
| `scaleReading(correct, total)` | `js/data.jsx` | Scale correct reading answers to TOEIC 0–495 range |
| `tierFromScore(score)` | `js/primitives.jsx` | Map a TOEIC predicted score to tier key (`gold`/`blue`/`green`/`brown`/`orange`) |

---

## Screen Routes

Routes are simulated via the `route` state string; no URL router is used in the prototype.

| Route key | Screen | Component |
|-----------|--------|-----------|
| `landing` | Landing page | `LandingScreen` |
| `login` | Login | `LoginScreen` |
| `diagnostic-intro` | Diagnostic intro | `DiagnosticIntro` |
| `diagnostic` | Diagnostic quiz | `DiagnosticScreen` |
| `diagnostic-result` | Diagnostic results | `DiagnosticResult` |
| `dashboard` | Student dashboard | `DashboardScreen` |
| `practice` | Practice center | `PracticeCenter` |
| `review` | Weak-point review | `PracticeCenter` |
| `quiz` | Quiz runner | `QuizScreen` |
| `quiz-result` | Quiz results | `QuizResult` |
| `leaderboard` | Leaderboard | `LeaderboardScreen` |
| `shop` | Reward shop | `ShopScreen` |
| `ai-conversation` | AI conversation picker | `AIConversationCenter` |
| `ai-conversation-run` | AI conversation session | `AIConversationRunner` |
| `shadowing` | Shadowing hub | `ShadowingHub` |
| `shadowing-run` | Shadowing session | `ShadowingRunner` |
| `daily-quest` | Daily quest hub | `DailyQuestHub` |
| `daily-quest-run` | Daily quest session | `DailyQuestRunner` |
| *(overlay)* | Daily quest gate modal | `DailyQuestGate` — not a route; rendered conditionally via `showDailyGate` state |
| `games` | Game hub | `GameHub` |
| `game-play` | Active mini-game | `WordMatchGame` / `SoundPopGame` / `WordOrderGame` |
| `path` | Learning path tree | `LearningPathScreen` |

---

## Database Schema

All demo data is mock, held in memory via `js/data.jsx` constants. The prototype optionally connects to Supabase when `window.SUPABASE_URL` and `window.SUPABASE_ANON_KEY` are set by the host page. When configured, `js/supabase-client.jsx` accesses the following REST endpoints:

| Table | Used by | Access path | Purpose |
|-------|---------|-------------|---------|
| `user_profiles` | `fetchUserProfile` | `window.supabaseClient` | Read learner profile (points, streak, scores, tier, etc.) |
| `user_test_sessions` | `saveTestSession` | `window.supabaseClient` | Persist completed test session records |
| `shop_items` | `fetchShopItems` / `ShopScreen` fallback | `window.supabaseClient` / `window.supabase` | Read reward shop catalogue |
| `leaderboard_entries` | `LeaderboardMini` (`js/screens-dashboard.jsx`) | `window.supabase` | Read top-5 leaderboard rows — columns: `rank, name, score, tier, avatar, delta` |
| `user_path_progress` | `LearningPathScreen` (`js/screens-path.jsx`) | `window.supabase` | Read per-node completion records — columns: `node_id, completed_at, score, total, accuracy, pts, time, stars, kind, breakdown` |

No Supabase migrations are included in this repository.

### Raw Supabase client (`window.supabase`)

Three components bypass `supabaseClient` and call the Supabase JS SDK client
directly via `window.supabase`:

| Component | File | Table queried |
|-----------|------|--------------|
| `LeaderboardMini` | `js/screens-dashboard.jsx` | `leaderboard_entries` |
| `ShopScreen` (fallback path) | `js/screens-extras.jsx` | `shop_items` |
| `LearningPathScreen` | `js/screens-path.jsx` | `user_path_progress` |

`window.supabase` is the raw `@supabase/supabase-js` SDK client (normally created
via `createClient()`), distinct from the custom REST wrapper `window.supabaseClient`
exported by `js/supabase-client.jsx`. **`window.supabase` is never initialized
anywhere in this repository** — there is no Supabase JS SDK `<script>` tag, no
`createClient()` call, and no `window.supabase = …` assignment. All three usages
guard against this with `if (!sb) return`, so they silently fall back to mock/local
data in every current environment (local dev, E2E, and Vercel preview).

## API Endpoints

None — this is a static HTML prototype with no server-side API. Planned for Phase B: `api/coach.js` (Claude API proxy) and `api/config.js`.
