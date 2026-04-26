## 1. Topic registry

- [ ] 1.1 Define `ConversationTopic` TypeScript type in `src/lib/conversation-topics.ts` (id, labelZh, labelEn, scenario, tier, aiRole, keyPhrases)
- [ ] 1.2 Implement all 16 topic entries as a readonly `CONVERSATION_TOPICS` array (`as const`), ordered beginner → intermediate → advanced per `docs/life-topics.md`
- [ ] 1.3 Implement `getTopicsByTier(tier)` — filters registry by tier, returns readonly array
- [ ] 1.4 Implement `getTopicById(id)` — returns topic or throws if id not found

## 2. Topic selection hook

- [ ] 2.1 Write `src/hooks/useConversationTopic.ts`
- [ ] 2.2 Implement band → tier mapping (`green` → `beginner`, `blue` → `intermediate`, `gold` → `advanced`)
- [ ] 2.3 Implement deterministic daily rotation: `dayOfYear % tierTopics.length`
- [ ] 2.4 Implement session-scoped override via `useState` (no localStorage)
- [ ] 2.5 Export `{ topic, setTopic }` from hook

## 3. AI Conversation screen

- [ ] 3.1 Update `src/screens/AiConversationScreen.tsx` to consume `useConversationTopic`
- [ ] 3.2 Render topic header: `labelZh` (large), `labelEn` (small), `scenario` (subtitle)
- [ ] 3.3 Add "換個主題" button that opens topic switcher sheet
- [ ] 3.4 Implement topic switcher: grouped list (🟢 / 🟡 / 🔴 sections), locked state for out-of-band topics
- [ ] 3.5 Render locked tooltip: `解鎖需達到 [tier] 等級` on tap of locked topic

## 4. Daily plan engine contract

- [ ] 4.1 Export `ConversationTopicId` type (union of all valid topic ids) from `conversation-topics.ts`
- [ ] 4.2 Add `topicId?: ConversationTopicId` field to the `Task` type (in `src/lib/types.ts` or equivalent)
- [ ] 4.3 Document contract in `src/lib/conversation-topics.ts` JSDoc: plan engine must set `topicId` for tasks of kind `conversation`

## 5. Tests

- [ ] 5.1 `src/lib/conversation-topics.test.ts`: assert registry has 16 entries, correct tier counts (5/7/4), all fields non-empty
- [ ] 5.2 `src/lib/conversation-topics.test.ts`: assert `getTopicsByTier` returns correct subsets
- [ ] 5.3 `src/lib/conversation-topics.test.ts`: assert `getTopicById` returns correct topic and throws on invalid id
- [ ] 5.4 `src/hooks/useConversationTopic.test.ts`: assert auto-selection matches band, same topic returned same day, advances next day
- [ ] 5.5 `src/hooks/useConversationTopic.test.ts`: assert override replaces auto-selected topic for session
- [ ] 5.6 Run `pnpm test:coverage` — confirm ≥ 80%

## 6. Verify

- [ ] 6.1 AI Conversation screen renders topic header without crash for all 3 demo personas (Eric/Mei-Lin/Angela)
- [ ] 6.2 Topic switcher opens, shows correct locked/unlocked states per band
- [ ] 6.3 Selecting an unlocked topic updates the displayed topic immediately
- [ ] 6.4 TypeScript build passes with no errors (`pnpm build`)
