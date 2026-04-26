## Context

The AI conversation feature (FR-9) needs a structured topic system. `docs/life-topics.md` defines 16 topics ordered by difficulty. This change models those topics as TypeScript types and wires them into the conversation screen and daily plan engine contract.

## Goals / Non-Goals

**Goals:**
- Static topic registry typed in TypeScript (no runtime fetching)
- Difficulty-tier grouping matching user band (green/blue/gold → beginner/intermediate/advanced)
- Deterministic daily topic rotation per tier
- Topic switcher UI on the AI conversation screen
- Data contract for daily plan engine (change #6)

**Non-Goals:**
- Actual AI conversation logic (change #11 `add-ai-conversation`)
- Persisting user topic history across sessions
- Generating new topics beyond the 16 defined in `docs/life-topics.md`

## Decisions

### Decision 1: Static `as const` array, not a database table

16 topics is small and curated. A static TypeScript array with `as const` gives full type inference, zero fetch latency, and tree-shaking. No Dexie table needed for Phase A.

### Decision 2: Deterministic daily rotation via date seed

`topicIndex = dayOfYear % tierTopics.length` — same topic for everyone on the same day, advances daily without storing state. No localStorage required.

### Decision 3: Band → tier mapping

| User band (DEMO_TIERS) | Tier |
|------------------------|------|
| `green` | `beginner` |
| `blue` | `intermediate` |
| `gold` | `advanced` (all topics unlocked) |

Gold-tier users see all topics unlocked; others see out-of-band topics as locked with an upgrade tooltip.

### Decision 4: `aiRole` field drives the AI prompt system

Each topic includes `aiRole` (e.g., `'waiter'`, `'interviewer'`, `'doctor'`). Change #11 will use this field to construct the system prompt for the AI tutor. Defining it here establishes the contract early.

## File Structure

```
src/
  lib/
    conversation-topics.ts     # registry + getTopicsByTier + getTopicById
  hooks/
    useConversationTopic.ts    # selection hook (auto + override)
  screens/
    AiConversationScreen.tsx   # consumes hook, renders topic header + switcher
```
