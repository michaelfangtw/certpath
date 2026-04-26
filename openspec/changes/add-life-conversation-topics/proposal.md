## Why

FR-9 (AI Conversation) requires a structured topic bank for role-play sessions, but the original spec only referenced unstructured greetings. The `docs/life-topics.pdf` source provides 16 real-world conversation scenarios that must be modelled as a typed, difficulty-tiered topic registry so the daily plan engine can assign appropriate topics per user band.

## What Changes

- Add `docs/life-topics.md` as the canonical topic registry (already written, needs to be consumed by the app)
- Define a `ConversationTopic` data type with id, zh-TW label, EN label, scenario description, difficulty tier, and AI role
- Implement the topic registry as static data in `src/lib/conversation-topics.ts` (16 entries)
- Add topic-selection logic to the AI conversation screen: pick topic by user tier (beginner / intermediate / advanced)
- Expose a `useConversationTopic` hook that returns today's assigned topic or a user-selected override
- Integrate with the daily plan engine (FR-2): when task kind is `conversation`, the engine attaches a topic id matching the user's difficulty band

## Capabilities

### New Capabilities

- `conversation-topics`: Typed topic registry with 16 entries, difficulty tiers, AI roles, and key phrases; topic-selection logic tied to user band

### Modified Capabilities

<!-- none — ai-conversation capability does not have a spec yet; this change creates it from scratch -->

## Impact

- `src/lib/conversation-topics.ts`: new file (topic registry)
- `src/hooks/useConversationTopic.ts`: new hook
- `src/screens/AiConversationScreen.tsx`: consumes topic registry
- `docs/life-topics.md`: source of truth (already exists, read-only for implementation)
- Daily plan engine (change #6 `add-daily-plan-engine`): will read `conversation-topics` to attach topic id to conversation tasks — this change defines the data contract that change #6 must satisfy
