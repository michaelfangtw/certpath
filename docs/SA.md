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
└── js/
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
| `tweaks-panel.jsx` | `useTweaks` `TweaksPanel` `TweakSection` `TweakRow` `TweakSlider` `TweakToggle` `TweakRadio` `TweakSelect` `TweakText` `TweakNumber` `TweakColor` `TweakButton` |
| `js/data.jsx` | `DIAGNOSTIC` `SAMPLE_QUIZ` `QUIZ_PARTS` `scaleListening` `scaleReading` `DEMO_TIERS` `LEADERBOARD` `COACH_GREETINGS` `RIVALS` `findRival` |
| `js/primitives.jsx` | `Button` `PaperCard` `Icon` `Badge` `Eyebrow` `useCountUp` `TIER` |
| `js/shell.jsx` | `Navbar` `PointsFloater` `DailySignInModal` `AudioPlayer` `Part1Photo` |
| `js/screens-landing.jsx` | `LandingScreen` `LoginScreen` |
| `js/screens-diagnostic.jsx` | `DiagnosticIntro` `DiagnosticScreen` `DiagnosticResult` `RadarChartAnimated` |
| `js/screens-dashboard.jsx` | `DashboardScreen` `CatchUpBanner` `CoachChat` `SectionHeader` `StreakCalendar` |
| `js/screens-practice.jsx` | `PracticeCenter` `QuizScreen` `QuizResult` |
| `js/screens-extras.jsx` | `LeaderboardScreen` `ShopScreen` |
| `js/screens-ai-conversation.jsx` | `AIConversationCenter` `AIConversationRunner` |
| `js/screens-behind-alert.jsx` | `BehindScheduleAlert` |
| `js/cute-style.jsx` | `CuteBgDecor` `LeoFloater` |
| `js/screens-games.jsx` | `GameHub` `WordMatchGame` `SoundPopGame` `WordOrderGame` |
| `js/screens-path.jsx` | `LearningPathScreen` |

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
| `confetti` | number | Timestamp; non-zero triggers `ConfettiBurst` |
| `coachOpen` | boolean | `CoachChat` overlay open/closed |

---

## Core Functions

| Function | Defined in | Purpose |
|----------|-----------|---------|
| `goNav(route)` | main HTML | Navigate to a screen; triggers daily-gate and sign-in side effects |
| `firePoints(amt, label)` | main HTML | Trigger the flying +PTS floater animation |
| `fireConfetti()` | main HTML | Trigger full-screen confetti burst |
| `claimSignIn()` | main HTML | Claim daily sign-in reward (+10 PTS) and close modal |
| `findRival(myPoints, myRank)` | `js/data.jsx` | Return closest leaderboard rival above user with point gap |
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
| `games` | Game hub | `GameHub` |
| `game-play` | Active mini-game | `WordMatchGame` / `SoundPopGame` / `WordOrderGame` |
| `path` | Learning path tree | `LearningPathScreen` |

---

## Database Schema

None — this is a static HTML prototype. All data is mock, held in memory via `js/data.jsx` constants. No Supabase migrations exist yet.

## API Endpoints

None — this is a static HTML prototype with no server-side API. Planned for Phase B: `api/coach.js` (Claude API proxy) and `api/config.js`.
