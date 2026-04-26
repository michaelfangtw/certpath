## ADDED Requirements

### Requirement: Topic Registry

The system must maintain a static registry of 16 conversation topics sourced from `docs/life-topics.md`.

Each topic entry must include:
- `id`: unique kebab-case identifier (e.g., `roommate-daily`)
- `labelZh`: zh-TW display name (e.g., `室友日常`)
- `labelEn`: English name (e.g., `Roommate / Family Chat`)
- `scenario`: one-line situation description
- `tier`: `'beginner' | 'intermediate' | 'advanced'`
- `aiRole`: the role the AI plays in the conversation (e.g., `roommate`, `waiter`, `interviewer`)
- `keyPhrases`: string[] — 4–6 representative phrases from `docs/life-topics.md`

#### Scenario: All 16 topics present

- **WHEN** the topic registry is imported
- **THEN** it contains exactly 16 entries
- **AND** each entry has all required fields non-empty
- **AND** tier distribution is: 5 beginner, 7 intermediate, 4 advanced

#### Scenario: Topics are immutable at runtime

- **WHEN** the registry is accessed
- **THEN** it is a readonly array (TypeScript `as const` or `Readonly<>`)
- **AND** no entry can be mutated by consuming code

---

### Requirement: Difficulty Tier Mapping

Topics must be grouped by difficulty tier matching the user's current band.

Tier assignments (from `docs/life-topics.md`):

**Beginner (🟢)**
1. `roommate-daily` — 室友日常
2. `weekend-plans` — 週末怎麼約
3. `office-gossip` — 茶水間八卦
4. `ordering-food` — 今天吃什麼
5. `shopping` — 買買買

**Intermediate (🟡)**
6. `meeting-people` — 嗨，你好！
7. `small-talk` — 陌生人也能聊
8. `humor-banter` — 會說笑就是贏
9. `emotional-support` — 陪你說說話
10. `home-maintenance` — 房子壞了怎麼辦
11. `customer-complaint` — 投訴有門
12. `travel-hotel` — 出發去旅行

**Advanced (🔴)**
13. `health-medical` — 我不舒服
14. `job-interview` — 面試不緊張
15. `current-events` — 聊聊最近怎麼了
16. `values-debate` — 說說你的想法

#### Scenario: Filter by tier

- **WHEN** `getTopicsByTier('beginner')` is called
- **THEN** exactly 5 topics are returned
- **AND** all returned topics have `tier === 'beginner'`

---

### Requirement: Topic Selection Hook

A `useConversationTopic` hook selects today's topic for the current user session.

#### Scenario: Auto-select by user band

- **WHEN** the hook is called with no override
- **THEN** it returns a topic whose `tier` matches the user's current band (`green` → `beginner`, `blue` → `intermediate`, `gold` → `advanced`)
- **AND** the same topic is returned for the same calendar day (deterministic daily rotation)

#### Scenario: User manually overrides topic

- **WHEN** the user selects a different topic from the topic list UI
- **THEN** `useConversationTopic` returns the selected topic for the rest of the session
- **AND** the override does not persist beyond the session (no localStorage write)

#### Scenario: Daily rotation

- **WHEN** the date changes (new calendar day)
- **THEN** the auto-selected topic advances to the next topic in the tier list (round-robin)

---

### Requirement: AI Conversation Screen Integration

The AI Conversation screen must display the active topic and allow the user to browse and switch topics.

#### Scenario: Topic displayed on screen entry

- **WHEN** the user opens the AI Conversation screen
- **THEN** the current topic's `labelZh`, `labelEn`, and `scenario` are visible
- **AND** the AI's opening line references the topic scenario

#### Scenario: Topic switcher accessible

- **WHEN** the user taps "換個主題" (change topic)
- **THEN** a topic list grouped by tier is shown (beginner / intermediate / advanced sections)
- **AND** topics outside the user's band are visible but marked as locked (gold-tier users see all unlocked)

#### Scenario: Locked topic selected

- **WHEN** a user below the required band taps a locked topic
- **THEN** a tooltip shows "解鎖需達到 [tier] 等級"
- **AND** the topic is not started

---

### Requirement: Daily Plan Engine Contract

When the daily plan engine (change #6) assigns a `conversation` task, it must attach a `topicId`.

#### Scenario: Plan engine attaches topic id

- **WHEN** a `DailyPlan` task of kind `conversation` is generated
- **THEN** the task object includes `topicId: string` referencing a valid entry in the registry
- **AND** the `topicId` matches a topic whose `tier` is appropriate for the user's current band

#### Scenario: Topic id resolves in registry

- **WHEN** `getTopicById(topicId)` is called with a plan-assigned id
- **THEN** it returns the full `ConversationTopic` object
- **AND** never returns `undefined` for a valid plan-generated id
